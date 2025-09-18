import React, { useState, forwardRef } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText, useTheme, useMediaQuery, Box, Divider } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../contexts/AuthContext';

const LinkBehavior = forwardRef((props, ref) => {
  const { href, ...other } = props;
  return <RouterLink ref={ref} to={href} {...other} />;
});

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

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle} onKeyDown={handleDrawerToggle}>
      <List>
        <ListItem button component={LinkBehavior} href="/">
          <ListItemText primary="호텔 소개" />
        </ListItem>
        <ListItem button component={LinkBehavior} href="/rooms">
          <ListItemText primary="객실 소개" />
        </ListItem>
        <ListItem button component={LinkBehavior} href="/dining">
          <ListItemText primary="다이닝" />
        </ListItem>
        <ListItem button component={LinkBehavior} href="/facilities">
          <ListItemText primary="부대시설" />
        </ListItem>
        <ListItem button component={LinkBehavior} href="/services">
          <ListItemText primary="서비스" />
        </ListItem>
        <ListItem button component={LinkBehavior} href="/location">
          <ListItemText primary="오시는 길" />
        </ListItem>
        <ListItem button component={LinkBehavior} href="/booking">
          <ListItemText primary="예약" />
        </ListItem>

        {/* 게시글 메뉴 수정: href를 /reviews로 */}
        <ListItem button component={LinkBehavior} href="/reviews">
          <ListItemText primary="게시글" />
        </ListItem>

        <Divider />
        {isAuthenticated ? (
          <>
            <ListItem button component={LinkBehavior} href="/mypage">
              <ListItemText primary="마이페이지" />
            </ListItem>
            {isAdmin && (
              <ListItem button component={LinkBehavior} href="/admin">
                <ListItemText primary="관리자 패널" />
              </ListItem>
            )}
            <ListItem button onClick={handleLogout}>
              <ListItemText primary={`로그아웃 (${user?.name || '사용자'})`} />
            </ListItem>
          </>
        ) : (
          <ListItem button component={LinkBehavior} href="/login">
            <ListItemText primary="로그인" />
          </ListItem>
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
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button color="inherit" component={LinkBehavior} href="/" sx={{ '&:hover': { backgroundColor: 'transparent', color: 'primary.main' } }}>
                호텔 소개
              </Button>
              <Button color="inherit" component={LinkBehavior} href="/rooms" sx={{ ml: 2, '&:hover': { backgroundColor: 'transparent', color: 'primary.main' } }}>
                객실 소개
              </Button>
              <Button color="inherit" component={LinkBehavior} href="/dining" sx={{ ml: 2, '&:hover': { backgroundColor: 'transparent', color: 'primary.main' } }}>
                다이닝
              </Button>
              <Button color="inherit" component={LinkBehavior} href="/facilities" sx={{ ml: 2, '&:hover': { backgroundColor: 'transparent', color: 'primary.main' } }}>
                부대시설
              </Button>
              <Button color="inherit" component={LinkBehavior} href="/services" sx={{ ml: 2, '&:hover': { backgroundColor: 'transparent', color: 'primary.main' } }}>
                서비스
              </Button>
              <Button color="inherit" component={LinkBehavior} href="/reviews" sx={{ ml: 2, '&:hover': { backgroundColor: 'transparent', color: 'primary.main' } }}>
                게시글
              </Button>
              <Button color="inherit" component={LinkBehavior} href="/location" sx={{ ml: 2, '&:hover': { backgroundColor: 'transparent', color: 'primary.main' } }}>
                오시는 길
              </Button>
              <Button variant="contained" component={LinkBehavior} href="/booking" sx={{ ml: 2 }}>
                예약
              </Button>

              {isAuthenticated ? (
                <>
                  <Button
                    color="inherit"
                    component={LinkBehavior}
                    href="/mypage"
                    sx={{ ml: 2, '&:hover': { backgroundColor: 'transparent', color: 'primary.main' } }}
                  >
                    마이페이지
                  </Button>
                  {isAdmin && (
                    <Button
                      variant="outlined"
                      component={LinkBehavior}
                      href="/admin"
                      sx={{ ml: 2, borderColor: 'primary.main', color: 'primary.main' }}
                    >
                      관리자 패널
                    </Button>
                  )}
                  <Button
                    color="inherit"
                    onClick={handleLogout}
                    sx={{ ml: 2 }}
                  >
                    로그아웃 ({user?.name || '사용자'})
                  </Button>
                </>
              ) : (
                <Button variant="outlined" component={LinkBehavior} href="/login" sx={{ ml: 2 }}>
                  로그인
                </Button>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;