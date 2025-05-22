
import React, { useState } from 'react';
import { useProduct } from '../../context/ProductContext';
import { ProductFormData, ProductVariant } from '../../types';
import { FaTimes, FaPlus } from 'react-icons/fa';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddProductModal = ({ isOpen, onClose }: AddProductModalProps) => {
  const { addProduct, categories, isLoading, error, clearError } = useProduct();
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    price: 0,
    description: '',
    category: '',
    subcategory: '',
    variants: [{ ram: '4 GB', price: 0, quantity: 0 }],
    image: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await addProduct(formData);
      onClose();
      setFormData({
        title: '',
        price: 0,
        description: '',
        category: '',
        subcategory: '',
        variants: [{ ram: '4 GB', price: 0, quantity: 0 }],
        image: ''
      });
    } catch (err) {
      console.error('Failed to add product:', err);
    }
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { ram: '4 GB', price: 0, quantity: 0 }]
    }));
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) => 
        i === index ? { ...variant, [field]: value } : variant
      )
    }));
  };

  const removeVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const selectedCategory = categories.find(cat => cat.name === formData.category);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Add Product</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Title :</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Variants :</label>
              <div className="space-y-3">
                {formData.variants.map((variant, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-gray-50 p-3 rounded">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 mb-1">Ram:</label>
                      <select
                        value={variant.ram}
                        onChange={(e) => updateVariant(index, 'ram', e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                      >
                        <option>4 GB</option>
                        <option>8 GB</option>
                        <option>16 GB</option>
                        <option>32 GB</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 mb-1">Price:</label>
                      <input
                        type="number"
                        step="0.01"
                        value={variant.price}
                        onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 mb-1">Qty:</label>
                      <input
                        type="number"
                        value={variant.quantity}
                        onChange={(e) => updateVariant(index, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                    </div>
                    {formData.variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addVariant}
                  className="flex items-center space-x-2 text-sm bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                >
                  <FaPlus />
                  <span>Add variants</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Sub category :</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value, subcategory: '' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedCategory && (
              <div>
                <label className="block text-sm font-medium mb-1">Subcategory :</label>
                <select
                  value={formData.subcategory}
                  onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="">Select subcategory</option>
                  {selectedCategory.subcategories.map((subcategory) => (
                    <option key={subcategory} value={subcategory}>
                      {subcategory}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Description :</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Upload Image :</label>
              <input
                type="url"
                placeholder="Enter image URL"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
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

export default AddProductModal;
