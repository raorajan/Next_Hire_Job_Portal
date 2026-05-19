import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Briefcase, Building, Cpu, User, Sparkles, Zap, ShieldCheck } from "lucide-react";
import SaaSUpgradeModal from "../common/SaaSUpgradeModal";

const Footer = () => {
  const { user } = useSelector((state) => state.user);
  const [paywallOpen, setPaywallOpen] = useState(false);

  return (
    <footer className="relative bg-[#050810] text-foreground border-t border-white/5 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00C8FF]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#8040FF]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <h2 className="text-2xl font-black tracking-tight italic text-white select-none">
                Next<span className="text-[#00C8FF] drop-shadow-[0_0_10px_rgba(0,200,255,0.3)]">Hire</span>
              </h2>
            </Link>
            <p className="text-muted-foreground text-sm font-semibold max-w-md leading-relaxed">
              An AI-powered cybermatic career gateway matching exceptional professionals with future-proof enterprises. Seamlessly scan resumes, calculate suitability scores, and deploy job postings instantly.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 hover:border-[#00C8FF]/30 flex items-center justify-center transition-all duration-300 hover:scale-105"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5 text-muted-foreground hover:text-white transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.676 0H1.324C.593 0 0 .592 0 1.324v21.352C0 23.408.593 24 1.324 24H12.82V14.706H9.692v-3.578h3.128V8.408c0-3.1 1.893-4.787 4.657-4.787 1.325 0 2.463.1 2.794.144v3.238l-1.918.001c-1.503 0-1.794.715-1.794 1.762v2.31h3.587l-.468 3.578h-3.119V24h6.116C23.407 24 24 23.408 24 22.676V1.324C24 .592 23.407 0 22.676 0z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 hover:border-[#00C8FF]/30 flex items-center justify-center transition-all duration-300 hover:scale-105"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5 text-muted-foreground hover:text-white transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557a9.835 9.835 0 01-2.828.775 4.934 4.934 0 002.165-2.724 9.867 9.867 0 01-3.127 1.195 4.924 4.924 0 00-8.38 4.49A13.978 13.978 0 011.67 3.149 4.93 4.93 0 003.16 9.724a4.903 4.903 0 01-2.229-.616v.062a4.93 4.93 0 003.946 4.827 4.902 4.902 0 01-2.224.084 4.93 4.93 0 004.6 3.417A9.869 9.869 0 010 21.543a13.978 13.978 0 007.548 2.212c9.057 0 14.01-7.507 14.01-14.01 0-.213-.004-.425-.015-.636A10.012 10.012 0 0024 4.557z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 hover:border-[#00C8FF]/30 flex items-center justify-center transition-all duration-300 hover:scale-105"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5 text-muted-foreground hover:text-white transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452H16.85v-5.569c0-1.327-.027-3.037-1.852-3.037-1.854 0-2.137 1.446-2.137 2.94v5.666H9.147V9.756h3.448v1.464h.05c.48-.91 1.653-1.871 3.401-1.871 3.634 0 4.307 2.39 4.307 5.498v5.605zM5.337 8.29c-1.105 0-2-.896-2-2 0-1.106.895-2 2-2 1.104 0 2 .895 2 2 0 1.104-.896 2-2 2zM7.119 20.452H3.553V9.756h3.566v10.696zM22.225 0H1.771C.791 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451c.979 0 1.771-.774 1.771-1.729V1.729C24 .774 23.205 0 22.225 0z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-4 text-start">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#8040FF]">Platform</h3>
            <ul className="space-y-3 text-sm font-bold">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-white transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="text-muted-foreground hover:text-white transition-colors duration-200">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/browse-jobs" className="text-muted-foreground hover:text-white transition-colors duration-200">
                  Search Results
                </Link>
              </li>
            </ul>
          </div>

          {/* DYNAMIC SECTION BASED ON USER ROLE */}
          {/* Candidate Links (Only shown if student role or guest) */}
          {(!user || user?.role === "student") && (
            <div className="space-y-4 text-start">
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#00C8FF] flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#00C8FF]" /> Candidate Zone
              </h3>
              <ul className="space-y-3 text-sm font-bold">
                <li>
                  <Link to="/profile" className="text-muted-foreground hover:text-white transition-colors duration-200">
                    My Profile Hub
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="text-[#00C8FF] hover:text-[#00E5FF] transition-colors duration-200 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" /> AI Resume Scanner
                  </Link>
                </li>
                <li>
                  <Link to="/jobs" className="text-muted-foreground hover:text-white transition-colors duration-200">
                    Applied Jobs
                  </Link>
                </li>
                <li>
                  <span className="text-muted-foreground hover:text-white transition-colors duration-200 cursor-pointer">
                    Career Guides
                  </span>
                </li>
              </ul>
            </div>
          )}

          {/* Employer Links (Only shown if recruiter role or guest) */}
          {(!user || user?.role === "recruiter") && (
            <div className="space-y-4 text-start">
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#00C8FF] flex items-center gap-1.5">
                <Building className="w-4 h-4 text-[#00C8FF]" /> Recruiter Hub
              </h3>
              <ul className="space-y-3 text-sm font-bold">
                <li>
                  <Link to="/profile/admin/jobs/create" className="text-muted-foreground hover:text-white transition-colors duration-200">
                    Deploy Opportunity
                  </Link>
                </li>
                <li>
                  <Link to="/profile/admin/companies/create" className="text-muted-foreground hover:text-white transition-colors duration-200">
                    Create Enterprise
                  </Link>
                </li>
                <li>
                  <Link to="/profile/admin/candidates" className="text-[#00C8FF] hover:text-[#00E5FF] transition-colors duration-200 flex items-center gap-1 font-black">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Talent Radar Search
                  </Link>
                </li>
                <li>
                  <Link to="/profile/admin/companies" className="text-muted-foreground hover:text-white transition-colors duration-200">
                    Active Registry
                  </Link>
                </li>
                {user?.role === "recruiter" && (
                  <li className="pt-2">
                    {user?.isPro ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00C8FF]/10 border border-[#00C8FF]/20 rounded-xl text-xs font-black uppercase text-[#00C8FF] tracking-wider select-none">
                        <ShieldCheck className="w-3.5 h-3.5" /> NextHire Pro
                      </div>
                    ) : (
                      <button
                        onClick={() => setPaywallOpen(true)}
                        className="w-full h-10 rounded-xl bg-gradient-to-r from-[#00C8FF] to-[#8040FF] hover:from-[#00E5FF] hover:to-[#9050FF] text-[#050810] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,200,255,0.15)] hover:scale-[1.02] transition-all duration-300 border-none cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5 fill-[#050810]" /> Upgrade to Pro
                      </button>
                    )}
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs font-semibold text-muted-foreground">
            <p className="mb-4 md:mb-0">
              © {new Date().getFullYear()} NextHire. All rights reserved. Powered by Gemini 2.5.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="hover:text-white transition-colors duration-200">
                Privacy Policy
              </Link>
              <span>|</span>
              <span className="cursor-pointer hover:text-white transition-colors duration-200">
                Terms of Service
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mounting the perfect centered SaaSUpgradeModal */}
      <SaaSUpgradeModal open={paywallOpen} setOpen={setPaywallOpen} />
    </footer>
  );
};

export default Footer;
