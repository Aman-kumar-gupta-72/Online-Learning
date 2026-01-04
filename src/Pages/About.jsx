import React from "react";
import image from "../assets/ok.svg"
import image1 from "../assets/oy.svg"
import image3 from "../assets/download.jpeg"
import { BookOpen, Video, Users } from "lucide-react";

const About = () => {
  return (
    
    <div className="w-full px-6 md:px-20 lg:px-32 py-20">
         {/* Top Banner Section */}
<div className="w-full bg-[#fefbf3] py-20 relative overflow-hidden">

  {/* Decorative Shapes */}
  <img
    src={image}
    className="w-14 absolute top-10 left-20 opacity-80"
    alt=""
  />
  <img
    src={image1}
    className="w-16 absolute bottom-10 right-28 opacity-80"
    alt=""
  />

  {/* Heading + Breadcrumb */}
  <div className="max-w-4xl mx-auto text-center">
    <h1 className="text-5xl font-bold text-[#1a1a1a]">About</h1>

    <p className="text-gray-600 mt-4 text-lg">
       <span className="mx-2"></span> About
    </p>
  </div>
</div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* LEFT IMAGE SECTION */}
        <div className="flex justify-center">
          <div className="relative rounded-[200px] border-[6px] border-gray-300 p-3">
            <img
              src={image3}
              alt="Student"
              className="rounded-[180px] w-[430px] h-[520px] object-cover"
            />
          </div>
        </div>

        {/* RIGHT TEXT SECTION */}
        <div>
          <p className="text-yellow-600 font-semibold text-lg mb-2">
            About Ace!Mind
          </p>

          {/* Main Heading */}
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-gray-900">
            A New Different Way To <br />
            Improve Your 
            <span className="relative inline-block">
              <span className="absolute left-0 -bottom-1 w-full h-4 bg-yellow-300 rounded-full opacity-70"></span>
              <span className="relative"> Skills.</span>
            </span>
          </h1>

          {/* Description */}
          <p className="text-gray-600 text-lg mt-6 leading-relaxed">
            Education is one of the most essential and valuable assets
            an individual can possess. It plays a pivotal role in
            shaping the future of individuals, societies, and nations.
            The importance of education cannot be overstated.
          </p>

          <p className="text-gray-600 text-lg mt-4 leading-relaxed">
            One of the primary benefits of education is its ability to
            empower individuals. Through education, people acquire
            knowledge, skills, and confidence to navigate life.
          </p>

          {/* Divider */}
          <div className="w-full h-[1px] bg-gray-200 mt-10 mb-10"></div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">

            <div className="flex items-center gap-4">
              <div className="bg-yellow-100 p-4 rounded-full">
                <BookOpen size={36} className="text-yellow-700" />
              </div>
              <div>
                <h3 className="text-xl font-bold">50+</h3>
                <p className="text-gray-600 text-sm">Courses</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-4 rounded-full">
                <Video size={36} className="text-green-700" />
              </div>
              <div>
                <h3 className="text-xl font-bold">100+</h3>
                <p className="text-gray-600 text-sm">Free Classes</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-4 rounded-full">
                <Users size={36} className="text-purple-700" />
              </div>
              <div>
                <h3 className="text-xl font-bold">1k+</h3>
                <p className="text-gray-600 text-sm">Students</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default About;
