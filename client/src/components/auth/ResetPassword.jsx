import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "react-toastify";
import RegisterNavbar from "../layout/RegiserNavbar";
import ReactHelmet from "../common/ReactHelmet";
import {
  forgetPassPassword,
  resetPassPassword,
} from "@/redux/slices/user.slice";
import { useDispatch } from "react-redux";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!token) {
      if (!email) {
        toast.error("Email is required!");
        setLoading(false);
        return;
      }

      try {
        const response = await dispatch(forgetPassPassword({ email }));
        if (response?.payload?.status == 200) {
          toast.success(response?.payload?.message);
          setEmail("");
        }
      } catch (error) {
        toast.error(error?.data?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    } else {
      if (!password || !confirmPassword) {
        toast.error("Both password fields are required!");
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Passwords do not match!");
        setLoading(false);
        return;
      }

      try {
        const response = await dispatch(resetPassPassword({ token, password })); // Dispatch reset password API call
        if (response?.payload?.message) {
          toast.success(response.payload.message); // Show success message from response
          navigate("/login"); // Redirect to login after success
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred"); // Handle errors
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-4 bg-[#050810] text-[#E6EDF3] relative overflow-hidden'>
      {/* Fine-lined cyber laser grid overlay */}
      <div className="grid-overlay"></div>
      
      {/* Enhanced Background decorations with rotating orbits */}
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        <div className='absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#00C8FF]/5 rounded-full blur-[130px] anim-spin-slow'></div>
        <div className='absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-[#8040FF]/5 rounded-full blur-[140px] anim-spin-rev'></div>
      </div>

      <RegisterNavbar />
      <ReactHelmet
        title='Reset Password - Next_Hire'
        description='Reset your password for NextHire'
        canonicalUrl='/reset-password'
      />
      <div className='bg-[#080C1E]/80 backdrop-blur-xl border border-white/5 shadow-[0_0_50px_rgba(0,100,220,0.03)] hover:shadow-[0_0_35px_rgba(0,200,255,0.08)] transition-all duration-500 rounded-2xl mt-[50px] md:mt-[100px] p-8 md:p-10 w-full md:w-1/3 relative z-10'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl md:text-4xl font-extrabold tracking-wide'>
            <span className='text-white'>{token ? 'Set New ' : 'Reset '}</span>
            <span className='text-[#00C8FF] drop-shadow-[0_0_15px_rgba(0,200,255,0.4)]'>Password</span>
          </h1>
          <p className='text-muted-foreground mt-2 text-sm'>
            {token ? 'Enter your new password below.' : 'Enter your email to receive a reset link.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-5'>
          {/* For sending reset link */}
          {!token && (
            <div>
              <Label className='text-base font-bold text-white mb-2 block tracking-wide'>Email</Label>
              <Input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='example@gmail.com'
                className='mt-1 w-full rounded-xl border border-white/5 bg-[#050810] text-[#E6EDF3] placeholder:text-muted-foreground focus:border-[#00C8FF] focus:ring-2 focus:ring-[#00C8FF]/20'
                required
              />
            </div>
          )}

          {/* For resetting password with token */}
          {token && (
            <>
              <div>
                <Label className='text-base font-bold text-white mb-2 block tracking-wide'>New Password</Label>
                <Input
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Enter your new password'
                  className='mt-1 w-full rounded-xl border border-white/5 bg-[#050810] text-[#E6EDF3] placeholder:text-muted-foreground focus:border-[#00C8FF] focus:ring-2 focus:ring-[#00C8FF]/20'
                  required
                />
              </div>
              <div>
                <Label className='text-base font-bold text-white mb-2 block tracking-wide'>Confirm Password</Label>
                <Input
                  type='password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder='Confirm your new password'
                  className='mt-1 w-full rounded-xl border border-white/5 bg-[#050810] text-[#E6EDF3] placeholder:text-muted-foreground focus:border-[#00C8FF] focus:ring-2 focus:ring-[#00C8FF]/20'
                  required
                />
              </div>
            </>
          )}

          <div className='mt-6'>
            <Button
              type='submit'
              className='w-full bg-[#00C8FF] hover:bg-[#00E5FF] text-[#050810] font-bold py-5 rounded-xl shadow-[0_0_20px_rgba(0,200,255,0.3)] hover:shadow-[0_0_30px_rgba(0,200,255,0.5)] hover:scale-[1.02] transition-all duration-300 border-none'
              disabled={loading}
            >
              {loading
                ? 'Please wait...'
                : token
                ? 'Reset Password'
                : 'Send Reset Link'}
            </Button>
          </div>

          {/* Redirect to login page if token is not provided */}
          {!token && (
            <div className='text-center mt-4'>
              <span className='text-muted-foreground text-sm'>
                Remembered your password?{" "}
                <Link to='/login' className='text-[#00C8FF] hover:text-[#00E5FF] font-semibold transition-colors'>
                  Login
                </Link>
              </span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
