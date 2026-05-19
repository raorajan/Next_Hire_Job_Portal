import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateApplicationStatus } from "@/redux/slices/application.slice";
import { useDispatch } from "react-redux";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import Loader from "../common/Loader";

const ApplicantsTable = ({ applicants }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [applicantActions, setApplicantActions] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const initialActions = {};
    applicants?.forEach((item) => {
      initialActions[item?._id] =
        item?.status?.charAt(0).toUpperCase() + item?.status?.slice(1);
    });
    setApplicantActions(initialActions);
  }, [applicants]);

  const statusHandler = async (action, id) => {
    const status = action === "accept" ? "Accepted" : "Rejected";
    try {
      setIsLoading(true);
      const res = await dispatch(
        updateApplicationStatus({ applicationId: id, status })
      );
      if (res?.payload?.status === 200) {
        setApplicantActions((prev) => ({ ...prev, [id]: status }));
        toast.success(`Application ${status} successfully!`);
      } else {
        toast.error("Failed to update application status!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='relative z-10'>
      {isLoading && <Loader />}

      {/* Applicants Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
        {applicants?.map((item) => {
          const status = applicantActions[item?._id];
          const isAccepted = status === "Accepted";
          const isRejected = status === "Rejected";

          return (
            <div
              key={item?._id}
              className='group relative bg-[#080C1E]/80 backdrop-blur-xl border border-white/5 shadow-[0_0_50px_rgba(0,100,220,0.03)] p-6 hover:shadow-[0_0_30px_rgba(0,200,255,0.2)] transition-all duration-500 hover:border-[#00C8FF]/30 flex flex-col h-full overflow-hidden'
            >
              <div className='absolute inset-0 bg-gradient-to-br from-[#00C8FF]/5 to-[#8040FF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none'></div>
              
              <div className='relative z-10 flex flex-col h-full'>
                {/* Profile Info */}
                <div className='flex items-center mb-6'>
                  {item?.applicant?.profile?.profilePhoto?.url ? (
                    <img
                      src={item?.applicant?.profile?.profilePhoto?.url}
                      alt={`${item?.applicant?.fullname}'s profile`}
                      className='w-14 h-14 rounded-2xl border border-white/10 group-hover:border-[#00C8FF]/40 transition-colors duration-500 object-cover mr-4 shadow-sm'
                    />
                  ) : (
                    <div className='w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mr-4 border border-white/10'>
                      <svg className="w-6 h-6 text-muted-foreground opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                  <div className='truncate'>
                    <h2 className='font-black text-lg text-white tracking-tight group-hover:text-[#00C8FF] transition-colors'>
                      {item?.applicant?.fullname}
                    </h2>
                    <p className='text-[#00C8FF] text-[10px] font-black uppercase tracking-widest truncate drop-shadow-[0_0_10px_rgba(0,200,255,0.2)]'>
                      {item?.applicant?.email}
                    </p>
                  </div>
                </div>

                {/* Applicant Details */}
                <div className='space-y-4 mb-8 flex-grow'>
                  <div className='bg-white/5 border border-white/5 rounded-2xl p-4 italic text-sm text-muted-foreground leading-relaxed group-hover:bg-white/10 transition-colors'>
                    "{item?.applicant?.profile?.bio || "No candidate statement provided."}"
                  </div>
                  
                  <div className='space-y-2 text-xs font-bold'>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className='text-muted-foreground uppercase tracking-widest text-[9px]'>Skills</span>
                      <span className="text-white truncate max-w-[120px]">{item?.applicant?.profile?.skills?.join(", ") || "N/A"}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className='text-muted-foreground uppercase tracking-widest text-[9px]'>Applied On</span>
                      <span className="text-white">{new Date(item?.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className='text-muted-foreground uppercase tracking-widest text-[9px]'>Resume</span>
                      {item?.applicant?.profile?.resume?.url ? (
                        <a
                          className='text-[#00C8FF] hover:text-[#00E5FF] italic transition-colors drop-shadow-[0_0_10px_rgba(0,200,255,0.2)]'
                          href={item?.applicant?.profile?.resume?.url}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          View Document →
                        </a>
                      ) : (
                        <span className="text-destructive/60 uppercase tracking-widest">Missing</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="mb-4">
                  {isAccepted && (
                    <div className="w-full py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] text-center shadow-neon-sm">
                      Status: Accepted
                    </div>
                  )}
                  {isRejected && (
                    <div className="w-full py-2 bg-destructive/10 border border-destructive/30 rounded-xl text-destructive text-[10px] font-black uppercase tracking-[0.2em] text-center">
                      Status: Redacted
                    </div>
                  )}
                  {!isAccepted && !isRejected && (
                    <div className="w-full py-2 bg-white/5 border border-white/10 rounded-xl text-white/60 text-[10px] font-black uppercase tracking-[0.2em] text-center">
                      Status: Under Review
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className='mt-auto flex gap-3'>
                  <Button
                    onClick={() => statusHandler("accept", item?._id)}
                    className={`flex-1 h-12 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 border-none ${
                        isAccepted 
                          ? "bg-emerald-500 text-white cursor-default" 
                          : isRejected 
                            ? "bg-white/5 text-white/20 cursor-not-allowed" 
                            : "bg-[#00C8FF] hover:bg-[#00E5FF] text-[#050810] shadow-[0_0_20px_rgba(0,200,255,0.2)] hover:shadow-[0_0_30px_rgba(0,200,255,0.4)] hover:scale-[1.02]"
                      }`}
                    disabled={isAccepted || isRejected}
                  >
                    {isAccepted ? "Accepted" : "Accept"}
                  </Button>

                  <Button
                    onClick={() => statusHandler("reject", item?._id)}
                    className={`flex-1 h-12 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 border-none ${
                        isRejected 
                          ? "bg-destructive text-white cursor-default" 
                          : isAccepted 
                            ? "bg-white/5 text-white/20 cursor-not-allowed" 
                            : "bg-white/5 text-white hover:bg-red-500 hover:text-[#050810] border border-white/10"
                      }`}
                    disabled={isAccepted || isRejected}
                  >
                    {isRejected ? "Rejected" : "Reject"}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ApplicantsTable;
