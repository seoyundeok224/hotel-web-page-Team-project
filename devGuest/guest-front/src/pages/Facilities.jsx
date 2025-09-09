import React from 'react';
import { Typography, Container, Box, Grid, Card, CardMedia, CardContent } from '@mui/material';

const Facilities = () => {
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        최고급 부대시설
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary" paragraph sx={{ mb: 8 }}>
        Dev hotel는 고객님의 편안하고 즐거운 시간을 위해 다양한 최고급 부대시설을 제공합니다.
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="300"
              image="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1949&auto=format&fit=crop"
              alt="수영장"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                수영장
              </Typography>
              <Typography variant="body2" color="text.secondary">
                숨 막히는 전경을 자랑하는 멋진 옥상 수영장에서 휴식을 취하거나, 인접한 챔피언십 코스에서 골프를 즐기거나, 세심하게 가꿔진 정원과 전용 해변을 탐험해보세요.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="300"
              image="https://images.unsplash.com/photo-1530521954074-e64f6810b32d?q=80&w=2070&auto=format&fit=crop"
              alt="피트니스 센터"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                피트니스 센터
              </Typography>
              <Typography variant="body2" color="text.secondary">
                최첨단 피트니스 센터에서 활력을 되찾으세요. 개인 트레이너가 상주하며, 다양한 운동 기구와 프로그램을 통해 건강을 관리할 수 있습니다. 혹은, 저희 호텔의 전용 요가 스튜디오에서 평온함을 찾고, 전문 강사와 함께하는 명상 세션으로 몸과 마음의 균형을 되찾으세요.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="300"
              image="https://images.unsplash.com/photo-1523050620-7807500410?q=80&w=2070&auto=format&fit=crop"
              alt="스파 & 웰니스"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                스파 & 웰니스 센터
              </Typography>
              <Typography variant="body2" color="text.secondary">
                수상 경력에 빛나는 스파에서 비할 데 없는 평온함을 만끽하세요. 맞춤형 트리트먼트, 고요한 실내 인피니티 풀, 활력을 되찾아주는 수치료 회로를 제공합니다.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="300"
              image="https://images.unsplash.com/photo-1560439514-4e95413a6857?q=80&w=2070&auto=format&fit=crop"
              alt="비즈니스 센터"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                비즈니스 센터
              </Typography>
              <Typography variant="body2" color="text.secondary">
                최첨단 시청각 기술과 전담 이벤트 기획 서비스를 갖춘 다목적 연회장 및 회의 공간에서 잊지 못할 이벤트를 개최하세요.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Facilities;
