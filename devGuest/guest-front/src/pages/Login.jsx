import React, { useState } from 'react';
import { Typography, Container, Box, TextField, Button, Alert, Link } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/hotelService';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login({
        username: formData.username,
        password: formData.password
      });

      const { user, token } = response.data;
      login(user, token);

      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      setError(error.message || '로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" sx={{ mb: 3 }}>
          Dev Hotel
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="사용자명"
            name="username"
            autoComplete="username"
            autoFocus
            value={formData.username}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="비밀번호"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? '로그인 중...' : '로그인'}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              계정이 없으신가요?{' '}
              <Link
                component={RouterLink}
                to="/register"
                sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                회원가입
              </Link>
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              아이디를 잊으셨나요?{' '}
              <Link
                component={RouterLink}
                to="/find-username"
                sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                아이디 찾기
              </Link>
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              비밀번호를 잊으셨나요?{' '}
              <Link
                component={RouterLink}
                to="/find-password"
                sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                비밀번호 찾기
              </Link>
            </Typography>
          </Box>

          <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>테스트 계정:</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              일반 사용자 - 사용자명: customer, 비밀번호: password<br />
              관리자 - 사용자명: admin, 비밀번호: admin
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;