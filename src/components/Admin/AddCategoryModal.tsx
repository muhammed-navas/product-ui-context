
import React, { useState } from 'react';
import { useProduct } from '../../context/ProductContext';
import { FaTimes } from 'react-icons/fa';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddCategoryModal = ({ isOpen, onClose }: AddCategoryModalProps) => {
  const { addCategory, isLoading, error, clearError } = useProduct();
  const [categoryName, setCategoryName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await addCategory(categoryName);
      onClose();
      setCategoryName('');
    } catch (err) {
      console.error('Failed to add category:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Add Category</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Enter category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Adding...' : 'ADD'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded transition-colors"
              >
                DISCARD
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;
