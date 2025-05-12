import React from "react";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaBox,
  FaSignInAlt,
  FaSignOutAlt,
  FaHome,
} from "react-icons/fa";

const AdminAside = () => {
  return (
    <aside className="w-64 min-h-screen bg-base-100 p-4 shadow-lg">
      <h2 className="text-2xl font-extrabold mb-8 text-center text-primary">
        Admin Dashboard
      </h2>
      <ul className="menu w-full p-4 text-base-content">
        <li>
          <Link to="/admin/dashboard">
            <FaHome className="w-5 h-5" />
            Dashboard
          </Link>
        </li>
        <div className="divider my-2"></div>
        <li>
          <Link to="/admin/dashboard/users">
            <FaUsers className="w-5 h-5" />
            Manage Users
          </Link>
        </li>
        <li>
          <Link to="/admin/dashboard/products">
            <FaBox className="w-5 h-5" />
            Manage Products
          </Link>
        </li>
        <li>
          <Link to="/admin/dashboard/stock-in">
            <FaSignInAlt className="w-5 h-5" />
            Stock In Records
          </Link>
        </li>
        <li>
          <Link to="/admin/dashboard/stock-out">
            <FaSignOutAlt className="w-5 h-5" />
            Stock Out Records
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default AdminAside;
