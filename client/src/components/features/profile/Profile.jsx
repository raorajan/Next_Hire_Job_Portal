import React, { useState, useEffect } from "react";
import Navbar from "../../layout/Navbar";
import { Avatar, AvatarImage, AvatarFallback } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { 
  Mail, 
  Pen, 
  Building2, 
  Briefcase, 
  Users, 
  CheckCircle2, 
  Plus, 
  Search, 
  ShieldCheck, 
  Clock, 
  AlertCircle
} from "lucide-react";
import { Badge } from "../../ui/badge";
import { Label } from "../../ui/label";
import AppliedJobTable from "../jobs/AppliedJobTable";
import { useSelector, useDispatch } from "react-redux";
import CompaniesTable from "../../admin/CompaniesTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import ReactHelmet from "../../common/ReactHelmet";
import { getRecruiterStats } from "@/redux/slices/user.slice";
import { getCompanies } from "@/redux/slices/company.slice";
import { useNavigate } from "react-router-dom";
import Loader from "../../common/Loader";
import { getResumeSignedUrlApi } from "@/redux/actions/user.action";
import { toast } from "react-toastify";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [open, setOpen] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [companySearch, setCompanySearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const user = useSelector((state) => state.user.user);
  const recruiterStats = useSelector((state) => state.user.recruiterStats);

  // Fetch recruiter statistics and companies on mount if user is a recruiter
  useEffect(() => {
    if (user?.role === "recruiter") {
      dispatch(getRecruiterStats());
      
      setIsLoading(true);
      dispatch(getCompanies())
        .then((res) => {
          if (res?.payload?.status === 200) {
            setCompanies(res?.payload?.companies || []);
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [dispatch, user]);

  // Filtered companies based on real-time search input
  const filteredCompanies = companies?.filter((company) =>
    company?.companyName?.toLowerCase()?.includes(companySearch.toLowerCase())
  );

  const handleViewMyResume = async () => {
    try {
      const toastId = toast.loading("Decrypting secure resume link...");
      const response = await getResumeSignedUrlApi(user._id);
      if (response?.data?.success) {
        toast.update(toastId, { render: "Resume unlocked!", type: "success", isLoading: false, autoClose: 2000 });
        window.open(response.data.url, "_blank");
      } else {
        toast.update(toastId, { render: response?.data?.message || "Failed to access resume", type: "error", isLoading: false, autoClose: 3000 });
      }
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error("Error accessing secure resume");
    }
  };

  return (
    <div className="min-h-screen bg-[#050810] text-[#E6EDF3] relative overflow-hidden">
      {/* Fine-lined cyber laser grid overlay */}
      <div className="grid-overlay"></div>
      
      {/* Enhanced Background decorations with rotating orbits */}
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        <div className='absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#00C8FF]/5 rounded-full blur-[130px] anim-spin-slow'></div>
        <div className='absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-[#8040FF]/5 rounded-full blur-[140px] anim-spin-rev'></div>
      </div>

      <Navbar />
      {isLoading && <Loader />}
      
      <ReactHelmet
        title={user?.role === "recruiter" ? "Admin Command Center - Next_Hire" : "Profile - Next_Hire"}
        description="View and edit your profile details, including your resume, job preferences, and application history. Manage your career journey with Next_Hire."
        canonicalUrl="/profile"
      />

      <div className="max-w-7xl mx-auto mt-24 px-4 py-8 relative z-10 space-y-8">
        
        {/* Profile Card Header */}
        <div className="bg-[#080C1E]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,100,220,0.03)] hover:border-[#00C8FF]/20 hover:shadow-[0_0_35px_rgba(0,200,255,0.08)] transition-all duration-300">
          <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left justify-between gap-6 w-full">
            <div className="flex flex-col items-center gap-5 sm:flex-row">
              <div className="relative group">
                <Avatar className="h-24 w-24 ring-4 ring-[#00C8FF]/20 shadow-[0_0_20px_rgba(0,200,255,0.15)] group-hover:scale-105 transition-transform duration-300">
                  <AvatarImage
                    src={user?.profile?.profilePhoto?.url}
                    alt="profile"
                    className="object-cover"
                  />
                  <AvatarFallback className="text-3xl font-extrabold bg-[#8040FF]/20 text-[#8040FF]">
                    {user?.fullname ? user.fullname.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-[#00C8FF] to-[#8040FF] rounded-full border-2 border-[#050810] shadow-[0_0_10px_rgba(0,200,255,0.5)] flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              
              <div className="space-y-2 text-start">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-extrabold text-2xl md:text-3xl text-white tracking-wide">
                    {user?.fullname}
                  </h1>
                  {user?.role === "recruiter" && (
                    <Badge className="bg-[#00C8FF]/15 text-[#00C8FF] border border-[#00C8FF]/30 px-3 py-1 font-bold text-xs uppercase tracking-wider rounded-lg shadow-[0_0_15px_rgba(0,200,255,0.1)]">
                      Command Center Admin
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground font-medium max-w-lg leading-relaxed">
                  {user?.profile?.bio || "No corporate statement or bio provided."}
                </p>
              </div>
            </div>
            
            <Button
              onClick={() => setOpen(true)}
              className="rounded-xl bg-[#00C8FF] hover:bg-[#00E5FF] text-[#050810] font-extrabold shadow-[0_0_20px_rgba(0,200,255,0.2)] hover:shadow-[0_0_30px_rgba(0,200,255,0.4)] hover:scale-[1.02] transition-all duration-300 border-none w-full sm:w-auto px-6 py-6"
            >
              <Pen className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
          
          <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-[#00C8FF]/20 transition-all duration-300 text-start">
              <div className="w-10 h-10 bg-[#00C8FF]/10 rounded-xl flex items-center justify-center border border-[#00C8FF]/20 flex-shrink-0">
                <Mail className="text-[#00C8FF] h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-wider">Email Address</p>
                <span className="text-[#E6EDF3] font-bold tracking-wide block truncate">{user?.email}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-[#8040FF]/20 transition-all duration-300 text-start">
              <div className="w-10 h-10 bg-[#8040FF]/10 rounded-xl flex items-center justify-center border border-[#8040FF]/20 flex-shrink-0">
                <Clock className="text-[#8040FF] h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-wider">Account Role</p>
                <span className="text-white font-bold tracking-wide block capitalize">{user?.role}</span>
              </div>
            </div>
          </div>

          {/* Student Skills & Resume */}
          {user?.role === "student" && (
            <div className="mt-8 pt-8 border-t border-white/5 space-y-6 text-start">
              <div>
                <h2 className="text-lg font-bold text-white tracking-wide mb-3">Professional Skills</h2>
                <div className="flex flex-wrap items-center gap-2">
                  {user?.profile?.skills?.length > 0 ? (
                    user?.profile?.skills?.map((item, index) => (
                      <Badge key={index} className="bg-[#8040FF]/15 text-[#8040FF] border border-[#8040FF]/30 px-4 py-2 font-bold hover:bg-[#8040FF]/25 shadow-[0_0_15px_rgba(128,64,255,0.05)] transition-colors rounded-xl text-xs">
                        {item}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground font-medium italic">No skills registered on profile yet.</span>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-md font-bold text-white tracking-wide">Registered Resume</Label>
                {user?.profile?.resume?.public_id || user?.profile?.resume?.url ? (
                  <button
                    onClick={handleViewMyResume}
                    className="group flex items-center gap-3 bg-[#050810]/40 hover:bg-[#050810]/80 border border-white/5 hover:border-[#00C8FF]/30 rounded-2xl p-4 max-w-md transition-all duration-300 w-full text-left cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 group-hover:scale-105 transition-transform duration-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[#00C8FF] hover:text-[#00E5FF] font-bold block truncate text-sm">
                        {user?.profile?.resume?.resumeOriginalName || "resume.pdf"}
                      </span>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Click to unlock secure document link</p>
                    </div>
                  </button>
                ) : (
                  <span className="text-muted-foreground italic text-sm block">No resume cataloged yet.</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Recruiter / Admin Command Dashboard Statistics Panel */}
        {user?.role === "recruiter" && recruiterStats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-start">
            
            {/* Stat Card 1 */}
            <div className="group relative bg-[#080C1E]/60 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-[0_0_50px_rgba(0,100,220,0.02)] hover:border-[#00C8FF]/20 hover:shadow-[0_0_30px_rgba(0,200,255,0.08)] transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#00C8FF]/5 -mr-10 -mt-10 rounded-full blur-xl group-hover:bg-[#00C8FF]/10 transition-colors pointer-events-none"></div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#00C8FF]/10 border border-[#00C8FF]/20 flex items-center justify-center text-[#00C8FF]">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-widest">Companies Managed</p>
                  <h3 className="text-3xl font-black text-white mt-1 group-hover:text-[#00C8FF] transition-colors">{recruiterStats?.totalCompanies || 0}</h3>
                </div>
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="group relative bg-[#080C1E]/60 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-[0_0_50px_rgba(0,100,220,0.02)] hover:border-[#8040FF]/20 hover:shadow-[0_0_30px_rgba(128,64,255,0.08)] transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#8040FF]/5 -mr-10 -mt-10 rounded-full blur-xl group-hover:bg-[#8040FF]/10 transition-colors pointer-events-none"></div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#8040FF]/10 border border-[#8040FF]/20 flex items-center justify-center text-[#8040FF]">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-widest">Active Jobs Posted</p>
                  <h3 className="text-3xl font-black text-white mt-1 group-hover:text-[#8040FF] transition-colors">{recruiterStats?.totalJobs || 0}</h3>
                </div>
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="group relative bg-[#080C1E]/60 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-[0_0_50px_rgba(0,100,220,0.02)] hover:border-pink-500/20 hover:shadow-[0_0_30px_rgba(236,72,153,0.08)] transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-pink-500/5 -mr-10 -mt-10 rounded-full blur-xl group-hover:bg-pink-500/10 transition-colors pointer-events-none"></div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-widest">Total Applicants</p>
                  <h3 className="text-3xl font-black text-white mt-1 group-hover:text-pink-400 transition-colors">{recruiterStats?.totalApplications || 0}</h3>
                </div>
              </div>
            </div>

            {/* Stat Card 4 */}
            <div className="group relative bg-[#080C1E]/60 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-[0_0_50px_rgba(0,100,220,0.02)] hover:border-emerald-500/20 hover:shadow-[0_0_30px_rgba(16,185,129,0.08)] transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 -mr-10 -mt-10 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors pointer-events-none"></div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-widest">Successful Hires</p>
                  <h3 className="text-3xl font-black text-white mt-1 group-hover:text-emerald-400 transition-colors">{recruiterStats?.hiredCount || 0}</h3>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Candidate Section: Applied Jobs Table */}
        {user?.role === "student" && (
          <div className="bg-[#080C1E]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,100,220,0.03)] hover:border-[#00C8FF]/20 transition-all duration-300 w-full text-start">
            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-[#00C8FF] rounded-full"></div>
                <h2 className="font-extrabold text-2xl text-white tracking-wide">
                  Applied Opportunities
                </h2>
              </div>
            </div>
            <AppliedJobTable />
          </div>
        )}

        {/* Recruiter / Admin Section: Managed Companies Portfolio */}
        {user?.role === "recruiter" && (
          <div className="bg-[#080C1E]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,100,220,0.03)] transition-all duration-300 w-full text-start space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-white/5 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-7 bg-gradient-to-b from-[#00C8FF] to-[#8040FF] rounded-full"></div>
                <div>
                  <h2 className="font-extrabold text-2xl text-white tracking-wide uppercase">
                    Managed Enterprises
                  </h2>
                  <p className="text-xs text-muted-foreground font-semibold mt-0.5">Edit profiles, manage listings, and inspect recruitment logs.</p>
                </div>
              </div>

              <Button
                onClick={() => navigate("/profile/admin/companies/create")}
                className="rounded-xl bg-[#00C8FF] hover:bg-[#00E5FF] text-[#050810] font-black px-5 py-5 shadow-[0_0_15px_rgba(0,200,255,0.2)] hover:shadow-[0_0_20px_rgba(0,200,255,0.4)] transition-all duration-300 border-none shrink-0"
              >
                <Plus className="mr-1.5 w-4 h-4" /> Register Enterprise
              </Button>
            </div>

            {companies?.length > 0 ? (
              <div className="space-y-6">
                {/* Search Bar inside profile dashboard */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-muted-foreground group-focus-within:text-[#00C8FF] transition-colors" />
                  </div>
                  <input
                    className="w-full bg-[#050810]/50 backdrop-blur-xl border-white/5 border rounded-2xl h-14 pl-12 pr-4 focus:ring-1 focus:ring-[#00C8FF]/20 focus:border-[#00C8FF]/40 text-[#E6EDF3] placeholder:text-muted-foreground font-medium outline-none transition-all"
                    placeholder="Search managed enterprise by name..."
                    value={companySearch}
                    onChange={(e) => setCompanySearch(e.target.value)}
                  />
                </div>

                <div className="p-1 rounded-2xl bg-white/0">
                  <CompaniesTable companies={filteredCompanies} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 bg-[#050810]/40 border border-white/5 border-dashed rounded-3xl text-center group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00C8FF]/5 -mr-16 -mt-16 rounded-full blur-2xl pointer-events-none"></div>
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-white/5">
                  <Building2 className="text-[#00C8FF] w-8 h-8 opacity-40" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
                  No Cataloged Enterprises
                </h3>
                <p className="text-muted-foreground text-sm max-w-sm mb-6 font-medium">
                  Register your enterprise profile to initiate post actions, receive applications, and catalog job openings.
                </p>
                <Button 
                  onClick={() => navigate("/profile/admin/companies/create")}
                  className="bg-[#00C8FF] hover:bg-[#00E5FF] text-[#050810] rounded-xl px-8 py-5 font-bold shadow-[0_0_15px_rgba(0,200,255,0.2)] hover:shadow-[0_0_20px_rgba(0,200,255,0.4)] transition-all border-none"
                >
                  Register First Enterprise
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <UpdateProfileDialog open={open} setOpen={setOpen} user={user} />
    </div>
  );
};

export default Profile;
