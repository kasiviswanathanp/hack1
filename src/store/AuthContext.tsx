import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '@/services/authService';
import { UserProfile, UserRole } from '@/types';

interface AuthContextType {
  currentUser: UserProfile | null;
  isLoading: boolean;
  switchRole: (role: UserRole) => Promise<UserProfile>;
  loginWithEmail: (email: string, pass: string) => Promise<UserProfile>;
  loginWithGoogle: () => Promise<UserProfile>;
  register: (email: string, pass: string, name: string, role?: UserRole) => Promise<UserProfile>;
  logout: () => Promise<void>;
  isCitizen: boolean;
  isOfficer: boolean;
  isSupervisor: boolean;
  isManager: boolean;
  isFieldTeam: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(authService.getCurrentUser());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsub = authService.subscribe((user) => {
      setCurrentUser(user);
    });
    return unsub;
  }, []);

  const switchRole = async (role: UserRole) => {
    setIsLoading(true);
    try {
      const u = await authService.switchDemoRole(role);
      setCurrentUser(u);
      return u;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const u = await authService.loginWithEmail(email, pass);
      setCurrentUser(u);
      return u;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const u = await authService.loginWithGoogle();
      setCurrentUser(u);
      return u;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, pass: string, name: string, role?: UserRole) => {
    setIsLoading(true);
    try {
      const u = await authService.register(email, pass, name, role);
      setCurrentUser(u);
      return u;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const role = currentUser?.role;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        switchRole,
        loginWithEmail,
        loginWithGoogle,
        register,
        logout,
        isCitizen: role === 'CITIZEN',
        isOfficer: role === 'AREA_OFFICER' || role === 'DEPARTMENT_OFFICER',
        isSupervisor: role === 'SUPERVISOR',
        isManager: role === 'DISTRICT_MANAGER',
        isFieldTeam: role === 'FIELD_TEAM',
        isAdmin: role === 'ADMIN',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
