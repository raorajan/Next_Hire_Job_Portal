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
    <div className='min-h-screen bg-background relative overflow-hidden'>
      {/* Background decorations */}
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        <div className='absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-pulse'></div>
        <div className='absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] animate-pulse'></div>
      </div>

      <Navbar />
      <div className='max-w-7xl mx-auto mt-24 px-4 sm:px-6 lg:px-8 py-8 relative z-10'>
        {/* Go Back and Company Details Layout */}
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6'>
          {/* Go Back Button */}
          <Button
            onClick={() => navigate(-1)}
            variant='outline'
            className='rounded-xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 text-muted-foreground hover:text-primary shadow-sm hover:shadow-neon-sm transition-all duration-300'
          >
            <span className="mr-2 italic">←</span> Return
          </Button>

          {/* Company Details */}
          {company ? (
            <div className='bg-card backdrop-blur-md p-8 rounded-2xl shadow-custom border border-border w-full md:w-auto hover:border-primary/20 transition-all duration-500'>
              <div className='md:flex md:justify-between md:items-center'>
                <div className='flex items-center mb-6 md:mb-0'>
                  {/* Company Logo */}
                  {company.logo?.url && (
                    <div className='relative mr-6'>
                      <img
                        src={company.logo.url}
                        alt={`${company.companyName} logo`}
                        className='h-24 w-24 object-cover rounded-2xl border border-border ring-4 ring-primary/10 shadow-neon-sm'
                      />
                    </div>
                  )}

                  {/* Company Info */}
                  <div>
                    <h1 className='text-3xl md:text-5xl font-extrabold mb-3 text-foreground tracking-tight'>
                      {company.companyName || "Company Name not available"}
                    </h1>
                    <div className='flex flex-wrap gap-4'>
                      <p className='text-sm md:text-base text-muted-foreground flex items-center gap-2 font-medium'>
                        <svg className='w-4 h-4 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                        </svg>
                        {company.location || "Not available"}
                      </p>
                      <p className='text-sm md:text-base text-muted-foreground flex items-center gap-2 font-medium'>
                        <svg className='w-4 h-4 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' />
                        </svg>
                        <a
                          href={company.website || "#"}
                          className='text-primary hover:text-secondary font-bold transition-all duration-300'
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

              <p className='mt-6 text-muted-foreground leading-relaxed bg-muted/20 border border-border/50 rounded-2xl p-6 italic'>
                "{company.description || "Description not available."}"
              </p>
            </div>
          ) : (
            <div className='bg-card backdrop-blur-sm rounded-2xl p-10 border border-border shadow-custom'>
              <p className='text-muted-foreground font-semibold'>Enterprise profile data inaccessible.</p>
            </div>
          )}
        </div>

        <div className='mt-16'>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-10 w-2 bg-primary rounded-full animate-pulse"></div>
            <h2 className='text-3xl md:text-5xl font-extrabold tracking-tight'>
              <span className='text-foreground'>
                Career Opportunities at{" "}
              </span>
              <span className='bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent italic'>
                {company?.companyName || "this enterprise"}
              </span>
            </h2>
          </div>
          
          {jobs.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
              {jobs?.map((job) => (
                <div
                  key={job._id}
                  className='group relative bg-card backdrop-blur-sm border border-border rounded-2xl p-8 shadow-custom hover:shadow-neon-sm transition-all duration-500 transform hover:-translate-y-2 hover:border-primary/30 overflow-hidden flex flex-col'
                >
                  <div className='absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none'></div>
                  
                  <div className='relative z-10 flex flex-col h-full'>
                    <h3 className='text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors duration-300 tracking-tight'>
                      {job.title}
                    </h3>
                    <p className='text-muted-foreground mb-6 line-clamp-3 flex-grow leading-relaxed font-medium'>
                      {truncateDescription(job.description)}
                    </p>
                    
                    <div className='space-y-3 mb-6 bg-muted/30 rounded-2xl p-5 border border-border/50 group-hover:bg-muted/50 transition-all duration-300'>
                      <div className="flex justify-between items-center text-sm font-bold">
                        <span className='text-muted-foreground uppercase tracking-widest text-[10px]'>Location</span>
                        <span className="text-foreground">{job.location}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-bold pt-2 border-t border-border/50">
                        <span className='text-muted-foreground uppercase tracking-widest text-[10px]'>Annual Compensation</span>
                        <span className='text-primary italic'>₹{job.salary.toLocaleString()} LPA</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-bold pt-2 border-t border-border/50">
                        <span className='text-muted-foreground uppercase tracking-widest text-[10px]'>Expertise Threshold</span>
                        <span className="text-foreground">{job.experienceLevel} Years</span>
                      </div>
                    </div>

                    <div className='mt-auto'>
                      <Button
                        className='w-full rounded-xl bg-primary hover:bg-primary/80 text-primary-foreground font-extrabold shadow-neon-sm hover:shadow-neon hover:scale-[1.02] transition-all duration-300 border-none py-6'
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
            <div className='bg-card/40 backdrop-blur-md rounded-2xl p-12 border border-border shadow-inner text-center'>
              <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
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
