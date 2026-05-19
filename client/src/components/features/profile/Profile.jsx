import React, { useState } from "react";
import Navbar from "../../layout/Navbar";
import { Avatar, AvatarImage, AvatarFallback } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { Mail, Pen } from "lucide-react";
import { Badge } from "../../ui/badge";
import { Label } from "../../ui/label";
import AppliedJobTable from "../jobs/AppliedJobTable";
import { useSelector } from "react-redux";
import Companies from "../../admin/Companies";
import UpdateProfileDialog from "./UpdateProfileDialog";
import ReactHelmet from "../../common/ReactHelmet";

const Profile = () => {
  const [open, setOpen] = useState(false);
  const user = useSelector((state) => state.user.user);

  return (
    <div className="min-h-screen bg-[#050810] text-[#E6EDF3] relative overflow-hidden">
      {/* Fine-lined cyber laser grid overlay */}
      <div className="grid-overlay"></div>
      
      {/* Enhanced Background decorations with rotating orbits */}
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        <div className='absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#00C8FF]/5 rounded-full blur-[130px] anim-spin-slow'></div>
        <div className='absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-[#8040FF]/5 rounded-full blur-[140px] anim-spin-rev'></div>
      </div>

      <Navbar />
      <ReactHelmet
        title="Profile - Next_Hire"
        description="View and edit your profile details, including your resume, job preferences, and application history. Manage your career journey with Next_Hire."
        canonicalUrl="/profile"
      />

      <div className="max-w-7xl mx-auto mt-16 px-4 py-2 relative z-10">
        <div className="bg-[#080C1E]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,100,220,0.03)] hover:border-[#00C8FF]/20 hover:shadow-[0_0_35px_rgba(0,200,255,0.08)] transition-all duration-300 mb-6">
          <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left justify-between gap-6 w-full">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <div className="relative">
                <Avatar className="h-24 w-24 ring-4 ring-[#00C8FF]/20 shadow-[0_0_15px_rgba(0,200,255,0.15)]">
                  <AvatarImage
                    src={user?.profile?.profilePhoto?.url}
                    alt="profile"
                  />
                  <AvatarFallback className="text-3xl font-bold bg-[#8040FF]/20 text-[#8040FF]">
                    {user?.fullname ? user.fullname.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-[#00C8FF] to-[#8040FF] rounded-full border-2 border-[#050810] shadow-[0_0_10px_rgba(0,200,255,0.5)]"></div>
              </div>
              <div>
                <h1 className="font-extrabold text-2xl text-white tracking-wide mb-1">
                  {user?.fullname}
                </h1>
                <p className="text-muted-foreground font-medium">{user?.profile?.bio || "No bio available"}</p>
              </div>
            </div>
            <Button
              onClick={() => setOpen(true)}
              className="rounded-xl bg-[#00C8FF] hover:bg-[#00E5FF] text-[#050810] font-bold shadow-[0_0_20px_rgba(0,200,255,0.3)] hover:shadow-[0_0_30px_rgba(0,200,255,0.5)] hover:scale-105 transition-all duration-300 border-none w-full sm:w-auto"
              variant="outline"
            >
              <Pen className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
          
          <div className="my-6 space-y-3">
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-[#00C8FF]/20 transition-all duration-300">
              <div className="w-10 h-10 bg-[#00C8FF]/10 rounded-lg flex items-center justify-center border border-[#00C8FF]/20">
                <Mail className="text-[#00C8FF] h-5 w-5" />
              </div>
              <span className="text-[#E6EDF3] font-medium tracking-wide">{user?.email}</span>
            </div>
          </div>

          {user?.role === "student" && (
            <>
              <div className="my-6">
                <h2 className="text-lg font-bold text-white tracking-wide mb-3">Skills</h2>
                <div className="flex flex-wrap items-center gap-2">
                  {user?.profile?.skills?.length > 0 ? (
                    user?.profile?.skills?.map((item, index) => (
                      <Badge key={index} className="bg-[#8040FF]/15 text-[#8040FF] border border-[#8040FF]/30 px-4 py-1.5 font-semibold hover:bg-[#8040FF]/25 shadow-[0_0_15px_rgba(128,64,255,0.15)] transition-colors">
                        {item}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground font-medium">No skills added yet</span>
                  )}
                </div>
              </div>
              <div className="grid w-full max-w-sm items-center gap-2">
                <Label className="text-md font-bold text-white tracking-wide">Resume</Label>
                {user?.profile?.resume ? (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={user?.profile?.resume?.url}
                    className="text-[#00C8FF] hover:text-[#00E5FF] font-semibold cursor-pointer transition-colors duration-200 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {user?.profile?.resume?.resumeOriginalName}
                  </a>
                ) : (
                  <span className="text-muted-foreground">No resume uploaded</span>
                )}
              </div>
            </>
          )}
        </div>

        {user?.role === "student" && (
          <div className="bg-[#080C1E]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,100,220,0.03)] hover:border-[#00C8FF]/20 transition-all duration-300 w-full">
            <h2 className="font-extrabold text-2xl text-center mb-6 text-white tracking-wide">
              Applied Jobs
            </h2>
            <AppliedJobTable />
          </div>
        )}
        {user?.role === "recruiter" && <Companies />}
      </div>

      <UpdateProfileDialog open={open} setOpen={setOpen} user={user} />
    </div>
  );
};

export default Profile;
