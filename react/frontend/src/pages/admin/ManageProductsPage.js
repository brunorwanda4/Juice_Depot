import React, { useState, useEffect, useCallback } from 'react';
import ProductsTable from '../../components/crud/ProductsTable';
import ProductForm from '../../components/crud/ProductForm';
import DeleteConfirmationModal from '../../components/crud/DeleteConfirmationModal';
import { FaPlus } from 'react-icons/fa';

const API_URL = 'http://localhost:3004/api/products';

const ManageProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null); // { id: productId, name: productName }

  const [feedbackMessage, setFeedbackMessage] = useState({ type: '', text: '' });

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setProducts(data);
    } catch (e) {
      setError(e.message);
      setFeedbackMessage({ type: 'error', text: `Failed to fetch products: ${e.message}` });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    setFeedbackMessage({ type: '', text: '' });
    const method = editingProduct ? 'PUT' : 'POST';
    const url = editingProduct ? `${API_URL}/${editingProduct.productID}` : API_URL;
    
    const payload = {
        ...formData,
        buyUnitPrice: parseFloat(formData.buyUnitPrice),
        sellUnitPrice: parseFloat(formData.sellUnitPrice),
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
      setFeedbackMessage({ type: 'success', text: `Product ${editingProduct ? 'updated' : 'created'} successfully!` });
      fetchProducts();
      setIsFormOpen(false);
      setEditingProduct(null);
    } catch (e) {
      setError(e.message);
      setFeedbackMessage({ type: 'error', text: `Failed to ${editingProduct ? 'update' : 'create'} product: ${e.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
    setFeedbackMessage({ type: '', text: '' });
  };

  const handleDelete = (productId, productName) => {
    setProductToDelete({ id: productId, name: productName });
    setIsDeleteModalOpen(true);
    setFeedbackMessage({ type: '', text: '' });
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    setIsLoading(true);
    setFeedbackMessage({ type: '', text: '' });
    try {
      const response = await fetch(`${API_URL}/${productToDelete.id}`, { method: 'DELETE' });
      if (!response.ok) {
         const errorData = await response.json().catch(() => ({ message: 'Operation failed' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      setFeedbackMessage({ type: 'success', text: `Product "${productToDelete.name}" deleted successfully!` });
      fetchProducts();
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (e) {
      setError(e.message);
      setFeedbackMessage({ type: 'error', text: `Failed to delete product: ${e.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-2 sm:p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">Manage Products</h1>
        <button onClick={() => { setEditingProduct(null); setIsFormOpen(true); setFeedbackMessage({ type: '', text: '' });}} className="btn btn-primary">
          <FaPlus className="mr-2" /> Add New Product
        </button>
      </div>

      {feedbackMessage.text && (
        <div className={`alert ${feedbackMessage.type === 'error' ? 'alert-error' : 'alert-success'} shadow-sm mb-4 p-3 text-sm`}>
          {feedbackMessage.text}
        </div>
      )}

      {isLoading && <div className="text-center py-4"><span className="loading loading-lg loading-spinner text-primary"></span></div>}
      {!isLoading && error && !feedbackMessage.text && <div className="alert alert-error shadow-sm mb-4 p-3 text-sm">Error: {error}</div>}
      
      {!isLoading && !error && <ProductsTable products={products} onEdit={handleEdit} onDelete={handleDelete} />}
      
      <ProductForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleFormSubmit} 
        initialData={editingProduct}
      />
      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={productToDelete?.name}
      />
    </div>
  );
};

export default ManageProductsPage;
