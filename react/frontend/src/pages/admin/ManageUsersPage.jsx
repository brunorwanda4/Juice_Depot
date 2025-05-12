import React, { useState, useEffect, useCallback } from 'react';
import UsersTable from '../../components/crud/UsersTable';
import UserForm from '../../components/crud/UserForm';
import DeleteConfirmationModal from '../../components/crud/DeleteConfirmationModal';
import { FaPlus } from 'react-icons/fa';

const API_URL = 'http://localhost:3004/api/users';

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null); // { id: userId, name: userName }

  const [feedbackMessage, setFeedbackMessage] = useState({ type: '', text: '' });


  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setUsers(data);
    } catch (e) {
      setError(e.message);
      setFeedbackMessage({ type: 'error', text: `Failed to fetch users: ${e.message}` });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    setFeedbackMessage({ type: '', text: '' });
    const method = editingUser ? 'PUT' : 'POST';
    const url = editingUser ? `${API_URL}/${editingUser.userId}` : API_URL;
    
    // For PUT, if password is empty, don't send it
    const payload = { ...formData };
    if (editingUser && !payload.passWord) {
      delete payload.passWord;
    }

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Operation failed with status ' + response.status }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      setFeedbackMessage({ type: 'success', text: `User ${editingUser ? 'updated' : 'created'} successfully!` });
      fetchUsers(); // Refresh list
      setIsFormOpen(false);
      setEditingUser(null);
    } catch (e) {
      setError(e.message);
      setFeedbackMessage({ type: 'error', text: `Failed to ${editingUser ? 'update' : 'create'} user: ${e.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsFormOpen(true);
    setFeedbackMessage({ type: '', text: '' });
  };

  const handleDelete = (userId, userName) => {
    setUserToDelete({ id: userId, name: userName });
    setIsDeleteModalOpen(true);
    setFeedbackMessage({ type: '', text: '' });
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    setIsLoading(true);
    setFeedbackMessage({ type: '', text: '' });
    try {
      const response = await fetch(`${API_URL}/${userToDelete.id}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Operation failed with status ' + response.status }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      setFeedbackMessage({ type: 'success', text: `User "${userToDelete.name}" deleted successfully!` });
      fetchUsers(); // Refresh list
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (e) {
      setError(e.message);
      setFeedbackMessage({ type: 'error', text: `Failed to delete user: ${e.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-2 sm:p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">Manage Users</h1>
        <button onClick={() => { setEditingUser(null); setIsFormOpen(true); setFeedbackMessage({ type: '', text: '' });}} className="btn btn-primary">
          <FaPlus className="mr-2" /> Add New User
        </button>
      </div>

      {feedbackMessage.text && (
        <div className={`alert ${feedbackMessage.type === 'error' ? 'alert-error' : 'alert-success'} shadow-sm mb-4 p-3 text-sm`}>
          {feedbackMessage.text}
        </div>
      )}
      
      {isLoading && <div className="text-center py-4"><span className="loading loading-lg loading-spinner text-primary"></span></div>}
      {!isLoading && error && !feedbackMessage.text && <div className="alert alert-error shadow-sm mb-4 p-3 text-sm">Error: {error}</div>}
      
      {!isLoading && !error && <UsersTable users={users} onEdit={handleEdit} onDelete={handleDelete} />}
      
      <UserForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleFormSubmit} 
        initialData={editingUser}
      />
      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={userToDelete?.name}
      />
    </div>
  );
};

export default ManageUsersPage;