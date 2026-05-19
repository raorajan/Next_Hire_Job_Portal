import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCompanies, deleteCompany } from "@/redux/slices/company.slice";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import { FaBuilding, FaGlobe, FaMapMarkerAlt, FaExternalLinkAlt, FaTrash } from "react-icons/fa";
import ConfirmationModal from "../common/ConfirmationModal";

const CompaniesTable = ({ companies: filteredCompanies }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const allCompanies = useSelector((state) => state?.company?.companies);
  const companies = filteredCompanies !== undefined ? filteredCompanies : allCompanies;

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!allCompanies || allCompanies?.length === 0) {
      dispatch(getCompanies())
        .then((res) => {
          if (res?.payload?.status !== 200) {
            toast.error("Failed to fetch companies.");
          }
        })
        .catch(() =>
          toast.error("Something went wrong while fetching companies.")
        );
    }
  }, [dispatch, allCompanies]);

  const handleDeleteClick = (companyId) => {
    setSelectedCompanyId(companyId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedCompanyId) return;
    setDeleting(true);
    dispatch(deleteCompany(selectedCompanyId)).then((res) => {
      setDeleting(false);
      setDeleteModalOpen(false);
      setSelectedCompanyId(null);
      if (res?.type === "company/delete/fulfilled") {
        toast.success("Enterprise decommissioned successfully!");
      } else {
        toast.error("Failed to decommission enterprise.");
      }
    });
  };

  return (
    <div className='relative z-10'>
      {companies?.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
          {companies?.map((company) => (
            <div
              key={company?._id}
              className='group relative bg-[#080C1E]/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,100,220,0.03)] p-6 hover:shadow-[0_0_40px_rgba(0,200,255,0.15)] transition-all duration-500 hover:border-[#00C8FF]/30 flex flex-col h-[460px] overflow-hidden'
            >
              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(company?._id);
                }}
                className="absolute top-4 right-4 z-20 p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100"
                title="Decommission Enterprise"
              >
                <FaTrash className="w-4 h-4" />
              </button>
              {/* Animated Accent */}
              <div className='absolute top-0 right-0 w-32 h-32 bg-[#00C8FF]/5 -mr-16 -mt-16 rounded-full blur-2xl group-hover:bg-[#00C8FF]/10 transition-colors duration-500 pointer-events-none'></div>
              
              <div className='relative z-10 flex flex-col h-full'>
                {/* Header: Logo & Name */}
                <div className='flex flex-col items-center mb-4'>
                  <div className='relative mb-4 group-hover:scale-105 transition-transform duration-500'>
                    <div className="absolute inset-0 bg-[#00C8FF]/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Avatar className='w-20 h-20 border-2 border-white/10 group-hover:border-[#00C8FF]/50 transition-colors shadow-sm relative z-10 rounded-2xl overflow-hidden'>
                      <AvatarImage
                        src={company?.logo?.url}
                        alt={company?.companyName || "Company Logo"}
                        className="object-cover"
                      />
                      <div className="w-full h-full bg-white/5 flex items-center justify-center">
                        <FaBuilding className="text-muted-foreground w-8 h-8 opacity-20" />
                      </div>
                    </Avatar>
                  </div>
                  <h2 className='text-2xl font-black text-center text-white tracking-tight group-hover:text-[#00C8FF] transition-colors line-clamp-1'>
                    {company?.companyName || "Enterprise Identity"}
                  </h2>
                </div>
 
                {/* Body: Description */}
                <div className='flex-grow mb-4 flex items-center justify-center'>
                  <p className='text-muted-foreground text-sm font-medium leading-relaxed italic text-center px-4 line-clamp-2'>
                    "{company?.description || "No corporate statement provided in the registry."}"
                  </p>
                </div>
 
                {/* Metadata: Location & Website */}
                <div className='space-y-3 mb-6 bg-white/5 rounded-2xl p-4 border border-white/5 group-hover:bg-white/10 transition-all duration-300'>
                  <div className='flex items-center justify-between text-xs font-bold gap-4'>
                    <div className="flex items-center gap-2 text-muted-foreground shrink-0">
                      <FaMapMarkerAlt className="w-3 h-3 text-[#00C8FF]" />
                      <span className='uppercase tracking-widest text-[9px]'>Node Location</span>
                    </div>
                    <span className="text-white truncate max-w-[160px]" title={company?.location || "Not specified"}>
                      {company?.location || "Not specified"}
                    </span>
                  </div>
                  
                  <div className='flex items-center justify-between text-xs font-bold pt-3 border-t border-white/5 gap-4'>
                    <div className="flex items-center gap-2 text-muted-foreground shrink-0">
                      <FaGlobe className="w-3 h-3 text-[#00C8FF]" />
                      <span className='uppercase tracking-widest text-[9px]'>Infrastructure</span>
                    </div>
                    {company?.website ? (
                      <a
                        href={company?.website}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-[#00C8FF] hover:text-[#00E5FF] flex items-center gap-1 transition-colors drop-shadow-[0_0_10px_rgba(0,200,255,0.2)]'
                      >
                        Portal <FaExternalLinkAlt className="w-2 h-2" />
                      </a>
                    ) : (
                      <span className='text-red-500/80 uppercase tracking-widest text-[9px]'>Offline</span>
                    )}
                  </div>
                </div>
 
                {/* Footer: Actions */}
                <div className='mt-auto flex gap-4 shrink-0'>
                  <Button
                    variant="outline"
                    className='flex-1 h-12 rounded-xl bg-[#080C1E] border-white/10 hover:border-[#00C8FF]/50 text-muted-foreground hover:text-white font-bold shadow-sm transition-all duration-300'
                    onClick={() =>
                      navigate(`/profile/admin/jobs/${company?._id}`)
                    }
                  >
                    Inventory
                  </Button>
                  <Button
                    className='flex-1 h-12 rounded-xl bg-[#00C8FF] hover:bg-[#00E5FF] text-[#050810] font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(0,200,255,0.2)] hover:shadow-[0_0_30px_rgba(0,200,255,0.4)] hover:scale-[1.02] transition-all duration-300 border-none'
                    onClick={() =>
                      navigate(`/profile/admin/companies/${company?._id}`)
                    }
                  >
                    Configure
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='text-center py-20 bg-[#080C1E]/80 backdrop-blur-xl rounded-3xl border border-white/5 border-dashed shadow-[0_0_50px_rgba(0,100,220,0.03)]'>
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaBuilding className="text-muted-foreground/30 w-10 h-10" />
          </div>
          <p className="text-muted-foreground font-black uppercase tracking-[0.2em] text-xs">Registry Database Empty</p>
          <p className="text-muted-foreground/60 text-sm mt-2 mb-6">Initialize your first enterprise profile to begin.</p>
          <Button
            onClick={() => navigate("/profile/admin/companies/create")}
            className='rounded-xl bg-[#00C8FF] hover:bg-[#00E5FF] text-[#050810] font-black px-6 py-3 shadow-[0_0_20px_rgba(0,200,255,0.3)] hover:shadow-[0_0_30px_rgba(0,200,255,0.5)] transition-all duration-300 border-none'
          >
            Register Enterprise
          </Button>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Decommission Enterprise"
        description="Are you absolutely sure you want to decommission this enterprise? This action cannot be undone and will permanently delete the company profile and purge all registered job postings under it."
        confirmText="Decommission"
        cancelText="Cancel"
        isLoading={deleting}
      />
    </div>
  );
};

export default CompaniesTable;
