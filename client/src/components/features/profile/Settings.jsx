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
    <div className='min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white relative overflow-hidden'>
      {/* Background decorations */}
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        <div className='absolute top-0 left-1/4 w-96 h-96 bg-[#6A38C2]/5 rounded-full blur-3xl'></div>
        <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-[#F83002]/5 rounded-full blur-3xl'></div>
      </div>

      <Navbar />
      <ReactHelmet
        title='Setting - Next_Hire'
        description='Setting for NextHire'
        canonicalUrl='/settings'
      />
      <div className='flex flex-col min-h-screen'>
        <div className='flex-1 mx-4 pt-24 flex gap-6 max-w-7xl relative z-10'>
          <div className='w-[300px] bg-white/95 backdrop-blur-sm border-2 border-gray-200/60 shadow-lg rounded-2xl px-4 py-6 sticky top-24 h-fit'>
            <h2 className='text-2xl font-extrabold mb-6 bg-gradient-to-r from-[#6A38C2] to-[#F83002] bg-clip-text text-transparent'>
              Settings
            </h2>
            <div className='flex flex-col gap-2'>
              {tabs?.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 text-left ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-[#6A38C2] to-[#5b30a6] text-white shadow-lg transform scale-105"
                      : "bg-gray-100/80 text-gray-700 hover:bg-gradient-to-r hover:from-[#6A38C2]/10 hover:to-[#F83002]/10 hover:text-[#6A38C2] hover:border hover:border-[#6A38C2]/20"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className='flex-1 bg-white/95 backdrop-blur-sm border-2 border-gray-200/60 shadow-lg px-6 py-8 rounded-2xl'>
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
        <div className="mb-6 bg-indigo-50/80 border border-indigo-200 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-800">
              Profile completion: <span className="text-indigo-700">{profileCompletion.score}%</span>
            </p>
            <p className="text-xs text-gray-600">
              {profileCompletion.completedTasks}/{profileCompletion.totalTasks} steps completed
            </p>
          </div>
          <div className="w-full bg-indigo-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#6A38C2] to-[#F83002] h-2 rounded-full transition-all duration-500"
              style={{ width: `${profileCompletion.score}%` }}
            />
          </div>
          {profileCompletion.pendingTasks && profileCompletion.pendingTasks.length > 0 && (
            <ul className="mt-3 text-xs text-gray-700 list-disc list-inside space-y-1">
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
            <Avatar className='h-24 w-24 ring-4 ring-[#6A38C2]/20'>
              <AvatarImage src={user?.profile?.profilePhoto?.url} alt='profile' />
              <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-[#6A38C2]/20 to-[#F83002]/20 text-[#6A38C2]">
                {user?.fullname ? user.fullname.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            <div className='absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-[#6A38C2] to-[#F83002] rounded-full border-2 border-white'></div>
          </div>
          <label className='cursor-pointer bg-gradient-to-r from-[#6A38C2] to-[#5b30a6] hover:from-[#5b30a6] hover:to-[#4a2580] text-white px-6 py-2 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 inline-block'>
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
          <label className='block font-bold mb-2 text-gray-900'>Bio</label>
          <textarea
            name='bio'
            value={input.bio}
            onChange={changeHandler}
            rows='4'
            className='block w-full rounded-xl border-2 border-gray-200/60 p-3 resize-none focus:border-[#6A38C2] focus:ring-2 focus:ring-[#6A38C2]/20 outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm'
          ></textarea>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <label className='block font-bold mb-2 text-gray-900'>Full Name</label>
          <input
            name='fullname'
            value={input.fullname}
            onChange={changeHandler}
            type='text'
            className='mt-1 block w-full rounded-xl border-2 border-gray-200/60 p-3 focus:border-[#6A38C2] focus:ring-2 focus:ring-[#6A38C2]/20 outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm'
          />
        </div>
        <div>
          <label className='block font-bold mb-2 text-gray-900'>Email</label>
          <input
            name='email'
            value={input.email}
            onChange={changeHandler}
            type='email'
            disabled
            className='mt-1 block w-full rounded-xl border-2 border-gray-200/60 p-3 bg-gray-100/80 cursor-not-allowed'
          />
        </div>
      </div>

      {user?.role === "student" && (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='block font-bold mb-2 text-gray-900'>Skills</label>
            <input
              name='skills'
              value={input.skills}
              onChange={changeHandler}
              type='text'
              className='mt-1 block w-full rounded-xl border-2 border-gray-200/60 p-3 focus:border-[#6A38C2] focus:ring-2 focus:ring-[#6A38C2]/20 outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm'
              placeholder='e.g., React, Node.js, Python'
            />
          </div>
          <div>
            <label className='block font-bold mb-2 text-gray-900'>Upload Resume</label>
            <input
              name='file'
              onChange={fileHandler}
              type='file'
              accept='.pdf,.doc,.docx'
              className='mt-1 block w-full rounded-xl border-2 border-gray-200/60 p-2 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-[#6A38C2] file:to-[#5b30a6] file:text-white hover:file:from-[#5b30a6] hover:file:to-[#4a2580] file:cursor-pointer transition-all duration-300 bg-white/80 backdrop-blur-sm'
            />
          </div>
        </div>
      )}

      <div>
        <button
          type='submit'
          className='mt-4 bg-gradient-to-r from-[#6A38C2] to-[#5b30a6] hover:from-[#5b30a6] hover:to-[#4a2580] text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300'
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
        <label className='block font-bold mb-2 text-gray-900'>Current Password</label>
        <input
          type='password'
          className='mt-1 block w-full rounded-xl border-2 border-gray-200/60 p-3 focus:border-[#6A38C2] focus:ring-2 focus:ring-[#6A38C2]/20 outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm'
          value={currentPassword}
          onChange={(e) => {
            setCurrentPassword(e.target.value);
            if (error) setError("");
          }}
        />
      </div>
      <div>
        <label className='block font-bold mb-2 text-gray-900'>New Password</label>
        <input
          type='password'
          className='mt-1 block w-full rounded-xl border-2 border-gray-200/60 p-3 focus:border-[#6A38C2] focus:ring-2 focus:ring-[#6A38C2]/20 outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm'
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div>
        <label className='block font-bold mb-2 text-gray-900'>Confirm New Password</label>
        <input
          type='password'
          className='mt-1 block w-full rounded-xl border-2 border-gray-200/60 p-3 focus:border-[#6A38C2] focus:ring-2 focus:ring-[#6A38C2]/20 outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      {error && (
        <div className='bg-red-50/80 backdrop-blur-sm border-2 border-red-200 rounded-xl p-4'>
          <p className='text-red-700 font-semibold'>{error}</p>
        </div>
      )}

      <button
        onClick={handlePasswordChange}
        className='mt-4 bg-gradient-to-r from-[#6A38C2] to-[#5b30a6] hover:from-[#5b30a6] hover:to-[#4a2580] text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300'
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
      <div className='bg-gray-50/80 rounded-xl p-4 border border-gray-200/60 space-y-4'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='font-semibold text-gray-900'>Job Alerts</p>
            <p className='text-xs text-gray-600'>
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
            <div className='w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#6A38C2]/40 rounded-full peer peer-checked:bg-[#6A38C2] relative transition-colors'>
              <span className='absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 peer-checked:translate-x-5' />
            </div>
        </label>
      </div>

        <div className='mt-3'>
          <p className='text-xs font-semibold text-gray-700 mb-1'>
            Alert frequency
          </p>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            disabled={!enabled}
            className='mt-1 block w-full rounded-xl border-2 border-gray-200/60 p-2 text-sm focus:border-[#6A38C2] focus:ring-2 focus:ring-[#6A38C2]/20 outline-none bg-white/80 disabled:bg-gray-100 disabled:text-gray-400'
          >
            <option value='daily'>Daily</option>
            <option value='weekly'>Weekly</option>
          </select>
      </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className='mt-4 bg-gradient-to-r from-[#6A38C2] to-[#5b30a6] hover:from-[#5b30a6] hover:to-[#4a2580] text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed'
      >
        {saving ? "Saving..." : "Save Preferences"}
      </button>
    </div>
  );
}

function PrivacyTab() {
  return (
    <div className='space-y-6'>
      <div className='bg-gray-50/80 rounded-xl p-4 border border-gray-200/60'>
        <label className='flex items-center gap-3 cursor-pointer hover:bg-gray-100/50 rounded-lg p-3 transition-colors duration-200'>
          <input type='checkbox' className='w-5 h-5 text-[#6A38C2] border-gray-300 rounded focus:ring-[#6A38C2] focus:ring-2 cursor-pointer' />
          <span className='font-semibold text-gray-900'>Make my profile public</span>
        </label>
      </div>
      <div className='bg-gray-50/80 rounded-xl p-4 border border-gray-200/60'>
        <label className='flex items-center gap-3 cursor-pointer hover:bg-gray-100/50 rounded-lg p-3 transition-colors duration-200'>
          <input type='checkbox' className='w-5 h-5 text-[#6A38C2] border-gray-300 rounded focus:ring-[#6A38C2] focus:ring-2 cursor-pointer' />
          <span className='font-semibold text-gray-900'>Allow resume downloads</span>
        </label>
      </div>
      <div className='mt-8 border-t-2 border-gray-200 pt-6 space-y-3'>
        <button className='text-red-600 hover:text-red-700 font-semibold px-4 py-2 rounded-xl hover:bg-red-50 transition-all duration-200'>
          Deactivate Account
        </button>
        <br />
        <button className='text-red-600 hover:text-red-700 font-semibold px-4 py-2 rounded-xl hover:bg-red-50 transition-all duration-200'>
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
        <h2 className="text-2xl font-extrabold bg-gradient-to-r from-[#6A38C2] to-[#F83002] bg-clip-text text-transparent">
          Saved Searches
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-[#6A38C2] to-[#5b30a6] hover:from-[#5b30a6] hover:to-[#4a2580] text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          {showForm ? "Cancel" : "+ New Search"}
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50/80 rounded-xl p-6 border-2 border-gray-200/60 space-y-4">
          <input
            type="text"
            placeholder="Search name (e.g., 'React Developer Jobs')"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-xl border-2 border-gray-200/60 p-3 focus:border-[#6A38C2] focus:ring-2 focus:ring-[#6A38C2]/20 outline-none"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Keywords (comma-separated)"
              value={formData.keywords}
              onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
              className="rounded-xl border-2 border-gray-200/60 p-3 focus:border-[#6A38C2] focus:ring-2 focus:ring-[#6A38C2]/20 outline-none"
            />
            <input
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="rounded-xl border-2 border-gray-200/60 p-3 focus:border-[#6A38C2] focus:ring-2 focus:ring-[#6A38C2]/20 outline-none"
            />
            <input
              type="text"
              placeholder="Job Type"
              value={formData.jobType}
              onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
              className="rounded-xl border-2 border-gray-200/60 p-3 focus:border-[#6A38C2] focus:ring-2 focus:ring-[#6A38C2]/20 outline-none"
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.alertEnabled}
                onChange={(e) => setFormData({ ...formData, alertEnabled: e.target.checked })}
                className="w-5 h-5 text-[#6A38C2]"
              />
              <label className="font-semibold text-gray-900">Enable alerts for this search</label>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-gradient-to-r from-[#6A38C2] to-[#5b30a6] hover:from-[#5b30a6] hover:to-[#4a2580] text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
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
              className="bg-white/80 rounded-xl p-4 border-2 border-gray-200/60 hover:border-[#6A38C2]/30 transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{search.name}</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    {search.keywords?.length > 0 && (
                      <p><strong>Keywords:</strong> {search.keywords.join(", ")}</p>
                    )}
                    {search.location && <p><strong>Location:</strong> {search.location}</p>}
                    {search.jobType && <p><strong>Job Type:</strong> {search.jobType}</p>}
                    {search.alertEnabled && (
                      <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold mt-2">
                        Alerts Enabled
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(search._id)}
                  className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
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
        <h2 className="text-2xl font-extrabold bg-gradient-to-r from-[#6A38C2] to-[#F83002] bg-clip-text text-transparent">
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
          className="bg-gradient-to-r from-[#6A38C2] to-[#5b30a6] hover:from-[#5b30a6] hover:to-[#4a2580] text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          {showForm ? "Cancel" : "+ New Template"}
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50/80 rounded-xl p-6 border-2 border-gray-200/60 space-y-4">
          <input
            type="text"
            placeholder="Template title (e.g., 'Software Engineer Application')"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full rounded-xl border-2 border-gray-200/60 p-3 focus:border-[#6A38C2] focus:ring-2 focus:ring-[#6A38C2]/20 outline-none"
          />
          <textarea
            placeholder="Cover letter text..."
            value={formData.coverLetter}
            onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
            rows={8}
            className="w-full rounded-xl border-2 border-gray-200/60 p-3 focus:border-[#6A38C2] focus:ring-2 focus:ring-[#6A38C2]/20 outline-none resize-none"
          />
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-gradient-to-r from-[#6A38C2] to-[#5b30a6] hover:from-[#5b30a6] hover:to-[#4a2580] text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
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
              className="bg-white/80 rounded-xl p-4 border-2 border-gray-200/60 hover:border-[#6A38C2]/30 transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{template.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3">{template.coverLetter}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(template)}
                    className="text-[#6A38C2] hover:text-[#5b30a6] p-2 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(template._id)}
                    className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
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
