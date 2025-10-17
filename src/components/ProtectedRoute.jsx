import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * Usage:
 * <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAuthorized } = useAuth();

  if (!isAuthenticated) {
    // not logged in
    return <Navigate to="/" replace />;
  }

  if (!isAuthorized) {
    // logged in but role not allowed
    // optionally logout
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/" replace state={{ error: "Access denied" }} />;
  }

  return children;
};

export default ProtectedRoute;
