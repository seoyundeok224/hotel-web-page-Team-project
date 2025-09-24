
import React, { useState, useEffect, useMemo } from 'react';
import { Container, Typography, Box, IconButton, useMediaQuery, Paper, Divider, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Icons
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import KingBedIcon from '@mui/icons-material/KingBed';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import WifiIcon from '@mui/icons-material/Wifi';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import BathtubIcon from '@mui/icons-material/Bathtub';
import BusinessIcon from '@mui/icons-material/Business';

// RoomCard Component
const RoomCard = ({ room }) => {
    const featureIcons = {
        "더블/트윈 베드": <KingBedIcon fontSize="small" />,
        "킹/트윈 베드": <KingBedIcon fontSize="small" />,
        "해온(he:on) 침구류": <KingBedIcon fontSize="small" />,
        "무료 Wi-Fi": <WifiIcon fontSize="small" />,
        "르 살롱 라운지": <RoomServiceIcon fontSize="small" />,
        "클럽 라운지": <RoomServiceIcon fontSize="small" />,
        "독립형 욕조": <BathtubIcon fontSize="small" />,
        "메인 타워": <BusinessIcon fontSize="small" />,
        "이그제큐티브 타워": <BusinessIcon fontSize="small" />,
    };

    return (
        <Paper
            elevation={4}
            sx={{
                flex: '0 0 auto',
                width: 320,
                borderRadius: 4,
                overflow: 'hidden',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 16px 30px -10px rgba(0,0,0,0.2)',
                },
            }}
        >
            <Box
                component="img"
                src={room.image}
                alt={room.name}
                sx={{
                    width: '100%',
                    height: 200,
                    objectFit: 'cover',
                }}
            />
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom>
                    {room.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ minHeight: 60, mb: 2 }}>
                    {room.desc}
                </Typography>
                <Box>
                    {room.features.map((feature) => (
                        <Chip
                            key={feature}
                            icon={featureIcons[feature] || <SquareFootIcon fontSize="small" />}
                            label={feature}
                            size="small"
                            sx={{ mr: 1, mb: 1, bgcolor: 'grey.200' }}
                        />
                    ))}
                </Box>
            </Box>
        </Paper>
    );
};

// 페이지에 표시될 객실 정보 목록
const rooms = [
    { name: "슈페리어 룸", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop", desc: "비즈니스와 여행의 여유를 동시에 만족시키는 메인 타워의 기본 객실입니다.", features: ["메인 타워", "35㎡", "더블/트윈 베드", "무료 Wi-Fi"] },
    { name: "그랜드 디럭스 룸", image: "https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", desc: "럭셔리한 경험에 초점을 맞춘 이그제큐티브 타워의 기본 객실입니다.", features: ["이그제큐티브 타워", "40㎡", "킹/트윈 베드", "르 살롱 라운지"] },
    { name: "주니어 스위트", image: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", desc: "침실과 거실이 분리된 구조로 편안한 휴식과 업무가 모두 가능합니다.", features: ["메인 타워", "62㎡", "거실 분리", "클럽 라운지"] },
    { name: "프리미어 룸", image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070&auto=format&fit=crop", desc: "보라색 포인트 인테리어가 돋보이는 넓은 객실로, 도심의 야경을 감상할 수 있습니다.", features: ["이그제큐티브 타워", "60㎡", "파노라마 시티뷰", "독립형 욕조"] },
    { name: "디럭스 스위트", image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=800&fit=crop", desc: "별도의 응접실과 침실, 드레스룸을 갖춘 럭셔리 스위트입니다.", features: ["이그제큐티브 타워", "76㎡", "별도 응접실", "드레스룸"] },
    { name: "로얄 스위트", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&q=80", desc: "국내외 VIP를 위한 단 하나의 최고급 객실. 별도의 회의실과 서재 등을 갖추고 있습니다.", features: ["이그제큐티브 타워", "460㎡", "프라이빗 회의실", "전용 버틀러"] }
];

function Rooms() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    // [수정] 자동 슬라이드 간격을 2.5초로 변경
    const AUTOPLAY_INTERVAL = 2500; // 자동 슬라이드 간격 (2500ms = 2.5초)
    const TRANSITION_DURATION = '0.7s'; // 슬라이드 애니메이션 속도 (0.7초)

    const [currentSlide, setCurrentSlide] = useState(0);
    const [transitionEnabled, setTransitionEnabled] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const cardsToShow = useMemo(() => isMobile ? 1 : isTablet ? 2 : 3, [isMobile, isTablet]);
    
    const extendedRooms = useMemo(() => {
        if (rooms.length === 0) return [];
        const startClones = rooms.slice(rooms.length - cardsToShow);
        const endClones = rooms.slice(0, cardsToShow);
        return [...startClones, ...rooms, ...endClones];
    }, [cardsToShow]);

    useEffect(() => {
        setCurrentSlide(cardsToShow);
    }, [cardsToShow]);

    useEffect(() => {
        if (isPaused || !extendedRooms.length) return;

        const timer = setInterval(() => {
            handleNext();
        }, AUTOPLAY_INTERVAL);

        return () => clearInterval(timer);
    }, [isPaused, extendedRooms.length, currentSlide]); // currentSlide를 의존성 배열에 추가하여 매번 타이머를 재설정

    const handlePrev = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentSlide(prev => prev - 1);
    };
    const handleNext = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentSlide(prev => prev + 1);
    };
    
    const handleTransitionEnd = () => {
        const isAtFirstClone = currentSlide < cardsToShow;
        const isAtLastClone = currentSlide >= rooms.length + cardsToShow;

        if (isAtFirstClone) {
            setTransitionEnabled(false);
            setCurrentSlide(rooms.length + currentSlide);
        } else if (isAtLastClone) {
            setTransitionEnabled(false);
            setCurrentSlide(currentSlide - rooms.length);
        } else {
            setIsTransitioning(false);
        }
    };
    
    useEffect(() => {
        if (!transitionEnabled) {
            const timer = setTimeout(() => {
                setTransitionEnabled(true);
                setIsTransitioning(false);
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [transitionEnabled]);

    const cardWidthWithGap = 320 + 24;
    const sliderOffset = -currentSlide * cardWidthWithGap;

    const totalPages = Math.ceil(rooms.length / cardsToShow);
    const effectiveCurrentPage = Math.floor((currentSlide - cardsToShow) / cardsToShow);
    const currentPage = (effectiveCurrentPage % totalPages + totalPages) % totalPages;
    
    const goToPage = (pageIndex) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentSlide((pageIndex * cardsToShow) + cardsToShow);
    }

    return (
        <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
            <Container maxWidth="lg">
                <Paper elevation={0} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4 }}>
                    <Typography variant="h3" component="h1" gutterBottom align="center" fontWeight="bold" fontFamily="'Playfair Display', serif">
                        Our Rooms
                    </Typography>
                    <Typography align="center" color="text.secondary" sx={{ mb: 2, maxWidth: '700px', mx: 'auto' }}>
                        Dev hotel은 비즈니스를 위한 메인 타워와 럭셔리한 휴식을 위한 이그제큐티브 타워로 나뉘어 운영됩니다.
                        고객님의 필요에 맞는 최적의 객실을 선택하여 최고의 경험을 누려보세요.
                    </Typography>
                    <Divider sx={{ my: 4, mx: 'auto', width: 'auto', maxWidth: '200px' }}>
                        <Chip label="SELECT YOUR ROOM" />
                    </Divider>

                    <Box 
                        sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        <IconButton
                            onClick={handlePrev}
                            sx={{ position: 'absolute', left: -20, zIndex: 10, bgcolor: 'rgba(255, 255, 255, 0.7)', border: '1px solid #ddd', '&:hover': { bgcolor: 'white' }, display: { xs: 'none', md: 'inline-flex' } }}
                        >
                            <ArrowBackIosNewIcon />
                        </IconButton>
                        
                        <Box sx={{ width: '100%', overflow: 'hidden' }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 3,
                                    py: 2,
                                    transition: transitionEnabled ? `transform ${TRANSITION_DURATION} cubic-bezier(0.25, 0.1, 0.25, 1)` : 'none',
                                    transform: `translateX(${sliderOffset}px)`,
                                }}
                                onTransitionEnd={handleTransitionEnd}
                            >
                                {extendedRooms.map((room, index) => (
                                    <RoomCard key={`${room.name}-${index}`} room={room} />
                                ))}
                            </Box>
                        </Box>
                        
                        <IconButton
                            onClick={handleNext}
                            sx={{ position: 'absolute', right: -20, zIndex: 10, bgcolor: 'rgba(255, 255, 255, 0.7)', border: '1px solid #ddd', '&:hover': { bgcolor: 'white' }, display: { xs: 'none', md: 'inline-flex' } }}
                        >
                            <ArrowForwardIosIcon />
                        </IconButton>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <Box
                                key={index}
                                onClick={() => goToPage(index)}
                                sx={{
                                    width: 10, height: 10,
                                    borderRadius: '50%',
                                    bgcolor: currentPage === index ? 'primary.main' : 'grey.400',
                                    mx: 0.5,
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s',
                                }}
                            />
                        ))}
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}

export default Rooms;