import React from "react";
import { Navigate } from "react-router-dom";

//Component to protect the routes (Allow only authenticated users)
const AuthRoute = ({ children }) => {
  if (!localStorage.getItem("jwtToken")) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Render the children if authenticated
  return <>{children}</>;
};

export default AuthRoute;
