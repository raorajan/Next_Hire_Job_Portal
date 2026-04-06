import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCompanies } from "@/redux/slices/company.slice";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import { FaBuilding, FaGlobe, FaMapMarkerAlt, FaExternalLinkAlt } from "react-icons/fa";

const CompaniesTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const companies = useSelector((state) => state?.company?.companies);

  useEffect(() => {
    if (!companies || companies?.length === 0) {
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
  }, [dispatch, companies]);

  return (
    <div className='relative z-10'>
      {companies?.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
          {companies?.map((company) => (
            <div
              key={company?._id}
              className='group relative bg-card backdrop-blur-md rounded-3xl border border-border shadow-custom p-8 hover:shadow-neon-sm transition-all duration-500 hover:border-primary/30 flex flex-col h-[400px] overflow-hidden'
            >
              {/* Animated Accent */}
              <div className='absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500 pointer-events-none'></div>
              
              <div className='relative z-10 flex flex-col h-full'>
                {/* Header: Logo & Name */}
                <div className='flex flex-col items-center mb-6'>
                  <div className='relative mb-4 group-hover:scale-105 transition-transform duration-500'>
                    <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Avatar className='w-20 h-20 border-2 border-border group-hover:border-primary/50 transition-colors shadow-sm relative z-10 rounded-2xl overflow-hidden'>
                      <AvatarImage
                        src={company?.logo?.url}
                        alt={company?.companyName || "Company Logo"}
                        className="object-cover"
                      />
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <FaBuilding className="text-muted-foreground w-8 h-8 opacity-20" />
                      </div>
                    </Avatar>
                  </div>
                  <h2 className='text-2xl font-black text-center text-foreground tracking-tight group-hover:text-primary transition-colors'>
                    {company?.companyName || "Enterprise Identity"}
                  </h2>
                </div>

                {/* Body: Description */}
                <div className='flex-grow mb-6'>
                  <p className='text-muted-foreground text-sm font-medium leading-relaxed italic text-center px-4 line-clamp-3'>
                    "{company?.description || "No corporate statement provided in the registry."}"
                  </p>
                </div>

                {/* Metadata: Location & Website */}
                <div className='space-y-3 mb-8 bg-muted/30 rounded-2xl p-5 border border-border/50 group-hover:bg-muted/50 transition-all duration-300'>
                  <div className='flex items-center justify-between text-xs font-bold'>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <FaMapMarkerAlt className="w-3 h-3 text-primary" />
                      <span className='uppercase tracking-widest text-[9px]'>Node Location</span>
                    </div>
                    <span className="text-foreground">{company?.location || "Not specified"}</span>
                  </div>
                  
                  <div className='flex items-center justify-between text-xs font-bold pt-3 border-t border-border/30'>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <FaGlobe className="w-3 h-3 text-primary" />
                      <span className='uppercase tracking-widest text-[9px]'>Infrastructure</span>
                    </div>
                    {company?.website ? (
                      <a
                        href={company?.website}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-primary hover:text-secondary flex items-center gap-1 transition-colors'
                      >
                        Portal <FaExternalLinkAlt className="w-2 h-2" />
                      </a>
                    ) : (
                      <span className='text-muted-foreground/40 uppercase tracking-widest'>Offline</span>
                    )}
                  </div>
                </div>

                {/* Footer: Actions */}
                <div className='mt-auto flex gap-4'>
                  <Button
                    variant="outline"
                    className='flex-1 h-12 rounded-xl border-border hover:border-primary/50 text-muted-foreground hover:text-primary font-bold shadow-sm transition-all duration-300'
                    onClick={() =>
                      navigate(`/profile/admin/jobs/${company?._id}`)
                    }
                  >
                    Inventory
                  </Button>
                  <Button
                    className='flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest shadow-neon-sm hover:shadow-neon hover:scale-[1.02] transition-all duration-300 border-none'
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
        <div className='text-center py-20 bg-card/40 backdrop-blur-md rounded-3xl border border-border border-dashed'>
          <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaBuilding className="text-muted-foreground/30 w-10 h-10" />
          </div>
          <p className="text-muted-foreground font-black uppercase tracking-[0.2em] text-xs">Registry Database Empty</p>
          <p className="text-muted-foreground/60 text-sm mt-2">Initialize your first enterprise profile to begin.</p>
        </div>
      )}
    </div>
  );
};

export default CompaniesTable;
