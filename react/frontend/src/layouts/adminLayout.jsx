import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminAside from '../components/asides/AdminAside'; // Your existing component
import AdminDashboardPage from '../pages/AdminDashboardPage'; // Assuming this page exists

// Import the new CRUD pages
import ManageUsersPage from '../pages/admin/ManageUsersPage';
import ManageProductsPage from '../pages/admin/ManageProductsPage';
import ManageStockInPage from '../pages/admin/ManageStockInPage';
import ManageStockOutPage from '../pages/admin/ManageStockOutPage';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-base-200 text-base-content">
      <AdminAside />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        {/* This container ensures content doesn't stretch too wide on large screens */}
        <div className="max-w-7xl mx-auto">
          <Routes>
            {/* Default page for /admin/dashboard */}
            <Route index element={<AdminDashboardPage />} />
            {/* Route for /admin/dashboard/users */}
            <Route path="users" element={<ManageUsersPage />} />
            {/* Route for /admin/dashboard/products */}
            <Route path="products" element={<ManageProductsPage />} />
            {/* Route for /admin/dashboard/stock-in */}
            <Route path="stock-in" element={<ManageStockInPage />} />
            {/* Route for /admin/dashboard/stock-out */}
            <Route path="stock-out" element={<ManageStockOutPage />} />
            {/* You can add more nested routes here if needed */}
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;