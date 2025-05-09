import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import UseAuth from "../hooks/useAuth"; // Adjust the path as needed

// Component to redirect authenticated users away from certain routes (like login/register)
const RedirectIfAuthenticated = () => {
  // Get authentication state from the UseAuth hook
  const { user, loading } = UseAuth();

  // Show a loading indicator while the authentication status is being determined
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // If the user is authenticated (user is not null and not loading),
  // redirect them to the dashboard.
  if (user) {
    // Use 'replace' to prevent navigating back to the login/register page
    return <Navigate to="/dashboard" replace />;
  }

  // If the user is NOT authenticated, render the nested routes
  // (e.g., the Login form or Register form)
  return <Outlet />;
};

export default RedirectIfAuthenticated;
