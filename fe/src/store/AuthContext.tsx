import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types/auth';

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (token: string, userData?: User) => void;
  logout: () => void;
  getToken: () => string | null;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 컴포넌트 마운트 시 로그인 상태 확인
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('userData');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setIsLoggedIn(true);
        setUser(parsedUser);
      } catch {
        // 파싱 실패 시 로그아웃 처리
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userData');
      }
    }
  }, []);

  const login = (token: string, userData?: User) => {
    localStorage.setItem('accessToken', token);

    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
    }

    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    setUser(null);
  };

  const getToken = () => {
    return localStorage.getItem('accessToken');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('userData', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    isLoggedIn,
    user,
    login,
    logout,
    getToken,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
