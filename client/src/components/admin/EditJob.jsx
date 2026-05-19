import React, { useState, useEffect } from "react";
import Navbar from "../layout/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Loader2 } from "lucide-react";
import ReactHelmet from "../common/ReactHelmet";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getCompanies } from "@/redux/slices/company.slice";
import { updateJob, getJobById } from "@/redux/slices/job.slice";
import Loader from "../common/Loader";

const EditJob = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [company, setCompany] = useState([]);
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: 0,
    companyId: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch job details
    dispatch(getJobById(id))
      .then((res) => {
        if (res?.payload?.status === 200) {
          const job = res.payload.job;
          setInput({
            title: job.title || "",
            description: job.description || "",
            requirements: job.requirements || "",
            salary: job.salary || "",
            location: job.location || "",
            jobType: job.jobType || "",
            experience: job.experienceLevel?.toString() || "",
            position: job.position || 0,
            companyId: job.company?._id || "",
          });
        }
        setFetching(false);
      })
      .catch(() => {
        toast.error("Failed to fetch job details");
        setFetching(false);
      });

    // Fetch companies
    dispatch(getCompanies())
      .then((res) => {
        if (res?.payload?.status === 200) {
          setCompany(res?.payload);
        }
      })
      .catch((error) => {
        console.error("Error fetching companies:", error);
      });
  }, [dispatch, id]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = (value) => {
    const selectedCompany = company?.companies?.find(
      (company) => company?.companyName === value
    );
    setInput({
      ...input,
      companyId: selectedCompany?._id,
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = {
      ...input,
      experienceLevel: input.experience ? parseFloat(input.experience) : undefined,
    };

    dispatch(updateJob({ jobId: id, data: formData }))
      .then((res) => {
        if (res?.payload?.status === 200) {
          toast.success(res?.payload?.message ?? "Job updated successfully.");
          setLoading(false);
          navigate(-1);
        } else {
          toast.error("An error occurred while updating the job.");
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("An unexpected error occurred.");
        setLoading(false);
      });
  };

  if (fetching) {
    return (
      <div>
        <Navbar />
        <Loader />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[#050810] relative overflow-hidden'>
      {/* Premium Cyber Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,200,255,0.03),transparent_40%)] pointer-events-none" />
      <div className="grid-overlay"></div>
      <div className="absolute top-20 left-10 w-[400px] h-[400px] border border-white/5 rounded-full pointer-events-none anim-spin-slow">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#00C8FF] rounded-full shadow-[0_0_10px_#00C8FF]" />
      </div>
      <div className="absolute bottom-20 right-10 w-[500px] h-[500px] border border-white/5 rounded-full pointer-events-none anim-spin-rev">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#8040FF] rounded-full shadow-[0_0_10px_#8040FF]" />
      </div>

      <Navbar />
      {loading && <Loader />}
      <ReactHelmet
        title='Modify Opportunity - Admin'
        description='Update job parameters, refine role requirements, and adjust compensation scales for active postings.'
        canonicalUrl='/admin/jobs/edit'
      />

      <div className='flex items-center justify-center w-full my-5 px-6 pt-24 pb-12 relative z-10'>
        <form
          onSubmit={submitHandler}
          className='p-10 max-w-4xl bg-[#080C1E]/80 backdrop-blur-xl border border-white/5 shadow-[0_0_50px_rgba(0,100,220,0.03)] rounded-3xl w-full relative overflow-hidden group'
        >
          <div className='absolute top-0 right-0 w-32 h-32 bg-[#00C8FF]/5 -mr-16 -mt-16 rounded-full blur-2xl group-hover:bg-[#00C8FF]/10 transition-colors duration-500'></div>
          
          <h1 className='text-4xl font-black mb-10 text-center tracking-tight'>
            <span className='bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent italic'>
              Modify{" "}
            </span>
            <span className='bg-gradient-to-r from-[#00C8FF] to-[#8040FF] bg-clip-text text-transparent'>
              Opportunity
            </span>
          </h1>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div className='space-y-2'>
              <Label className='font-extrabold text-white uppercase tracking-wider text-[10px] ml-1'>Role Title</Label>
              <Input
                type='text'
                name='title'
                value={input.title}
                onChange={changeEventHandler}
                className='w-full rounded-2xl bg-[#080C1E]/80 border-white/5 border-2 h-14 focus:ring-[#00C8FF]/20 focus:border-[#00C8FF]/50 text-white font-bold tracking-tight'
                required
              />
            </div>
            <div className='space-y-2'>
              <Label className='font-extrabold text-white uppercase tracking-wider text-[10px] ml-1'>Operational Context</Label>
              <Input
                type='text'
                name='description'
                value={input.description}
                onChange={changeEventHandler}
                className='w-full rounded-2xl bg-[#080C1E]/80 border-white/5 border-2 h-14 focus:ring-[#00C8FF]/20 focus:border-[#00C8FF]/50 text-white font-bold tracking-tight'
                required
              />
            </div>
            <div className='space-y-2'>
              <Label className='font-extrabold text-white uppercase tracking-wider text-[10px] ml-1'>Technical Stack</Label>
              <Input
                type='text'
                name='requirements'
                value={input.requirements}
                onChange={changeEventHandler}
                className='w-full rounded-2xl bg-[#080C1E]/80 border-white/5 border-2 h-14 focus:ring-[#00C8FF]/20 focus:border-[#00C8FF]/50 text-white font-bold tracking-tight'
                placeholder='e.g., React, Node.js, Python'
              />
            </div>
            <div className='space-y-2'>
              <Label className='font-extrabold text-white uppercase tracking-wider text-[10px] ml-1'>Annual Compensation (LPA)</Label>
              <Input
                type='text'
                name='salary'
                value={input.salary}
                onChange={changeEventHandler}
                className='w-full rounded-2xl bg-[#080C1E]/80 border-white/5 border-2 h-14 focus:ring-[#00C8FF]/20 focus:border-[#00C8FF]/50 text-white font-bold tracking-tight'
                placeholder='e.g., 500000'
              />
            </div>
            <div className='space-y-2'>
              <Label className='font-extrabold text-white uppercase tracking-wider text-[10px] ml-1'>Deployment Zone</Label>
              <Input
                type='text'
                name='location'
                value={input.location}
                onChange={changeEventHandler}
                className='w-full rounded-2xl bg-[#080C1E]/80 border-white/5 border-2 h-14 focus:ring-[#00C8FF]/20 focus:border-[#00C8FF]/50 text-white font-bold tracking-tight'
                placeholder='e.g., Mumbai Hub'
              />
            </div>
            <div className='space-y-2'>
              <Label className='font-extrabold text-white uppercase tracking-wider text-[10px] ml-1'>Contract Syntax</Label>
              <Input
                type='text'
                name='jobType'
                value={input.jobType}
                onChange={changeEventHandler}
                className='w-full rounded-2xl bg-[#080C1E]/80 border-white/5 border-2 h-14 focus:ring-[#00C8FF]/20 focus:border-[#00C8FF]/50 text-white font-bold tracking-tight'
                placeholder='e.g., Full-cycle, Remote'
              />
            </div>
            <div className='space-y-2'>
              <Label className='font-extrabold text-white uppercase tracking-wider text-[10px] ml-1'>Expertise Threshold (Years)</Label>
              <Input
                type='text'
                name='experience'
                value={input.experience}
                onChange={changeEventHandler}
                className='w-full rounded-2xl bg-[#080C1E]/80 border-white/5 border-2 h-14 focus:ring-[#00C8FF]/20 focus:border-[#00C8FF]/50 text-white font-bold tracking-tight'
                placeholder='e.g., 2-5'
              />
            </div>
            <div className='space-y-2'>
              <Label className='font-extrabold text-white uppercase tracking-wider text-[10px] ml-1'>Operational Scale</Label>
              <Input
                type='number'
                name='position'
                value={input.position}
                onChange={changeEventHandler}
                className='w-full rounded-2xl bg-[#080C1E]/80 border-white/5 border-2 h-14 focus:ring-[#00C8FF]/20 focus:border-[#00C8FF]/50 text-white font-bold tracking-tight'
                min='1'
              />
            </div>
            {company?.companies?.length > 0 && (
              <div className='md:col-span-2 space-y-2'>
                <Label className='font-extrabold text-white uppercase tracking-wider text-[10px] ml-1'>Enterprise Entity</Label>
                <Select
                  value={
                    company?.companies?.find((c) => c._id === input.companyId)
                      ?.companyName || ""
                  }
                  onValueChange={selectChangeHandler}
                >
                  <SelectTrigger className='w-full rounded-2xl bg-[#080C1E]/80 border-white/5 border-2 h-14 focus:ring-[#00C8FF]/20 focus:border-[#00C8FF]/50 text-white font-bold'>
                    <SelectValue placeholder='Select an enterprise profile' />
                  </SelectTrigger>
                  <SelectContent className='bg-[#080C1E] border-white/10'>
                    <SelectGroup>
                      {company?.companies?.map((company) => (
                        <SelectItem key={company?._id} value={company?.companyName} className='focus:bg-[#00C8FF]/10 focus:text-[#00C8FF] text-white transition-colors'>
                          {company?.companyName}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className='mt-10'>
            {loading ? (
              <Button
                className='w-full h-16 rounded-2xl bg-white/5 border border-white/10 text-white/40 font-black text-xl'
                disabled
              >
                <Loader2 className='mr-3 h-5 w-5 animate-spin' /> Finalizing Update...
              </Button>
            ) : (
              <Button
                type='submit'
                className='w-full h-16 rounded-2xl bg-gradient-to-r from-[#00C8FF] to-[#8040FF] text-[#050810] font-black text-xl shadow-[0_0_30px_rgba(0,200,255,0.3)] hover:shadow-[0_0_50px_rgba(0,200,255,0.5)] hover:scale-[1.01] transition-all duration-300 border-none'
              >
                Update Hub Record
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJob;

