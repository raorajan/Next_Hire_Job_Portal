import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { X } from "lucide-react";
import Loader from "../../common/Loader";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "@/redux/slices/user.slice";
import { toast } from "react-toastify";

const UpdateProfileDialog = ({ open, setOpen, user }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    bio: "",
    skills: "",
    file: null,
    avatarFile: null,
  });

  // useEffect to update state when the user prop changes
  useEffect(() => {
    if (user) {
      setInput({
        fullname: user.fullname || "",
        email: user.email || "",
        bio: user.profile?.bio || "",
        skills: user.profile?.skills ? user.profile.skills.join(", ") : "",
        file: null,
        avatarFile: null,
      });
    }
  }, [user]); // Only runs when user prop changes

  // Handle form field change events
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  // Handle file input change
  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  // Handle avatar input change
  const avatarChangeHandler = (e) => {
    const avatarFile = e.target.files?.[0];
    setInput({ ...input, avatarFile });
  };

  // Handle form submission to update profile
  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simple validation
    if (!input.fullname || !input.email) {
      toast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("bio", input.bio);

    formData.append("skills", input.skills || "");

    if (input.file) {
      formData.append("resume", input.file);
    }
    
    if (input.avatarFile) {
      formData.append("avatar", input.avatarFile);
    }

    dispatch(updateUserProfile(formData))
      .unwrap()
      .then((res) => {
        if (res?.status === 200 || res?.success) {
          toast.success("Profile updated successfully!");
          setOpen(false);
        }
      })
      .catch((error) => {
        toast.error(error?.message || error || "Failed to update profile. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };


  return (
    <Dialog open={open}>
      {loading && <Loader />}
      <DialogContent
        className='sm:max-w-[425px] bg-[#080C1E] border border-white/5 shadow-[0_0_50px_rgba(0,100,220,0.05)]'
        onInteractOutside={() => setOpen(false)}
      >
        <DialogHeader className="relative">
          <DialogTitle className="text-2xl font-extrabold text-white tracking-wide">
            Update Profile
          </DialogTitle>
          <Button
            variant='ghost'
            className='absolute -top-2 -right-2 text-muted-foreground hover:text-[#00C8FF] hover:bg-[#00C8FF]/10 rounded-full transition-all duration-300'
            onClick={() => setOpen(false)}
          >
            <X className='w-5 h-5' />
          </Button>
        </DialogHeader>
        <form onSubmit={submitHandler} className="mt-4">
          <div className='grid gap-5 py-4'>
            {/* Fullname input */}
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='fullname' className='text-right text-white font-semibold tracking-wide'>
                Name
              </Label>
              <Input
                id='fullname'
                name='fullname'
                type='text'
                value={input.fullname}
                onChange={changeEventHandler}
                className='col-span-3 bg-[#050810] border-white/5 text-[#E6EDF3] focus:border-[#00C8FF] focus:ring-[#00C8FF]/20 rounded-xl'
                placeholder="Your full name"
              />
            </div>

            {/* Email input */}
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='email' className='text-right text-white font-semibold tracking-wide'>
                Email
              </Label>
              <Input
                id='email'
                name='email'
                type='email'
                value={input.email}
                onChange={changeEventHandler}
                className='col-span-3 bg-[#050810] border-white/5 text-[#E6EDF3] focus:border-[#00C8FF] focus:ring-[#00C8FF]/20 rounded-xl'
                placeholder="example@gmail.com"
              />
            </div>

            {/* Bio input */}
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='bio' className='text-right text-white font-semibold tracking-wide'>
                Bio
              </Label>
              <Input
                id='bio'
                name='bio'
                value={input.bio}
                onChange={changeEventHandler}
                className='col-span-3 bg-[#050810] border-white/5 text-[#E6EDF3] focus:border-[#00C8FF] focus:ring-[#00C8FF]/20 rounded-xl'
                placeholder="A short bio about yourself"
              />
            </div>

            {/* Avatar input */}
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='avatar' className='text-right text-white font-semibold tracking-wide'>
                Avatar
              </Label>
              <div className="col-span-3">
                <Input
                  id='avatar'
                  name='avatar'
                  type='file'
                  accept='image/png, image/jpeg, image/webp'
                  onChange={avatarChangeHandler}
                  className='bg-[#050810] border-white/5 text-[#E6EDF3] focus:border-[#00C8FF] focus:ring-[#00C8FF]/20 rounded-xl file:bg-[#8040FF] file:text-white file:border-none file:rounded-lg file:px-3 file:py-1 file:mr-3 hover:file:bg-[#9050FF] transition-all cursor-pointer'
                />
                <p className="text-[10px] text-muted-foreground mt-1 ml-1">Accepts PNG, JPG, or WEBP</p>
              </div>
            </div>


            {/* Conditional rendering for student role */}
            {user?.role === "student" && (
              <>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='skills' className='text-right text-white font-semibold tracking-wide'>
                    Skills
                  </Label>
                  <Input
                    id='skills'
                    name='skills'
                    value={input.skills}
                    onChange={changeEventHandler}
                    className='col-span-3 bg-[#050810] border-white/5 text-[#E6EDF3] focus:border-[#00C8FF] focus:ring-[#00C8FF]/20 rounded-xl'
                    placeholder="React, Node.js, Python..."
                  />
                </div>

                {/* Resume file input */}
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='file' className='text-right text-white font-semibold tracking-wide'>
                    Resume
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id='file'
                      name='file'
                      type='file'
                      accept='image/png, image/jpeg, application/pdf'
                      onChange={fileChangeHandler}
                      className='bg-[#050810] border-white/5 text-[#E6EDF3] focus:border-[#00C8FF] focus:ring-[#00C8FF]/20 rounded-xl file:bg-[#00C8FF] file:text-[#050810] file:border-none file:rounded-lg file:px-3 file:py-1 file:mr-3 hover:file:bg-[#00E5FF] transition-all cursor-pointer'
                    />
                    <p className="text-[10px] text-muted-foreground mt-1 ml-1">Accepts PNG, JPG, or PDF</p>
                  </div>
                </div>
              </>
            )}
          </div>

          <DialogFooter className="mt-6">
            <Button 
              type='submit' 
              className='w-full bg-[#00C8FF] hover:bg-[#00E5FF] text-[#050810] font-bold py-5 rounded-xl shadow-[0_0_20px_rgba(0,200,255,0.3)] hover:shadow-[0_0_30px_rgba(0,200,255,0.5)] hover:scale-[1.02] transition-all duration-300 border-none'
              disabled={loading}
            >
              {loading ? "Updating Profile..." : "Update Profile"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
