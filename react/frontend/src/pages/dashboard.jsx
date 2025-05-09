import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UseAuth from "../hooks/useAuth";

const Dashboard = () => {
  const { user, isAdmin, loading } = UseAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login");
      } else {
        if (isAdmin) {
          navigate("/admin/dashboard");
        } else {
          navigate("/worker/dashboard");
        }
      }
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  return null;
};

export default Dashboard;
