
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AuthFormData } from '../../types';

const SignInForm = () => {
  const { signIn, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<AuthFormData>>({});

  const validateForm = () => {
    const errors: Partial<AuthFormData> = {};
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!formData.email.includes('@')) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) return;
    
    await signIn(formData);
  };

  const handleInputChange = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
    if (error) clearError();
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-3xl font-bold text-orange-500 mb-2">Sign In to</h2>
      <h3 className="text-3xl font-bold text-orange-500 mb-8">Your Account</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                formErrors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {formErrors.email && (
            <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
          )}
        </div>

        <div>
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                formErrors.password ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {formErrors.password && (
            <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
          )}
        </div>

        <div className="text-center">
          <button type="button" className="text-gray-600 text-sm hover:text-gray-800">
            forgot password?
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Signing In...' : 'SIGN IN'}
        </button>
      </form>
      
    </div>
  );
};

export default SignInForm;
