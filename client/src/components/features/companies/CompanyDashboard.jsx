import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { useDispatch } from "react-redux";
import { getCompanyById, getJobsByCompany } from "@/redux/slices/company.slice";
import Navbar from "../../layout/Navbar";
import Loader from "../../common/Loader";
import { Button } from "../../ui/button";
import { toast } from "react-toastify";

const CompanyDashboard = () => {
  const { id } = useParams(); // Get company ID from the URL
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Use useNavigate for back button

  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper function for truncating long descriptions
  const truncateDescription = (description) => {
    return description.length > 100
      ? description.substring(0, 100) + "..."
      : description;
  };

  // Fetch company and jobs by companyId
  const fetchCompanyAndJobs = useCallback(() => {
    setLoading(true);

    // Fetch company details
    dispatch(getCompanyById(id))
      .then((res) => {
        if (res?.payload?.company) {
          setCompany(res.payload.company);
        } else {
          toast.error("Failed to fetch company details.");
        }
      })
      .catch(() => toast.error("Error fetching company details."));

    // Fetch jobs by company
    dispatch(getJobsByCompany(id))
      .then((res) => {
        if (res?.payload?.status === 200) {
          setJobs(res.payload.jobs || []);
        } else {
          toast.error("Failed to fetch jobs.");
        }
      })
      .catch(() => toast.error("Error fetching jobs."))
      .finally(() => setLoading(false));
  }, [id, dispatch]);

  useEffect(() => {
    fetchCompanyAndJobs();
  }, [fetchCompanyAndJobs]);

  if (loading) {
    return <Loader />;
  }


  return (
    <div className='min-h-screen bg-[#050810] text-[#E6EDF3] relative overflow-hidden'>
      {/* Fine-lined cyber laser grid overlay */}
      <div className="grid-overlay"></div>
      
      {/* Enhanced Background decorations with rotating orbits */}
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        <div className='absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#00C8FF]/5 rounded-full blur-[130px] anim-spin-slow'></div>
        <div className='absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-[#8040FF]/5 rounded-full blur-[140px] anim-spin-rev'></div>
      </div>

      <Navbar />
      <div className='max-w-7xl mx-auto mt-24 px-4 sm:px-6 lg:px-8 py-8 relative z-10'>
        {/* Go Back and Company Details Layout */}
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6'>
          {/* Go Back Button */}
          <Button
            onClick={() => navigate(-1)}
            variant='outline'
            className='rounded-xl bg-white/5 backdrop-blur-sm border border-white/5 hover:border-[#00C8FF]/50 text-muted-foreground hover:text-[#00C8FF] shadow-[0_0_15px_rgba(0,200,255,0.1)] transition-all duration-300'
          >
            <span className="mr-2 italic">←</span> Return
          </Button>

          {/* Company Details */}
          {company ? (
            <div className='bg-[#080C1E]/80 backdrop-blur-xl p-8 rounded-2xl shadow-[0_0_50px_rgba(0,100,220,0.03)] border border-white/5 w-full md:w-auto hover:border-[#00C8FF]/20 hover:shadow-[0_0_35px_rgba(0,200,255,0.08)] transition-all duration-500'>
              <div className='md:flex md:justify-between md:items-center'>
                <div className='flex items-center mb-6 md:mb-0'>
                  {/* Company Logo */}
                  {company.logo?.url && (
                    <div className='relative mr-6'>
                      <img
                        src={company.logo.url}
                        alt={`${company.companyName} logo`}
                        className='h-24 w-24 object-cover rounded-2xl border border-white/5 ring-4 ring-[#00C8FF]/20 shadow-[0_0_15px_rgba(0,200,255,0.2)]'
                      />
                    </div>
                  )}

                  {/* Company Info */}
                  <div>
                    <h1 className='text-3xl md:text-5xl font-extrabold mb-3 text-white tracking-wide'>
                      {company.companyName || "Company Name not available"}
                    </h1>
                    <div className='flex flex-wrap gap-4'>
                      <p className='text-sm md:text-base text-muted-foreground flex items-center gap-2 font-medium'>
                        <svg className='w-4 h-4 text-[#00C8FF]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                        </svg>
                        {company.location || "Not available"}
                      </p>
                      <p className='text-sm md:text-base text-muted-foreground flex items-center gap-2 font-medium'>
                        <svg className='w-4 h-4 text-[#00C8FF]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' />
                        </svg>
                        <a
                          href={company.website || "#"}
                          className='text-[#00C8FF] hover:text-[#00E5FF] font-bold transition-all duration-300'
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          {company.website || "No website available"}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <p className='mt-6 text-muted-foreground leading-relaxed bg-[#00C8FF]/5 border border-white/5 rounded-2xl p-6 italic'>
                "{company.description || "Description not available."}"
              </p>
            </div>
          ) : (
            <div className='bg-[#080C1E]/80 backdrop-blur-xl rounded-2xl p-10 border border-white/5 shadow-custom'>
              <p className='text-muted-foreground font-semibold'>Enterprise profile data inaccessible.</p>
            </div>
          )}
        </div>

        <div className='mt-16'>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-10 w-2 bg-[#00C8FF] rounded-full shadow-[0_0_10px_rgba(0,200,255,0.8)] animate-pulse"></div>
            <h2 className='text-3xl md:text-5xl font-extrabold tracking-wide'>
              <span className='text-white'>
                Career Opportunities at{" "}
              </span>
              <span className='text-[#00C8FF] italic drop-shadow-[0_0_15px_rgba(0,200,255,0.4)]'>
                {company?.companyName || "this enterprise"}
              </span>
            </h2>
          </div>
          
          {jobs.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
              {jobs?.map((job) => (
                <div
                  key={job._id}
                  className='group relative bg-[#080C1E]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-[0_0_30px_rgba(0,100,220,0.02)] hover:shadow-[0_0_30px_rgba(0,200,255,0.1)] transition-all duration-500 transform hover:-translate-y-2 hover:border-[#00C8FF]/30 overflow-hidden flex flex-col'
                >
                  <div className='absolute inset-0 bg-gradient-to-br from-[#00C8FF]/10 to-[#8040FF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none'></div>
                  
                  <div className='relative z-10 flex flex-col h-full'>
                    <h3 className='text-2xl font-bold mb-4 text-white group-hover:text-[#00C8FF] transition-colors duration-300 tracking-wide'>
                      {job.title}
                    </h3>
                    <p className='text-muted-foreground mb-6 line-clamp-3 flex-grow leading-relaxed font-medium'>
                      {truncateDescription(job.description)}
                    </p>
                    
                    <div className='space-y-3 mb-6 bg-white/5 rounded-2xl p-5 border border-white/5 group-hover:bg-white/10 transition-all duration-300'>
                      <div className="flex justify-between items-center text-sm font-bold">
                        <span className='text-muted-foreground uppercase tracking-widest text-[10px]'>Location</span>
                        <span className="text-white">{job.location}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-bold pt-2 border-t border-white/5">
                        <span className='text-muted-foreground uppercase tracking-widest text-[10px]'>Annual Compensation</span>
                        <span className='text-[#00C8FF] italic'>₹{job.salary.toLocaleString()} LPA</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-bold pt-2 border-t border-white/5">
                        <span className='text-muted-foreground uppercase tracking-widest text-[10px]'>Expertise Threshold</span>
                        <span className="text-white">{job.experienceLevel} Years</span>
                      </div>
                    </div>

                    <div className='mt-auto'>
                      <Button
                        className='w-full rounded-xl bg-[#00C8FF] hover:bg-[#00E5FF] text-[#050810] font-extrabold shadow-[0_0_20px_rgba(0,200,255,0.3)] hover:shadow-[0_0_30px_rgba(0,200,255,0.5)] hover:scale-[1.02] transition-all duration-300 border-none py-6'
                        onClick={() => navigate(`/description/${job._id}`)}
                      >
                        Explore Role Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='bg-[#080C1E]/50 backdrop-blur-md rounded-2xl p-12 border border-white/5 shadow-inner text-center'>
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.183.183l-1.109.554a2 2 0 00-1.105 1.79v.21c0 .503.41 1.105.908 1.105h15.344a.908.908 0 00.908-1.105v-.21a2 2 0 00-1.105-1.79l-1.109-.554zM12 2a5 5 0 00-5 5v3a5 5 0 0010 0V7a5 5 0 00-5-5z" />
                </svg>
              </div>
              <p className='text-muted-foreground text-xl font-bold italic'>
                No active openings available at this threshold.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
