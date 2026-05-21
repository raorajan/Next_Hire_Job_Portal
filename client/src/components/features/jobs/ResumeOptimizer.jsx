import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  X,
  FileText,
  Sparkles,
  Check,
  AlertTriangle,
  Copy,
  ChevronDown,
  ChevronUp,
  Loader2,
  Target,
  ArrowRight,
  Zap,
  Shield,
} from "lucide-react";
import { optimizeResume } from "@/redux/slices/application.slice";

const ResumeOptimizer = ({ jobId, job, onClose }) => {
  const dispatch = useDispatch();
  const { resumeOptimization, loading } = useSelector((state) => state.application);

  const [customText, setCustomText] = useState("");
  const [result, setResult] = useState(null);
  const [expandedBullet, setExpandedBullet] = useState(null);

  const runOptimization = () => {
    dispatch(optimizeResume({ jobId, customResumeText: customText || null }))
      .then((res) => {
        if (res?.payload?.success) {
          setResult(res.payload.optimization);
          toast.success("Resume analysis complete!");
        } else {
          toast.error("Failed to analyze resume. Try again.");
        }
      })
      .catch(() => toast.error("An error occurred during analysis."));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const displayResult = result || resumeOptimization;

  const getScoreColor = (score) => {
    if (score >= 80) return { ring: "#10B981", bg: "rgba(16,185,129,0.1)", text: "text-emerald-400", label: "Strong Match" };
    if (score >= 60) return { ring: "#00C8FF", bg: "rgba(0,200,255,0.1)", text: "text-cyan-400", label: "Good Potential" };
    if (score >= 40) return { ring: "#F59E0B", bg: "rgba(245,158,11,0.1)", text: "text-amber-400", label: "Needs Work" };
    return { ring: "#EF4444", bg: "rgba(239,68,68,0.1)", text: "text-red-400", label: "Low Compatibility" };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#080C1E]/95 border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(128,64,255,0.1)] overflow-hidden my-8">

        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#8040FF]/5 via-transparent to-[#00C8FF]/5 pointer-events-none -z-10"></div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#8040FF]/20 to-[#00C8FF]/20 border border-[#8040FF]/30">
              <Target className="w-6 h-6 text-[#8040FF]" />
            </div>
            <div>
              <h2 className="text-xl font-black bg-gradient-to-r from-[#8040FF] to-[#00C8FF] bg-clip-text text-transparent">
                ATS Resume Optimizer
              </h2>
              <p className="text-xs text-muted-foreground font-medium">
                Keyword analysis &amp; bullet point tailoring for <span className="text-[#00C8FF]">{job?.title}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-muted-foreground hover:text-white transition-colors duration-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 relative z-10 space-y-6 max-h-[calc(100vh-180px)] overflow-y-auto">

          {/* Input Section (visible when no result yet) */}
          {!displayResult && !loading && (
            <div className="space-y-5">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="px-3 py-1 text-xs font-bold text-[#8040FF] bg-[#8040FF]/15 rounded-full border border-[#8040FF]/30 tracking-wider uppercase">
                  Beat the bots
                </span>
                <h3 className="text-2xl font-extrabold text-[#E6EDF3]">
                  Match Your Resume to This Job
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Paste your resume text below for a deep keyword comparison, or leave blank to analyze your profile skills automatically. Our AI will identify matched &amp; missing keywords and craft optimized bullet points.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 text-center">
                  <Shield className="w-6 h-6 text-[#00C8FF] mx-auto" />
                  <h4 className="font-bold text-sm text-[#E6EDF3]">ATS Score</h4>
                  <p className="text-xs text-muted-foreground">Compatibility gauge vs. job requirements</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 text-center">
                  <Zap className="w-6 h-6 text-[#8040FF] mx-auto" />
                  <h4 className="font-bold text-sm text-[#E6EDF3]">Keyword Radar</h4>
                  <p className="text-xs text-muted-foreground">Matched vs. missing critical terms</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 text-center">
                  <FileText className="w-6 h-6 text-emerald-400 mx-auto" />
                  <h4 className="font-bold text-sm text-[#E6EDF3]">Tailored Bullets</h4>
                  <p className="text-xs text-muted-foreground">AI-crafted resume lines you can copy-paste</p>
                </div>
              </div>

              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="(Optional) Paste your full resume text here for a more accurate analysis. Leave blank to use your profile skills."
                className="w-full h-40 p-4 rounded-xl bg-[#03060E] border border-white/5 text-[#E6EDF3] placeholder-muted-foreground focus:outline-none focus:border-[#8040FF]/50 focus:ring-1 focus:ring-[#8040FF]/50 transition-all duration-200 resize-none font-medium text-sm leading-relaxed"
              />

              <div className="flex justify-center">
                <button
                  onClick={runOptimization}
                  className="bg-gradient-to-r from-[#8040FF] to-[#00C8FF] hover:opacity-90 text-[#050810] px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transform hover:scale-105 transition-all duration-300 shadow-[0_0_25px_rgba(128,64,255,0.3)]"
                >
                  <Sparkles className="w-5 h-5" /> Analyze &amp; Optimize
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="py-16 flex flex-col items-center justify-center space-y-6">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 rounded-full border-4 border-[#8040FF]/10 animate-pulse"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-[#8040FF] border-r-[#00C8FF] animate-spin shadow-[0_0_20px_rgba(128,64,255,0.3)]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Target className="w-10 h-10 text-[#8040FF] animate-pulse" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-[#E6EDF3] animate-pulse">Scanning Resume Keywords…</h3>
                <p className="text-xs text-muted-foreground">Cross-referencing your profile against ATS filters and job requirements…</p>
              </div>
            </div>
          )}

          {/* Results Dashboard */}
          {displayResult && !loading && (
            <div className="space-y-6">

              {/* Score + Summary Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                
                {/* Radial ATS Score */}
                <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/[0.02] border border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-20 h-20 rounded-full blur-2xl" style={{ background: getScoreColor(displayResult.score).bg }}></div>
                  <div className="relative w-32 h-32 flex items-center justify-center mb-3">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="transparent" />
                      <circle
                        cx="50" cy="50" r="40"
                        stroke={getScoreColor(displayResult.score).ring}
                        strokeWidth="8" fill="transparent"
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 - (251.2 * displayResult.score) / 100}
                        strokeLinecap="round"
                        style={{ filter: `drop-shadow(0 0 8px ${getScoreColor(displayResult.score).ring}40)` }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-black text-[#E6EDF3]">{displayResult.score}%</span>
                      <span className="text-[10px] text-muted-foreground font-black tracking-widest uppercase">ATS</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-black border uppercase tracking-wider ${getScoreColor(displayResult.score).text}`}
                    style={{ borderColor: `${getScoreColor(displayResult.score).ring}30`, background: getScoreColor(displayResult.score).bg }}>
                    {getScoreColor(displayResult.score).label}
                  </span>
                </div>

                {/* Matched Keywords */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl"></div>
                  <h4 className="font-extrabold text-sm text-emerald-400 flex items-center gap-2">
                    <Check className="w-4 h-4" /> Matched Keywords
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {displayResult.matchedKeywords?.map((kw, i) => (
                      <span key={i} className="px-2.5 py-1 text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">
                        {kw}
                      </span>
                    ))}
                    {(!displayResult.matchedKeywords || displayResult.matchedKeywords.length === 0) && (
                      <span className="text-xs text-muted-foreground">None detected</span>
                    )}
                  </div>
                </div>

                {/* Missing Keywords */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full blur-xl"></div>
                  <h4 className="font-extrabold text-sm text-amber-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Missing Keywords
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {displayResult.missingKeywords?.map((kw, i) => (
                      <span key={i} className="px-2.5 py-1 text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg">
                        {kw}
                      </span>
                    ))}
                    {(!displayResult.missingKeywords || displayResult.missingKeywords.length === 0) && (
                      <span className="text-xs text-muted-foreground">All keywords matched!</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Tailored Bullet Points */}
              <div className="space-y-4">
                <h4 className="font-extrabold text-[#E6EDF3] flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#8040FF]" /> AI-Tailored Resume Bullet Points
                </h4>
                <p className="text-xs text-muted-foreground -mt-2">
                  Replace generic resume lines with these ATS-optimized versions. Click to copy.
                </p>

                <div className="space-y-3">
                  {displayResult.tailoredBullets?.map((bullet, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-white/5 overflow-hidden transition-all duration-300 bg-white/[0.01] hover:border-[#8040FF]/20"
                    >
                      <button
                        onClick={() => setExpandedBullet(expandedBullet === index ? null : index)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.01] transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 pr-4">
                          <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#8040FF]/10 border border-[#8040FF]/20 flex items-center justify-center text-xs font-black text-[#8040FF]">
                            {index + 1}
                          </span>
                          <p className="font-bold text-sm text-[#E6EDF3] line-clamp-1">Bullet Point Optimization #{index + 1}</p>
                        </div>
                        {expandedBullet === index ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                      </button>

                      {expandedBullet === index && (
                        <div className="p-4 border-t border-white/5 space-y-4 bg-black/20">
                          
                          {/* Original */}
                          <div className="p-3.5 rounded-xl bg-red-500/5 border border-red-500/10 space-y-1">
                            <span className="text-[10px] font-black text-red-400 uppercase tracking-widest flex items-center gap-1">
                              <X className="w-3 h-3" /> Generic / Original
                            </span>
                            <p className="text-xs text-[#8B949E] leading-relaxed line-through decoration-red-500/30">{bullet.original}</p>
                          </div>

                          {/* Arrow */}
                          <div className="flex justify-center">
                            <ArrowRight className="w-5 h-5 text-[#8040FF] rotate-90" />
                          </div>

                          {/* Optimized */}
                          <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 space-y-1 relative group/copy">
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                              <Sparkles className="w-3 h-3" /> ATS-Optimized Version
                            </span>
                            <p className="text-xs text-[#E6EDF3] leading-relaxed font-medium">{bullet.optimized}</p>
                            <button
                              onClick={() => copyToClipboard(bullet.optimized)}
                              className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/10 text-muted-foreground hover:text-emerald-400 transition-all opacity-0 group-hover/copy:opacity-100"
                              title="Copy to clipboard"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  onClick={() => { setResult(null); setCustomText(""); }}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold border border-[#8040FF]/30 text-[#8040FF] bg-[#8040FF]/5 hover:bg-[#8040FF]/15 transition-all duration-200"
                >
                  Re-Analyze with Different Resume
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#00C8FF] text-[#050810] hover:bg-[#00E5FF] transition-all duration-200"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeOptimizer;
