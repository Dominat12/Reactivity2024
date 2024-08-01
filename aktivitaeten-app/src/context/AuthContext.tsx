import React, { createContext, useState, useEffect, useContext } from 'react';
import { login, logout, checkAuthStatus } from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    checkAuthStatus().then(user => {
      if (user) {
        setIsAuthenticated(true);
        setUser(user);
      }
    });
  }, []);

  const loginHandler = async (username: string, password: string) => {
    try {
      await login(username, password);
      setIsAuthenticated(true);
      const user = await checkAuthStatus();
      setUser(user);
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const logoutHandler = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login: loginHandler, logout: logoutHandler }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};