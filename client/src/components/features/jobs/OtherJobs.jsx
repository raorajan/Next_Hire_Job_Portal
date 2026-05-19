import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../common/Loader";
import Navbar from "../../layout/Navbar";

const OtherJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [frontendPage, setFrontendPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setFrontendPage(1);
  }, [jobs]);

  const totalFrontendPages = Math.ceil((jobs?.length || 0) / ITEMS_PER_PAGE) || 1;
  const displayedJobs = jobs?.slice((frontendPage - 1) * ITEMS_PER_PAGE, frontendPage * ITEMS_PER_PAGE) || [];

  useEffect(() => {
    const fetchJobData = async () => {
      setLoading(true);
      setError(null);
      try {
        const rawBase =
          import.meta.env.VITE_BACKEND_URL ||
          import.meta.env.VITE_API_URL ||
          "";
        const normalizedBase = rawBase.replace(/\/+$/, "");
        const endpoint = normalizedBase
          ? `${normalizedBase}/api/v1/external-jobs`
          : `/api/v1/external-jobs`;

        const response = await axios.get(endpoint, {
          params: { page },
          withCredentials: false,
        });
        const incomingJobs = response?.data?.jobs || [];
        setJobs(incomingJobs);
        setHasNext(Boolean(response?.data?.links?.next));
      } catch (error) {
        setError("Failed to load jobs");
        console.error("Error fetching job data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
  }, [page]);

  const handlePrevious = () => {
    if (frontendPage > 1) {
      setFrontendPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (page > 1) {
      setPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (frontendPage < totalFrontendPages) {
      setFrontendPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (hasNext) {
      setPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <Navbar />
      <div className='min-h-screen bg-[#050810] text-[#F3F4F6] relative overflow-hidden font-sans antialiased'>
        {/* Grid Overlay */}
        <div className='grid-overlay absolute inset-0 pointer-events-none z-0 opacity-40'></div>
        {/* Orbital Spheres */}
        <div className='absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(0,200,255,0.06)_0%,transparent_70%)] pointer-events-none z-0'></div>
        <div className='absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(128,64,255,0.06)_0%,transparent_70%)] pointer-events-none z-0'></div>
        
        <div className='container mx-auto px-6 py-12 relative z-10'>
          {/* Header Section */}
          <div className='text-center mb-20 mt-12'>
            <div className='inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#00C8FF]/10 text-[#00C8FF] font-bold text-sm border border-[#00C8FF]/20 shadow-[0_0_15px_rgba(0,200,255,0.05)] backdrop-blur-sm mb-8 hover:scale-105 transition-all duration-300'>
              <span className='w-2.5 h-2.5 bg-[#00C8FF] rounded-full animate-pulse'></span>
              External Global Opportunities
            </div>
            <h1 className='text-5xl md:text-7xl font-extrabold mb-6 tracking-tight'>
              <span className='text-foreground'>
                Discover{" "}
              </span>
              <span className='bg-gradient-to-r from-[#00C8FF] via-blue-400 to-[#8040FF] bg-clip-text text-transparent italic'>
                Limitless Potential
              </span>
            </h1>
            <p className='text-xl text-[#9CA3AF] max-w-2xl mx-auto font-medium leading-relaxed'>
              Access thousands of premium job opportunities aggregated from the world's leading tech ecosystems.
            </p>
          </div>

          {/* Loading and Error States */}
          {loading && (
            <div className='flex justify-center items-center py-24'>
              <div className='text-center'>
                <Loader />
                <p className='text-[#9CA3AF] mt-6 font-semibold animate-pulse'>Aggregating global listings...</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className='text-center py-20'>
              <div className='bg-red-500/5 border border-red-500/20 rounded-2xl p-10 max-w-md mx-auto shadow-custom backdrop-blur-sm'>
                <div className='w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6'>
                  <svg className='w-10 h-10 text-red-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z' />
                  </svg>
                </div>
                <h3 className='text-2xl font-bold text-red-400 mb-2'>Aggregation Fault</h3>
                <p className='text-red-400/80'>{error}</p>
              </div>
            </div>
          )}

          {/* Job Cards Grid */}
          {!loading && !error && (
            <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8'>
              {displayedJobs?.map((job, index) => {
                const cleanDescription = job?.description
                  ?.replace(/<[^>]+>/g, "")
                  ?.slice(0, 200);
                const title = job?.title || job?.position || "Untitled Role";
                const companyName = job?.company || job?.company_name || "Enterprise Stealth";
                const jobTags = job?.tags || [];
                const location = Array.isArray(job?.location)
                  ? job.location.join(", ")
                  : job?.location || "Remote / Global";
                const salaryDisplay = job?.salary
                  ? job.salary
                  : job?.salary_min && job?.salary_max
                    ? `₹${Math.round(job.salary_min).toLocaleString()} - ₹${Math.round(job.salary_max).toLocaleString()}`
                    : "Competitive Market Rate";

                return (
                <div
                  key={index}
                  className='group relative bg-[#080C1E]/60 backdrop-blur-xl p-8 rounded-2xl shadow-[0_0_50px_rgba(0,100,220,0.02)] hover:shadow-[0_0_50px_rgba(0,200,255,0.15)] transition-all duration-500 border border-white/5 hover:border-[#00C8FF]/30 hover:-translate-y-1.5 overflow-hidden text-start'
                >
                  <div className='absolute inset-0 bg-white/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none'></div>
                  
                  <div className='relative z-10'>
                    <div className='flex items-start justify-between mb-6'>
                      <div className='flex-1'>
                        <h3 className='text-2xl font-bold text-[#F3F4F6] group-hover:text-[#00C8FF] transition-colors duration-300 line-clamp-2 mb-3 tracking-tight'>
                          {title}
                        </h3>
                        <div className='flex items-center gap-2'>
                          <div className='w-2.5 h-2.5 bg-[#00C8FF] rounded-full shadow-[0_0_10px_rgba(0,200,255,0.5)]'></div>
                          <p className='text-muted-foreground font-bold'>
                            {companyName}
                          </p>
                        </div>
                      </div>
                      <div className='w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center ml-4 border border-white/10 group-hover:border-[#00C8FF]/40 transition-all duration-300 shadow-inner'>
                        <svg className='w-7 h-7 text-[#00C8FF]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6' />
                        </svg>
                      </div>
                    </div>

                    <div className='space-y-4 mb-8 bg-[#050810]/40 rounded-2xl p-5 border border-white/5'>
                      <div className='flex items-center gap-4'>
                        <div className='w-10 h-10 bg-[#00C8FF]/10 rounded-xl flex items-center justify-center border border-[#00C8FF]/20 shadow-[0_0_10px_rgba(0,200,255,0.1)]'>
                          <svg className='w-5 h-5 text-[#00C8FF]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                          </svg>
                        </div>
                        <div>
                          <p className='text-xs text-muted-foreground font-bold uppercase tracking-widest'>Location</p>
                          <p className='font-bold text-[#F3F4F6]'>
                            {job.remote ? "Remote First" : location}
                          </p>
                        </div>
                      </div>

                      <div className='flex items-center gap-4'>
                        <div className='w-10 h-10 bg-[#8040FF]/10 rounded-xl flex items-center justify-center border border-[#8040FF]/20'>
                          <svg className='w-5 h-5 text-[#8040FF]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' />
                          </svg>
                        </div>
                        <div>
                          <p className='text-xs text-muted-foreground font-bold uppercase tracking-widest'>Compensation</p>
                          <p className='font-bold text-[#8040FF] italic'>{salaryDisplay}</p>
                        </div>
                      </div>
                      {jobTags && jobTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {jobTags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1.5 rounded-lg bg-white/5 text-[10px] font-extrabold text-[#F3F4F6] border border-white/10 uppercase tracking-tighter hover:border-[#00C8FF]/30 hover:bg-white/10 transition-colors"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <p className='text-muted-foreground text-sm line-clamp-3 leading-relaxed mb-8'>
                      {cleanDescription}...
                    </p>

                    <a
                      href={job.url || job.apply_url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='group/btn w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#00C8FF] text-[#050810] font-extrabold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(0,200,255,0.3)] hover:shadow-[0_0_30px_rgba(0,200,255,0.5)] hover:scale-105 border-none'
                    >
                      <span>Explore Opportunity</span>
                      <svg className='w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7l5 5m0 0l-5 5m5-5H6' />
                      </svg>
                    </a>
                  </div>
                </div>
              )})}
            </div>
          )}

          {!loading && !error && (
            <div className='flex flex-col sm:flex-row justify-center items-center gap-8 mt-24 mb-12'>
              <button
                onClick={handlePrevious}
                disabled={page === 1 && frontendPage === 1}
                className={`group flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold transition-all duration-300 min-w-[160px] ${
                  page === 1 && frontendPage === 1
                    ? "bg-white/5 text-muted-foreground cursor-not-allowed opacity-50 border border-white/10"
                    : "bg-[#080C1E]/60 backdrop-blur-xl text-foreground hover:bg-white/5 border border-white/10 hover:border-[#00C8FF]/30 shadow-[0_0_15px_rgba(0,200,255,0.02)] hover:shadow-[0_0_20px_rgba(0,200,255,0.15)] hover:scale-105"
                }`}
              >
                <svg className={`w-5 h-5 transition-transform duration-300 ${(page !== 1 || frontendPage !== 1) ? 'group-hover:-translate-x-1' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                </svg>
                Previous
              </button>
              
              <div className='flex items-center gap-4 bg-[#080C1E]/60 backdrop-blur-xl rounded-2xl px-10 py-4 shadow-[0_0_15px_rgba(0,200,255,0.02)] border border-white/5 relative overflow-hidden'>
                <div className='absolute inset-0 bg-[#00C8FF]/5 animate-pulse'></div>
                <div className='w-3 h-3 bg-[#00C8FF] rounded-full shadow-[0_0_8px_rgba(0,200,255,0.6)] relative z-10 animate-pulse'></div>
                <span className='font-extrabold text-2xl text-foreground relative z-10 tracking-tight'>
                  {jobs?.length > ITEMS_PER_PAGE 
                    ? `Page ${page} (${frontendPage}/${totalFrontendPages})` 
                    : `Page ${page}`}
                </span>
                <div className='w-3 h-3 bg-secondary rounded-full relative z-10'></div>
              </div>
              
              <button
                onClick={handleNext}
                disabled={!hasNext && frontendPage === totalFrontendPages}
                className={`group flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold transition-all duration-300 min-w-[160px] ${
                  hasNext || frontendPage < totalFrontendPages
                    ? "bg-[#00C8FF] hover:bg-[#00E5FF] text-[#050810] shadow-[0_0_20px_rgba(0,200,255,0.3)] hover:scale-105"
                    : "bg-white/5 text-muted-foreground cursor-not-allowed opacity-50 border border-white/10"
                }`}
              >
                Next
                <svg className='w-5 h-5 transition-transform duration-300 group-hover:translate-x-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OtherJobs;

