import axios from "axios";
import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import API from "../Config/Api";

const LectureContext = createContext(null);

export const LectureContextProvider = ({ children }) => {
  const [lectures, setLectures] = useState([]);
  const [lectureLoading, setLectureLoading] = useState(false);
  const [addingLecture, setAddingLecture] = useState(false);

  async function fetchLectures(courseId) {
    setLectureLoading(true);
    try {
      const { data } = await axios.get("/api/lecture/${courseId}", {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setLectures(data.lecture || []);
      setLectureLoading(false);
      return data.lecture || [];
    } catch (error) {
      setLectureLoading(false);
      console.log("Error fetching lectures:", error);
      toast.error("Failed to fetch lectures");
      return [];
    }
  }

  async function addLecture(courseId, formData) {
    setAddingLecture(true);
    try {
      const { data } = await axios.post(
        `${API}/api/course/${courseId}`,
        formData,
        {
          headers: {
            token: localStorage.getItem("token"),
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(data.message || "Lecture added successfully!");
      await fetchLectures(courseId);
      setAddingLecture(false);
      return true;
    } catch (error) {
      setAddingLecture(false);
      toast.error(error.response?.data?.message || "Failed to add lecture");
      return false;
    }
  }

  async function deleteLecture(lectureId, courseId) {
    try {
      const { data } = await axios.delete(
        `${API}/api/lecture/${lectureId}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      toast.success("Lecture deleted successfully");
      await fetchLectures(courseId);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete lecture");
      return false;
    }
  }

  return (
    <LectureContext.Provider
      value={{
        lectures,
        lectureLoading,
        addingLecture,
        fetchLectures,
        addLecture,
        deleteLecture,
      }}
    >
      {children}
    </LectureContext.Provider>
  );
};

export const useLecture = () => {
  const context = useContext(LectureContext);
  if (!context) {
    throw new Error("useLecture must be used within LectureContextProvider");
  }
  return context;
};
