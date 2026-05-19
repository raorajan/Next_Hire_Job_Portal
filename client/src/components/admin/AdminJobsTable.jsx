import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Eye, Edit2 } from "lucide-react";
import { MdDelete } from "react-icons/md";
import { useDispatch } from "react-redux";
import { deleteJob } from "@/redux/slices/job.slice";
import { toast } from "react-toastify";
import ConfirmationModal from "../common/ConfirmationModal";

const AdminJobsTable = ({ jobs, onDeleteJob }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteClick = (jobId) => {
    setSelectedJobId(jobId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedJobId) return;
    setDeleting(true);
    dispatch(deleteJob(selectedJobId)).then((res) => {
      setDeleting(false);
      setDeleteModalOpen(false);
      setSelectedJobId(null);
      if (res?.payload?.status === 200) {
        toast.success("Job deleted successfully!");
        onDeleteJob?.(res?.payload?.jobId || selectedJobId);
      } else {
        toast.error("Failed to delete job");
      }
    });
  };

  return (
    <div className='container mx-auto p-6'>
      {jobs?.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
          {jobs?.map((job) => (
            <div
              key={job?._id}
              className='group relative bg-[#080C1E]/80 backdrop-blur-xl border border-white/5 shadow-[0_0_50px_rgba(0,100,220,0.03)] p-8 hover:shadow-[0_0_30px_rgba(0,200,255,0.2)] transform hover:-translate-y-2 transition-all duration-500 ease-in-out flex flex-col justify-between h-[480px] overflow-hidden'
            >
              <div className='absolute inset-0 bg-gradient-to-br from-[#00C8FF]/5 to-[#8040FF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none'></div>
              
              <div className='relative z-10'>
                <div className='flex items-center justify-between mb-6'>
                  <div className='relative'>
                    <div className='absolute inset-0 bg-[#00C8FF]/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
                    <img
                      src={job?.company?.logo?.url || "https://via.placeholder.com/100"}
                      alt={job?.company?.companyName || "Company Logo"}
                      className='w-14 h-14 object-cover rounded-2xl border-2 border-white/5 group-hover:border-[#00C8FF]/50 transition-all duration-500 relative z-10'
                    />
                  </div>
                  <div className='px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-[10px] font-black text-white/60 uppercase tracking-widest'>
                    {job?.createdAt && new Date(job.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <h2 className='text-2xl font-black text-white mb-1 tracking-tight group-hover:text-[#00C8FF] transition-colors duration-300'>
                  {job?.title}
                </h2>
                <p className='text-[#00C8FF] font-extrabold italic text-sm mb-4 drop-shadow-[0_0_10px_rgba(0,200,255,0.2)]'>
                  {job?.company?.companyName || "Unknown Enterprise"}
                </p>
                <p className='text-muted-foreground text-sm mb-6 font-medium leading-relaxed line-clamp-3'>
                  {job?.description}
                </p>

                <div className='space-y-3 bg-white/5 rounded-2xl p-5 border border-white/5 group-hover:bg-white/10 transition-all duration-300'>
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                    <span className='text-muted-foreground'>Location</span>
                    <span className="text-white">{job?.location}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider pt-2 border-t border-white/5">
                    <span className='text-muted-foreground'>Compensation</span>
                    <span className='text-[#00C8FF] italic drop-shadow-[0_0_10px_rgba(0,200,255,0.2)]'>₹{job?.salary?.toLocaleString?.()} LPA</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider pt-2 border-t border-white/5">
                    <span className='text-muted-foreground'>Expertise Level</span>
                    <span className="text-white">{job?.experienceLevel} Years</span>
                  </div>
                </div>
              </div>

              <div className='relative z-10 flex gap-3 pt-6 mt-auto border-t border-white/5'>
                <Button
                  variant='outline'
                  className='flex-1 h-12 rounded-xl bg-[#080C1E] border-white/10 hover:border-[#00C8FF]/50 text-muted-foreground hover:text-white transition-all duration-300'
                  onClick={() => navigate(`/profile/admin/jobs/${job?._id}/applicants`)}
                >
                  <Eye className='w-4 h-4 mr-2' /> Applicants ({job?.applications?.length || 0})
                </Button>

                <div className='flex gap-2 text-white'>
                  <Button
                    variant='outline'
                    className='w-12 h-12 rounded-xl bg-[#080C1E] border-white/10 hover:border-[#00C8FF]/50 text-muted-foreground hover:text-white p-0'
                    onClick={() => navigate(`/profile/admin/jobs/${job?._id}/edit`)}
                  >
                    <Edit2 className='w-4 h-4' />
                  </Button>
                  <Button
                    variant='outline'
                    className='w-12 h-12 rounded-xl bg-[#080C1E] border-white/10 hover:border-red-500/50 text-muted-foreground hover:text-red-400 p-0'
                    onClick={() => handleDeleteClick(job?._id)}
                  >
                    <MdDelete className='w-5 h-5' />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/10 rounded-3xl bg-white/5'>
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-muted-foreground opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h2 className='text-3xl font-black text-white mb-4 tracking-tight italic'>
            Operational Registry Empty
          </h2>
          <p className='text-muted-foreground font-medium mb-8'>Begin by deploying a new opportunity to the platform.</p>
          <Button
            className='bg-[#00C8FF] hover:bg-[#00E5FF] text-[#050810] rounded-xl px-10 py-6 font-extrabold shadow-[0_0_20px_rgba(0,200,255,0.3)] hover:shadow-[0_0_30px_rgba(0,200,255,0.5)] transition-all duration-300 border-none'
            onClick={() => navigate("/profile/admin/jobs/create")}
          >
            Deploy New Role
          </Button>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Job Posting"
        description="Are you sure you want to delete this job posting? This action cannot be undone and will permanently remove this role from the job board."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleting}
      />
    </div>
  );
};

export default AdminJobsTable;
