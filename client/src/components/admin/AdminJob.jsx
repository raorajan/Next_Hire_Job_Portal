import React, { useEffect, useState } from "react";
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
    <div className='min-h-screen bg-background relative overflow-hidden'>
      {/* Background decorations */}
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        <div className='absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-pulse'></div>
        <div className='absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] animate-pulse'></div>
      </div>

      <Navbar />
      {loading && <Loader />}
      <ReactHelmet
        title='Recruiter Terminal - Admin'
        description='Coordinate recruitment efforts, monitor active postings, and analyze candidate engagement across your enterprise portfolio.'
        canonicalUrl='/admin/jobs'
      />

      <div className='max-w-6xl mx-auto pt-24 pb-12 px-6 relative z-10'>
        <div className='flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6'>
          <div>
            <h1 className='text-4xl font-black tracking-tight text-foreground mb-2'>
              Recruiter <span className='bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent italic'>Terminal</span>
            </h1>
            <p className='text-muted-foreground font-medium'>Command active postings and streamline your talent acquisition pipeline.</p>
          </div>
          <Button
            onClick={() => navigate("/profile/admin/jobs/create")}
            className='rounded-xl bg-primary text-primary-foreground font-black px-8 py-6 shadow-neon-sm hover:shadow-neon hover:scale-[1.02] transition-all duration-300 border-none'
          >
            <FaPlus className='mr-2' /> Deploy New Posting
          </Button>
        </div>

        <div className='space-y-8'>
          <div className='relative group'>
            <div className='absolute inset-y-0 left-4 flex items-center pointer-events-none'>
              <svg className='w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
              </svg>
            </div>
            <Input
              className='w-full bg-card/50 backdrop-blur-md border-border border-2 h-16 rounded-2xl pl-12 focus:ring-primary/20 focus:border-primary/50 text-xl font-bold tracking-tight placeholder:text-muted-foreground'
              placeholder='Filter postings by role, context, or status...'
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          
          <div className='bg-card/40 backdrop-blur-md rounded-3xl border border-border shadow-custom p-2 overflow-hidden'>
            <AdminJobsTable jobs={filteredJobs} onDeleteJob={handleJobDeletion} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminJobs;
