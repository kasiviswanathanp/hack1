import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getAuthToken, clearAuthToken } from '../api';

interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: string;
  district_id?: string;
  ward_id?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: str) => Promise<void>;
  register: (payload: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const cached = localStorage.getItem('civicai_citizen_user');
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      api.getMe()
        .then((userData) => {
          setUser(userData);
          localStorage.setItem('civicai_citizen_user', JSON.stringify(userData));
        })
        .catch(() => {
          clearAuthToken();
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: str) => {
    const data = await api.login(email, password);
    setUser(data.user);
  };

  const register = async (payload: any) => {
    const data = await api.register(payload);
    setUser(data.user);
  };

  const logout = () => {
    clearAuthToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
