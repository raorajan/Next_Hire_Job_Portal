import React, { useState, useMemo } from "react";
import { Button } from "../../ui/button";
import { Bookmark } from "lucide-react";
import { Avatar, AvatarImage } from "../../ui/avatar";
import { Badge } from "../../ui/badge";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { applyJob } from "@/redux/slices/application.slice";
import { toast } from "react-toastify";
import { getToken } from "@/utils/constant";

const Job = ({ job }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user?.user);
  const [hasApplied, setHasApplied] = useState(
    job?.applications?.some(
      (application) => application?.applicant === user?._id
    )
  );

  // Memoize days ago calculation for performance optimization
  const daysAgo = useMemo(() => {
    const createdAt = new Date(job?.createdAt);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
  }, [job?.createdAt]);

  const applyJobHandler = () => {
    const token = getToken();
    if (!token) return navigate("/login");
    if (!job?._id) {
      toast.error("Job ID is missing");
      return;
    }
    setHasApplied(true);
    dispatch(applyJob({ jobId: job._id }))
      .then((res) => {
        if (res?.payload?.status === 200) {
          toast.success(res?.payload?.message);
        } else {
          setHasApplied(false);
          toast.info(res?.payload?.message);
        }
      })
      .catch((error) => {
        console.error("Error applying for job:", error);
        toast.error(
          error?.response?.data?.message || "Failed to apply for job."
        );
        setHasApplied(false);
      });
  };

  const { company, location, title, description, position, jobType, salary } =
    job;

  return (
    <div className='group relative p-6 rounded-2xl bg-[#080C1E]/60 backdrop-blur-xl border border-white/5 flex flex-col h-full transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-[0_0_50px_rgba(0,200,255,0.15)] hover:border-[#00C8FF]/30 overflow-hidden'>
      {/* Ambient background hover spotlight & glass highlight */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#00C8FF]/5 rounded-full blur-xl group-hover:bg-[#00C8FF]/10 transition-all duration-300 -z-10"></div>
      <div className="absolute inset-0 bg-white/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
      
      <div className='relative z-10 flex flex-col h-full'>
        <div className='flex items-center justify-between mb-4'>
          <p className='text-xs font-bold text-[#00C8FF] bg-[#00C8FF]/10 border border-[#00C8FF]/20 px-3 py-1 rounded-full'>
            {daysAgo === 0 ? "Today" : `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`}
          </p>
          <Button variant='outline' className='rounded-full border-white/10 text-muted-foreground hover:border-[#00C8FF]/40 hover:text-[#00C8FF] hover:bg-[#00C8FF]/10' size='icon'>
            <Bookmark className='h-4 w-4' />
          </Button>
        </div>

        <div className='flex items-center gap-3 mb-4'>
          <div className='w-12 h-12 rounded-xl overflow-hidden border border-white/5 group-hover:border-[#00C8FF]/30 transition-colors duration-300 flex-shrink-0 bg-[#050810]/50'>
            <Avatar className='w-full h-full'>
              <AvatarImage src={company?.logo?.url} className='object-cover' />
            </Avatar>
          </div>
          <div className='flex-1 min-w-0 text-start'>
            <h1 className='font-bold text-lg text-foreground group-hover:text-[#00C8FF] transition-colors duration-300 truncate'>{company?.companyName}</h1>
            <p className='text-sm text-muted-foreground truncate font-semibold flex items-center gap-1.5'>
              <span className="inline-block w-1.5 h-1.5 bg-[#8040FF] rounded-full"></span>
              {location}
            </p>
          </div>
        </div>

        <div className='flex-grow mb-4 text-start'>
          <h2 className='font-extrabold text-xl text-foreground mb-2 group-hover:text-[#00C8FF] transition-colors duration-300 line-clamp-2'>
            {title}
          </h2>
          <p className='text-sm text-muted-foreground line-clamp-2 leading-relaxed font-medium'>{description}</p>
        </div>

        <div className='flex items-center gap-2 mb-4 flex-wrap'>
          <Badge className='text-[#8040FF] font-bold bg-[#8040FF]/10 border border-[#8040FF]/20 px-3 py-1 hover:bg-[#8040FF]/15' variant='ghost'>
            {position} Position{position > 1 ? 's' : ''}
          </Badge>
          <Badge className='text-[#00C8FF] font-bold bg-[#00C8FF]/10 border border-[#00C8FF]/20 px-3 py-1 hover:bg-[#00C8FF]/15' variant='ghost'>
            {jobType}
          </Badge>
          <Badge className='text-[#8040FF] font-bold bg-[#8040FF]/10 border border-[#8040FF]/20 px-3 py-1 hover:bg-[#8040FF]/15' variant='ghost'>
            ₹{salary} LPA
          </Badge>
        </div>

        <div className='flex justify-between gap-3 mt-auto pt-4 border-t border-white/5'>
          <Button
            onClick={() => navigate(`/description/${job?._id}`)}
            variant='outline'
            className='flex-1 border border-white/10 text-foreground hover:border-[#00C8FF]/40 hover:text-[#00C8FF] hover:bg-[#00C8FF]/5 transition-all duration-300 font-bold'
          >
            Details
          </Button>
          <Button
            onClick={hasApplied ? null : applyJobHandler}
            className={`flex-1 bg-[#00C8FF] hover:bg-[#00E5FF] text-[#050810] font-bold transition-all duration-300 shadow-[0_0_20px_rgba(0,200,255,0.3)] hover:shadow-[0_0_30px_rgba(0,200,255,0.5)] ${
              hasApplied ? "cursor-not-allowed opacity-60 bg-white/10 border border-white/10 text-muted-foreground shadow-none hover:bg-white/10" : ""
            }`}
            disabled={hasApplied}
          >
            {hasApplied ? "Applied" : "Apply Now"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Job;
