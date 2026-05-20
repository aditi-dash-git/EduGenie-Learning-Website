import React from "react";
import Hero from "../../components/courses/Hero";
// import Companies from "../../components/courses/Companies";
import CourseSection from "../../components/courses/CourseSection";
import TestimonialsSection from "../../components/courses/TestimonialsSection";
import CallToAction from "../../components/courses/CallToAction";
import Footer from "../../components/layout/Footer";
import AIAssistantSection from "../../components/courses/AIAssistantSection";

const Home = () => {
  return (
    // <div className="bg-cyan-100/70 min-h-screen flex flex-col items-center justify-center text-center px-6">

    //   {/* HERO TEXT */}
    //   <h1 className="text-4xl md:text-6xl font-bold text-slate-800 leading-tight max-w-4xl">
    //     Empower your future with the courses designed to{" "}
    //     <span className="text-blue-600">fit your choice.</span>
    //   </h1>

    //   <p className="mt-6 text-slate-600 max-w-xl">
    //     We bring together world-class instructors, interactive content, and a
    //     supportive community to help you achieve your personal and professional
    //     goals.
    //   </p>

    //   {/* SEARCH BAR */}
    //   <div className="mt-8 flex items-center bg-white shadow-md rounded-lg overflow-hidden w-full max-w-xl">
    //     <input
    //       type="text"
    //       placeholder="Search for courses"
    //       className="flex-1 px-4 py-3 outline-none"
    //     />
    //     <button className="bg-blue-600 text-white px-6 py-3 hover:bg-blue-700">
    //       Search
    //     </button>
    //   </div>

    //   {/* TRUSTED COMPANIES */}
    //   <div className="mt-16">
    //     <p className="text-slate-500 mb-6">Trusted by learners from</p>

    //     <div className="flex flex-wrap items-center justify-center gap-8 text-gray-500 font-semibold">
    //       <span>Microsoft</span>
    //       <span>Walmart</span>
    //       <span>Accenture</span>
    //       <span>Adobe</span>
    //       <span>PayPal</span>
    //     </div>
    //   </div>

    // </div>
    <div className="flex flex-col items-center space-y-7 text-center ">
      <Hero />
      {/* <Companies /> */}
      <CourseSection />
      <AIAssistantSection />
      <TestimonialsSection />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Home;