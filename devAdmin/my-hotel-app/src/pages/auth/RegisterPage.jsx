import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  MapPin,
  Check,
  ArrowLeft
} from 'lucide-react'
import { authService } from '../../services/hotelService'
import { storage, isValidEmail, isValidKoreanPhone } from '../../utils/helpers'

const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    role: 'staff', // staff, admin
    agreeTerms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // 입력시 해당 필드 에러 초기화
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // 이름 검증
    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = '이름은 2글자 이상이어야 합니다.'
    }

    // 이메일 검증
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.'
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.'
    }

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.'
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 6글자 이상이어야 합니다.'
    }

    // 비밀번호 확인 검증
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.'
    }

    // 전화번호 검증
    if (!formData.phone) {
      newErrors.phone = '전화번호를 입력해주세요.'
    } else if (!isValidKoreanPhone(formData.phone)) {
      newErrors.phone = '올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)'
    }

    // 주소 검증
    if (!formData.address.trim()) {
      newErrors.address = '주소를 입력해주세요.'
    }

    // 약관 동의 검증
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = '서비스 이용약관에 동의해주세요.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // 실제로는 API 호출
      // const response = await authService.register(formData)

      // 데모용 회원가입 로직
      const userData = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        phone: formData.phone,
        address: formData.address,
        registeredAt: new Date().toISOString(),
        token: 'demo-jwt-token-' + Date.now(),
        // 실제로는 해시된 비밀번호를 저장해야 하지만, 데모에서는 임시 처리
        tempPassword: 'password123' // 모든 신규 가입자의 임시 비밀번호
      }

      // 기존 사용자 목록 가져오기 (로컬스토리지에서)
      const existingUsers = storage.get('registeredUsers', [])

      // 이메일 중복 확인
      if (existingUsers.some(user => user.email === formData.email)) {
        setErrors({ email: '이미 등록된 이메일입니다.' })
        return
      }

      // 새 사용자 추가
      existingUsers.push(userData)
      storage.set('registeredUsers', existingUsers)

      // 자동 로그인
      storage.set('authToken', userData.token)
      storage.set('userData', userData)

      // 성공 메시지 표시 후 대시보드로 이동
      alert('회원가입이 완료되었습니다!')
      navigate('/dashboard')

    } catch (err) {
      setErrors({ general: '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="register-card">
        {/* 헤더 */}
        <div className="login-header">
          <Link to="/login" className="back-button">
            <ArrowLeft size={20} />
            로그인으로 돌아가기
          </Link>
          <div className="login-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <Building2 size={32} />
            <h1>DEV호텔</h1>
          </div>
          <p>DEV호텔 관리 시스템 계정을 생성하세요</p>
        </div>

        {/* 회원가입 폼 */}
        <form onSubmit={handleSubmit} className="login-form">
          {errors.general && (
            <div className="error-message">
              {errors.general}
            </div>
          )}

          {/* 이름 */}
          <div className="form-group">
            <label className="form-label">이름 *</label>
            <div className="input-with-icon">
              <User size={20} className="input-icon" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="이름을 입력하세요"
                required
              />
            </div>
            {errors.name && <div className="field-error">{errors.name}</div>}
          </div>

          {/* 이메일 */}
          <div className="form-group">
            <label className="form-label">이메일 *</label>
            <div className="input-with-icon">
              <Mail size={20} className="input-icon" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="이메일을 입력하세요"
                required
              />
            </div>
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>

          {/* 비밀번호 */}
          <div className="form-group">
            <label className="form-label">비밀번호 *</label>
            <div className="input-with-icon">
              <Lock size={20} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="비밀번호를 입력하세요 (6글자 이상)"
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
            {errors.password && <div className="field-error">{errors.password}</div>}
          </div>

          {/* 비밀번호 확인 */}
          <div className="form-group">
            <label className="form-label">비밀번호 확인 *</label>
            <div className="input-with-icon">
              <Lock size={20} className="input-icon" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="비밀번호를 다시 입력하세요"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && <div className="field-error">{errors.confirmPassword}</div>}
          </div>

          {/* 전화번호 */}
          <div className="form-group">
            <label className="form-label">전화번호 *</label>
            <div className="input-with-icon">
              <Phone size={20} className="input-icon" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`form-input ${errors.phone ? 'error' : ''}`}
                placeholder="010-1234-5678"
                required
              />
            </div>
            {errors.phone && <div className="field-error">{errors.phone}</div>}
          </div>

          {/* 주소 */}
          <div className="form-group">
            <label className="form-label">주소 *</label>
            <div className="input-with-icon">
              <MapPin size={20} className="input-icon" />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`form-input ${errors.address ? 'error' : ''}`}
                placeholder="주소를 입력하세요"
                required
              />
            </div>
            {errors.address && <div className="field-error">{errors.address}</div>}
          </div>

          {/* 역할 선택 */}
          <div className="form-group">
            <label className="form-label">역할</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="staff">직원</option>
              <option value="admin">관리자</option>
            </select>
          </div>

          {/* 약관 동의 */}
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
                className="checkbox-input"
              />
              <span className="checkbox-custom">
                {formData.agreeTerms && <Check size={14} />}
              </span>
              <span className="checkbox-text">
                서비스 이용약관 및 개인정보처리방침에 동의합니다 *
              </span>
            </label>
            {errors.agreeTerms && <div className="field-error">{errors.agreeTerms}</div>}
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? '계정 생성 중...' : '계정 생성하기'}
          </button>
        </form>

        {/* 로그인 링크 */}
        <div className="login-link">
          <p>
            이미 계정이 있으신가요?
            <Link to="/login" className="link">로그인하기</Link>
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

export default Register
