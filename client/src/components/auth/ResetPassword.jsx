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
    <div className='flex flex-col items-center justify-center min-h-screen px-4 bg-background relative overflow-hidden'>
      {/* Background decorations */}
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        <div className='absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl'></div>
        <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary/5 rounded-full blur-3xl'></div>
      </div>

      <RegisterNavbar />
      <ReactHelmet
        title='Reset Password - Next_Hire'
        description='Reset your password for NextHire'
        canonicalUrl='/reset-password'
      />
      <div className='bg-card backdrop-blur-sm border border-border shadow-custom hover:shadow-neon transition-shadow duration-300 rounded-2xl mt-[50px] md:mt-[100px] p-8 md:p-10 w-full md:w-1/3 relative z-10'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl md:text-4xl font-extrabold'>
            <span className='text-foreground'>{token ? 'Set New ' : 'Reset '}</span>
            <span className='bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>Password</span>
          </h1>
          <p className='text-muted-foreground mt-2 text-sm'>
            {token ? 'Enter your new password below.' : 'Enter your email to receive a reset link.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-5'>
          {/* For sending reset link */}
          {!token && (
            <div>
              <Label className='text-base font-bold text-foreground mb-2 block'>Email</Label>
              <Input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='example@gmail.com'
                className='mt-1 w-full rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20'
                required
              />
            </div>
          )}

          {/* For resetting password with token */}
          {token && (
            <>
              <div>
                <Label className='text-base font-bold text-foreground mb-2 block'>New Password</Label>
                <Input
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Enter your new password'
                  className='mt-1 w-full rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20'
                  required
                />
              </div>
              <div>
                <Label className='text-base font-bold text-foreground mb-2 block'>Confirm Password</Label>
                <Input
                  type='password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder='Confirm your new password'
                  className='mt-1 w-full rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20'
                  required
                />
              </div>
            </>
          )}

          <div className='mt-6'>
            <Button
              type='submit'
              className='w-full bg-primary hover:bg-primary/80 text-primary-foreground font-bold py-5 rounded-xl shadow-neon hover:scale-105 transition-all duration-300'
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
                <Link to='/login' className='text-primary hover:text-secondary font-semibold transition-colors'>
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
