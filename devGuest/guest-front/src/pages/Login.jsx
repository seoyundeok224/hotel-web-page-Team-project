import React, { useState, useEffect } from 'react';
import {
    Typography, Container, Box, TextField, Button, Alert, Link, Dialog,
    DialogTitle, DialogContent, DialogActions, Paper, InputAdornment, IconButton,
    CircularProgress, Divider
} from '@mui/material';
import { useNavigate, Link as RouterLink, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService, userService } from '../services/hotelService';

// 아이콘 import
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';


const Login = () => {
    const [searchParams] = useSearchParams();
    const initialUsername = searchParams.get('username') || '';

    const [formData, setFormData] = useState({
        username: initialUsername,
        password: '',
    });
    
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [currentUsername, setCurrentUsername] = useState('');

    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const usernameFromUrl = searchParams.get('username');
        if (usernameFromUrl) {
            setFormData((prev) => ({ ...prev, username: usernameFromUrl }));
        }
    }, [searchParams]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authService.login(formData);
            const { user, token } = response.data;
            login(user, token);
            navigate(user.role === 'ADMIN' ? '/admin' : '/');
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
            const response = await authService.login(formData);
            const { user, token } = response.data;
            login(user, token);
            navigate(user.role === 'ADMIN' ? '/admin' : '/');
        } catch (error) {
            setError(error.message || '탈퇴 취소 중 오류가 발생했습니다.');
            setCancelDialogOpen(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundImage: 'url(https://images.unsplash.com/photo-1562778612-e1e073d31780)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
            }}
        >
            <Paper
                elevation={8}
                sx={{
                    p: 4,
                    py: 5,
                    maxWidth: 420,
                    width: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h4" sx={{ mb: 3, fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>
                    Dev Hotel
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
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
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonOutlineIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="비밀번호"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockOutlinedIcon />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword(!showPassword)}
                                        onMouseDown={(e) => e.preventDefault()}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, py: 1.5 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : '로그인'}
                    </Button>

                    <Divider sx={{ my: 2, color: 'text.secondary' }}>OR</Divider>
                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<GoogleIcon />}
                        sx={{ py: 1.5, color: 'text.primary', borderColor: 'rgba(0, 0, 0, 0.23)' }}
                    >
                        Google 계정으로 로그인
                    </Button>

                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                            계정이 없으신가요?{' '}
                            <Link component={RouterLink} to="/register" sx={{ textDecoration: 'none', fontWeight: 'bold', '&:hover': { textDecoration: 'underline' } }}>
                                회원가입
                            </Link>
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            <Link component={RouterLink} to="/find-username" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                                아이디 찾기
                            </Link>
                            {' / '}
                            <Link component={RouterLink} to="/find-password" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                                비밀번호 찾기
                            </Link>
                        </Typography>
                    </Box>
                </Box>

                {/* [추가] 테스트 계정 정보 박스 */}
                <Box sx={{ mt: 4, p: 2, backgroundColor: 'rgba(0, 0, 0, 0.05)', borderRadius: 2, width: '100%' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 'bold' }}>
                        테스트 계정:
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        • 관리자: admin / admin <br />
                        • 일반 사용자는 '회원가입'을 이용해주세요.
                    </Typography>
                </Box>

            </Paper>

            <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold', color: 'error.main' }}>
                    <WarningAmberIcon />
                    탈퇴 신청된 계정
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        이 계정은 현재 탈퇴 절차가 진행 중입니다.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, pl: 2, borderLeft: '3px solid #e0e0e0' }}>
                        • 3일 이내에는 탈퇴를 취소하고 계정을 즉시 복구할 수 있습니다.<br />
                        • 3일이 지나면 계정 정보는 영구적으로 삭제됩니다.
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        지금 탈퇴를 취소하고 다시 로그인하시겠습니까?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setCancelDialogOpen(false)} color="inherit">
                        아니오
                    </Button>
                    <Button onClick={handleCancelWithdrawal} variant="contained" color="success">
                        네, 탈퇴를 취소합니다
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Login;