import React, { useEffect, useState } from "react";
import axios from "axios"; // Assuming you'll use axios for API calls
import { useNavigate } from "react-router-dom"; // To redirect if not authenticated or is admin
import UseAuth from "../hooks/useAuth";

const WorkerDashboardPage = () => {
    const { user, isAdmin, loading } = UseAuth(); // Get user, isAdmin, and loading from the hook
    const navigate = useNavigate();

    // Redirect if not authenticated or is an admin after loading
    useEffect(() => {
        if (!loading) {
            if (!user) {
                navigate("/login"); // Redirect to login if not authenticated
            } else if (isAdmin) {
                // Redirect to a different page (e.g., admin dashboard) if authenticated but is admin
                navigate("/admin/dashboard"); // Or wherever admins should go
            }
        }
    }, [user, isAdmin, loading, navigate]); // Depend on user, isAdmin, loading, and navigate


    const [recentStock, setRecentStock] = useState([]);
    const [loadingRecent, setLoadingRecent] = useState(true);
    const [errorRecent, setErrorRecent] = useState(null);

    useEffect(() => {
        // Only fetch data if the user is a worker and not loading authentication status
        if (!loading && user && !isAdmin) {
            // TODO: Implement API call to fetch recent stock movements or current stock levels
            const fetchRecentStock = async () => {
                try {
                    setLoadingRecent(true);
                    setErrorRecent(null);
                    // Replace with your actual API endpoint
                    // const response = await axios.get("http://localhost:3004/api/worker/recent-stock", {
                    //   headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } // Include token
                    // });
                    // setRecentStock(response.data); // Assuming backend returns an array of recent movements
                    // For now, using dummy data:
                    setTimeout(() => {
                      setRecentStock([
                        { id: 1, productName: "Orange Juice", type: "In", quantity: 100, date: "2023-10-26" },
                        { id: 2, productName: "Apple Juice", type: "Out", quantity: 50, date: "2023-10-25" },
                        { id: 3, productName: "Mango Juice", type: "In", quantity: 75, date: "2023-10-25" },
                      ]);
                      setLoadingRecent(false);
                    }, 1000); // Simulate API delay
                } catch (err) {
                    console.error("Error fetching recent stock:", err);
                    setErrorRecent("Failed to load recent stock movements.");
                    setLoadingRecent(false);
                }
            };

            fetchRecentStock();
        }
    }, [loading, user, isAdmin]); // Depend on loading, user, and isAdmin

     if (loading || (!user && !loading) || (isAdmin && !loading)) {
      // Render nothing or a simple loading/redirect message while auth status is determined or redirecting
      return (
        <div className="flex justify-center items-center h-screen">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      );
    }

    // If authenticated and is worker, render the dashboard content
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">
                Worker Dashboard - Welcome, {user?.username}!
            </h1>

            {loadingRecent ? (
                <p>Loading recent stock movements...</p>
            ) : errorRecent ? (
                <div className="text-red-500">{errorRecent}</div>
            ) : (
                <div className="p-6 bg-white rounded-box shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Recent Stock Movements</h3>
                    {recentStock.length === 0 ? (
                        <p>No recent stock movements found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Type</th>
                                        <th>Quantity</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentStock.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.productName}</td>
                                            <td>{item.type}</td>
                                            <td>{item.quantity}</td>
                                            <td>{item.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {/* TODO: Add links or components for recording new stock in/out, viewing current stock levels */}
                     <div className="mt-6">
                        <h4 className="text-lg font-medium mb-2">Quick Actions</h4>
                        <div className="flex gap-4">
                            <button className="btn btn-primary rounded-box">Record Stock In</button>
                            <button className="btn btn-secondary rounded-box">Record Stock Out</button>
                            <button className="btn btn-accent rounded-box">View Current Stock</button>
                            {/* Add more action buttons */}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkerDashboardPage;
