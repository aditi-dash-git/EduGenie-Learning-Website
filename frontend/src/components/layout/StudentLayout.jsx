import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const StudentLayout = () => {
  return (
    <div className="min-h-screen bg-neutral-50">

      {/* Header only
      <Header /> */}

      {/* Page Content */}
      <main className="p-6">
        <Outlet />
      </main>

    </div>
  );
};

export default StudentLayout;