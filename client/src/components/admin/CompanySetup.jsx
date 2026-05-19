import React, { useEffect, useState } from "react";
import Navbar from "../layout/Navbar";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../common/Loader";
import ReactHelmet from "../common/ReactHelmet";
import { getCompanyById, updateCompany } from "@/redux/slices/company.slice";

const CompanySetup = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isBackNavigation, setIsBackNavigation] = useState(false);

  useEffect(() => {
    if (id && !isBackNavigation) {
      setLoading(true);
      dispatch(getCompanyById(id))
        .then((res) => {
          const company = res?.payload?.company;
          if (company) {
            setName(company?.companyName ?? "");
            setDescription(company?.description ?? "");
            setWebsite(company?.website ?? "");
            setLocation(company?.location ?? "");
            setLogo(null);
          } else {
            toast.error("Failed to fetch company data.");
          }
        })
        .catch(() => {
          toast.error("Error fetching company data.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, isBackNavigation, dispatch]);

  const handleBackClick = (e) => {
    e.preventDefault();
    setIsBackNavigation(true);
    navigate(-1);
  };

  const changeFileHandler = (e) => {
    const file = e?.target?.files?.[0];
    if (file) setLogo(file);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("website", website);
    formData.append("location", location);
    if (logo) formData.append("logo", logo);

    setLoading(true);
    dispatch(updateCompany({ companyId: id, companyData: formData }))
      .then((res) => {
        const status = res?.payload?.status;
        const message = res?.payload?.message;
        if (status === 200) {
          toast.success(message ?? "Company updated successfully.");
          navigate("/profile");
        } else {
          toast.error(message ?? "Failed to update the company.");
        }
      })
      .catch(() => {
        toast.error("An error occurred. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className='min-h-screen bg-[#050810] relative overflow-hidden'>
      {/* Premium Cyber Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,200,255,0.03),transparent_40%)] pointer-events-none" />
      <div className="grid-overlay"></div>
      
      {/* Decorative Orbits */}
      <div className="absolute top-20 left-10 w-[400px] h-[400px] border border-white/5 rounded-full pointer-events-none anim-spin-slow">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#00C8FF] rounded-full shadow-[0_0_10px_#00C8FF]" />
      </div>
      <div className="absolute bottom-20 right-10 w-[500px] h-[500px] border border-white/5 rounded-full pointer-events-none anim-spin-rev">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#8040FF] rounded-full shadow-[0_0_10px_#8040FF]" />
      </div>

      <Navbar />
      {loading && <Loader />}

      <ReactHelmet
        title='Profile Configuration - Admin'
        description="Refine enterprise metadata, integrate digital branding assets, and configure operational parameters for your organization's presence."
        canonicalUrl='/admin/company/setup'
      />

      <div className='max-w-4xl mx-auto pt-24 pb-12 px-6 relative z-10'>
        <div className='bg-[#080C1E]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-10 shadow-[0_0_50px_rgba(0,100,220,0.03)] relative overflow-hidden group'>
          <div className='absolute top-0 left-0 w-40 h-40 bg-[#00C8FF]/5 -mr-20 -mt-20 rounded-full blur-3xl group-hover:bg-[#00C8FF]/10 transition-colors duration-500'></div>
          
          <form onSubmit={submitHandler} className="relative z-10">
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-6'>
              <div className="flex items-center gap-6">
                <Button
                  onClick={handleBackClick}
                  variant='outline'
                  className='h-12 w-12 rounded-xl p-0 bg-white/5 border border-white/10 hover:border-[#00C8FF]/50 text-muted-foreground hover:text-white transition-all duration-300'
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                  <h1 className='text-3xl font-black tracking-tight text-white italic'>
                    Profile <span className='bg-gradient-to-r from-[#00C8FF] to-[#8040FF] bg-clip-text text-transparent'>Configuration</span>
                  </h1>
                  <p className="text-muted-foreground font-medium text-sm">Refining registry data for {name || 'Enterprise'}.</p>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div className='space-y-2'>
                <Label className='font-extrabold text-white uppercase tracking-widest text-[10px] ml-1'>Enterprise Nomenclature</Label>
                <Input
                  type='text'
                  value={name}
                  onChange={(e) => setName(e?.target?.value ?? "")}
                  className='h-14 rounded-2xl bg-[#080C1E]/80 border-white/5 border-2 focus:ring-[#00C8FF]/20 focus:border-[#00C8FF]/50 text-white font-bold tracking-tight'
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label className='font-extrabold text-white uppercase tracking-widest text-[10px] ml-1'>Mission Statement</Label>
                <Input
                  type='text'
                  value={description}
                  onChange={(e) => setDescription(e?.target?.value ?? "")}
                  className='h-14 rounded-2xl bg-[#080C1E]/80 border-white/5 border-2 focus:ring-[#00C8FF]/20 focus:border-[#00C8FF]/50 text-white font-bold tracking-tight'
                  placeholder='Corporate vision and values'
                />
              </div>
              <div className='space-y-2'>
                <Label className='font-extrabold text-white uppercase tracking-widest text-[10px] ml-1'>Infrastructure Portal (Website)</Label>
                <Input
                  type='url'
                  value={website}
                  onChange={(e) => setWebsite(e?.target?.value ?? "")}
                  className='h-14 rounded-2xl bg-[#080C1E]/80 border-white/5 border-2 focus:ring-[#00C8FF]/20 focus:border-[#00C8FF]/50 text-white font-bold tracking-tight'
                  placeholder='https://portal.enterprise.com'
                />
              </div>
              <div className='space-y-2'>
                <Label className='font-extrabold text-white uppercase tracking-widest text-[10px] ml-1'>Geographic Node (Location)</Label>
                <Input
                  type='text'
                  value={location}
                  onChange={(e) => setLocation(e?.target?.value ?? "")}
                  className='h-14 rounded-2xl bg-[#080C1E]/80 border-white/5 border-2 focus:ring-[#00C8FF]/20 focus:border-[#00C8FF]/50 text-white font-bold tracking-tight'
                  placeholder='e.g., Silicon Valley Hub'
                />
              </div>
              <div className='md:col-span-2 space-y-2'>
                <Label className='font-extrabold text-white uppercase tracking-widest text-[10px] ml-1'>Visual Identifier (Logo Asset)</Label>
                <div className="relative group/file">
                  <Input
                    type='file'
                    accept='image/*'
                    onChange={changeFileHandler}
                    className="h-14 rounded-2xl bg-[#080C1E]/80 border-white/5 border-2 focus:ring-[#00C8FF]/20 focus:border-[#00C8FF]/50 text-white font-bold cursor-pointer file:bg-[#00C8FF] file:text-[#050810] file:border-none file:rounded-lg file:px-4 file:py-1 file:mr-4 file:mt-2 file:font-black file:text-[10px] file:uppercase transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            <div className="mt-10">
              <Button 
                type='submit' 
                className='w-full h-16 rounded-2xl bg-gradient-to-r from-[#00C8FF] to-[#8040FF] text-[#050810] font-black text-xl shadow-[0_0_30px_rgba(0,200,255,0.3)] hover:shadow-[0_0_50px_rgba(0,200,255,0.5)] hover:scale-[1.01] transition-all duration-300 border-none' 
                disabled={loading}
              >
                {loading ? (
                  <>Hardening Metadata...</>
                ) : (
                  "Finalize Registry Update"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanySetup;
