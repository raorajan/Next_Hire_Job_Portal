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

  const observerRef = useRef(null);
  const currentPageRef = useRef(1);
  const totalPagesRef = useRef(null);
  const lastScrollTopRef = useRef(0);

  const fetchJobs = () => {
    if (!hasMore || loading) return;
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
            const uniqueJobs = [
              ...new Set([...allJobs, ...newJobs]?.map((job) => job._id)),
            ]?.map((id) =>
              [...allJobs, ...newJobs].find((job) => job._id === id)
            );

            setAllJobs(uniqueJobs);
            setFilterJobs(uniqueJobs);
          }

          const { currentPage, totalPages } = res.payload;
          totalPagesRef.current = totalPages;
          setHasMore(currentPage < totalPages);
          if (sanitizedParams.page === currentPageRef.current) {
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
        setLoading(false);
      });
  };

  const fetchRecommendedJobs = () => {
    if (!hasMore || loading) return;
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
            const uniqueJobs = [
              ...new Set(
                [...recommendedJobs, ...newJobs]?.map((job) => job._id)
              ),
            ]?.map((id) =>
              [...recommendedJobs, ...newJobs].find((job) => job._id === id)
            );

            setRecommendedJobs(uniqueJobs);
            setFilterJobs(uniqueJobs);
          }

          const { currentPage, totalPages } = res.payload;
          totalPagesRef.current = totalPages;
          setHasMore(currentPage < totalPages);
          if (sanitizedParams.page === currentPageRef.current) {
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
        setLoading(false);
      });
  };

  const handleScroll = () => {
    if (observerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = observerRef.current;
      const lastScrollTop = lastScrollTopRef.current;
      if (scrollTop > lastScrollTop) {
        if (
          scrollTop + clientHeight >= scrollHeight - 50 &&
          hasMore &&
          !loading &&
          currentPageRef.current <= totalPagesRef.current
        ) {
          if (currentCategory === "recommended") {
            fetchRecommendedJobs();
          } else if (currentCategory === "trending") {
          } else {
            fetchJobs();
          }
        }
      }
      lastScrollTopRef.current = scrollTop;
    }
  };

  useEffect(() => {
    currentPageRef.current = 1;
    setHasMore(true);
    if (currentCategory === "recommended") {
      fetchRecommendedJobs();
    } else {
      fetchJobs();
    }
  }, [searchParams]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (observerRef.current) {
        observerRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [hasMore, loading]);

  const handleCategoryChange = (category) => {
    setCurrentCategory(category);
    currentPageRef.current = 1;
    setHasMore(true);

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
    <div className='min-h-screen bg-background relative overflow-hidden'>
      {/* Background decorations */}
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        <div className='absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl'></div>
        <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl'></div>
      </div>

      <Navbar />
      <ReactHelmet
        title='Job Openings - Next_Hire'
        description='Explore the latest job opportunities tailored to your skills and experience. Find your perfect role and apply today with Next_Hire.'
        canonicalUrl='/job'
      />
      <div className='max-w-7xl mt-24 mx-auto px-4 py-8 relative z-10 space-y-6'>
        <div className='bg-card/90 backdrop-blur-md border border-border rounded-2xl shadow-custom p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
          <div className='flex items-start gap-4'>
            <div className='w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl'>
              <FaFilter />
            </div>
            <div>
              <h2 className='text-lg font-semibold text-foreground'>Need advanced filtering?</h2>
              <p className='text-sm text-muted-foreground'>
                Use the Browse Jobs workspace to save filters, set alerts, and explore curated job clusters without losing your current view.
              </p>
            </div>
          </div>
          <Link
            to='/browse-jobs'
            className='inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold shadow-neon hover:bg-primary/80 transition-all duration-200'
          >
            Open Browse Jobs
          </Link>
        </div>

        <div className='flex flex-col md:flex-row gap-6'>
          {currentCategory !== "searchedBased" ? (
            <div className='w-full md:w-1/4 lg:w-1/5'>
              <FilterCard
                setFilterJobs={setFilterJobs}
                setSearchParams={setSearchParams}
                filterOptions={filterOptions}
              />
            </div>
          ) : null}

          <div
            className='flex-1 h-[85vh] overflow-y-auto pb-5'
            ref={observerRef}
          >
            <div className='flex flex-col sm:flex-row items-center justify-between mb-6 gap-4'>
              <button
                onClick={() => handleCategoryChange("all")}
                className={`px-6 py-3 text-sm md:text-base font-bold rounded-xl transition-all duration-300 border shadow-md hover:shadow-neon transform hover:scale-105 ${
                  currentCategory === "all"
                    ? "bg-primary/10 text-primary border-primary shadow-neon"
                    : "text-foreground border-border hover:border-primary hover:bg-muted"
                }`}
              >
                All Jobs ({allJobs?.length || 0})
              </button>

              {user?.role !== "recruiter" && (
                <button
                  onClick={() => handleCategoryChange("recommended")}
                  className={`px-6 py-3 text-sm md:text-base font-bold rounded-xl transition-all duration-300 border shadow-md hover:shadow-neon transform hover:scale-105 ${
                    currentCategory === "recommended"
                      ? "bg-primary/10 text-primary border-primary shadow-neon"
                      : "text-foreground border-border hover:border-primary hover:bg-muted"
                  }`}
                >
                  Recommended ({recommendedJobs?.length || 0})
                </button>
              )}
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
                  <div className='bg-card backdrop-blur-sm rounded-2xl p-8 border border-border shadow-custom max-w-md mx-auto'>
                    <p className='text-muted-foreground text-lg'>
                      No jobs found matching the criteria or update the profile to get recommendation.
                    </p>
                  </div>
                </div>
              )}
            </div>
            {loading && <Loader />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
