import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const EducatorLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen">

      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r p-5">
        <h2 className="text-lg font-bold mb-6">Educator Panel</h2>

        <nav className="flex flex-col gap-4 text-sm">
          <Link to="/educator/dashboard">Dashboard</Link>
          <Link to="/educator/add-course">Add Course</Link>
          <Link to="/educator/my-courses">My Courses</Link>
          <Link to="/educator/students">Students Enrolled</Link>
        </nav>
      </div>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">

        {/* TOP BAR */}
        <div className="flex justify-between items-center p-4 border-b">
          <h1 className="font-semibold">Welcome, {user?.username}</h1>

          <button
            onClick={logout}
            className="text-sm text-red-500"
          >
            Logout
          </button>
        </div>

        {/* PAGE CONTENT */}
        <div className="p-6 overflow-y-auto flex-1">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default EducatorLayout;