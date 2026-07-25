'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  demoLogin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('bloomguard_token');
    const savedUser = localStorage.getItem('bloomguard_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('bloomguard_token', newToken);
    localStorage.setItem('bloomguard_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('bloomguard_token');
    localStorage.removeItem('bloomguard_user');
  };

  const demoLogin = async () => {
    try {
      const res = await api.post('/auth/demo-login');
      login(res.data.token, res.data.user);
    } catch (error) {
      console.error('Demo login failed:', error);
      // Client-side fallback if server isn't running yet
      const fallbackUser: User = {
        id: 'demo-123',
        name: 'Demo Plant Parent',
        email: 'demo@bloomguard.app',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      };
      login('mock-demo-token-2026', fallbackUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, demoLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
