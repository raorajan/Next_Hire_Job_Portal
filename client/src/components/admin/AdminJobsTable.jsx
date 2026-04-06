import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Eye, Edit2 } from "lucide-react";
import { MdDelete } from "react-icons/md";
import { useDispatch } from "react-redux";
import { deleteJob } from "@/redux/slices/job.slice";
import { toast } from "react-toastify";

const AdminJobsTable = ({ jobs, onDeleteJob }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDeleteJob = (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      dispatch(deleteJob(jobId)).then((res) => {
        if (res?.payload?.status === 200) {
          toast.success("Job deleted successfully!");
          onDeleteJob?.(jobId);
        } else {
          toast.error("Failed to delete job");
        }
      });
    }
  };

  return (
    <div className='container mx-auto p-6'>
      {jobs?.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
          {jobs?.map((job) => (
            <div
              key={job?._id}
              className='group relative bg-card/60 backdrop-blur-md rounded-3xl border border-border shadow-custom p-8 hover:shadow-neon-sm transform hover:-translate-y-2 transition-all duration-500 ease-in-out flex flex-col justify-between h-[480px] overflow-hidden'
            >
              <div className='absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none'></div>
              
              <div className='relative z-10'>
                <div className='flex items-center justify-between mb-6'>
                  <div className='relative'>
                    <div className='absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
                    <img
                      src={job?.company?.logo?.url || "https://via.placeholder.com/100"}
                      alt={job?.company?.companyName || "Company Logo"}
                      className='w-14 h-14 object-cover rounded-2xl border-2 border-border group-hover:border-primary/50 transition-all duration-500 relative z-10'
                    />
                  </div>
                  <div className='px-3 py-1 bg-muted/50 rounded-lg border border-border text-[10px] font-black text-muted-foreground uppercase tracking-widest'>
                    {job?.createdAt && new Date(job.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <h2 className='text-2xl font-black text-foreground mb-1 tracking-tight group-hover:text-primary transition-colors duration-300'>
                  {job?.title}
                </h2>
                <p className='text-primary font-extrabold italic text-sm mb-4'>
                  {job?.company?.companyName || "Unknown Enterprise"}
                </p>
                <p className='text-muted-foreground text-sm mb-6 font-medium leading-relaxed line-clamp-3'>
                  {job?.description}
                </p>

                <div className='space-y-3 bg-muted/30 rounded-2xl p-5 border border-border/50 group-hover:bg-muted/50 transition-all duration-300'>
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                    <span className='text-muted-foreground'>Location</span>
                    <span className="text-foreground">{job?.location}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider pt-2 border-t border-border/50">
                    <span className='text-muted-foreground'>Compensation</span>
                    <span className='text-primary italic'>₹{job?.salary?.toLocaleString?.()} LPA</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider pt-2 border-t border-border/50">
                    <span className='text-muted-foreground'>Expertise Level</span>
                    <span className="text-foreground">{job?.experienceLevel} Years</span>
                  </div>
                </div>
              </div>

              <div className='relative z-10 flex gap-3 pt-6 mt-auto border-t border-border/50'>
                <Button
                  variant='outline'
                  className='flex-1 h-12 rounded-xl bg-muted/20 border-border hover:border-primary/50 text-foreground hover:text-primary transition-all duration-300'
                  onClick={() => navigate(`/profile/admin/jobs/${job?._id}/applicants`)}
                >
                  <Eye className='w-4 h-4 mr-2' /> Applicants ({job?.applications?.length || 0})
                </Button>

                <div className='flex gap-2 text-primary'>
                  <Button
                    variant='outline'
                    className='w-12 h-12 rounded-xl bg-muted/20 border-border hover:border-secondary/50 text-foreground hover:text-secondary p-0'
                    onClick={() => navigate(`/profile/admin/jobs/${job?._id}/edit`)}
                  >
                    <Edit2 className='w-4 h-4' />
                  </Button>
                  <Button
                    variant='outline'
                    className='w-12 h-12 rounded-xl bg-muted/20 border-border hover:border-destructive/50 text-foreground hover:text-destructive p-0'
                    onClick={() => handleDeleteJob(job?._id)}
                  >
                    <MdDelete className='w-5 h-5' />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-20 border-2 border-dashed border-border rounded-3xl bg-muted/10'>
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-muted-foreground opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h2 className='text-3xl font-black text-foreground mb-4 tracking-tight italic'>
            Operational Registry Empty
          </h2>
          <p className='text-muted-foreground font-medium mb-8'>Begin by deploying a new opportunity to the platform.</p>
          <Button
            className='bg-primary text-primary-foreground rounded-xl px-10 py-6 font-extrabold shadow-neon-sm hover:shadow-neon transition-all duration-300 border-none'
            onClick={() => navigate("/profile/admin/jobs/create")}
          >
            Deploy New Role
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminJobsTable;
