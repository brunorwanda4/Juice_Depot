import React, { useState, useEffect, useRef } from 'react';

const StockInForm = ({ isOpen, onClose, onSubmit, initialData, productsList }) => {
  const [formData, setFormData] = useState({
    // Assuming your backend returns/expects 'id' for stock records
    // If not, this 'id' is just for frontend tracking if initialData has it
    id: '', 
    productID: '',
    quantity: '',
    date: new Date().toISOString().split('T')[0], // Default to today
  });
  const [error, setError] = useState('');
  const modalRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || '', // Keep track of actual stock record ID if available
        productID: initialData.productID || '',
        quantity: initialData.quantity || '',
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      });
    } else {
      setFormData({ id: '', productID: '', quantity: '', date: new Date().toISOString().split('T')[0] });
    }
  }, [initialData]);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.showModal();
      setError('');
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
    if (!formData.productID || !formData.quantity || !formData.date) {
      setError('All fields are required.');
      return;
    }
    if (isNaN(parseInt(formData.quantity)) || parseInt(formData.quantity) <= 0) {
        setError('Quantity must be a positive number.');
        return;
    }
    // Remove 'id' before sending if it's a new record, or if your backend doesn't expect it in payload
    const payload = { ...formData };
    if (!initialData) delete payload.id; 

    onSubmit(payload);
  };

  const formTitle = initialData ? "Edit Stock In Record" : "Add New Stock In Record";
  const submitButtonText = initialData ? "Update Record" : "Create Record";

  if (!isOpen) return null;

  return (
    <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box w-11/12 max-w-lg">
        <h3 className="font-bold text-xl mb-6 text-primary">{formTitle}</h3>
        {error && <div className="alert alert-error shadow-sm mb-4 p-3 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label"><span className="label-text">Product</span></label>
            <select 
              name="productID" 
              value={formData.productID} 
              onChange={handleChange} 
              className="select select-bordered w-full" 
              required
              disabled={!!initialData && !!initialData.id} // Disable if editing an existing record with an ID
            >
              <option value="" disabled>Select a product</option>
              {productsList && productsList.map(p => (
                <option key={p.productID} value={p.productID}>{p.productName} (ID: {p.productID})</option>
              ))}
            </select>
            {initialData && initialData.id && <p className="text-xs text-gray-500 mt-1">Product cannot be changed for existing records.</p>}
          </div>
          <div>
            <label className="label"><span className="label-text">Quantity</span></label>
            <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="Enter quantity" className="input input-bordered w-full" min="1" required />
          </div>
          <div>
            <label className="label"><span className="label-text">Date</span></label>
            <input 
              type="date" name="date" value={formData.date} onChange={handleChange} 
              className="input input-bordered w-full" 
              required 
              disabled={!!initialData && !!initialData.id} // Disable if editing an existing record with an ID
            />
             {initialData && initialData.id && <p className="text-xs text-gray-500 mt-1">Date cannot be changed for existing records.</p>}
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

export default StockInForm;