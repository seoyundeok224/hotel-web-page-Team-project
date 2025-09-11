import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  FormHelperText,
  CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { authService } from '../services/hotelService';

const RegisterForm = ({ onSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    name: '',
    phone: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState({ username: false, email: false });
  const [message, setMessage] = useState('');

  // 폼 데이터 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // 에러 메시지 클리어
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // 사용자명 중복 확인
  const checkUsername = async (username) => {
    if (!username || username.length < 3) return;

    setChecking(prev => ({ ...prev, username: true }));
    try {
      const response = await authService.checkUsername(username);
      if (!response.data.available) {
        setErrors(prev => ({
          ...prev,
          username: '이미 사용 중인 사용자명입니다.'
        }));
      }
    } catch (error) {
      console.error('Username check failed:', error);
    } finally {
      setChecking(prev => ({ ...prev, username: false }));
    }
  };

  // 이메일 중복 확인
  const checkEmail = async (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) return;

    setChecking(prev => ({ ...prev, email: true }));
    try {
      const response = await authService.checkEmail(email);
      if (!response.data.available) {
        setErrors(prev => ({
          ...prev,
          email: '이미 사용 중인 이메일입니다.'
        }));
      }
    } catch (error) {
      console.error('Email check failed:', error);
    } finally {
      setChecking(prev => ({ ...prev, email: false }));
    }
  };

  // 폼 검증
  const validateForm = () => {
    const newErrors = {};

    // 사용자명 검증
    if (!formData.username) {
      newErrors.username = '사용자명을 입력해주세요.';
    } else if (formData.username.length < 3) {
      newErrors.username = '사용자명은 3자 이상이어야 합니다.';
    }

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다.';
    }

    // 비밀번호 확인 검증
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    // 이메일 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    // 이름 검증
    if (!formData.name) {
      newErrors.name = '이름을 입력해주세요.';
    } else if (formData.name.length < 2) {
      newErrors.name = '이름은 2자 이상이어야 합니다.';
    }

    // 전화번호 검증 (선택사항)
    if (formData.phone) {
      const phoneRegex = /^01[016789]-?\d{3,4}-?\d{4}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = '올바른 전화번호 형식을 입력해주세요. (예: 010-1234-5678)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 회원가입 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // 최종 중복 확인
      const [usernameCheck, emailCheck] = await Promise.all([
        authService.checkUsername(formData.username),
        authService.checkEmail(formData.email)
      ]);

      if (!usernameCheck.data.available) {
        setErrors(prev => ({ ...prev, username: '이미 사용 중인 사용자명입니다.' }));
        return;
      }

      if (!emailCheck.data.available) {
        setErrors(prev => ({ ...prev, email: '이미 사용 중인 이메일입니다.' }));
        return;
      }

      // 회원가입 API 호출
      const response = await authService.register({
        username: formData.username,
        password: formData.password,
        email: formData.email,
        name: formData.name,
        phone: formData.phone || null
      });

      setMessage(response.message || '회원가입이 완료되었습니다.');

      // 성공 콜백 실행
      if (onSuccess) {
        setTimeout(() => {
          onSuccess(response.data);
        }, 1500);
      }

    } catch (error) {
      setMessage(error.message || '회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
      {message && (
        <Alert
          severity={message.includes('완료') ? 'success' : 'error'}
          sx={{ mb: 2 }}
        >
          {message}
        </Alert>
      )}

      {/* 사용자명 */}
      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="사용자명"
        name="username"
        autoComplete="username"
        value={formData.username}
        onChange={handleChange}
        onBlur={(e) => checkUsername(e.target.value)}
        error={!!errors.username}
        helperText={errors.username || '로그인할 때 사용할 ID입니다 (3자 이상)'}
        InputProps={{
          endAdornment: checking.username && (
            <InputAdornment position="end">
              <CircularProgress size={20} />
            </InputAdornment>
          )
        }}
      />

      {/* 비밀번호 */}
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="비밀번호"
        type={showPassword ? 'text' : 'password'}
        id="password"
        autoComplete="new-password"
        value={formData.password}
        onChange={handleChange}
        error={!!errors.password}
        helperText={errors.password || '6자 이상의 비밀번호를 입력해주세요'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />

      {/* 비밀번호 확인 */}
      <TextField
        margin="normal"
        required
        fullWidth
        name="confirmPassword"
        label="비밀번호 확인"
        type={showConfirmPassword ? 'text' : 'password'}
        id="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle confirm password visibility"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                edge="end"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />

      {/* 이메일 */}
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="이메일 주소"
        name="email"
        autoComplete="email"
        value={formData.email}
        onChange={handleChange}
        onBlur={(e) => checkEmail(e.target.value)}
        error={!!errors.email}
        helperText={errors.email}
        InputProps={{
          endAdornment: checking.email && (
            <InputAdornment position="end">
              <CircularProgress size={20} />
            </InputAdornment>
          )
        }}
      />

      {/* 이름 */}
      <TextField
        margin="normal"
        required
        fullWidth
        id="name"
        label="이름"
        name="name"
        autoComplete="name"
        value={formData.name}
        onChange={handleChange}
        error={!!errors.name}
        helperText={errors.name}
      />

      {/* 전화번호 (선택사항) */}
      <TextField
        margin="normal"
        fullWidth
        id="phone"
        label="전화번호 (선택사항)"
        name="phone"
        autoComplete="tel"
        placeholder="010-1234-5678"
        value={formData.phone}
        onChange={handleChange}
        error={!!errors.phone}
        helperText={errors.phone}
      />

      {/* 회원가입 버튼 */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading}
      >
        {loading ? '회원가입 중...' : '회원가입'}
      </Button>
    </Box>
  );
};

export default RegisterForm;
