import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import { authService } from '../services/hotelService';

const FindPassword = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!email || !name) {
      setError('이메일과 이름을 모두 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      // 이메일과 이름을 함께 전송하도록 수정
      const response = await authService.findPassword({ email, name });
      console.log('Response:', response); // 디버깅용

      // 백엔드 ApiResponse 구조에 맞게 접근
      const message = response?.message || '임시 비밀번호가 이메일로 전송되었습니다.';
      setMessage(message);
    } catch (err) {
      console.error('Error:', err); // 디버깅용

      // 개선된 에러 처리
      const errorMessage = err?.response?.data?.message || err?.message || '입력하신 정보와 일치하는 사용자가 없습니다.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: 'background.paper'
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom align="center" fontWeight="bold">
          비밀번호 찾기
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
          가입 시 사용한 이메일 주소와 이름을 입력하시면, 임시 비밀번호를 발송해 드립니다.
        </Typography>

        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="이메일"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
              inputProps: {
                placeholder: '이메일을 입력해주세요.'
              }
            }}
          />
          <TextField
            label="이름"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
              inputProps: {
                placeholder: '이름을 입력해주세요'
              }
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              py: 1.5,
              mt: 1,
              bgcolor: '#000000',
              '&:hover': { bgcolor: '#423f3f' }
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : '임시 비밀번호 전송'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default FindPassword;
