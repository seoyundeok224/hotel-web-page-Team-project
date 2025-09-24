import React, { useState, useRef } from 'react';
import {
    AppBar, Toolbar, Typography, Button, IconButton, Drawer,
    List, ListItem, ListItemText, ListItemIcon, Box, Divider, Popover, Grid, 
    useTheme, Grow, MenuItem, Fade, Avatar, useScrollTrigger, Collapse, ListItemButton
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { NavLink as RouterNavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { keyframes } from '@mui/system';

// Icons
import {
    Menu as MenuIcon, Close as CloseIcon, RoomService as RoomServiceIcon,
    RestaurantMenu as RestaurantMenuIcon, Pool as PoolIcon, FitnessCenter as FitnessCenterIcon,
    BookOnline as BookOnlineIcon, Login as LoginIcon, Logout as LogoutIcon, Hotel as HotelIcon,
    Instagram as InstagramIcon, Facebook as FacebookIcon, YouTube as YouTubeIcon,
    ExpandLess, ExpandMore
} from '@mui/icons-material';

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 4px 15px rgba(212, 175, 55, 0.2); }
  50% { transform: scale(1.05); box-shadow: 0 4px 25px rgba(212, 175, 55, 0.4); }
  100% { transform: scale(1); box-shadow: 0 4px 15px rgba(212, 175, 55, 0.2); }
`;

const hotelTheme = createTheme({
    palette: {
        primary: { main: '#2C3E50' },
        secondary: { main: '#D4AF37' },
        background: { default: '#ECF0F1' },
        text: { primary: '#34495E' },
    },
    typography: {
        fontFamily: '"Montserrat", "Noto Sans KR", sans-serif',
        h6: { fontFamily: '"Cormorant Garamond", serif', fontWeight: 700 },
        button: { fontWeight: 700 },
    },
});

/** [데이터] 네비게이션 바 메뉴의 내용과 구조를 정의합니다. */
const menuData = {
    '호텔 소개': [
        // [복원] 각 메뉴 항목에 desc (설명) 속성을 다시 추가했습니다.
        { text: '객실 소개', to: '/rooms', icon: <RoomServiceIcon />, desc: '편안하고 아늑한 객실을 만나보세요.' },
        { text: '다이닝', to: '/dining', icon: <RestaurantMenuIcon />, desc: '최고의 셰프가 선사하는 미식의 향연.' },
    ],
    '부대시설': [
        { text: '수영장', to: '/facilities', icon: <PoolIcon />, desc: '도심 속에서 즐기는 완벽한 휴식.' },
        { text: '피트니스', to: '/facilities/fitness', icon: <FitnessCenterIcon />, desc: '최신 장비로 활력을 되찾으세요.' },
    ],
    '게시글': [
        { text: '고객 후기', to: '/reviews', icon: <BookOnlineIcon />, desc: '생생한 이용 후기를 확인해보세요.' },
        { text: '이벤트', to: '/posts/events', icon: <RoomServiceIcon />, desc: '놓칠 수 없는 특별한 혜택.' },
    ],
    '오시는 길': [
        { text: '교통 안내', to: '/directions', icon: <PoolIcon />, desc: '호텔까지 가장 편하게 오는 방법.' },
        { text: '주차장 안내', to: '/location/parking', icon: <FitnessCenterIcon />, desc: '편리한 주차 정보를 안내합니다.' },
    ],
};


const NavbarComponent = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [menuPopoverAnchor, setMenuPopoverAnchor] = useState(null);
    const [openCategory, setOpenCategory] = useState(null);

    const theme = useTheme();
    const navigate = useNavigate();
    const { isAuthenticated, isAdmin, user, logout } = useAuth();
    const menuBoxRef = useRef(null);
    const popoverTimeout = useRef(null);

    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 30,
    });

    const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);
    
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handlePopoverOpen = () => {
        clearTimeout(popoverTimeout.current);
        setMenuPopoverAnchor(menuBoxRef.current);
    };

    const handlePopoverClose = () => {
        popoverTimeout.current = setTimeout(() => {
            setMenuPopoverAnchor(null);
        }, 300);
    };
    
    const handleCategoryClick = (category) => {
        setOpenCategory(prevOpen => (prevOpen === category ? null : category));
    };

    const getActiveLinkStyle = ({ isActive }) => ({
        fontWeight: isActive ? 'bold' : 'normal',
        color: isActive ? theme.palette.secondary.main : 'inherit',
        textDecoration: 'none',
    });
    
    const commonButtonSx = {
        mx: 1, py: 1, borderRadius: '8px', position: 'relative',
        transition: 'all 0.3s ease',
        '&:hover': {
            color: 'white', backgroundColor: theme.palette.primary.main,
        },
    };

    const drawer = (
        <Box 
            sx={{ 
                width: 250, height: '100%', 
                background: `linear-gradient(180deg, ${theme.palette.background.default}, #ffffff)`,
            }} 
            role="presentation"
        >
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HotelIcon color="primary"/>
                    <Typography variant="h6" sx={{ color: 'primary.main' }}>Dev Hotel</Typography>
                </Box>
                <IconButton onClick={handleDrawerToggle}><CloseIcon /></IconButton>
            </Box>
            <Divider />
            <List sx={{ p: 1, pb: 10 }}>
                {Object.entries(menuData).map(([category, items]) => (
                    <React.Fragment key={category}>
                        <ListItemButton onClick={() => handleCategoryClick(category)}>
                            <ListItemText 
                                primary={category} 
                                primaryTypographyProps={{ fontWeight: 'bold', color: 'text.secondary', fontSize: '0.9rem' }} 
                            />
                            {openCategory === category ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={openCategory === category} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding sx={{ pl: 2 }}>
                                {items.map(item => (
                                    <ListItem
                                        button component={RouterNavLink} to={item.to} key={item.text}
                                        onClick={handleDrawerToggle}
                                        sx={{ borderRadius: 1.5, mb: 0.5, '&.active': { backgroundColor: theme.palette.secondary.main + '20', borderLeft: `4px solid ${theme.palette.secondary.main}` } }}
                                    >
                                        <ListItemIcon sx={{ color: 'primary.main' }}>{item.icon}</ListItemIcon>
                                        <ListItemText primary={item.text} />
                                    </ListItem>
                                ))}
                            </List>
                        </Collapse>
                        <Divider sx={{ my: 1 }} />
                    </React.Fragment>
                ))}
                
                <ListItem button component={RouterNavLink} to="/booking" onClick={handleDrawerToggle} sx={{ borderRadius: 1.5, mb: 0.5, '&.active': { backgroundColor: theme.palette.secondary.main + '20', borderLeft: `4px solid ${theme.palette.secondary.main}` } }}>
                    <ListItemIcon sx={{color: 'primary.main'}}><BookOnlineIcon /></ListItemIcon>
                    <ListItemText primary="예약" />
                </ListItem>
                <Divider />
                {isAuthenticated ? (
                    <>
                        <ListItem button component={RouterNavLink} to="/mypage" onClick={handleDrawerToggle} sx={{ borderRadius: 1.5, mb: 0.5, '&.active': { backgroundColor: theme.palette.secondary.main + '20', borderLeft: `4px solid ${theme.palette.secondary.main}` } }}>
                            <ListItemText primary="마이페이지" />
                        </ListItem>
                        {isAdmin && (
                            <ListItem button component={RouterNavLink} to="/admin" onClick={handleDrawerToggle} sx={{ borderRadius: 1.5, mb: 0.5, '&.active': { backgroundColor: theme.palette.secondary.main + '20', borderLeft: `4px solid ${theme.palette.secondary.main}` } }}>
                                <ListItemText primary="관리자 패널" />
                            </ListItem>
                        )}
                        <ListItem button onClick={() => { handleLogout(); handleDrawerToggle(); }}>
                            <ListItemText primary={`로그아웃 (${user?.name || '사용자'})`} />
                        </ListItem>
                    </>
                ) : (
                    <ListItem button component={RouterNavLink} to="/login" onClick={handleDrawerToggle} sx={{ borderRadius: 1.5, mb: 0.5, '&.active': { backgroundColor: theme.palette.secondary.main + '20', borderLeft: `4px solid ${theme.palette.secondary.main}` } }}>
                         <ListItemText primary="로그인" />
                    </ListItem>
                )}
            </List>
            
            <Box sx={{ position: 'absolute', bottom: 0, width: '100%', p: 2, textAlign: 'center' }}>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="caption" color="text.secondary">Follow Us</Typography>
                <Box sx={{ mt: 1 }}>
                    <IconButton size="small" component="a" href="https://instagram.com" target="_blank"><InstagramIcon /></IconButton>
                    <IconButton size="small" component="a" href="https://facebook.com" target="_blank"><FacebookIcon /></IconButton>
                    <IconButton size="small" component="a" href="https://youtube.com" target="_blank"><YouTubeIcon /></IconButton>
                </Box>
            </Box>
        </Box>
    );

    return (
        <>
            <AppBar
                position="sticky"
                elevation={trigger ? 4 : 0}
                sx={{
                    background: `linear-gradient(to right, ${theme.palette.background.default}F2, ${theme.palette.background.default}E6)`,
                    backdropFilter: 'blur(8px)',
                    color: 'text.primary',
                    transition: 'all 0.3s ease-in-out',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                }}
            >
                <Toolbar sx={{ 
                    justifyContent: 'space-between',
                    minHeight: trigger ? 64 : 80,
                    transition: 'min-height 0.3s ease-in-out',
                }}>
                    <Typography variant="h6" component={RouterNavLink} to="/" sx={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <HotelIcon />
                        Dev Hotel
                    </Typography>
                    
                    <Box
                        ref={menuBoxRef}
                        onMouseEnter={handlePopoverOpen}
                        onMouseLeave={handlePopoverClose}
                        sx={{ flexGrow: 1, display: { xs: 'none', lg: 'flex' }, justifyContent: 'center' }}
                    >
                        {Object.keys(menuData).map(category => (
                            <Button key={category} color="inherit" sx={commonButtonSx}>
                                {category}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            startIcon={<BookOnlineIcon />}
                            component={RouterNavLink} to="/booking"
                            sx={{
                                bgcolor: 'secondary.main', color: 'primary.main',
                                borderRadius: 50, px: 3, mx: 2,
                                transition: 'all 0.3s ease',
                                animation: `${pulse} 2.5s infinite`,
                                '&:hover': {
                                    bgcolor: theme.palette.secondary.dark,
                                    transform: 'scale(1.03)',
                                    animation: 'none',
                                }
                            }}
                        >
                            예약
                        </Button>
                        {isAuthenticated ? (
                            <>
                                <Button component={RouterNavLink} to="/mypage" style={getActiveLinkStyle} sx={{ ml: 1, textTransform: 'none', borderRadius: 50 }}>
                                    <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main' }} alt={user?.name} src={user?.avatarUrl}>
                                        {user?.name?.charAt(0)}
                                    </Avatar>
                                    {user?.name}
                                </Button>
                                {isAdmin && (
                                    <Button color="inherit" component={RouterNavLink} to="/admin" style={getActiveLinkStyle} sx={{ ml: 1, textTransform: 'none' }}>
                                        관리자 패널
                                    </Button>
                                )}
                                <IconButton color="primary" onClick={handleLogout} sx={{ ml: 1 }}>
                                    <LogoutIcon />
                                </IconButton>
                            </>
                        ) : (
                            <Button variant="outlined" component={RouterNavLink} to="/login" startIcon={<LoginIcon />}
                                sx={{
                                    borderColor: 'primary.main', color: 'primary.main',
                                    borderRadius: 50,
                                    '&:hover': {
                                        borderColor: 'primary.dark',
                                        backgroundColor: 'rgba(0,0,0,0.04)'
                                    }
                                }}>
                                로그인
                            </Button>
                        )}
                    </Box>
                    
                    <IconButton color="inherit" onClick={handleDrawerToggle} sx={{ display: { lg: 'none' } }}>
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            
            <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerToggle}>
                {drawer}
            </Drawer>
            
            <Popover
                sx={{ pointerEvents: 'none' }}
                open={Boolean(menuPopoverAnchor)}
                anchorEl={menuPopoverAnchor}
                onClose={() => setMenuPopoverAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                TransitionComponent={Fade}
                disableRestoreFocus
                PaperProps={{
                    sx: { pointerEvents: 'auto' },
                    onMouseEnter: handlePopoverOpen,
                    onMouseLeave: handlePopoverClose,
                }}
            >
                <Grid container spacing={4} sx={{ p: 4, width: '100%', maxWidth: 650, background: 'rgba(255, 255, 255, 0.96)', backdropFilter: 'blur(10px)', borderRadius: 3 }}>
                    {Object.entries(menuData).map(([category, items]) => (
                        <Grid item xs={12} sm={6} key={category}>
                            <Typography variant="h6" sx={{ mb: 1.5, fontSize: '1.1rem', fontWeight: 'bold', color: 'secondary.main' }}>
                                {category}
                            </Typography>
                            <Divider sx={{ mb: 1.5 }} />
                            <List sx={{ p: 0 }}>
                                {items.map((item, index) => (
                                    <Grow in={!!menuPopoverAnchor} key={item.text} style={{ transformOrigin: '0 0 0', transitionDelay: `${index * 60}ms` }}>
                                        <MenuItem
                                            component={RouterNavLink} to={item.to}
                                            onClick={() => setMenuPopoverAnchor(null)}
                                            sx={{ p: 1.5, mb: 1, borderRadius: 2, transition: 'all 0.2s ease', '&:hover': { color: 'white', transform: 'translateX(5px)', backgroundColor: theme.palette.primary.main, '& .MuiListItemIcon-root, & .MuiListItemText-secondary': { color: 'white' } } }}
                                        >
                                            <ListItemIcon sx={{ mr: 1.5, fontSize: '1.8rem', color: 'primary.main', transition: 'color 0.2s' }}>
                                                {item.icon}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={item.text}
                                                // [복원] item.desc를 secondary 텍스트로 다시 연결했습니다.
                                                secondary={item.desc}
                                                primaryTypographyProps={{ fontWeight: 500 }}
                                                secondaryTypographyProps={{ fontSize: '0.8rem', whiteSpace: 'normal', color: 'text.secondary', transition: 'color 0.2s' }}
                                            />
                                        </MenuItem>
                                    </Grow>
                                ))}
                            </List>
                        </Grid>
                    ))}
                </Grid>
            </Popover>
        </>
    );
};

const Navbar = () => (
    <ThemeProvider theme={hotelTheme}>
        <NavbarComponent />
    </ThemeProvider>
);

export default Navbar;