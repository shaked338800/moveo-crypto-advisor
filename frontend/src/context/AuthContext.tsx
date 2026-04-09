import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getMeApi } from '@/api/auth.api';

export interface Preference {
  coins: string[];
  investorType: string;
  contentTypes: string[];
}

interface User {
  id: number;
  name: string;
  email: string;
  onboardingCompleted: boolean;
  preference: Preference | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!!localStorage.getItem('token'));

  // On mount, if token exists, fetch current user to rehydrate state
  useEffect(() => {
    if (token && !user) {
      getMeApi()
        .then(setUser)
        .catch(() => {
          // Token is invalid or expired — clear it
          localStorage.removeItem('token');
          setToken(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!token && !!user, isLoading, login, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
