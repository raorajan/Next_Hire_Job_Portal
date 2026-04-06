import React, { useState } from "react";
import Navbar from "../layout/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ReactHelmet from "../common/ReactHelmet";
import { useDispatch } from "react-redux";
import Loader from "../common/Loader";
import { registerCompany } from "@/redux/slices/company.slice";

const CompanyCreate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);

  const registerNewCompany = async () => {
    if (!companyName?.trim()) {
      toast.error("Company name is required.");
      return;
    }

    setLoading(true);
    const companyData = { companyName };

    try {
      const res = await dispatch(registerCompany(companyData));
      const status = res?.payload?.status;
      const message = res?.payload?.message;
      const companyId = res?.payload?.company?._id;

      if (status === 200) {
        toast.success(message || "Company registered successfully!");
        navigate(`/profile/admin/companies/${companyId}`);
      } else {
        toast.error(message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error registering company:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-background relative overflow-hidden'>
      {/* Background decorations */}
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        <div className='absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-pulse'></div>
        <div className='absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] animate-pulse'></div>
      </div>

      <Navbar />
      {loading && <Loader />}
      <ReactHelmet
        title='Initialize Enterprise - Admin'
        description='Register a new corporate identity to begin talent acquisition. Define your brand name and establish your marketplace presence.'
        canonicalUrl='/admin/companies/create'
      />

      <div className='max-w-4xl mx-auto pt-32 pb-12 px-6 relative z-10'>
        <div className='bg-card/60 backdrop-blur-xl border border-border rounded-3xl p-10 shadow-custom relative overflow-hidden group'>
          <div className='absolute top-0 right-0 w-40 h-40 bg-primary/5 -mr-20 -mt-20 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500'></div>
          
          <div className='mb-10 relative z-10'>
            <h1 className='text-4xl font-black tracking-tight text-foreground mb-4 italic'>
              Enterprise <span className='bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>Initialization</span>
            </h1>
            <p className='text-muted-foreground font-medium leading-relaxed max-w-2xl'>
              Define the primary nomenclature for your enterprise entity. This identifier serves as the root for all subsequent operational metadata and can be refined at a later stage.
            </p>
          </div>

          <div className='space-y-6 relative z-10'>
            <div className='space-y-3'>
              <Label className='font-extrabold text-foreground uppercase tracking-widest text-[10px] ml-1'>Enterprise Nomenclature</Label>
              <Input
                type='text'
                className='h-16 rounded-2xl bg-muted/20 border-border border-2 focus:ring-primary/20 focus:border-primary/50 text-xl font-bold tracking-tight placeholder:text-muted-foreground/40 transition-all duration-300'
                placeholder='e.g., TechVault Systems, Global Nexus'
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>

            <div className='flex flex-col sm:flex-row items-center gap-4 pt-6'>
              <Button 
                variant='outline' 
                onClick={() => navigate("/profile/admin/companies")}
                className='w-full sm:w-auto h-14 px-10 rounded-xl border-border hover:border-primary/50 text-muted-foreground hover:text-primary transition-all duration-300 font-bold'
              >
                Abort
              </Button>
              <Button 
                onClick={registerNewCompany}
                className='w-full sm:flex-1 h-14 rounded-xl bg-primary text-primary-foreground font-black text-lg shadow-neon-sm hover:shadow-neon hover:scale-[1.01] transition-all duration-300 border-none'
              >
                Initialize Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCreate;
