import React, { useEffect, useState } from "react";
// import axios from "axios"; // Assuming you'll use axios for API calls
import { useNavigate } from "react-router-dom"; // To redirect if not authenticated or not admin
import UseAuth from "../hooks/useAuth";

const AdminDashboardPage = () => {
  const { user, isAdmin, loading } = UseAuth(); // Get user, isAdmin, and loading from the hook
  const navigate = useNavigate();

  // Redirect if not authenticated or not an admin after loading
  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/"); // Redirect to login if not authenticated
      } else if (!isAdmin) {
        // Redirect to a different page (e.g., home or worker dashboard) if authenticated but not admin
        navigate("/dashboard"); // Or wherever non-admins should go
      }
    }
  }, [user, isAdmin, loading, navigate]); // Depend on user, isAdmin, loading, and navigate

  const [dashboardStats, setDashboardStats] = useState({
    totalProducts: 0,
    totalStockIn: 0,
    totalStockOut: 0,
    // Add more stats as needed
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState(null);

  useEffect(() => {
    // Only fetch data if the user is an admin and not loading authentication status
    if (!loading && isAdmin) {
      // TODO: Implement API call to fetch admin dashboard statistics
      // Example: Fetch total products, total stock in quantity, total stock out quantity
      const fetchAdminStats = async () => {
        try {
          setLoadingStats(true);
          setErrorStats(null);
          // Replace with your actual API endpoint
          // const response = await axios.get("http://localhost:3004/api/admin/dashboard-stats", {
          //   headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } // Include token
          // });
          // setDashboardStats(response.data); // Assuming backend returns { totalProducts, totalStockIn, totalStockOut }
          // For now, using dummy data:
          setTimeout(() => {
            setDashboardStats({
              totalProducts: 50,
              totalStockIn: 1500,
              totalStockOut: 1200,
            });
            setLoadingStats(false);
          }, 1000); // Simulate API delay
        } catch (err) {
          console.error("Error fetching admin stats:", err);
          setErrorStats("Failed to load dashboard statistics.");
          setLoadingStats(false);
        }
      };

      fetchAdminStats();
    }
  }, [loading, isAdmin]); // Depend on loading and isAdmin

  if (loading || (!user && !loading) || (!isAdmin && !loading)) {
      // Render nothing or a simple loading/redirect message while auth status is determined or redirecting
      return (
        <div className="flex justify-center items-center h-screen">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      );
  }


  // If authenticated and is admin, render the dashboard content
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Admin Dashboard - Welcome, {user?.username}!
      </h1>

      {loadingStats ? (
        <p>Loading admin dashboard stats...</p>
      ) : errorStats ? (
        <div className="text-red-500">{errorStats}</div>
      ) : (
        <div className="p-6 bg-white rounded-box shadow-md">
          <h3 className="text-xl font-semibold mb-4">Admin Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="stat border rounded-box p-4">
              <div className="stat-title">Total Products</div>
              <div className="stat-value">{dashboardStats.totalProducts}</div>
            </div>
            <div className="stat border rounded-box p-4">
              <div className="stat-title">Total Stock In Quantity</div>
              <div className="stat-value">{dashboardStats.totalStockIn}</div>
            </div>
            <div className="stat border rounded-box p-4">
              <div className="stat-title">Total Stock Out Quantity</div>
              <div className="stat-value">{dashboardStats.totalStockOut}</div>
            </div>
            {/* Add more stats here */}
          </div>
          {/* TODO: Add links or components for managing products, viewing detailed reports, etc. */}
          <div className="mt-6">
              <h4 className="text-lg font-medium mb-2">Quick Actions</h4>
              <div className="flex gap-4">
                  <button className="btn btn-primary rounded-box">Manage Products</button>
                  <button className="btn btn-secondary rounded-box">View Stock History</button>
                  {/* Add more action buttons */}
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
