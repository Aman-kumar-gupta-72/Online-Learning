import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { UserData } from "../Context/UserContext";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Plus,
  Trash2,
  Edit2,
  Users,
  BookOpen,
  BarChart3,
  LogOut,
  Search,
  ChevronDown,
  Eye,
  EyeOff,
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, isAuth, logoutUser, loading: userLoading, fetchUser } = UserData();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Add Course Form
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [courseForm, setCourseForm] = useState({
    title: "",
    category: "",
    description: "",
    price: "",
    instructorName: "",
    image: null,
  });

  useEffect(() => {
    // Wait for user data to load
    if (userLoading) return;

    console.log("Admin Dashboard - User:", user);
    console.log("Admin Dashboard - isAuth:", isAuth);
    console.log("Admin Dashboard - User Role:", user?.role);

    // Check auth and admin role
    if (!isAuth) {
      console.log("Not authenticated, redirecting to login");
      navigate("/login");
      return;
    }

    if (user?.role !== "admin") {
      console.log("User is not admin, redirecting to home");
      navigate("/");
      return;
    }

    console.log("User is admin, loading dashboard");
    fetchCourses();
    fetchUsers();
  }, [isAuth, user, userLoading, navigate]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:2000/api/course/all");
      setCourses(data.courses || []);
    } catch (error) {
      toast.error("Failed to fetch courses");
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("http://localhost:2000/api/users", {
        headers: { token: localStorage.getItem("token") },
      });
      setUsers(data.users || []);
    } catch (error) {
      console.log("Users fetch not yet implemented on backend");
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!courseForm.title || !courseForm.category || !courseForm.description || !courseForm.price || !courseForm.instructorName) {
      toast.error("Fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", courseForm.title);
    formData.append("category", courseForm.category);
    formData.append("description", courseForm.description);
    formData.append("price", courseForm.price);
    formData.append("instructorName", courseForm.instructorName);
    formData.append("createdBy", user?.name);
    if (courseForm.image) {
      formData.append("file", courseForm.image);
    }

    try {
      const { data } = await axios.post(
        "http://localhost:2000/api/course/me",
        formData,
        {
          headers: {
            token: localStorage.getItem("token"),
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Course created successfully!");
      setCourseForm({ title: "", category: "", description: "", price: "", instructorName: "", image: null });
      setShowAddCourse(false);
      fetchCourses();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create course");
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Delete this course? This will remove all lectures too.")) return;

    try {
      await axios.delete(`http://localhost:2000/api/course/${courseId}`, {
        headers: { token: localStorage.getItem("token") },
      });
      toast.success("Course deleted!");
      fetchCourses();
    } catch (error) {
      toast.error("Failed to delete course");
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Delete user account: ${userName}? This action cannot be undone.`)) return;

    try {
      const { data } = await axios.delete("http://localhost:2000/api/user/delete-user", {
        headers: { token: localStorage.getItem("token") },
        data: { userId },
      });
      toast.success(data.message || "User deleted successfully!");
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  // Filter courses based on search
  const filteredCourses = courses.filter((course) =>
    course.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats
  const totalCourses = courses.length;
  const totalStudents = users.length;
  const totalRevenue = courses.reduce((sum, course) => sum + (parseInt(course.price) || 0), 0);

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className={`bg-white rounded-xl p-6 shadow-lg border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        <Icon className="w-12 h-12 opacity-20" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Show loading state while checking admin status */}
      {userLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-semibold">Loading admin dashboard...</p>
          </div>
        </div>
      ) : (
        <>
      {/* Header */}
      <div className="bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white p-6 shadow-xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <p className="text-indigo-100 mt-1">Welcome, {user?.name} 👋</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchUser}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition flex items-center gap-2"
              title="Refresh user data from database"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <button
              onClick={() => logoutUser(navigate)}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 bg-white rounded-xl shadow-lg p-4 overflow-x-auto">
          {[
            { id: "dashboard", label: "Dashboard", icon: BarChart3 },
            { id: "courses", label: "Manage Courses", icon: BookOpen },
            { id: "users", label: "Manage Users", icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                icon={BookOpen}
                label="Total Courses"
                value={totalCourses}
                color="border-blue-400"
              />
              <StatCard
                icon={Users}
                label="Total Students"
                value={totalStudents}
                color="border-green-400"
              />
              <StatCard
                icon={BarChart3}
                label="Total Revenue"
                value={`$${totalRevenue}`}
                color="border-purple-400"
              />
            </div>

            {/* Recent Courses */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Courses</h2>
              {courses.slice(0, 5).length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Created
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.slice(0, 5).map((course) => (
                        <tr key={course._id} className="border-b hover:bg-gray-50 transition">
                          <td className="px-6 py-4 text-gray-800 font-medium">{course.title}</td>
                          <td className="px-6 py-4 text-gray-600">{course.category}</td>
                          <td className="px-6 py-4 text-gray-600">${course.price}</td>
                          <td className="px-6 py-4 text-gray-600 text-sm">
                            {new Date(course.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">No courses yet</p>
              )}
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === "courses" && (
          <div className="space-y-8">
            {/* Add Course Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-800">Manage Courses</h2>
              <button
                onClick={() => setShowAddCourse(!showAddCourse)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Add New Course
              </button>
            </div>

            {/* Add Course Form */}
            {showAddCourse && (
              <div className="bg-white rounded-xl shadow-lg p-8 border border-indigo-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Create New Course</h3>
                <form onSubmit={handleAddCourse} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Course Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={courseForm.title}
                        onChange={(e) =>
                          setCourseForm({ ...courseForm, title: e.target.value })
                        }
                        placeholder="Enter course title"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Category *
                      </label>
                      <input
                        type="text"
                        required
                        value={courseForm.category}
                        onChange={(e) =>
                          setCourseForm({ ...courseForm, category: e.target.value })
                        }
                        placeholder="e.g., Web Development"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Instructor Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={courseForm.instructorName}
                        onChange={(e) =>
                          setCourseForm({ ...courseForm, instructorName: e.target.value })
                        }
                        placeholder="e.g., John Doe"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      required
                      value={courseForm.description}
                      onChange={(e) =>
                        setCourseForm({ ...courseForm, description: e.target.value })
                      }
                      placeholder="Course description"
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Price ($) *
                      </label>
                      <input
                        type="number"
                        required
                        value={courseForm.price}
                        onChange={(e) =>
                          setCourseForm({ ...courseForm, price: e.target.value })
                        }
                        placeholder="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Course Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setCourseForm({ ...courseForm, image: e.target.files[0] })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      {courseForm.image && (
                        <p className="text-sm text-green-600 mt-2">✓ {courseForm.image.name}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition"
                    >
                      Create Course
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddCourse(false)}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-lg font-semibold transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Search Courses */}
            <div className="relative">
              <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Courses List */}
            <div className="grid gap-6">
              {loading ? (
                <p className="text-center text-gray-600 py-8">Loading courses...</p>
              ) : filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <div
                    key={course._id}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition border border-gray-200"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h3>
                        <p className="text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                            {course.category}
                          </span>
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                            ${course.price}
                          </span>
                          <span className="text-gray-500">
                            Created {new Date(course.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-3 w-full md:w-auto">
                        <button
                          onClick={() => navigate(`/lectures/${course._id}`)}
                          className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                        >
                          <BookOpen className="w-4 h-4" />
                          Lectures
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course._id)}
                          className="flex-1 md:flex-none bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No courses found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800">Manage Users</h2>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">User Access Control</h3>

              <div className="space-y-4">
                <div className="p-6 bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <h4 className="font-bold text-gray-800 mb-2">📊 User Management Features</h4>
                  <ul className="text-gray-700 space-y-2 text-sm">
                    <li>✓ View all registered students and their enrollment status</li>
                    <li>✓ Grant/revoke course access for specific users</li>
                    <li>✓ Monitor student progress and activity</li>
                    <li>✓ Manage user roles and permissions</li>
                    <li>✓ View detailed user profiles and enrollment history</li>
                  </ul>
                </div>

                {users.length > 0 ? (
                  <div className="overflow-x-auto mt-6">
                    <table className="w-full">
                      <thead className="bg-gray-100 border-b">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                            Joined
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u._id} className="border-b hover:bg-gray-50 transition">
                            <td className="px-6 py-4 text-gray-800 font-medium">{u.name}</td>
                            <td className="px-6 py-4 text-gray-600">{u.email}</td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                  u.role === "admin"
                                    ? "bg-red-100 text-red-700"
                                    : u.role === "instructor"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-green-100 text-green-700"
                                }`}
                              >
                                {u.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-600 text-sm">
                              {new Date(u.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => handleDeleteUser(u._id, u.name)}
                                className="text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-2 rounded transition flex items-center gap-1"
                                title="Delete user"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-gray-600 py-8">No users to manage yet</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
        </>
      )}
    </div>
  );
}
