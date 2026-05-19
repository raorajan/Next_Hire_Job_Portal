import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateApplicationStatus } from "@/redux/slices/application.slice";
import { useDispatch } from "react-redux";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import Loader from "../common/Loader";
import fetchFromApiServer from "@/services";
import { Sparkles, Brain, Award, CheckCircle, HelpCircle, X, ShieldAlert, Cpu } from "lucide-react";

const ApplicantsTable = ({ applicants }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [applicantActions, setApplicantActions] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // AI Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [aiData, setAiData] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Initializing neural matching engine...");

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
      const response = await fetchFromApiServer("GET", `/application/${application._id}/ai-score`);
      if (response?.data?.success) {
        setAiData(response.data);
      } else {
        toast.error("Failed to calculate AI suitability matrix.");
        setModalOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("AI service is currently establishing connectivity. Please try again.");
      setModalOpen(false);
    } finally {
      clearInterval(interval);
      setAiLoading(false);
    }
  };

  return (
    <div className='relative z-10'>
      {isLoading && <Loader />}

      {/* Applicants Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
        {applicants?.map((item) => {
          const status = applicantActions[item?._id];
          const isAccepted = status === "Accepted";
          const isRejected = status === "Rejected";

          return (
            <div
              key={item?._id}
              className='group relative bg-[#080C1E]/80 backdrop-blur-xl border border-white/5 shadow-[0_0_50px_rgba(0,100,220,0.03)] p-6 hover:shadow-[0_0_40px_rgba(0,200,255,0.15)] transition-all duration-500 hover:border-[#00C8FF]/30 flex flex-col h-[520px] overflow-hidden rounded-3xl'
            >
              <div className='absolute inset-0 bg-gradient-to-br from-[#00C8FF]/5 to-[#8040FF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none'></div>
              
              <div className='relative z-10 flex flex-col h-full justify-between'>
                <div>
                  {/* Profile Info */}
                  <div className='flex items-center mb-6'>
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
                      <h2 className='font-black text-lg text-white tracking-tight group-hover:text-[#00C8FF] transition-colors'>
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

      {/* Futuristic AI Suitability Report Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-all duration-500">
          <div className="relative w-full max-w-3xl bg-[#080C1E] border border-white/10 rounded-[32px] overflow-hidden shadow-[0_0_80px_rgba(0,200,255,0.25)] animate-in fade-in zoom-in-95 duration-300">
            
            {/* Hologram Scanner Line Overlay */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#00C8FF] to-transparent shadow-[0_0_15px_#00C8FF] animate-pulse"></div>
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 sm:p-8 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00C8FF]/10 border border-[#00C8FF]/20 flex items-center justify-center text-[#00C8FF]">
                  <Brain className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight text-white uppercase italic">
                    AI Match Suitability Report
                  </h3>
                  <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase mt-0.5">Quantum Evaluation Engine</p>
                </div>
              </div>
              <button 
                onClick={() => setModalOpen(false)}
                className="p-2 hover:bg-white/5 text-muted-foreground hover:text-white rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-6 sm:p-8 max-h-[500px] overflow-y-auto">
              {aiLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-6">
                  <div className="relative flex items-center justify-center">
                    <div className="w-20 h-20 border-4 border-[#00C8FF]/10 border-t-[#00C8FF] rounded-full animate-spin"></div>
                    <Cpu className="w-7 h-7 text-[#00C8FF] absolute animate-pulse" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-extrabold tracking-wide uppercase text-sm animate-pulse">{loadingText}</p>
                    <p className="text-xs text-muted-foreground/60 mt-1.5 font-bold uppercase tracking-widest">Integrating Candidate Parameters...</p>
                  </div>
                </div>
              ) : aiData ? (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Side: Glowing Score Dial */}
                  <div className="md:col-span-4 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="relative flex items-center justify-center">
                      {/* Score Dial Circle */}
                      <svg className="w-36 h-36 transform -rotate-90">
                        <circle
                          cx="72"
                          cy="72"
                          r="62"
                          className="stroke-white/5"
                          strokeWidth="10"
                          fill="transparent"
                        />
                        <circle
                          cx="72"
                          cy="72"
                          r="62"
                          className={`transition-all duration-1000 ease-out ${
                            aiData.aiScore >= 80 
                              ? "stroke-emerald-500" 
                              : aiData.aiScore >= 50 
                                ? "stroke-[#00C8FF]" 
                                : "stroke-red-500"
                          }`}
                          strokeWidth="10"
                          fill="transparent"
                          strokeDasharray={389}
                          strokeDashoffset={389 - (389 * aiData.aiScore) / 100}
                          strokeLinecap="round"
                        />
                      </svg>
                      
                      {/* Score Percentage */}
                      <div className="absolute text-center">
                        <span className={`text-4xl font-black italic block tracking-tighter ${
                          aiData.aiScore >= 80 
                            ? "text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
                            : aiData.aiScore >= 50 
                              ? "text-[#00C8FF] drop-shadow-[0_0_15px_rgba(0,200,255,0.3)]" 
                              : "text-red-400 drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                        }`}>
                          {aiData.aiScore}%
                        </span>
                        <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mt-0.5 block">MATCH RATE</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <span className={`px-4 py-1.5 border rounded-full text-[9px] font-black uppercase tracking-widest ${
                        aiData.aiScore >= 80 
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                          : aiData.aiScore >= 50 
                            ? "bg-[#00C8FF]/10 border-[#00C8FF]/30 text-[#00C8FF]" 
                            : "bg-red-500/10 border-red-500/30 text-red-400"
                      }`}>
                        {aiData.aiScore >= 80 ? "Premium Candidate" : aiData.aiScore >= 50 ? "Feasible Alignment" : "Critical Gap Detected"}
                      </span>
                    </div>
                  </div>

                  {/* Right Side: Insights */}
                  <div className="md:col-span-8 space-y-6 text-start">
                    {/* Dossier Header */}
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-widest">Candidate Profile</p>
                      <h4 className="text-md font-extrabold text-white mt-1">{selectedApplicant?.applicant?.fullname}</h4>
                      <p className="text-xs text-[#00C8FF] font-bold mt-0.5">{selectedApplicant?.applicant?.email}</p>
                    </div>

                    {/* AI Profile Summary */}
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-[#00C8FF] mb-2 flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5" /> Neural Suitability Summary
                      </h4>
                      <p className="text-sm font-medium text-muted-foreground leading-relaxed bg-[#050810]/40 p-4 border border-white/5 rounded-2xl italic">
                        "{aiData.aiSummarizedProfile}"
                      </p>
                    </div>

                    {/* Key Evaluation Reasons */}
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-[#00C8FF] mb-3 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5" /> Key Suitability Parameters
                      </h4>
                      <ul className="space-y-2.5">
                        {aiData.aiReason?.map((reason, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-sm font-bold text-white/95">
                            <CheckCircle className="w-4 h-4 text-[#00C8FF] shrink-0 mt-0.5" />
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 space-y-3">
                  <ShieldAlert className="w-12 h-12 text-destructive" />
                  <p className="text-white font-extrabold">Failed to load suitability metrics.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end p-6 border-t border-white/5 bg-[#050810]/50 gap-4">
              <Button
                onClick={() => setModalOpen(false)}
                className="rounded-xl bg-white/5 border border-white/10 hover:border-[#00C8FF]/50 text-muted-foreground hover:text-white transition-all duration-300 font-extrabold px-6 py-3"
              >
                Dismiss Report
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ApplicantsTable;
