import React from "react";
import { Bell } from "lucide-react";

const DashboardHeader = () => {
  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
      
      {/* Left */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
          ⚡
        </div>

        <h1 className="text-2xl font-bold text-gray-900">
          EduGenie AI
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-6">
        
        <button className="text-gray-600 hover:text-blue-600">
          <Bell size={22} />
        </button>

        <img
          src="https://i.pravatar.cc/40"
          alt="profile"
          className="w-10 h-10 rounded-full border"
        />
      </div>

    </header>
  );
};

export default DashboardHeader;