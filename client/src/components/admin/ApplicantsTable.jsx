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
              className='group relative bg-card backdrop-blur-md rounded-3xl border border-border shadow-custom p-6 hover:shadow-neon-sm transition-all duration-500 hover:border-primary/30 flex flex-col h-full overflow-hidden'
            >
              <div className='absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none'></div>
              
              <div className='relative z-10 flex flex-col h-full'>
                {/* Profile Info */}
                <div className='flex items-center mb-6'>
                  {item?.applicant?.profile?.profilePhoto?.url ? (
                    <img
                      src={item?.applicant?.profile?.profilePhoto?.url}
                      alt={`${item?.applicant?.fullname}'s profile`}
                      className='w-14 h-14 rounded-2xl border border-border group-hover:border-primary/40 transition-colors duration-500 object-cover mr-4 shadow-sm'
                    />
                  ) : (
                    <div className='w-14 h-14 bg-muted rounded-2xl flex items-center justify-center mr-4 border border-border'>
                      <svg className="w-6 h-6 text-muted-foreground opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                  <div className='truncate'>
                    <h2 className='font-black text-lg text-foreground tracking-tight group-hover:text-primary transition-colors'>
                      {item?.applicant?.fullname}
                    </h2>
                    <p className='text-primary text-[10px] font-black uppercase tracking-widest truncate'>
                      {item?.applicant?.email}
                    </p>
                  </div>
                </div>

                {/* Applicant Details */}
                <div className='space-y-4 mb-8 flex-grow'>
                  <div className='bg-muted/30 border border-border/50 rounded-2xl p-4 italic text-sm text-muted-foreground leading-relaxed group-hover:bg-muted/50 transition-colors'>
                    "{item?.applicant?.profile?.bio || "No candidate statement provided."}"
                  </div>
                  
                  <div className='space-y-2 text-xs font-bold'>
                    <div className="flex justify-between border-b border-border/30 pb-2">
                      <span className='text-muted-foreground uppercase tracking-widest text-[9px]'>Skills</span>
                      <span className="text-foreground truncate max-w-[120px]">{item?.applicant?.profile?.skills?.join(", ") || "N/A"}</span>
                    </div>
                    <div className="flex justify-between border-b border-border/30 pb-2">
                      <span className='text-muted-foreground uppercase tracking-widest text-[9px]'>Applied On</span>
                      <span className="text-foreground">{new Date(item?.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className='text-muted-foreground uppercase tracking-widest text-[9px]'>Resume</span>
                      {item?.applicant?.profile?.resume?.url ? (
                        <a
                          className='text-primary hover:text-secondary italic transition-colors'
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
                    <div className="w-full py-2 bg-muted/40 border border-border rounded-xl text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] text-center">
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
                            ? "bg-muted text-muted-foreground/30 cursor-not-allowed" 
                            : "bg-primary text-primary-foreground shadow-neon-sm hover:shadow-neon hover:scale-[1.02]"
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
                            ? "bg-muted text-muted-foreground/30 cursor-not-allowed" 
                            : "bg-muted/50 text-foreground hover:bg-destructive hover:text-white"
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
