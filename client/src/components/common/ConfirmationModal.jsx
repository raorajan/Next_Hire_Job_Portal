import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { Button } from "../ui/button";
import { X, Loader2, AlertTriangle } from "lucide-react";

const ConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  title = "Confirm Action",
  description = "Are you sure you want to perform this action?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
}) => {
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

  return ReactDOM.createPortal(
    <div
      style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      {/* Backdrop */}
      <div
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Modal panel */}
      <div
        className="relative w-full max-w-[440px] mx-4 bg-[#080C1E] border border-white/10 rounded-3xl p-6 shadow-[0_0_60px_rgba(239,68,68,0.15)]"
        style={{ position: "relative", zIndex: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Neon accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 -mr-12 -mt-12 rounded-full blur-xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <h2 className="text-lg font-black text-white tracking-tight leading-tight">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="ml-4 p-1.5 text-muted-foreground hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/5 mb-4" />

        {/* Description */}
        <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-6">
          {description}
        </p>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            className="rounded-xl border-white/10 hover:border-white/20 text-muted-foreground hover:text-white bg-transparent h-11 px-5 transition-all duration-300 font-bold"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            className="rounded-xl bg-red-600 hover:bg-red-500 text-white border-none h-11 px-6 shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] transition-all duration-300 font-bold flex items-center justify-center gap-2"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmationModal;
