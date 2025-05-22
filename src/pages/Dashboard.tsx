
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProduct } from '../context/ProductContext';
import { Navigate, Link } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import ProductGrid from '../components/Products/ProductGrid';
import AddProductModal from '../components/Admin/AddProductModal';
import AddCategoryModal from '../components/Admin/AddCategoryModal';
import AddSubcategoryModal from '../components/Admin/AddSubcategoryModal';

const Dashboard = () => {
  const { user } = useAuth();
  const { products } = useProduct();
  const [selectedCategory, setSelectedCategory] = useState('All categories');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddSubcategory, setShowAddSubcategory] = useState(false);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const filteredProducts = selectedCategory === 'All categories' 
    ? products 
    : products.filter(product => 
        product.category === selectedCategory || product.subcategory === selectedCategory
      );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        <Sidebar 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        
        <div className="flex-1 p-6">
          {/* Breadcrumb */}
          <nav className="mb-4">
            <Link to="/dashboard" className="text-blue-600 hover:text-blue-800">
              Home
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex space-x-3 mb-6">
            <button
              onClick={() => setShowAddCategory(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition-colors"
            >
              Add Category
            </button>
            <button
              onClick={() => setShowAddSubcategory(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition-colors"
            >
              Add sub category
            </button>
            <button
              onClick={() => setShowAddProduct(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition-colors"
            >
              Add product
            </button>
          </div>

          {/* Products Grid */}
          <ProductGrid products={filteredProducts} />

          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              <button className="w-8 h-8 bg-orange-500 text-white rounded-full">1</button>
              <button className="w-8 h-8 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300">2</button>
              <button className="w-8 h-8 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300">3</button>
              <button className="w-8 h-8 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300">4</button>
              <button className="w-8 h-8 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300">5</button>
              <button className="w-8 h-8 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300">6</button>
            </div>
            <div className="ml-4 text-sm text-gray-600">
              Show: 50 result
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddProductModal isOpen={showAddProduct} onClose={() => setShowAddProduct(false)} />
      <AddCategoryModal isOpen={showAddCategory} onClose={() => setShowAddCategory(false)} />
      <AddSubcategoryModal isOpen={showAddSubcategory} onClose={() => setShowAddSubcategory(false)} />
    </div>
  );
};

export default Dashboard;
