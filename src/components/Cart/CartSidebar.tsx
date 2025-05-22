
import React from 'react';
import { useProduct } from '../../context/ProductContext';
import { FaTimes, FaMinus, FaPlus } from 'react-icons/fa';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar = ({ isOpen, onClose }: CartSidebarProps) => {
  const { cart, removeFromCart } = useProduct();

  const total = cart.reduce((sum, item) => sum + (item.variant.price * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 overflow-y-auto">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Items</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="p-4">
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 border-b pb-4">
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{item.product.title}</h3>
                    <p className="text-sm text-gray-600">${item.variant.price}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">RAM: {item.variant.ram}</span>
                      <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTimes className="text-sm" />
                  </button>
                </div>
              ))}
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center font-semibold">
                  <span>Total: ${total.toFixed(2)}</span>
                </div>
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded mt-4 transition-colors">
                  Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
