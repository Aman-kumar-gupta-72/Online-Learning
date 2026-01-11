import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../Config/Api";

const CourseContext = createContext(null);

export const CourseContextProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [myCourse, setMyCourse] = useState([]);
  const [enrollLoading, setEnrollLoading] = useState({});
  const [currentToken, setCurrentToken] = useState(localStorage.getItem("token"));

  async function fetchCourses() {
    try {
      const { data } = await axios.get(`https://your-backend.onrender.com/api/course/all`);
      console.log("📚 ALL COURSES FETCHED:", data.courses.length);
      setCourses(data.courses);
    } catch (error) {
      console.log("❌ Error fetching courses:", error);
    }
  }

  async function fetchMyCourse() {
    const token = localStorage.getItem("token");

    // If no token, clear myCourse and return
    if (!token) {
      console.log("🔓 NO TOKEN - CLEARING MY COURSES");
      setMyCourse([]);
      return;
    }

    try {
      const { data } = await axios.get(`https://your-backend.onrender.com/api/mycourse`, {
        headers: {
          token: token,
        },
      });
      console.log("✅ MY COURSES FETCHED:", {
        count: data.courses?.length,
        courses: data.courses?.map((c) => ({ id: c._id, title: c.title })),
      });
      setMyCourse(data.courses);
    } catch (error) {
      console.log("❌ Error fetching my courses:", error);
      setMyCourse([]); // Clear myCourse on error
    }
  }

  async function enrollCourse(courseId) {
    setEnrollLoading((prev) => ({ ...prev, [courseId]: true }));
    try {
      console.log("📝 ENROLLING IN COURSE:", {
        courseId,
        token: localStorage.getItem("token") ? "exists" : "missing",
      });

      const { data } = await axios.post(
        `https://your-backend.onrender.com/api/course/${courseId}/enroll`,
        {},
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      console.log("✅ ENROLLMENT RESPONSE:", data);
      toast.success(data.message || "Successfully enrolled!");

      // Refresh both the user's enrolled courses AND all courses
      console.log("🔄 FETCHING UPDATED DATA...");
      await Promise.all([fetchMyCourse(), fetchCourses()]);

      console.log("✅ DATA UPDATED - CLEARING LOADING STATE");
      setEnrollLoading((prev) => ({ ...prev, [courseId]: false }));
      return true;
    } catch (error) {
      console.error(
        "❌ ENROLLMENT ERROR:",
        error.response?.data || error.message
      );
      setEnrollLoading((prev) => ({ ...prev, [courseId]: false }));
      toast.error(error.response?.data?.message || "Enrollment failed");
      return false;
    }
  }

  // Fetch courses on mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Fetch user's enrolled courses when token changes (user logs in/out)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token !== currentToken) {
      console.log("🔑 TOKEN CHANGED - REFRESHING MY COURSES:", {
        oldToken: currentToken ? "exists" : "none",
        newToken: token ? "exists" : "none",
      });
      setCurrentToken(token);
      fetchMyCourse();
    }
  }, [currentToken]);

  // Also check for token changes periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token !== currentToken) {
        console.log("🔑 TOKEN CHANGED (INTERVAL) - REFRESHING MY COURSES");
        setCurrentToken(token);
        fetchMyCourse();
      }
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [currentToken]);

  return (
    <CourseContext.Provider
      value={{
        courses,
        fetchCourses,
        myCourse,
        enrollCourse,
        enrollLoading,
        fetchMyCourse,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const CourseData = () => {
  const context = useContext(CourseContext);
  if (!context) {
    return { courses: [] };
  }
  return context;
};
