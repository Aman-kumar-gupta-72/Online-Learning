import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router";
import { UserData } from "../Context/UserContext";

const Login = () => {
  const navigate = useNavigate();
  const { btnLoading, loginUser } = UserData();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    await loginUser(email, password, navigate);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 p-4">
      <div className="w-full max-w-md bg-white/40 backdrop-blur-xl shadow-xl rounded-3xl p-8 border border-white/30">

        <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">
          Welcome Back 👋
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Login to continue your journey!
        </p>

        {/* FORM START */}
        <form onSubmit={submitHandler}>

          {/* Email */}
          <div className="mb-5">
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow">
              <Mail className="text-blue-600" size={20} />
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
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow">
              <Lock className="text-blue-600" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full outline-none bg-transparent"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-sm text-blue-600 hover:underline"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={btnLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg font-semibold shadow-lg transition-all duration-300"
          >
            {btnLoading ? "waitin...." : "Login"}
          </button>

        </form>
        {/* FORM END */}

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-1 border-gray-300" />
          <span className="px-4 text-gray-500">or</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Signup Link */}
        <p className="text-center text-gray-700">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-800 font-semibold hover:underline">
            Create account
          </a>
        </p>

      </div>
    </div>
  );
};

export default Login;

