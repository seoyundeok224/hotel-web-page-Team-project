import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography, Alert, CircularProgress, InputAdornment } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';

const FindUsername = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setResult('');
    setError('');

    // 클라이언트 측 유효성 검사
    if (!email || !name) {
      setError('이메일과 이름을 모두 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/users/find-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult(`당신의 아이디는 ${data.data} 입니다.`);
      } else {
        setError(data.message || '입력하신 정보와 일치하는 사용자가 없습니다.');
      }
    } catch (err) {
      setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        mt: 8, 
        p: 4,
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2, 
        borderRadius: 2,
        boxShadow: 3,
        bgcolor: 'background.paper'
      }}>
        <Typography variant="h5" component="h1" gutterBottom align="center" fontWeight="bold">
          아이디 찾기
        </Typography>

        <TextField
          label="이메일"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon color="action" />
              </InputAdornment>
            ),
            // 이메일 입력 상자에 힌트 텍스트 추가
            inputProps: {
              placeholder: '이메일을 입력해주세요.'
            }
          }}
        />
        <TextField
          label="이름"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon color="action" />
              </InputAdornment>
            ),
            // 이름 입력 상자에 힌트 텍스트 추가
            inputProps: {
              placeholder: '이름을 입력해주세요'
            }
          }}
        />
        <Button 
          variant="contained" 
          fullWidth 
          onClick={handleSubmit} 
          disabled={loading}
          sx={{ py: 1.5, mt: 1, bgcolor: '#000000', '&:hover': { bgcolor: '#423f3f' } }}
        >
          {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : '아이디 찾기'}
        </Button>

        {result && <Alert severity="success">{result}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
      </Box>
    </Container>
  );
};

export default FindUsername;