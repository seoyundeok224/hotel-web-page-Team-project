import React, { useState, forwardRef } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText, useTheme, useMediaQuery, Box, Divider } from '@mui/material';
<<<<<<< HEAD
import { Link as RouterLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
=======
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../contexts/AuthContext';
>>>>>>> sjh



const LinkBehavior = forwardRef((props, ref) => {
  const { href, ...other } = props;
  return <RouterLink ref={ref} to={href} {...other} />;
});

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
<<<<<<< HEAD
=======
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
>>>>>>> sjh

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

<<<<<<< HEAD
=======
  const handleLogout = () => {
    logout();
    navigate('/');
  };

>>>>>>> sjh
  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle} onKeyDown={handleDrawerToggle}>
      <List>
        <ListItem button component={LinkBehavior} href="/">
          <ListItemText primary="호텔 소개" />
        </ListItem>
        <ListItem button component={LinkBehavior} href="/rooms">
          <ListItemText primary="객실 소개" />
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
        <Divider />
<<<<<<< HEAD
        <ListItem button component={LinkBehavior} href="/login">
          <ListItemText primary="로그인" />
        </ListItem>
=======
        {isAuthenticated ? (
          <>
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
>>>>>>> sjh
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
              <Button color="inherit" component={LinkBehavior} href="/" sx={{ '&:hover': { backgroundColor: 'transparent', color: 'primary.main' } }}>호텔 소개</Button>
              <Button color="inherit" component={LinkBehavior} href="/rooms" sx={{ '&:hover': { backgroundColor: 'transparent', color: 'primary.main' } }}>객실 소개</Button>
              <Button color="inherit" component={LinkBehavior} href="/services" sx={{ '&:hover': { backgroundColor: 'transparent', color: 'primary.main' } }}>서비스</Button>
              <Button color="inherit" component={LinkBehavior} href="/location" sx={{ '&:hover': { backgroundColor: 'transparent', color: 'primary.main' } }}>오시는 길</Button>
<<<<<<< HEAD
              <Button variant="outlined" component={LinkBehavior} href="/login" sx={{ ml: 2 }}>로그인</Button>
              <Button variant="contained" component={LinkBehavior} href="/booking" sx={{ ml: 2 }}>예약</Button>
=======
              <Button variant="contained" component={LinkBehavior} href="/booking" sx={{ ml: 2 }}>예약</Button>
              
              {isAuthenticated ? (
                <>
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
                <Button variant="outlined" component={LinkBehavior} href="/login" sx={{ ml: 2 }}>로그인</Button>
              )}
>>>>>>> sjh
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
