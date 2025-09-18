import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from '@mui/material';
import { authService } from '../services/hotelService';

const FindPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await authService.findPassword(email);
      console.log('Response:', response); // 디버깅용

      // 백엔드 ApiResponse 구조에 맞게 접근
      const message = response?.message || '임시 비밀번호가 이메일로 전송되었습니다.';
      setMessage(message);
    } catch (err) {
      console.error('Error:', err); // 디버깅용

      // 개선된 에러 처리
      const errorMessage = err?.response?.data?.message || err?.message || '오류가 발생했습니다.';
      setError(errorMessage);
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
          비밀번호 찾기
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
          가입 시 사용한 이메일 주소를 입력하시면, 임시 비밀번호를 발송해 드립니다.
        </Typography>

        {message && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? '전송 중...' : '임시 비밀번호 전송'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default FindPassword;
