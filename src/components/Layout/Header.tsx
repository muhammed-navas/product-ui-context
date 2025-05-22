
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProduct } from '../../context/ProductContext';
import { FaSearch, FaUser, FaShoppingCart } from 'react-icons/fa';
import CartSidebar from '../Cart/CartSidebar';

const Header = () => {
  const { user, signOut } = useAuth();
  const { cart } = useProduct();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <>
      <header className="bg-gradient-to-r from-blue-800 to-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <form onSubmit={handleSearch} className="flex">
                <input
                  type="text"
                  placeholder="Search any things"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-l-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-r-lg transition-colors"
                >
                  <FaSearch />
                </button>
              </form>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4 ml-6">
              {user ? (
                <div className="flex items-center space-x-2">
                  <FaUser className="text-lg" />
                  <span className="text-sm">{user.name}</span>
                  <button
                    onClick={signOut}
                    className="text-sm hover:text-orange-300 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <FaUser className="text-lg" />
                  <span className="text-sm">Sign in</span>
                </div>
              )}

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center space-x-1 hover:text-orange-300 transition-colors"
              >
                <FaShoppingCart className="text-lg" />
                <span className="text-sm">Cart</span>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;
