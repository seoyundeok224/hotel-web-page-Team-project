<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { Typography, Container, Box, TextField, Button, Alert, Link } from '@mui/material';
import { useNavigate, Link as RouterLink, useSearchParams } from 'react-router-dom';
=======
import React, { useState } from 'react';
import { 
  Typography, Container, Box, TextField, Button, Alert, Link, 
  Dialog, DialogTitle, DialogContent, DialogActions 
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
>>>>>>> main
import { useAuth } from '../contexts/AuthContext';
import { authService, userService } from '../services/hotelService';

const Login = () => {
<<<<<<< HEAD
  const [searchParams] = useSearchParams();
  const initialUsername = searchParams.get('username') || '';
=======
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [currentUsername, setCurrentUsername] = useState('');
>>>>>>> main

  const [formData, setFormData] = useState({
    username: initialUsername,
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  // URL 쿼리 파라미터가 변경될 때마다 폼 데이터 업데이트
  useEffect(() => {
    const usernameFromUrl = searchParams.get('username');
    if (usernameFromUrl) {
      setFormData(prev => ({ ...prev, username: usernameFromUrl }));
    }
  }, [searchParams]);

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

<<<<<<< HEAD
    try {
      const response = await authService.login({
        username: formData.username,
        password: formData.password
      });

      const { user, token } = response.data;
      login(user, token);
=======
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      if (error.message === 'ACCOUNT_DELETED') {
        setCurrentUsername(formData.username);
        setCancelDialogOpen(true);
        setError('');
      } else {
        setError(error.message || '로그인 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelWithdrawal = async () => {
    try {
      await userService.cancelAccountDeletion(currentUsername);
      setCancelDialogOpen(false);
      setError('');
      
      // 탈퇴 취소 후 다시 로그인 시도
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
      setError(error.message || '탈퇴 취소 중 오류가 발생했습니다.');
      setCancelDialogOpen(false);
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
>>>>>>> main

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

<<<<<<< HEAD
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
=======
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
              관리자 - 사용자명: admin, 비밀번호: admin<br />
              일반 사용자는 회원가입을 통해 계정을 생성하세요.
            </Typography>
          </Box>
        </Box>

        {/* 탈퇴 취소 다이얼로그 */}
        <Dialog 
          open={cancelDialogOpen} 
          onClose={() => setCancelDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
            탈퇴 신청된 계정
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              이 계정은 탈퇴 신청이 완료된 상태입니다.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              • 탈퇴 신청 후 3일 이내에는 탈퇴를 취소할 수 있습니다<br/>
              • 3일 후에는 계정이 영구적으로 삭제됩니다<br/>
              • 탈퇴를 취소하면 기존 정보가 모두 복구됩니다
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              탈퇴를 취소하시겠습니까?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button 
              onClick={() => setCancelDialogOpen(false)}
              color="inherit"
            >
              아니오
            </Button>
            <Button 
              onClick={handleCancelWithdrawal}
              variant="contained"
              color="primary"
              sx={{ ml: 1 }}
            >
              탈퇴 취소
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
>>>>>>> main
};

export default Login;