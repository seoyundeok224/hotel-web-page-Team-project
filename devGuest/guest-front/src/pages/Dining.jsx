import React, { forwardRef, useState } from 'react';
import {
    Typography, Container, Box, Grid, Paper, Button, Chip, Divider, Fade,
    Dialog, DialogTitle, DialogContent, IconButton, List, ListItem, ListItemText,
    ListItemAvatar, Avatar, Fab, useScrollTrigger
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';

// Icons
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import MenuBookIcon from '@mui/icons-material/MenuBook'; // 메뉴 아이콘 추가

const LinkBehavior = forwardRef((props, ref) => {
    const { href, ...other } = props;
    return <RouterLink ref={ref} to={href} {...other} />;
});

const diningOptions = [
    {
        name: "La Ciel",
        category: "파인 다이닝",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop",
        description: "호텔 최상층에 위치한 La Ciel은 숨 막히는 도시 전경과 함께 비할 데 없는 미식 경험을 선사합니다. 미슐랭 스타 셰프가 엄선한 제철 현지 재료로 만든 혁신적인 현대 유럽 요리의 절묘한 테이스팅 메뉴를 선보입니다.",
        details: { cuisine: "Modern European", location: "32nd Floor", hours: "18:00 - 22:00" },
        menu: [
            { name: "셰프의 테이스팅 코스", price: "250,000원", desc: "계절의 정수를 담은 8코스 요리", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38", isSignature: true },
            // ✅ [수정] 랍스터 비스크 수프 이미지 경로
            { name: "랍스터 비스크 수프", price: "45,000원", desc: "부드럽고 진한 바닷가재 수프", image: "/images/랍스터 비스크 수프.jpg", isSignature: false },
            { name: "트러플 와규 스테이크", price: "180,000원", desc: "최상급 와규와 블랙 트러플의 조화", image: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85", isSignature: true },
        ]
    },
    {
        name: "The Garden Table",
        category: "캐주얼 다이닝",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop",
        description: "The Garden Table에서 지중해의 활기찬 맛을 경험해보세요. 햇살 가득한 요리와 고요한 정원 배경이 어우러져 있습니다. 지속 가능한 방식으로 잡은 신선한 해산물, 장인의 파스타, 활기찬 농산물을 모두 정통 지역 기술로 준비합니다.",
        details: { cuisine: "Mediterranean", location: "1st Floor, Garden View", hours: "12:00 - 21:00" },
        menu: [
            // ✅ [수정] 지중해식 해산물 플래터 이미지 경로
            { name: "지중해식 해산물 플래터", price: "85,000원", desc: "신선한 제철 해산물 모듬", image: "/images/지중해식 해산물 플래터.jpg", isSignature: true },
            // ✅ [수정] 봉골레 파스타 이미지 경로
            { name: "봉골레 파스타", price: "32,000원", desc: "신선한 조개와 화이트 와인 소스", image: "/images/봉골레 파스타.jpg", isSignature: false },
            { name: "그릭 샐러드", price: "25,000원", desc: "신선한 채소와 페타 치즈", image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=870&auto=format&fit=crop", isSignature: false },
        ]
    },
    {
        name: "Oasis Lounge",
        category: "바 & 라운지",
        image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974&auto=format&fit=crop",
        description: "Oasis Lounge에서 세련된 우아함의 세계로 들어서세요. 현대적인 아시아 퓨전 요리의 오아시스입니다. 저희 요리 장인들은 전통적인 기술과 혁신적인 프레젠테이션을 능숙하게 혼합하여 다양한 맛의 교향곡을 제공합니다.",
        details: { cuisine: "Asian Fusion & Cocktails", location: "Lobby", hours: "17:00 - 01:00" },
        menu: [
            // ✅ [수정] 시그니처 칵테일 '오아시스' 이미지 경로
            { name: "시그니처 칵테일 '오아시스'", price: "25,000원", desc: "열대 과일과 허브의 이국적인 조화", image: "/images/시그니처 칵테일 '오아시스.jpg", isSignature: true },
            // ✅ [수정] 미니 와규 버거 슬라이더 이미지 경로
            { name: "미니 와규 버거 슬라이더", price: "38,000원", desc: "한입에 즐기는 와규의 풍미", image: "/images/미니 와규 버거 슬라이더.jpg", isSignature: false },
            { name: "스시 & 사시미 플래터", price: "75,000원", desc: "신선한 제철 생선 모듬", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=870&auto=format&fit=crop", isSignature: true },
        ]
    }
];

const DiningSection = ({ option, index, onMenuClick }) => {
    const theme = useTheme();
    const isImageLeft = index % 2 === 0;

    return (
        <Fade in={true} timeout={1000} style={{ transitionDelay: `${index * 200}ms` }}>
            <Paper
                elevation={6}
                sx={{
                    p: 4, mb: 8, borderRadius: 4, overflow: 'hidden',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 20px 40px -15px rgba(0,0,0,0.2)',
                    },
                }}
            >
                <Grid container spacing={4} direction={isImageLeft ? 'row' : 'row-reverse'}>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ height: '100%', minHeight: 300, borderRadius: 3, overflow: 'hidden' }}>
                            <Box
                                component="img" src={option.image} alt={option.name}
                                sx={{
                                    width: '100%', height: '100%', objectFit: 'cover',
                                    transition: 'transform 0.5s ease',
                                    '&:hover': { transform: 'scale(1.05)' }
                                }}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography variant="h4" component="h2" fontWeight="bold" fontFamily="'Playfair Display', serif">
                            {option.name}
                        </Typography>
                        <Typography variant="subtitle1" color="secondary.main" gutterBottom>
                            {option.category}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ my: 2 }}>
                            {option.description}
                        </Typography>
                        <Box sx={{ my: 2 }}>
                            <Chip icon={<RestaurantMenuIcon />} label={option.details.cuisine} sx={{ mr: 1, mb: 1 }} />
                            <Chip icon={<LocationOnIcon />} label={option.details.location} sx={{ mr: 1, mb: 1 }} />
                            <Chip icon={<AccessTimeIcon />} label={option.details.hours} sx={{ mb: 1 }} />
                        </Box>
                        <Box sx={{ mt: 'auto', pt: 2 }}>
                            <Button variant="contained" sx={{ mr: 2 }} onClick={() => onMenuClick(option)} startIcon={<MenuBookIcon />}>
                                메뉴 보기
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Fade>
    );
};

const MenuModal = ({ open, onClose, restaurant }) => {
    if (!restaurant) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 'bold', fontFamily: "'Playfair Display', serif" }}>
                {restaurant.name} - Menu
                <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <List>
                    {restaurant.menu.map((item, index) => (
                        <Fade in={open} timeout={500} style={{ transitionDelay: `${index * 100}ms` }} key={item.name}>
                            <ListItem sx={{ py: 2 }} divider>
                                <ListItemAvatar>
                                    <Avatar variant="rounded" src={item.image} sx={{ width: 80, height: 80, mr: 2, bgcolor: 'grey.200' }}>
                                        <RestaurantMenuIcon />
                                    </Avatar>
                                </ListItemAvatar>

                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                            <Typography variant="h6" fontWeight="bold">{item.name}</Typography>
                                            {item.isSignature && <Chip label="Signature" color="secondary" size="small" sx={{ ml: 1.5, color: 'white', fontWeight: 'bold' }} />}
                                        </Box>
                                    }
                                    secondary={item.desc}
                                />

                                <Typography variant="h6" fontWeight="bold" sx={{ ml: 2, color: 'primary.main', textAlign: 'right' }}>
                                    {item.price}
                                </Typography>
                            </ListItem>
                        </Fade>
                    ))}
                </List>
            </DialogContent>
        </Dialog>
    );
};

const BackToTop = () => {
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 100,
    });

    const handleClick = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <Fade in={trigger}>
            <Box
                onClick={handleClick}
                role="presentation"
                sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 100 }}
            >
                <Fab color="secondary" size="small" aria-label="scroll back to top">
                    <KeyboardArrowUpIcon />
                </Fab>
            </Box>
        </Fade>
    );
};

const Dining = () => {
    const [menuModalOpen, setMenuModalOpen] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);

    const handleOpenMenu = (restaurant) => {
        setSelectedRestaurant(restaurant);
        setMenuModalOpen(true);
    };

    const handleCloseMenu = () => {
        setMenuModalOpen(false);
    };

    return (
        <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
            <Container maxWidth="lg">
                <Typography variant="h3" component="h1" gutterBottom align="center" fontWeight="bold" fontFamily="'Playfair Display', serif">
                    A Culinary Journey
                </Typography>
                <Typography variant="h6" align="center" color="text.secondary" paragraph sx={{ mb: 4 }}>
                    Dev hotel는 미식의 즐거움을 선사하는 다양한 다이닝 옵션을 제공합니다.
                </Typography>
                <Divider sx={{ mb: 8, mx: 'auto', width: '150px' }}>
                    <Chip label="OUR RESTAURANTS" />
                </Divider>

                {diningOptions.map((option, index) => (
                    <DiningSection key={option.name} option={option} index={index} onMenuClick={handleOpenMenu} />
                ))}

                <MenuModal
                    open={menuModalOpen}
                    onClose={handleCloseMenu}
                    restaurant={selectedRestaurant}
                />
            </Container>
            <BackToTop />
        </Box>
    );
};

export default Dining;