
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import SignInForm from '../components/Auth/SignInForm';
import SignUpForm from '../components/Auth/SignUpForm';

const AuthPage = () => {
  const { user } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Welcome/Hello */}
      <div className="flex-1 bg-gradient-to-br from-blue-800 to-blue-900 text-white flex items-center justify-center relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-20 w-20 h-20 bg-blue-600 opacity-30 transform rotate-45"></div>
        <div className="absolute bottom-32 right-16 w-32 h-32 bg-blue-600 opacity-20 rounded-full"></div>
        <div className="absolute top-1/2 right-32 w-16 h-16 bg-blue-500 opacity-25 transform rotate-12"></div>
        <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-blue-700 opacity-30 transform -rotate-12"></div>
        
        <div className="text-center z-10">
          {isSignUp ? (
            <>
              <h1 className="text-4xl font-bold mb-4">Hello Friend!</h1>
              <p className="text-lg mb-8 max-w-md">
                Enter your personal details and start your journey with us
              </p>
              <button
                onClick={() => setIsSignUp(false)}
                className="border-2 border-white text-white px-8 py-3 rounded-full hover:bg-white hover:text-blue-800 transition-all duration-300"
              >
                SIGN UP
              </button>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
              <p className="text-lg mb-8 max-w-md">
                To keep connected with us please login with your personal info
              </p>
              <button
                onClick={() => setIsSignUp(true)}
                className="border-2 border-white text-white px-8 py-3 rounded-full hover:bg-white hover:text-blue-800 transition-all duration-300"
              >
                SIGN IN
              </button>
            </>
          )}
        </div>
      </div>

      {/* Right Side - Forms */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        {isSignUp ? <SignUpForm /> : <SignInForm />}
      </div>
    </div>
  );
};

export default AuthPage;
