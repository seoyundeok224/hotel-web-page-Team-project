import React, { useState } from 'react';
import { Typography, Container, Box, TextField, Button, Alert, Tab, Tabs } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/hotelService';
import RegisterForm from '../components/RegisterForm';

const Login = () => {
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
  };

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
      // 실제 API 호출로 변경
      const response = await authService.login({
        username: formData.username,
        password: formData.password
      });

      const { user, token } = response.data;
      login(user, token);
      
      // 관리자면 관리자 페이지로, 아니면 홈으로
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

  const handleRegisterSuccess = (userData) => {
    // 회원가입 성공 시 자동으로 로그인 탭으로 전환
    setTabValue(0);
    setFormData({
      username: userData.username,
      password: ''
    });
  };

  const handleSwitchToLogin = () => {
    setTabValue(0);
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
        
        <Box sx={{ width: '100%', mt: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="로그인" />
            <Tab label="관리자 로그인" />
            <Tab label="회원가입" />
          </Tabs>
        </Box>

        {/* 로그인 및 관리자 로그인 폼 */}
        {(tabValue === 0 || tabValue === 1) && (
          <>
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
                placeholder={tabValue === 0 ? "customer" : "admin"}
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
                placeholder={tabValue === 0 ? "password" : "admin"}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? '로그인 중...' : (tabValue === 0 ? '고객 로그인' : '관리자 로그인')}
              </Button>
              
              {tabValue === 0 && (
                <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    테스트 계정:<br />
                    사용자명: customer<br />
                    비밀번호: password
                  </Typography>
                </Box>
              )}
              
              {tabValue === 1 && (
                <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    관리자 계정:<br />
                    사용자명: admin<br />
                    비밀번호: admin
                  </Typography>
                </Box>
              )}
            </Box>
          </>
        )}

        {/* 회원가입 폼 */}
        {tabValue === 2 && (
          <RegisterForm 
            onSuccess={handleRegisterSuccess}
            onSwitchToLogin={handleSwitchToLogin}
          />
        )}
      </Box>
    </Container>
  );
};

export default Login;
