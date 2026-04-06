import React from "react";
import { useNavigate } from "react-router-dom";

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      className="group relative p-6 rounded-2xl shadow-custom bg-card backdrop-blur-sm border border-border cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-neon hover:border-primary/50 overflow-hidden"
    >
      {/* Background overlay on hover */}
      <div className="absolute inset-0 bg-muted/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10">
        <div className="mb-4">
          <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors duration-300">
            {job?.company?.companyName || "Company Name"}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{job?.location || "Location"}</p>
        </div>
        
        <div className="mb-4">
          <h2 className="font-extrabold text-xl text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
            {job?.title}
          </h2>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {job?.description || "No description available"}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 mt-6">
          {job?.position && (
            <span className="px-3 py-1.5 text-sm font-semibold text-secondary bg-secondary/10 rounded-lg border border-secondary/30 transition-colors duration-300">
              {job.position} Position{job.position > 1 ? "s" : ""}
            </span>
          )}
          {job?.jobType && (
            <span className="px-3 py-1.5 text-sm font-semibold text-primary bg-primary/10 rounded-lg border border-primary/30 transition-colors duration-300">
              {job.jobType}
            </span>
          )}
          {job?.salary && (
            <span className="px-3 py-1.5 text-sm font-semibold text-secondary bg-secondary/10 rounded-lg border border-secondary/30 transition-colors duration-300">
              ₹{job.salary} LPA
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default LatestJobCards;
