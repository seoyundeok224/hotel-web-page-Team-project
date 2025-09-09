import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import KakaoMap from '../components/map/KakaoMap';

const Directions = () => {
    return (
        <Box sx={{ bgcolor: '#f7f9fc' }}>
            {/* Hero Section */}
            <Box
                sx={{
                    position: 'relative',
                    height: '40vh',
                    minHeight: '300px',
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

                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                            <CardContent>
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
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                            <CardContent>
                                <Typography variant="h5" component="h2" gutterBottom>
                                    주차 안내
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    호텔 내 지하 주차장을 이용하실 수 있습니다. (투숙객 무료)
                                    <br />
                                    발렛파킹 서비스도 제공되오니, 필요시 현관의 직원에게 문의해주세요.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                            <CardContent>
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
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Directions;
