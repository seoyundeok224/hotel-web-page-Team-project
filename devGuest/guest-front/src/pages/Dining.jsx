import React, { forwardRef } from 'react';
import { Typography, Container, Box, Grid, Paper, Button, Chip, Divider, Fade } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';


// Icons
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const LinkBehavior = forwardRef((props, ref) => {
    const { href, ...other } = props;
    return <RouterLink ref={ref} to={href} {...other} />;
});


// ✅ [수정 가능] 페이지에 표시될 다이닝 옵션 목록입니다.
// 이 배열에 객체를 추가하거나, 기존 객체의 내용을 수정하여 원하는 레스토랑 정보를 표시할 수 있습니다.
const diningOptions = [
    {
        name: "La Ciel", // 레스토랑 이름
        category: "파인 다이닝", // 카테고리
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop", // 이미지 URL
        description: "호텔 최상층에 위치한 La Ciel은 숨 막히는 도시 전경과 함께 비할 데 없는 미식 경험을 선사합니다. 미슐랭 스타 셰프가 엄선한 제철 현지 재료로 만든 혁신적인 현대 유럽 요리의 절묘한 테이스팅 메뉴를 선보입니다.", // 설명
        details: { // 아이콘과 함께 표시될 상세 정보
            cuisine: "Modern European", // 요리 종류
            location: "32nd Floor", // 위치
            hours: "18:00 - 22:00" // 운영 시간
        }
    },
    {
        name: "The Garden Table",
        category: "캐주얼 다이닝",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop",
        description: "The Garden Table에서 지중해의 활기찬 맛을 경험해보세요. 햇살 가득한 요리와 고요한 정원 배경이 어우러져 있습니다. 지속 가능한 방식으로 잡은 신선한 해산물, 장인의 파스타, 활기찬 농산물을 모두 정통 지역 기술로 준비합니다.",
        details: {
            cuisine: "Mediterranean",
            location: "1st Floor, Garden View",
            hours: "12:00 - 21:00"
        }
    },
    {
        name: "Oasis Lounge",
        category: "바 & 라운지",
        image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974&auto=format&fit=crop",
        description: "Oasis Lounge에서 세련된 우아함의 세계로 들어서세요. 현대적인 아시아 퓨전 요리의 오아시스입니다. 저희 요리 장인들은 전통적인 기술과 혁신적인 프레젠테이션을 능숙하게 혼합하여 다양한 맛의 교향곡을 제공합니다.",
        details: {
            cuisine: "Asian Fusion & Cocktails",
            location: "Lobby",
            hours: "17:00 - 01:00"
        }
    }
];

const DiningSection = ({ option, index }) => {
    const theme = useTheme();
    // 이미지와 텍스트가 번갈아 배치되는 로직입니다. (짝수번째는 이미지 좌측, 홀수번째는 우측)
    const isImageLeft = index % 2 === 0;

    return (
        // ✅ [수정 가능] 스크롤 시 각 섹션이 나타나는 애니메이션입니다.
        // timeout 값을 조절하여 나타나는 속도를 변경할 수 있습니다. (1000ms = 1초)
        <Fade in={true} timeout={1000} style={{ transitionDelay: `${index * 200}ms` }}>
            <Paper
                elevation={6}
                // ✅ [수정 가능] 각 다이닝 섹션 카드의 스타일입니다.
                sx={{
                    p: 4, // 내부 여백
                    mb: 8, // 카드 사이의 하단 여백
                    borderRadius: 4, // 모서리 둥글기
                    overflow: 'hidden',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease', // 호버 애니메이션 속도
                    '&:hover': {
                        transform: 'translateY(-5px)', // 마우스를 올렸을 때 살짝 위로 이동
                        boxShadow: '0 20px 40px -15px rgba(0,0,0,0.2)', // 그림자 효과 강화
                    },
                }}
            >
                <Grid container spacing={4} direction={isImageLeft ? 'row' : 'row-reverse'}>
                    <Grid item xs={12} md={6}>
                        <Box sx={{
                            height: '100%',
                            minHeight: 300,
                            borderRadius: 3,
                            overflow: 'hidden',
                        }}>
                            <Box
                                component="img"
                                src={option.image}
                                alt={option.name}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transition: 'transform 0.5s ease', // 이미지 확대 애니메이션 속도
                                    '&:hover': {
                                        transform: 'scale(1.05)', // 마우스를 올렸을 때 이미지 확대
                                    }
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

                        {/* 상세 정보 아이콘(Chip)들을 표시하는 부분입니다. */}
                        <Box sx={{ my: 2 }}>
                            <Chip icon={<RestaurantMenuIcon />} label={option.details.cuisine} sx={{ mr: 1, mb: 1 }} />
                            <Chip icon={<LocationOnIcon />} label={option.details.location} sx={{ mr: 1, mb: 1 }} />
                            <Chip icon={<AccessTimeIcon />} label={option.details.hours} sx={{ mb: 1 }} />
                        </Box>
                        
                        {/* 메뉴 보기, 예약하기 버튼입니다. */}
                        <Box sx={{ mt: 'auto', pt: 2 }}>
                            <Button variant="contained" sx={{ mr: 2 }}>메뉴 보기</Button>
                            <Button variant="outlined">예약하기</Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Fade>
    );
};


const Dining = () => {
    return (
        // ✅ [수정 가능] 페이지 전체의 배경색과 상하 여백을 조절할 수 있습니다.
        <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
            <Container maxWidth="lg">
                {/* --- 페이지 헤더 --- */}
                <Typography variant="h3" component="h1" gutterBottom align="center" fontWeight="bold" fontFamily="'Playfair Display', serif">
                    {/* ✅ [수정 가능] 페이지의 메인 제목입니다. */}
                    A Culinary Journey
                </Typography>
                <Typography variant="h6" align="center" color="text.secondary" paragraph sx={{ mb: 4 }}>
                    {/* ✅ [수정 가능] 페이지의 부제목/설명입니다. */}
                    Dev hotel는 미식의 즐거움을 선사하는 다양한 다이닝 옵션을 제공합니다.
                </Typography>
                <Divider sx={{ mb: 8, mx: 'auto', width: '150px' }}>
                    <Chip label="OUR RESTAURANTS" />
                </Divider>

                {/* 위에서 정의한 diningOptions 데이터를 기반으로 각 섹션을 자동으로 생성합니다. */}
                {diningOptions.map((option, index) => (
                    <DiningSection key={option.name} option={option} index={index} />
                ))}

            </Container>
        </Box>
    );
};

export default Dining;