import React from "react";
import { useNavigate } from "react-router-dom";

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      className="group relative p-6 rounded-2xl bg-[#080C1E]/60 backdrop-blur-xl border border-white/5 cursor-pointer transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-[0_0_50px_rgba(0,200,255,0.15)] hover:border-[#00C8FF]/30 overflow-hidden"
    >
      {/* Ambient background hover spotlight & glass highlight */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#00C8FF]/5 rounded-full blur-xl group-hover:bg-[#00C8FF]/10 transition-all duration-300 -z-10"></div>
      <div className="absolute inset-0 bg-white/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
      
      <div className="relative z-10">
        <div className="mb-4">
          <h3 className="font-bold text-xl text-[#8B949E] group-hover:text-[#00C8FF] transition-colors duration-300">
            {job?.company?.companyName || "Company Name"}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 font-semibold flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 bg-[#8040FF] rounded-full"></span>
            {job?.location || "Location"}
          </p>
        </div>
        
        <div className="mb-4">
          <h2 className="font-extrabold text-xl text-foreground mb-2 group-hover:text-[#00C8FF] transition-colors duration-300">
            {job?.title}
          </h2>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed font-medium">
            {job?.description || "No description available"}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 mt-6">
          {job?.position && (
            <span className="px-3 py-1.5 text-sm font-bold text-[#8040FF] bg-[#8040FF]/10 rounded-lg border border-[#8040FF]/20 transition-colors duration-300">
              {job.position} Position{job.position > 1 ? "s" : ""}
            </span>
          )}
          {job?.jobType && (
            <span className="px-3 py-1.5 text-sm font-bold text-[#00C8FF] bg-[#00C8FF]/10 rounded-lg border border-[#00C8FF]/20 transition-colors duration-300">
              {job.jobType}
            </span>
          )}
          {job?.salary && (
            <span className="px-3 py-1.5 text-sm font-bold text-[#8040FF] bg-[#8040FF]/10 rounded-lg border border-[#8040FF]/20 transition-colors duration-300">
              ₹{job.salary} LPA
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default LatestJobCards;
