import React, { useState, useEffect, useCallback } from 'react';
import StockInTable from '../../components/crud/StockInTable';
import StockInForm from '../../components/crud/StockInForm';
import DeleteConfirmationModal from '../../components/crud/DeleteConfirmationModal';
import { FaPlus } from 'react-icons/fa';

const API_STOCK_IN_URL = 'http://localhost:3004/api/stock_in';
const API_PRODUCTS_URL = 'http://localhost:3004/api/products';

const ManageStockInPage = () => {
  const [stockRecords, setStockRecords] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null); // { id: recordId, name: description }

  const [feedbackMessage, setFeedbackMessage] = useState({ type: '', text: '' });

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(API_PRODUCTS_URL);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProductsList(data);
    } catch (e) {
      setError(e.message); // Or handle more gracefully
      setFeedbackMessage({ type: 'error', text: `Failed to fetch products: ${e.message}` });
    }
  }, []);
  
  const fetchStockInRecords = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_STOCK_IN_URL);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      // IMPORTANT: Assuming backend returns a unique 'id' for each stock_in record.
      // If not, PUT/DELETE operations will be problematic.
      setStockRecords(data); 
    } catch (e) {
      setError(e.message);
      setFeedbackMessage({ type: 'error', text: `Failed to fetch stock-in records: ${e.message}` });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchStockInRecords();
  }, [fetchProducts, fetchStockInRecords]);

  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    setFeedbackMessage({ type: '', text: '' });
    // Your schema for Stock_In doesn't have its own primary key.
    // The API for PUT/DELETE needs a unique identifier.
    // Assuming your backend POST returns the created record with an 'id',
    // or that PUT uses productID+date if 'id' is not present.
    // For this example, we assume 'id' is used for PUT if present in `editingRecord`.
    const method = editingRecord && editingRecord.id ? 'PUT' : 'POST';
    const url = editingRecord && editingRecord.id ? `${API_STOCK_IN_URL}/${editingRecord.id}` : API_STOCK_IN_URL;
    
    const payload = {
        productID: parseInt(formData.productID),
        quantity: parseInt(formData.quantity),
        date: formData.date,
    };
    // If it's an update and we have an ID, include it (some backends might expect it in body too)
    // if (editingRecord && editingRecord.id) {
    //   payload.id = editingRecord.id;
    // }


    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Operation failed' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      setFeedbackMessage({ type: 'success', text: `Stock-in record ${editingRecord ? 'updated' : 'created'} successfully!` });
      fetchStockInRecords();
      setIsFormOpen(false);
      setEditingRecord(null);
    } catch (e) {
      setError(e.message);
      setFeedbackMessage({ type: 'error', text: `Failed to ${editingRecord ? 'update' : 'create'} record: ${e.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (record) => {
    if (!record.id) {
        setFeedbackMessage({ type: 'error', text: 'Cannot edit record without a unique ID.' });
        return;
    }
    setEditingRecord(record);
    setIsFormOpen(true);
    setFeedbackMessage({ type: '', text: '' });
  };

  const handleDelete = (recordId, recordName) => {
     if (!recordId) {
        setFeedbackMessage({ type: 'error', text: 'Cannot delete record without a unique ID.' });
        return;
    }
    setRecordToDelete({ id: recordId, name: recordName });
    setIsDeleteModalOpen(true);
    setFeedbackMessage({ type: '', text: '' });
  };

  const confirmDelete = async () => {
    if (!recordToDelete || !recordToDelete.id) return;
    setIsLoading(true);
    setFeedbackMessage({ type: '', text: '' });
    try {
      const response = await fetch(`${API_STOCK_IN_URL}/${recordToDelete.id}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Operation failed' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      setFeedbackMessage({ type: 'success', text: `Stock-in record deleted successfully!` });
      fetchStockInRecords();
      setIsDeleteModalOpen(false);
      setRecordToDelete(null);
    } catch (e) {
      setError(e.message);
      setFeedbackMessage({ type: 'error', text: `Failed to delete record: ${e.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-2 sm:p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">Manage Stock In</h1>
        <button onClick={() => { setEditingRecord(null); setIsFormOpen(true); setFeedbackMessage({ type: '', text: '' });}} className="btn btn-primary">
          <FaPlus className="mr-2" /> Add Stock In Record
        </button>
      </div>

       {feedbackMessage.text && (
        <div className={`alert ${feedbackMessage.type === 'error' ? 'alert-error' : 'alert-success'} shadow-sm mb-4 p-3 text-sm`}>
          {feedbackMessage.text}
        </div>
      )}

      {isLoading && <div className="text-center py-4"><span className="loading loading-lg loading-spinner text-primary"></span></div>}
      {!isLoading && error && !feedbackMessage.text && <div className="alert alert-error shadow-sm mb-4 p-3 text-sm">Error: {error}</div>}
      
      {!isLoading && !error && <StockInTable stockRecords={stockRecords} productsList={productsList} onEdit={handleEdit} onDelete={handleDelete} />}
      
      <StockInForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleFormSubmit} 
        initialData={editingRecord}
        productsList={productsList}
      />
      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={recordToDelete?.name}
      />
    </div>
  );
};

export default ManageStockInPage;