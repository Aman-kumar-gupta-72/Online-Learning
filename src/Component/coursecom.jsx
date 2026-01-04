import image from "../assets/ok.svg"
import image1 from "../assets/oy.svg"
import student from "../assets/Graphics.jpg"
import student2 from "../assets/digital.jpg"
import student1 from "../assets/web.jpg"
import image3 from "../assets/download.jpeg"
import { useNavigate } from "react-router"
import { ArrowRight } from "lucide-react"

export default function CourseComp() {
  const navigate = useNavigate();

  const handleViewAllCourses = () => {
    navigate("/course");
  };

  return (
    <div className="w-full">

      

      {/* COURSE TITLE  */}
      <section className="w-full py-20 relative">
        
       
        <img src={image1} className="absolute left-32 top-20 w-16 opacity-70" />
        <img src={image} className="absolute right-10 top-32 w-20 opacity-70" />

        <div className="text-center mb-6">
          <p className="text-[#D4A017] font-semibold tracking-wide text-lg">
            Our Courses
          </p>

          <h2 className="text-4xl md:text-5xl font-bold text-[#131313] relative inline-block mt-3">
            Explore <span className="relative">Courses
             
            </span> 
            By Category
          </h2>
        </div>

        {/*COURSE GRID  */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-6 mt-10">

          {/* Course Card */}
          <div 
            onClick={handleViewAllCourses}
            className="shadow-lg rounded-2xl overflow-hidden bg-white dark:bg-gray-800 hover:-translate-y-1 transition-all cursor-pointer group"
          >
            <img src={student1} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="p-5">
              <h3 className="font-bold text-xl dark:text-white">Web Development</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
                Learn HTML, CSS, JS, and advanced frameworks.
              </p>
              <button className="mt-4 text-[#D4A017] dark:text-yellow-500 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                View Courses <ArrowRight size={18} />
              </button>
            </div>
          </div>

          <div 
            onClick={handleViewAllCourses}
            className="shadow-lg rounded-2xl overflow-hidden bg-white dark:bg-gray-800 hover:-translate-y-1 transition-all cursor-pointer group"
          >
            <img src={student} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="p-5">
              <h3 className="font-bold text-xl dark:text-white">Graphic Designing</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
                Learn Photoshop, Illustrator, UI/UX and more.
              </p>
              <button className="mt-4 text-[#D4A017] dark:text-yellow-500 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                View Courses <ArrowRight size={18} />
              </button>
            </div>
          </div>

          <div 
            onClick={handleViewAllCourses}
            className="shadow-lg rounded-2xl overflow-hidden bg-white dark:bg-gray-800 hover:-translate-y-1 transition-all cursor-pointer group"
          >
            <img src={student2} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="p-5">
              <h3 className="font-bold text-xl dark:text-white">Digital Marketing</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
                Learn SEO, Ads, Branding and Social Media.
              </p>
              <button className="mt-4 text-[#D4A017] dark:text-yellow-500 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                View Courses <ArrowRight size={18} />
              </button>
            </div>
          </div>

        </div>

        {/* View All Courses Button */}
        <div className="text-center mt-12">
          <button 
            onClick={handleViewAllCourses}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
          >
            View All Courses
          </button>
        </div>
      </section>
    </div>
  );
}
