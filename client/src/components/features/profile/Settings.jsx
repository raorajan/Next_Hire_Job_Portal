import { useEffect, useState } from "react";
import { FaUser, FaLock, FaBell, FaShieldAlt, FaSearch, FaFileAlt, FaTrash, FaEdit } from "react-icons/fa";
import Navbar from "../../layout/Navbar";
import Footer from "../../layout/Footer";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  changePassword,
  updateUserProfile,
  getProfileCompletion,
  getJobAlerts,
  updateJobAlerts,
  getSavedSearches,
  saveSavedSearch,
  deleteSavedSearch,
  getQuickTemplates,
  createQuickTemplate,
  updateQuickTemplate,
  deleteQuickTemplate,
} from "@/redux/slices/user.slice";
import { Avatar, AvatarImage, AvatarFallback } from "../../ui/avatar";
import Loader from "../../common/Loader";
import { toast } from "react-toastify";
import ReactHelmet from "../../common/ReactHelmet";

const tabs = [
  { id: "settings", label: "Profile Info", icon: <FaUser /> },
  { id: "password", label: "Change Password", icon: <FaLock /> },
  { id: "notifications", label: "Notifications", icon: <FaBell /> },
  { id: "saved-searches", label: "Saved Searches", icon: <FaSearch /> },
  { id: "templates", label: "Quick Templates", icon: <FaFileAlt /> },
  { id: "privacy", label: "Privacy", icon: <FaShieldAlt /> },
];

export default function Settings() {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const page = queryParams.get("page");
  const [activeTab, setActiveTab] = useState(page || "settings");
  useEffect(() => {
    setActiveTab(page);
  }, [page]);

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
        title='Setting - Next_Hire'
        description='Setting for NextHire'
        canonicalUrl='/settings'
      />
      <div className='flex flex-col min-h-screen'>
        <div className='flex-1 mx-4 pt-24 flex flex-col md:flex-row gap-6 max-w-7xl relative z-10'>
          <div className='w-full md:w-[300px] bg-[#080C1E]/80 backdrop-blur-xl border border-white/5 shadow-[0_0_50px_rgba(0,100,220,0.03)] rounded-2xl px-4 py-6 md:sticky md:top-24 h-fit'>
            <h2 className='text-2xl font-extrabold mb-6 text-white tracking-wide'>
              Settings
            </h2>
            <div className='flex flex-col gap-2'>
              {tabs?.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 text-left ${
                    activeTab === tab.id
                      ? "bg-[#00C8FF] text-[#050810] shadow-[0_0_20px_rgba(0,200,255,0.3)] transform scale-105"
                      : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-[#00C8FF] border border-transparent hover:border-[#00C8FF]/20"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className='flex-1 bg-[#080C1E]/80 backdrop-blur-xl border border-white/5 shadow-[0_0_50px_rgba(0,100,220,0.03)] px-6 py-8 rounded-2xl'>
            {activeTab === "settings" && <ProfileTab />}
            {activeTab === "password" && <PasswordTab />}
            {activeTab === "notifications" && <NotificationsTab />}
            {activeTab === "saved-searches" && <SavedSearchesTab />}
            {activeTab === "templates" && <QuickTemplatesTab />}
            {activeTab === "privacy" && <PrivacyTab />}
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

function ProfileTab() {
  const { user, profileCompletion } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    bio: "",
    skills: "",
    file: null,
    avatar: null,
  });

  useEffect(() => {
    if (user) {
      setInput({
        fullname: user.fullname || "",
        email: user.email || "",
        bio: user.profile?.bio || "",
        skills: user.profile?.skills?.join(", ") || "",
        file: null,
      });
    }
  }, [user]);

  useEffect(() => {
    if (!profileCompletion) {
      dispatch(getProfileCompletion());
    }
  }, [dispatch, profileCompletion]);

  const changeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  const avatarHandler = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setInput({ ...input, avatar: file });
    } else {
      toast.error("Please select a valid image file.");
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!input.fullname || !input.email) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("bio", input.bio);

    const skillsArray = input.skills
      ? input.skills.split(",").map((skill) => skill.trim())
      : [];
    formData.append("skills", skillsArray);

    if (input.file) {
      formData.append("resume", input.file);
    }
    if (input.avatar) {
      formData.append("avatar", input.avatar);
    }
    setLoading(true);
    dispatch(updateUserProfile(formData))
      .then((res) => {
        if (res?.payload?.status === 200) {
          setLoading(false);
          toast.success("Profile updated successfully!");
        }
      })
      .catch(() => {
        setLoading(false);
        toast.error("Failed to update profile.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <form onSubmit={submitHandler} className='space-y-6'>
      {loading && <Loader />}
      {profileCompletion && (
        <div className="mb-6 bg-[#00C8FF]/5 border border-[#00C8FF]/20 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-white tracking-wide">
              Profile completion: <span className="text-[#00C8FF]">{profileCompletion.score}%</span>
            </p>
            <p className="text-xs text-muted-foreground">
              {profileCompletion.completedTasks}/{profileCompletion.totalTasks} steps completed
            </p>
          </div>
          <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
            <div
              className="bg-gradient-to-r from-[#00C8FF] to-[#8040FF] h-2 rounded-full transition-all duration-500 shadow-[0_0_15px_rgba(0,200,255,0.5)]"
              style={{ width: `${profileCompletion.score}%` }}
            />
          </div>
          {profileCompletion.pendingTasks && profileCompletion.pendingTasks.length > 0 && (
            <ul className="mt-3 text-xs text-muted-foreground list-disc list-inside space-y-1">
              {profileCompletion.pendingTasks.map((task) => (
                <li key={task}>{task}</li>
              ))}
            </ul>
          )}
        </div>
      )}
      <div className='flex items-start gap-6'>
        <div className='flex flex-col items-center'>
          <div className='relative mb-4'>
            <Avatar className='h-24 w-24 ring-4 ring-[#00C8FF]/20 shadow-[0_0_15px_rgba(0,200,255,0.15)]'>
              <AvatarImage src={user?.profile?.profilePhoto?.url} alt='profile' />
              <AvatarFallback className="text-3xl font-bold bg-[#8040FF]/20 text-[#8040FF]">
                {user?.fullname ? user.fullname.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            <div className='absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-[#00C8FF] to-[#8040FF] rounded-full border-2 border-[#050810] shadow-[0_0_10px_rgba(0,200,255,0.5)]'></div>
          </div>
          <label className='cursor-pointer bg-[#00C8FF] hover:bg-[#00E5FF] text-[#050810] px-6 py-2 rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(0,200,255,0.3)] hover:shadow-[0_0_30px_rgba(0,200,255,0.5)] hover:scale-105 transition-all duration-300 inline-block text-center'>
            Upload Photo
            <input
              id='avatar'
              name='avatar'
              type='file'
              accept='image/*'
              onChange={avatarHandler}
              className='hidden'
            />
          </label>
        </div>
        <div className='flex-1'>
          <label className='block font-bold mb-2 text-white tracking-wide'>Bio</label>
          <textarea
            name='bio'
            value={input.bio}
            onChange={changeHandler}
            rows='4'
            className='block w-full rounded-xl border border-white/5 p-3 resize-none focus:border-[#00C8FF] focus:ring-2 focus:ring-[#00C8FF]/20 outline-none transition-all duration-300 bg-[#050810] text-[#E6EDF3]'
          ></textarea>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <label className='block font-bold mb-2 text-white tracking-wide'>Full Name</label>
          <input
            name='fullname'
            value={input.fullname}
            onChange={changeHandler}
            type='text'
            className='mt-1 block w-full rounded-xl border border-white/5 p-3 focus:border-[#00C8FF] focus:ring-2 focus:ring-[#00C8FF]/20 outline-none transition-all duration-300 bg-[#050810] text-[#E6EDF3]'
          />
        </div>
        <div>
          <label className='block font-bold mb-2 text-white tracking-wide'>Email</label>
          <input
            name='email'
            value={input.email}
            onChange={changeHandler}
            type='email'
            disabled
            className='mt-1 block w-full rounded-xl border border-white/5 p-3 bg-white/5 text-muted-foreground cursor-not-allowed'
          />
        </div>
      </div>

      {user?.role === "student" && (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='block font-bold mb-2 text-white tracking-wide'>Skills</label>
            <input
              name='skills'
              value={input.skills}
              onChange={changeHandler}
              type='text'
              className='mt-1 block w-full rounded-xl border border-white/5 p-3 focus:border-[#00C8FF] focus:ring-2 focus:ring-[#00C8FF]/20 outline-none transition-all duration-300 bg-[#050810] text-[#E6EDF3]'
              placeholder='e.g., React, Node.js, Python'
            />
          </div>
          <div>
            <label className='block font-bold mb-2 text-white tracking-wide'>Upload Resume</label>
            <input
              name='file'
              onChange={fileHandler}
              type='file'
              accept='.pdf,.doc,.docx'
              className='mt-1 block w-full rounded-xl border border-white/5 p-2 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#00C8FF] file:text-[#050810] hover:file:bg-[#00E5FF] file:cursor-pointer transition-all duration-300 bg-[#050810] text-[#E6EDF3]'
            />
          </div>
        </div>
      )}

      <div>
        <button
          type='submit'
          className='mt-4 bg-[#00C8FF] hover:bg-[#00E5FF] text-[#050810] px-8 py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(0,200,255,0.3)] hover:shadow-[0_0_30px_rgba(0,200,255,0.5)] hover:scale-105 transition-all duration-300'
          disabled={loading}
        >
          {loading ? "Please wait..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

function PasswordTab() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match");
      return;
    }

    const data = {
      currentPassword,
      newPassword,
    };

    try {
      const response = await dispatch(changePassword(data));
      if (response?.payload?.status == 200) {
        toast.success(response?.payload?.message);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(response?.payload?.message);
      }
    } catch (err) {
      setError("An error occurred, please try again later");
    }
  };

  return (
    <div className='space-y-6'>
      <div>
        <label className='block font-bold mb-2 text-white tracking-wide'>Current Password</label>
        <input
          type='password'
          className='mt-1 block w-full rounded-xl border border-white/5 p-3 focus:border-[#00C8FF] focus:ring-2 focus:ring-[#00C8FF]/20 outline-none transition-all duration-300 bg-[#050810] text-[#E6EDF3]'
          value={currentPassword}
          onChange={(e) => {
            setCurrentPassword(e.target.value);
            if (error) setError("");
          }}
        />
      </div>
      <div>
        <label className='block font-bold mb-2 text-white tracking-wide'>New Password</label>
        <input
          type='password'
          className='mt-1 block w-full rounded-xl border border-white/5 p-3 focus:border-[#00C8FF] focus:ring-2 focus:ring-[#00C8FF]/20 outline-none transition-all duration-300 bg-[#050810] text-[#E6EDF3]'
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div>
        <label className='block font-bold mb-2 text-white tracking-wide'>Confirm New Password</label>
        <input
          type='password'
          className='mt-1 block w-full rounded-xl border border-white/5 p-3 focus:border-[#00C8FF] focus:ring-2 focus:ring-[#00C8FF]/20 outline-none transition-all duration-300 bg-[#050810] text-[#E6EDF3]'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      {error && (
        <div className='bg-destructive/10 border border-destructive/20 rounded-xl p-4'>
          <p className='text-destructive font-semibold'>{error}</p>
        </div>
      )}

      <button
        onClick={handlePasswordChange}
        className='mt-4 bg-[#00C8FF] hover:bg-[#00E5FF] text-[#050810] px-8 py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(0,200,255,0.3)] hover:shadow-[0_0_30px_rgba(0,200,255,0.5)] hover:scale-105 transition-all duration-300'
      >
        Update Password
      </button>
    </div>
  );
}

function NotificationsTab() {
  const dispatch = useDispatch();
  const { jobAlerts } = useSelector((state) => state.user);
  const [enabled, setEnabled] = useState(false);
  const [frequency, setFrequency] = useState("daily");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(getJobAlerts());
  }, [dispatch]);

  useEffect(() => {
    if (jobAlerts) {
      setEnabled(Boolean(jobAlerts.enabled));
      setFrequency(jobAlerts.frequency || "daily");
    }
  }, [jobAlerts]);

  const handleSave = () => {
    setSaving(true);
    dispatch(
      updateJobAlerts({
        enabled,
        frequency,
      })
    )
      .then((res) => {
        if (res?.payload?.status === 200) {
          toast.success("Notification preferences updated");
        } else {
          toast.error(res?.payload?.message || "Failed to update preferences");
        }
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message || "Failed to update preferences"
        );
      })
      .finally(() => setSaving(false));
  };

  return (
    <div className='space-y-6'>
      <div className='bg-white/5 rounded-xl p-4 border border-white/5 space-y-4 hover:border-white/10 transition-colors'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='font-semibold text-white tracking-wide'>Job Alerts</p>
            <p className='text-xs text-muted-foreground'>
              Get periodic emails with new jobs that match your interests.
            </p>
          </div>
          <label className='inline-flex items-center cursor-pointer'>
            <input
              type='checkbox'
              className='sr-only peer'
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />
            <div className='w-11 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#00C8FF]/40 rounded-full peer peer-checked:bg-[#00C8FF] relative transition-colors shadow-inner'>
              <span className='absolute top-[2px] left-[2px] w-5 h-5 bg-[#050810] rounded-full shadow-sm transition-transform duration-200 peer-checked:translate-x-5' />
            </div>
          </label>
        </div>

        <div className='mt-3'>
          <p className='text-xs font-semibold text-muted-foreground mb-1'>
            Alert frequency
          </p>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            disabled={!enabled}
            className='mt-1 block w-full rounded-xl border border-white/5 p-2 text-sm focus:border-[#00C8FF] focus:ring-2 focus:ring-[#00C8FF]/20 outline-none bg-[#050810] text-white disabled:bg-white/5 disabled:text-muted-foreground transition-all duration-300'
          >
            <option value='daily'>Daily</option>
            <option value='weekly'>Weekly</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className='mt-4 bg-[#00C8FF] hover:bg-[#00E5FF] text-[#050810] px-8 py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(0,200,255,0.3)] hover:shadow-[0_0_30px_rgba(0,200,255,0.5)] hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed'
      >
        {saving ? "Saving..." : "Save Preferences"}
      </button>
    </div>
  );
}

function PrivacyTab() {
  return (
    <div className='space-y-6'>
      <div className='bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors'>
        <label className='flex items-center gap-3 cursor-pointer hover:bg-white/5 rounded-lg p-3 transition-all duration-200'>
          <input type='checkbox' className='w-5 h-5 accent-[#00C8FF] border-white/5 rounded focus:ring-[#00C8FF] focus:ring-2 cursor-pointer bg-[#050810]' />
          <span className='font-semibold text-white tracking-wide'>Make my profile public</span>
        </label>
      </div>
      <div className='bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors'>
        <label className='flex items-center gap-3 cursor-pointer hover:bg-white/5 rounded-lg p-3 transition-all duration-200'>
          <input type='checkbox' className='w-5 h-5 accent-[#00C8FF] border-white/5 rounded focus:ring-[#00C8FF] focus:ring-2 cursor-pointer bg-[#050810]' />
          <span className='font-semibold text-white tracking-wide'>Allow resume downloads</span>
        </label>
      </div>
      <div className='mt-8 border-t border-white/10 pt-6 space-y-4'>
        <button className='text-destructive hover:text-white font-bold px-4 py-2 rounded-xl hover:bg-destructive transition-all duration-300 border border-destructive/20 hover:border-destructive'>
          Deactivate Account
        </button>
        <br />
        <button className='text-destructive hover:text-white font-bold px-4 py-2 rounded-xl hover:bg-destructive transition-all duration-300 border border-destructive/20 hover:border-destructive'>
          Delete My Account
        </button>
      </div>
    </div>
  );
}

function SavedSearchesTab() {
  const dispatch = useDispatch();
  const { savedSearches } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    keywords: "",
    location: "",
    jobType: "",
    minSalary: "",
    maxSalary: "",
    alertEnabled: false,
  });

  useEffect(() => {
    dispatch(getSavedSearches());
  }, [dispatch]);

  const handleSave = async () => {
    if (!formData.name) {
      toast.error("Please enter a name for this search");
      return;
    }
    setLoading(true);
    try {
      await dispatch(saveSavedSearch(formData)).unwrap();
      toast.success("Search saved successfully!");
      setShowForm(false);
      setFormData({
        name: "",
        keywords: "",
        location: "",
        jobType: "",
        minSalary: "",
        maxSalary: "",
        alertEnabled: false,
      });
    } catch (error) {
      toast.error(error?.message || "Failed to save search");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (searchId) => {
    if (!window.confirm("Are you sure you want to delete this saved search?")) return;
    setLoading(true);
    try {
      await dispatch(deleteSavedSearch(searchId)).unwrap();
      toast.success("Search deleted successfully!");
    } catch (error) {
      toast.error(error?.message || "Failed to delete search");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-extrabold text-white tracking-wide">
          Saved Searches
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#00C8FF] hover:bg-[#00E5FF] text-[#050810] px-6 py-2 rounded-xl font-bold shadow-[0_0_20px_rgba(0,200,255,0.3)] hover:scale-105 transition-all duration-300"
        >
          {showForm ? "Cancel" : "+ New Search"}
        </button>
      </div>

      {showForm && (
        <div className="bg-[#080C1E]/50 rounded-xl p-6 border border-white/5 space-y-4 shadow-inner">
          <input
            type="text"
            placeholder="Search name (e.g., 'React Developer Jobs')"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-xl border border-white/5 p-3 focus:border-[#00C8FF] focus:ring-2 focus:ring-[#00C8FF]/20 outline-none bg-[#050810] text-[#E6EDF3]"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Keywords (comma-separated)"
              value={formData.keywords}
              onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
              className="rounded-xl border border-white/5 p-3 focus:border-[#00C8FF] focus:ring-2 focus:ring-[#00C8FF]/20 outline-none bg-[#050810] text-[#E6EDF3]"
            />
            <input
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="rounded-xl border border-white/5 p-3 focus:border-[#00C8FF] focus:ring-2 focus:ring-[#00C8FF]/20 outline-none bg-[#050810] text-[#E6EDF3]"
            />
            <input
              type="text"
              placeholder="Job Type"
              value={formData.jobType}
              onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
              className="rounded-xl border border-white/5 p-3 focus:border-[#00C8FF] focus:ring-2 focus:ring-[#00C8FF]/20 outline-none bg-[#050810] text-[#E6EDF3]"
            />
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.alertEnabled}
                onChange={(e) => setFormData({ ...formData, alertEnabled: e.target.checked })}
                className="w-5 h-5 accent-[#00C8FF] bg-[#050810] border-white/5"
              />
              <label className="font-semibold text-white tracking-wide">Enable alerts for this search</label>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-[#00C8FF] hover:bg-[#00E5FF] text-[#050810] px-6 py-2 rounded-xl font-bold shadow-[0_0_20px_rgba(0,200,255,0.3)] hover:scale-105 transition-all duration-300"
          >
            {loading ? "Saving..." : "Save Search"}
          </button>
        </div>
      )}

      <div className="space-y-4">
        {savedSearches && savedSearches.length > 0 ? (
          savedSearches.map((search) => (
            <div
              key={search._id}
              className="bg-muted/20 backdrop-blur-sm rounded-xl p-4 border border-border hover:border-primary/30 hover:bg-muted/30 transition-all duration-300 group"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-white mb-2 group-hover:text-[#00C8FF] transition-colors">{search.name}</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    {search.keywords?.length > 0 && (
                      <p><strong>Keywords:</strong> {search.keywords.join(", ")}</p>
                    )}
                    {search.location && <p><strong>Location:</strong> {search.location}</p>}
                    {search.jobType && <p><strong>Job Type:</strong> {search.jobType}</p>}
                    {search.alertEnabled && (
                      <span className="inline-block bg-[#00C8FF]/10 text-[#00C8FF] border border-[#00C8FF]/20 px-3 py-1 rounded-full text-xs font-bold mt-2 shadow-[0_0_10px_rgba(0,200,255,0.2)]">
                        Alerts Enabled
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(search._id)}
                  className="text-muted-foreground hover:text-destructive p-2 hover:bg-destructive/10 rounded-lg transition-all duration-200"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">No saved searches yet. Create one to get started!</p>
        )}
      </div>
    </div>
  );
}

function QuickTemplatesTab() {
  const dispatch = useDispatch();
  const { quickTemplates } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    coverLetter: "",
  });

  useEffect(() => {
    dispatch(getQuickTemplates());
  }, [dispatch]);

  const handleSave = async () => {
    if (!formData.title || !formData.coverLetter) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      if (editingId) {
        await dispatch(updateQuickTemplate({ templateId: editingId, data: formData })).unwrap();
        toast.success("Template updated successfully!");
      } else {
        await dispatch(createQuickTemplate(formData)).unwrap();
        toast.success("Template created successfully!");
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ title: "", coverLetter: "" });
    } catch (error) {
      toast.error(error?.message || "Failed to save template");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (template) => {
    setFormData({ title: template.title, coverLetter: template.coverLetter || "" });
    setEditingId(template._id);
    setShowForm(true);
  };

  const handleDelete = async (templateId) => {
    if (!window.confirm("Are you sure you want to delete this template?")) return;
    setLoading(true);
    try {
      await dispatch(deleteQuickTemplate(templateId)).unwrap();
      toast.success("Template deleted successfully!");
    } catch (error) {
      toast.error(error?.message || "Failed to delete template");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-extrabold text-white tracking-wide">
          Quick Apply Templates
        </h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) {
              setEditingId(null);
              setFormData({ title: "", coverLetter: "" });
            }
          }}
          className="bg-[#00C8FF] hover:bg-[#00E5FF] text-[#050810] px-6 py-2 rounded-xl font-bold shadow-[0_0_20px_rgba(0,200,255,0.3)] hover:scale-105 transition-all duration-300"
        >
          {showForm ? "Cancel" : "+ New Template"}
        </button>
      </div>

      {showForm && (
        <div className="bg-[#080C1E]/50 rounded-xl p-6 border border-white/5 space-y-4 shadow-inner">
          <input
            type="text"
            placeholder="Template title (e.g., 'Software Engineer Application')"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full rounded-xl border border-white/5 p-3 focus:border-[#00C8FF] focus:ring-2 focus:ring-[#00C8FF]/20 outline-none bg-[#050810] text-[#E6EDF3]"
          />
          <textarea
            placeholder="Cover letter text..."
            value={formData.coverLetter}
            onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
            rows={8}
            className="w-full rounded-xl border border-white/5 p-3 focus:border-[#00C8FF] focus:ring-2 focus:ring-[#00C8FF]/20 outline-none resize-none bg-[#050810] text-[#E6EDF3]"
          />
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-[#00C8FF] hover:bg-[#00E5FF] text-[#050810] px-6 py-2 rounded-xl font-bold shadow-[0_0_20px_rgba(0,200,255,0.3)] hover:scale-105 transition-all duration-300"
          >
            {loading ? "Saving..." : editingId ? "Update Template" : "Create Template"}
          </button>
        </div>
      )}

      <div className="space-y-4">
        {quickTemplates && quickTemplates.length > 0 ? (
          quickTemplates.map((template) => (
            <div
              key={template._id}
              className="bg-[#080C1E]/50 backdrop-blur-xl rounded-xl p-4 border border-white/5 hover:border-[#00C8FF]/30 transition-all duration-300"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-white mb-2">{template.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">{template.coverLetter}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(template)}
                    className="text-[#00C8FF] hover:text-[#00E5FF] p-2 hover:bg-[#00C8FF]/10 rounded-lg transition-colors"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(template._id)}
                    className="text-red-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">No templates yet. Create one to speed up your applications!</p>
        )}
      </div>
    </div>
  );
}
