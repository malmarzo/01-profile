import React from "react";
import { Navigate } from "react-router-dom";

//Component to stop the user from accessing the login page if they are already authenticated
const AlreadyAuthRoute = ({ children }) => {
  if (localStorage.getItem("jwtToken")) {
    // Redirect to login if not authenticated
    return <Navigate to="/01-Profile" replace />;
  }

  // Render the children if authenticated
  return <>{children}</>;
};

export default AlreadyAuthRoute;
