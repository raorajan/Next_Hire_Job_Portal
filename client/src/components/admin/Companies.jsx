import React, { useEffect, useState } from "react";
import Navbar from "../layout/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CompaniesTable from "./CompaniesTable";
import { useNavigate } from "react-router-dom";
import ReactHelmet from "../common/ReactHelmet";
import { getCompanies } from "@/redux/slices/company.slice";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import Loader from "../common/Loader";
import { FaPlus } from "react-icons/fa";

const Companies = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [input, setInput] = useState("");
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    dispatch(getCompanies())
      .then((res) => {
        if (res?.payload?.status === 200) {
          setCompanies(res?.payload?.companies || []);
        } else {
          toast.error("Failed to fetch companies");
        }
      })
      .catch(() => {
        toast.error("Something went wrong");
      })
      .finally(() => setIsLoading(false));
  }, [dispatch]);

  // Filtered Companies with optional chaining
  const filteredCompanies = companies?.filter((company) =>
    company?.companyName?.toLowerCase()?.includes(input?.toLowerCase())
  );

  return (
    <div className='min-h-screen bg-background relative overflow-hidden'>
      {/* Background decorations */}
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        <div className='absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-pulse'></div>
        <div className='absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] animate-pulse'></div>
      </div>

      <Navbar />
      {isLoading && <Loader />}

      <ReactHelmet
        title='Enterprise Management - Admin'
        description='Oversee your portfolio of registered enterprises. Monitor profiles, update branding, and manage associated job listings.'
        canonicalUrl='/admin/companies'
      />

      <div className='max-w-6xl mx-auto pt-24 pb-12 px-6 relative z-10'>
        <div className='flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6'>
          <div>
            <h1 className='text-4xl font-black tracking-tight text-foreground mb-2'>
              Enterprise <span className='bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent italic'>Portfolio</span>
            </h1>
            <p className='text-muted-foreground font-medium'>Control profiles and track operational scale across the platform.</p>
          </div>
          <Button
            onClick={() => navigate("/profile/admin/companies/create")}
            className='rounded-xl bg-primary text-primary-foreground font-black px-8 py-6 shadow-neon-sm hover:shadow-neon hover:scale-[1.02] transition-all duration-300 border-none'
          >
            <FaPlus className='mr-2' /> Register New Enterprise
          </Button>
        </div>

        {filteredCompanies?.length === 0 && !isLoading ? (
          <div className='flex flex-col items-center justify-center py-20 bg-card/60 backdrop-blur-xl border border-border rounded-3xl shadow-custom mt-2 group relative overflow-hidden'>
            <div className='absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500'></div>
            <div className='w-20 h-20 bg-muted/50 rounded-2xl flex items-center justify-center mb-6 border border-border shadow-inner'>
              <svg className='w-10 h-10 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' />
              </svg>
            </div>
            <h2 className='text-2xl font-black text-foreground mb-3 tracking-tight italic'>
              No Enterprises Cataloged
            </h2>
            <p className='text-muted-foreground mb-8 text-center max-w-md font-medium leading-relaxed'>
              Your current search filters or system registry yields no active matches. Initialize a new profile to begin.
            </p>
            <Button 
              onClick={() => navigate("/profile/admin/companies/create")}
              className='bg-primary text-primary-foreground rounded-xl px-10 py-6 font-extrabold shadow-neon-sm hover:shadow-neon transition-all duration-300'
            >
              Start Registration
            </Button>
          </div>
        ) : (
          <div className='space-y-8'>
            <div className='relative group'>
              <div className='absolute inset-y-0 left-4 flex items-center pointer-events-none'>
                <svg className='w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                </svg>
              </div>
              <Input
                className='w-full bg-card/50 backdrop-blur-md border-border border-2 h-16 rounded-2xl pl-12 focus:ring-primary/20 focus:border-primary/50 text-xl font-bold tracking-tight placeholder:text-muted-foreground'
                placeholder='Search by enterprise name or niche keywords...'
                value={input}
                onChange={(e) => setInput(e?.target?.value || "")}
              />
            </div>
            <div className='bg-card/40 backdrop-blur-md rounded-3xl border border-border shadow-custom p-2'>
              <CompaniesTable companies={filteredCompanies} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;
