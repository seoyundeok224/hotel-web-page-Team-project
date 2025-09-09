import React, { forwardRef } from 'react';
import { Typography, Container, Grid, Card, CardMedia, CardContent, CardActions, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const LinkBehavior = forwardRef((props, ref) => {
  const { href, ...other } = props;
  return <RouterLink ref={ref} to={href} {...other} />;
});

const Home = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: '60vh',
          minHeight: '400px',
          backgroundImage: 'url(https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070&auto=format&fit=crop)',
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
          <Typography component="h1" variant="h2" gutterBottom>
            Dev hotel에 오신 것을 환영합니다
          </Typography>
          <Typography variant="h5" paragraph>
            도심 속 최고의 휴식처, Dev hotel에서 잊지 못할 경험을 만들어보세요.
          </Typography>
        </Container>
      </Box>

      {/* Content Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
          최상의 서비스와 시설
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph sx={{ mb: 8 }}>
          저희 호텔은 고객님께 편안하고 특별한 시간을 선사하기 위해 다양한 서비스와 최고급 시설을 자랑합니다.
        </Typography>
        <Grid container columns={12} spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image="https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop"
                alt="객실"
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  편안한 객실
                </Typography>
                <Typography>
                  모던하고 세련된 디자인의 객실에서 편안한 휴식을 즐겨보세요. 최신 시설과 고급 어메니티가 준비되어 있습니다.
                </Typography>
              </CardContent>
              <CardActions>
                <Button component={LinkBehavior} href="/rooms" size="small">자세히 보기</Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop"
                alt="다이닝"
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  특별한 다이닝
                </Typography>
                <Typography>
                  세계적인 셰프가 선보이는 창의적인 요리를 경험해보세요. 신선한 제철 재료로 만든 최고의 미식 경험을 제공합니다.
                </Typography>
              </CardContent>
              <CardActions>
                <Button component={LinkBehavior} href="/dining" size="small">자세히 보기</Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1949&auto=format&fit=crop"
                alt="부대시설"
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  최고급 부대시설
                </Typography>
                <Typography>
                  피트니스 센터, 스파, 수영장 등 다양한 부대시설에서 활력을 되찾고 여유로운 시간을 만끽하세요.
                </Typography>
              </CardContent>
              <CardActions>
                <Button component={LinkBehavior} href="/facilities" size="small">자세히 보기</Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;