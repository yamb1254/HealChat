import React from "react";
import { Navigate } from "react-router-dom";
import { isAdminAuthenticated } from "../utils/auth";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  return isAdminAuthenticated() ? children : <Navigate to="/admin/login" />;
};

export default ProtectedRoute;
