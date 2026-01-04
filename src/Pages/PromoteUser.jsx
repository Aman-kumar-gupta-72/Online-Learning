import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { UserData } from "../Context/UserContext";
import axios from "axios";
import toast from "react-hot-toast";
import { Users, Shield, Mail, UserCheck, Trash2 } from "lucide-react";

export default function PromoteUser() {
  const navigate = useNavigate();
  const { user, isAuth, loading: userLoading } = UserData();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [promoting, setPromoting] = useState({});

  // Redirect if not admin
  useEffect(() => {
    if (userLoading) return;
    
    if (!isAuth || user?.role !== "admin") {
      navigate("/login");
    }
  }, [isAuth, user, userLoading, navigate]);

  // Fetch all users
  useEffect(() => {
    if (!isAuth || user?.role !== "admin") return;

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("http://localhost:2000/api/users", {
          headers: { token: localStorage.getItem("token") },
        });
        setUsers(data.users || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch users");
      }
      setLoading(false);
    };

    fetchUsers();
  }, [isAuth, user]);

  const handlePromote = async (email) => {
    if (promoting[email]) return;

    setPromoting({ ...promoting, [email]: true });
    try {
      const { data } = await axios.post(
        "http://localhost:2000/api/user/promote",
        { email },
        { headers: { token: localStorage.getItem("token") } }
      );
      toast.success(data.message);
      
      // Update local state
      setUsers(
        users.map((u) =>
          u.email === email ? { ...u, role: "admin" } : u
        )
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to promote user");
    }
    setPromoting({ ...promoting, [email]: false });
  };

  const handleDemote = async (email) => {
    if (promoting[email]) return;

    setPromoting({ ...promoting, [email]: true });
    try {
      const { data } = await axios.post(
        "http://localhost:2000/api/user/demote",
        { email },
        { headers: { token: localStorage.getItem("token") } }
      );
      toast.success(data.message);
      
      // Update local state
      setUsers(
        users.map((u) =>
          u.email === email ? { ...u, role: "student" } : u
        )
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to demote user");
    }
    setPromoting({ ...promoting, [email]: false });
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (userLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-800">Manage Users</h1>
          </div>
          <p className="text-gray-600">Promote regular users to admin roles</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Users className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Name</th>
                    <th className="px-6 py-4 text-left font-semibold">Email</th>
                    <th className="px-6 py-4 text-left font-semibold">Current Role</th>
                    <th className="px-6 py-4 text-center font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((userItem) => (
                    <tr
                      key={userItem._id}
                      className="hover:bg-indigo-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-800">
                          {userItem.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4" />
                          {userItem.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            userItem.role === "admin"
                              ? "bg-indigo-100 text-indigo-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {userItem.role === "admin" ? (
                            <div className="flex items-center gap-1">
                              <Shield className="w-4 h-4" />
                              Admin
                            </div>
                          ) : (
                            userItem.role
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {userItem.role !== "admin" ? (
                          <button
                            onClick={() => handlePromote(userItem.email)}
                            disabled={promoting[userItem.email]}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                          >
                            {promoting[userItem.email] ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Promoting...
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-4 h-4" />
                                Promote
                              </>
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDemote(userItem.email)}
                            disabled={promoting[userItem.email]}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                          >
                            {promoting[userItem.email] ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Demoting...
                              </>
                            ) : (
                              <>
                                <Trash2 className="w-4 h-4" />
                                Remove Admin
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Total Users</p>
            <p className="text-3xl font-bold text-indigo-600">{users.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Admin Users</p>
            <p className="text-3xl font-bold text-purple-600">
              {users.filter((u) => u.role === "admin").length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
