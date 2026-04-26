import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    // // <div className="text-default min-h-screen bg-white">
    //   {/* <Header /> */}
      <div className="min-h-screen">
        <Outlet />
      </div>
    // </div>
  );
};

export default MainLayout;
