import React, { useState } from 'react';
import { Typography, Container, Box, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';

const Register = () => {
    const handleRegisterSuccess = (userData) => {
        // 회원가입 성공 시 로그인 페이지로 이동하거나 메시지 표시
        console.log('회원가입 성공:', userData);
    };

    const handleSwitchToLogin = () => {
        // 로그인 페이지로 이동 시 사용할 수 있는 함수
        console.log('로그인 페이지로 이동');
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
                    Dev Hotel 회원가입
                </Typography>

                <RegisterForm
                    onSuccess={handleRegisterSuccess}
                    onSwitchToLogin={handleSwitchToLogin}
                />

                <Box sx={{ textAlign: 'center', mt: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                        이미 계정이 있으신가요?{' '}
                        <Link
                            component={RouterLink}
                            to="/login"
                            sx={{
                                textDecoration: 'none',
                                '&:hover': {
                                    textDecoration: 'underline'
                                }
                            }}
                        >
                            로그인
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default Register;
