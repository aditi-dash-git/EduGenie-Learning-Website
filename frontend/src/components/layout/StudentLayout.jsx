import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const StudentLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <main className="p-6">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default StudentLayout;