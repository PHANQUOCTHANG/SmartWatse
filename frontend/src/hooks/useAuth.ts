import React, { useContext } from "react";

interface User {
  id: string;
  email: string;
  fullName: string;
  role?: string;
  status?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (data: any) => Promise<void>;
}

// Create a simple auth context - you can replace this with your actual auth context
const AuthContext = React.createContext<AuthContextType | null>(null);

export const useAuth = () => {
  // Try to get user from localStorage or session
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  return {
    user,
    isLoading: false,
    isAuthenticated: !!user,
    login: async () => {},
    logout: async () => {},
    signup: async () => {},
  };
};
