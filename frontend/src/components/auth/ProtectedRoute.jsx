import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@clerk/react";

const ProtectedRoute = () => {
  const { isSignedIn, isLoaded } = useUser();

  // Loading state
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  // If logged in → allow access
  // Else → redirect to Clerk sign in
  return isSignedIn ? (
    <Outlet />
  ) : (
    <Navigate to="/sign-in" replace />
  );
};

export default ProtectedRoute;