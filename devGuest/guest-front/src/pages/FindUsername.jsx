import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography, Alert } from '@mui/material';

const FindUsername = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setResult('');
    setError('');

    try {
      const res = await fetch('/api/users/find-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult(`당신의 아이디는: ${data.data}`);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('서버 오류가 발생했습니다.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h5" gutterBottom>
          아이디 찾기
        </Typography>

        <TextField
          label="이메일"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="이름"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button variant="contained" fullWidth onClick={handleSubmit}>
          아이디 찾기
        </Button>

        {result && <Alert severity="success">{result}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
      </Box>
    </Container>
  );
};

export default FindUsername;