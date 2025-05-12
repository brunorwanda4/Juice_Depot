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
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route index element={<AdminDashboardPage />} />
            <Route path="users" element={<ManageUsersPage />} />
            <Route path="products" element={<ManageProductsPage />} />
            <Route path="stock-in" element={<ManageStockInPage />} />
            <Route path="stock-out" element={<ManageStockOutPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;