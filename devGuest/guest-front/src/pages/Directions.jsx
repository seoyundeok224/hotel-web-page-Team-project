import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import KakaoMap from '../components/map/KakaoMap';
import LocalConvenienceStoreIcon from '@mui/icons-material/LocalConvenienceStore';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AttractionsIcon from '@mui/icons-material/Attractions';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import TheatersIcon from '@mui/icons-material/Theaters';

const Directions = () => {
    return (
        <Box sx={{ bgcolor: '#f7f9fc' }}>
            {/* Hero Section */}
            <Box
                sx={{
                    position: 'relative',
                    height: '50vh',
                    minHeight: '400px',
                    backgroundImage: 'url(https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=2070&auto=format&fit=crop)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 1,
                    }}
                />
                <Container sx={{ zIndex: 2, position: 'relative' }}>
                    <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        오시는 길
                    </Typography>
                    <Typography variant="h6" paragraph>
                        도심 속 완벽한 휴식처, 저희 호텔에서 여러분을 기다립니다.
                    </Typography>
                </Container>
            </Box>

            {/* Content Section */}
            <Container maxWidth="lg" sx={{ py: 5 }}>
                <Box
                    sx={{
                        position: 'relative',
                        width: '100%',
                        paddingTop: '56.25%', // 16:9 Aspect Ratio
                        mb: 5,
                        overflow: 'hidden',
                        borderRadius: 2,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    }}
                >
                    <KakaoMap />
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
                    {/* Left Info Card */}
                    <Box sx={{ flex: 1, minWidth: '300px' }}>
                        <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', height: '100%' }}>
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="h5" component="h2" gutterBottom>
                                        호텔 주소 및 연락처
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        서울특별시 강남구 테헤란로 123
                                        <br />
                                        대표전화: 02-1234-5678
                                        <br />
                                        이메일: contact@geminihotel.com
                                    </Typography>
                                </Box>

                                <Divider sx={{ my: 3 }} />

                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="h5" component="h2" gutterBottom>
                                        주차 안내
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        호텔 내 지하 주차장을 이용하실 수 있습니다. (투숙객 무료)
                                        <br />
                                        발렛파킹 서비스도 제공되오니, 필요시 현관의 직원에게 문의해주세요.
                                    </Typography>
                                </Box>

                                <Divider sx={{ my: 3 }} />

                                <Box>
                                    <Typography variant="h5" component="h2" gutterBottom>
                                        교통편 안내
                                    </Typography>
                                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                        지하철 이용 시
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        2호선 강남역 1번 출구에서 도보 5분 거리에 위치하고 있습니다.
                                    </Typography>
                                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                        버스 이용 시
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        간선버스 140, 402, 420번 또는 지선버스 3412, 4312번을 이용하여 '강남역' 정류장에서 하차하세요.
                                    </Typography>
                                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                        공항에서 오시는 길
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        인천국제공항: 공항리무진 6009번 탑승 후 '강남역' 정류장에서 하차 (약 70분 소요)
                                        <br />
                                        김포국제공항: 공항리무진 6000번 탑승 후 '강남역' 정류장에서 하차 (약 50분 소요)
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                    
                    {/* Right Amenities Card */}
                    <Box sx={{ flex: 1, minWidth: '300px' }}>
                        <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', height: '100%' }}>
                            <CardContent sx={{ p: 4 }}>
                                <Box mb={3}>
                                    <Typography variant="h5" component="h2" gutterBottom>
                                        주변 편의시설
                                    </Typography>
                                    <List>
                                        <ListItem disablePadding>
                                            <ListItemIcon sx={{ minWidth: 40 }}>
                                                <LocalConvenienceStoreIcon color="primary" />
                                            </ListItemIcon>
                                            <ListItemText primary="편의점" secondary="도보 1분 거리" />
                                        </ListItem>
                                        <Divider component="li" sx={{ my: 1 }} />
                                        <ListItem disablePadding>
                                            <ListItemIcon sx={{ minWidth: 40 }}>
                                                <LocalPharmacyIcon color="primary" />
                                            </ListItemIcon>
                                            <ListItemText primary="약국" secondary="도보 3분 거리" />
                                        </ListItem>
                                        <Divider component="li" sx={{ my: 1 }} />
                                        <ListItem disablePadding>
                                            <ListItemIcon sx={{ minWidth: 40 }}>
                                                <LocalCafeIcon color="primary" />
                                            </ListItemIcon>
                                            <ListItemText primary="카페" secondary="도보 2분 거리" />
                                        </ListItem>
                                        <Divider component="li" sx={{ my: 1 }} />
                                        <ListItem disablePadding>
                                            <ListItemIcon sx={{ minWidth: 40 }}>
                                                <AccountBalanceIcon color="primary" />
                                            </ListItemIcon>
                                            <ListItemText primary="은행/ATM" secondary="도보 5분 거리" />
                                        </ListItem>
                                    </List>
                                </Box>

                                <Divider sx={{ my: 3 }} />

                                <Box>
                                    <Typography variant="h5" component="h2" gutterBottom>
                                        주변 볼거리
                                    </Typography>
                                    <List>
                                        <ListItem disablePadding>
                                            <ListItemIcon sx={{ minWidth: 40 }}>
                                                <StorefrontIcon color="secondary" />
                                            </ListItemIcon>
                                            <ListItemText primary="카카오프렌즈 스토어" secondary="도보 5분 거리" />
                                        </ListItem>
                                        <Divider component="li" sx={{ my: 1 }} />
                                        <ListItem disablePadding>
                                            <ListItemIcon sx={{ minWidth: 40 }}>
                                                <AttractionsIcon color="secondary" />
                                            </ListItemIcon>
                                            <ListItemText primary="일상비일상의틈" secondary="도보 7분 거리" />
                                        </ListItem>
                                        <Divider component="li" sx={{ my: 1 }} />
                                        <ListItem disablePadding>
                                            <ListItemIcon sx={{ minWidth: 40 }}>
                                                <MenuBookIcon color="secondary" />
                                            </ListItemIcon>
                                            <ListItemText primary="교보문고" secondary="도보 10분 거리" />
                                        </ListItem>
                                        <Divider component="li" sx={{ my: 1 }} />
                                        <ListItem disablePadding>
                                            <ListItemIcon sx={{ minWidth: 40 }}>
                                                <TheatersIcon color="secondary" />
                                            </ListItemIcon>
                                            <ListItemText primary="CGV 강남" secondary="도보 8분 거리" />
                                        </ListItem>
                                    </List>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Directions;
