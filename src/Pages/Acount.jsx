import React, { useState, useEffect } from "react";
import { UserData } from "../Context/UserContext";
import { CourseData } from "../Context/CourseContext";
import { useNavigate, useSearchParams } from "react-router";
import { BookOpen, Award, Clock, Settings, LogOut, Edit2, Eye, EyeOff, Mail, User as UserIcon, Zap, X } from "lucide-react";

export default function StudentDashboard() {
  const { user, loading, logoutUser, btnLoading, updatePassword, deleteAccount, updateProfile } = UserData();
  const { myCourse } = CourseData();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    profilePic: null,
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Set active tab from URL query parameter
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "courses") {
      setActiveTab("courses");
    }
    // Update profile form when user data changes
    if (user) {
      setProfileForm({
        name: user?.name || "",
        email: user?.email || "",
        profilePic: null,
      });
    }
  }, [searchParams, user]);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePic" && files) {
      setProfileForm((prev) => ({ ...prev, profilePic: files[0] }));
    } else {
      setProfileForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!profileForm.name && !profileForm.email && !profileForm.profilePic) {
      alert("Please fill at least one field to update");
      return;
    }

    const success = await updateProfile(
      profileForm.name || user?.name,
      profileForm.email || user?.email,
      profileForm.profilePic
    );

    if (success) {
      setShowEditProfile(false);
      setProfileForm({
        name: user?.name || "",
        email: user?.email || "",
        profilePic: null,
      });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      alert("Please fill all password fields");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert("New password must be at least 6 characters long");
      return;
    }

    const success = await updatePassword(
      passwordForm.currentPassword,
      passwordForm.newPassword
    );

    if (success) {
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently deleted."
    );

    if (!confirmed) return;

    const secondConfirm = window.confirm(
      "This is your final warning. Type 'DELETE' in the prompt to confirm."
    );

    if (!secondConfirm) return;

    const userInput = window.prompt("Type 'DELETE' to confirm account deletion:");
    if (userInput !== "DELETE") {
      alert("Account deletion cancelled. You did not type 'DELETE'.");
      return;
    }

    // Call delete account from context - you'll need to add this
    // For now, show placeholder
    alert("Account deletion feature coming soon");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-semibold">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalCourses = myCourse?.length || 0;
  const completionRate = 65; // Mock data - update with actual calculation
  const learningHours = Math.floor(totalCourses * 12); // Mock data

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        <Icon className={`w-12 h-12 opacity-20`} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 dark:from-indigo-900 dark:via-purple-900 dark:to-indigo-900 text-white p-8 shadow-xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Profile Info */}
            <div className="flex items-center gap-5 w-full md:w-auto">
              <div className="relative">
                <img
                  src={user?.profilePic || "https://via.placeholder.com/100"}
                  alt={user?.name}
                  className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
                />
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-400 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold">{user?.name}</h1>
                <p className="text-indigo-100 flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4" /> {user?.email}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3">
              <button 
                onClick={() => setShowEditProfile(true)}
                className="bg-white/20 hover:bg-white/30 text-white px-5 py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2">
                <Edit2 className="w-4 h-4" /> Edit Profile
              </button>
              <button
                onClick={() => logoutUser(navigate)}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={BookOpen}
            label="Courses Enrolled"
            value={totalCourses}
            color="border-blue-400"
          />
          <StatCard
            icon={Clock}
            label="Learning Hours"
            value={learningHours}
            color="border-purple-400"
          />
          <StatCard
            icon={Award}
            label="Completion Rate"
            value={`${completionRate}%`}
            color="border-green-400"
          />
          <StatCard
            icon={Zap}
            label="Streak"
            value="7 days"
            color="border-yellow-400"
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-gray-200 flex-wrap">
          {[
            { id: "overview", label: "Overview", icon: BookOpen },
            { id: "courses", label: "My Courses", icon: Award },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all relative ${
                activeTab === tab.id
                  ? "text-indigo-600"
                  : "text-gray-600 hover:text-indigo-500"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome Back, {user?.name?.split(" ")[0]}!</h2>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Personal Info Card */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-indigo-600" />
                    Personal Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-3 border-b border-indigo-200">
                      <span className="text-gray-600">Full Name</span>
                      <span className="font-semibold text-gray-800">{user?.name}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-indigo-200">
                      <span className="text-gray-600">Email Address</span>
                      <span className="font-semibold text-gray-800">{user?.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Member Since</span>
                      <span className="font-semibold text-gray-800">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Activity Card */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-green-600" />
                    Learning Activity
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600 font-medium">This Week</span>
                        <span className="text-sm text-green-600 font-bold">4.5 hours</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500" style={{ width: "65%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600 font-medium">This Month</span>
                        <span className="text-sm text-green-600 font-bold">18.2 hours</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500" style={{ width: "85%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === "courses" && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">My Courses ({totalCourses})</h2>

              {myCourse && myCourse.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {myCourse.map((course, index) => {
                    // Construct proper image URL - if course.image is just a filename, prepend server path
                    const imageUrl = course?.image ? 
                      (course.image.startsWith('http') ? course.image : `http://localhost:2000/uploads/${course.image}`) 
                      : null;
                    
                    return (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-white to-gray-50 rounded-xl overflow-hidden border border-gray-200 hover:border-indigo-400 hover:shadow-lg transition-all duration-300"
                    >
                      {/* Course Image */}
                      <div className="relative h-40 bg-gradient-to-r from-indigo-400 to-purple-500 overflow-hidden">
                        {imageUrl && (
                          <img
                            src={imageUrl}
                            alt={course?.title}
                            className="w-full h-full object-cover opacity-90"
                          />
                        )}
                        <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          Active
                        </div>
                        <div className="absolute top-3 left-3 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                          {course?.category || "Course"}
                        </div>
                      </div>

                      {/* Course Info */}
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{course?.title}</h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course?.description}</p>

                        {/* Course Stats */}
                        <div className="grid grid-cols-2 gap-3 mb-4 text-center text-sm">
                          <div className="bg-blue-50 rounded-lg p-2">
                            <p className="text-blue-600 font-bold">${course?.price || "Free"}</p>
                            <p className="text-gray-600 text-xs">Price</p>
                          </div>
                          <div className="bg-green-50 rounded-lg p-2">
                            <p className="text-green-600 font-bold">Full Access</p>
                            <p className="text-gray-600 text-xs">Status</p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-semibold text-gray-600">Progress</span>
                            <span className="text-xs font-bold text-indigo-600">65%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-indigo-400 to-purple-500" style={{ width: "65%" }}></div>
                          </div>
                        </div>

                        {/* Instructor Info */}
                        <div className="flex items-center gap-2 py-3 border-t border-gray-200">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                            {course?.createdBy?.name?.charAt(0) || "I"}
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-600">Instructor</p>
                            <p className="text-sm font-semibold text-gray-800">{course?.createdBy?.name || "Unknown"}</p>
                          </div>
                        </div>

                        {/* Action Button */}
                        <button 
                          onClick={() => navigate(`/lectures/${course._id}`)}
                          className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          View Lectures
                        </button>
                      </div>
                    </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg mb-4">No courses enrolled yet</p>
                  <button
                    onClick={() => navigate("/course")}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Explore Courses
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Settings</h2>

              <div className="space-y-6 max-w-2xl">
                {/* Password Change */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Change Password</h3>
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter current password"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="newPassword"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          placeholder="Enter new password"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Confirm new password"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={btnLoading}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-2.5 rounded-lg font-semibold transition-colors"
                    >
                      {btnLoading ? "Updating..." : "Update Password"}
                    </button>
                  </form>
                </div>

                {/* Preferences */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Notification Preferences</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Email Notifications", checked: true },
                      { label: "Course Updates", checked: true },
                      { label: "Marketing Emails", checked: false },
                    ].map((pref, idx) => (
                      <label key={idx} className="flex items-center gap-3 cursor-pointer p-3 hover:bg-white rounded-lg transition">
                        <input
                          type="checkbox"
                          defaultChecked={pref.checked}
                          className="w-5 h-5 rounded text-indigo-600 cursor-pointer"
                        />
                        <span className="text-gray-700 font-medium">{pref.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                  <h3 className="text-lg font-bold text-red-800 mb-4">Danger Zone</h3>
                  <button 
                    onClick={handleDeleteAccount}
                    disabled={btnLoading}
                    className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white py-2.5 rounded-lg font-semibold transition-colors"
                  >
                    {btnLoading ? "Deleting..." : "Delete Account"}
                  </button>
                  <p className="text-xs text-red-700 mt-2">This action cannot be undone.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal - Modern Design */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slideUp">
            {/* Modal Header with Gradient */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 px-6 py-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
              <div className="relative flex justify-between items-center">
                <div>
                  <h3 className="text-3xl font-bold text-white">Edit Profile</h3>
                  <p className="text-indigo-100 text-sm mt-1">Update your personal information</p>
                </div>
                <button
                  onClick={() => setShowEditProfile(false)}
                  className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleProfileSubmit} className="p-8 space-y-6">
              {/* Profile Picture Preview and Upload */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  <img
                    src={profileForm.profilePic ? URL.createObjectURL(profileForm.profilePic) : (user?.profilePic || "https://via.placeholder.com/120")}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-indigo-200 shadow-lg"
                  />
                  <label className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full cursor-pointer transition-colors shadow-lg">
                    <Edit2 className="w-4 h-4" />
                    <input
                      type="file"
                      name="profilePic"
                      onChange={handleProfileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-center">
                  <p className="text-sm text-gray-600 mb-1">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </p>
              </div>

              {/* Name Field */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-indigo-600 transition-colors">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input
                    type="text"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 focus:bg-indigo-50/30 transition-all"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-indigo-600 transition-colors">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 focus:bg-indigo-50/30 transition-all"
                  />
                </div>
              </div>

              {/* Profile Picture Upload Info */}
              {profileForm.profilePic && (
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-700 font-medium">
                    ✓ New image selected: <span className="font-semibold">{profileForm.profilePic.name}</span>
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowEditProfile(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={btnLoading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                >
                  {btnLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
