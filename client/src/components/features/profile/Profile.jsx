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
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#6A38C2]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#F83002]/5 rounded-full blur-3xl"></div>
      </div>

      <Navbar />
      <ReactHelmet
        title="Profile - Next_Hire"
        description="View and edit your profile details, including your resume, job preferences, and application history. Manage your career journey with Next_Hire."
        canonicalUrl="/profile"
      />

      <div className="max-w-7xl mx-auto mt-24 px-4 py-8 relative z-10">
        <div className="bg-white/95 backdrop-blur-sm border-2 border-gray-200/60 rounded-2xl p-6 sm:p-8 shadow-lg mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-24 w-24 ring-4 ring-[#6A38C2]/20">
                  <AvatarImage
                    src={user?.profile?.profilePhoto?.url}
                    alt="profile"
                  />
                  <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-[#6A38C2]/20 to-[#F83002]/20 text-[#6A38C2]">
                    {user?.fullname ? user.fullname.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-[#6A38C2] to-[#F83002] rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="font-extrabold text-2xl bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1">
                  {user?.fullname}
                </h1>
                <p className="text-gray-600">{user?.profile?.bio || "No bio available"}</p>
              </div>
            </div>
            <Button
              onClick={() => setOpen(true)}
              className="rounded-xl bg-gradient-to-r from-[#6A38C2] to-[#5b30a6] hover:from-[#5b30a6] hover:to-[#4a2580] text-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              variant="outline"
            >
              <Pen className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
          
          <div className="my-6 space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-xl border border-gray-200/60">
              <div className="w-10 h-10 bg-gradient-to-br from-[#6A38C2]/10 to-[#F83002]/10 rounded-lg flex items-center justify-center">
                <Mail className="text-[#6A38C2] h-5 w-5" />
              </div>
              <span className="text-gray-800 font-medium">{user?.email}</span>
            </div>
          </div>

          {user?.role === "student" && (
            <>
              <div className="my-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Skills</h2>
                <div className="flex flex-wrap items-center gap-2">
                  {user?.profile?.skills?.length > 0 ? (
                    user?.profile?.skills?.map((item, index) => (
                      <Badge key={index} className="bg-gradient-to-r from-[#6A38C2]/10 to-[#F83002]/10 text-[#6A38C2] border border-[#6A38C2]/20 px-4 py-1.5 font-semibold">
                        {item}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-500">No skills added yet</span>
                  )}
                </div>
              </div>
              <div className="grid w-full max-w-sm items-center gap-2">
                <Label className="text-md font-bold text-gray-900">Resume</Label>
                {user?.profile?.resume ? (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={user?.profile?.resume?.url}
                    className="text-[#6A38C2] hover:text-[#F83002] font-semibold hover:underline cursor-pointer transition-colors duration-200 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {user?.profile?.resume?.resumeOriginalName}
                  </a>
                ) : (
                  <span className="text-gray-500">No resume uploaded</span>
                )}
              </div>
            </>
          )}
        </div>

        {user?.role === "student" && (
          <div className="bg-white/95 backdrop-blur-sm border-2 border-gray-200/60 rounded-2xl p-6 sm:p-8 shadow-lg w-full">
            <h2 className="font-extrabold text-2xl text-center mb-6 bg-gradient-to-r from-[#6A38C2] to-[#F83002] bg-clip-text text-transparent">
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
