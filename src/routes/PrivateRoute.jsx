import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getUser } from "../lib/tokenManagement";

const PrivateRoute = ({ children }) => {
  const location = useLocation();

  const user = getUser();
  if (user && (user?.role === "ADMIN" || user?.role === "SUPER_ADMIN")) {
    return children;
  }

  return <Navigate to="/login" state={{ from: location }} />;
};

export default PrivateRoute;
