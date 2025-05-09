import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaBox, FaSignInAlt, FaSignOutAlt, FaHome } from 'react-icons/fa';

const AdminAside = () => {
  return (
    <aside className="w-64 min-h-screen bg-base-200 p-4 shadow-lg"> {/* Added shadow for better visual */}
      {/* Sidebar Title */}
      <h2 className="text-2xl font-extrabold mb-8 text-center text-primary">Admin Dashboard</h2> {/* Enhanced title styling */}

      {/* Navigation Menu */}
      {/* Using DaisyUI's menu component */}
      <ul className="menu bg-base-100 rounded-box w-full p-4 text-base-content"> {/* Increased padding and adjusted text color */}
        {/* Dashboard Link */}
        <li>
          {/* Use Link component for navigation */}
          <Link to="/admin"> {/* Assuming '/admin' is your dashboard route */}
            <FaHome className="w-5 h-5" />
            Dashboard
          </Link>
        </li>

        <div className="divider my-2"></div> {/* Divider for separation */}

        {/* Users Management */}
        <li>
          {/* Use Link component for navigation */}
          <Link to="/admin/users"> {/* Assuming '/admin/users' is the route for Users CRUD */}
            <FaUsers className="w-5 h-5" />
            Manage Users
          </Link>
        </li>

        {/* Products Management */}
        <li>
          {/* Use Link component for navigation */}
          <Link to="/admin/products"> {/* Assuming '/admin/products' is the route for Products CRUD */}
            <FaBox className="w-5 h-5" />
            Manage Products
          </Link>
        </li>

        {/* Stock In Management */}
        <li>
          {/* Use Link component for navigation */}
          <Link to="/admin/stock-in"> {/* Assuming '/admin/stock-in' is the route for Stock In CRUD */}
            <FaSignInAlt className="w-5 h-5" />
            Stock In Records
          </Link>
        </li>

        {/* Stock Out Management */}
        <li>
          {/* Use Link component for navigation */}
          <Link to="/admin/stock-out"> {/* Assuming '/admin/stock-out' is the route for Stock Out CRUD */}
            <FaSignOutAlt className="w-5 h-5" />
            Stock Out Records
          </Link>
        </li>

        {/* You can add more links here as needed */}
      </ul>
    </aside>
  );
};

export default AdminAside;
