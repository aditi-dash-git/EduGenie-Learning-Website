import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const EducatorRoute = () => {
  const { user } = useAuth();

  // If not educator → block access
  if (user?.role !== "educator") {
    return <Navigate to="/home" replace />;
  }
 
  return <Outlet />;
};

export default EducatorRoute;