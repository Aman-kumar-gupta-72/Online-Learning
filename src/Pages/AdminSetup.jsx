import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import { Shield, Lock, Mail, User, ArrowRight } from "lucide-react";
import { API } from "../main";

//admin registration karne ke liye component

export default function AdminSetup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("form"); // form or otp
  const [activationToken, setActivationToken] = useState("");
  const [otp, setOtp] = useState("");
  const [adminData, setAdminData] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/api/user/create-admin`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      toast.success("OTP sent to your email!");
      setActivationToken(data.activationToken);
      setAdminData(formData);
      setStep("otp");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create admin account");
    }
    setLoading(false);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    if (!otp || otp.length === 0) {
      toast.error("Please enter the OTP");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/api/user/verify`, {
        otp: parseInt(otp),
        activationToken,
      });

      toast.success("Admin account created successfully!");
      setOtp("");
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
      
      // Redirect to login after 2 seconds 
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to verify OTP");
    }
    setLoading(false);
  };

  if (step === "otp") {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-indigo-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block bg-green-600 p-4 rounded-full mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Verify Email</h1>
            <p className="text-gray-600 mt-2">We sent an OTP to {adminData.email}</p>
          </div>

          {/* OTP Form */}
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="0000"
                maxLength="4"
                className="w-full px-4 py-4 text-center text-3xl tracking-widest border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 transition"
              />
              <p className="text-xs text-gray-500 mt-2 text-center">4-digit code</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition duration-200 flex items-center justify-center gap-2"
            >
              {loading ? "Verifying..." : "Verify & Create Admin"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700 font-semibold">💡 Check your email</p>
            <p className="text-sm text-blue-600 mt-1">
              The OTP has been sent to your email. Check spam folder if you don't see it.
            </p>
          </div>

          {/* Go Back */}
          <button
            onClick={() => {
              setStep("form");
              setOtp("");
            }}
            className="w-full mt-4 text-indigo-600 hover:text-indigo-700 font-semibold text-sm"
          >
            ← Back to form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-indigo-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-indigo-600 p-4 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Create Admin</h1>
          <p className="text-gray-600 mt-2">Set up your first admin account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <User className="inline w-4 h-4 mr-1" />
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Mail className="inline w-4 h-4 mr-1" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Lock className="inline w-4 h-4 mr-1" />
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Lock className="inline w-4 h-4 mr-1" />
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition duration-200 flex items-center justify-center gap-2"
          >
            <Shield className="w-5 h-5" />
            {loading ? "Creating Admin..." : "Create Admin Account"}
          </button>
        </form>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700 font-semibold">ℹ️ Important:</p>
          <p className="text-sm text-blue-600 mt-1">
            You'll receive an OTP via email. Use it to verify and complete admin account creation.
          </p>
        </div>

        {/* Already Logged In */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Need to log in? <a href="/login" className="text-indigo-600 font-semibold hover:underline">Go to Login</a>
        </p>
      </div>
    </div>
  );
}
