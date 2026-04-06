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
    <div className='min-h-screen bg-background relative overflow-hidden'>
      {/* Background decorations */}
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        <div className='absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-pulse'></div>
        <div className='absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] animate-pulse'></div>
      </div>

      <Navbar />
      {loading && <Loader />}

      <ReactHelmet
        title='Profile Configuration - Admin'
        description="Refine enterprise metadata, integrate digital branding assets, and configure operational parameters for your organization's presence."
        canonicalUrl='/admin/company/setup'
      />

      <div className='max-w-4xl mx-auto pt-24 pb-12 px-6 relative z-10'>
        <div className='bg-card/60 backdrop-blur-xl border border-border rounded-3xl p-10 shadow-custom relative overflow-hidden group'>
          <div className='absolute top-0 left-0 w-40 h-40 bg-primary/5 -mr-20 -mt-20 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500'></div>
          
          <form onSubmit={submitHandler} className="relative z-10">
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-6'>
              <div className="flex items-center gap-6">
                <Button
                  onClick={handleBackClick}
                  variant='outline'
                  className='h-12 w-12 rounded-xl p-0 border-border hover:border-primary/50 text-muted-foreground hover:text-primary transition-all duration-300'
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                  <h1 className='text-3xl font-black tracking-tight text-foreground italic'>
                    Profile <span className='bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>Configuration</span>
                  </h1>
                  <p className="text-muted-foreground font-medium text-sm">Refining registry data for {name || 'Enterprise'}.</p>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div className='space-y-2'>
                <Label className='font-extrabold text-foreground uppercase tracking-widest text-[10px] ml-1'>Enterprise Nomenclature</Label>
                <Input
                  type='text'
                  value={name}
                  onChange={(e) => setName(e?.target?.value ?? "")}
                  className='h-14 rounded-2xl bg-muted/20 border-border border-2 focus:ring-primary/20 focus:border-primary/50 text-foreground font-bold tracking-tight'
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label className='font-extrabold text-foreground uppercase tracking-widest text-[10px] ml-1'>Mission Statement</Label>
                <Input
                  type='text'
                  value={description}
                  onChange={(e) => setDescription(e?.target?.value ?? "")}
                  className='h-14 rounded-2xl bg-muted/20 border-border border-2 focus:ring-primary/20 focus:border-primary/50 text-foreground font-bold tracking-tight'
                  placeholder='Corporate vision and values'
                />
              </div>
              <div className='space-y-2'>
                <Label className='font-extrabold text-foreground uppercase tracking-widest text-[10px] ml-1'>Infrastructure Portal (Website)</Label>
                <Input
                  type='url'
                  value={website}
                  onChange={(e) => setWebsite(e?.target?.value ?? "")}
                  className='h-14 rounded-2xl bg-muted/20 border-border border-2 focus:ring-primary/20 focus:border-primary/50 text-foreground font-bold tracking-tight'
                  placeholder='https://portal.enterprise.com'
                />
              </div>
              <div className='space-y-2'>
                <Label className='font-extrabold text-foreground uppercase tracking-widest text-[10px] ml-1'>Geographic Node (Location)</Label>
                <Input
                  type='text'
                  value={location}
                  onChange={(e) => setLocation(e?.target?.value ?? "")}
                  className='h-14 rounded-2xl bg-muted/20 border-border border-2 focus:ring-primary/20 focus:border-primary/50 text-foreground font-bold tracking-tight'
                  placeholder='e.g., Silicon Valley Hub'
                />
              </div>
              <div className='md:col-span-2 space-y-2'>
                <Label className='font-extrabold text-foreground uppercase tracking-widest text-[10px] ml-1'>Visual Identifier (Logo Asset)</Label>
                <div className="relative group/file">
                  <Input
                    type='file'
                    accept='image/*'
                    onChange={changeFileHandler}
                    className="h-14 rounded-2xl bg-muted/20 border-border border-2 focus:ring-primary/20 focus:border-primary/50 text-foreground font-bold cursor-pointer file:bg-primary file:text-primary-foreground file:border-none file:rounded-lg file:px-4 file:py-1 file:mr-4 file:mt-2 file:font-black file:text-[10px] file:uppercase transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            <div className="mt-10">
              <Button 
                type='submit' 
                className='w-full h-16 rounded-2xl bg-gradient-to-r from-primary to-secondary text-primary-foreground font-black text-xl shadow-neon hover:scale-[1.01] transition-all duration-300 border-none' 
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
