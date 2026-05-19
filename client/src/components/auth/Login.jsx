import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Navbar from "../layout/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ReactHelmet from "@/components/common/ReactHelmet";
import Loader from "../common/Loader";
import { loginUser } from "@/redux/slices/user.slice";

// Email validation regex pattern
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Basic form validation
  const validateForm = () => {
    if (!email || !password || !role) {
      toast.error("Please fill in all fields.");
      return false;
    }
    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = { email, password, role };

    setLoading(true);

    dispatch(loginUser(formData))
      .then((res) => {
        setLoading(false);
        const status = res?.payload?.status;
        if (status === 200) {
          toast.success("Login successful!");
          navigate("/");
        } else {
          setErrorMessage(res?.payload?.message || "Something went wrong");
          toast.error(res?.payload?.message || "Something went wrong");
        }
      })
      .catch((error) => {
        setLoading(false);
        const errorMessage = error?.response?.data?.message || error?.message || "Login failed! Please try again.";
        setErrorMessage(errorMessage);
        
        // Check if it's an email verification error
        if (error?.response?.status === 403 || errorMessage.includes("verify your email")) {
          toast.error(errorMessage, {
            autoClose: 5000,
          });
        } else {
          toast.error(errorMessage);
        }
      });
  };

  return (
    <div className='min-h-screen bg-[#050810] text-[#E6EDF3] relative overflow-hidden'>
      {/* Fine-lined cyber laser grid overlay */}
      <div className="grid-overlay"></div>
      
      {/* Enhanced Background decorations with rotating orbits */}
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        <div className='absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#00C8FF]/5 rounded-full blur-[130px] anim-spin-slow'></div>
        <div className='absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-[#8040FF]/5 rounded-full blur-[140px] anim-spin-rev'></div>
      </div>

      <Navbar />
      <ReactHelmet
        title='Login - Next_Hire'
        description='Login to access job opportunities and recruitments'
        canonicalUrl='/login'
      />

      <div className='container mx-auto px-4 py-12 md:py-20 relative z-10'>
        <div className='max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Left Side - Benefits Card */}
          <div className='bg-[#080C1E]/80 backdrop-blur-xl rounded-2xl border border-white/5 shadow-[0_0_50px_rgba(0,100,220,0.03)] hover:shadow-[0_0_35px_rgba(0,200,255,0.08)] transition-all duration-500 p-8 lg:sticky lg:top-24 h-fit'>
            <div className='text-center mb-6'>
              <h2 className='text-3xl md:text-4xl font-extrabold mb-2 tracking-wide'>
                <span className='text-white'>
                  New to{" "}
                </span>
                <span className='text-[#00C8FF] drop-shadow-[0_0_15px_rgba(0,200,255,0.4)]'>
                  NextHire
                </span>
                <span className='text-4xl text-white'>?</span>
              </h2>
              <p className='text-muted-foreground mt-2'>Join thousands of job seekers and recruiters</p>
            </div>

            <ul className='space-y-4 mb-8'>
              <li className='flex items-start gap-3 p-3 rounded-xl bg-[#00C8FF]/5 border border-white/5'>
                <span className='text-[#00C8FF] text-xl font-bold mt-0.5'>✓</span>
                <span className='text-white font-medium'>One click apply using NextHire profile</span>
              </li>
              <li className='flex items-start gap-3 p-3 rounded-xl bg-[#00C8FF]/5 border border-white/5'>
                <span className='text-[#00C8FF] text-xl font-bold mt-0.5'>✓</span>
                <span className='text-white font-medium'>Get relevant job recommendations</span>
              </li>
              <li className='flex items-start gap-3 p-3 rounded-xl bg-[#00C8FF]/5 border border-white/5'>
                <span className='text-[#00C8FF] text-xl font-bold mt-0.5'>✓</span>
                <span className='text-white font-medium'>Showcase profile to top companies</span>
              </li>
              <li className='flex items-start gap-3 p-3 rounded-xl bg-[#00C8FF]/5 border border-white/5'>
                <span className='text-[#00C8FF] text-xl font-bold mt-0.5'>✓</span>
                <span className='text-white font-medium'>Track application status in real-time</span>
              </li>
            </ul>

            <Link to='/signup'>
              <Button className='w-full bg-[#00C8FF] hover:bg-[#00E5FF] text-[#050810] font-bold py-6 rounded-xl shadow-[0_0_20px_rgba(0,200,255,0.3)] hover:shadow-[0_0_30px_rgba(0,200,255,0.5)] hover:scale-[1.02] transition-all duration-300 text-lg border-none'>
                Register for Free
              </Button>
            </Link>

            <div className='mt-6 w-full h-32 relative rounded-xl overflow-hidden opacity-60'>
              <img
                src='https://static.naukimg.com/s/5/105/i/register.png'
                className='h-full w-full object-contain'
                alt='Register'
              />
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className='bg-[#080C1E]/80 backdrop-blur-xl rounded-2xl border border-white/5 shadow-[0_0_50px_rgba(0,100,220,0.03)] hover:shadow-[0_0_35px_rgba(0,200,255,0.08)] transition-all duration-500 p-8 md:p-10'>
            <div className='text-center mb-8'>
              <h1 className='text-4xl md:text-5xl font-extrabold mb-3 tracking-wide'>
                <span className='text-white'>
                  Welcome{" "}
                </span>
                <span className='text-[#00C8FF] drop-shadow-[0_0_15px_rgba(0,200,255,0.4)]'>
                  Back
                </span>
              </h1>
              <p className='text-muted-foreground text-lg'>Sign in to continue your job search journey</p>
            </div>

            <form onSubmit={submitHandler} className='space-y-6'>
              <div>
                <Label className='text-base font-bold text-white mb-2 block tracking-wide'>Email</Label>
                <Input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Enter your email'
                  className='w-full rounded-xl border border-white/5 p-4 focus:border-[#00C8FF] focus:ring-2 focus:ring-[#00C8FF]/20 bg-[#050810] text-[#E6EDF3] placeholder:text-muted-foreground text-base'
                />
              </div>

              <div>
                <Label className='text-base font-bold text-white mb-2 block tracking-wide'>Password</Label>
                <Input
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Enter your password'
                  className='w-full rounded-xl border border-white/5 p-4 focus:border-[#00C8FF] focus:ring-2 focus:ring-[#00C8FF]/20 bg-[#050810] text-[#E6EDF3] placeholder:text-muted-foreground text-base'
                />
              </div>

              <div className='bg-white/5 rounded-xl p-4 border border-white/5'>
                <Label className='text-base font-bold text-white mb-3 block tracking-wide'>I am a</Label>
                <div className='flex gap-6'>
                  <label className='flex items-center gap-3 cursor-pointer group'>
                    <input
                      type='radio'
                      name='role'
                      value='student'
                      checked={role === "student"}
                      onChange={(e) => setRole(e.target.value)}
                      className='w-5 h-5 accent-[#00C8FF] border-white/5 focus:ring-[#00C8FF] focus:ring-2 cursor-pointer bg-[#050810]'
                    />
                    <span className='text-white font-semibold group-hover:text-[#00C8FF] transition-colors'>Student</span>
                  </label>
                  <label className='flex items-center gap-3 cursor-pointer group'>
                    <input
                      type='radio'
                      name='role'
                      value='recruiter'
                      checked={role === "recruiter"}
                      onChange={(e) => setRole(e.target.value)}
                      className='w-5 h-5 accent-[#00C8FF] border-white/5 focus:ring-[#00C8FF] focus:ring-2 cursor-pointer bg-[#050810]'
                    />
                    <span className='text-white font-semibold group-hover:text-[#00C8FF] transition-colors'>Recruiter</span>
                  </label>
                </div>
              </div>

              {loading && <Loader />}

              <Button 
                type='submit' 
                className='w-full bg-[#00C8FF] hover:bg-[#00E5FF] text-[#050810] font-bold py-6 rounded-xl shadow-[0_0_20px_rgba(0,200,255,0.3)] hover:shadow-[0_0_30px_rgba(0,200,255,0.5)] hover:scale-[1.02] transition-all duration-300 text-lg border-none'
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>

              <div className='text-center space-y-3'>
                <p className='text-muted-foreground'>
                  Don't have an account?{" "}
                  <Link to='/signup' className='text-[#00C8FF] hover:text-[#00E5FF] font-bold transition-colors'>
                    Sign Up
                  </Link>
                </p>

                <p className='text-sm text-muted-foreground'>
                  Forgot your password?{" "}
                  <Link to='/forget-password' className='text-[#00C8FF] hover:text-[#00E5FF] font-semibold transition-colors'>
                    Reset here
                  </Link>
                </p>

                {errorMessage && errorMessage.includes("verify your email") && (
                  <div className='mt-4 p-4 bg-amber-500/10 backdrop-blur-sm border border-amber-500/30 rounded-xl'>
                    <p className='text-sm text-amber-400 font-bold mb-2'>
                      📧 Email Verification Required
                    </p>
                    <p className='text-xs text-amber-400/80'>
                      Please check your email inbox and click the verification link to activate your account. 
                      If you didn't receive the email, check your spam folder or try logging in again.
                    </p>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
