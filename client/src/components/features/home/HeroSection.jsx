import React, { useState, useEffect, useRef } from "react";
import { Button } from "../../ui/button";
import { SearchSkeleton } from "../../ui/skeleton";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getAllJobs } from "@/redux/slices/job.slice";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const searchContainerRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState("bottom");

  useEffect(() => {
    if (dropdownVisible && searchContainerRef.current) {
      const rect = searchContainerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      if (spaceBelow < 320 && spaceAbove > spaceBelow) {
        setDropdownPosition("top");
      } else {
        setDropdownPosition("bottom");
      }
    }
  }, [dropdownVisible, searchResults]);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!query.trim()) {
        setSearchResults([]); // Clear search results when query is empty
        setDropdownVisible(false);
        return;
      }

      setLoading(true);
      const currentSearchParams = { title: query };

      try {
        const res = await dispatch(getAllJobs(currentSearchParams));

        if (res?.type === "job/getAllJobs/fulfilled") {
          // Handle fulfilled response
          if (res?.payload?.status === 200 && res?.payload?.jobs) {
            const jobs = Array.isArray(res.payload.jobs) ? res.payload.jobs : [];
            setSearchResults(jobs);
            setDropdownVisible(jobs.length > 0);
          } else {
            setSearchResults([]);
            setDropdownVisible(false);
          }
        } else if (res?.type === "job/getAllJobs/rejected") {
          // Handle rejected response
          console.error("Error fetching jobs:", res?.payload);
          setSearchResults([]);
          setDropdownVisible(false);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setSearchResults([]);
        setDropdownVisible(false);
      } finally {
        setLoading(false); // Stop loading after API call finishes
      }
    };

    const debounceFetch = setTimeout(fetchJobs, 500);
    return () => clearTimeout(debounceFetch);
  }, [query, dispatch]);

  const searchJobHandler = (jobId) => {
    setDropdownVisible(false);
    setQuery("");
    navigate(`/description/${jobId}`);
  };

  const handleSearchButtonClick = () => {
    if (query.trim()) {
      navigate(`/jobs?title=${encodeURIComponent(query.trim())}`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setDropdownVisible(e.target.value.trim() !== "");
  };

  const handleDropdownClick = () => {
    if (query.trim()) {
      setDropdownVisible(true);
    }
  };

  return ( 
    <div className='text-center mt-[80px] relative z-30 pb-12 bg-transparent'>
      {/* Enhanced Background decoration with massive radial glows & rotating orbits */}
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        <div className='absolute top-20 left-10 w-[400px] h-[400px] bg-[#00C8FF]/5 rounded-full blur-[130px] anim-spin-slow'></div>
        <div className='absolute top-40 right-10 w-[500px] h-[500px] bg-[#8040FF]/5 rounded-full blur-[150px] anim-spin-rev'></div>
        <div className='absolute bottom-20 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-[#00C8FF]/4 rounded-full blur-[100px] anim-pulse-glow'></div>
      </div>
      
      <div className='flex flex-col gap-8 mt-12 mb-0 relative z-10 px-4'>
        <span className='mx-auto px-5 py-2 rounded-full bg-[#00C8FF]/10 text-[#00C8FF] font-semibold text-xs border border-[#00C8FF]/20 shadow-[0_0_15px_rgba(0,229,255,0.15)] backdrop-blur-md hover:scale-105 hover:bg-[#00C8FF]/20 hover:border-[#00C8FF]/40 transition-all duration-300 relative overflow-hidden group'>
          <span className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000'></span>
          ✨ Your Intelligent Opportunities Portal
        </span>
        <h1 className='text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-[-0.02em] animate-fade-in'>
          <span className='text-foreground block mb-2 font-black'>
            Discover, Apply &
          </span>
          <span className='bg-gradient-to-r from-[#00C8FF] via-[#4f46e5] to-[#8040FF] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,229,255,0.3)]'>
            Land Your Perfect Job
          </span>
        </h1>
        <p className='text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium'>
          Explore thousands of real-time verified job listings. Take the
          next step towards your career goals with our predictive matching engine.
        </p>
        <div ref={searchContainerRef} className='relative w-full max-w-3xl mx-auto mt-4 px-4 sm:px-0'>
          <div className='relative flex w-full shadow-2xl border border-white/5 bg-[#080C1E]/60 backdrop-blur-xl pl-6 pr-2 rounded-full items-center gap-4 hover:shadow-[0_0_50px_rgba(0,200,255,0.15)] hover:border-[#00C8FF]/30 transition-all duration-300 transform hover:scale-[1.01]'>
            <Search className='h-6 w-6 text-[#00C8FF] flex-shrink-0 anim-pulse-glow' />
            <input
              type='text'
              placeholder='Search by job title, core skills, or company name...'
              value={query}
              onChange={handleInputChange}
              onClick={handleDropdownClick}
              className='outline-none border-none w-full bg-transparent text-foreground placeholder:text-muted-foreground text-base md:text-lg py-5 font-medium'
              aria-label='Job search input'
            />
            <Button
              onClick={handleSearchButtonClick}
              className='rounded-full bg-[#00C8FF] text-[#050810] hover:bg-[#00E5FF] px-8 md:px-10 py-3 md:py-4 shadow-[0_0_20px_rgba(0,200,255,0.3)] hover:shadow-[0_0_35px_rgba(0,200,255,0.6)] transform hover:scale-105 transition-all duration-300 font-bold text-base flex items-center gap-2'
              aria-label='Search button'
            >
              <Search className='h-5 w-5' />
              Search
            </Button>
            {loading && <SearchSkeleton />}
          </div>
          
          {/* Enhanced Search Dropdown with High-Tech styling */}
          {dropdownVisible && searchResults.length > 0 && !loading && ( 
            <div
              ref={dropdownRef}
              className={`absolute left-0 w-full max-h-72 overflow-y-auto overflow-x-hidden bg-[#080C1E]/95 backdrop-blur-2xl shadow-[0_0_80px_rgba(0,100,220,0.2)] rounded-2xl z-[9999] border border-white/5 duration-300 ${
                dropdownPosition === "top"
                  ? "bottom-full mb-4 animate-in slide-in-from-bottom-2"
                  : "top-full mt-4 animate-in slide-in-from-top-2"
              }`}
            >
              {searchResults?.map((job) => (
                <div
                  key={job._id}
                  onClick={() => searchJobHandler(job._id)}
                  className='cursor-pointer hover:bg-white/5 transition-all duration-200 p-4 border-b border-white/5 last:border-b-0 group transform hover:translate-x-2 text-start'
                >
                  <div className='flex items-center gap-3'>
                    <div className='w-2 h-2 bg-[#00C8FF] rounded-full group-hover:scale-125 group-hover:shadow-[0_0_10px_rgba(0,200,255,1)] transition-all duration-200 flex-shrink-0 anim-pulse-glow'></div>
                    <span className='font-bold text-foreground group-hover:text-[#00C8FF] transition-colors duration-200'>{job.title}</span>
                    {job.company?.companyName && (
                      <span className='text-xs font-semibold px-2 py-0.5 bg-[#8040FF]/15 border border-[#8040FF]/30 text-[#8040FF] rounded-lg ml-auto'>
                        {job.company.companyName}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
