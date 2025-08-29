import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { storage } from '../../utils/helpers'

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const location = useLocation()

  useEffect(() => {
    const checkAuth = () => {
      const token = storage.get('authToken')
      const userData = storage.get('userData')

      if (token && userData) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    }

    checkAuth()
  }, [])

  // 로딩 중
  if (isAuthenticated === null) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p>로딩 중...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // 인증된 경우 자식 컴포넌트 렌더링
  return children
}

export default ProtectedRoute
