import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // To redirect
import UseAuth from "../hooks/useAuth";

const Dashboard = () => {
  const { user, isAdmin, loading } = UseAuth();
  const navigate = useNavigate();

  // Effect to handle redirection based on user role after authentication status is determined
  useEffect(() => {
    // Only perform redirection logic once loading is complete
    if (!loading) {
      if (!user) {
        // If user is not authenticated, redirect to the login page
        navigate("/login");
      } else {
        // If user is authenticated, redirect based on their user type (role)
        if (isAdmin) {
          // If user is an Admin, navigate to the admin dashboard page
          navigate("/admin/dashboard");
        } else {
          // If user is a Worker (or any other non-admin type), navigate to the worker dashboard page
          navigate("/worker/dashboard");
        }
      }
    }
  }, [user, isAdmin, loading, navigate]); // Dependencies: Re-run effect if user, isAdmin, loading, or navigate changes

  // While the authentication status is loading, display a loading indicator.
  // This prevents rendering content before the user's role is known, avoiding flickering or incorrect redirects.
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // This component's primary function is redirection.
  // It doesn't render any visible content itself once the authentication status is determined.
  // The actual dashboard content is on the /admin/dashboard and /worker/dashboard pages.
  return null; // Render nothing while waiting for the redirect to happen
};

export default Dashboard;
