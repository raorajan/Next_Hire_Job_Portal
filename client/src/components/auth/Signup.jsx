import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCircleUser, FaGoogle } from "react-icons/fa6";
import ReactHelmet from "@/components/common/ReactHelmet";
import JobSearch from "@/assets/job_search.png";
import RegisterNavbar from "../layout/RegiserNavbar";
import Loader from "../common/Loader";
import { registerUser } from "@/redux/slices/user.slice";

const Signup = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle profile picture change
  const changeFileHandler = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setAvatar(file);
    } else {
      toast.error("Please select a valid image file.");
    }
  };

  // Form validation function
  const validateForm = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email pattern

    if (!fullname || !email || !password || !role) {
      toast.error("Please fill in all required fields.");
      return false;
    }

    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return false;
    }

    return true;
  };

  // Handle form submission
  const submitHandler = (e) => {
    e.preventDefault();

    if (!validateForm()) return; // Validate before submission

    const formData = new FormData();
    formData.append("fullname", fullname);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);
    if (avatar) {
      formData.append("avatar", avatar);
    }

    setLoading(true);

    dispatch(registerUser(formData))
      .then((res) => {
        setLoading(false);
        // Check for success response
        if (res?.payload?.status === 200 || res?.payload?.success === true) {
          // Show success message from backend or default message
          const successMessage = res?.payload?.message || "Signup successful! Please verify your email.";
          toast.success(successMessage, {
            autoClose: 5000,
          });
          
          // Show additional info about email verification
          setTimeout(() => {
            toast.info(
              "We've sent a verification link to your email. Please check your inbox and spam folder to verify your email to complete the registration.",
              {
                autoClose: 10000,
              }
            );
          }, 1000);

          // Clear form after successful registration
          setFullname("");
          setEmail("");
          setPassword("");
          setRole("");
          setAvatar(null);
        } else {
          // Handle error response
          const errorMessage = res?.payload?.message || "Registration failed. Please try again.";
          toast.error(errorMessage);
        }
      })
      .catch((err) => {
        setLoading(false);
        // Handle network errors or other exceptions
        const errorMessage = err?.payload?.message || 
                           err?.response?.data?.message || 
                           err?.message || 
                           "Signup failed! Please try again.";
        toast.error(errorMessage);
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

      <RegisterNavbar />
      <ReactHelmet
        title='Signup - Next_Hire'
        description='Signup to access job opportunities and recruitments'
        canonicalUrl='/signup'
      />

      <div className='container mx-auto px-4 py-12 md:py-20 relative z-10'>
        <div className='max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Left Side - Benefits Card */}
          <div className='bg-[#080C1E]/80 backdrop-blur-xl rounded-2xl border border-white/5 shadow-[0_0_50px_rgba(0,100,220,0.03)] hover:shadow-[0_0_35px_rgba(0,200,255,0.08)] transition-all duration-500 p-8 lg:sticky lg:top-24 h-fit'>
            <div className='text-center mb-6'>
              <div className='w-32 h-32 mx-auto mb-4 rounded-2xl overflow-hidden border-2 border-[#00C8FF]/20 shadow-lg'>
                <img
                  src={JobSearch}
                  alt='Job Search'
                  className='w-full h-full object-cover'
                />
              </div>
              <h4 className='text-2xl md:text-3xl font-extrabold mb-2 tracking-wide'>
                <span className='text-white'>
                  Start Your{" "}
                </span>
                <span className='text-[#00C8FF] drop-shadow-[0_0_15px_rgba(0,200,255,0.4)]'>
                  Journey
                </span>
              </h4>
              <p className='text-muted-foreground'>Join NextHire and unlock amazing opportunities</p>
            </div>

            <ul className='space-y-4 mb-6'>
              <li className='flex items-start gap-3 p-3 rounded-xl bg-[#00C8FF]/5 border border-white/5'>
                <span className='text-[#00C8FF] text-xl font-bold mt-0.5'>✓</span>
                <span className='text-white font-medium'>Build your profile and let recruiters find you</span>
              </li>
              <li className='flex items-start gap-3 p-3 rounded-xl bg-[#00C8FF]/5 border border-white/5'>
                <span className='text-[#00C8FF] text-xl font-bold mt-0.5'>✓</span>
                <span className='text-white font-medium'>Get job postings delivered right to your email</span>
              </li>
              <li className='flex items-start gap-3 p-3 rounded-xl bg-[#00C8FF]/5 border border-white/5'>
                <span className='text-[#00C8FF] text-xl font-bold mt-0.5'>✓</span>
                <span className='text-white font-medium'>Find a job and grow your career</span>
              </li>
            </ul>
          </div>

          {/* Right Side - Signup Form */}
          <div className='bg-[#080C1E]/80 backdrop-blur-xl rounded-2xl border border-white/5 shadow-[0_0_50px_rgba(0,100,220,0.03)] hover:shadow-[0_0_35px_rgba(0,200,255,0.08)] transition-all duration-500 p-8 md:p-10'>
            <div className='text-center mb-8'>
              <h1 className='text-4xl md:text-5xl font-extrabold mb-3 tracking-wide'>
                <span className='text-white'>
                  Create{" "}
                </span>
                <span className='text-[#00C8FF] drop-shadow-[0_0_15px_rgba(0,200,255,0.4)]'>
                  Account
                </span>
              </h1>
              <p className='text-muted-foreground text-lg'>Sign up to get started with NextHire</p>
            </div>

            <form onSubmit={submitHandler} className='space-y-5'>
              <div>
                <Label className='text-base font-bold text-white mb-2 block tracking-wide'>Full Name</Label>
                <Input
                  type='text'
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  placeholder='John Doe'
                  className='w-full rounded-xl border border-white/5 p-4 focus:border-[#00C8FF] focus:ring-2 focus:ring-[#00C8FF]/20 bg-[#050810] text-[#E6EDF3] placeholder:text-muted-foreground text-base'
                  required
                />
              </div>

              <div>
                <Label className='text-base font-bold text-white mb-2 block tracking-wide'>Email</Label>
                <Input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='example@gmail.com'
                  className='w-full rounded-xl border border-white/5 p-4 focus:border-[#00C8FF] focus:ring-2 focus:ring-[#00C8FF]/20 bg-[#050810] text-[#E6EDF3] placeholder:text-muted-foreground text-base'
                  required
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
                  required
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
                      onChange={(e) => setRole(e.target.value)}
                      className='w-5 h-5 accent-[#00C8FF] border-white/5 focus:ring-[#00C8FF] focus:ring-2 cursor-pointer bg-[#050810]'
                      required
                    />
                    <span className='text-white font-semibold group-hover:text-[#00C8FF] transition-colors'>Student</span>
                  </label>
                  <label className='flex items-center gap-3 cursor-pointer group'>
                    <input
                      type='radio'
                      name='role'
                      value='recruiter'
                      onChange={(e) => setRole(e.target.value)}
                      className='w-5 h-5 accent-[#00C8FF] border-white/5 focus:ring-[#00C8FF] focus:ring-2 cursor-pointer bg-[#050810]'
                      required
                    />
                    <span className='text-white font-semibold group-hover:text-[#00C8FF] transition-colors'>Recruiter</span>
                  </label>
                </div>
              </div>

              <div>
                <Label className='text-base font-bold text-white mb-2 block tracking-wide'>Profile Picture</Label>
                <div className='flex items-center gap-4'>
                  <label className='cursor-pointer'>
                    <Input
                      accept='image/*'
                      type='file'
                      onChange={changeFileHandler}
                      className='hidden'
                    />
                    <span className='px-6 py-3 bg-[#00C8FF] hover:bg-[#00E5FF] text-[#050810] font-semibold rounded-xl cursor-pointer shadow-[0_0_15px_rgba(0,200,255,0.3)] hover:scale-105 transition-all duration-300 inline-block'>
                      Choose File
                    </span>
                  </label>
                  <div className='w-16 h-16 border-2 border-dashed border-white/20 rounded-full flex items-center justify-center overflow-hidden bg-white/5 hover:border-[#00C8FF]/50 transition-colors'>
                    {avatar ? (
                      <img
                        src={URL.createObjectURL(avatar)}
                        alt='Uploaded Profile'
                        className='w-full h-full object-cover rounded-full'
                      />
                    ) : (
                      <FaCircleUser className='text-muted-foreground w-10 h-10' />
                    )}
                  </div>
                </div>
              </div>

              {loading && <Loader />}

              <Button 
                type='submit' 
                className='w-full bg-[#00C8FF] hover:bg-[#00E5FF] text-[#050810] font-bold py-6 rounded-xl shadow-[0_0_20px_rgba(0,200,255,0.3)] hover:shadow-[0_0_30px_rgba(0,200,255,0.5)] hover:scale-[1.02] transition-all duration-300 text-lg border-none'
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </Button>

              <div className='text-center'>
                <p className='text-muted-foreground'>
                  Already have an account?{" "}
                  <Link to='/login' className='text-[#00C8FF] hover:text-[#00E5FF] font-bold transition-colors'>
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
