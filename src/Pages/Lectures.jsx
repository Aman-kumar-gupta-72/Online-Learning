import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { UserData } from "../Context/UserContext";
import { useLecture } from "../Context/LectureContext";
import { CourseData } from "../Context/CourseContext";
import { Play, Plus, Trash2, Clock, User as UserIcon, FileText } from "lucide-react";

export default function LecturesPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, isAuth } = UserData();
  const { courses, myCourse } = CourseData();
  const { lectures, lectureLoading, addingLecture, fetchLectures, addLecture, deleteLecture } = useLecture();

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    video: null,
  });

  const course = courses.find((c) => c._id === courseId);
  const isEnrolled = myCourse.some((c) => c._id === courseId);
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!courseId) return;
    fetchLectures(courseId);
  }, [courseId]);

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Please log in to view lectures</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!isEnrolled && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">You are not enrolled in this course</p>
          <button
            onClick={() => navigate("/course")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Explore Courses
          </button>
        </div>
      </div>
    );
  }

  const handleAddLecture = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.video) {
      alert("Please fill all required fields");
      return;
    }

    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("file", formData.video);

    const success = await addLecture(courseId, form);
    if (success) {
      setFormData({ title: "", description: "", video: null });
      setShowAddForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white p-8 shadow-xl">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate("/course")}
            className="mb-4 text-indigo-100 hover:text-white transition flex items-center gap-2"
          >
            ← Back to Courses
          </button>
          <h1 className="text-4xl font-bold">{course?.title || "Course"}</h1>
          <p className="text-indigo-100 mt-2">{course?.description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Add Lecture Button (Admin Only) */}
        {isAdmin && (
          <div className="mb-8 flex justify-between items-center">
            <h2 className="text-3xl font-bold text-gray-800">Course Lectures</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add Lecture
            </button>
          </div>
        )}

        {/* Add Lecture Form (Admin Only) */}
        {isAdmin && showAddForm && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Add New Lecture</h3>
            <form onSubmit={handleAddLecture} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Lecture Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter lecture title"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter lecture description"
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Upload Video *
                </label>
                <input
                  type="file"
                  required
                  accept="video/*"
                  onChange={(e) => setFormData({ ...formData, video: e.target.files[0] })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {formData.video && (
                  <p className="text-sm text-green-600 mt-2">✓ File selected: {formData.video.name}</p>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={addingLecture}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addingLecture ? "Adding Lecture..." : "Add Lecture"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lectures List */}
        <div>
          {lectureLoading ? (
            <div className="text-center py-12">
              <div className="inline-block">
                <div className="w-12 h-12 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-600 mt-4 font-semibold">Loading lectures...</p>
            </div>
          ) : lectures && lectures.length > 0 ? (
            <div className="grid gap-6">
              {lectures.map((lecture, index) => (
                <div
                  key={lecture._id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-200 overflow-hidden group"
                >
                  <div className="p-6 flex items-start gap-6">
                    {/* Lecture Number & Play Icon */}
                    <div className="shrink-0">
                      <div className="w-16 h-16 bg-linear-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition">
                        <Play className="w-6 h-6" fill="currentColor" />
                      </div>
                    </div>

                    {/* Lecture Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">
                            Lecture {index + 1}: {lecture.title}
                          </h3>
                          {lecture.description && (
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                              {lecture.description}
                            </p>
                          )}
                        </div>
                        {isAdmin && (
                          <button
                            onClick={() => {
                              if (window.confirm("Delete this lecture?")) {
                                deleteLecture(lecture._id, courseId);
                              }
                            }}
                            className="shrink-0 ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>

                      {/* Lecture Meta */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        {lecture.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {lecture.duration} mins
                          </div>
                        )}
                        {lecture.createdBy?.name && (
                          <div className="flex items-center gap-1">
                            <UserIcon className="w-4 h-4" />
                            By {lecture.createdBy.name}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          Video Uploaded
                        </div>
                      </div>
                    </div>

                    {/* Watch Button */}
                    <button 
                      onClick={() => setSelectedLecture(lecture)}
                      className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" fill="currentColor" />
                      Watch Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-4">No lectures yet</p>
              {isAdmin && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add First Lecture
                </button>
              )}
            </div>
          )}
        </div>

        {/* Video Player Modal */}
        {selectedLecture && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
              {/* Modal Header */}
              <div className="flex justify-between items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 sticky top-0">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{selectedLecture.title}</h2>
                  <p className="text-indigo-100 text-sm mt-1">Lecture - {selectedLecture.description || "No description"}</p>
                </div>
                <button
                  onClick={() => setSelectedLecture(null)}
                  className="text-2xl hover:bg-white/20 p-2 rounded transition"
                >
                  ✕
                </button>
              </div>

              {/* Video Player */}
              <div className="bg-black aspect-video w-full flex items-center justify-center">
                <video
                  controls
                  autoPlay
                  className="w-full h-full"
                  key={selectedLecture._id}
                >
                  <source
                    src={`http://localhost:2000/${selectedLecture.video}`}
                    type="video/mp4"
                  />
                  <source
                    src={`http://localhost:2000/${selectedLecture.video}`}
                    type="video/webm"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Lecture Details */}
              <div className="p-8 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">About This Lecture</h3>
                  <p className="text-gray-600">
                    {selectedLecture.description || "No description provided for this lecture"}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedLecture.duration && (
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="text-lg font-semibold text-indigo-600">{selectedLecture.duration} mins</p>
                    </div>
                  )}
                  {selectedLecture.createdBy?.name && (
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Instructor</p>
                      <p className="text-lg font-semibold text-purple-600">{selectedLecture.createdBy.name}</p>
                    </div>
                  )}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Upload Date</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {new Date(selectedLecture.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="p-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setSelectedLecture(null)}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
