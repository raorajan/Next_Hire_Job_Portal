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
    <div className='text-center mt-[80px] relative z-30 pb-12'>
      {/* Enhanced Background decoration with animations */}
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        <div className='absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse'></div>
        <div className='absolute top-40 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000'></div>
        <div className='absolute bottom-20 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-primary/8 rounded-full blur-3xl animate-pulse delay-2000'></div>
        <div className='absolute top-1/2 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-3000'></div>
      </div>
      
      <div className='flex flex-col gap-8 mt-12 mb-0 relative z-10 px-4'>
        <span className='mx-auto px-6 py-3 rounded-full bg-primary/10 text-primary font-semibold text-sm border border-primary/30 shadow-neon backdrop-blur-sm hover:scale-105 transition-transform duration-300'>
          ✨ Your Gateway to Opportunities
        </span>
        <h1 className='text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight animate-fade-in'>
          <span className='text-foreground block mb-2'>
            Discover, Apply & 
          </span>
          <span className='bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient drop-shadow-[0_0_15px_rgba(0,229,255,0.3)]'>
            Land Your Perfect Job
          </span>
        </h1>
        <p className='text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium'>
          Explore thousands of job listings across various industries. Take the
          next step towards your career success with our intelligent job matching platform!
        </p>
        <div ref={searchContainerRef} className='relative w-full max-w-3xl mx-auto mt-4'>
          <div className='relative flex w-full shadow-2xl border border-border bg-card/95 backdrop-blur-md pl-6 pr-2 rounded-full items-center gap-4 hover:shadow-neon hover:border-primary/50 transition-all duration-300 transform hover:scale-[1.02]'>
            <Search className='h-6 w-6 text-muted-foreground flex-shrink-0' />
            <input
              type='text'
              placeholder='Search for jobs, companies, or skills...'
              value={query}
              onChange={handleInputChange}
              onClick={handleDropdownClick}
              className='outline-none border-none w-full bg-transparent text-foreground placeholder-muted-foreground text-base md:text-lg py-5'
              aria-label='Job search input'
            />
            <Button
              onClick={handleSearchButtonClick}
              className='rounded-full bg-primary text-primary-foreground hover:bg-primary/80 px-8 md:px-10 py-3 md:py-4 shadow-neon transform hover:scale-105 transition-all duration-300 font-semibold text-base'
              aria-label='Search button'
            >
              <Search className='h-5 w-5 mr-2' />
              Search
            </Button>
            {loading && <SearchSkeleton />}
          </div>
          
          {/* Enhanced Search Dropdown */}
          {dropdownVisible && searchResults.length > 0 && !loading && (
            <div
              ref={dropdownRef}
              className={`absolute left-0 w-full max-h-72 overflow-y-auto overflow-x-hidden bg-card/98 backdrop-blur-xl shadow-2xl rounded-2xl z-[9999] border border-border duration-300 ${
                dropdownPosition === "top"
                  ? "bottom-full mb-4 animate-in slide-in-from-bottom-2"
                  : "top-full mt-4 animate-in slide-in-from-top-2"
              }`}
            >
              {searchResults?.map((job) => (
                <div
                  key={job._id}
                  onClick={() => searchJobHandler(job._id)}
                  className='cursor-pointer hover:bg-muted/80 transition-all duration-200 p-4 border-b border-border last:border-b-0 group transform hover:translate-x-1'
                >
                  <div className='flex items-center gap-3'>
                    <div className='w-2.5 h-2.5 bg-primary rounded-full group-hover:scale-125 group-hover:shadow-neon transition-all duration-200 flex-shrink-0'></div>
                    <span className='font-semibold text-foreground group-hover:text-primary'>{job.title}</span>
                    {job.company?.name && (
                      <span className='text-sm text-muted-foreground ml-auto'>{job.company.name}</span>
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
