import React, { useState } from 'react';
import { Typography, Container, Box, TextField, Button, Alert, Tab, Tabs } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
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
      // 임시 로그인 로직 (실제로는 API 호출)
      if (tabValue === 0) {
        // 고객 로그인
        if (formData.email === 'customer@test.com' && formData.password === 'password') {
          const userData = {
            id: 1,
            name: '고객',
            email: formData.email,
            role: 'CUSTOMER'
          };
          login(userData, 'customer-token');
          navigate('/');
        } else {
          setError('이메일 또는 비밀번호가 잘못되었습니다.');
        }
      } else {
        // 관리자 로그인
        if (formData.email === 'admin@test.com' && formData.password === 'admin') {
          const userData = {
            id: 1,
            name: '관리자',
            email: formData.email,
            role: 'ADMIN'
          };
          login(userData, 'admin-token');
          navigate('/admin');
        } else {
          setError('관리자 계정 정보가 잘못되었습니다.');
        }
      }
    } catch (error) {
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          로그인
        </Typography>
        
        <Box sx={{ width: '100%', mt: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="고객 로그인" />
            <Tab label="관리자 로그인" />
          </Tabs>
        </Box>

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
            id="email"
            label="이메일 주소"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
            placeholder={tabValue === 0 ? "customer@test.com" : "admin@test.com"}
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
                이메일: customer@test.com<br />
                비밀번호: password
              </Typography>
            </Box>
          )}
          
          {tabValue === 1 && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                관리자 계정:<br />
                이메일: admin@test.com<br />
                비밀번호: admin
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
