import React, { createContext, useContext, useState } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  currentRole: UserRole;
  login: (phoneOrEmail: string, role?: UserRole, password?: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('electwin_isLoggedIn') === 'true';
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return (localStorage.getItem('electwin_role') as UserRole) || 'superadmin';
  });

  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('electwin_user');
    if (savedUser) {
      try { return JSON.parse(savedUser); } catch { return null; }
    }
    return {
      id: 'usr_default',
      name: 'Rameshwar Patel (Owner)',
      email: 'superadmin@electwin.com',
      role: 'superadmin',
      phone: '+91 98290 14285',
      ward: 'All Wards'
    };
  });

  const login = async (phoneOrEmail: string, role: UserRole = 'superadmin', password?: string) => {
    const { user: loggedInUser } = await api.login(phoneOrEmail, role, password);
    setUser(loggedInUser);
    setCurrentRole(role);
    setIsAuthenticated(true);
    localStorage.setItem('electwin_isLoggedIn', 'true');
    localStorage.setItem('electwin_role', role);
    localStorage.setItem('electwin_user', JSON.stringify(loggedInUser));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('electwin_isLoggedIn');
    localStorage.removeItem('electwin_user');
    localStorage.removeItem('electwin_token');
  };

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    localStorage.setItem('electwin_role', role);
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem('electwin_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, currentRole, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
