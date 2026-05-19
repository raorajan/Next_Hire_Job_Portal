import React, { useState, useEffect } from "react";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Search, Sparkles, User, Briefcase, Mail, Cpu, ChevronRight, AlertTriangle, ShieldCheck } from "lucide-react";
import ReactHelmet from "../common/ReactHelmet";
import fetchFromApiServer from "@/services";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../common/Loader";

const CandidateSearch = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [roleInput, setRoleInput] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [searched, setSearched] = useState(false);

  // Redirect non-recruiters back to protect route
  useEffect(() => {
    if (!user || user.role !== "recruiter") {
      toast.error("Access Denied. Talent Search Command is reserved for recruiters.");
      navigate("/");
    }
  }, [user, navigate]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    try {
      const queryParams = new URLSearchParams();
      if (roleInput.trim()) queryParams.append("role", roleInput.trim());
      if (skillsInput.trim()) queryParams.append("skills", skillsInput.trim());

      const response = await fetchFromApiServer(
        "GET",
        `api/v1/user/profile/search-candidates?${queryParams.toString()}`
      );

      if (response?.data?.success) {
        setCandidates(response.data.candidates);
        toast.success(`🔍 Talent Radar synced! Found ${response.data.candidates.length} candidates.`);
      } else {
        toast.error("Failed to query candidates. Try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to establish link with candidate registry database.");
    } finally {
      setLoading(false);
    }
  };

  // Pre-load all candidates on initial mount for a beautiful responsive view
  useEffect(() => {
    if (user && user.role === "recruiter") {
      const preloadCandidates = async () => {
        setLoading(true);
        try {
          const response = await fetchFromApiServer("GET", "api/v1/user/profile/search-candidates");
          if (response?.data?.success) {
            setCandidates(response.data.candidates);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      preloadCandidates();
    }
  }, [user]);

  const getInitials = (fullname) => {
    if (!fullname) return "?";
    return fullname
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-[#050810] text-white flex flex-col relative overflow-hidden">
      {/* Premium Ambient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,200,255,0.04),transparent_45%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(128,64,255,0.03),transparent_40%)] pointer-events-none" />
      <div className="grid-overlay pointer-events-none"></div>

      <Navbar />
      {loading && <Loader />}
      
      <ReactHelmet
        title="Talent Radar - Admin Command Center"
        description="Query, filter, and discover elite candidates across the network using dynamic AI-assisted skill search."
        canonicalUrl="/admin/candidates/search"
      />

      <main className="flex-1 container mx-auto px-6 py-12 relative z-10 max-w-6xl">
        {/* Header Block */}
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#00C8FF]/10 border border-[#00C8FF]/20 rounded-full text-xs font-black uppercase text-[#00C8FF] tracking-wider select-none animate-pulse">
            <Cpu className="w-3.5 h-3.5" /> Direct Candidate Discovery
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight italic select-none">
            Talent <span className="text-[#00C8FF] drop-shadow-[0_0_15px_rgba(0,200,255,0.35)]">Radar</span> Command
          </h1>
          <p className="text-muted-foreground text-sm font-semibold max-w-lg mx-auto">
            Scan and intercept student resumes, coordinate roles, and filter professional benchmark coordinates globally.
          </p>
        </div>

        {/* Radar Query Form */}
        <div className="bg-[#080C1E]/50 border border-white/5 shadow-[0_0_40px_rgba(0,200,255,0.03)] backdrop-blur-xl rounded-3xl p-6 md:p-8 mb-10 max-w-4xl mx-auto">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 text-start">
                <Label className="font-extrabold uppercase text-[10px] text-white tracking-widest ml-1">Search Role / Name</Label>
                <div className="relative">
                  <Input
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                    placeholder="e.g., Frontend Developer, Alex Wright"
                    className="h-12 pl-11 rounded-xl bg-[#050810]/80 border-white/5 text-white font-semibold placeholder:text-muted-foreground/30 focus:border-[#00C8FF]/30 transition-all duration-300"
                  />
                  <Briefcase className="w-4 h-4 text-muted-foreground/60 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-2 text-start">
                <Label className="font-extrabold uppercase text-[10px] text-white tracking-widest ml-1">Filter Specific Skills</Label>
                <div className="relative">
                  <Input
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    placeholder="e.g., React, Python, AWS (comma separated)"
                    className="h-12 pl-11 rounded-xl bg-[#050810]/80 border-white/5 text-white font-semibold placeholder:text-muted-foreground/30 focus:border-[#00C8FF]/30 transition-all duration-300"
                  />
                  <Sparkles className="w-4 h-4 text-muted-foreground/60 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-xl bg-[#00C8FF] hover:bg-[#00E5FF] text-[#050810] font-black text-md shadow-[0_0_30px_rgba(0,200,255,0.25)] hover:scale-[1.01] transition-all duration-300 border-none uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-5 h-5" />
              <span>Initialize Talent Search Scan</span>
            </Button>
          </form>
        </div>

        {/* Candidate Results Registry Grid */}
        <div>
          <h2 className="text-xl font-black text-white italic tracking-tight mb-6 text-start flex items-center gap-2 select-none">
            <Cpu className="w-5 h-5 text-[#8040FF]" /> Talent Search Coordinates (Found: {candidates.length})
          </h2>

          {candidates.length === 0 ? (
            <div className="bg-[#050810]/50 border border-white/5 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
              <AlertTriangle className="w-12 h-12 text-yellow-500/80 mx-auto animate-bounce" />
              <h3 className="text-lg font-bold text-white">No Coordinates Captured</h3>
              <p className="text-muted-foreground text-xs font-semibold leading-relaxed">
                No matching student records found. Modify your role query or broaden skill criteria to locate talent.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidates.map((candidate) => (
                <div
                  key={candidate._id}
                  className="group bg-[#080C1E]/30 border border-white/5 hover:border-[#00C8FF]/20 rounded-3xl p-6 text-start flex flex-col justify-between shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:shadow-[0_0_35px_rgba(0,200,255,0.04)] transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#00C8FF]/5 -mr-12 -mt-12 rounded-full blur-xl pointer-events-none transition-all duration-500 group-hover:scale-125" />
                  
                  <div>
                    {/* User Profile Header */}
                    <div className="flex items-center gap-4 mb-4">
                      {candidate?.profile?.profilePhoto?.url ? (
                        <img
                          src={candidate.profile.profilePhoto.url}
                          alt={candidate.fullname}
                          className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0 shadow-[0_0_15px_rgba(0,0,0,0.3)]"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#00C8FF] to-[#8040FF] text-[#050810] font-black text-sm flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,200,255,0.2)]">
                          {getInitials(candidate.fullname)}
                        </div>
                      )}
                      <div>
                        <h3 className="text-md font-black text-white tracking-tight leading-none group-hover:text-[#00C8FF] transition-colors duration-200">
                          {candidate.fullname}
                        </h3>
                        <span className="text-[10px] font-bold text-muted-foreground tracking-wide mt-1 block">
                          {candidate.email}
                        </span>
                      </div>
                    </div>

                    {/* Bio Paragraph */}
                    <p className="text-muted-foreground text-xs font-semibold leading-relaxed line-clamp-3 mb-5 border-l-2 border-white/5 pl-3">
                      {candidate?.profile?.bio || "No professional overview bio provided by candidate."}
                    </p>

                    {/* Skill Tags */}
                    <div className="mb-6">
                      <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest block mb-2.5">
                        Technical Skillset
                      </span>
                      {candidate?.profile?.skills && candidate.profile.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 max-h-[68px] overflow-hidden">
                          {candidate.profile.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-2.5 py-1 bg-white/5 border border-white/5 text-[9px] font-extrabold uppercase tracking-wide rounded-md text-white/90"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[10px] text-muted-foreground/60 italic font-semibold">
                          No tech skills declared.
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Block */}
                  <div className="pt-4 border-t border-white/5 flex gap-2">
                    {candidate?.profile?.resume?.url ? (
                      <a
                        href={candidate.profile.resume.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 h-10 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-white font-extrabold text-[10px] uppercase tracking-widest flex items-center justify-center transition-all duration-300"
                      >
                        Resume PDF
                      </a>
                    ) : (
                      <button
                        disabled
                        className="flex-1 h-10 rounded-xl bg-white/5 border border-white/5 text-muted-foreground/50 font-extrabold text-[10px] uppercase tracking-widest cursor-not-allowed"
                      >
                        No Resume
                      </button>
                    )}
                    
                    <a
                      href={`mailto:${candidate.email}`}
                      className="w-10 h-10 rounded-xl bg-[#00C8FF]/10 border border-[#00C8FF]/20 hover:border-[#00C8FF]/50 text-[#00C8FF] flex items-center justify-center transition-all duration-300 hover:scale-105 shrink-0"
                      title="Direct Contact via Mail"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CandidateSearch;
