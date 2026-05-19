import React, { useEffect, useState, useRef } from "react";
import Navbar from "../../layout/Navbar";
import Job from "./Job";
import ReactHelmet from "../../common/ReactHelmet";
import { getSearchResult, clearSearchHistory } from "@/redux/slices/user.slice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../common/Loader";
import { toast } from "react-toastify";
import { getToken } from "@/utils/constant";

const BrowseJobs = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const currentPageRef = useRef(1);
  const totalPagesRef = useRef(null);

  // Check authentication status
  useEffect(() => {
    const token = getToken();
    setIsAuthenticated(!!token);
  }, [user]);

  const fetchSearchResult = async () => {
    if (!hasMore || loading) return;
  
    setLoading(true);
    setError(null);
  
    try {
      // Only fetch if user is authenticated
      if (isAuthenticated) {
        const res = await dispatch(
          getSearchResult({ page: currentPageRef.current, limit: 10 })
        ).unwrap();
    
        if (res?.status === 200) {
          const newJobs = res?.jobs || [];
    
          // Remove duplicates based on job ID
          const combinedJobs = [...searchResult, ...newJobs];
          const uniqueJobs = [
            ...new Map(combinedJobs?.map((job) => [job?._id, job])).values(),
          ];
    
          setSearchResult(uniqueJobs);
    
          const { currentPage, totalPages } = res;
          totalPagesRef.current = totalPages;
          setHasMore(currentPage < totalPages);
          currentPageRef.current += 1;
        } else {
          console.warn("Unexpected response format:", res);
          setError("Failed to load jobs. Please try again later.");
        }
      } else {
        // For non-authenticated users, show a message to login
        setError("Please login to view job search results.");
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
  
      if (error?.response?.data?.message) {
        // Backend-provided error
        setError(error.response.data.message);
      } else if (error?.message) {
        // Thunk/Network error
        setError(error.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  

  // Fetch jobs initially
  useEffect(() => {
    fetchSearchResult();
  }, []);

  // Clear search history handler
  const handleClearSearchHistory = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to clear search history.");
      return;
    }

    setLoading(true);

    try {
      const res = await dispatch(clearSearchHistory()).unwrap();
      if (res?.status === 200) {
        toast.success(res?.message);
        setSearchResult([]); // Clear search results after success
      } else {
        toast.error("Failed to delete search history.");
      }
    } catch (error) {
      console.error("Error clearing search history:", error);
      toast.error("Failed to delete search history.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-[#050810] text-[#F3F4F6] relative overflow-hidden font-sans antialiased'>
      {/* Grid Overlay */}
      <div className='grid-overlay absolute inset-0 pointer-events-none z-0 opacity-40'></div>
      {/* Orbital Spheres */}
      <div className='absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(0,200,255,0.06)_0%,transparent_70%)] pointer-events-none z-0'></div>
      <div className='absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(128,64,255,0.06)_0%,transparent_70%)] pointer-events-none z-0'></div>

      <Navbar />
      <ReactHelmet
        title='Browse Jobs - NextHire'
        description='Browse a wide range of job openings across various industries and locations.'
        canonicalUrl='/browse'
      />

      <div className='max-w-7xl mx-auto mt-24 px-4 py-12 relative z-10'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center w-full mb-12 gap-6 text-start'>
          <div>
            <h1 className='text-4xl md:text-5xl font-extrabold mb-3 tracking-tight'>
              <span className='text-foreground'>
                {isAuthenticated ? 'Search Results' : 'Browse Jobs'}
              </span>
              {isAuthenticated && (
                <span className='bg-gradient-to-r from-[#00C8FF] to-[#8040FF] bg-clip-text text-transparent italic ml-3 font-mono'>
                   ({searchResult.length})
                </span>
              )}
            </h1>
            <p className='text-lg text-muted-foreground font-medium'>Discover targeted opportunities that match your professional trajectory.</p>
          </div>
          {isAuthenticated && (
            <button
              onClick={handleClearSearchHistory}
              className='bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-8 py-3 rounded-xl font-bold border border-red-500/20 hover:border-red-500 transition-all duration-300 shadow-sm hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]'
            >
              Clear Search History
            </button>
          )}
        </div>

        {/* Login prompt for non-authenticated users */}
        {!isAuthenticated && (
          <div className='bg-[#080C1E]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-8 mb-12 shadow-[0_0_50px_rgba(0,100,220,0.02)] relative overflow-hidden group text-start'>
            <div className='absolute top-0 right-0 w-32 h-32 bg-white/5 -mr-16 -mt-16 rounded-full blur-2xl group-hover:bg-[#00C8FF]/5 transition-colors duration-500'></div>
            <div className='flex flex-col md:flex-row items-center gap-8 relative z-10'>
              <div className='w-16 h-16 bg-[#00C8FF]/10 rounded-2xl flex items-center justify-center flex-shrink-0 border border-[#00C8FF]/20 shadow-[0_0_15px_rgba(0,200,255,0.15)]'>
                <svg className='w-8 h-8 text-[#00C8FF]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1' />
                </svg>
              </div>
              <div className='flex-1 text-center md:text-left'>
                <h3 className='text-2xl font-extrabold text-foreground mb-2 italic'>Access Personalized Results</h3>
                <p className='text-muted-foreground text-base font-semibold'>Log in to view high-relevance matches tailored specifically to your skills and preferences.</p>
              </div>
              <div className='flex gap-4 w-full md:w-auto'>
                <a 
                  href='/login' 
                  className='flex-1 md:flex-none text-center bg-[#00C8FF] hover:bg-[#00E5FF] text-[#050810] px-8 py-3 rounded-xl font-extrabold transition-all duration-300 shadow-[0_0_20px_rgba(0,200,255,0.3)] hover:scale-105 border-none'
                >
                  Login
                </a>
                <a 
                  href='/signup' 
                  className='flex-1 md:flex-none text-center bg-transparent text-foreground border border-white/10 px-8 py-3 rounded-xl font-bold hover:bg-white/5 transition-all duration-300 hover:border-[#00C8FF]/30'
                >
                  Sign Up
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Job Listings */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
          {searchResult.length > 0 ? (
            searchResult?.map((job) => <Job key={job._id} job={job} />)
          ) : (
            <div className='col-span-full text-center py-20'>
              <div className='bg-[#080C1E]/60 backdrop-blur-xl rounded-2xl p-12 border border-white/5 shadow-custom max-w-lg mx-auto'>
                <div className='w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6'>
                  <svg className='w-10 h-10 text-muted-foreground' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                  </svg>
                </div>
                <p className='text-muted-foreground text-xl font-semibold'>
                  {isAuthenticated ? 'Query yielded no matches. Try refining filters.' : 'Authentication required for result display.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className='flex justify-center items-center py-16'>
            <Loader />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className='text-center py-12'>
            <div className='bg-red-500/5 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8 max-w-md mx-auto shadow-custom'>
              <div className='w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg className='w-8 h-8 text-destructive' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z' />
                </svg>
              </div>
              <p className='text-red-400 font-bold text-lg'>{error}</p>
            </div>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && !loading && isAuthenticated && (
          <div className='text-center mt-16'>
            <button
              onClick={fetchSearchResult}
              className='bg-[#00C8FF] hover:bg-[#00E5FF] text-[#050810] px-10 py-4 rounded-xl font-extrabold shadow-[0_0_20px_rgba(0,200,255,0.3)] hover:shadow-[0_0_35px_rgba(0,200,255,0.5)] hover:scale-105 transition-all duration-300 border-none'
            >
              Load More Results
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseJobs;
