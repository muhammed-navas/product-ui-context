
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ProductDetail from './pages/ProductDetail';

const App = () => {
  return (
    <AuthProvider>
      <ProductProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/auth" replace />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/product/:id" element={<ProductDetail />} />
          </Routes>
        </BrowserRouter>
      </ProductProvider>
    </AuthProvider>
  );
};

export default App;
