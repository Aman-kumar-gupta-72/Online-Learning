import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { UserData } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Otp = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const { btnLoading, verify } = UserData();
  const navigate = useNavigate();

  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 2}`); 
        // because ids are otp-1, otp-2, otp-3, otp-4
        nextInput?.focus();
      }
    }
  };

  const SubmitHandler = async (e) => {
  e.preventDefault();

  const code = otp.join("");

  try {
    const data = await verify(code);   // Call context function
    toast.success(data.message);

    localStorage.removeItem("activationToken");
    navigate("/login");                // ✔ valid here
  } catch (error) {
    toast.error(error.response?.data?.message || "OTP Wrong");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-orange-200 to-red-300 p-4">
      <div className="w-full max-w-md bg-white/40 backdrop-blur-xl shadow-xl rounded-3xl p-8 border border-white/30">
        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-orange-800 mb-4">
          OTP Verification 🔐
        </h2>
        <p className="text-center text-gray-700 mb-8">
          Enter the 4-digit OTP sent to your email or phone.
        </p>

        <form onSubmit={SubmitHandler}>
          {/* OTP Inputs */}
          <div className="flex justify-center gap-4 mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index + 1}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                className="w-14 h-14 text-center text-2xl font-bold bg-white shadow-md rounded-2xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            ))}
          </div>

          {/* Verify Button inside form ✅ */}
          <button
            type="submit"
            disabled={btnLoading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl text-lg font-semibold shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <ShieldCheck size={20} /> {btnLoading ? "Please Wait" : "Verify"}
          </button>
        </form>

        {/* Resend OTP */}
        <p className="text-center text-gray-700 mt-6">
          Didn’t receive code?{" "}
          <button className="text-orange-800 font-semibold hover:underline">
            Resend OTP
          </button>
        </p>
      </div>
    </div>
  );
};

export default Otp;
