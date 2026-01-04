import image from "../assets/ok.svg";
import image1 from "../assets/oy.svg";
import student from "../assets/Graphics.jpg";

import { CourseData } from "../Context/CourseContext";
import { UserData } from "../Context/UserContext";
import { useNavigate } from "react-router";
import { Star, Users, Clock, CheckCircle, Loader, Play } from "lucide-react";

export default function Course() {
  const navigate = useNavigate();
  const { courses, myCourse, enrollCourse, enrollLoading } = CourseData();
  const { isAuth } = UserData();
  console.log("courses", courses);

  const isEnrolled = (courseId) => {
    return myCourse?.some(course => course._id === courseId);
  };

  const handleEnroll = async (courseId) => {
    if (!isAuth) {
      navigate("/login");
      return;
    }
    await enrollCourse(courseId);
  };

  return (
    <div className="w-full relative shadow-md">
      {/* ===================== TOP BANNER ===================== */}
      <section className="w-full bg-[#FCF9F1] py-24 ">
        <img src={image} className="absolute left-10 top-32 w-16 opacity-80" />
        <img src={image1} className="absolute left-40 top-25 w-20 opacity-80" />
        <img src={image} className="absolute right-40 top-40 w-16 opacity-80" />
        <img src={image1} className="absolute right-10 top-25 w-20 opacity-80" />

        <div className="text-center">
          <h1 className="text-5xl font-bold text-[#161616]">Course</h1>
          <p className="mt-3 text-gray-600 text-lg">Home <span className="mx-2">•</span> Course</p>
        </div>
      </section>

      {/* ===================== COURSE TITLE SECTION ===================== */}
      <section className="w-full py-20 relative">
        <img src={image1} className="absolute left-32 top-20 w-16 opacity-70" />
        <img src={image} className="absolute right-10 top-32 w-20 opacity-70" />

        <div className="text-center mb-6">
          <p className="text-[#D4A017] font-semibold tracking-wide text-lg">Our Courses</p>
          <h2 className="text-4xl md:text-5xl font-bold text-[#131313] relative inline-block mt-3">
            Explore <span className="relative">Available</span> Courses
          </h2>
        </div>

        {/* ===================== COURSE GRID ===================== */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 mt-10">
          {courses && courses.length > 0 ? (
            courses.map((course) => {
              const enrolled = isEnrolled(course._id);
              return (
                <div key={course._id} className="group shadow-lg rounded-2xl overflow-hidden bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                  <div className="relative overflow-hidden bg-gray-200 h-48">
                    <img 
                      src={course.image || student} 
                      alt={course.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300" 
                    />
                    <div className="absolute top-3 right-3 bg-[#D4A017] text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {course.category || "General"}
                    </div>
                    {enrolled && (
                      <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <CheckCircle size={16} /> Enrolled
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-bold text-xl text-gray-800 mb-2 line-clamp-2">{course.title || "Course Title"}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description || "Learn more about this course."}</p>
                    
                    {/* Instructor & Rating */}
                    <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                      <Users size={16} />
                      <span>{course.instructor || "Expert Instructor"}</span>
                    </div>

                    {/* Course Stats */}
                    <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Star size={16} className="text-yellow-400" fill="currentColor" />
                        <span>{course.rating || "4.5"} ({course.reviews || "120"} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>{course.duration || "40h"}</span>
                      </div>
                    </div>

                    {/* Price & Button */}
                    <div className="flex flex-col gap-3 pt-4 border-t">
                      <div>
                        <p className="text-2xl font-bold text-[#D4A017]">
                          {course.price === 0 || !course.price ? "Free" : `$${course.price}`}
                        </p>
                        {course.originalPrice && (
                          <p className="text-sm text-gray-500 line-through">
                            ${course.originalPrice}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEnroll(course._id)}
                          disabled={enrollLoading || enrolled}
                          className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                            enrolled
                              ? "bg-gray-400 text-white cursor-not-allowed"
                              : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg"
                          } ${enrollLoading ? "opacity-70" : ""}`}
                        >
                          {enrollLoading ? (
                            <>
                              <Loader size={16} className="animate-spin" />
                              Enrolling...
                            </>
                          ) : enrolled ? (
                            <>
                              <CheckCircle size={16} />
                              Enrolled
                            </>
                          ) : (
                            "Enroll"
                          )}
                        </button>
                        {enrolled && (
                          <button 
                            onClick={() => navigate(`/lectures/${course._id}`)}
                            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                          >
                            <Play size={16} />
                            View Lectures
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <>
              <div className="shadow-lg rounded-2xl overflow-hidden bg-white hover:-translate-y-1 transition-all">
                <img src={student} className="w-full h-48 object-cover" />
                <div className="p-5">
                  <h3 className="font-bold text-xl">Web Development</h3>
                  <p className="text-gray-600 mt-2 text-sm">Learn HTML, CSS, JS, and advanced frameworks.</p>
                  <p className="text-[#D4A017] font-semibold mt-3">$99</p>
                </div>
              </div>

              <div className="shadow-lg rounded-2xl overflow-hidden bg-white hover:-translate-y-1 transition-all">
                <img src={student} className="w-full h-48 object-cover" />
                <div className="p-5">
                  <h3 className="font-bold text-xl">Graphic Designing</h3>
                  <p className="text-gray-600 mt-2 text-sm">Learn Photoshop, Illustrator, UI/UX and more.</p>
                  <p className="text-[#D4A017] font-semibold mt-3">$79</p>
                </div>
              </div>

              <div className="shadow-lg rounded-2xl overflow-hidden bg-white hover:-translate-y-1 transition-all">
                <img src={student} className="w-full h-48 object-cover" />
                <div className="p-5">
                  <h3 className="font-bold text-xl">Digital Marketing</h3>
                  <p className="text-gray-600 mt-2 text-sm">Learn SEO, Ads, Branding and Social Media.</p>
                  <p className="text-[#D4A017] font-semibold mt-3">$89</p>
                </div>
              </div>
            </>
          )
          }
        </div>
      </section>
    </div>
  );
}
