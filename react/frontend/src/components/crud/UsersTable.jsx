import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const UsersTable = ({ users, onEdit, onDelete }) => {
  if (!users || users.length === 0) {
    return <p className="text-center text-gray-500 py-4">No users found.</p>;
  }

  return (
    <div className="overflow-x-auto shadow-lg rounded-lg bg-base-100">
      <table className="table w-full">
        <thead>
          <tr className="bg-base-200">
            <th>User ID</th>
            <th>Username</th>
            <th>User Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.userId} className="hover">
              <td>{user.userId}</td>
              <td>{user.userName}</td>
              <td><span className={`badge ${user.userType === 'ADMIN' ? 'badge-primary' : 'badge-secondary'}`}>{user.userType}</span></td>
              <td>
                <button onClick={() => onEdit(user)} className="btn btn-sm btn-outline btn-info mr-2 p-2">
                  <FaEdit />
                </button>
                <button onClick={() => onDelete(user.userId, user.userName)} className="btn btn-sm btn-outline btn-error p-2">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;