import React, { useEffect, useState, useRef } from "react";
import Navbar from "../../layout/Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { motion } from "framer-motion";
import ReactHelmet from "../../common/ReactHelmet";
import { getAllJobs, getFitlerOptions } from "@/redux/slices/job.slice";
import { getRecommendedJobs } from "@/redux/slices/user.slice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../common/Loader";
import { Link } from "react-router-dom";
import { FaFilter } from "react-icons/fa";

const Jobs = () => {
  const dispatch = useDispatch();
  const { filterOption } = useSelector((state) => state.job);
  const user = useSelector((state) => state.user.user);
  const [filterOptions, setFilterOptions] = useState(filterOption);
  const [allJobs, setAllJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [filterJobs, setFilterJobs] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [searchParams, setSearchParams] = useState({
    title: "",
    experienceLevel: "",
    location: "",
    jobType: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 10,
  });

  const currentPageRef = useRef(1);
  const totalPagesRef = useRef(null);
  const isLoadingRef = useRef(false);
  const debounceTimerRef = useRef(null);
  const isFetchingRef = useRef(false); // New ref to track fetching state
  const lastScrollPositionRef = useRef(0); // Track last scroll position

  const fetchJobs = () => {
    if (!hasMore || isLoadingRef.current || isFetchingRef.current) return;
    
    isFetchingRef.current = true;
    isLoadingRef.current = true;
    setLoading(true);
    setError(null);
    
    const sanitizedParams = {
      ...searchParams,
      page: currentPageRef.current,
      limit: searchParams.limit || 10,
    };
    
    dispatch(getAllJobs(sanitizedParams))
      .then((res) => {
        if (res?.payload?.status === 200) {
          const newJobs = res?.payload?.jobs;
          
          if (currentPageRef.current === 1) {
            setAllJobs(newJobs);
            setFilterJobs(newJobs);
          } else {
            setAllJobs(prevJobs => {
              const uniqueJobs = [
                ...new Set([...prevJobs, ...newJobs]?.map((job) => job._id)),
              ]?.map((id) =>
                [...prevJobs, ...newJobs].find((job) => job._id === id)
              );
              return uniqueJobs;
            });
            
            setFilterJobs(prevJobs => {
              const uniqueJobs = [
                ...new Set([...prevJobs, ...newJobs]?.map((job) => job._id)),
              ]?.map((id) =>
                [...prevJobs, ...newJobs].find((job) => job._id === id)
              );
              return uniqueJobs;
            });
          }

          const { currentPage, totalPages } = res.payload;
          totalPagesRef.current = totalPages;
          setHasMore(currentPage < totalPages);
          
          if (currentPage === currentPageRef.current) {
            currentPageRef.current += 1;
          }
        } else {
          setError("Failed to load jobs.");
        }
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
        setError("An error occurred while fetching jobs.");
      })
      .finally(() => {
        isLoadingRef.current = false;
        setLoading(false);
        // Small delay before allowing next fetch to prevent rapid successive calls
        setTimeout(() => {
          isFetchingRef.current = false;
        }, 500);
      });
  };

  const fetchRecommendedJobs = () => {
    if (!hasMore || isLoadingRef.current || isFetchingRef.current) return;
    
    isFetchingRef.current = true;
    isLoadingRef.current = true;
    setLoading(true);
    setError(null);
    
    const sanitizedParams = {
      ...searchParams,
      page: currentPageRef.current,
      limit: searchParams.limit || 10,
    };
    
    dispatch(getRecommendedJobs(sanitizedParams))
      .then((res) => {
        if (res?.payload?.status === 200) {
          const newJobs = res?.payload?.jobs;

          if (currentPageRef.current === 1) {
            setRecommendedJobs(newJobs);
            setFilterJobs(newJobs);
          } else {
            setRecommendedJobs(prevJobs => {
              const uniqueJobs = [
                ...new Set([...prevJobs, ...newJobs]?.map((job) => job._id)),
              ]?.map((id) =>
                [...prevJobs, ...newJobs].find((job) => job._id === id)
              );
              return uniqueJobs;
            });
            
            setFilterJobs(prevJobs => {
              const uniqueJobs = [
                ...new Set([...prevJobs, ...newJobs]?.map((job) => job._id)),
              ]?.map((id) =>
                [...prevJobs, ...newJobs].find((job) => job._id === id)
              );
              return uniqueJobs;
            });
          }

          const { currentPage, totalPages } = res.payload;
          totalPagesRef.current = totalPages;
          setHasMore(currentPage < totalPages);
          
          if (currentPage === currentPageRef.current) {
            currentPageRef.current += 1;
          }
        } else {
          setError("Failed to load recommended jobs.");
        }
      })
      .catch((error) => {
        console.error("Error fetching recommended jobs:", error);
        setError("An error occurred while fetching recommended jobs.");
      })
      .finally(() => {
        isLoadingRef.current = false;
        setLoading(false);
        setTimeout(() => {
          isFetchingRef.current = false;
        }, 500);
      });
  };

  const handleScroll = () => {
    // Clear previous debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Debounce scroll event
    debounceTimerRef.current = setTimeout(() => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      
      // Store current scroll position
      lastScrollPositionRef.current = scrollTop;
      
      // Calculate if we're near the bottom (within 300px)
      const distanceToBottom = scrollHeight - (scrollTop + clientHeight);
      const isNearBottom = distanceToBottom <= 300;
      
      // Prevent fetching if we're already fetching or no more data
      if (isFetchingRef.current || isLoadingRef.current || !hasMore) {
        return;
      }
      
      // Check if we should load more
      const shouldLoadMore = 
        isNearBottom && 
        hasMore && 
        !isLoadingRef.current && 
        !isFetchingRef.current &&
        (totalPagesRef.current === null || currentPageRef.current <= totalPagesRef.current);
      
      if (shouldLoadMore) {
        if (currentCategory === "recommended") {
          fetchRecommendedJobs();
        } else if (currentCategory === "trending") {
          // Handle trending if needed
        } else {
          fetchJobs();
        }
      }
    }, 200); // Increased debounce delay to 200ms
  };

  // Reset everything when category or search params change
  const resetAndFetch = () => {
    currentPageRef.current = 1;
    setHasMore(true);
    isLoadingRef.current = false;
    isFetchingRef.current = false;
    lastScrollPositionRef.current = 0;
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    if (currentCategory === "recommended") {
      fetchRecommendedJobs();
    } else {
      fetchJobs();
    }
  };

  useEffect(() => {
    resetAndFetch();
  }, [searchParams, currentCategory]);

  useEffect(() => {
    // Add scroll listener with passive option for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      // Clean up debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [hasMore, currentCategory]);

  const handleCategoryChange = (category) => {
    if (category === currentCategory) return; // Prevent unnecessary re-fetch
    
    setCurrentCategory(category);
    currentPageRef.current = 1;
    setHasMore(true);
    isLoadingRef.current = false;
    isFetchingRef.current = false;
    lastScrollPositionRef.current = 0;
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    if (category === "recommended") {
      fetchRecommendedJobs();
    } else {
      fetchJobs();
    }
  };

  useEffect(() => {
    dispatch(getFitlerOptions())
      .then((res) => {
        setFilterOptions(res?.payload?.filterData);
      })
      .catch((error) => {
        console.error("Error fetching filter options:", error);
      });
  }, []);

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
      <ReactHelmet
        title='Job Openings - NextHire'
        description='Explore the latest job opportunities tailored to your skills and experience. Find your perfect role and apply today with NextHire.'
        canonicalUrl='/jobs'
      />
      <div className='max-w-7xl mt-24 mx-auto px-4 py-8 relative z-10 space-y-6'>

        <div className='flex flex-col md:flex-row gap-6'>
          {currentCategory !== "searchedBased" ? (
            <div className='w-full md:w-1/4 lg:w-1/5 md:sticky md:top-28 self-start max-h-[calc(100vh-140px)] overflow-y-auto pr-1'>
              <FilterCard
                setFilterJobs={setFilterJobs}
                setSearchParams={setSearchParams}
                filterOptions={filterOptions}
              />
            </div>
          ) : null}

          <div className='flex-1 pb-5'>
            <div className='flex items-center justify-start gap-4 mb-6'>
              <button
                onClick={() => handleCategoryChange("all")}
                className={`px-6 py-3 text-sm md:text-base font-bold rounded-xl transition-all duration-300 border shadow-md transform hover:scale-105 ${
                  currentCategory === "all"
                    ? "bg-[#00C8FF]/15 text-[#00C8FF] border-[#00C8FF]/30 shadow-[0_0_20px_rgba(0,200,255,0.2)]"
                    : "text-muted-foreground border-white/5 hover:border-[#00C8FF]/30 hover:bg-white/5 hover:text-[#00C8FF]"
                }`}
              >
                All Jobs ({allJobs?.length || 0})
              </button>

              {user?.role !== "recruiter" && (
                <button
                  onClick={() => handleCategoryChange("recommended")}
                  className={`px-6 py-3 text-sm md:text-base font-bold rounded-xl transition-all duration-300 border shadow-md transform hover:scale-105 ${
                    currentCategory === "recommended"
                      ? "bg-[#8040FF]/15 text-[#8040FF] border-[#8040FF]/30 shadow-[0_0_20px_rgba(128,64,255,0.2)]"
                      : "text-muted-foreground border-white/5 hover:border-[#8040FF]/30 hover:bg-white/5 hover:text-[#8040FF]"
                  }`}
                >
                  Recommended ({recommendedJobs?.length || 0})
                </button>
              )}

              <Link
                to='/browse-jobs'
                className='ml-auto px-6 py-3 text-sm md:text-base font-bold rounded-xl transition-all duration-300 border shadow-md transform hover:scale-105 text-muted-foreground border-white/5 hover:border-[#00C8FF]/30 hover:bg-white/5 hover:text-[#00C8FF] inline-flex items-center gap-2'
              >
                <FaFilter className='text-xs' /> Browse Jobs
              </Link>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
              {filterJobs?.length > 0 ? (
                filterJobs?.map((job) => (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Job job={job} />
                  </motion.div>
                ))
              ) : (
                <div className='col-span-full text-center py-12'>
                  <div className='bg-[#080C1E]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/5 shadow-custom max-w-md mx-auto'>
                    <p className='text-muted-foreground text-lg font-medium leading-relaxed'>
                      No jobs found matching the criteria or update the profile to get recommendation.
                    </p>
                  </div>
                </div>
              )}
            </div>
            {loading && currentPageRef.current === 1 ? (
              <Loader />
            ) : loading ? (
              <div className='flex justify-center items-center py-6 w-full'>
                <div className='w-8 h-8 border-4 border-[#00C8FF]/20 border-t-[#00C8FF] rounded-full animate-spin shadow-[0_0_15px_rgba(0,200,255,0.3)]'></div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;