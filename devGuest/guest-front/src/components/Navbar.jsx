// React 및 필요한 훅 import
import React, { useState, useRef } from 'react';

// MUI 컴포넌트 import
import {
    AppBar, Toolbar, Typography, Button, IconButton, Drawer,
    List, ListItem, ListItemText, ListItemIcon, Box, Divider, Popover, Grid,
    useTheme, Grow, MenuItem, Fade, Avatar, useScrollTrigger, Collapse, ListItemButton
} from '@mui/material';

// MUI 테마 관련 API import
import { ThemeProvider, createTheme } from '@mui/material/styles';

// 라우팅 관련 import
import { NavLink as RouterNavLink, useNavigate } from 'react-router-dom';

// 인증 컨텍스트 (로그인/로그아웃/권한 확인)
import { useAuth } from '../contexts/AuthContext';

// keyframes 애니메이션을 위한 MUI system import
import { keyframes } from '@mui/system';

// MUI 아이콘 import
import {
    Menu as MenuIcon, Close as CloseIcon, RoomService as RoomServiceIcon,
    RestaurantMenu as RestaurantMenuIcon, Pool as PoolIcon, FitnessCenter as FitnessCenterIcon,
    BookOnline as BookOnlineIcon, Login as LoginIcon, Logout as LogoutIcon, Hotel as HotelIcon,
    Instagram as InstagramIcon, Facebook as FacebookIcon, YouTube as YouTubeIcon,
    ExpandLess, ExpandMore
} from '@mui/icons-material';

// 예약 버튼에 적용할 "맥동(pulse)" 애니메이션 정의
const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 4px 15px rgba(212, 175, 55, 0.2); }
  50% { transform: scale(1.05); box-shadow: 0 4px 25px rgba(212, 175, 55, 0.4); }
  100% { transform: scale(1); box-shadow: 0 4px 15px rgba(212, 175, 55, 0.2); }
`;

// 호텔 웹사이트 전체에 적용될 테마 정의
const hotelTheme = createTheme({
    palette: {
        primary: { main: '#2C3E50' }, // 네이비톤 메인 컬러
        secondary: { main: '#D4AF37' }, // 골드톤 포인트 컬러
        background: { default: '#ECF0F1' }, // 기본 배경색
        text: { primary: '#34495E' }, // 텍스트 기본 색
    },
    typography: {
        fontFamily: '"Montserrat", "Noto Sans KR", sans-serif', // 기본 폰트
        h6: { fontFamily: '"Cormorant Garamond", serif', fontWeight: 700 }, // 제목 폰트
        button: { fontWeight: 700 }, // 버튼은 두껍게
    },
});

// 네비게이션에 표시될 메뉴 데이터 (카테고리별 하위 항목 포함)
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
        { text: '고객 후기', to: '/reviews', icon: <BookOnlineIcon />, desc: '생생한 이용 후기를 확인해보세요.' },
        { text: '이벤트', to: '/posts/events', icon: <RoomServiceIcon />, desc: '놓칠 수 없는 특별한 혜택.' },
    ],
    '오시는 길': [
        { text: '교통 안내', to: '/directions', icon: <PoolIcon />, desc: '호텔까지 가장 편하게 오는 방법.' },
        { text: '주차장 안내', to: '/location/parking', icon: <FitnessCenterIcon />, desc: '편리한 주차 정보를 안내합니다.' },
    ],
};

const NavbarComponent = () => {
    // 상태값 관리
    const [drawerOpen, setDrawerOpen] = useState(false); // 모바일 Drawer 열림 여부
    const [menuPopoverAnchor, setMenuPopoverAnchor] = useState(null); // 데스크탑 Popover anchor 위치
    const [openCategory, setOpenCategory] = useState(null); // Drawer/Popover에서 열려 있는 카테고리

    const theme = useTheme(); // MUI 테마 참조
    const navigate = useNavigate(); // 라우팅 이동을 위한 함수
    const { isAuthenticated, isAdmin, user, logout } = useAuth(); // 인증 상태, 사용자 정보 가져오기
    const menuBoxRef = useRef(null); // Popover를 띄우기 위한 DOM 참조
    const popoverTimeout = useRef(null); // Popover 닫힘 딜레이를 위한 ref

    // 스크롤이 일정 이상 내려가면 AppBar 스타일을 변경하기 위한 trigger
    const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 30 });

    // Drawer 열기/닫기 토글
    const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

    // 로그아웃 처리 후 홈으로 이동
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Popover 열기 (마우스 hover 시 실행)
    const handlePopoverOpen = () => {
        clearTimeout(popoverTimeout.current); // 닫힘 타이머 초기화
        setMenuPopoverAnchor(menuBoxRef.current);
    };

    // Popover 닫기 (약간의 지연 후 닫힘)
    const handlePopoverClose = () => {
        popoverTimeout.current = setTimeout(() => {
            setMenuPopoverAnchor(null);
        }, 300);
    };

    // NavLink의 active 상태일 때 스타일 적용
    const getActiveLinkStyle = ({ isActive }) => ({
        fontWeight: isActive ? 'bold' : 'normal',
        color: isActive ? theme.palette.secondary.main : 'inherit',
        textDecoration: 'none',
    });

    // 공통 버튼 스타일 (메뉴 버튼 등에 적용)
    const commonButtonSx = {
        mx: 1, py: 1, borderRadius: '8px', position: 'relative',
        transition: 'all 0.3s ease',
        '&:hover': {
            color: 'white', backgroundColor: theme.palette.primary.main,
        },
    };

    // 모바일 Drawer 구성
    const drawer = (
        <Box
            sx={{
                width: 250, height: '100%',
                background: `linear-gradient(180deg, ${theme.palette.background.default}, #ffffff)`,
            }}
            role="presentation"
        >
            {/* Drawer 헤더 (로고 + 닫기 버튼) */}
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HotelIcon color="primary" />
                    <Typography variant="h6" sx={{ color: 'primary.main' }}>Dev Hotel</Typography>
                </Box>
                <IconButton onClick={handleDrawerToggle}><CloseIcon /></IconButton>
            </Box>
            <Divider />

            {/* Drawer 내부 메뉴 리스트 */}
            <List sx={{ p: 1, pb: 10 }}>
                {/* 카테고리별 메뉴 출력 */}
                {Object.entries(menuData).map(([category, items]) => (
                    <Box
                        key={category}
                        onMouseEnter={() => setOpenCategory(category)} // hover 시 열림
                        onMouseLeave={() => setOpenCategory(null)} // hover 해제 시 닫힘
                        onTouchStart={() => setOpenCategory(category)} // 모바일 터치 대응
                    >
                        {/* 카테고리 제목 */}
                        <ListItemButton>
                            <ListItemText
                                primary={category}
                                primaryTypographyProps={{
                                    fontWeight: 'bold',
                                    color: 'text.secondary',
                                    fontSize: '0.9rem'
                                }}
                            />
                            {openCategory === category ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>

                        {/* 하위 메뉴 (Collapse로 열고 닫힘 애니메이션) */}
                        <Collapse in={openCategory === category} timeout={{ enter: 400, exit: 300 }} unmountOnExit>
                            <List component="div" disablePadding sx={{ pl: 2 }}>
                                {items.map(item => (
                                    <ListItem
                                        button
                                        component={RouterNavLink}
                                        to={item.to}
                                        key={item.text}
                                        onClick={handleDrawerToggle} // 메뉴 클릭 시 Drawer 닫기
                                        sx={{
                                            borderRadius: 1.5, mb: 0.5,
                                            '&.active': {
                                                backgroundColor: theme.palette.secondary.main + '20',
                                                borderLeft: `4px solid ${theme.palette.secondary.main}`
                                            }
                                        }}
                                    >
                                        <ListItemIcon sx={{ color: 'primary.main' }}>{item.icon}</ListItemIcon>
                                        <ListItemText primary={item.text} />
                                    </ListItem>
                                ))}
                            </List>
                        </Collapse>
                        <Divider sx={{ my: 1 }} />
                    </Box>
                ))}

                {/* 예약 버튼 (Drawer 전용) */}
                <ListItem
                    button
                    component={RouterNavLink}
                    to="/booking"
                    onClick={handleDrawerToggle}
                    sx={{
                        borderRadius: 1.5, mb: 0.5,
                        '&.active': {
                            backgroundColor: theme.palette.secondary.main + '20',
                            borderLeft: `4px solid ${theme.palette.secondary.main}`
                        }
                    }}
                >
                    <ListItemIcon sx={{ color: 'primary.main' }}><BookOnlineIcon /></ListItemIcon>
                    <ListItemText primary="예약" />
                </ListItem>

                <Divider />

                {/* 로그인 여부에 따른 메뉴 분기 */}
                {isAuthenticated ? (
                    <>
                        {/* 마이페이지 */}
                        <ListItem
                            button component={RouterNavLink} to="/mypage"
                            onClick={handleDrawerToggle}
                            sx={{ borderRadius: 1.5 }}
                        >
                            <ListItemText primary="마이페이지" />
                        </ListItem>
                        {/* 관리자 권한이 있는 경우 */}
                        {isAdmin && (
                            <ListItem
                                button component={RouterNavLink} to="/admin"
                                onClick={handleDrawerToggle}
                                sx={{ borderRadius: 1.5 }}
                            >
                                <ListItemText primary="관리자 패널" />
                            </ListItem>
                        )}
                        {/* 로그아웃 */}
                        <ListItem button onClick={() => { handleLogout(); handleDrawerToggle(); }}>
                            <ListItemText primary={`로그아웃 (${user?.name || '사용자'})`} />
                        </ListItem>
                    </>
                ) : (
                    // 로그인 메뉴 (비로그인 상태)
                    <ListItem
                        button component={RouterNavLink} to="/login"
                        onClick={handleDrawerToggle}
                        sx={{ borderRadius: 1.5 }}
                    >
                        <ListItemText primary="로그인" />
                    </ListItem>
                )}
            </List>

            {/* Drawer 하단 소셜 미디어 링크 */}
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
            {/* 최상단 네비게이션 바 */}
            <AppBar position="sticky" elevation={trigger ? 4 : 0} sx={{
                background: `linear-gradient(to right, ${theme.palette.background.default}F2, ${theme.palette.background.default}E6)`, // 반투명 그라데이션
                backdropFilter: 'blur(8px)', // 블러 효과
                color: 'text.primary',
                borderBottom: `1px solid ${theme.palette.divider}`, // 하단 경계선
            }}>
                <Toolbar sx={{
                    justifyContent: 'space-between',
                    minHeight: trigger ? 64 : 80, // 스크롤 여부에 따라 높이 변경
                }}>
                    {/* 로고 (홈 링크) */}
                    <Typography variant="h6" component={RouterNavLink} to="/" sx={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <HotelIcon />
                        Dev Hotel
                    </Typography>

                    {/* 데스크탑 전용 메뉴 버튼 (Popover 트리거) */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', lg: 'flex' }, justifyContent: 'center' }}>
                        <Box ref={menuBoxRef} onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose} sx={{ display: 'flex' }}>
                            {Object.keys(menuData).map(category => (
                                <Button key={category} color="inherit" sx={commonButtonSx}>
                                    {category}
                                </Button>
                            ))}
                        </Box>
                    </Box>

                    {/* 로그인 / 예약 버튼 / 유저 메뉴 (데스크탑) */}
                    <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center' }}>
                        {/* 예약 버튼 (강조) */}
                        <Button
                            variant="contained"
                            startIcon={<BookOnlineIcon />}
                            component={RouterNavLink} to="/booking"
                            sx={{
                                bgcolor: 'secondary.main', color: 'primary.main',
                                borderRadius: 50, px: 3, mx: 2,
                                animation: `${pulse} 2.5s infinite`, // 예약 버튼 애니메이션 적용
                                '&:hover': {
                                    bgcolor: theme.palette.secondary.dark,
                                    transform: 'scale(1.03)',
                                    animation: 'none', // hover 시 애니메이션 정지
                                }
                            }}
                        >
                            예약
                        </Button>

                        {/* 로그인 상태에 따라 메뉴 분기 */}
                        {isAuthenticated ? (
                            <>
                                {/* 마이페이지 (이름 + 아바타) */}
                                <Button component={RouterNavLink} to="/mypage" style={getActiveLinkStyle} sx={{ ml: 1 }}>
                                    <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main' }} alt={user?.name}>
                                        {user?.name?.charAt(0)}
                                    </Avatar>
                                    {user?.name}
                                </Button>
                                {/* 관리자 메뉴 */}
                                {isAdmin && (
                                    <Button component={RouterNavLink} to="/admin" style={getActiveLinkStyle} sx={{ ml: 1 }}>
                                        관리자 패널
                                    </Button>
                                )}
                                {/* 로그아웃 버튼 */}
                                <IconButton color="primary" onClick={handleLogout} sx={{ ml: 1 }}>
                                    <LogoutIcon />
                                </IconButton>
                            </>
                        ) : (
                            // 로그인 버튼 (비로그인 상태)
                            <Button variant="outlined" component={RouterNavLink} to="/login" startIcon={<LoginIcon />} sx={{
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

                    {/* 모바일용 Drawer 버튼 (햄버거 아이콘) */}
                    <IconButton color="inherit" onClick={handleDrawerToggle} sx={{ display: { lg: 'none' } }}>
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* 모바일 Drawer (사이드바 메뉴) */}
            <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerToggle}>
                {drawer}
            </Drawer>

            {/* 데스크탑 전용 Popover 메뉴 */}
            <Popover
                sx={{ pointerEvents: 'none' }} // hover 이벤트로만 열림
                open={Boolean(menuPopoverAnchor)}
                anchorEl={menuPopoverAnchor}
                onClose={() => setMenuPopoverAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                TransitionComponent={Fade} // Fade 애니메이션
                disableRestoreFocus
                PaperProps={{
                    sx: { pointerEvents: 'auto' },
                    onMouseEnter: handlePopoverOpen,
                    onMouseLeave: handlePopoverClose,
                }}
            >
                {/* Popover 내부: 카테고리별 메뉴 (2열 Grid) */}
                <Grid container spacing={4} sx={{ p: 4, maxWidth: 650, backdropFilter: 'blur(10px)', borderRadius: 3 }}>
                    {Object.entries(menuData).map(([category, items]) => (
                        <Grid item xs={12} sm={6} key={category}>
                            {/* 카테고리 제목 */}
                            <Typography variant="h6" sx={{ mb: 1.5, fontSize: '1.1rem', fontWeight: 'bold', color: 'secondary.main' }}>
                                {category}
                            </Typography>
                            <Divider sx={{ mb: 1.5 }} />
                            {/* 하위 메뉴 리스트 */}
                            <List sx={{ p: 0 }}>
                                {items.map((item, index) => (
                                    <Grow in={!!menuPopoverAnchor} key={item.text} style={{ transitionDelay: `${index * 60}ms` }}>
                                        <MenuItem
                                            component={RouterNavLink}
                                            to={item.to}
                                            onClick={() => setMenuPopoverAnchor(null)} // 메뉴 클릭 시 Popover 닫기
                                            sx={{
                                                borderRadius: 1.5,
                                                '&.active': {
                                                    backgroundColor: theme.palette.secondary.main + '20',
                                                    fontWeight: 'bold',
                                                }
                                            }}
                                        >
                                            <ListItemIcon sx={{ color: 'primary.main' }}>{item.icon}</ListItemIcon>
                                            <ListItemText primary={item.text} secondary={item.desc} />
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

// ThemeProvider로 감싸서 테마 적용
const Navbar = () => (
    <ThemeProvider theme={hotelTheme}>
        <NavbarComponent />
    </ThemeProvider>
);

export default Navbar;