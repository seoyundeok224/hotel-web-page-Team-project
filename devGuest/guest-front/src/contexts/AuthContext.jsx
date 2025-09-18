import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 로컬스토리지에서 사용자 정보 확인
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const userInfo = localStorage.getItem('userInfo');
        
        if (token && userInfo) {
          const userData = JSON.parse(userInfo);
          setUser(userData);
          setIsAuthenticated(true);
          setIsAdmin(userData.role === 'ADMIN');
        }
      } catch (error) {
        console.error('인증 확인 중 오류:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);
    setIsAdmin(userData.role === 'ADMIN');
    
    localStorage.setItem('token', token);
    localStorage.setItem('userInfo', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
  };

  const value = {
    user,
    isAuthenticated,
    isAdmin,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
