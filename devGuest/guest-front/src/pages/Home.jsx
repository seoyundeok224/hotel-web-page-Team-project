import React, { forwardRef, useState, useEffect } from 'react';
import { Typography, Container, Card, CardMedia, CardContent, CardActions, Button, Box, Paper, Fade, Fab, useScrollTrigger } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

// 아이콘 import
import HotelIcon from '@mui/icons-material/Hotel';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import SpaIcon from '@mui/icons-material/Spa';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const LinkBehavior = forwardRef((props, ref) => {
    const { href, ...other } = props;
    return <RouterLink ref={ref} to={href} {...other} />;
});

const heroImages = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop',
];

const featureCards = [
    {
        icon: <HotelIcon fontSize="large" color="primary" />,
        title: "편안한 객실",
        description: "모던하고 세련된 디자인의 객실에서 편안한 휴식을 즐겨보세요. 최신 시설과 고급 어메니티가 준비되어 있습니다.",
        image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop",
        link: "/rooms"
    },
    {
        icon: <RestaurantMenuIcon fontSize="large" color="primary" />,
        title: "특별한 다이닝",
        description: "세계적인 셰프가 선보이는 창의적인 요리를 경험해보세요. 신선한 제철 재료로 만든 최고의 미식 경험을 제공합니다.",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop",
        link: "/dining"
    },
    {
        icon: <SpaIcon fontSize="large" color="primary" />,
        title: "최고급 부대시설",
        description: "피트니스 센터, 스파, 루프탑 수영장 등 다양한 부대시설에서 활력을 되찾고 여유로운 시간을 만끽하세요.",
        image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1949&auto=format&fit=crop",
        link: "/facilities"
    }
];

const BackToTop = () => {
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 100,
    });

    const handleClick = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <Fade in={trigger}>
            <Box onClick={handleClick} role="presentation" sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 100 }}>
                <Fab color="secondary" size="small" aria-label="scroll back to top">
                    <KeyboardArrowUpIcon />
                </Fab>
            </Box>
        </Fade>
    );
};


const Home = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [previousImageIndex, setPreviousImageIndex] = useState(heroImages.length - 1);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setPreviousImageIndex(currentImageIndex);
            setCurrentImageIndex(prevIndex => (prevIndex + 1) % heroImages.length);
        }, 5000);

        return () => clearInterval(intervalId);
    }, [currentImageIndex]);

    const welcomeText = "Dev Hotel에 오신 것을 환영합니다";

    return (
        <Box sx={{ bgcolor: 'grey.100' }}>
            {/* --- 히어로 섹션 --- */}
            <Box sx={{ position: 'relative', height: '90vh', minHeight: '600px', overflow: 'hidden', color: '#fff' }}>
                
                {heroImages.map((image, index) => (
                    <Box
                        key={image}
                        sx={{
                            position: 'absolute', width: '100%', height: '100%',
                            backgroundImage: `url(${image})`,
                            backgroundSize: 'cover', backgroundPosition: 'center',
                            opacity: (index === currentImageIndex || index === previousImageIndex) ? 1 : 0,
                            zIndex: index === currentImageIndex ? 2 : 1,
                            animation: index === currentImageIndex ? `kenburns 15s ease-out forwards` : 'none',
                            transition: index === currentImageIndex ? 'opacity 1.5s ease-in-out' : 'none',
                        }}
                    />
                ))}

                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 3 }} />
                <Container sx={{ zIndex: 4, position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    
                    <Typography component="h1" variant="h2" gutterBottom fontWeight="bold" fontFamily="'Playfair Display', serif" sx={{ overflow: 'hidden' }}>
                        {welcomeText.split('').map((char, index) => (
                            <Box
                                component="span"
                                key={index}
                                sx={{
                                    display: 'inline-block',
                                    animation: `fadeInUp 1s ease-out both`,
                                    animationDelay: `${0.5 + index * 0.05}s`,
                                }}
                            >
                                {char === ' ' ? '\u00A0' : char}
                            </Box>
                        ))}
                    </Typography>

                    <Fade in={true} timeout={1500} style={{ transitionDelay: '500ms' }}>
                        <Typography variant="h5" paragraph sx={{ mb: 4, maxWidth: '700px', whiteSpace: 'nowrap' }}>
                            도심 속 최고의 휴식처, Dev Hotel에서 잊지 못할 경험을 만들어보세요.
                        </Typography>
                    </Fade>
                    <Fade in={true} timeout={1500} style={{ transitionDelay: '1000ms' }}>
                        <Button component={LinkBehavior} href="/booking" variant="contained" size="large"
                            sx={{
                                bgcolor: '#D4AF37', color: 'black',
                                '&:hover': { bgcolor: '#c7a432' },
                            }}
                        >
                            지금 예약하기
                        </Button>
                    </Fade>
                </Container>
            </Box>

            {/* --- 호텔 소개 섹션 --- */}
            <Paper elevation={0} sx={{ py: 8 }}>
                <Container maxWidth="md">
                    <Typography variant="h4" component="h2" align="center" gutterBottom fontWeight="bold" fontFamily="'Playfair Display', serif">
                        최고의 순간을 위한 최상의 공간
                    </Typography>
                    <Typography variant="body1" align="center" color="text.secondary" sx={{ maxWidth: '750px', mx: 'auto' }}>
                        Dev Hotel은 단순한 머무름을 넘어, 고객 한 분 한 분의 시간에 특별한 가치를 더하는 것을 목표로 합니다.
                        세계적 수준의 서비스와 세심한 배려가 공존하는 이곳에서 당신의 가장 빛나는 순간을 경험해보세요.
                    </Typography>
                </Container>
            </Paper>

            {/* --- 콘텐츠 섹션 (서비스 소개) --- */}
            <Container sx={{ py: 8 }}>
                <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 8 }} fontWeight="bold">
                    최상의 서비스와 시설
                </Typography>
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                    gap: 3
                }}>
                    {featureCards.map((card, index) => (
                        <Fade in={true} timeout={1000} style={{ transitionDelay: `${index * 200}ms` }} key={card.title}>
                            <Card sx={{
                                height: '100%', display: 'flex', flexDirection: 'column',
                                borderRadius: 4,
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                '&:hover': { transform: 'translateY(-8px)', boxShadow: 6 },
                                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                            }}>
                                <CardMedia component="img" height="240" image={card.image} alt={card.title} sx={{ objectFit: 'cover' }} />
                                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                                    <Box sx={{ mb: 2 }}>{card.icon}</Box>
                                    <Typography gutterBottom variant="h5" component="h3" fontWeight="bold">
                                        {card.title}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        {card.description}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                                    <Button component={LinkBehavior} href={card.link}>자세히 보기</Button>
                                </CardActions>
                            </Card>
                        </Fade>
                    ))}
                </Box>
            </Container>

            {/* --- 마지막 CTA(행동 유도) 섹션 --- */}
            <Paper elevation={0} sx={{ py: 8 }}>
                <Container maxWidth="md" sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" component="h2" gutterBottom fontWeight="bold" fontFamily="'Playfair Display', serif">
                        당신의 특별한 순간을 예약하세요
                    </Typography>
                    {/* [수정] 줄바꿈 방지 */}
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: '600px', mx: 'auto', whiteSpace: 'nowrap' }}>
                        최고의 경험은 한 번의 클릭으로 시작됩니다. 지금 바로 Dev Hotel에서의 완벽한 휴식을 계획해보세요.
                    </Typography>
                    <Button component={LinkBehavior} href="/booking" variant="contained" size="large" color="primary">
                        객실 예약하기
                    </Button>
                </Container>
            </Paper>

            <BackToTop />

            <style>
                {`
                @keyframes kenburns {
                    0% { transform: scale(1) translate(0, 0); }
                    100% { transform: scale(1.1) translate(-2%, 2%); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                `}
            </style>
        </Box>
    );
};

export default Home;