import React, { useState, useRef } from 'react';
import {
    AppBar, Toolbar, Typography, Button, IconButton, Drawer,
    List, ListItem, ListItemText, ListItemIcon, Box, Divider,
    Popover, Grid, useTheme, useMediaQuery, useScrollTrigger,
    Grow, MenuItem, Fade
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { NavLink as RouterNavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // ✨ 1. 이 줄이 추가되었습니다.

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import PoolIcon from '@mui/icons-material/Pool';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import HotelIcon from '@mui/icons-material/Hotel';

// ✨ 2. 아래의 가짜(Mock) useAuth 훅이 삭제되었습니다.

// ✅ [수정 가능] 호텔 전체의 브랜드 색상과 글꼴을 여기서 변경할 수 있습니다.
const hotelTheme = createTheme({
    palette: {
        primary: {
            main: '#1C385C', // 기본 색상 (네이비 블루)
        },
        secondary: {
            main: '#D4AF37', // 포인트 색상 (골드)
        },
        background: {
            default: '#F5F5F5', // 배경색
        },
        text: {
            primary: '#333333', // 기본 텍스트 색상
        },
    },
    typography: {
        fontFamily: '"Lato", "Noto Sans KR", sans-serif', // 전체 기본 글꼴
        h6: {
            fontFamily: '"Playfair Display", serif', // 로고, 제목용 글꼴
            fontWeight: 700,
        },
        button: {
            fontWeight: 700,
        },
    },
});

const NavbarComponent = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [menuPopoverAnchor, setMenuPopoverAnchor] = useState(null);
    const [isHovering, setIsHovering] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
    const navigate = useNavigate();
    const { isAuthenticated, isAdmin, user, logout } = useAuth(); // 이제 진짜 useAuth를 사용합니다.

    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
    });

    const menuBoxRef = useRef(null);

    const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleMouseEnter = () => {
        setIsHovering(true);
        setMenuPopoverAnchor(menuBoxRef.current);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        // ✅ [수정 가능] 마우스를 메뉴에서 뗐을 때 팝오버가 사라지기까지의 지연 시간입니다. (150ms = 0.15초)
        setTimeout(() => {
            if (!isHovering) {
                setMenuPopoverAnchor(null);
            }
        }, 150);
    };

    // ✅ [수정 가능] 네비게이션 바에 표시될 메뉴 항목들입니다.
    // text(이름), to(링크 주소), icon(아이콘), desc(설명)를 자유롭게 변경하거나 추가/삭제할 수 있습니다.
    const menuData = {
        '호텔 소개': [
             { text: '객실 소개', to: '/rooms', icon: <RoomServiceIcon />, desc: '편안하고 아늑한 객실을 만나보세요.' },
             { text: '다이닝', to: '/dining', icon: <RestaurantMenuIcon />, desc: '최고의 셰프가 선사하는 미식의 향연.' },
        ],
        '부대시설': [
             { text: '수영장', to: '/facilities', icon: <PoolIcon />, desc: '도심 속에서 즐기는 완벽한 휴식.' },
             { text: '피트니스', to: '/facilities/fitness', icon: <FitnessCenterIcon />, desc: '최신 장비로 활력을 되찾으세요.' },
        ],
        '게시글': [
             { text: '고객 후기', to: '/reviews', icon: <BookOnlineIcon />, desc: '내용 생각해보기' },
             { text: '이벤트', to: '/posts/events', icon: <RoomServiceIcon />, desc: '내용 생각해보기' },
        ],
        '오시는 길': [
             { text: '교통 안내', to: '/directions', icon: <PoolIcon />, desc: '내용 생각해보기.' },
             { text: '주차장 안내', to: '/location/parking', icon: <FitnessCenterIcon />, desc: '내용 생각해보기' },
        ],
    };

    const getActiveLinkStyle = ({ isActive }) => ({
        fontWeight: isActive ? 'bold' : 'normal',
        color: isActive ? theme.palette.secondary.main : 'inherit',
        textDecoration: 'none',
    });
    
    // ✅ [수정 가능] 데스크탑 메뉴 버튼의 공통 스타일입니다.
    const commonButtonSx = {
        mx: 1,
        py: 2,
        transition: 'color 0.3s ease',
        position: 'relative',
        '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 10, // 밑줄 위치
            left: '50%',
            transform: 'translateX(-50%) scaleX(0)',
            transformOrigin: 'center',
            width: '80%', // 밑줄 너비
            height: '2px', // 밑줄 두께
            backgroundColor: trigger ? theme.palette.secondary.main : 'white', // 스크롤 상태에 따른 밑줄 색상
            transition: 'transform 0.3s ease', // 밑줄 애니메이션 속도
        },
        '&:hover': {
            color: trigger ? theme.palette.secondary.main : 'white',
            backgroundColor: 'transparent',
        },
        '&:hover::after': {
            transform: 'translateX(-50%) scaleX(1)',
        },
    };

    const drawer = (
        <Box sx={{ width: 250, bgcolor: 'background.default' }} role="presentation">
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HotelIcon color="primary"/>
                    <Typography variant="h6" sx={{ color: 'primary.main' }}>Dev Hotel</Typography>
                </Box>
                <IconButton onClick={handleDrawerToggle}><CloseIcon /></IconButton>
            </Box>
            <Divider />
            <List sx={{ p: 1 }}>
                {Object.keys(menuData).map(category => (
                    <React.Fragment key={category}>
                        <ListItem>
                            <ListItemText primary={category} primaryTypographyProps={{ fontWeight: 'bold', color: 'text.secondary', fontSize: '0.9rem' }} />
                        </ListItem>
                        {menuData[category].map(item => (
                            <ListItem button component={RouterNavLink} to={item.to} key={item.text} onClick={handleDrawerToggle} sx={{ borderRadius: 1.5, mb: 0.5 }}>
                                <ListItemIcon sx={{color: 'primary.main'}}>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        ))}
                        <Divider sx={{ my: 1 }} />
                    </React.Fragment>
                ))}
                <ListItem button component={RouterNavLink} to="/booking" onClick={handleDrawerToggle} sx={{ borderRadius: 1.5, mb: 0.5 }}>
                    <ListItemIcon sx={{color: 'primary.main'}}><BookOnlineIcon /></ListItemIcon>
                    <ListItemText primary="예약" />
                </ListItem>
                <Divider />
                {isAuthenticated ? (
                    <>
                        <ListItem button component={RouterNavLink} to="/mypage" onClick={handleDrawerToggle}><ListItemText primary="마이페이지" /></ListItem>
                        {isAdmin && <ListItem button component={RouterNavLink} to="/admin" onClick={handleDrawerToggle}><ListItemText primary="관리자 패널" /></ListItem>}
                        <ListItem button onClick={() => { handleLogout(); handleDrawerToggle(); }}><ListItemText primary={`로그아웃 (${user?.name || '사용자'})`} /></ListItem>
                    </>
                ) : (
                    <ListItem button component={RouterNavLink} to="/login" onClick={handleDrawerToggle}><ListItemText primary="로그인" /></ListItem>
                )}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar
                position="sticky"
                elevation={0}
                // ✅ [수정 가능] 스크롤을 내렸을 때 네비게이션 바의 스타일입니다.
                sx={{
                    backgroundColor: trigger ? 'rgba(255, 255, 255, 0.9)' : 'transparent', // 배경색 (투명 -> 반투명 흰색)
                    backdropFilter: trigger ? 'blur(8px)' : 'none', // 블러 효과
                    color: trigger ? 'text.primary' : 'white', // 글자색 (흰색 -> 검정)
                    boxShadow: trigger ? '0 2px 10px rgba(0,0,0,0.1)' : 'none', // 그림자 효과
                    transition: 'all 0.4s ease-in-out', // 전체 애니메이션 속도
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="h6" component={RouterNavLink} to="/" sx={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <HotelIcon />
                        Dev Hotel
                    </Typography>
                    <Box
                        ref={menuBoxRef}
                        sx={{ flexGrow: 1, display: { xs: 'none', lg: 'flex' }, justifyContent: 'center' }}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        {Object.keys(menuData).map(category => (
                            <Button key={category} color="inherit" sx={commonButtonSx}>
                                {category}
                            </Button>
                        ))}
                    </Box>
                    <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center' }}>
                        {/* ✅ [수정 가능] '예약' 버튼의 스타일입니다. */}
                        <Button
                            variant="contained"
                            startIcon={<BookOnlineIcon />}
                            component={RouterNavLink}
                            to="/booking"
                            sx={{
                                bgcolor: 'secondary.main', // 배경색 (테마의 secondary 색상)
                                color: 'primary.main', // 글자색 (테마의 primary 색상)
                                borderRadius: 50,
                                px: 3,
                                mx: 2,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    bgcolor: 'secondary.dark', // 마우스 올렸을 때 배경색
                                    transform: 'scale(1.05)', // 마우스 올렸을 때 살짝 커지는 효과
                                    boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)',
                                }
                            }}
                        >
                            예약
                        </Button>
                        {isAuthenticated ? (
                            <>
                                <Button
                                    color="inherit"
                                    component={RouterNavLink}
                                    to="/mypage"
                                    style={getActiveLinkStyle}
                                    startIcon={<AccountCircleIcon />}
                                    sx={{ ml: 1, textTransform: 'none' }}
                                >
                                    마이페이지
                                </Button>
                                <Button
                                    color="inherit"
                                    onClick={handleLogout}
                                    startIcon={<LogoutIcon />}
                                    sx={{ textTransform: 'none' }}
                                >
                                    로그아웃
                                </Button>
                            </>
                        ) : (
                            <Button variant="outlined" component={RouterNavLink} to="/login" startIcon={<LoginIcon />}
                                sx={{
                                    borderColor: trigger ? 'primary.main' : 'white',
                                    color: trigger ? 'primary.main' : 'white',
                                    borderRadius: 50,
                                    '&:hover': { borderColor: trigger ? 'primary.dark' : '#eee', backgroundColor: 'rgba(255,255,255,0.1)' }
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

            <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerToggle}>{drawer}</Drawer>
            
            <Popover
                open={Boolean(menuPopoverAnchor)}
                anchorEl={menuPopoverAnchor}
                TransitionComponent={Fade}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                onClose={handleMouseLeave}
                // ✅ [수정 가능] 팝오버(메가 메뉴) 창의 스타일입니다.
                PaperProps={{
                    onMouseEnter: () => setIsHovering(true),
                    onMouseLeave: handleMouseLeave,
                    sx: {
                        mt: 1,
                        width: '100%',
                        maxWidth: 650, // 팝오버 창의 최대 너비
                        borderRadius: 3, // 모서리 둥글기
                        backdropFilter: 'blur(12px)', // 뒷 배경 블러 효과
                        background: 'rgba(255, 255, 255, 0.92)', // 반투명 배경색
                        boxShadow: '0 10px 35px rgba(0,0,0,0.1)',
                        border: `1px solid ${theme.palette.divider}`,
                        overflow: 'hidden',
                        p: 4,
                    }
                }}
                disableRestoreFocus
            >
                <Grid container spacing={4}>
                    {Object.entries(menuData).map(([category, items]) => (
                        <Grid item xs={12} sm={6} key={category}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1.5, color: 'secondary.main', fontSize: '1.1rem' }}>{category}</Typography>
                            <Divider sx={{ mb: 1.5 }} />
                            <List sx={{ p: 0 }}>
                                {items.map((item, index) => (
                                    <Grow
                                        in={!!menuPopoverAnchor}
                                        // ✅ [수정 가능] 메뉴 아이템이 나타나는 애니메이션의 지연 시간입니다. (index * 60ms)
                                        style={{ transformOrigin: '0 0 0', transitionDelay: `${index * 60}ms` }}
                                        key={item.text}
                                    >
                                        <MenuItem
                                            component={RouterNavLink} to={item.to}
                                            onClick={() => {
                                                navigate(item.to);
                                                setMenuPopoverAnchor(null);
                                            }}
                                            sx={{
                                                p: 1.5, borderRadius: 2, mb: 1,
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    backgroundColor: theme.palette.primary.main,
                                                    color: 'white',
                                                    transform: 'translateX(5px)',
                                                    '& .MuiListItemIcon-root, & .MuiListItemText-secondary': { color: 'white' },
                                                }
                                            }}
                                        >
                                            <ListItemIcon sx={{ mr: 1.5, fontSize: '1.8rem', color: theme.palette.primary.main, transition: 'color 0.2s' }}>
                                                {item.icon}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={item.text}
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