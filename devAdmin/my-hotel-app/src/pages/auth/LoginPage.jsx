import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Building2, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { authService } from '../../services/hotelService'
import { storage } from '../../utils/helpers'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // 입력시 에러 메시지 초기화
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // 등록된 사용자 목록 확인
      const registeredUsers = storage.get('registeredUsers', [])

      // 데모 관리자 계정 확인
      if (formData.email === 'admin@hotel.com' && formData.password === 'admin123') {
        const userData = {
          id: 1,
          name: '관리자',
          email: 'admin@hotel.com',
          role: 'admin',
          token: 'demo-jwt-token-' + Date.now()
        }

        storage.set('authToken', userData.token)
        storage.set('userData', userData)
        navigate('/admin/dashboard')
        return
      }

      // 등록된 사용자 중에서 일치하는 계정 찾기
      const user = registeredUsers.find(u => u.email === formData.email)

      if (user) {
        // 실제로는 해시된 비밀번호와 비교해야 하지만, 데모에서는 단순 비교
        // 실제 구현에서는 백엔드에서 비밀번호 검증
        if (formData.password === 'password123' || formData.password === user.tempPassword) {
          // 로그인 성공 - 새 토큰 생성
          const updatedUser = {
            ...user,
            token: 'demo-jwt-token-' + Date.now(),
            lastLogin: new Date().toISOString()
          }

          storage.set('authToken', updatedUser.token)
          storage.set('userData', updatedUser)
          navigate('/admin/dashboard')
        } else {
          setError('이메일 또는 비밀번호가 올바르지 않습니다.')
        }
      } else {
        setError('등록되지 않은 이메일입니다.')
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = () => {
    setFormData({
      email: 'admin@hotel.com',
      password: 'admin123'
    })
  }

  return (
    <div className="login-container">
      <div className="login-card">
        {/* 헤더 */}
        <div className="login-header">
          <div className="login-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <Building2 size={32} />
            <h1>DEV호텔</h1>
          </div>
          <p>DEV호텔 관리 시스템에 로그인하세요</p>
        </div>

        {/* 로그인 폼 */}
        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">이메일</label>
            <div className="input-with-icon">
              <Mail size={20} className="input-icon" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                placeholder="이메일을 입력하세요"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">비밀번호</label>
            <div className="input-with-icon">
              <Lock size={20} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input"
                placeholder="비밀번호를 입력하세요"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        {/* 데모 로그인 */}
        <div className="demo-section">
          <div className="divider">
            <span>또는</span>
          </div>
          <button
            type="button"
            className="demo-btn"
            onClick={handleDemoLogin}
          >
            데모 계정으로 로그인
          </button>
          <div className="demo-info">
            <p><strong>데모 계정:</strong></p>
            <p>관리자: admin@hotel.com / admin123</p>
            <p>또는 회원가입 후 로그인 (임시 비밀번호: password123)</p>
          </div>
        </div>

        {/* 회원가입 링크 */}
        <div className="login-link">
          <p>
            계정이 없으신가요?
            <Link to="/register" className="link">회원가입하기</Link>
          </p>
        </div>

        {/* 푸터 */}
        <div className="login-footer">
          <p>&copy; 2025 DEV호텔. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default Login
