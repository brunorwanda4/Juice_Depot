import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import UseAuth from "../hooks/useAuth"; // Adjust the path as needed

// ProtectedRoute component that checks authentication and user role
// Accepts a 'requiredRole' prop (e.g., "ADMIN", "WORKER")
const ProtectedRoute = ({ requiredRole }) => {
  // Get authentication state from the UseAuth hook
  const { user, isAdmin, loading } = UseAuth();

  // Show a loading indicator while the authentication status is being determined
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // If not authenticated, redirect to the login page
  if (!user) {
    // Use 'replace' to prevent navigating back to the protected route
    return <Navigate to="/login" replace />;
  }

  // Check if the authenticated user has the required role
  // Note: We are comparing requiredRole string with user.userType from the token payload
  // If user.userType is not available or structure is different, adjust the check here.
  const userHasRequiredRole =
    requiredRole === "ADMIN" ? isAdmin : user.userType === requiredRole;

  // If the user does NOT have the required role, redirect them
  if (!userHasRequiredRole) {
    console.warn(`Access denied: User "${user.username}" (Type: ${user.userType}) does not have the required role "${requiredRole}".`);
    // Redirect to a default page, perhaps the general dashboard or a forbidden page
    // You can adjust the redirect path as needed
    return <Navigate to="/dashboard" replace />; // Redirect to the general dashboard
  }

  // If authenticated and has the required role, render the nested routes
  return <Outlet />;
};

export default ProtectedRoute;
