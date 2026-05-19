import React, { useEffect, useState, useMemo } from "react";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ReactHelmet from "../../common/ReactHelmet";
import { getJobById, getSimilarJobs } from "@/redux/slices/job.slice";
import { applyJob } from "@/redux/slices/application.slice";
import { getSkillGapInsights } from "@/redux/slices/user.slice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../common/Loader";
import { getToken } from "@/utils/constant";
import Navbar from "../../layout/Navbar";
import { Avatar, AvatarImage, AvatarFallback } from "../../ui/avatar";
import { 
  MapPin, 
  Calendar, 
  Briefcase, 
  IndianRupee, 
  Users, 
  Clock, 
  Building2, 
  ArrowLeft, 
  GraduationCap, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  ExternalLink,
  Info
} from "lucide-react";

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

  const daysAgo = useMemo(() => {
    if (!singleJob?.createdAt) return null;
    const createdAt = new Date(singleJob.createdAt);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    const days = Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    return days === 0 ? "Today" : `${days} day${days > 1 ? 's' : ''} ago`;
  }, [singleJob?.createdAt]);

  if (!singleJob) return <Loader />;

  const companyName = typeof singleJob?.company === "object" ? singleJob.company?.companyName : "NextHire Partner";
  const companyLogo = typeof singleJob?.company === "object" ? singleJob?.company?.logo?.url : null;

  return (
    <div className='min-h-screen bg-[#050810] text-[#F3F4F6] relative overflow-hidden font-sans antialiased pb-16'>
      {/* Grid Overlay */}
      <div className='grid-overlay absolute inset-0 pointer-events-none z-0 opacity-40'></div>
      {/* Orbital Spheres */}
      <div className='absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(0,200,255,0.06)_0%,transparent_70%)] pointer-events-none z-0'></div>
      <div className='absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(128,64,255,0.06)_0%,transparent_70%)] pointer-events-none z-0'></div>

      <Navbar />
      
      <div className='max-w-7xl mx-auto mt-24 px-4 py-8 relative z-10'>
        <ReactHelmet
          title={`${singleJob?.title || 'Job Details'} - Next_Hire`}
          description='Discover detailed information about the job role, responsibilities, qualifications, and how to apply. Learn more to see if this is the right opportunity for you.'
          canonicalUrl='/job-details'
        />

        {/* Top Navigation Row */}
        <div className='flex items-center justify-between mb-8 flex-wrap gap-4'>
          <Button
            onClick={() => navigate(-1)}
            className='rounded-xl bg-[#080C1E]/60 backdrop-blur-xl border border-white/5 hover:border-[#00C8FF]/30 text-[#F3F4F6] hover:text-[#00C8FF] shadow-[0_0_15px_rgba(0,200,255,0.02)] hover:shadow-[0_0_20px_rgba(0,200,255,0.15)] transition-all duration-300 flex items-center gap-2 px-5 py-5'
          >
            <ArrowLeft className='w-4 h-4' /> Go Back
          </Button>
          
          <div className='flex items-center gap-2 text-sm font-semibold text-muted-foreground bg-[#080C1E]/40 border border-white/5 backdrop-blur-xl px-4 py-2 rounded-full'>
            <span>Jobs</span>
            <ChevronRight className='w-3 h-3' />
            <span>Description</span>
            <ChevronRight className='w-3 h-3' />
            <span className='text-[#00C8FF] truncate max-w-[150px] md:max-w-[250px]'>{singleJob.title}</span>
          </div>
        </div>

        {/* Two Column Layout Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          
          {/* Main Left Content Panel */}
          <div className='lg:col-span-2 space-y-8'>
            
            {/* Elegant Hero Header Card */}
            <div className='group relative bg-[#080C1E]/60 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/5 shadow-[0_0_50px_rgba(0,200,255,0.02)] overflow-hidden flex flex-col text-start'>
              {/* Background ambient light gradients */}
              <div className='absolute top-0 right-0 w-32 h-32 bg-[#00C8FF]/5 rounded-full blur-2xl group-hover:bg-[#00C8FF]/10 transition-all duration-500 -z-10'></div>
              <div className='absolute bottom-0 left-0 w-32 h-32 bg-[#8040FF]/5 rounded-full blur-2xl group-hover:bg-[#8040FF]/10 transition-all duration-500 -z-10'></div>
              
              <div className='flex flex-col md:flex-row items-start md:items-center gap-5 pb-6 border-b border-white/5'>
                {/* Brand Logo Container */}
                <div className='w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border border-white/10 group-hover:border-[#00C8FF]/40 transition-colors duration-500 flex-shrink-0 bg-[#050810]/80 p-2 flex items-center justify-center shadow-[0_0_25px_rgba(0,200,255,0.05)]'>
                  <Avatar className='w-full h-full rounded-xl'>
                    <AvatarImage src={companyLogo} className='object-contain' />
                    <AvatarFallback className='bg-gradient-to-br from-[#8040FF] to-[#00C8FF] text-[#050810] font-extrabold text-xl md:text-2xl rounded-xl'>
                      {companyName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className='flex-1 space-y-2 min-w-0'>
                  {/* Job Title */}
                  <h1 className='font-extrabold text-3xl md:text-4xl text-[#F3F4F6] tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#F3F4F6] group-hover:to-[#00C8FF] transition-all duration-300 leading-tight'>
                    {singleJob.title}
                  </h1>
                  
                  {/* Company Name & Location Meta row */}
                  <div className='flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground font-semibold text-sm'>
                    <button 
                      onClick={viewCompanyDetails}
                      className='flex items-center gap-1.5 hover:text-[#00C8FF] transition-colors font-bold text-[#F3F4F6] bg-transparent border-none p-0 cursor-pointer'
                    >
                      <Building2 className='w-4.5 h-4.5 text-[#8040FF]' />
                      {companyName}
                    </button>
                    <span className='w-1 h-1 bg-white/20 rounded-full hidden sm:inline-block'></span>
                    <span className='flex items-center gap-1.5'>
                      <MapPin className='w-4 h-4 text-[#00C8FF]' />
                      {singleJob.location || "Remote"}
                    </span>
                    <span className='w-1 h-1 bg-white/20 rounded-full hidden sm:inline-block'></span>
                    {daysAgo && (
                      <span className='flex items-center gap-1.5'>
                        <Clock className='w-4 h-4 text-[#8040FF]' />
                        Posted {daysAgo}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Grid of badges */}
              <div className='pt-6 flex flex-wrap items-center gap-3'>
                <Badge className='text-[#8040FF] font-bold bg-[#8040FF]/10 border border-[#8040FF]/20 px-4 py-2 hover:bg-[#8040FF]/15 text-sm rounded-xl' variant='ghost'>
                  <Briefcase className='w-4.5 h-4.5 mr-2 inline-block' />
                  {singleJob.position} Position{singleJob.position > 1 ? 's' : ''}
                </Badge>
                <Badge className='text-[#00C8FF] font-bold bg-[#00C8FF]/10 border border-[#00C8FF]/20 px-4 py-2 hover:bg-[#00C8FF]/15 text-sm rounded-xl' variant='ghost'>
                  <Clock className='w-4.5 h-4.5 mr-2 inline-block' />
                  {singleJob.jobType}
                </Badge>
                <Badge className='text-[#10B981] font-bold bg-[#10B981]/10 border border-[#10B981]/20 px-4 py-2 hover:bg-[#10B981]/15 text-sm rounded-xl' variant='ghost'>
                  <IndianRupee className='w-4 h-4 mr-1 inline-block' />
                  ₹{singleJob.salary} LPA
                </Badge>
                <Badge className='text-amber-400 font-bold bg-amber-400/10 border border-amber-400/20 px-4 py-2 hover:bg-amber-400/15 text-sm rounded-xl' variant='ghost'>
                  <Award className='w-4.5 h-4.5 mr-2 inline-block' />
                  {singleJob.experienceLevel} Yrs Exp
                </Badge>
              </div>
            </div>

            {/* AI Skill Gap Panel (Only if showSkillGap is true) */}
            {showSkillGap && skillGap && (
              <div className='bg-gradient-to-br from-[#8040FF]/10 via-[#080C1E]/80 to-[#00C8FF]/5 rounded-3xl p-6 md:p-8 border border-[#8040FF]/30 shadow-[0_0_30px_rgba(128,64,255,0.1)] transition-all duration-300 relative overflow-hidden text-start'>
                <div className='absolute top-0 right-0 w-24 h-24 bg-[#8040FF]/10 rounded-full blur-xl pointer-events-none'></div>
                
                <div className='flex items-center justify-between mb-6 pb-4 border-b border-white/5'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-xl bg-[#8040FF]/20 flex items-center justify-center border border-[#8040FF]/30'>
                      <Sparkles className='w-5 h-5 text-[#8040FF]' />
                    </div>
                    <h3 className='font-extrabold text-2xl bg-gradient-to-r from-[#00C8FF] to-[#8040FF] bg-clip-text text-transparent'>
                      AI Skill Gap Analysis
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowSkillGap(false)}
                    className='text-muted-foreground hover:text-white transition-colors text-sm font-bold bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/5'
                  >
                    Dismiss
                  </button>
                </div>

                {skillGap.missingSkills && skillGap.missingSkills.length > 0 ? (
                  <div className='space-y-6'>
                    <div>
                      <div className='flex items-center gap-2 mb-3'>
                        <span className='w-2 h-2 rounded-full bg-red-500 animate-ping'></span>
                        <p className='font-bold text-red-400 text-base'>Skills you are missing for this role:</p>
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        {skillGap.missingSkills.map((skill, idx) => (
                          <span key={idx} className='bg-red-500/10 text-red-400 px-4 py-2 rounded-xl text-sm font-bold border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.05)] hover:bg-red-500/15 transition-all duration-200'>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {skillGap.suggestedResources && skillGap.suggestedResources.length > 0 && (
                      <div className='pt-2'>
                        <p className='font-bold text-foreground text-base mb-3 flex items-center gap-2'>
                          <GraduationCap className='w-5 h-5 text-[#00C8FF]' /> Suggested Learning Resources:
                        </p>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                          {skillGap.suggestedResources.map((resource, idx) => (
                            <a
                              key={idx}
                              href={resource.url}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='group/resource flex flex-col justify-between bg-[#050810]/60 rounded-2xl p-4 border border-white/5 hover:border-[#00C8FF]/30 hover:shadow-[0_0_20px_rgba(0,200,255,0.08)] hover:-translate-y-0.5 transition-all duration-300'
                            >
                              <div>
                                <h4 className='font-bold text-slate-200 group-hover/resource:text-[#00C8FF] transition-colors leading-snug line-clamp-1'>
                                  {resource.title}
                                </h4>
                                {resource.category && (
                                  <p className='text-xs text-muted-foreground font-semibold mt-1 uppercase tracking-wider'>{resource.category}</p>
                                )}
                              </div>
                              <div className='flex items-center justify-between mt-4 text-[#00C8FF] text-xs font-bold pt-2 border-t border-white/5 group-hover/resource:border-[#00C8FF]/20'>
                                <span>Start Course</span>
                                <ExternalLink className='w-3.5 h-3.5 group-hover/resource:translate-x-0.5 transition-transform' />
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className='flex flex-col items-center py-6 text-center space-y-3'>
                    <div className='w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.15)]'>
                      <CheckCircle2 className='w-8 h-8 text-emerald-400' />
                    </div>
                    <div>
                      <p className='text-emerald-400 text-lg font-bold'>Perfect Match!</p>
                      <p className='text-muted-foreground max-w-md mt-1'>Excellent, your resume and profile fully match the required skills for this position. You're ready to apply!</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* About the Job & Description */}
            <div className='bg-[#080C1E]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-8 shadow-custom text-start space-y-6'>
              <div className='flex items-center gap-3 border-b border-white/5 pb-4'>
                <div className='w-1.5 h-7 bg-gradient-to-b from-[#00C8FF] to-[#8040FF] rounded-full'></div>
                <h2 className='font-extrabold text-2xl text-foreground tracking-wide'>
                  Job Description
                </h2>
              </div>
              
              <div className='text-slate-300 leading-relaxed text-base font-medium space-y-4 whitespace-pre-line'>
                {singleJob.description}
              </div>
            </div>

            {/* Highlights Grid of Old Details */}
            <div className='bg-[#080C1E]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-8 shadow-custom text-start space-y-6'>
              <div className='flex items-center gap-3 border-b border-white/5 pb-4'>
                <div className='w-1.5 h-7 bg-[#8040FF] rounded-full'></div>
                <h2 className='font-extrabold text-2xl text-foreground tracking-wide'>
                  Key Job Details
                </h2>
              </div>
              
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                <JobDetail 
                  label='Role' 
                  value={singleJob.title} 
                  icon={<Briefcase className='w-5 h-5 text-[#00C8FF]' />} 
                />
                <JobDetail 
                  label='Location' 
                  value={singleJob.location || "Remote"} 
                  icon={<MapPin className='w-5 h-5 text-[#8040FF]' />} 
                />
                <JobDetail 
                  label='Salary' 
                  value={`₹${singleJob.salary} LPA`} 
                  icon={<IndianRupee className='w-5 h-5 text-emerald-400' />} 
                />
                <JobDetail 
                  label='Experience' 
                  value={`${singleJob.experienceLevel} yrs`} 
                  icon={<Award className='w-5 h-5 text-amber-400' />} 
                />
                <JobDetail 
                  label='Total Applicants' 
                  value={`${singleJob.applications.length} applied`} 
                  icon={<Users className='w-5 h-5 text-pink-400' />} 
                />
                <JobDetail 
                  label='Posted Date' 
                  value={singleJob.createdAt.split("T")[0]} 
                  icon={<Calendar className='w-5 h-5 text-cyan-400' />} 
                />
              </div>
            </div>

          </div>

          {/* Right Sidebar Panel */}
          <div className='lg:col-span-1 space-y-6'>
            
            {/* Action Panel Sticky Wrapper */}
            <div className='sticky top-24 space-y-6'>
              
              {/* Premium CTA & Action Panel */}
              <div className='bg-[#080C1E]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-[0_0_50px_rgba(0,200,255,0.02)] text-start relative overflow-hidden flex flex-col'>
                {/* Visual accent bar */}
                <div className='absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#00C8FF] to-[#8040FF]'></div>
                
                <h3 className='font-extrabold text-base text-foreground mb-4 uppercase tracking-wider flex items-center gap-2'>
                  <Info className='w-4 text-[#00C8FF]' /> Action Center
                </h3>

                <div className='space-y-4'>
                  <Button
                    onClick={isApplied ? null : applyJobHandler}
                    disabled={isApplied || applying}
                    className={`w-full rounded-2xl font-extrabold py-7 text-base transition-all duration-300 border-none shadow-[0_0_20px_rgba(0,200,255,0.2)] ${
                      isApplied
                        ? "bg-white/5 text-muted-foreground border border-white/10 cursor-not-allowed shadow-none hover:bg-white/5"
                        : "bg-[#00C8FF] hover:bg-[#00E5FF] text-[#050810] shadow-[0_0_25px_rgba(0,200,255,0.35)] hover:shadow-[0_0_35px_rgba(0,200,255,0.5)] hover:scale-[1.02]"
                    }`}
                  >
                    {isApplied ? "✓ Already Applied" : applying ? "Submitting Application..." : "Apply Now"}
                  </Button>

                  <Button
                    onClick={viewCompanyDetails}
                    className='w-full rounded-2xl bg-transparent border border-white/10 hover:border-[#00C8FF]/40 text-foreground hover:bg-[#00C8FF]/5 font-bold shadow-sm transition-all duration-300 py-6 flex items-center justify-center gap-2'
                  >
                    <Building2 className='w-4.5 h-4.5 text-[#00C8FF]' />
                    View Company Details
                  </Button>

                  {user?.role === "student" && (
                    <Button
                      onClick={fetchSkillGap}
                      className='w-full rounded-2xl bg-transparent border border-[#8040FF]/30 text-[#8040FF] hover:bg-[#8040FF] hover:text-[#050810] font-bold shadow-sm hover:shadow-[0_0_20px_rgba(128,64,255,0.15)] transition-all duration-300 py-6 flex items-center justify-center gap-2'
                    >
                      <Sparkles className='w-4.5 h-4.5' />
                      Check Skill Gap
                    </Button>
                  )}
                </div>

                {/* Sidebar Job Specifications */}
                <div className='mt-6 pt-6 border-t border-white/5 space-y-4 text-sm font-semibold'>
                  <div className='flex justify-between items-center'>
                    <span className='text-muted-foreground'>Job Type</span>
                    <span className='text-slate-200'>{singleJob.jobType}</span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-muted-foreground'>Salary Package</span>
                    <span className='text-emerald-400 font-bold'>₹{singleJob.salary} LPA</span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-muted-foreground'>Location</span>
                    <span className='text-slate-200'>{singleJob.location}</span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-muted-foreground'>Applicants</span>
                    <span className='text-slate-200 bg-white/5 border border-white/5 px-2.5 py-0.5 rounded-full text-xs'>{singleJob.applications.length} applied</span>
                  </div>
                </div>
              </div>

              {/* Similar Jobs Section */}
              <div className='bg-[#080C1E]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-custom overflow-hidden flex flex-col text-start'>
                <div className='flex items-center gap-2 border-b border-white/5 pb-3 mb-4'>
                  <Briefcase className='w-5 h-5 text-[#8040FF]' />
                  <h2 className='font-extrabold text-lg text-foreground tracking-wide uppercase'>
                    Similar Jobs
                  </h2>
                </div>

                <div className='space-y-4 max-h-[50vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-primary scrollbar-track-muted'>
                  {similarJobs.length > 0 ? (
                    <div className='space-y-4'>
                      {similarJobs?.map((job) => {
                        const simCompanyName = typeof job?.company === "object" ? job.company?.companyName : "NextHire Partner";
                        const simCompanyLogo = typeof job?.company === "object" ? job?.company?.logo?.url : null;
                        
                        return (
                          <div
                            key={job._id}
                            className='group/sim p-4 border border-white/5 rounded-2xl hover:border-[#00C8FF]/30 hover:shadow-[0_0_20px_rgba(0,200,255,0.08)] transition-all duration-300 bg-[#050810]/30 hover:-translate-y-0.5 flex flex-col gap-3'
                          >
                            <div className='flex gap-3 items-start'>
                              <div className='w-10 h-10 rounded-xl overflow-hidden border border-white/5 bg-[#050810]/80 p-1 flex items-center justify-center flex-shrink-0'>
                                <Avatar className='w-full h-full rounded-lg'>
                                  <AvatarImage src={simCompanyLogo} className='object-contain' />
                                  <AvatarFallback className='bg-gradient-to-br from-[#8040FF] to-[#00C8FF] text-[#050810] font-extrabold text-xs rounded-lg'>
                                    {simCompanyName.substring(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              </div>
                              <div className='min-w-0'>
                                <h3 className='font-extrabold text-base text-slate-100 group-hover/sim:text-[#00C8FF] transition-colors truncate'>{job.title}</h3>
                                <p className='text-muted-foreground text-xs font-semibold truncate mt-0.5'>{simCompanyName}</p>
                              </div>
                            </div>

                            <div className='flex flex-wrap gap-2 text-xs font-bold text-muted-foreground'>
                              <span className='flex items-center gap-1'><MapPin className='w-3 h-3 text-[#00C8FF]' /> {job.location}</span>
                              <span>•</span>
                              <span className='text-emerald-400'>₹{job.salary} LPA</span>
                              <span>•</span>
                              <span>{job.jobType}</span>
                            </div>

                            <Button
                              onClick={() => navigate(`/description/${job._id}`)}
                              className='w-full rounded-xl bg-white/5 hover:bg-[#00C8FF] hover:text-[#050810] text-foreground font-extrabold transition-all duration-300 py-4.5 border border-white/10 hover:border-transparent flex items-center justify-center gap-1'
                            >
                              <span>View Job</span>
                              <ChevronRight className='w-4 h-4 group-hover/sim:translate-x-1 transition-transform' />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className='text-center py-8'>
                      <p className='text-muted-foreground font-semibold'>No similar jobs found.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const JobDetail = ({ label, value, icon }) => (
  <div className='group/item bg-[#050810]/40 hover:bg-[#050810]/80 rounded-2xl p-4 border border-white/5 hover:border-[#00C8FF]/10 transition-all duration-300 flex items-start gap-4'>
    {icon && (
      <div className='w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center flex-shrink-0 group-hover/item:border-[#00C8FF]/20 group-hover/item:bg-[#00C8FF]/5 transition-all duration-300 shadow-sm'>
        {icon}
      </div>
    )}
    <div className='space-y-1 min-w-0'>
      <h3 className='font-bold text-muted-foreground text-xs uppercase tracking-wider'>{label}</h3>
      <p className='text-slate-200 leading-relaxed font-extrabold truncate text-sm sm:text-base'>{value}</p>
    </div>
  </div>
);

export default JobDescription;
