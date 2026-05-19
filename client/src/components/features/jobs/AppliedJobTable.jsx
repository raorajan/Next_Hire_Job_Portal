import React, { useState, useEffect } from "react";
import { getAppliedJobs } from "@/redux/slices/application.slice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Badge } from "../../ui/badge";

const AppliedJobTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const application = useSelector((state) => state.application);

  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await dispatch(getAppliedJobs()).unwrap();
        if (res?.status === 200) {
          const validJobs = res.applications.filter((job) => job?.job?._id); // Filter out jobs without job IDs
          setAppliedJobs(validJobs);
        } else {
          setError("Failed to load applied jobs.");
        }
      } catch (error) {
        setError("An error occurred while fetching your applied jobs.");
      } finally {
        setLoading(false);
      }
    };

    // Fetch only if applications are not already loaded
    if (!application?.applications?.length) {
      fetchAppliedJobs();
    } else {
      const validJobs = application.applications.filter((job) => job?.job?._id); // Filter out jobs without job IDs
      setAppliedJobs(validJobs);
    }
  }, [dispatch, application?.applications?.length]);

  const handleCardClick = (jobId) => {
    navigate(`/description/${jobId}`);
  };

  // Loading Skeleton Component
  const LoadingSkeleton = () => (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
      {Array.from({ length: 6 })?.map((_, index) => (
        <div
          key={index}
          className='bg-[#080C1E]/60 backdrop-blur-xl rounded-2xl border border-white/5 shadow-custom p-6 animate-pulse flex flex-col justify-between h-96 w-full'
        >
          <div className='flex justify-center mb-4'>
            <div className='w-20 h-20 bg-white/5 rounded-2xl animate-pulse'></div>
          </div>
          <div className='h-5 bg-white/5 rounded mb-3 animate-pulse'></div>
          <div className='h-4 bg-white/5 rounded mb-2 w-3/4 mx-auto animate-pulse'></div>
          <div className='h-3 bg-white/5 rounded mb-2 animate-pulse'></div>
          <div className='h-3 bg-white/5 rounded mb-2 w-5/6 mx-auto animate-pulse'></div>
          <div className='h-3 bg-white/5 rounded mb-2 animate-pulse'></div>
          <div className='h-3 bg-white/5 rounded mb-2 w-4/5 mx-auto animate-pulse'></div>
          <div className='flex justify-between gap-3 mt-4'>
            <div className='w-28 h-10 bg-white/5 rounded-xl animate-pulse'></div>
            <div className='w-20 h-10 bg-white/5 rounded-xl animate-pulse'></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Applied Job Item Component
  const JobCard = ({ appliedJob }) => {
    const job = appliedJob?.job;
    const getStatusColor = (status) => {
      switch (status?.toLowerCase()) {
        case "rejected":
          return {
            bg: "bg-red-500/10",
            text: "text-red-400",
            border: "border-red-500/20",
            icon: "bg-red-500/20",
            dot: "bg-red-500"
          };
        case "pending":
          return {
            bg: "bg-amber-400/10",
            text: "text-amber-400",
            border: "border-amber-400/20",
            icon: "bg-amber-400/20",
            dot: "bg-amber-400"
          };
        case "interview":
          return {
            bg: "bg-blue-400/10",
            text: "text-blue-400",
            border: "border-blue-400/20",
            icon: "bg-blue-400/20",
            dot: "bg-blue-400"
          };
        case "offered":
          return {
            bg: "bg-green-400/10",
            text: "text-green-400",
            border: "border-green-400/20",
            icon: "bg-green-400/20",
            dot: "bg-green-400"
          };
        default:
          return {
            bg: "bg-[#050810]/50",
            text: "text-muted-foreground",
            border: "border-white/10",
            icon: "bg-white/5",
            dot: "bg-muted-foreground"
          };
      }
    };

    const statusColors = getStatusColor(appliedJob?.status);
    const appliedDate = appliedJob?.createdAt 
      ? new Date(appliedJob.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : null;

    return ( 
      <div
        key={appliedJob?._id}
        className='group relative bg-[#080C1E]/60 backdrop-blur-xl rounded-2xl border border-white/5 shadow-[0_0_50px_rgba(0,100,220,0.02)] hover:shadow-[0_0_50px_rgba(0,200,255,0.15)] hover:border-[#00C8FF]/30 p-8 flex flex-col justify-between h-full w-full transition-all duration-300 transform hover:-translate-y-1.5 overflow-visible'
      >
        {/* Status indicator bar */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${statusColors.bg} border-b border-white/5`}></div>
        
        {/* Gradient overlay on hover */}
        <div className='absolute inset-0 bg-white/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none'></div>
        
        <div className='relative z-10 flex flex-col h-full overflow-visible text-start'>
          {/* Header with logo and status */}
          <div className='flex items-start justify-between mb-5 gap-3 overflow-visible'>
            <div className='flex items-center gap-4 flex-1 min-w-0'>
              <div className='w-20 h-20 rounded-xl overflow-hidden border border-white/5 group-hover:border-[#00C8FF]/30 transition-colors duration-300 flex-shrink-0 bg-[#050810]/50'>
                <img
                  src={job?.company?.logo?.url}
                  alt={job?.company?.companyName}
                  className='w-full h-full object-cover'
                />
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-base font-bold text-foreground truncate group-hover:text-[#00C8FF] transition-colors duration-300'>
                  {job?.company?.companyName}
                </p>
                {appliedDate && (
                  <p className='text-sm text-muted-foreground mt-1.5'>Applied {appliedDate}</p>
                )}
              </div>
            </div>
            <Badge
              className={`rounded-lg px-4 py-2 font-bold text-xs border ${statusColors.bg} ${statusColors.text} ${statusColors.border} flex items-center gap-1.5 flex-shrink-0 whitespace-nowrap shadow-sm`}
            >
              <span className={`w-2.5 h-2.5 ${statusColors.dot} rounded-full animate-pulse flex-shrink-0`}></span>
              {appliedJob?.status?.toUpperCase()}
            </Badge>
          </div>
          
          {/* Job Title */}
          <h3 className='text-2xl font-extrabold mb-4 text-foreground group-hover:text-[#00C8FF] transition-colors duration-300 line-clamp-2 min-h-[3.5rem]'>
            {job?.title}
          </h3>
          
          {/* Location */}
          <div className='flex items-center gap-2.5 mb-5 text-muted-foreground'>
            <svg className='w-5 h-5 text-[#00C8FF]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
            </svg>
            <span className='text-base font-semibold'>{job?.location}</span>
          </div>
          
          {/* Description */}
          <p className='text-muted-foreground text-base mb-5 line-clamp-3 flex-grow leading-relaxed font-medium'>
            {job?.description?.slice(0, 150)}...
          </p>
          
          {/* Job Details Card */}
          <div className='space-y-3 mb-5 bg-[#050810]/40 rounded-xl p-5 border border-white/5'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2.5'>
                <svg className='w-5 h-5 text-[#00C8FF]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' />
                </svg>
                <span className='text-sm text-muted-foreground font-semibold'>Salary</span>
              </div>
              <span className='text-base text-[#00C8FF] font-extrabold'>₹{job?.salary?.toLocaleString()} LPA</span>
            </div>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2.5'>
                <svg className='w-5 h-5 text-[#00C8FF]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6' />
                </svg>
                <span className='text-sm text-muted-foreground font-semibold'>Experience</span>
              </div>
              <span className='text-base text-foreground font-bold'>{job?.experienceLevel} years</span>
            </div>
            {job?.requirements?.length > 0 && ( 
              <div className='flex items-start gap-2.5 pt-3 border-t border-white/5'>
                <svg className='w-5 h-5 text-[#00C8FF] mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' />
                </svg>
                <div className='flex-1'>
                  <span className='text-sm text-muted-foreground font-semibold block mb-2'>Skills</span>
                  <div className='flex flex-wrap gap-2'>
                    {job?.requirements?.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className='text-sm bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 text-foreground font-semibold'>
                        {skill}
                      </span>
                    ))}
                    {job?.requirements?.length > 3 && (
                      <span className='text-sm text-muted-foreground font-semibold self-center'>+{job.requirements.length - 3} more</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Action Button */}
          <button
            className='w-full bg-[#00C8FF] hover:bg-[#00E5FF] text-[#050810] rounded-xl px-6 py-4 font-extrabold text-base shadow-[0_0_20px_rgba(0,200,255,0.3)] hover:shadow-[0_0_30px_rgba(0,200,255,0.5)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 border-none'
            onClick={() => handleCardClick(job?._id)}
          >
            <span>View Full Details</span>
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  // Calculate statistics
  const stats = {
    total: appliedJobs.length,
    pending: appliedJobs.filter((job) => job?.status?.toLowerCase() === "pending").length,
    interview: appliedJobs.filter((job) => job?.status?.toLowerCase() === "interview").length,
    offered: appliedJobs.filter((job) => job?.status?.toLowerCase() === "offered").length,
    rejected: appliedJobs.filter((job) => job?.status?.toLowerCase() === "rejected").length,
  };

  return (
    <div className='w-full space-y-6'>
      {/* Statistics Header */}
      {!loading && appliedJobs.length > 0 && (
        <div className='grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 max-w-full'>
          <div className='bg-[#00C8FF]/5 rounded-xl p-4 border border-[#00C8FF]/20 shadow-[0_0_15px_rgba(0,200,255,0.05)]'>
            <div className='text-2xl font-extrabold text-[#00C8FF]'>{stats.total}</div>
            <div className='text-xs font-semibold text-muted-foreground mt-1 uppercase tracking-wider'>Total Applied</div>
          </div>
          <div className='bg-amber-400/5 rounded-xl p-4 border border-amber-400/20 shadow-[0_0_15px_rgba(251,191,36,0.05)]'>
            <div className='text-2xl font-extrabold text-amber-400'>{stats.pending}</div>
            <div className='text-xs font-semibold text-muted-foreground mt-1 uppercase tracking-wider'>Pending</div>
          </div>
          <div className='bg-blue-400/5 rounded-xl p-4 border border-blue-400/20 shadow-[0_0_15px_rgba(96,165,250,0.05)]'>
            <div className='text-2xl font-extrabold text-blue-400'>{stats.interview}</div>
            <div className='text-xs font-semibold text-muted-foreground mt-1 uppercase tracking-wider'>Interview</div>
          </div>
          <div className='bg-green-400/5 rounded-xl p-4 border border-green-400/20 shadow-[0_0_15px_rgba(74,222,128,0.05)]'>
            <div className='text-2xl font-extrabold text-green-400'>{stats.offered}</div>
            <div className='text-xs font-semibold text-muted-foreground mt-1 uppercase tracking-wider'>Offered</div>
          </div>
          <div className='bg-red-500/5 rounded-xl p-4 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.05)]'>
            <div className='text-2xl font-extrabold text-red-400'>{stats.rejected}</div>
            <div className='text-xs font-semibold text-muted-foreground mt-1 uppercase tracking-wider'>Rejected</div>
          </div>
        </div>
      )}

      {loading && <LoadingSkeleton />}

      {!loading && appliedJobs.length === 0 && (
        <div className='text-center py-16'>
          <div className='bg-[#080C1E]/80 backdrop-blur-xl rounded-2xl p-10 border border-white/5 shadow-custom max-w-lg mx-auto'>
            <div className='w-20 h-20 bg-[#00C8FF]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(0,200,255,0.15)] border border-[#00C8FF]/20'>
              <svg className='w-10 h-10 text-[#00C8FF]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
              </svg>
            </div>
            <h2 className='text-2xl font-extrabold text-foreground mb-3'>
              No Applications Yet
            </h2>
            <p className='text-muted-foreground mb-8 text-lg font-medium'>
              You haven't applied to any jobs yet. Start exploring and find your next opportunity!
            </p>
            <button
              onClick={() => navigate('/jobs')}
              className='bg-[#00C8FF] hover:bg-[#00E5FF] text-[#050810] px-8 py-4 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(0,200,255,0.3)] hover:scale-105 transition-all duration-300 border-none'
            >
              Browse Jobs
            </button>
          </div>
        </div>
      )}

      {!loading && appliedJobs.length > 0 && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-8'>
          {appliedJobs?.map((appliedJob) => (
            <JobCard key={appliedJob?._id} appliedJob={appliedJob} />
          ))}
        </div>
      )}

      {error && (
        <div className='text-center py-12'>
          <div className='bg-destructive/10 backdrop-blur-sm border border-destructive/20 rounded-2xl p-8 max-w-md mx-auto shadow-custom'>
            <div className='w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg className='w-8 h-8 text-destructive' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            </div>
            <h3 className='text-destructive font-bold text-lg mb-2'>{error}</h3>
            <p className='text-destructive/80 text-sm'>Please try refreshing the page or contact support if the issue persists.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppliedJobTable;
