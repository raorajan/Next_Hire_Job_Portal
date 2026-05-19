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

import { Loader2, Sparkles, Brain } from "lucide-react";
import ReactHelmet from "../common/ReactHelmet";
import fetchFromApiServer from "@/services";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getCompanies } from "@/redux/slices/company.slice";
import { postJob } from "@/redux/slices/job.slice";
import Loader from "../common/Loader";

const PostJob = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
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
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiGeneratingText, setAiGeneratingText] = useState("Drafting role context...");

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
          
          // Pre-populate if companyId was passed via navigate state
          if (location.state?.companyId) {
            setInput((prev) => ({
              ...prev,
              companyId: location.state.companyId,
            }));
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching companies:", error);
      })
      .finally(() => setLoading(false));
  }, [dispatch, navigate, location]);


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

  const generateAiDescription = async () => {
    if (!input.title) {
      toast.error("Please specify a Role Title first to generate descriptive parameters.");
      return;
    }

    setAiGenerating(true);
    setAiGeneratingText("Initializing neural drafter...");
    
    const messages = [
      "Initializing neural drafter...",
      "Drafting role context...",
      "Formatting responsibilities...",
      "Structuring professional requirements...",
      "Optimizing SEO tags..."
    ];
    let msgIndex = 0;
    const interval = setInterval(() => {
      msgIndex = (msgIndex + 1) % messages.length;
      setAiGeneratingText(messages[msgIndex]);
    }, 1200);

    try {
      const response = await fetchFromApiServer("POST", "api/v1/job/generate-description", {
        title: input.title,
        skills: input.requirements,
        experience: input.experienceLevel,
      });

      if (response?.data?.success) {
        const { description, requirements } = response.data.data;
        setInput((prev) => ({
          ...prev,
          description: description,
          requirements: requirements,
        }));
        toast.success("✨ Job description generated by AI successfully!");
      } else {
        toast.error("Failed to generate description. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("AI service is currently establishing connectivity. Please try again.");
    } finally {
      clearInterval(interval);
      setAiGenerating(false);
    }
  };

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
        title='Deploy Opportunity - Admin'
        description='Initialize a new job record to begin the recruitment cycle. Define roles, specify compensations, and set expertise benchmarks.'
        canonicalUrl='/admin/jobs/create'
      />

      <div className='flex flex-col items-center justify-center w-full my-5 px-6 pt-24 pb-12 relative z-10'>
        {/* Back Button */}
        <div className="w-full max-w-4xl mb-6">
          <Button
            onClick={() => navigate(-1)}
            className='rounded-xl bg-white/5 border border-white/10 hover:border-[#00C8FF]/50 text-muted-foreground hover:text-white transition-all duration-300 px-6 py-2'
          >
            <span className="mr-2 italic">←</span> Back
          </Button>
        </div>

        <form
          onSubmit={submitHandler}
          className='p-10 max-w-4xl bg-[#080C1E]/80 backdrop-blur-xl border border-white/5 shadow-[0_0_50px_rgba(0,100,220,0.03)] rounded-3xl w-full relative overflow-hidden group'
        >
          <div className='absolute top-0 right-0 w-32 h-32 bg-[#00C8FF]/5 -mr-16 -mt-16 rounded-full blur-2xl group-hover:bg-[#00C8FF]/10 transition-colors duration-500'></div>
          
          <h1 className='text-4xl font-black mb-10 text-center tracking-tight'>
            <span className='bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent italic'>
              Deploy{" "}
            </span>
            <span className='bg-gradient-to-r from-[#00C8FF] to-[#8040FF] bg-clip-text text-transparent'>
              Opportunity
            </span>
          </h1>

          {/* AI Generating Scanner Overlay */}
          {aiGenerating && (
            <div className="absolute inset-0 bg-[#080C1E]/95 backdrop-blur-md z-50 flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-300">
              <div className="relative flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-[#00C8FF]/10 border-t-[#00C8FF] rounded-full animate-spin"></div>
                <Brain className="w-7 h-7 text-[#00C8FF] absolute animate-pulse" />
              </div>
              <div className="text-center">
                <p className="text-white font-extrabold tracking-wide uppercase text-xs animate-pulse">{aiGeneratingText}</p>
                <p className="text-[10px] text-muted-foreground/60 mt-1 font-bold uppercase tracking-widest">Quantum Engine Processing...</p>
              </div>
            </div>
          )}

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div className='space-y-2'>
              <Label className='font-extrabold text-white uppercase tracking-wider text-[10px] ml-1'>Role Title</Label>
              <div className="flex gap-2">
                <Input
                  type='text'
                  name='title'
                  value={input.title}
                  onChange={changeEventHandler}
                  placeholder='e.g., Lead Systems Architect'
                  className='flex-1 rounded-2xl bg-[#080C1E]/80 border-white/5 border-2 h-14 focus:ring-[#00C8FF]/20 focus:border-[#00C8FF]/50 text-white font-bold tracking-tight'
                  required
                />
                <Button
                  type="button"
                  onClick={generateAiDescription}
                  disabled={aiGenerating || !input.title}
                  className="rounded-2xl h-14 bg-[#00C8FF]/10 border border-[#00C8FF]/20 hover:border-[#00C8FF]/50 text-[#00C8FF] font-extrabold text-[10px] px-4 uppercase tracking-widest shrink-0 transition-all duration-300"
                >
                  {aiGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 mr-1 text-[#00C8FF]" />}
                  AI Generate
                </Button>
              </div>
            </div>
            <div className='space-y-2'>
              <Label className='font-extrabold text-white uppercase tracking-wider text-[10px] ml-1'>Operational Context (Description)</Label>
              <Input
                type='text'
                name='description'
                value={input.description}
                onChange={changeEventHandler}
                placeholder='Core responsibilities and team alignment'
                className='w-full rounded-2xl bg-[#080C1E]/80 border-white/5 border-2 h-14 focus:ring-[#00C8FF]/20 focus:border-[#00C8FF]/50 text-white font-bold tracking-tight'
                required
              />
            </div>
            <div className='space-y-2'>
              <Label className='font-extrabold text-white uppercase tracking-wider text-[10px] ml-1'>Technical Stack (Requirements)</Label>
              <Input
                type='text'
                name='requirements'
                value={input.requirements}
                onChange={changeEventHandler}
                className='w-full rounded-2xl bg-[#080C1E]/80 border-white/5 border-2 h-14 focus:ring-[#00C8FF]/20 focus:border-[#00C8FF]/50 text-white font-bold tracking-tight'
                placeholder='e.g., React, Node.js, GraphQL'
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
                placeholder='e.g., 1200000'
              />
            </div>
            <div className='space-y-2'>
              <Label className='font-extrabold text-white uppercase tracking-wider text-[10px] ml-1'>deployment Zone (Location)</Label>
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
              <Label className='font-extrabold text-white uppercase tracking-wider text-[10px] ml-1'>Contract Syntax (Job Type)</Label>
              <Input
                type='text'
                name='jobType'
                value={input.jobType}
                onChange={changeEventHandler}
                className='w-full rounded-2xl bg-[#080C1E]/80 border-white/5 border-2 h-14 focus:ring-[#00C8FF]/20 focus:border-[#00C8FF]/50 text-white font-bold tracking-tight'
                placeholder='e.g., Full-cycle, Hybrid'
              />
            </div>
            <div className='space-y-2'>
              <Label className='font-extrabold text-white uppercase tracking-wider text-[10px] ml-1'>Expertise Threshold (Years)</Label>
              <Input
                type='number'
                name='experienceLevel'
                value={input.experienceLevel}
                onChange={changeEventHandler}
                className='w-full rounded-2xl bg-[#080C1E]/80 border-white/5 border-2 h-14 focus:ring-[#00C8FF]/20 focus:border-[#00C8FF]/50 text-white font-bold tracking-tight'
                placeholder='e.g., 5'
                min='0'
              />
            </div>
            <div className='space-y-2'>
              <Label className='font-extrabold text-white uppercase tracking-wider text-[10px] ml-1'>Operational Scale (Positions)</Label>
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
                <Label className='font-extrabold text-white uppercase tracking-wider text-[10px] ml-1'>Target Enterprise Entity</Label>
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
                        <SelectItem
                          key={company?._id}
                          value={company?.companyName}
                          className='focus:bg-[#00C8FF]/10 focus:text-[#00C8FF] text-white transition-colors'
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
              <Button className='w-full h-16 rounded-2xl bg-white/5 border border-white/10 text-white/40 font-black text-xl' disabled>
                <Loader2 className='mr-3 h-5 w-5 animate-spin' /> Finalizing Deployment...
              </Button>
            ) : (
              <Button
                type='submit'
                className='w-full h-16 rounded-2xl bg-gradient-to-r from-[#00C8FF] to-[#8040FF] text-[#050810] font-black text-xl shadow-[0_0_30px_rgba(0,200,255,0.3)] hover:shadow-[0_0_50px_rgba(0,200,255,0.5)] hover:scale-[1.01] transition-all duration-300 border-none'
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
