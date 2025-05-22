import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { User, AuthFormData } from "../types";
import apiService from "../services/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (data: AuthFormData) => Promise<void>;
  signUp: (data: AuthFormData) => Promise<void>;
  signOut: () => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      // Optionally verify token with backend
      apiService
        .getCurrentUser()
        .then((userData) => setUser(userData))
        .catch(() => {
          // Token is invalid, clear it
          apiService.logout();
        });
    }
  }, []);

  const signIn = async (data: AuthFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const authResponse = await apiService.login({
        email: data.email,
        password: data.password,
      });

      setUser(authResponse.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (data: AuthFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!data.name || data.name.length < 2) {
        throw new Error("Name must be at least 2 characters long");
      }

      if (!data.email.includes("@")) {
        throw new Error("Please enter a valid email address");
      }

      if (data.password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      const authResponse = await apiService.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      setUser(authResponse.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    apiService.logout();
    setUser(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
