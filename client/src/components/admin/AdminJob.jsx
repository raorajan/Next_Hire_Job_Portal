import React, { useEffect, useState } from "react";
import { FaPlus, FaBuilding, FaGlobe, FaMapMarkerAlt, FaExternalLinkAlt, FaBriefcase, FaUsers } from "react-icons/fa";
import Navbar from "../layout/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate, useParams } from "react-router-dom";
import AdminJobsTable from "./AdminJobsTable";
import ReactHelmet from "../common/ReactHelmet";
import Loader from "../common/Loader";
import { useDispatch, useSelector } from "react-redux";
import { getJobsByCompany, getCompanyById } from "@/redux/slices/company.slice";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

const AdminJobs = () => {
  const { id } = useParams();
  const [input, setInput] = useState("");
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Retrieve company info from Redux store
  const company = useSelector((state) => state.company.company);

  useEffect(() => {
    // Fetch company info and company jobs in parallel
    dispatch(getCompanyById(id));
    dispatch(getJobsByCompany(id)).then((res) => {
      if (res?.payload?.status === 200) {
        setJobs(res?.payload?.jobs || []);
        setFilteredJobs(res?.payload?.jobs || []);
      }
      setLoading(false);
    });
  }, [dispatch, id]);

  useEffect(() => {
    if (input) {
      setFilteredJobs(
        jobs.filter(
          (job) =>
            job?.title?.toLowerCase().includes(input?.toLowerCase()) ||
            job?.company?.companyName?.toLowerCase().includes(input.toLowerCase())
        )
      );
    } else {
      setFilteredJobs(jobs);
    }
  }, [input, jobs]);

  const handleJobDeletion = (deletedJobId) => {
    setJobs((prevJobs) => prevJobs?.filter((job) => job?._id !== deletedJobId));
    setFilteredJobs((prevFilteredJobs) =>
      prevFilteredJobs?.filter((job) => job?._id !== deletedJobId)
    );
  };

  // Calculate total applicants for stats card
  const totalApplicants = jobs.reduce((acc, job) => acc + (job?.applications?.length || 0), 0);

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
      {loading && <Loader />}
      <ReactHelmet
        title={`${company?.companyName || "Recruiter Terminal"} - Job Board`}
        description='Coordinate recruitment efforts, monitor active postings, and analyze candidate engagement across your enterprise portfolio.'
        canonicalUrl='/admin/jobs'
      />

      <div className='max-w-7xl mx-auto pt-24 pb-12 px-6 relative z-10 space-y-8'>
        
        {/* Navigation & Header Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Button
            onClick={() => navigate("/profile")}
            className='rounded-xl bg-white/5 border border-white/10 hover:border-[#00C8FF]/50 text-muted-foreground hover:text-white transition-all duration-300 px-5 py-2'
          >
            <span className="mr-2 italic">←</span> Command Center Profile
          </Button>

          <Button
            onClick={() => navigate("/profile/admin/jobs/create", { state: { companyId: id } })}
            className='rounded-xl bg-[#00C8FF] hover:bg-[#00E5FF] text-[#050810] font-black px-6 py-5 shadow-[0_0_20px_rgba(0,200,255,0.3)] hover:shadow-[0_0_30px_rgba(0,200,255,0.5)] hover:scale-[1.02] transition-all duration-300 border-none shrink-0'
          >
            <FaPlus className='mr-2' /> Deploy New Posting
          </Button>
        </div>

        {/* Company Identity Hero Banner Card */}
        {company && (
          <div className="bg-[#080C1E]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,100,220,0.03)] hover:border-[#00C8FF]/20 transition-all duration-300">
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
              
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
                <div className="relative group">
                  <div className="absolute inset-0 bg-[#00C8FF]/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  <Avatar className="w-24 h-24 border-2 border-white/10 rounded-2xl overflow-hidden relative z-10">
                    <AvatarImage src={company?.logo?.url} className="object-cover" />
                    <AvatarFallback className="bg-[#8040FF]/20 text-[#8040FF] font-black text-2xl">
                      <FaBuilding />
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="space-y-2 text-start">
                  <h1 className="text-3xl font-black text-white tracking-wide flex items-center gap-3">
                    {company?.companyName}
                    <span className="text-xs uppercase tracking-widest bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md font-bold">
                      Verified Node
                    </span>
                  </h1>
                  <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-2xl">
                    {company?.description || "No corporate statement registered."}
                  </p>
                  
                  {/* Company metadata badges */}
                  <div className="flex flex-wrap gap-4 pt-2 text-xs font-bold uppercase tracking-wider text-white/80">
                    <div className="flex items-center gap-1.5 bg-white/5 border border-white/5 px-3 py-1.5 rounded-xl">
                      <FaMapMarkerAlt className="text-[#00C8FF]" />
                      <span>{company?.location || "Global Infrastructure"}</span>
                    </div>
                    {company?.website && (
                      <a
                        href={company?.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-[#00C8FF]/10 border border-[#00C8FF]/20 hover:border-[#00C8FF]/50 text-[#00C8FF] px-3 py-1.5 rounded-xl transition-all"
                      >
                        <FaGlobe />
                        <span>Corporate Portal</span>
                        <FaExternalLinkAlt className="w-2 h-2" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats overview right side */}
              <div className="grid grid-cols-2 gap-4 w-full md:w-auto shrink-0 pt-4 md:pt-0">
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-start hover:border-[#00C8FF]/20 transition-all duration-300">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">
                    <FaBriefcase className="text-[#00C8FF]" />
                    <span>Active Postings</span>
                  </div>
                  <span className="text-3xl font-black text-white">{jobs.length}</span>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-start hover:border-[#8040FF]/20 transition-all duration-300">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">
                    <FaUsers className="text-[#8040FF]" />
                    <span>Total Applicants</span>
                  </div>
                  <span className="text-3xl font-black text-white">{totalApplicants}</span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Search & Filter Terminal Bar */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-[#00C8FF] rounded-full"></div>
              <h2 className="text-xl font-extrabold text-white tracking-wide uppercase">Deployments Registry</h2>
            </div>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
              Found {filteredJobs.length} match{filteredJobs.length !== 1 ? "es" : ""}
            </p>
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-muted-foreground group-focus-within:text-[#00C8FF] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <Input
              className="w-full bg-[#080C1E]/80 backdrop-blur-xl border-white/5 border-2 h-16 rounded-2xl pl-12 focus:ring-[#00C8FF]/20 focus:border-[#00C8FF]/50 text-xl font-bold tracking-tight text-[#E6EDF3] placeholder:text-muted-foreground"
              placeholder="Filter postings by role or title context..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          
          {/* Jobs List table/grid container */}
          <div className="bg-[#080C1E]/40 backdrop-blur-xl rounded-3xl border border-white/5 shadow-[0_0_50px_rgba(0,100,220,0.03)] p-2 overflow-hidden">
            <AdminJobsTable jobs={filteredJobs} onDeleteJob={handleJobDeletion} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminJobs;
