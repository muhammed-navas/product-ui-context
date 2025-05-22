
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { FaStar, FaHeart } from 'react-icons/fa';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();

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

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-48 object-cover"
        />
        <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
          <FaHeart className="text-gray-400 hover:text-red-500" />
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 truncate">{product.title}</h3>
        <p className="text-2xl font-bold text-gray-900 mb-2">${product.price}</p>
        
        <div className="flex items-center mb-3">
          <div className="flex mr-2">
            {renderStars(Math.floor(product.rating))}
          </div>
          <span className="text-sm text-gray-600">({product.rating})</span>
        </div>
        
        <button
          onClick={() => navigate(`/product/${product.id}`)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
