import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { X, Sparkles, Check, Zap, ShieldCheck, CreditCard, ArrowLeft, ArrowRight } from "lucide-react";
import { useDispatch } from "react-redux";
import { setProStatus } from "@/redux/slices/user.slice";
import { toast } from "react-toastify";
import fetchFromApiServer from "@/services";

const SaaSUpgradeModal = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1); // 1: Pricing details, 2: Payment checkout
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  });

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "number") {
      const formatted = value
        .replace(/\s?/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .slice(0, 19);
      setCardDetails((prev) => ({ ...prev, number: formatted }));
    } else if (name === "expiry") {
      const formatted = value
        .replace(/\//g, "")
        .replace(/(\d{2})/g, "$1/")
        .trim()
        .slice(0, 5);
      if (formatted.endsWith("/")) {
        setCardDetails((prev) => ({ ...prev, expiry: formatted.slice(0, -1) }));
      } else {
        setCardDetails((prev) => ({ ...prev, expiry: formatted }));
      }
    } else if (name === "cvc") {
      setCardDetails((prev) => ({ ...prev, cvc: value.replace(/\D/g, "").slice(0, 3) }));
    } else {
      setCardDetails((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpgradeSubmit = async (e) => {
    e.preventDefault();
    
    if (!cardDetails.number || cardDetails.number.length < 19) {
      toast.error("Please enter a valid 16-digit card number.");
      return;
    }
    if (!cardDetails.expiry || cardDetails.expiry.length < 5) {
      toast.error("Please enter a valid card expiration date (MM/YY).");
      return;
    }
    if (!cardDetails.cvc || cardDetails.cvc.length < 3) {
      toast.error("Please enter a valid 3-digit CVC code.");
      return;
    }
    if (!cardDetails.name) {
      toast.error("Please enter the cardholder's name.");
      return;
    }

    setLoading(true);
    toast.info("🏦 Simulating transaction securely...");

    try {
      const response = await fetchFromApiServer("POST", "api/v1/user/profile/upgrade");
      
      if (response?.data?.success) {
        dispatch(setProStatus({ isPro: true, aiCredits: 999 }));
        toast.success("👑 Successfully upgraded to NextHire Pro!");
        setOpen(false);
        setStep(1); // Reset step back to 1
      } else {
        toast.error("Upgrade transaction failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Billing gateway returned an error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeAndReset = () => {
    if (!loading) {
      setOpen(false);
      setTimeout(() => setStep(1), 300); // smooth reset
    }
  };

  return ReactDOM.createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.8)",
          backdropFilter: "blur(6px)",
        }}
        onClick={closeAndReset}
      />

      {/* Main Panel Content */}
      <div
        className="relative w-full max-w-[460px] mx-4 bg-[#080C1E]/95 border border-white/5 rounded-3xl p-8 shadow-[0_0_80px_rgba(0,200,255,0.08)] text-center overflow-hidden flex flex-col"
        style={{ position: "relative", zIndex: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative mb-6">
          <h2 className="text-3xl font-black text-white tracking-tight italic text-center mb-1 flex items-center justify-center gap-2 select-none">
            <Sparkles className="w-7 h-7 text-[#00C8FF] animate-pulse" />
            Upgrade to <span className="text-[#00C8FF] drop-shadow-[0_0_15px_rgba(0,200,255,0.3)]">NextHire Pro</span>
          </h2>
          <p className="text-center text-muted-foreground font-semibold text-[10px] uppercase tracking-widest mt-1">
            {step === 1 ? "Choose your automation capacity" : "Enter secure payment coordinates"}
          </p>
          <Button
            variant='ghost'
            className='absolute -top-3 -right-3 text-muted-foreground hover:text-red-400 hover:bg-white/5 rounded-full transition-all duration-300 w-8 h-8 p-0 flex items-center justify-center'
            onClick={closeAndReset}
            disabled={loading}
          >
            <X className='w-4 h-4' />
          </Button>
        </div>

        {/* STEP 1: Plan Selection */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="relative bg-[#00C8FF]/5 border border-[#00C8FF]/20 rounded-2xl p-6 shadow-[0_0_30px_rgba(0,200,255,0.03)] overflow-hidden text-start">
              <div className="absolute top-0 right-0 bg-[#00C8FF] text-[#050810] text-[8px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                Full AI Suite
              </div>
              <span className="text-[10px] font-black uppercase text-[#00C8FF] tracking-widest block mb-1">Elite Plan</span>
              <h3 className="text-xl font-black text-white mb-4 flex items-center gap-1.5">
                Pro Access <Zap className="w-4 h-4 text-[#00C8FF] fill-[#00C8FF]" />
              </h3>
              
              <ul className="space-y-3.5 text-sm font-semibold text-foreground border-b border-white/5 pb-4 mb-4">
                <li className="flex items-center gap-2.5">
                  <div className="w-5 h-5 bg-[#00C8FF]/10 rounded-md flex items-center justify-center shrink-0"><Check className="w-4 h-4 text-[#00C8FF]" /></div>
                  Unlimited AI Resume Scanning
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-5 h-5 bg-[#00C8FF]/10 rounded-md flex items-center justify-center shrink-0"><Check className="w-4 h-4 text-[#00C8FF]" /></div>
                  AI Tailored Interview Questions
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-5 h-5 bg-[#00C8FF]/10 rounded-md flex items-center justify-center shrink-0"><Check className="w-4 h-4 text-[#00C8FF]" /></div>
                  AI Personalized Outreach Drafting
                </li>
              </ul>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">$29</span>
                <span className="text-xs text-muted-foreground font-semibold">/ month (Cancel anytime)</span>
              </div>
            </div>

            <Button
              onClick={() => setStep(2)}
              className="w-full h-14 rounded-xl bg-[#00C8FF] hover:bg-[#00E5FF] text-[#050810] font-black text-md shadow-[0_0_30px_rgba(0,200,255,0.25)] hover:scale-[1.01] transition-all duration-300 border-none uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        )}

        {/* STEP 2: Secure payment */}
        {step === 2 && (
          <form onSubmit={handleUpgradeSubmit} className="space-y-5 text-start animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={loading}
                className="flex items-center gap-1.5 text-xs text-[#00C8FF] hover:text-[#00E5FF] font-black uppercase tracking-wider bg-transparent border-none outline-none cursor-pointer disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Plan
              </button>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#00C8FF]" />
                <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">Secure billing</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="font-extrabold uppercase text-[9px] text-white tracking-widest ml-1">Cardholder Name</Label>
              <Input
                name="name"
                value={cardDetails.name}
                onChange={handleInputChange}
                placeholder="e.g., Alexander Wright"
                className="h-12 rounded-xl bg-[#050810]/80 border-white/5 text-white font-bold placeholder:text-muted-foreground/30 focus:border-[#00C8FF]/30 outline-none"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="font-extrabold uppercase text-[9px] text-white tracking-widest ml-1">Card Number</Label>
              <div className="relative">
                <Input
                  name="number"
                  value={cardDetails.number}
                  onChange={handleInputChange}
                  placeholder="4242 4242 4242 4242"
                  className="h-12 pl-11 rounded-xl bg-[#050810]/80 border-white/5 text-white font-bold placeholder:text-muted-foreground/30 focus:border-[#00C8FF]/30 outline-none"
                  required
                  disabled={loading}
                />
                <CreditCard className="w-5 h-5 text-muted-foreground/60 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-extrabold uppercase text-[9px] text-white tracking-widest ml-1">Expiry Date</Label>
                <Input
                  name="expiry"
                  value={cardDetails.expiry}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  className="h-12 rounded-xl bg-[#050810]/80 border-white/5 text-white font-bold placeholder:text-muted-foreground/30 focus:border-[#00C8FF]/30 outline-none"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="font-extrabold uppercase text-[9px] text-white tracking-widest ml-1">CVC Code</Label>
                <Input
                  name="cvc"
                  value={cardDetails.cvc}
                  onChange={handleInputChange}
                  placeholder="123"
                  className="h-12 rounded-xl bg-[#050810]/80 border-white/5 text-white font-bold placeholder:text-muted-foreground/30 focus:border-[#00C8FF]/30 outline-none"
                  type="password"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 mt-3 rounded-xl bg-[#00C8FF] hover:bg-[#00E5FF] text-[#050810] font-black text-md shadow-[0_0_30px_rgba(0,200,255,0.25)] hover:scale-[1.01] transition-all duration-300 border-none uppercase tracking-wider flex items-center justify-center gap-2"
            >
              {loading ? "Processing secure transaction..." : "Activate Pro Access"}
            </Button>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
};

export default SaaSUpgradeModal;
