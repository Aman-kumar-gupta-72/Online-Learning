import { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import { useNavigate } from "react-router";
import { UserData } from "../Context/UserContext";
import toast from "react-hot-toast";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const navigate = useNavigate();
  const { btnLoading, registerUser } = UserData();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !cPassword) {
      return toast.error("All fields are required");
    }

    if (password !== cPassword) {
      return toast.error("Passwords do not match");
    }

    await registerUser(name, email, password, profilePic, navigate);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-200 to-indigo-300 p-4">
      <div className="w-full max-w-md bg-white/40 backdrop-blur-xl shadow-xl rounded-3xl p-8 border border-white/30">
        <h2 className="text-3xl font-bold text-center text-purple-800 mb-6">
          Create Account 🎉
        </h2>
        <p className="text-center text-gray-700 mb-8">
          Join us and start your amazing journey!
        </p>

        <form onSubmit={submitHandler}>
          {/* Profile Picture */}
        <div className="mb-5">
          <label className="block text-gray-700 font-semibold mb-2">
            Profile Picture (Optional)
          </label>
          <div className="flex flex-col items-center gap-3">
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover border-4 border-purple-600"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-700
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-xl file:border-0
                  file:text-sm file:font-semibold
                  file:bg-purple-600 file:text-white
                  hover:file:bg-purple-700"
            />
          </div>
        </div>

        {/* Name */}
        <div className="mb-5">
          <label className="block text-gray-700 font-semibold mb-2">
            Full Name
          </label>
          <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow">
            <User className="text-purple-600" size={20} />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-gray-700 font-semibold mb-2">
            Email
          </label>
          <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow">
            <Mail className="text-purple-600" size={20} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-5">
          <label className="block text-gray-700 font-semibold mb-2">
            Password
          </label>
          <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow">
            <Lock className="text-purple-600" size={20} />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="Enter Strong password "
              className="w-full outline-none bg-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-sm text-purple-600 hover:underline"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Confirm Password
          </label>
          <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow">
            <Lock className="text-purple-600" size={20} />
            <input
              type={showCPassword ? "text" : "password"}
              value={cPassword}
              onChange={(e) => setCPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full outline-none bg-transparent"
            />
            <button
              type="button"
              onClick={() => setShowCPassword(!showCPassword)}
              className="text-sm text-purple-600 hover:underline"
            >
              {showCPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* ✅ Button inside form */}
        <button
          type="submit"
          disabled={btnLoading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl text-lg font-semibold shadow-lg transition-all duration-300"
        >
          {btnLoading ? "Waiting..." : "Signup"}
        </button>
        </form>

        {/* Divider */}
      <div className="flex items-center my-6">
        <hr className="flex-1 border-gray-300" />
        <span className="px-4 text-gray-500">or</span>
        <hr className="flex-1 border-gray-300" />
      </div>

      {/* Login Link */}
      <p className="text-center text-gray-700">
        Already have an account?{" "}
        <a href="/login" className="text-purple-800 font-semibold hover:underline">
          Login
        </a>
      </p>
      </div>
    </div>
  );
};

export default Signup;
