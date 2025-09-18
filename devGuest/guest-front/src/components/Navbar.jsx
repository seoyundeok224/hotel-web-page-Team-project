import React, { useState, forwardRef } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItemText, useTheme, useMediaQuery, Box, Divider, ListItemButton } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

// 'AuthContext' import 오류를 해결하기 위한 임시 useAuth 함수입니다.
const useAuth = () => {
  const [authState, setAuthState] = useState({
    isAuthenticated: true,
    isAdmin: true,
    user: { name: '관리자' },
  });

  const logout = () => {
    setAuthState({ isAuthenticated: false, isAdmin: false, user: null });
    console.log("사용자가 로그아웃했습니다.");
  };

  return { ...authState, logout };
};

// React Router의 Link 컴포넌트를 Material-UI 버튼 등에서 사용하기 위한 설정입니다.
const LinkBehavior = forwardRef((props, ref) => {
  const { href, ...other } = props;
  return <RouterLink ref={ref} to={href} {...other} />;
});

// 네비게이션 바 컴포넌트
const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // 모바일 화면용 메뉴 (Drawer)
  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle} onKeyDown={handleDrawerToggle}>
      <List>
        <ListItemButton component={LinkBehavior} href="/">
          <ListItemText primary="호텔 소개" />
        </ListItemButton>
        <ListItemButton component={LinkBehavior} href="/rooms">
          <ListItemText primary="객실 소개" />
        </ListItemButton>
        <ListItemButton component={LinkBehavior} href="/dining">
          <ListItemText primary="다이닝" />
        </ListItemButton>
        <ListItemButton component={LinkBehavior} href="/facilities">
          <ListItemText primary="부대시설" />
        </ListItemButton>
        <ListItemButton component={LinkBehavior} href="/services">
          <ListItemText primary="서비스" />
        </ListItemButton>
        <ListItemButton component={LinkBehavior} href="/reviews">
          <ListItemText primary="고객 후기" />
        </ListItemButton>
        <ListItemButton component={LinkBehavior} href="/location">
          <ListItemText primary="오시는 길" />
        </ListItemButton>
        <ListItemButton component={LinkBehavior} href="/booking">
          <ListItemText primary="예약" />
        </ListItemButton>
        <Divider />
        {isAuthenticated ? (
          <>
            <ListItemButton component={LinkBehavior} href="/mypage">
              <ListItemText primary="마이페이지" />
            </ListItemButton>
            {isAdmin && (
              <ListItemButton component={LinkBehavior} href="/admin">
                <ListItemText primary="관리자 패널" />
              </ListItemButton>
            )}
            <ListItemButton onClick={handleLogout}>
              <ListItemText primary={`로그아웃 (${user?.name || '사용자'})`} />
            </ListItemButton>
          </>
        ) : (
          <ListItemButton component={LinkBehavior} href="/login">
            <ListItemText primary="로그인" />
          </ListItemButton>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" color="inherit" component={LinkBehavior} href="/" sx={{ textDecoration: 'none', color: 'primary.main', fontWeight: 'bold' }}>
            Dev hotel
          </Typography>
          {isMobile ? (
            <IconButton color="inherit" aria-label="open drawer" edge="end" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button color="inherit" component={LinkBehavior} href="/" sx={{ '&:hover': { backgroundColor: 'transparent', color: 'primary.main' } }}>호텔 소개</Button>
              <Button color="inherit" component={LinkBehavior} href="/rooms" sx={{ '&:hover': { backgroundColor: 'transparent', color: 'primary.main' } }}>객실 소개</Button>
              <Button color="inherit" component={LinkBehavior} href="/dining" sx={{ '&:hover': { backgroundColor: 'transparent', color: 'primary.main' } }}>다이닝</Button>
              <Button color="inherit" component={LinkBehavior} href="/facilities" sx={{ '&:hover': { backgroundColor: 'transparent', color: 'primary.main' } }}>부대시설</Button>
              <Button color="inherit" component={LinkBehavior} href="/services" sx={{ '&:hover': { backgroundColor: 'transparent', color: 'primary.main' } }}>서비스</Button>
              <Button color="inherit" component={LinkBehavior} href="/reviews" sx={{ '&:hover': { backgroundColor: 'transparent', color: 'primary.main' } }}>고객 후기</Button>
              <Button color="inherit" component={LinkBehavior} href="/location" sx={{ '&:hover': { backgroundColor: 'transparent', color: 'primary.main' } }}>오시는 길</Button>
              <Button variant="contained" component={LinkBehavior} href="/booking" sx={{ ml: 2 }}>예약</Button>
              {isAuthenticated ? (
                <>
                  <Button color="inherit" component={LinkBehavior} href="/mypage" sx={{ ml: 2, '&:hover': { backgroundColor: 'transparent', color: 'primary.main' } }}>
                    마이페이지
                  </Button>
                  {isAdmin && (
                    <Button variant="outlined" component={LinkBehavior} href="/admin" sx={{ ml: 2, borderColor: 'primary.main', color: 'primary.main' }}>
                      관리자 패널
                    </Button>
                  )}
                  <Button color="inherit" onClick={handleLogout} sx={{ ml: 2 }}>
                    로그아웃 ({user?.name || '사용자'})
                  </Button>
                </>
              ) : (
                <Button variant="outlined" component={LinkBehavior} href="/login" sx={{ ml: 2 }}>로그인</Button>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerToggle}>
        {drawer}
      </Drawer>
    </>
  );
};

// Router 컨텍스트를 제공하고 페이지를 렌더링하는 메인 App 컴포넌트
const App = () => {
    return (
        <Router>
            <Navbar />
            {/* 각 URL에 맞는 페이지 내용을 보여주는 부분입니다. */}
            <Box p={3}>
                <Routes>
                    <Route path="/" element={<Typography variant="h4">호텔 소개 페이지</Typography>} />
                    <Route path="/rooms" element={<Typography variant="h4">객실 소개 페이지</Typography>} />
                    <Route path="/dining" element={<Typography variant="h4">다이닝 페이지</Typography>} />
                    <Route path="/facilities" element={<Typography variant="h4">부대시설 페이지</Typography>} />
                    <Route path="/services" element={<Typography variant="h4">서비스 페이지</Typography>} />
                    <Route path="/reviews" element={<Typography variant="h4">고객 후기 페이지</Typography>} />
                    <Route path="/location" element={<Typography variant="h4">오시는 길 페이지</Typography>} />
                    <Route path="/booking" element={<Typography variant="h4">예약 페이지</Typography>} />
                    <Route path="/login" element={<Typography variant="h4">로그인 페이지</Typography>} />
                    <Route path="/mypage" element={<Typography variant="h4">마이페이지</Typography>} />
                    <Route path="/admin" element={<Typography variant="h4">관리자 패널</Typography>} />
                </Routes>
            </Box>
        </Router>
    );
}

export default App;