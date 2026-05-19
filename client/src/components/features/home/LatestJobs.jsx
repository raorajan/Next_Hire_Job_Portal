import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import LatestJobCards from "./LatestJobCards";
import { getAllJobs } from "@/redux/slices/job.slice";
import Loader from "../../common/Loader";
import { Button } from "../../ui/button";

const LatestJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestJobs = async () => {
      try {
        setLoading(true);
        const res = await dispatch(
          getAllJobs({ page: 1, limit: 6, sortBy: "createdAt", sortOrder: "desc" })
        );
        if (res?.payload?.status === 200 && res?.payload?.jobs) {
          setJobs(res.payload.jobs);
        }
      } catch (error) {
        console.error("Error fetching latest jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestJobs();
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 relative bg-transparent">
      {/* Background decoration with slow rotating orbits */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#00C8FF]/5 rounded-full blur-[110px] anim-spin-slow"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#8040FF]/5 rounded-full blur-[110px] anim-spin-rev"></div>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-[-0.02em]">
          <span className="text-[#E6EDF3]">
            Latest & Top{" "}
          </span>
          <span className="bg-gradient-to-r from-[#00C8FF] to-[#8040FF] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,229,255,0.3)] font-black">
            Job Openings
          </span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
          Discover the most recent verified job listings. Apply now and advance your career pathways!
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader />
        </div>
      ) : jobs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {jobs.map((job) => (
              <LatestJobCards key={job._id} job={job} />
            ))}
          </div>
          <div className="text-center">
            <Button
              onClick={() => navigate("/jobs")}
              className="bg-[#00C8FF] hover:bg-[#00E5FF] text-[#050810] px-8 py-3 rounded-full shadow-[0_0_20px_rgba(0,200,255,0.3)] hover:shadow-[0_0_35px_rgba(0,200,255,0.6)] transform hover:scale-105 transition-all duration-300 font-bold"
            >
              View All Jobs
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg font-medium">No jobs available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default LatestJobs;
