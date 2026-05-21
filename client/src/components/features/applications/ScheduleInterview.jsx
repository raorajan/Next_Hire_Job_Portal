import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { scheduleInterviewApi } from "@/redux/actions/application.action";
import { Calendar, Clock, Video, CheckCircle2, Loader2, ArrowLeft, Sparkles } from "lucide-react";

const ScheduleInterview = () => {
  const { applicationId } = useParams();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [schedule, setSchedule] = useState(null);
  const [error, setError] = useState("");

  // Generate time slots from 9 AM to 6 PM in 30-min intervals
  const timeSlots = [];
  for (let h = 9; h <= 18; h++) {
    for (let m = 0; m < 60; m += 30) {
      if (h === 18 && m > 0) break;
      const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
      const ampm = h >= 12 ? "PM" : "AM";
      const label = `${hour12}:${m.toString().padStart(2, "0")} ${ampm}`;
      timeSlots.push(label);
    }
  }

  // Minimum date = tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !time) {
      setError("Please select both a date and time.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const response = await scheduleInterviewApi(applicationId, date, time);
      if (response?.data?.success) {
        setSuccess(true);
        setSchedule(response.data.schedule);
      } else {
        setError(response?.data?.message || "Failed to schedule interview.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#00C8FF]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#8040FF]/5 rounded-full blur-[150px]" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,229,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.02) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#00C8FF]/10 border border-[#00C8FF]/20 rounded-full px-4 py-1.5 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#00C8FF]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#00C8FF]">NextHire Scheduling</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Schedule Your Interview
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Select your preferred date and time below. A meeting link will be sent to your email instantly.
          </p>
        </div>

        {!success ? (
          /* Scheduling Form */
          <form onSubmit={handleSubmit}>
            <div className="bg-[#080C1E]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-[0_0_80px_rgba(0,100,220,0.08)]">
              {/* Date Picker */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
                  <Calendar className="w-4 h-4 text-[#00C8FF]" />
                  Select Date
                </label>
                <input
                  type="date"
                  min={minDate}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#0A0C10] border-2 border-white/10 rounded-xl px-4 py-3.5 text-white text-sm font-bold focus:outline-none focus:border-[#00C8FF]/50 transition-colors cursor-pointer hover:border-[#00C8FF]/30"
                  style={{ colorScheme: "dark" }}
                />
              </div>

              {/* Time Picker */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
                  <Clock className="w-4 h-4 text-[#8040FF]" />
                  Select Time Slot
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTime(slot)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all duration-300 border ${
                        time === slot
                          ? "bg-[#00C8FF]/15 border-[#00C8FF]/50 text-[#00C8FF] shadow-[0_0_15px_rgba(0,200,255,0.15)]"
                          : "bg-[#0A0C10] border-white/5 text-gray-400 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-xs font-bold">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !date || !time}
                className="w-full bg-gradient-to-r from-[#00C8FF] to-[#8040FF] text-white font-black uppercase tracking-wider py-4 rounded-xl text-sm transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,200,255,0.3)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  <>
                    <Video className="w-4 h-4" />
                    Confirm & Get Meeting Link
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Success State */
          <div className="bg-[#080C1E]/80 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-8 shadow-[0_0_80px_rgba(16,185,129,0.08)] text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border-2 border-emerald-500/30">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Interview Scheduled! 🎉</h2>
            <p className="text-gray-400 text-sm mb-8">
              Confirmation emails have been sent to you and the recruiter.
            </p>

            <div className="space-y-4 text-left">
              <div className="bg-[#0A0C10] rounded-xl p-4 border border-white/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">📅 Date</p>
                <p className="text-white font-bold">
                  {new Date(schedule.date).toLocaleDateString("en-US", {
                    weekday: "long", year: "numeric", month: "long", day: "numeric",
                  })}
                </p>
              </div>
              <div className="bg-[#0A0C10] rounded-xl p-4 border border-white/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">🕐 Time</p>
                <p className="text-white font-bold">{schedule.time}</p>
              </div>
              <div className="bg-[#0A0C10] rounded-xl p-4 border border-white/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">🔗 Meeting Link</p>
                <a
                  href={schedule.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00C8FF] font-bold text-sm hover:underline break-all"
                >
                  {schedule.meetLink}
                </a>
              </div>
            </div>

            <a
              href={schedule.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 bg-gradient-to-r from-[#00C8FF] to-[#8040FF] text-white font-black uppercase tracking-wider py-3.5 px-8 rounded-xl text-sm transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,200,255,0.3)]"
            >
              <Video className="w-4 h-4" />
              Open Meeting Room
            </a>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs mt-6">
          Powered by <span className="text-[#00C8FF] font-bold">NextHire</span> — AI-Driven Hiring Platform
        </p>
      </div>
    </div>
  );
};

export default ScheduleInterview;
