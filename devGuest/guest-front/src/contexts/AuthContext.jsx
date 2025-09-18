import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// JWT 토큰을 직접 디코딩하는 간단한 함수입니다. (외부 라이브러리 의존성 제거)
function simpleJwtDecode(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("JWT 토큰 디코딩에 실패했습니다:", e);
        return null;
    }
}

const AuthContext = createContext(null);

// 다른 컴포넌트에서 Context를 쉽게 사용하기 위한 커스텀 훅 (export)
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth는 반드시 AuthProvider 안에서 사용해야 합니다.');
    }
    return context;
};

// 인증 상태를 앱 전체에 공급하는 Provider 컴포넌트 (Default Export)
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            if (token) {
                const decoded = simpleJwtDecode(token);
                // 토큰이 유효하고, 만료되지 않았다면 사용자 정보를 설정합니다.
                if (decoded && decoded.exp * 1000 > Date.now()) {
                    setUser({ name: decoded.sub, roles: decoded.roles || [] });
                } else {
                    throw new Error("만료되거나 유효하지 않은 토큰입니다.");
                }
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error(error.message);
            localStorage.removeItem('authToken');
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, [token]);

    // 백엔드에 로그인 요청을 보내는 함수
    const login = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', { username, password });
            const newToken = response.data.token;
            if (newToken) {
                localStorage.setItem('authToken', newToken);
                setToken(newToken);
                return true; // 로그인 성공
            }
            return false;
        } catch (error) {
            console.error("로그인에 실패했습니다:", error);
            return false;
        }
    };

    // 로그아웃 함수
    const logout = () => {
        localStorage.removeItem('authToken');
        setToken(null);
        setUser(null);
    };

    const value = {
        token,
        user,
        isAuthenticated: !!user, // user 객체가 있으면 로그인 된 상태
        isAdmin: user?.roles.includes('ROLE_ADMIN'),
        loading,
        login,
        logout,
    };

    // 인증 정보 확인 중에는 화면 깜빡임을 방지하기 위해 아무것도 렌더링하지 않음
    if (loading) {
        return null;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
