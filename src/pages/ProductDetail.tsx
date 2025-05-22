
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProduct } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Layout/Header';
import { FaStar, FaHeart, FaMinus, FaPlus } from 'react-icons/fa';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { products, addToCart } = useProduct();
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!user) {
    navigate('/auth');
    return null;
  }

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl text-gray-600">Product not found</h1>
          <Link to="/dashboard" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const currentVariant = product.variants[selectedVariant];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={`text-sm ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleAddToCart = () => {
    addToCart(product, currentVariant, quantity);
  };

  const adjustQuantity = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= currentVariant.quantity) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link to="/dashboard" className="text-blue-600 hover:text-blue-800">
            Home
          </Link>
          <span className="mx-2 text-gray-500">&gt;</span>
          <span className="text-gray-700">Product details</span>
        </nav>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Product Images */}
            <div className="md:w-1/2 p-6">
              <div className="mb-4">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-80 object-cover rounded-lg"
                />
              </div>
              <div className="flex space-x-2">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-20 h-20 object-cover rounded border-2 border-blue-500"
                />
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-20 h-20 object-cover rounded border-2 border-gray-200"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="md:w-1/2 p-6">
              <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
              <p className="text-3xl font-bold text-gray-900 mb-4">
                ${currentVariant.price}
              </p>

              <div className="mb-4">
                <span className="text-sm font-medium">Availability: </span>
                <span className="text-green-600 text-sm">✓ In stock</span>
                <p className="text-sm text-gray-600 mt-1">
                  Hurry up! only {currentVariant.quantity} product left in stock!
                </p>
              </div>

              {/* RAM Options */}
              <div className="mb-4">
                <span className="text-sm font-medium mb-2 block">Ram:</span>
                <div className="flex space-x-2">
                  {product.variants.map((variant, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedVariant(index);
                        setQuantity(1);
                      }}
                      className={`px-3 py-1 border rounded text-sm transition-colors ${
                        selectedVariant === index
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {variant.ram}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <span className="text-sm font-medium mb-2 block">Quantity:</span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => adjustQuantity(-1)}
                    disabled={quantity <= 1}
                    className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
                  >
                    <FaMinus className="text-sm" />
                  </button>
                  <span className="w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => adjustQuantity(1)}
                    disabled={quantity >= currentVariant.quantity}
                    className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
                  >
                    <FaPlus className="text-sm" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 mb-6">
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded transition-colors">
                  Edit product
                </button>
                <button
                  onClick={handleAddToCart}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded transition-colors"
                >
                  Buy it now
                </button>
                <button className="p-3 border rounded hover:bg-gray-50">
                  <FaHeart className="text-gray-600" />
                </button>
              </div>

              {/* Rating */}
              <div className="flex items-center">
                <div className="flex mr-2">
                  {renderStars(Math.floor(product.rating))}
                </div>
                <span className="text-sm text-gray-600">({product.rating})</span>
              </div>

              {/* Description */}
              <div className="mt-6">
                <p className="text-gray-700">{product.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
