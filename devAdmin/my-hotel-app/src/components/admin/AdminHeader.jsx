import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, User, LogOut, ChevronDown } from 'lucide-react'
import { storage } from '../../utils/helpers'

const Header = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const user = storage.get('userData')
    setUserData(user)
  }, [])

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    // 토큰과 사용자 데이터 제거
    storage.remove('authToken')
    storage.remove('userData')

    // 로그인 페이지로 리다이렉트
    navigate('/login')
  }

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <Building2 size={24} />
          DEV호텔
        </div>
        <div className="user-info">
          <div className="user-dropdown" ref={dropdownRef}>
            <button
              className="user-button"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <User size={20} />
              <span>{userData?.name || '관리자'}</span>
              <ChevronDown size={16} />
            </button>

            {showDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <div className="user-avatar">
                    <User size={24} />
                  </div>
                  <div className="user-details">
                    <div className="user-name">{userData?.name || '관리자'}</div>
                    <div className="user-email">{userData?.email || 'admin@hotel.com'}</div>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item" onClick={handleLogout}>
                  <LogOut size={16} />
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
