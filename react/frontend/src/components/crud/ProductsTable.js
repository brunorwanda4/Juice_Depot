import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ProductsTable = ({ products, onEdit, onDelete }) => {
  if (!products || products.length === 0) {
    return <p className="text-center text-gray-500 py-4">No products found.</p>;
  }

  return (
    <div className="overflow-x-auto shadow-lg rounded-lg bg-base-100">
      <table className="table w-full">
        <thead>
          <tr className="bg-base-200">
            <th>ID</th>
            <th>Name</th>
            <th>Buy Price</th>
            <th>Sell Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.productID} className="hover">
              <td>{product.productID}</td>
              <td>{product.productName}</td>
              <td>${parseFloat(product.buyUnitPrice).toFixed(2)}</td>
              <td>${parseFloat(product.sellUnitPrice).toFixed(2)}</td>
              <td>
                <button onClick={() => onEdit(product)} className="btn btn-sm btn-outline btn-info mr-2 p-2">
                  <FaEdit />
                </button>
                <button onClick={() => onDelete(product.productID, product.productName)} className="btn btn-sm btn-outline btn-error p-2">
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

export default ProductsTable;