import React from "react";
import studentImg from "../assets/Student1.jpeg" // <-- add your image here
import Courses from "./Course";
import { useNavigate } from "react-router";
import { BookOpen, Users, Award, TrendingUp, Zap, Shield } from "lucide-react";
import Testimonials from "../Component/Testomial";
import CourseComp from "../Component/coursecom";
import AboutComp from "../Component/AboutComp";
import Newsletter from "../Component/Newsleter"


export default function Home () {
  return (
    <section className="bg-[#F2FAF7] pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-10">

        {/* LEFT CONTENT */}
        <div>
          <p className="text-green-700 font-medium mb-3">Find Your Perfect Tutor</p>

          <h1 className="text-4xl lg:text-6xl font-bold text-[#122033] leading-tight">
            Lets Learn About
            <br />
            <span className="inline-block">
              New <span className="text-indigo-600">Knowledge</span>
              <svg
                className="left-0 -bottom-2 w-full"
                height="20"
                viewBox="0 0 300 20"
                fill="none"
              >
                <path
                  d="M2 10C90 30 210 -10 298 10"
                  stroke="#F2C94C"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <br />And Abilities
          </h1>

          <p className="text-gray-600 mt-5 max-w-md">
            We are providing you the best tutor to enhance your knowledge and skill.
            Let’s get started and get relaxing learning.
          </p>

          {/* CTA BUTTONS */}
          <div className="flex items-center gap-4 mt-8">
            <button className="bg-yellow-500 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:bg-yellow-600 transition">
              Get Started
            </button>

            <button className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition">
              <span className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center">
                ▶
              </span>
              Watch Our Video
            </button>
          </div>
        </div>

        {/* RIGHT IMAGE + CARDS */}
        <div className="relative">

          {/* Circle lines */}
          <div className="absolute -z-10 top-10 left-10 ">
            <div className="w-80 h-80 rounded-full border-[3px] border-yellow-400"></div>
            <div className="w-96 h-96 rounded-full border-[3px] border-yellow-300 mt-4"></div>
          </div>

          <img
            src={studentImg}
            alt="Student"
            className="w-full max-w-md mx-auto drop-shadow-xl rounded-4xl"
          />

          {/* Floating Card */}
          <div className="absolute right-0.5 top-0 bg-white shadow-xl px-5 py-4 rounded-2xl border">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl">
                👥
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">25k+</p>
                <p className="text-gray-600 text-sm">Total Active Students</p>
              </div>
            </div>
          </div>

          {/* Bottom Card */}
          <div className="absolute left-5 bottom-0 bg-white shadow-xl px-5 py-4 rounded-2xl border">
            <p className="text-xl font-bold">200+</p>
            <p className="text-gray-600 text-sm">Top Expert Mentors</p>
            <div className="flex mt-2">
              <img
                className="w-10 h-10 rounded-full -ml-2 border-2 border-white"
                src="https://randomuser.me/api/portraits/women/1.jpg"
              />
              <img
                className="w-10 h-10 rounded-full -ml-2 border-2 border-white"
                src="https://randomuser.me/api/portraits/men/2.jpg"
              />
              <img
                className="w-10 h-10 rounded-full -ml-2 border-2 border-white"
                src="https://randomuser.me/api/portraits/women/3.jpg"
              />
            </div>
          </div>

        </div>
      </div>
      <AboutComp/>
      <CourseComp/>
      <Testimonials/>
      <Newsletter/>
    </section>
    
  );
}
