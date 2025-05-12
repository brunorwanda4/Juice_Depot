import React, { useState, useEffect, useRef } from 'react';

const UserForm = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    userName: '',
    passWord: '',
    userType: 'WORKER', // Default user type
  });
  const [error, setError] = useState('');
  const modalRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        userName: initialData.userName || '',
        // Password should generally not be pre-filled for editing for security.
        // If updating password, it should be a separate flow or clearly indicated.
        passWord: '', // Clear password for edit form
        userType: initialData.userType || 'WORKER',
      });
    } else {
      // Reset for new user
      setFormData({ userName: '', passWord: '', userType: 'WORKER' });
    }
  }, [initialData]);


  useEffect(() => {
    if (isOpen) {
      modalRef.current?.showModal();
      setError(''); // Clear previous errors when modal opens
    } else {
      modalRef.current?.close();
    }
  }, [isOpen]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.userName || (!initialData && !formData.passWord) || !formData.userType) {
      setError('All fields except password (for update) are required.');
      return;
    }
    onSubmit(formData);
  };

  const formTitle = initialData ? "Edit User" : "Add New User";
  const submitButtonText = initialData ? "Update User" : "Create User";

  if (!isOpen) return null;

  return (
    <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box w-11/12 max-w-lg">
        <h3 className="font-bold text-xl mb-6 text-primary">{formTitle}</h3>
        {error && <div className="alert alert-error shadow-sm mb-4 p-3 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text">Username</span>
            </label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="Enter username"
              className="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              name="passWord"
              value={formData.passWord}
              onChange={handleChange}
              placeholder={initialData ? "Leave blank to keep current password" : "Enter password"}
              className="input input-bordered w-full"
              // Required only if not initialData (i.e., creating new user)
              required={!initialData} 
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">User Type</span>
            </label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="WORKER">Worker</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div className="modal-action mt-6">
            <button type="button" className="btn btn-ghost mr-2" onClick={() => { onClose(); modalRef.current?.close();}}>Cancel</button>
            <button type="submit" className="btn btn-primary">{submitButtonText}</button>
          </div>
        </form>
      </div>
       <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default UserForm;