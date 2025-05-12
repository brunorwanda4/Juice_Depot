import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const StockOutTable = ({ stockRecords, productsList, onEdit, onDelete }) => {
  if (!stockRecords || stockRecords.length === 0) {
    return <p className="text-center text-gray-500 py-4">No stock-out records found.</p>;
  }

  const getProductName = (productId) => {
    const product = productsList.find(p => p.productID === productId);
    return product ? product.productName : 'Unknown Product';
  };

  return (
    <div className="overflow-x-auto shadow-lg rounded-lg bg-base-100">
      <table className="table w-full">
        <thead>
          <tr className="bg-base-200">
            <th>Record ID</th>
            <th>Product Name (ID)</th>
            <th>Quantity</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stockRecords.map(record => (
            <tr key={record.stockOutID || `${record.productID}-${record.date}`} className="hover">
              <td>{record.stockOutID || 'N/A'}</td>
              <td>{getProductName(record.productID)} ({record.productID})</td>
              <td>{record.quantity}</td>
              <td>{new Date(record.date).toLocaleDateString()}</td>
              <td>
                <button 
                  onClick={() => onEdit(record)} 
                  className="btn btn-sm btn-outline btn-info mr-2 p-2"
                  disabled={!record.stockOutID}
                >
                  <FaEdit />
                </button>
                <button 
                  onClick={() => onDelete(
                    record.stockOutID, 
                    `${getProductName(record.productID)} (${record.quantity} units) on ${new Date(record.date).toLocaleDateString()}`
                  )} 
                  className="btn btn-sm btn-outline btn-error p-2"
                  disabled={!record.stockOutID}
                >
                  <FaTrash />
                </button>
                {!record.stockOutID && <span className="text-xs text-warning"> (Actions disabled: No unique ID)</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockOutTable;