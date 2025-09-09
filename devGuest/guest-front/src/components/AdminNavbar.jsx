import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText, useTheme, useMediaQuery, Box, Divider, ListItemIcon } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BedIcon from '@mui/icons-material/Bed';
import PeopleIcon from '@mui/icons-material/People';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import { useAuth } from '../contexts/AuthContext';

const AdminNavbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const adminMenuItems = [
    { text: '대시보드', path: '/admin', icon: <DashboardIcon /> },
    { text: '객실 관리', path: '/admin/rooms', icon: <BedIcon /> },
    { text: '고객 관리', path: '/admin/guests', icon: <PeopleIcon /> },
    { text: '예약 관리', path: '/admin/reservations', icon: <BookOnlineIcon /> },
    { text: '리포트 & 분석', path: '/admin/reports', icon: <AnalyticsIcon /> },
  ];

  const drawer = (
    <Box sx={{ width: 280 }} role="presentation">
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          관리자 패널
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user?.name || '관리자'}님 환영합니다
        </Typography>
      </Box>
      
      <List>
        {adminMenuItems.map((item) => (
          <ListItem 
            key={item.text}
            button 
            component={RouterLink} 
            to={item.path}
            onClick={isMobile ? handleDrawerToggle : undefined}
            sx={{
              '&:hover': {
                backgroundColor: 'action.hover',
              }
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        
        <Divider sx={{ my: 1 }} />
        
        <ListItem 
          button 
          component={RouterLink} 
          to="/"
          onClick={isMobile ? handleDrawerToggle : undefined}
          sx={{
            '&:hover': {
              backgroundColor: 'action.hover',
            }
          }}
        >
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText primary="고객 사이트로" />
        </ListItem>
        
        <ListItem 
          button 
          onClick={() => {
            handleLogout();
            if (isMobile) handleDrawerToggle();
          }}
          sx={{
            '&:hover': {
              backgroundColor: 'action.hover',
            }
          }}
        >
          <ListItemIcon><LogoutIcon /></ListItemIcon>
          <ListItemText primary="로그아웃" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography 
            variant="h6" 
            component={RouterLink} 
            to="/admin"
            sx={{ 
              textDecoration: 'none', 
              color: 'white', 
              fontWeight: 'bold',
              '&:hover': {
                opacity: 0.8
              }
            }}
          >
            Dev Hotel - 관리자
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
              {adminMenuItems.map((item) => (
                <Button 
                  key={item.text}
                  color="inherit" 
                  component={RouterLink} 
                  to={item.path}
                  sx={{ 
                    mx: 1,
                    '&:hover': { 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)' 
                    } 
                  }}
                >
                  {item.text}
                </Button>
              ))}
              <Button 
                color="inherit"
                component={RouterLink}
                to="/"
                sx={{ 
                  mx: 1,
                  '&:hover': { 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)' 
                  } 
                }}
              >
                고객 사이트
              </Button>
              <Button 
                color="inherit"
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                sx={{ 
                  ml: 2,
                  '&:hover': { 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)' 
                  } 
                }}
              >
                로그아웃
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default AdminNavbar;
