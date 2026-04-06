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
    <div className='min-h-screen bg-background relative overflow-hidden'>
      {/* Background decorations */}
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        <div className='absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl'></div>
        <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/3 rounded-full blur-3xl'></div>
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
          <div className='bg-card backdrop-blur-sm rounded-2xl border border-border shadow-custom p-8 lg:sticky lg:top-24 h-fit'>
            <div className='text-center mb-6'>
              <div className='w-32 h-32 mx-auto mb-4 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-lg'>
                <img
                  src={JobSearch}
                  alt='Job Search'
                  className='w-full h-full object-cover'
                />
              </div>
              <h4 className='text-2xl md:text-3xl font-extrabold mb-2'>
                <span className='text-foreground'>
                  Start Your{" "}
                </span>
                <span className='bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
                  Journey
                </span>
              </h4>
              <p className='text-muted-foreground'>Join NextHire and unlock amazing opportunities</p>
            </div>

            <ul className='space-y-4 mb-6'>
              <li className='flex items-start gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10'>
                <span className='text-primary text-xl font-bold mt-0.5'>✓</span>
                <span className='text-foreground font-medium'>Build your profile and let recruiters find you</span>
              </li>
              <li className='flex items-start gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10'>
                <span className='text-primary text-xl font-bold mt-0.5'>✓</span>
                <span className='text-foreground font-medium'>Get job postings delivered right to your email</span>
              </li>
              <li className='flex items-start gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10'>
                <span className='text-primary text-xl font-bold mt-0.5'>✓</span>
                <span className='text-foreground font-medium'>Find a job and grow your career</span>
              </li>
            </ul>
          </div>

          {/* Right Side - Signup Form */}
          <div className='bg-card backdrop-blur-sm rounded-2xl border border-border shadow-custom p-8 md:p-10'>
            <div className='text-center mb-8'>
              <h1 className='text-4xl md:text-5xl font-extrabold mb-3'>
                <span className='text-foreground'>
                  Create{" "}
                </span>
                <span className='bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
                  Account
                </span>
              </h1>
              <p className='text-muted-foreground text-lg'>Sign up to get started with NextHire</p>
            </div>

            <form onSubmit={submitHandler} className='space-y-5'>
              <div>
                <Label className='text-base font-bold text-foreground mb-2 block'>Full Name</Label>
                <Input
                  type='text'
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  placeholder='John Doe'
                  className='w-full rounded-xl border border-border p-4 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-background text-foreground placeholder:text-muted-foreground text-base'
                  required
                />
              </div>

              <div>
                <Label className='text-base font-bold text-foreground mb-2 block'>Email</Label>
                <Input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='example@gmail.com'
                  className='w-full rounded-xl border border-border p-4 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-background text-foreground placeholder:text-muted-foreground text-base'
                  required
                />
              </div>

              <div>
                <Label className='text-base font-bold text-foreground mb-2 block'>Password</Label>
                <Input
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Enter your password'
                  className='w-full rounded-xl border border-border p-4 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-background text-foreground placeholder:text-muted-foreground text-base'
                  required
                />
              </div>

              <div className='bg-muted/30 rounded-xl p-4 border border-border'>
                <Label className='text-base font-bold text-foreground mb-3 block'>I am a</Label>
                <div className='flex gap-6'>
                  <label className='flex items-center gap-3 cursor-pointer group'>
                    <input
                      type='radio'
                      name='role'
                      value='student'
                      onChange={(e) => setRole(e.target.value)}
                      className='w-5 h-5 accent-primary border-border focus:ring-primary focus:ring-2 cursor-pointer'
                      required
                    />
                    <span className='text-foreground font-semibold group-hover:text-primary transition-colors'>Student</span>
                  </label>
                  <label className='flex items-center gap-3 cursor-pointer group'>
                    <input
                      type='radio'
                      name='role'
                      value='recruiter'
                      onChange={(e) => setRole(e.target.value)}
                      className='w-5 h-5 accent-primary border-border focus:ring-primary focus:ring-2 cursor-pointer'
                      required
                    />
                    <span className='text-foreground font-semibold group-hover:text-primary transition-colors'>Recruiter</span>
                  </label>
                </div>
              </div>

              <div>
                <Label className='text-base font-bold text-foreground mb-2 block'>Profile Picture</Label>
                <div className='flex items-center gap-4'>
                  <label className='cursor-pointer'>
                    <Input
                      accept='image/*'
                      type='file'
                      onChange={changeFileHandler}
                      className='hidden'
                    />
                    <span className='px-6 py-3 bg-primary hover:bg-primary/80 text-primary-foreground font-semibold rounded-xl cursor-pointer shadow-neon hover:scale-105 transition-all duration-300 inline-block'>
                      Choose File
                    </span>
                  </label>
                  <div className='w-16 h-16 border-2 border-dashed border-border rounded-full flex items-center justify-center overflow-hidden bg-muted/30 hover:border-primary transition-colors'>
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
                className='w-full bg-primary hover:bg-primary/80 text-primary-foreground font-bold py-6 rounded-xl shadow-neon hover:scale-105 transition-all duration-300 text-lg'
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </Button>

              <div className='text-center'>
                <p className='text-muted-foreground'>
                  Already have an account?{" "}
                  <Link to='/login' className='text-primary hover:text-secondary font-bold transition-colors'>
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
