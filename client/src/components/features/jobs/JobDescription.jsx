import React, { useEffect, useState } from "react";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ReactHelmet from "../../common/ReactHelmet";
import { useNavigate } from "react-router-dom";
import { getJobById, getSimilarJobs } from "@/redux/slices/job.slice";
import { applyJob } from "@/redux/slices/application.slice";
import { getSkillGapInsights } from "@/redux/slices/user.slice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../common/Loader";
import { getToken } from "@/utils/constant";
import Navbar from "../../layout/Navbar";

const JobDescription = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const jobId = params.id;
  const [singleJob, setSingleJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [isApplied, setIsApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [skillGap, setSkillGap] = useState(null);
  const [showSkillGap, setShowSkillGap] = useState(false);
  const user = useSelector((state) => state.user.user);

  // Fetch job details
  useEffect(() => {
    dispatch(getJobById(jobId)).then((res) => {
      if (res?.payload?.status === 200) {
        const response = res?.payload?.job;
        if (response) {
          setSingleJob(response);
          const findApplications = res?.payload?.job?.applications;
          const alreadyApplied = findApplications?.some(
            (application) => application?.applicant === user?._id
          );
          setIsApplied(alreadyApplied);

          // Fetch similar jobs based on the job type
          dispatch(getSimilarJobs(jobId)).then((res) => {
            if (res?.payload?.status === 200) {
              setSimilarJobs(res?.payload?.jobs || []);
            }
          });
        }
      }
    });
  }, [dispatch, jobId, user]);

  const applyJobHandler = () => {
    const token = getToken();
    if (!token) return navigate("/login");
    if (!jobId) {
      toast.error("Job ID is missing");
      return;
    }
    setApplying(true);
    dispatch(applyJob({ jobId }))
      .then((res) => {
        if (res?.payload?.status === 200) {
          toast.success(res?.payload?.message);
          setIsApplied(true);
        } else {
          toast.info(res?.payload?.message);
        }
      })
      .catch((error) => {
        toast.error(
          error?.response?.data?.message || "Failed to apply for job."
        );
      })
      .finally(() => {
        setApplying(false);
      });
  };


  const viewCompanyDetails = () => {
    const companyId =
      typeof singleJob?.company === "string"
        ? singleJob.company
        : singleJob?.company?._id;

    if (!companyId) {
      toast.error("Company details are unavailable.");
      return;
    }

    navigate(`/company-dashboard/${companyId}`);
  };

  const fetchSkillGap = async () => {
    if (!jobId || !user) return;
    try {
      const res = await dispatch(getSkillGapInsights(jobId));
      if (res?.payload?.status === 200) {
        setSkillGap(res.payload);
        setShowSkillGap(true);
      }
    } catch (error) {
      toast.error("Failed to fetch skill gap insights");
    }
  };

  if (!singleJob) return <Loader />;

  return (
    <div className='min-h-screen bg-[#050810] text-[#F3F4F6] relative overflow-hidden font-sans antialiased'>
      {/* Grid Overlay */}
      <div className='grid-overlay absolute inset-0 pointer-events-none z-0 opacity-40'></div>
      {/* Orbital Spheres */}
      <div className='absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(0,200,255,0.06)_0%,transparent_70%)] pointer-events-none z-0'></div>
      <div className='absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(128,64,255,0.06)_0%,transparent_70%)] pointer-events-none z-0'></div>

      <Navbar />
      <div className='max-w-7xl mx-auto mt-24 px-4 py-8 relative z-10'>
        <ReactHelmet
          title='Job Details - Next_Hire'
          description='Discover detailed information about the job role, responsibilities, qualifications, and how to apply. Learn more to see if this is the right opportunity for you.'
          canonicalUrl='/job-details'
        />

        <Button
          onClick={() => navigate(-1)}
          className='mb-6 rounded-xl bg-[#080C1E]/60 backdrop-blur-xl border border-white/5 hover:border-[#00C8FF]/30 text-[#F3F4F6] hover:text-[#00C8FF] shadow-[0_0_15px_rgba(0,200,255,0.02)] hover:shadow-[0_0_20px_rgba(0,200,255,0.15)] transition-all duration-300'
        >
          ← Go Back
        </Button>

        <div className='flex flex-col md:flex-row gap-6'>
          <div className='flex-1 bg-[#080C1E]/60 backdrop-blur-xl rounded-2xl p-8 border border-white/5 shadow-custom text-start'>
            <div className='flex flex-col mb-6'>
              <h1 className='font-extrabold text-3xl md:text-4xl mb-4 text-[#F3F4F6]'>
                {singleJob.title}
              </h1>
              <div className='flex items-center gap-3 flex-wrap'>
                <Badge className='text-[#8040FF] font-semibold bg-[#8040FF]/10 border border-[#8040FF]/20 px-4 py-1.5' variant='ghost'>
                  {singleJob.position} Position{singleJob.position > 1 ? 's' : ''}
                </Badge>
                <Badge className='text-[#00C8FF] font-semibold bg-[#00C8FF]/10 border border-[#00C8FF]/20 px-4 py-1.5' variant='ghost'>
                  {singleJob.jobType}
                </Badge>
                <Badge className='text-[#00C8FF] font-semibold bg-[#00C8FF]/10 border border-[#00C8FF]/20 px-4 py-1.5' variant='ghost'>
                  ₹{singleJob.salary} LPA
                </Badge>
              </div>
            </div>

            <div className='flex flex-col sm:flex-row gap-4 mb-8'>
              <Button
                onClick={isApplied ? null : applyJobHandler}
                disabled={isApplied || applying}
                className={`flex-1 rounded-xl font-extrabold py-6 transition-all duration-300 ${
                  isApplied
                    ? "bg-white/5 text-muted-foreground border border-white/10 cursor-not-allowed"
                    : "bg-[#00C8FF] hover:bg-[#00E5FF] text-[#050810] shadow-[0_0_20px_rgba(0,200,255,0.3)] hover:shadow-[0_0_30px_rgba(0,200,255,0.5)] hover:scale-105"
                }`}
              >
                {isApplied ? "✓ Applied" : applying ? "Applying..." : "Apply Now"}
              </Button>

              <Button
                onClick={viewCompanyDetails}
                className='flex-1 rounded-xl bg-transparent border border-[#00C8FF]/30 text-[#00C8FF] hover:bg-[#00C8FF] hover:text-[#050810] font-semibold shadow-custom hover:shadow-[0_0_20px_rgba(0,200,255,0.2)] transform hover:scale-105 transition-all duration-300 py-6'
              >
                View Company Details
              </Button>

              {user?.role === "student" && (
                <Button
                  onClick={fetchSkillGap}
                  className='flex-1 rounded-xl bg-transparent border border-[#8040FF]/30 text-[#8040FF] hover:bg-[#8040FF] hover:text-[#050810] font-semibold shadow-custom hover:shadow-[0_0_20px_rgba(128,64,255,0.2)] transform hover:scale-105 transition-all duration-300 py-6'
                >
                  Check Skill Gap
                </Button>
              )}
            </div>

            {showSkillGap && skillGap && (
              <div className='mb-8 bg-[#8040FF]/5 rounded-2xl p-6 border border-[#8040FF]/20 shadow-[0_0_15px_rgba(128,64,255,0.05)]'>
                <h3 className='font-extrabold text-xl mb-4 bg-gradient-to-r from-[#00C8FF] to-[#8040FF] bg-clip-text text-transparent'>
                  Skill Gap Analysis
                </h3>
                {skillGap.missingSkills && skillGap.missingSkills.length > 0 ? (
                  <div className='space-y-4'>
                    <div>
                      <p className='font-semibold text-foreground mb-2'>Missing Skills:</p>
                      <div className='flex flex-wrap gap-2'>
                        {skillGap.missingSkills.map((skill, idx) => (
                          <span key={idx} className='bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-sm font-semibold border border-red-500/20'>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    {skillGap.suggestedResources && skillGap.suggestedResources.length > 0 && (
                      <div>
                        <p className='font-semibold text-foreground mb-2'>Suggested Resources:</p>
                        <div className='space-y-2'>
                          {skillGap.suggestedResources.map((resource, idx) => (
                            <a
                              key={idx}
                              href={resource.url}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='block bg-[#050810]/40 rounded-xl p-3 border border-white/5 hover:border-[#00C8FF]/30 hover:shadow-[0_0_15px_rgba(0,200,255,0.1)] transition-all'
                            >
                              <p className='font-semibold text-[#00C8FF]'>{resource.title}</p>
                              {resource.category && (
                                <p className='text-sm text-muted-foreground'>{resource.category}</p>
                              )}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className='text-green-400 font-semibold'>Great! You have all the required skills for this position.</p>
                )}
                <button
                  onClick={() => setShowSkillGap(false)}
                  className='mt-4 text-muted-foreground hover:text-foreground text-sm font-semibold'
                >
                  Close
                </button>
              </div>
            )}

            <h2 className='border-b border-white/5 font-extrabold text-xl py-4 mb-6 text-foreground tracking-wide uppercase text-start'>
              Job Details & Description
            </h2>
            <div className='my-4 space-y-4'>
              <JobDetail label='Role' value={singleJob.title} />
              <JobDetail label='Location' value={singleJob.location} />
              <JobDetail label='Description' value={singleJob.description} />
              <JobDetail
                label='Experience'
                value={`${singleJob.experienceLevel} yrs`}
              />
              <JobDetail label='Salary' value={`₹${singleJob.salary} LPA`} />
              <JobDetail
                label='Total Applicants'
                value={singleJob.applications.length}
              />
              <JobDetail
                label='Posted Date'
                value={singleJob.createdAt.split("T")[0]}
              />
            </div>
          </div>

          {/* Similar Jobs Section */}
          <div className='w-full md:w-1/3 bg-[#080C1E]/60 backdrop-blur-xl border border-white/5 rounded-2xl shadow-custom p-6 sticky top-24 max-h-[85vh] overflow-hidden flex flex-col text-start'>
            <h2 className='border-b border-white/5 font-extrabold text-xl py-3 mb-4 text-foreground tracking-wide uppercase'>
              Similar Jobs
            </h2>
            <div className='flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-muted'>
              {similarJobs.length > 0 ? (
                <div className='space-y-4'>
                  {similarJobs?.map((job) => (
                    <div
                      key={job._id}
                      className='p-4 border border-white/5 rounded-xl hover:border-[#00C8FF]/30 hover:shadow-[0_0_20px_rgba(0,200,255,0.15)] transition-all duration-300 bg-[#050810]/30 hover:-translate-y-1'
                    >
                      <h3 className='font-bold text-lg mb-2 text-foreground'>{job.title}</h3>
                      <p className='text-muted-foreground text-sm mb-2'>{job.location}</p>
                      <p className='text-[#00C8FF] font-semibold mb-2'>₹{job.salary} LPA</p>
                      <p className='text-muted-foreground text-sm mb-3'>{job.jobType}</p>
                      <Button
                        onClick={() => navigate(`/description/${job._id}`)}
                        className='w-full rounded-xl bg-[#00C8FF] hover:bg-[#00E5FF] text-[#050810] font-extrabold shadow-[0_0_15px_rgba(0,200,255,0.2)] hover:scale-105 transition-all duration-300 py-4 border-none'
                      >
                        View Job
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-center py-8'>
                  <p className='text-muted-foreground'>No similar jobs found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const JobDetail = ({ label, value }) => ( 
  <div className='bg-[#050810]/40 rounded-xl p-4 border border-white/5 text-start'>
    <h3 className='font-bold text-[#00C8FF] mb-1 font-mono tracking-wider text-sm uppercase'>{label}</h3>
    <p className='text-[#F3F4F6] leading-relaxed font-semibold'>{value}</p>
  </div>
);

export default JobDescription;
