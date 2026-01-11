import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loginUser(email, password, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:2000/api/user/login",
        { email, password }
      );
        console.log("🔐 LOGIN API RESPONSE:", data);
        console.log("👤 USER DATA FROM API:", data.user);
        console.log("👑 USER ROLE FROM API:", data.user?.role);
        toast.success(data.message);
      localStorage.setItem("token", data.token);
      setUser(data.user);
      console.log("✅ USER STORED IN CONTEXT:", data.user);
      setIsAuth(true);
      setBtnLoading(false);
      // Redirect to admin dashboard if user is admin, otherwise to home
      if (data.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      setIsAuth(false);
      setBtnLoading(false);
      toast.error(error.response?.data?.message || "Login failed");
    }
  }
  async function registerUser(name, email, password, profilePic, navigate) {
    setBtnLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      if (profilePic) {
        formData.append("file", profilePic);
      }

      const { data } = await axios.post(
        "http://localhost:2000/api/user/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("API RESPONSE:", data);
      toast.success(data.message);
      localStorage.setItem("activationToken", data.activationToken);
      setBtnLoading(false);
      navigate("/otp");
    } catch (error) {
      setBtnLoading(false);
      toast.error(error.response?.data?.message || "Registration failed");
    }
  }
 const verify = async (otp) => {
  setBtnLoading(true);

  try {
    const activationToken = localStorage.getItem("activationToken");

    const { data } = await axios.post(
      "http://localhost:2000/api/user/verify",
      { otp, activationToken }
    );

    return data;   // COMPONENT WILL HANDLE NAVIGATION
  } catch (error) {
    throw error;
  } finally {
    setBtnLoading(false);
  }
};

const resendOtp = async () => {
  setBtnLoading(true);

  try {
    const activationToken = localStorage.getItem("activationToken");

    if (!activationToken) {
      toast.error("Activation token not found. Please register again.");
      return;
    }

    const { data } = await axios.post(
      "http://localhost:2000/api/user/resend-otp",
      { activationToken }
    );

    localStorage.setItem("activationToken", data.activationToken);
    toast.success(data.message);
    return true;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to resend OTP");
    return false;
  } finally {
    setBtnLoading(false);
  }
};

 async function fetchUser() {
  setLoading(true);

  try {
    const { data } = await axios.get(
      `${API}/api/user/me`,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
        withCredentials: true,
      }
    );

    console.log("🔄 FETCH USER API RESPONSE:", data);
    console.log("👤 USER FROM /me ENDPOINT:", data.user);
    console.log("👑 ROLE FROM /me ENDPOINT:", data.user?.role);
    setUser(data.user);
    console.log("✅ USER STORED FROM /me:", data.user);
    setIsAuth(true);

  } catch (error) {
    console.log("❌ ME API ERROR:", error);
    setIsAuth(false);
  } finally {
    setLoading(false);
  }
}



  useEffect(() => {
    fetchUser();
  }, []);   // important!!


  async function logoutUser(navigate) {
  localStorage.removeItem("token");
  setUser({});
  setIsAuth(false);
  toast.success("Logged out successfully");
  navigate("/login");
}

  async function updatePassword(currentPassword, newPassword) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(
        `${API}/api/user/update-password`,
        { currentPassword, newPassword },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      toast.success(data.message || "Password updated successfully");
      setBtnLoading(false);
      return true;
    } catch (error) {
      setBtnLoading(false);
      toast.error(error.response?.data?.message || "Failed to update password");
      return false;
    }
  }

  async function deleteAccount(navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.delete(
        `${API}/api/user/delete-account`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      toast.success(data.message || "Account deleted successfully");
      localStorage.removeItem("token");
      setUser({});
      setIsAuth(false);
      setBtnLoading(false);
      navigate("/");
      return true;
    } catch (error) {
      setBtnLoading(false);
      toast.error(error.response?.data?.message || "Failed to delete account");
      return false;
    }
  }

  async function updateProfile(name, email, profilePic) {
    setBtnLoading(true);
    try {
      const formData = new FormData();
      if (name) formData.append("name", name);
      if (email) formData.append("email", email);
      if (profilePic) formData.append("file", profilePic);

      const { data } = await axios.put(
        `${API}/api/user/update-profile`,
        formData,
        {
          headers: {
            token: localStorage.getItem("token"),
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(data.message || "Profile updated successfully");
      setUser(data.user);
      setBtnLoading(false);
      return true;
    } catch (error) {
      setBtnLoading(false);
      toast.error(error.response?.data?.message || "Failed to update profile");
      return false;
    }
  }


  return (
    <UserContext.Provider
      value={{
         user,
         setUser,
        setIsAuth, 
        isAuth, 
        loginUser, 
        btnLoading,
        loading ,
        logoutUser,
        registerUser,
        verify,
        resendOtp,
        fetchUser,
        updatePassword,
        updateProfile,
        deleteAccount
        }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);
