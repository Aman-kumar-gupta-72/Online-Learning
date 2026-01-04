import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const CourseContext = createContext(null);

export const CourseContextProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [myCourse, setMyCourse] = useState([])
  const [enrollLoading, setEnrollLoading] = useState(false);

  async function fetchCourses() {
    try {
      const { data } = await axios.get("http://localhost:2000/api/course/all");
      console.log("API Response:", data);
      setCourses(data.courses);
    } catch (error) {
      console.log("Error fetching courses:", error);
    }
  }

  async function fetchMyCourse(){
    const token = localStorage.getItem("token");
    
    // If no token, clear myCourse and return
    if (!token) {
      setMyCourse([]);
      return;
    }
    
    try {
      const {data} = await axios.get("http://localhost:2000/api/mycourse" , {
        headers: {
          token: token
        },
      }) ;
      setMyCourse(data.courses)
    } catch (error) {
      console.log(error);
      setMyCourse([]); // Clear myCourse on error
    }
  }

  async function enrollCourse(courseId) {
    setEnrollLoading(true);
    try {
      const { data } = await axios.post(
        `http://localhost:2000/api/course/${courseId}/enroll`,
        {},
        {
          headers: {
            token: localStorage.getItem("token")
          }
        }
      );
      toast.success(data.message || "Successfully enrolled!");
      // Refresh the courses list
      await fetchMyCourse();
      setEnrollLoading(false);
      return true;
    } catch (error) {
      setEnrollLoading(false);
      toast.error(error.response?.data?.message || "Enrollment failed");
      return false;
    }
  }

  useEffect(() => {
    fetchCourses();
    fetchMyCourse();
  }, []);

  return (
    <CourseContext.Provider value={{ courses, fetchCourses, myCourse, enrollCourse, enrollLoading, fetchMyCourse }}>
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
