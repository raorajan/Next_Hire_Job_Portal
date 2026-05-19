import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateApplicationStatus } from "@/redux/slices/application.slice";
import { useDispatch } from "react-redux";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import Loader from "../common/Loader";
import fetchFromApiServer from "@/services";
import { Sparkles, Brain, Award, CheckCircle, HelpCircle, X, ShieldAlert, Cpu } from "lucide-react";
import SaaSUpgradeModal from "../common/SaaSUpgradeModal";

const ApplicantsTable = ({ applicants: initialApplicants }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [applicantActions, setApplicantActions] = useState({});
  const [applicants, setApplicants] = useState([]);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Filtering & Sorting State
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  // AI Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  
  // Tab 1: AI Match score State
  const [aiData, setAiData] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Initializing neural matching engine...");

  // Tab 2: Interview questions State
  const [activeTab, setActiveTab] = useState("match"); // "match", "interview", or "outreach"
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questionsText, setQuestionsText] = useState("Initializing questions drafter...");

  // Tab 3: Outreach email draft State
  const [draftType, setDraftType] = useState("invite"); // "invite" or "rejection"
  const [draftSubject, setDraftSubject] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [draftLoading, setDraftLoading] = useState(false);
  const [draftText, setDraftText] = useState("Drafting email context...");

  useEffect(() => {
    if (initialApplicants) {
      setApplicants([...initialApplicants]);
    }
  }, [initialApplicants]);

  useEffect(() => {
    const initialActions = {};
    applicants?.forEach((item) => {
      initialActions[item?._id] =
        item?.status?.charAt(0).toUpperCase() + item?.status?.slice(1);
    });
    setApplicantActions(initialActions);
  }, [applicants]);

  const statusHandler = async (action, id) => {
    const status = action === "accept" ? "Accepted" : "Rejected";
    try {
      setIsLoading(true);
      const res = await dispatch(
        updateApplicationStatus({ applicationId: id, status })
      );
      if (res?.payload?.status === 200) {
        setApplicantActions((prev) => ({ ...prev, [id]: status }));
        toast.success(`Application ${status} successfully!`);
      } else {
        toast.error("Failed to update application status!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const openAiReport = async (application) => {
    setSelectedApplicant(application);
    setModalOpen(true);
    setAiLoading(true);
    setAiData(null);
    setActiveTab("match");
    setQuestions([]);
    setDraftType("invite");
    setDraftSubject("");
    setDraftBody("");
    
    // Cycle futuristic matching messages
    const messages = [
      "Initializing neural matching engine...",
      "Analyzing candidate skills and experience...",
      "Comparing profile data against role constraints...",
      "Synthesizing suitability score and reasons...",
      "Finalizing deep AI evaluation matrix..."
    ];
    let msgIndex = 0;
    const interval = setInterval(() => {
      msgIndex = (msgIndex + 1) % messages.length;
      setLoadingText(messages[msgIndex]);
    }, 1200);

    try {
      const response = await fetchFromApiServer("GET", `api/v1/application/${application._id}/ai-score`);
      if (response?.data?.success) {
        setAiData(response.data);
        
        // Update local state instantly so the score reflects on the card and filter lists
        setApplicants(prev => prev.map(item => {
          if (item._id === application._id) {
            return {
              ...item,
              aiScore: response.data.aiScore,
              aiReason: response.data.aiReason,
              aiSummarizedProfile: response.data.aiSummarizedProfile
            };
          }
          return item;
        }));
      } else {
        toast.error("Failed to calculate AI suitability matrix.");
        setModalOpen(false);
      }
    } catch (error) {
      console.error(error);
      if (error?.response?.status === 403 || error?.response?.data?.needsUpgrade) {
        setModalOpen(false);
        setPaywallOpen(true);
      } else {
        toast.error("AI service is currently establishing connectivity. Please try again.");
        setModalOpen(false);
      }
    } finally {
      clearInterval(interval);
      setAiLoading(false);
    }
  };

  const fetchInterviewQuestions = async (application) => {
    if (questions.length > 0) return;
    setQuestionsLoading(true);
    setQuestionsText("Initializing questions drafter...");
    
    const messages = [
      "Initializing interview drafter...",
      "Extracting resume parameters...",
      "Analyzing skill matching ratios...",
      "Formulating targeted technical questions...",
      "Drafting expected answer guidelines..."
    ];
    let msgIndex = 0;
    const interval = setInterval(() => {
      msgIndex = (msgIndex + 1) % messages.length;
      setQuestionsText(messages[msgIndex]);
    }, 1200);

    try {
      const response = await fetchFromApiServer("GET", `api/v1/application/${application._id}/interview-questions`);
      if (response?.data?.success) {
        setQuestions(response.data.interviewQuestions);
      } else {
        toast.error("Failed to generate targeted assessment guide.");
      }
    } catch (error) {
      console.error(error);
      if (error?.response?.status === 403 || error?.response?.data?.needsUpgrade) {
        setPaywallOpen(true);
      } else {
        toast.error("AI service is currently establishing connectivity. Please try again.");
      }
    } finally {
      clearInterval(interval);
      setQuestionsLoading(false);
    }
  };

  const fetchEmailDraft = async (application, type) => {
    setDraftLoading(true);
    setDraftText("Initializing outreach drafter...");
    
    const messages = [
      "Initializing outreach drafter...",
      "Customizing candidate salutation...",
      "Analyzing match matrix parameters...",
      "Drafting professional email subject...",
      "Crafting highly personalized email body..."
    ];
    let msgIndex = 0;
    const interval = setInterval(() => {
      msgIndex = (msgIndex + 1) % messages.length;
      setDraftText(messages[msgIndex]);
    }, 1200);

    try {
      const response = await fetchFromApiServer("POST", `api/v1/application/${application._id}/email-draft`, {
        type: type
      });
      if (response?.data?.success) {
        setDraftSubject(response.data.draft.subject);
        setDraftBody(response.data.draft.body);
      } else {
        toast.error("Failed to generate outreach draft.");
      }
    } catch (error) {
      console.error(error);
      if (error?.response?.status === 403 || error?.response?.data?.needsUpgrade) {
        setPaywallOpen(true);
      } else {
        toast.error("AI service is currently establishing connectivity. Please try again.");
      }
    } finally {
      clearInterval(interval);
      setDraftLoading(false);
    }
  };

  const copyToClipboard = () => {
    const formatted = `Subject: ${draftSubject}\n\n${draftBody}`;
    navigator.clipboard.writeText(formatted);
    toast.success("📋 Outreach email copied to clipboard!");
  };

  // Process sorting and filtering in memory
  const processedApplicants = React.useMemo(() => {
    let list = [...applicants];

    // 1. Filter Fit
    if (filterType === "premium") {
      list = list.filter(item => item.aiScore >= 80);
    } else if (filterType === "feasible") {
      list = list.filter(item => item.aiScore >= 50 && item.aiScore < 80);
    }

    // 2. Sort Order
    if (sortBy === "score") {
      list.sort((a, b) => {
        const scoreA = a.aiScore !== undefined ? a.aiScore : -1;
        const scoreB = b.aiScore !== undefined ? b.aiScore : -1;
        return scoreB - scoreA;
      });
    } else {
      // Default: date (newest first)
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return list;
  }, [applicants, filterType, sortBy]);

  return (
    <div className='relative z-10'>
      {isLoading && <Loader />}

      {/* High-tech Filter & Sort Command Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8 bg-[#080C1E]/60 border border-white/5 p-4 rounded-3xl backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mr-2">Filter Fit:</span>
          {[
            { id: "all", label: "All Candidates" },
            { id: "premium", label: "Premium Fit (80%+)" },
            { id: "feasible", label: "Feasible Fit (50%+)" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider border transition-all duration-300 ${
                filterType === tab.id
                  ? "bg-[#00C8FF]/10 border-[#00C8FF]/40 text-[#00C8FF] shadow-[0_0_15px_rgba(0,200,255,0.15)]"
                  : "bg-white/5 border-transparent text-muted-foreground hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 justify-between md:justify-end">
          <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#050810] border border-white/10 rounded-xl px-3 py-2 text-[9px] font-black uppercase tracking-wider text-white focus:outline-none focus:border-[#00C8FF]/50 transition-colors"
          >
            <option value="date">Application Date</option>
            <option value="score">AI Match Score</option>
          </select>
        </div>
      </div>

      {processedApplicants.length === 0 ? (
        <div className="text-center py-20 bg-[#080C1E]/30 rounded-3xl border border-white/5">
          <p className="text-muted-foreground font-black text-sm uppercase tracking-wider">No candidates match active filter parameters.</p>
        </div>
      ) : (
        /* Applicants Grid */
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
          {processedApplicants.map((item) => {
            const status = applicantActions[item?._id];
            const isAccepted = status === "Accepted";
            const isRejected = status === "Rejected";

            return (
              <div
                key={item?._id}
                className='group relative bg-[#080C1E]/80 backdrop-blur-xl border border-white/5 shadow-[0_0_50px_rgba(0,100,220,0.03)] p-6 hover:shadow-[0_0_40px_rgba(0,200,255,0.15)] transition-all duration-500 hover:border-[#00C8FF]/30 flex flex-col h-[520px] overflow-hidden rounded-3xl'
              >
                <div className='absolute inset-0 bg-gradient-to-br from-[#00C8FF]/5 to-[#8040FF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none'></div>
                
                {/* Glowing Match Score Badge (Top Right) */}
                {item?.aiScore !== undefined && item?.aiScore !== null ? (
                  <div className={`absolute top-4 right-4 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border shadow-sm ${
                    item.aiScore >= 80 
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                      : item.aiScore >= 50 
                        ? "bg-[#00C8FF]/10 border-[#00C8FF]/30 text-[#00C8FF]" 
                        : "bg-red-500/10 border-red-500/30 text-red-400"
                  }`}>
                    ✨ AI: {item.aiScore}%
                  </div>
                ) : (
                  <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border bg-white/5 border-white/5 text-white/35">
                    ✨ AI: Pending
                  </div>
                )}

                <div className='relative z-10 flex flex-col h-full justify-between'>
                  <div>
                    {/* Profile Info */}
                    <div className='flex items-center mb-6 mr-14'>
                      {item?.applicant?.profile?.profilePhoto?.url ? (
                        <img
                          src={item?.applicant?.profile?.profilePhoto?.url}
                          alt={`${item?.applicant?.fullname}'s profile`}
                          className='w-14 h-14 rounded-2xl border border-white/10 group-hover:border-[#00C8FF]/40 transition-colors duration-500 object-cover mr-4 shadow-sm'
                        />
                      ) : (
                        <div className='w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mr-4 border border-white/10'>
                          <svg className="w-6 h-6 text-muted-foreground opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                      <div className='truncate'>
                        <h2 className='font-black text-lg text-white tracking-tight group-hover:text-[#00C8FF] transition-colors truncate'>
                          {item?.applicant?.fullname}
                        </h2>
                        <p className='text-[#00C8FF] text-[10px] font-black uppercase tracking-widest truncate drop-shadow-[0_0_10px_rgba(0,200,255,0.2)]'>
                          {item?.applicant?.email}
                        </p>
                      </div>
                    </div>

                    {/* Applicant Details */}
                    <div className='space-y-4 mb-4'>
                      <div className='bg-white/5 border border-white/5 rounded-2xl p-4 italic text-xs text-muted-foreground leading-relaxed group-hover:bg-white/10 transition-colors h-[72px] overflow-y-auto line-clamp-3'>
                        "{item?.applicant?.profile?.bio || "No candidate statement provided."}"
                      </div>
                      
                      <div className='space-y-2 text-xs font-bold'>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className='text-muted-foreground uppercase tracking-widest text-[9px]'>Skills</span>
                          <span className="text-white truncate max-w-[120px]">{item?.applicant?.profile?.skills?.join(", ") || "N/A"}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className='text-muted-foreground uppercase tracking-widest text-[9px]'>Applied On</span>
                          <span className="text-white">{new Date(item?.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className='text-muted-foreground uppercase tracking-widest text-[9px]'>Resume</span>
                          {item?.applicant?.profile?.resume?.url ? (
                            <a
                              className='text-[#00C8FF] hover:text-[#00E5FF] italic transition-colors drop-shadow-[0_0_10px_rgba(0,200,255,0.2)]'
                              href={item?.applicant?.profile?.resume?.url}
                              target='_blank'
                              rel='noopener noreferrer'
                            >
                              View Document →
                            </a>
                          ) : (
                            <span className="text-destructive/60 uppercase tracking-widest text-[9px]">Missing</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    {/* AI Suitability Report Trigger Button */}
                    <Button
                      onClick={() => openAiReport(item)}
                      variant="outline"
                      className="w-full h-11 rounded-xl bg-[#00C8FF]/5 border border-[#00C8FF]/20 hover:border-[#00C8FF]/50 text-[#00C8FF] hover:text-white font-extrabold text-[10px] uppercase tracking-widest transition-all duration-300 mt-2 mb-4"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#00C8FF]" /> Match Scoring Matrix
                    </Button>

                    {/* Status Indicator */}
                    <div className="mb-4">
                      {isAccepted && (
                        <div className="w-full py-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] text-center shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                          Status: Accepted
                        </div>
                      )}
                      {isRejected && (
                        <div className="w-full py-2.5 bg-destructive/10 border border-destructive/30 rounded-xl text-destructive text-[10px] font-black uppercase tracking-[0.2em] text-center">
                          Status: Redacted
                        </div>
                      )}
                      {!isAccepted && !isRejected && (
                        <div className="w-full py-2.5 bg-white/5 border border-white/10 rounded-xl text-white/60 text-[10px] font-black uppercase tracking-[0.2em] text-center">
                          Status: Under Review
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className='flex gap-3'>
                      <Button
                        onClick={() => statusHandler("accept", item?._id)}
                        className={`flex-1 h-12 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 border-none ${
                            isAccepted 
                              ? "bg-emerald-500 text-white cursor-default" 
                              : isRejected 
                                ? "bg-white/5 text-white/20 cursor-not-allowed" 
                                : "bg-[#00C8FF] hover:bg-[#00E5FF] text-[#050810] shadow-[0_0_20px_rgba(0,200,255,0.2)] hover:shadow-[0_0_30px_rgba(0,200,255,0.4)] hover:scale-[1.02]"
                          }`}
                        disabled={isAccepted || isRejected}
                      >
                        {isAccepted ? "Accepted" : "Accept"}
                      </Button>

                      <Button
                        onClick={() => statusHandler("reject", item?._id)}
                        className={`flex-1 h-12 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 border-none ${
                            isRejected 
                              ? "bg-destructive text-white cursor-default" 
                              : isAccepted 
                                ? "bg-white/5 text-white/20 cursor-not-allowed" 
                                : "bg-white/5 text-white hover:bg-red-500 hover:text-[#050810] border border-white/10"
                          }`}
                        disabled={isAccepted || isRejected}
                      >
                        {isRejected ? "Rejected" : "Reject"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Futuristic AI Suitability Report Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-500">
          <div className="relative w-full max-w-xl bg-[#080C1E] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(0,200,255,0.2)] animate-in fade-in zoom-in-95 duration-300">
            
            {/* Hologram Scanner Line Overlay */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#00C8FF] to-transparent shadow-[0_0_15px_#00C8FF] animate-pulse"></div>
            
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#00C8FF]/10 border border-[#00C8FF]/20 flex items-center justify-center text-[#00C8FF]">
                  <Brain className="w-4.5 h-4.5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-md font-black tracking-tight text-white uppercase italic">
                    AI Suitability Report
                  </h3>
                  <p className="text-[9px] text-muted-foreground font-bold tracking-widest uppercase mt-0.5">Quantum Evaluation Engine</p>
                </div>
              </div>
              <button 
                onClick={() => setModalOpen(false)}
                className="p-1.5 hover:bg-white/5 text-muted-foreground hover:text-white rounded-xl transition-all animate-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Dynamic Tabs Navigation */}
            {aiData && (
              <div className="flex border-b border-white/5 bg-[#050810]/40 px-5">
                {[
                  { id: "match", label: "✨ Suitability Matrix" },
                  { id: "interview", label: "🎙️ Interview Prep Guide" },
                  { id: "outreach", label: "✉️ Outreach Draft" }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      if (tab.id === "interview") {
                        fetchInterviewQuestions(selectedApplicant);
                      } else if (tab.id === "outreach") {
                        fetchEmailDraft(selectedApplicant, draftType);
                      }
                    }}
                    className={`py-3 px-4 text-[10px] font-black uppercase tracking-wider border-b-2 transition-all duration-300 ${
                      activeTab === tab.id
                        ? "border-[#00C8FF] text-[#00C8FF] drop-shadow-[0_0_10px_rgba(0,200,255,0.2)]"
                        : "border-transparent text-muted-foreground hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}

            {/* Content Area */}
            {activeTab === "match" && (
              <div className="p-5 max-h-[70vh] overflow-y-auto space-y-5">
                {aiLoading ? (
                  <div className="flex flex-col items-center justify-center py-16 space-y-5">
                    <div className="relative flex items-center justify-center">
                      <div className="w-16 h-16 border-4 border-[#00C8FF]/10 border-t-[#00C8FF] rounded-full animate-spin"></div>
                      <Cpu className="w-6 h-6 text-[#00C8FF] absolute animate-pulse" />
                    </div>
                    <div className="text-center">
                      <p className="text-white font-extrabold tracking-wide uppercase text-xs animate-pulse">{loadingText}</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-1 font-bold uppercase tracking-widest">Integrating Candidate Parameters...</p>
                    </div>
                  </div>
                ) : aiData ? (
                  <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start animate-in fade-in duration-300">
                    
                    {/* Left Side: Glowing Score Dial */}
                    <div className="flex flex-col items-center justify-center text-center space-y-3 shrink-0">
                      <div className="relative flex items-center justify-center">
                        {/* Score Dial Circle */}
                        <svg className="w-28 h-28 transform -rotate-90">
                          <circle
                            cx="56"
                            cy="56"
                            r="46"
                            className="stroke-white/5"
                            strokeWidth="8"
                            fill="transparent"
                          />
                          <circle
                            cx="56"
                            cy="56"
                            r="46"
                            className={`transition-all duration-1000 ease-out ${
                              aiData.aiScore >= 80 
                                ? "stroke-emerald-500" 
                                : aiData.aiScore >= 50 
                                  ? "stroke-[#00C8FF]" 
                                  : "stroke-red-500"
                            }`}
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={289}
                            strokeDashoffset={289 - (289 * aiData.aiScore) / 100}
                            strokeLinecap="round"
                          />
                        </svg>
                        
                        {/* Score Percentage */}
                        <div className="absolute text-center">
                          <span className={`text-2xl font-black italic block tracking-tighter ${
                            aiData.aiScore >= 80 
                              ? "text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
                              : aiData.aiScore >= 50 
                                ? "text-[#00C8FF] drop-shadow-[0_0_15px_rgba(0,200,255,0.3)]" 
                                : "text-red-400 drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                          }`}>
                            {aiData.aiScore}%
                          </span>
                          <span className="text-[8px] text-muted-foreground uppercase font-black tracking-widest block">MATCH</span>
                        </div>
                      </div>

                      <div>
                        <span className={`px-3 py-1 border rounded-full text-[8px] font-black uppercase tracking-widest ${
                          aiData.aiScore >= 80 
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                            : aiData.aiScore >= 50 
                              ? "bg-[#00C8FF]/10 border-[#00C8FF]/30 text-[#00C8FF]" 
                              : "bg-red-500/10 border-red-500/30 text-red-400"
                        }`}>
                          {aiData.aiScore >= 80 ? "Premium Fit" : aiData.aiScore >= 50 ? "Feasible" : "Critical Gap"}
                        </span>
                      </div>
                    </div>

                    {/* Right Side: Insights */}
                    <div className="flex-1 space-y-4 text-start w-full">
                      {/* Dossier Header */}
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <p className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-widest">Candidate</p>
                        <h4 className="text-sm font-extrabold text-white mt-0.5">{selectedApplicant?.applicant?.fullname}</h4>
                        <p className="text-[10px] text-[#00C8FF] font-bold mt-0.5 truncate">{selectedApplicant?.applicant?.email}</p>
                      </div>

                      {/* AI Profile Summary */}
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-wider text-[#00C8FF] mb-1.5 flex items-center gap-1">
                          <Cpu className="w-3 h-3" /> Suitability Summary
                        </h4>
                        <p className="text-xs font-medium text-muted-foreground leading-relaxed bg-[#050810]/40 p-3.5 border border-white/5 rounded-xl italic animate-none">
                          "{aiData.aiSummarizedProfile}"
                        </p>
                      </div>

                      {/* Key Evaluation Reasons */}
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-wider text-[#00C8FF] mb-2 flex items-center gap-1">
                          <Award className="w-3 h-3" /> Suitability Parameters
                        </h4>
                        <ul className="space-y-1.5">
                          {aiData.aiReason?.map((reason, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs font-bold text-white/95 leading-normal">
                              <CheckCircle className="w-3.5 h-3.5 text-[#00C8FF] shrink-0 mt-0.5" />
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>

                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 space-y-2">
                    <ShieldAlert className="w-10 h-10 text-destructive" />
                    <p className="text-white font-extrabold text-xs">Failed to load suitability metrics.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "interview" && (
              /* Interview Preparation Guide Content Area */
              <div className="p-5 max-h-[70vh] overflow-y-auto space-y-5">
                {questionsLoading ? (
                  <div className="flex flex-col items-center justify-center py-16 space-y-5">
                    <div className="relative flex items-center justify-center">
                      <div className="w-16 h-16 border-4 border-[#00C8FF]/10 border-t-[#00C8FF] rounded-full animate-spin"></div>
                      <Cpu className="w-6 h-6 text-[#00C8FF] absolute animate-pulse" />
                    </div>
                    <div className="text-center">
                      <p className="text-white font-extrabold tracking-wide uppercase text-xs animate-pulse">{questionsText}</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-1 font-bold uppercase tracking-widest">Quantum Engine Processing...</p>
                    </div>
                  </div>
                ) : questions.length > 0 ? (
                  <div className="space-y-4 text-start animate-in fade-in duration-300">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-widest">Target Candidate</p>
                      <h4 className="text-sm font-extrabold text-white mt-0.5">{selectedApplicant?.applicant?.fullname}</h4>
                      <p className="text-[10px] text-[#00C8FF] font-bold mt-0.5 font-sans">Custom Behavioral & Technical Assessment Guide</p>
                    </div>

                    <div className="space-y-3.5">
                      {questions.map((item, idx) => (
                        <div key={idx} className="p-4 bg-white/5 border border-white/5 hover:border-[#00C8FF]/20 rounded-2xl transition-all duration-300">
                          <div className="flex items-start gap-3">
                            <span className="w-6 h-6 bg-[#00C8FF]/10 border border-[#00C8FF]/30 text-[#00C8FF] rounded-full flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5">
                              0{idx + 1}
                            </span>
                            <div className="space-y-2 flex-1">
                              <h4 className="text-xs font-extrabold text-white leading-relaxed">
                                {item.question}
                              </h4>
                              <div className="bg-[#050810]/40 p-3 border border-white/5 rounded-xl">
                                <p className="text-[8px] text-[#00C8FF] font-black uppercase tracking-widest mb-1">Ideal Answer Guidelines:</p>
                                <p className="text-[11px] text-muted-foreground leading-relaxed font-bold animate-none">
                                  {item.guidelines}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 space-y-2">
                    <ShieldAlert className="w-10 h-10 text-destructive" />
                    <p className="text-white font-extrabold text-xs">Failed to load targeted interview guide.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "outreach" && (
              /* Outreach Draft Content Area */
              <div className="p-5 max-h-[70vh] overflow-y-auto space-y-5">
                
                {/* Draft Type Toggles */}
                <div className="flex gap-2 bg-[#050810]/40 p-1 border border-white/5 rounded-2xl">
                  {[
                    { id: "invite", label: "Interview Invite" },
                    { id: "rejection", label: "Polite Rejection" }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setDraftType(tab.id);
                        fetchEmailDraft(selectedApplicant, tab.id);
                      }}
                      className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all duration-300 ${
                        draftType === tab.id
                          ? "bg-[#00C8FF]/10 text-[#00C8FF] border border-[#00C8FF]/30 shadow-[0_0_15px_rgba(0,200,255,0.1)] animate-none"
                          : "text-muted-foreground hover:text-white border border-transparent"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {draftLoading ? (
                  <div className="flex flex-col items-center justify-center py-16 space-y-5">
                    <div className="relative flex items-center justify-center">
                      <div className="w-16 h-16 border-4 border-[#00C8FF]/10 border-t-[#00C8FF] rounded-full animate-spin"></div>
                      <Cpu className="w-6 h-6 text-[#00C8FF] absolute animate-pulse" />
                    </div>
                    <div className="text-center">
                      <p className="text-white font-extrabold tracking-wide uppercase text-xs animate-pulse">{draftText}</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-1 font-bold uppercase tracking-widest">Quantum Engine Processing...</p>
                    </div>
                  </div>
                ) : draftSubject ? (
                  <div className="space-y-4 text-start animate-in fade-in duration-300">
                    
                    {/* Subject Line */}
                    <div className="space-y-1">
                      <label className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-widest ml-1">Subject</label>
                      <input
                        type="text"
                        value={draftSubject}
                        onChange={(e) => setDraftSubject(e.target.value)}
                        className="w-full rounded-xl bg-[#080C1E]/80 border-white/5 border-2 px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#00C8FF]/50"
                      />
                    </div>

                    {/* Email Body */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center ml-1">
                        <label className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-widest">Message Body</label>
                        <button
                          onClick={copyToClipboard}
                          className="text-[9px] text-[#00C8FF] hover:text-[#00E5FF] font-black uppercase tracking-widest transition-colors animate-none"
                        >
                          📋 Copy Full Draft
                        </button>
                      </div>
                      <textarea
                        value={draftBody}
                        onChange={(e) => setDraftBody(e.target.value)}
                        rows={10}
                        className="w-full rounded-xl bg-[#080C1E]/80 border-white/5 border-2 px-4 py-3 text-xs font-bold text-white/90 leading-relaxed focus:outline-none focus:border-[#00C8FF]/50 resize-none animate-none"
                      />
                    </div>

                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 space-y-2">
                    <ShieldAlert className="w-10 h-10 text-destructive" />
                    <p className="text-white font-extrabold text-xs">Failed to load outreach draft.</p>
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex justify-end p-4 border-t border-white/5 bg-[#050810]/50">
              <Button
                onClick={() => setModalOpen(false)}
                className="rounded-xl bg-white/5 border border-white/10 hover:border-[#00C8FF]/50 text-muted-foreground hover:text-white transition-all duration-300 font-extrabold px-5 py-2 text-xs"
              >
                Dismiss Report
              </Button>
            </div>

          </div>
        </div>
      )}

      <SaaSUpgradeModal open={paywallOpen} setOpen={setPaywallOpen} />
    </div>
  );
};

export default ApplicantsTable;
