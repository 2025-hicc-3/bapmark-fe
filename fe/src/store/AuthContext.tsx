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
  fetchUserInfo: () => Promise<void>;
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

  const login = async (token: string, userData?: User) => {
    localStorage.setItem('accessToken', token);

    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
    }

    setIsLoggedIn(true);

    // 로그인 후 사용자 정보 가져오기
    try {
      await fetchUserInfo();
      
      // 로그인 성공 이벤트 발생 (다른 컴포넌트들이 로그인 완료를 감지할 수 있도록)
      window.dispatchEvent(new CustomEvent('loginSuccess'));
    } catch (error) {
      console.error('로그인 후 사용자 정보 조회 실패:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('isTestLogin'); // 테스트 로그인 플래그도 제거
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

  // 사용자 정보 가져오기
  const fetchUserInfo = async () => {
    const token = getToken();
    if (!token) return;

    try {
      // 로그인 방식에 따라 API 선택
      const isTestLogin = localStorage.getItem('isTestLogin') === 'true';
      
      if (isTestLogin) {
        // 테스트 로그인인 경우 fakeApi 사용
        const { fakeApi } = await import('../utils/fakeApi');
        fakeApi.setTestMode(true);
        const userData = await fakeApi.getUserInfo();
        setUser(userData);
        localStorage.setItem('userData', JSON.stringify(userData));
      } else {
        // 실제 구글 로그인인 경우 백엔드 API 사용
        const { userAPI } = await import('../utils/api');
        const response = await userAPI.getMe();
        if (response.data) {
          setUser(response.data);
          localStorage.setItem('userData', JSON.stringify(response.data));
        }
      }
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error);
      // 에러 발생 시 로그아웃 처리
      logout();
    }
  };

  const value: AuthContextType = {
    isLoggedIn,
    user,
    login,
    logout,
    getToken,
    updateUser,
    fetchUserInfo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
