import React, { useState, useEffect, useCallback } from 'react';
import { FaPlus } from 'react-icons/fa';
import StockOutForm from '../../components/crud/StockOutForm';
import DeleteConfirmationModal from '../../components/crud/DeleteConfirmationModal';
import StockOutTable from '../../components/crud/StockOutTable';

const API_STOCK_OUT_URL = 'http://localhost:3004/api/stock/out';

const ManageStockOutPage = () => {
  const [stockRecords, setStockRecords] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  const [feedbackMessage, setFeedbackMessage] = useState({ type: '', text: '' });

  const fetchProducts = useCallback(async () => {
    // Re-using API_PRODUCTS_URL from StockIn or define locally
    const productsApiUrl = 'http://localhost:3004/api/products';
    try {
      const response = await fetch(productsApiUrl);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProductsList(data);
    } catch (e) {
      setError(e.message);
      setFeedbackMessage({ type: 'error', text: `Failed to fetch products: ${e.message}` });
    }
  }, []);
  
  const fetchStockOutRecords = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_STOCK_OUT_URL);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setStockRecords(data);
    } catch (e) {
      setError(e.message);
      setFeedbackMessage({ type: 'error', text: `Failed to fetch stock-out records: ${e.message}` });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchStockOutRecords();
  }, [fetchProducts, fetchStockOutRecords]);

  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    setFeedbackMessage({ type: '', text: '' });
    const method = editingRecord && editingRecord.id ? 'PUT' : 'POST';
    const url = editingRecord && editingRecord.id ? `${API_STOCK_OUT_URL}/${editingRecord.id}` : API_STOCK_OUT_URL;
    
    const payload = {
        productID: parseInt(formData.productID),
        quantity: parseInt(formData.quantity),
        date: formData.date,
    };

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
      setFeedbackMessage({ type: 'success', text: `Stock-out record ${editingRecord ? 'updated' : 'created'} successfully!` });
      fetchStockOutRecords();
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
      const response = await fetch(`${API_STOCK_OUT_URL}/${recordToDelete.id}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Operation failed' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      setFeedbackMessage({ type: 'success', text: `Stock-out record deleted successfully!` });
      fetchStockOutRecords();
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
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">Manage Stock Out</h1>
        <button onClick={() => { setEditingRecord(null); setIsFormOpen(true); setFeedbackMessage({ type: '', text: '' });}} className="btn btn-primary">
          <FaPlus className="mr-2" /> Add Stock Out Record
        </button>
      </div>

      {feedbackMessage.text && (
        <div className={`alert ${feedbackMessage.type === 'error' ? 'alert-error' : 'alert-success'} shadow-sm mb-4 p-3 text-sm`}>
          {feedbackMessage.text}
        </div>
      )}

      {isLoading && <div className="text-center py-4"><span className="loading loading-lg loading-spinner text-primary"></span></div>}
      {!isLoading && error && !feedbackMessage.text && <div className="alert alert-error shadow-sm mb-4 p-3 text-sm">Error: {error}</div>}
      
      {!isLoading && !error && <StockOutTable stockRecords={stockRecords} productsList={productsList} onEdit={handleEdit} onDelete={handleDelete} />}
      
      <StockOutForm
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

export default ManageStockOutPage;