import React, { useState, forwardRef } from 'react';
import {
  AppBar, Toolbar, Typography, Button, IconButton, Drawer,
  List, ListItemText, useTheme, useMediaQuery, Box, Divider, ListItemButton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// --- 오류 해결을 위한 임시 코드 ---
// AuthContext 파일이 아직 없으므로, 임시 useAuth 훅을 만들어 컴포넌트가 작동하도록 합니다.
const useAuth = () => {
  // 이 값을 false로 바꾸면 로그아웃 상태의 Navbar를 볼 수 있습니다.
  const [isLoggedIn, setIsLoggedIn] = useState(true); 

  return {
    isAuthenticated: isLoggedIn,
    isAdmin: isLoggedIn, // 관리자 상태도 로그인 여부에 따르도록 가정
    user: isLoggedIn ? { name: '테스트 사용자' } : null,
    // 실제 로그아웃처럼 동작하도록 임시 함수를 만듭니다.
    logout: () => {
      console.log('임시 로그아웃 함수 호출됨');
      setIsLoggedIn(false);
    },
  };
};
// --- 임시 코드 끝 ---

// import { useAuth } from '../contexts/AuthContext'; // 나중에 이 줄의 주석을 해제하고 위 임시 코드를 삭제하세요.

// React Router의 Link를 Material-UI 컴포넌트와 함께 사용하기 위한 래퍼(Wrapper) 컴포넌트입니다.
const LinkBehavior = forwardRef((props, ref) => {
  const { href, ...other } = props;
  return <RouterLink ref={ref} to={href} {...other} />;
});

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  // 임시 useAuth 훅을 사용합니다.
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/'); // 로그아웃 후 홈페이지로 이동
  };

  // 모바일 화면에서 나타날 메뉴 (Drawer)
  const drawer = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={handleDrawerToggle}
      onKeyDown={handleDrawerToggle}
    >
      <List>
        <ListItemButton component={LinkBehavior} href="/"><ListItemText primary="호텔 소개" /></ListItemButton>
        <ListItemButton component={LinkBehavior} href="/rooms"><ListItemText primary="객실 소개" /></ListItemButton>
        <ListItemButton component={LinkBehavior} href="/dining"><ListItemText primary="다이닝" /></ListItemButton>
        <ListItemButton component={LinkBehavior} href="/facilities"><ListItemText primary="부대시설" /></ListItemButton>
        <ListItemButton component={LinkBehavior} href="/services"><ListItemText primary="서비스" /></ListItemButton>
        <ListItemButton component={LinkBehavior} href="/reviews"><ListItemText primary="고객 후기" /></ListItemButton>
        <ListItemButton component={LinkBehavior} href="/location"><ListItemText primary="오시는 길" /></ListItemButton>
        <ListItemButton component={LinkBehavior} href="/booking"><ListItemText primary="예약" /></ListItemButton>
        <Divider />
        {isAuthenticated ? (
          <>
            <ListItemButton component={LinkBehavior} href="/mypage"><ListItemText primary="마이페이지" /></ListItemButton>
            {isAdmin && <ListItemButton component={LinkBehavior} href="/admin"><ListItemText primary="관리자 패널" /></ListItemButton>}
            <ListItemButton onClick={handleLogout}><ListItemText primary={`로그아웃 (${user?.name || '사용자'})`} /></ListItemButton>
          </>
        ) : (
          <ListItemButton component={LinkBehavior} href="/login"><ListItemText primary="로그인" /></ListItemButton>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" color="inherit" component={LinkBehavior} href="/" sx={{ textDecoration: 'none', color: 'primary.main', fontWeight: 'bold' }}>
          Dev Hotel
        </Typography>

        {isMobile ? (
          <IconButton color="inherit" aria-label="open drawer" edge="end" onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button color="inherit" component={LinkBehavior} href="/">호텔 소개</Button>
            <Button color="inherit" component={LinkBehavior} href="/rooms">객실 소개</Button>
            <Button color="inherit" component={LinkBehavior} href="/dining">다이닝</Button>
            <Button color="inherit" component={LinkBehavior} href="/facilities">부대시설</Button>
            <Button color="inherit" component={LinkBehavior} href="/services">서비스</Button>
            <Button color="inherit" component={LinkBehavior} href="/reviews">고객 후기</Button>
            <Button color="inherit" component={LinkBehavior} href="/location">오시는 길</Button>
            <Button variant="contained" component={LinkBehavior} href="/booking" sx={{ ml: 2 }}>예약</Button>
            {isAuthenticated ? (
              <>
                <Button color="inherit" component={LinkBehavior} href="/mypage" sx={{ ml: 2 }}>마이페이지</Button>
                {isAdmin && <Button variant="outlined" component={LinkBehavior} href="/admin" sx={{ ml: 2 }}>관리자 패널</Button>}
                <Button color="inherit" onClick={handleLogout} sx={{ ml: 2 }}>로그아웃 ({user?.name || '사용자'})</Button>
              </>
            ) : (
              <Button variant="outlined" component={LinkBehavior} href="/login" sx={{ ml: 2 }}>로그인</Button>
            )}
          </Box>
        )}
      </Toolbar>
      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerToggle}>{drawer}</Drawer>
    </AppBar>
  );
};

export default Navbar;
