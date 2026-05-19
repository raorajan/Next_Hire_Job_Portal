import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { verifyEmail as verifyEmailAction } from "@/redux/slices/user.slice";
import { toast } from "react-toastify";
import { FaCheckCircle } from "react-icons/fa";

const EmailVerification = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [called, setCalled] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Avoid making the API call if it has already been made
    if (called) return;

    handleEmailVerification();
    setCalled(true);
  }, [dispatch, location, called]);

  const handleEmailVerification = () => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    if (!token) {
      toast.error("Invalid or missing token.");
      return;
    }

    const payload = {
      token,
      pathname: location.pathname,
    };

    dispatch(verifyEmailAction(payload))
      .then((res) => {
        if (res?.payload?.status === 200) {
          setIsVerified(true);
          toast.success("Your email has been verified successfully!");
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          toast.error(res?.payload?.message || "Verification failed.");
        }
      })
      .catch(() => {
        toast.error("Email verification failed. Please try again.");
      });
  };

  return (
    <div className='min-h-screen bg-[#050810] text-[#E6EDF3] flex items-center justify-center px-4 relative overflow-hidden'>
      {/* Fine-lined cyber laser grid overlay */}
      <div className="grid-overlay"></div>

      {/* Enhanced Background decorations with rotating orbits */}
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        <div className='absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#00C8FF]/5 rounded-full blur-[130px] anim-spin-slow'></div>
        <div className='absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-[#8040FF]/5 rounded-full blur-[140px] anim-spin-rev'></div>
      </div>

      <div className='bg-[#080C1E]/80 backdrop-blur-xl border border-white/5 shadow-[0_0_50px_rgba(0,200,255,0.1)] rounded-2xl p-10 max-w-sm w-full text-center relative z-10'>
        {isVerified ? (
          <div className='flex flex-col items-center justify-center gap-4'>
            <div className='w-20 h-20 rounded-full bg-green-400/10 border border-green-400/30 flex items-center justify-center shadow-[0_0_20px_rgba(74,222,128,0.2)]'>
              <FaCheckCircle className='text-green-400' size={40} />
            </div>
            <h2 className='text-2xl font-extrabold text-white mt-2 tracking-wide'>
              Email Verified!
            </h2>
            <p className='text-muted-foreground'>Redirecting you to login...</p>
            <div className='mt-2 w-full h-1 bg-white/10 rounded-full overflow-hidden'>
              <div className='h-full bg-[#00C8FF] shadow-[0_0_15px_rgba(0,200,255,0.5)] rounded-full' style={{width: '100%', animation: 'shrink 3s linear forwards'}}></div>
            </div>
          </div>
        ) : (
          <div className='flex flex-col items-center gap-4'>
            <div className='w-20 h-20 rounded-full bg-[#00C8FF]/10 border border-[#00C8FF]/30 flex items-center justify-center shadow-[0_0_20px_rgba(0,200,255,0.2)]'>
              <svg className='w-10 h-10 text-[#00C8FF] animate-spin' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'></path>
              </svg>
            </div>
            <h2 className='text-2xl font-extrabold text-white tracking-wide'>Verifying your email...</h2>
            <p className='text-muted-foreground text-sm'>Please wait while we confirm your address.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
