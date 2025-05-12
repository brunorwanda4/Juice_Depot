import React, { useState, useEffect, useRef } from "react";

const ProductForm = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    productName: "",
    buyUnitPrice: "",
    sellUnitPrice: "",
  });
  const [error, setError] = useState("");
  const modalRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        productName: initialData.productName || "",
        buyUnitPrice: initialData.buyUnitPrice || "",
        sellUnitPrice: initialData.sellUnitPrice || "",
      });
    } else {
      setFormData({ productName: "", buyUnitPrice: "", sellUnitPrice: "" });
    }
  }, [initialData]);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.showModal();
      setError("");
    } else {
      modalRef.current?.close();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.productName ||
      !formData.buyUnitPrice ||
      !formData.sellUnitPrice
    ) {
      setError("All fields are required.");
      return;
    }
    if (
      isNaN(parseFloat(formData.buyUnitPrice)) ||
      isNaN(parseFloat(formData.sellUnitPrice))
    ) {
      setError("Buy and Sell prices must be valid numbers.");
      return;
    }
    if (
      parseFloat(formData.buyUnitPrice) < 0 ||
      parseFloat(formData.sellUnitPrice) < 0
    ) {
      setError("Prices cannot be negative.");
      return;
    }
    onSubmit(formData);
  };

  const formTitle = initialData ? "Edit Product" : "Add New Product";
  const submitButtonText = initialData ? "Update Product" : "Create Product";

  if (!isOpen) return null;

  return (
    <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box w-11/12 max-w-lg">
        <h3 className="font-bold text-xl mb-6 text-primary">{formTitle}</h3>
        {error && (
          <div className="alert alert-error shadow-sm mb-4 p-3 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text">Product Name</span>
            </label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder="Enter product name"
              className="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Buy Unit Price ($)</span>
            </label>
            <input
              type="number"
              name="buyUnitPrice"
              value={formData.buyUnitPrice}
              onChange={handleChange}
              placeholder="0.00"
              className="input input-bordered w-full"
              step="0.01"
              min="0"
              required
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Sell Unit Price ($)</span>
            </label>
            <input
              type="number"
              name="sellUnitPrice"
              value={formData.sellUnitPrice}
              onChange={handleChange}
              placeholder="0.00"
              className="input input-bordered w-full"
              step="0.01"
              min="0"
              required
            />
          </div>
          <div className="modal-action mt-6">
            <button
              type="button"
              className="btn btn-ghost mr-2"
              onClick={() => {
                onClose();
                modalRef.current?.close();
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {submitButtonText}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default ProductForm;
