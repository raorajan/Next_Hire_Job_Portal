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
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getCompanies } from "@/redux/slices/company.slice";
import { postJob } from "@/redux/slices/job.slice";
import Loader from "../common/Loader";

const PostJob = () => {
  const dispatch = useDispatch();
  const [company, setCompany] = useState([]);
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experienceLevel: "",
    position: 0,
    companyId: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = (value) => {
    const selectedCompany = company?.companies?.find(
      (company) => company?.companyName === value // Use optional chaining
    );
    setInput({
      ...input,
      companyId: selectedCompany?._id, // Use optional chaining for safety
    });
  };

  useEffect(() => {
    setLoading(true);
    dispatch(getCompanies())
      .then((res) => {
        if (res?.payload?.status === 200) {
          setCompany(res?.payload);
          if (!res?.payload?.companies?.length) {
            toast.info("Create a company first to continue posting jobs.");
            navigate("/profile/admin/companies/create");
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching companies:", error);
      })
      .finally(() => setLoading(false));
  }, [dispatch, navigate]);

  const validateForm = () => {
    const requiredFields = [
      "title",
      "description",
      "requirements",
      "salary",
      "location",
      "jobType",
      "experienceLevel",
    ];

    for (const field of requiredFields) {
      if (!input[field] || String(input[field]).trim().length === 0) {
        toast.error(`Please provide a valid ${field}.`);
        return false;
      }
    }

    if (!input.companyId) {
      toast.error("Please select a company before posting the job.");
      return false;
    }

    if (Number(input.salary) <= 0 || Number.isNaN(Number(input.salary))) {
      toast.error("Salary must be a positive number.");
      return false;
    }

    if (Number(input.position) <= 0 || Number.isNaN(Number(input.position))) {
      toast.error("Number of positions must be at least 1.");
      return false;
    }

    if (Number(input.experienceLevel) < 0 || Number.isNaN(Number(input.experienceLevel))) {
      toast.error("Experience level must be zero or a positive number.");
      return false;
    }

    return true;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    const formData = {
      ...input,
    };
    dispatch(postJob(formData))
      .then((res) => {
        if (res?.payload?.status === 200) {
          toast.success(res?.payload?.message ?? "Job posted successfully.");
          setLoading(false);
          navigate(-1);
        } else {
          toast.error("An error occurred while posting the job.");
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("An unexpected error occurred.");
        setLoading(false);
      });
  };

  return (
    <div className='min-h-screen bg-background relative overflow-hidden'>
      {/* Background decorations */}
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        <div className='absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-pulse'></div>
        <div className='absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] animate-pulse'></div>
      </div>

      <Navbar />
      {loading && <Loader />}
      <ReactHelmet
        title='Deploy Opportunity - Admin'
        description='Initialize a new job record to begin the recruitment cycle. Define roles, specify compensations, and set expertise benchmarks.'
        canonicalUrl='/admin/jobs/create'
      />

      <div className='flex items-center justify-center w-full my-5 px-6 pt-24 pb-12 relative z-10'>
        <form
          onSubmit={submitHandler}
          className='p-10 max-w-4xl bg-card/60 backdrop-blur-xl border border-border shadow-custom rounded-3xl w-full relative overflow-hidden group'
        >
          <div className='absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500'></div>
          
          <h1 className='text-4xl font-black mb-10 text-center tracking-tight'>
            <span className='bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent italic'>
              Deploy{" "}
            </span>
            <span className='bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
              Opportunity
            </span>
          </h1>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div className='space-y-2'>
              <Label className='font-extrabold text-foreground uppercase tracking-wider text-[10px] ml-1'>Role Title</Label>
              <Input
                type='text'
                name='title'
                value={input.title}
                onChange={changeEventHandler}
                placeholder='e.g., Lead Systems Architect'
                className='w-full rounded-2xl bg-muted/20 border-border border-2 h-14 focus:ring-primary/20 focus:border-primary/50 text-foreground font-bold tracking-tight'
                required
              />
            </div>
            <div className='space-y-2'>
              <Label className='font-extrabold text-foreground uppercase tracking-wider text-[10px] ml-1'>Operational Context (Description)</Label>
              <Input
                type='text'
                name='description'
                value={input.description}
                onChange={changeEventHandler}
                placeholder='Core responsibilities and team alignment'
                className='w-full rounded-2xl bg-muted/20 border-border border-2 h-14 focus:ring-primary/20 focus:border-primary/50 text-foreground font-bold tracking-tight'
                required
              />
            </div>
            <div className='space-y-2'>
              <Label className='font-extrabold text-foreground uppercase tracking-wider text-[10px] ml-1'>Technical Stack (Requirements)</Label>
              <Input
                type='text'
                name='requirements'
                value={input.requirements}
                onChange={changeEventHandler}
                className='w-full rounded-2xl bg-muted/20 border-border border-2 h-14 focus:ring-primary/20 focus:border-primary/50 text-foreground font-bold tracking-tight'
                placeholder='e.g., React, Node.js, GraphQL'
              />
            </div>
            <div className='space-y-2'>
              <Label className='font-extrabold text-foreground uppercase tracking-wider text-[10px] ml-1'>Annual Compensation (LPA)</Label>
              <Input
                type='text'
                name='salary'
                value={input.salary}
                onChange={changeEventHandler}
                className='w-full rounded-2xl bg-muted/20 border-border border-2 h-14 focus:ring-primary/20 focus:border-primary/50 text-foreground font-bold tracking-tight'
                placeholder='e.g., 1200000'
              />
            </div>
            <div className='space-y-2'>
              <Label className='font-extrabold text-foreground uppercase tracking-wider text-[10px] ml-1'>deployment Zone (Location)</Label>
              <Input
                type='text'
                name='location'
                value={input.location}
                onChange={changeEventHandler}
                className='w-full rounded-2xl bg-muted/20 border-border border-2 h-14 focus:ring-primary/20 focus:border-primary/50 text-foreground font-bold tracking-tight'
                placeholder='e.g., Mumbai Hub'
              />
            </div>
            <div className='space-y-2'>
              <Label className='font-extrabold text-foreground uppercase tracking-wider text-[10px] ml-1'>Contract Syntax (Job Type)</Label>
              <Input
                type='text'
                name='jobType'
                value={input.jobType}
                onChange={changeEventHandler}
                className='w-full rounded-2xl bg-muted/20 border-border border-2 h-14 focus:ring-primary/20 focus:border-primary/50 text-foreground font-bold tracking-tight'
                placeholder='e.g., Full-cycle, Hybrid'
              />
            </div>
            <div className='space-y-2'>
              <Label className='font-extrabold text-foreground uppercase tracking-wider text-[10px] ml-1'>Expertise Threshold (Years)</Label>
              <Input
                type='number'
                name='experienceLevel'
                value={input.experienceLevel}
                onChange={changeEventHandler}
                className='w-full rounded-2xl bg-muted/20 border-border border-2 h-14 focus:ring-primary/20 focus:border-primary/50 text-foreground font-bold tracking-tight'
                placeholder='e.g., 5'
                min='0'
              />
            </div>
            <div className='space-y-2'>
              <Label className='font-extrabold text-foreground uppercase tracking-wider text-[10px] ml-1'>Operational Scale (Positions)</Label>
              <Input
                type='number'
                name='position'
                value={input.position}
                onChange={changeEventHandler}
                className='w-full rounded-2xl bg-muted/20 border-border border-2 h-14 focus:ring-primary/20 focus:border-primary/50 text-foreground font-bold tracking-tight'
                min='1'
              />
            </div>
            {company?.companies?.length > 0 && (
              <div className='md:col-span-2 space-y-2'>
                <Label className='font-extrabold text-foreground uppercase tracking-wider text-[10px] ml-1'>Target Enterprise Entity</Label>
                <Select onValueChange={selectChangeHandler}>
                  <SelectTrigger className='w-full rounded-2xl bg-muted/20 border-border border-2 h-14 focus:ring-primary/20 focus:border-primary/50 text-foreground font-bold'>
                    <SelectValue placeholder='Select an enterprise profile' />
                  </SelectTrigger>
                  <SelectContent className='bg-card border-border'>
                    <SelectGroup>
                      {company?.companies?.map((company) => (
                        <SelectItem
                          key={company?._id}
                          value={company?.companyName}
                          className='focus:bg-primary/10 focus:text-primary transition-colors'
                        >
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
              <Button className='w-full h-16 rounded-2xl bg-muted border border-border text-muted-foreground font-black text-xl' disabled>
                <Loader2 className='mr-3 h-5 w-5 animate-spin' /> Finalizing Deployment...
              </Button>
            ) : (
              <Button
                type='submit'
                className='w-full h-16 rounded-2xl bg-gradient-to-r from-primary to-secondary text-primary-foreground font-black text-xl shadow-neon hover:scale-[1.01] transition-all duration-300 border-none'
                disabled={!company?.companies?.length}
              >
                Sync with Platform Hub
              </Button>
            )}
          </div>

          {company?.companies?.length === 0 && (
            <div className='mt-6 bg-destructive/10 border border-destructive/30 rounded-2xl p-6 text-center animate-pulse'>
              <p className='text-sm text-destructive font-black uppercase tracking-widest'>
                * Enterprise Registry Missing. Initialize a company profile to enable posting.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PostJob;
