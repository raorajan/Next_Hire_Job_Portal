import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import Navbar from "../layout/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate, useParams } from "react-router-dom";
import AdminJobsTable from "./AdminJobsTable";
import ReactHelmet from "../common/ReactHelmet";
import Loader from "../common/Loader";
import { useDispatch } from "react-redux";
import { getJobsByCompany } from "@/redux/slices/company.slice";
import { deleteJob } from "@/redux/slices/job.slice";

const AdminJobs = () => {
  const { id } = useParams();
  const [input, setInput] = useState("");
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
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
        title='Recruiter Terminal - Admin'
        description='Coordinate recruitment efforts, monitor active postings, and analyze candidate engagement across your enterprise portfolio.'
        canonicalUrl='/admin/jobs'
      />

      <div class='max-w-6xl mx-auto pt-24 pb-12 px-6 relative z-10'>
        {/* Back Button */}
        <div className="mb-6">
          <Button
            onClick={() => navigate("/profile/admin/companies")}
            className='rounded-xl bg-white/5 border border-white/10 hover:border-[#00C8FF]/50 text-muted-foreground hover:text-white transition-all duration-300 px-6 py-2'
          >
            <span className="mr-2 italic">←</span> Back to Enterprises
          </Button>
        </div>

        <div className='flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6'>
          <div>
            <h1 className='text-4xl font-black tracking-tight text-white mb-2'>
              Recruiter <span className='text-[#00C8FF] drop-shadow-[0_0_15px_rgba(0,200,255,0.4)] italic'>Terminal</span>
            </h1>
            <p className='text-muted-foreground font-medium'>Command active postings and streamline your talent acquisition pipeline.</p>
          </div>
          <Button
            onClick={() => navigate("/profile/admin/jobs/create")}
            className='rounded-xl bg-[#00C8FF] hover:bg-[#00E5FF] text-[#050810] font-black px-8 py-6 shadow-[0_0_20px_rgba(0,200,255,0.3)] hover:shadow-[0_0_30px_rgba(0,200,255,0.5)] hover:scale-[1.02] transition-all duration-300 border-none'
          >
            <FaPlus className='mr-2' /> Deploy New Posting
          </Button>
        </div>

        <div className='space-y-8'>
          <div className='relative group'>
            <div className='absolute inset-y-0 left-4 flex items-center pointer-events-none'>
              <svg className='w-5 h-5 text-muted-foreground group-focus-within:text-[#00C8FF] transition-colors' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
              </svg>
            </div>
            <Input
              className='w-full bg-[#080C1E]/80 backdrop-blur-xl border-white/5 border-2 h-16 rounded-2xl pl-12 focus:ring-[#00C8FF]/20 focus:border-[#00C8FF]/50 text-xl font-bold tracking-tight text-[#E6EDF3] placeholder:text-muted-foreground'
              placeholder='Filter postings by role, context, or status...'
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          
          <div className='bg-[#080C1E]/40 backdrop-blur-xl rounded-3xl border border-white/5 shadow-[0_0_50px_rgba(0,100,220,0.03)] p-2 overflow-hidden'>
            <AdminJobsTable jobs={filteredJobs} onDeleteJob={handleJobDeletion} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminJobs;
