import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { 
  Mic, 
  MicOff, 
  Play, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  RotateCcw, 
  Trophy, 
  TrendingUp, 
  AlertTriangle, 
  Check, 
  X, 
  MessageSquare, 
  Loader2,
  ChevronDown,
  ChevronUp,
  Brain
} from "lucide-react";
import { evaluateMockInterview, getMockInterviewResult } from "@/redux/slices/application.slice";

const MockInterviewSandbox = ({ applicationId, job, onClose }) => {
  const dispatch = useDispatch();
  const { mockInterview, loading } = useSelector((state) => state.application);
  const user = useSelector((state) => state.user.user);

  const [currentStep, setCurrentStep] = useState(0); // 0: intro, 1: interview, 2: evaluation
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isRecording, setIsRecording] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [revealModelAnswer, setRevealModelAnswer] = useState({});

  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = false;
      rec.lang = "en-US";

      rec.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        setAnswers((prev) => ({
          ...prev,
          [currentQuestionIndex]: (prev[currentQuestionIndex] || "") + " " + transcript
        }));
      };

      rec.onerror = (e) => {
        console.error("Speech recognition error:", e);
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    }
  }, [currentQuestionIndex]);

  // Load existing mock interview result or generate questions from parent
  useEffect(() => {
    if (applicationId) {
      dispatch(getMockInterviewResult(applicationId)).then((res) => {
        if (res?.payload?.mockInterviewResult) {
          setCurrentStep(2); // Jump directly to results if already completed
        }
      });
    }

    if (job?.applications) {
      const userApp = job.applications.find(
        (app) => (app.applicant?._id || app.applicant) === user?._id
      );
      if (userApp?.interviewQuestions) {
        setQuestions(userApp.interviewQuestions);
      }
    }
  }, [applicationId, job, user, dispatch]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast.info("Speech recognition is not supported in this browser. Please type your answer.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        toast.success("Listening... Speak clearly into your mic.");
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
      }
    }
  };

  const handleTextChange = (e) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: e.target.value
    });
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      if (isRecording) {
        recognitionRef.current.stop();
      }
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      if (isRecording) {
        recognitionRef.current.stop();
      }
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitInterview = () => {
    if (isRecording) {
      recognitionRef.current.stop();
    }

    // Format QAs for backend
    const formattedAnswers = questions.map((q, idx) => ({
      question: q.question,
      userAnswer: (answers[idx] || "").trim() || "No answer provided."
    }));

    setCurrentStep(3); // Loading step

    dispatch(evaluateMockInterview({ applicationId, answers: formattedAnswers }))
      .then((res) => {
        if (res?.payload?.success) {
          toast.success("Mock Interview completed and evaluated!");
          setCurrentStep(2); // Show results dashboard
        } else {
          toast.error("Failed to evaluate mock interview. Please try again.");
          setCurrentStep(1); // Go back to interview
        }
      })
      .catch((err) => {
        console.error("Mock interview submission error:", err);
        toast.error("An error occurred. Please try again.");
        setCurrentStep(1);
      });
  };

  const restartInterview = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setCurrentStep(1);
    setRevealModelAnswer({});
  };

  const result = mockInterview || (job?.applications?.find(
    (app) => (app.applicant?._id || app.applicant) === user?._id
  )?.mockInterviewResult);

  // Helper to color-code verdict
  const getVerdictStyle = (verdict) => {
    switch (verdict?.toLowerCase()) {
      case "excellent fit":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]";
      case "ready for real interview":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]";
      case "needs practice":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]";
      default:
        return "bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.15)]";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#080C1E]/95 border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,200,255,0.1)] overflow-hidden my-8">
        
        {/* Fine lined cyber grid background decoration */}
        <div className="grid-overlay opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-[#8040FF]/5 via-transparent to-[#00C8FF]/5 pointer-events-none -z-10"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#00C8FF]/20 to-[#8040FF]/20 border border-[#00C8FF]/30">
              <Brain className="w-6 h-6 text-[#00C8FF] animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-black bg-gradient-to-r from-[#00C8FF] to-[#8040FF] bg-clip-text text-transparent">
                AI Mock Interview Sandbox
              </h2>
              <p className="text-xs text-muted-foreground font-medium">Powered by NextHire Intelligence Engine</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-white/5 text-muted-foreground hover:text-white transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* --- STEP 0: INTRODUCTION / TUTORIAL --- */}
        {currentStep === 0 && (
          <div className="p-8 relative z-10 space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="px-3 py-1 text-xs font-bold text-[#8040FF] bg-[#8040FF]/15 rounded-full border border-[#8040FF]/30 tracking-wider uppercase">
                Welcome Candidate
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-[#E6EDF3]">
                Practice, Evaluate, and Succeed
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Welcome to your fully custom practice sandbox. We have generated **5 personalized interview questions** tailored exactly to the **{job.title}** role requirements and the skills on your profile.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#00C8FF]/10 flex items-center justify-center border border-[#00C8FF]/20">
                  <Play className="w-5 h-5 text-[#00C8FF]" />
                </div>
                <h4 className="font-bold text-[#E6EDF3]">5 Custom Questions</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">Questions range from fundamental tech queries to behavioral and role-specific architecture tasks.</p>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#8040FF]/10 flex items-center justify-center border border-[#8040FF]/20">
                  <Mic className="w-5 h-5 text-[#8040FF]" />
                </div>
                <h4 className="font-bold text-[#E6EDF3]">Speech-to-Text Support</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">Practice speaking. Use the integrated dictation toggle to write your answers hands-free.</p>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                </div>
                <h4 className="font-bold text-[#E6EDF3]">Rigorous AI Evaluation</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">Gemini evaluates your answers, highlights gaps, rates scores, and builds elite model answers.</p>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button
                onClick={() => {
                  if (questions.length === 0) {
                    toast.info("Hiring manager has not generated mock questions for this job yet. Please request AI interview questions.");
                    return;
                  }
                  setCurrentStep(1);
                }}
                className="bg-gradient-to-r from-[#00C8FF] to-[#8040FF] hover:opacity-90 text-[#050810] px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transform hover:scale-105 transition-all duration-300 shadow-[0_0_25px_rgba(0,200,255,0.3)]"
              >
                Start Mock Interview <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* --- STEP 1: INTERVIEW WIZARD --- */}
        {currentStep === 1 && (
          <div className="p-6 relative z-10 space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-muted-foreground">
                <span>QUESTION {currentQuestionIndex + 1} OF {questions.length}</span>
                <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% COMPLETED</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#00C8FF] to-[#8040FF] transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question Panel */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#00C8FF]/5 rounded-full blur-xl"></div>
              <span className="px-2 py-1 text-[10px] font-black tracking-wider text-[#00C8FF] bg-[#00C8FF]/10 rounded-md border border-[#00C8FF]/20 uppercase">
                Mock Question
              </span>
              <h3 className="text-lg md:text-xl font-bold text-[#E6EDF3]">
                {questions[currentQuestionIndex]?.question}
              </h3>
            </div>

            {/* Answer Input */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-[#8040FF]" /> Dictate or Type Your Answer
                </label>
                <button
                  onClick={toggleRecording}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-300 ${
                    isRecording 
                      ? "bg-red-500/20 text-red-400 border-red-500/40 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                      : "bg-white/5 text-[#E6EDF3] border-white/10 hover:border-[#00C8FF]/30 hover:bg-white/10"
                  }`}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="w-4 h-4 text-red-400" /> Stop Listening
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 text-[#00C8FF]" /> Talk Hands-Free (STT)
                    </>
                  )}
                </button>
              </div>

              <textarea
                value={answers[currentQuestionIndex] || ""}
                onChange={handleTextChange}
                placeholder="Compose your detailed technical answer here. Mention specific architectural choices, tech stacks, or real project experiences to get the highest evaluation score."
                className="w-full h-44 p-4 rounded-xl bg-[#03060E] border border-white/5 text-[#E6EDF3] placeholder-muted-foreground focus:outline-none focus:border-[#00C8FF]/50 focus:ring-1 focus:ring-[#00C8FF]/50 transition-all duration-200 resize-none font-medium leading-relaxed"
              ></textarea>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold border border-white/5 bg-white/5 text-[#E6EDF3] hover:bg-white/10 disabled:opacity-50 disabled:pointer-events-none transition-all duration-200"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={nextQuestion}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold bg-[#00C8FF] hover:bg-[#00E5FF] text-[#050810] shadow-[0_0_15px_rgba(0,200,255,0.2)] hover:scale-105 transition-all duration-200"
                >
                  Next Question <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={submitInterview}
                  className="flex items-center gap-1.5 px-6 py-3 rounded-xl text-sm font-black bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 text-[#050810] shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105 transition-all duration-200"
                >
                  <CheckCircle className="w-5 h-5" /> Submit Interview
                </button>
              )}
            </div>
          </div>
        )}

        {/* --- STEP 3: LOADING SCREEN --- */}
        {currentStep === 3 && (
          <div className="p-12 relative z-10 flex flex-col items-center justify-center space-y-6">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full border-4 border-[#00C8FF]/10 animate-pulse"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-[#00C8FF] border-r-[#8040FF] animate-spin shadow-[0_0_20px_rgba(0,200,255,0.3)]"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain className="w-10 h-10 text-[#00C8FF] animate-pulse" />
              </div>
            </div>
            <div className="text-center max-w-sm space-y-2">
              <h3 className="text-xl font-bold text-[#E6EDF3] animate-pulse">AI Evaluation in Progress</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Gemini is grading your answers, mapping missing keywords, cross-referencing your profile, and generating premium feedback models...
              </p>
            </div>
          </div>
        )}

        {/* --- STEP 2: PERFORMANCE REPORT DASHBOARD --- */}
        {currentStep === 2 && result && (
          <div className="p-6 relative z-10 space-y-6 max-h-[calc(100vh-220px)] overflow-y-auto pr-2">
            
            {/* Top Score banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center p-6 rounded-2xl bg-white/[0.02] border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#8040FF]/5 rounded-full blur-2xl"></div>
              
              {/* Radial Progress Score */}
              <div className="flex flex-col items-center justify-center space-y-2 border-b md:border-b-0 md:border-r border-white/5 pb-4 md:pb-0">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="transparent" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      stroke="url(#gradient)" 
                      strokeWidth="8" 
                      fill="transparent" 
                      strokeDasharray="251.2" 
                      strokeDashoffset={251.2 - (251.2 * result.overallScore) / 100}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00C8FF" />
                        <stop offset="100%" stopColor="#8040FF" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-[#E6EDF3] drop-shadow-[0_0_15px_rgba(0,200,255,0.2)]">
                      {result.overallScore}%
                    </span>
                    <span className="text-[10px] text-muted-foreground font-black tracking-widest uppercase">Score</span>
                  </div>
                </div>
              </div>

              {/* Verdict & Details */}
              <div className="md:col-span-2 space-y-4 text-center md:text-left pt-2 md:pt-0">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-black border uppercase tracking-wider ${getVerdictStyle(result.verdict)}`}>
                    {result.verdict}
                  </span>
                  <span className="text-xs text-muted-foreground font-bold flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Completed on {new Date(result.completedAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="text-xl font-extrabold text-[#E6EDF3]">
                  Your AI Interview Performance Report
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Excellent work! We evaluated your responses for tech depth, design choice clarity, and industry standard vocabulary. Review your feedback below to master your real interview!
                </p>
              </div>
            </div>

            {/* Strengths & Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl"></div>
                <h4 className="font-extrabold text-sm text-emerald-400 flex items-center gap-2">
                  <Trophy className="w-4.5 h-4.5 text-emerald-400" /> Key Strengths Identified
                </h4>
                <ul className="space-y-2">
                  {result.keyStrengths?.map((str, idx) => (
                    <li key={idx} className="text-xs text-[#8B949E] leading-relaxed flex items-start gap-2 font-medium">
                      <span className="inline-flex mt-0.5 p-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        <Check className="w-3 h-3" />
                      </span>
                      {str}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 rounded-full blur-xl"></div>
                <h4 className="font-extrabold text-sm text-amber-400 flex items-center gap-2">
                  <TrendingUp className="w-4.5 h-4.5 text-amber-400" /> Recommended Action Items
                </h4>
                <ul className="space-y-2">
                  {result.areasOfImprovement?.map((imp, idx) => (
                    <li key={idx} className="text-xs text-[#8B949E] leading-relaxed flex items-start gap-2 font-medium">
                      <span className="inline-flex mt-0.5 p-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
                        <AlertTriangle className="w-3 h-3 animate-pulse" />
                      </span>
                      {imp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Question Breakdown Accordion */}
            <div className="space-y-4">
              <h4 className="font-extrabold text-[#E6EDF3] flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#00C8FF]" /> Question-by-Question Analytics
              </h4>

              <div className="space-y-3">
                {result.answers?.map((qa, index) => (
                  <div 
                    key={index}
                    className="rounded-2xl border bg-white/[0.01] overflow-hidden transition-all duration-300"
                    style={{
                      borderColor: activeAccordion === index ? "rgba(0, 200, 255, 0.2)" : "rgba(255, 255, 255, 0.05)",
                      backgroundColor: activeAccordion === index ? "rgba(8, 12, 30, 0.4)" : "rgba(255, 255, 255, 0.01)"
                    }}
                  >
                    {/* Header */}
                    <button
                      onClick={() => setActiveAccordion(activeAccordion === index ? null : index)}
                      className="w-full flex items-center justify-between p-4 text-left transition-colors duration-200 hover:bg-white/[0.01]"
                    >
                      <div className="flex items-center gap-3 flex-1 pr-4">
                        <span className={`px-2.5 py-1 text-xs font-black rounded-lg ${
                          qa.score >= 80 
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : qa.score >= 50
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}>
                          {qa.score}%
                        </span>
                        <p className="font-bold text-sm text-[#E6EDF3] line-clamp-1">
                          {index + 1}. {qa.question}
                        </p>
                      </div>
                      {activeAccordion === index ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>

                    {/* Content */}
                    {activeAccordion === index && (
                      <div className="p-4 border-t border-white/5 space-y-4 bg-black/20 text-xs md:text-sm font-medium">
                        
                        {/* Question expectations */}
                        {questions[index]?.guidelines && (
                          <div className="space-y-1 bg-white/[0.01] p-3.5 rounded-xl border border-white/5">
                            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Expectations / Evaluation Scope</span>
                            <p className="text-xs text-[#8B949E] leading-relaxed">{questions[index].guidelines}</p>
                          </div>
                        )}

                        {/* User Answer */}
                        <div className="space-y-1 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                          <span className="text-[10px] font-black text-[#8040FF] uppercase tracking-widest">Your Practice Response</span>
                          <p className="text-xs text-[#E6EDF3] leading-relaxed">{qa.userAnswer}</p>
                        </div>

                        {/* AI Feedback */}
                        <div className="space-y-1 p-3.5 rounded-xl bg-[#00C8FF]/5 border border-[#00C8FF]/10">
                          <span className="text-[10px] font-black text-[#00C8FF] uppercase tracking-widest flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" /> AI Feedback & Diagnostic Analysis
                          </span>
                          <p className="text-xs text-[#8B949E] leading-relaxed">{qa.feedback}</p>
                        </div>

                        {/* Model Answer Showcase */}
                        <div className="space-y-2">
                          <button
                            onClick={() => setRevealModelAnswer(prev => ({ ...prev, [index]: !prev[index] }))}
                            className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00C8FF] to-[#8040FF] hover:opacity-85 flex items-center gap-1 select-none"
                          >
                            {revealModelAnswer[index] ? "Hide Model Answer Guide" : "Reveal Professional Model Answer Guide"}
                          </button>
                          {revealModelAnswer[index] && (
                            <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-xs text-[#8B949E] leading-relaxed space-y-1">
                              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">Standard-Setter Ideal Response</span>
                              <p className="italic leading-relaxed">{qa.modelAnswer}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Restart & close actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
              <button
                onClick={restartInterview}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold border border-[#8040FF]/30 text-[#8040FF] bg-[#8040FF]/5 hover:bg-[#8040FF]/15 transition-all duration-200"
              >
                <RotateCcw className="w-4 h-4" /> Restart Sandbox Session
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
  );
};

export default MockInterviewSandbox;
