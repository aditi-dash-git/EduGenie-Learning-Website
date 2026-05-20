import React, { useState } from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  return (
    <footer className="bg-gray-900 md:px-36 text-left w-full mt-10">
      <div
        className="flex flex-col md:flex-row items-start px-8 
  md:px-0 justify-center gap-10 md:gap-32 py-10 border-b 
  border-white/30"
      >
        <div className="flex flex-col md:items-start items-center w-full">
          <img src={assets.logo_dark} alt="logo" />
          <p className="text-center ml-8 md:text-left text-sm text-white/80">
            EduGenie is an interactive e-learning platform designed to help
            students learn through courses, quizzes, flashcards, and AI-powered
            assistance. Explore high-quality educational content, track your
            progress, and enhance your learning experience anytime, anywhere.
          </p>
        </div>
        <div className="flex flex-col md:items-start items-center w-full">
          <h2 className="font-semibold text-white mb-5">Company</h2>
          <ul className="flex md:flex-col w-full justify-between text-sm text-white/80 md:space-y-2">
            <li>
              <button className="hover:text-white transition">Home</button>
            </li>

            <li>
              <button
                onClick={() => setShowAbout(true)}
                className="hover:text-white transition"
              >
                About us
              </button>
            </li>

            <li>
              <button
                onClick={() => setShowContact(true)}
                className="hover:text-white transition"
              >
                Contact us
              </button>
            </li>

            <li>
              <button
                onClick={() => setShowPrivacy(true)}
                className="hover:text-white transition"
              >
                Privacy policy
              </button>
            </li>
          </ul>
        </div>

        <div className="hidden md:flex flex-col items-start w-full">
          <h2 className="font-semibold text-white mb-5">
            Subscribe to our newsletter
          </h2>
          <p className="text-sm text-white/80">
            The latest news, articles, and resources, sent to your inbox weekly.
          </p>
          <div className="flex items-center gap-2 pt-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="border border-gray-500/30 bg-gray-800 text-gray-500 
    placeholder-gray-500 outline-none w-64 h-9 rounded px-2 text-sm"
            />
            <button className="bg-blue-600 w-24 h-9 text-white rounded">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      <p className="py-4 text-center text-xs md:text-sm text-white/60">
        Copyright 2026 © EduGenie. All Right Reserved.
      </p>

      {showAbout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl p-8 relative">
            <button
              onClick={() => setShowAbout(false)}
              className="absolute top-4 right-4 text-gray-500"
            >
              ✕
            </button>

            <h2 className="text-3xl font-bold mb-4">About EduGenie</h2>

            <p className="text-gray-600 leading-relaxed">
              EduGenie is an AI-powered e-learning platform designed to help
              students learn smarter through quizzes, flashcards, documents, and
              personalized educational assistance.
            </p>
          </div>
        </div>
      )}

      {showContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl p-8 relative">
            <button
              onClick={() => setShowContact(false)}
              className="absolute top-4 right-4 text-gray-500"
            >
              ✕
            </button>

            <h2 className="text-3xl font-bold mb-4">Contact Us</h2>

            <p className="text-gray-600 mb-2">Email: support@edugenie.com</p>

            <p className="text-gray-600">Phone: +91 123456789</p>
          </div>
        </div>
      )}

      {showPrivacy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl p-8 relative">
            <button
              onClick={() => setShowPrivacy(false)}
              className="absolute top-4 right-4 text-gray-500"
            >
              ✕
            </button>

            <h2 className="text-3xl font-bold mb-4">Privacy Policy</h2>

            <p className="text-gray-600 leading-relaxed">
              EduGenie values your privacy and protects your personal
              information. Your uploaded documents and learning data are
              securely stored and never shared with third parties.
            </p>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
