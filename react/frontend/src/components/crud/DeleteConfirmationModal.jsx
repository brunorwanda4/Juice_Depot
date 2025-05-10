import React, { useRef, useEffect } from 'react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.showModal();
    } else {
      modalRef.current?.close();
    }
  }, [isOpen]);

  if (!isOpen) return null; // Or handle visibility purely with dialog's open/close methods

  return (
    <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-lg text-error">Confirm Deletion</h3>
        <p className="py-4">Are you sure you want to delete "{itemName || 'this item'}"? This action cannot be undone.</p>
        <div className="modal-action">
          <button className="btn btn-outline" onClick={() => { onClose(); modalRef.current?.close(); }}>Cancel</button>
          <button className="btn btn-error" onClick={onConfirm}>Delete</button>
        </div>
      </div>
      {/* Optional: Click outside to close */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default DeleteConfirmationModal;

