import React from "react";
import { CourseData } from "../Context/CourseContext";
import { useNavigate } from "react-router-dom";
import { UserData } from "../Context/UserContext";
import { BookOpen, Clock, Star, Play, AlertCircle } from "lucide-react";

export default function MyCourse() {
  const navigate = useNavigate();
  const { myCourse } = CourseData();
  const { isAuth } = UserData();

  React.useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  }, [isAuth, navigate]);

  const handleStartCourse = (courseId) => {
    navigate(`/lectures/${courseId}`);
  };

  return (
    <div className="w-full relative">
      {/* Top Banner */}
      <section className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            My Courses
          </h1>
          <p className="text-blue-100 text-lg">
            {myCourse?.length || 0} course{myCourse?.length !== 1 ? "s" : ""} enrolled
          </p>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {myCourse && myCourse.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {myCourse.map((course) => {
                // Construct proper image URL - if course.image is just a filename, prepend server path
                const imageUrl = course.image ? 
                  (course.image.startsWith('http') ? course.image : `http://localhost:2000/uploads/${course.image}`) 
                  : "https://via.placeholder.com/400x300";
                
                return (
                <div
                  key={course._id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
                >
                  {/* Course Image */}
                  <div className="relative overflow-hidden bg-gray-200 h-48">
                    <img
                      src={imageUrl}
                      alt={course.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Enrolled
                    </div>
                  </div>

                  {/* Course Info */}
                  <div className="p-6">
                    <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2">
                      {course.title || "Course Title"}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {course.description || "Learn more about this course"}
                    </p>

                    {/* Instructor */}
                    <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                      <BookOpen size={16} />
                      <span>{course.instructor || "Expert Instructor"}</span>
                    </div>

                    {/* Rating & Duration */}
                    <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Star size={16} className="text-yellow-400" fill="currentColor" />
                        <span>{course.rating || "4.5"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>{course.duration || "40h"}</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <p className="text-2xl font-bold text-blue-600">
                        ${course.price}
                      </p>
                    </div>

                    {/* Enrollment Info */}
                    <div className="text-sm text-gray-600 mb-4">
                      {course.enrolledAt && (
                        <p>
                          Enrolled:{" "}
                          <span className="font-semibold">
                            {new Date(course.enrolledAt).toLocaleDateString()}
                          </span>
                        </p>
                      )}
                      {course.paymentStatus && (
                        <p>
                          Status:{" "}
                          <span className={`font-semibold ${
                            course.paymentStatus === "completed"
                              ? "text-green-600"
                              : "text-yellow-600"
                          }`}>
                            {course.paymentStatus}
                          </span>
                        </p>
                      )}
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => handleStartCourse(course._id)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Play size={16} />
                      Continue Learning
                    </button>
                  </div>
                </div>
              );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No Courses Yet
              </h2>
              <p className="text-gray-600 mb-6">
                You haven't enrolled in any courses yet. Explore our courses and
                start learning!
              </p>
              <button
                onClick={() => navigate("/course")}
                className="bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Browse Courses
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
