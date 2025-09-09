import React from 'react';
import { Typography, Container, Box, Grid, Card, CardMedia, CardContent } from '@mui/material';

const Dining = () => {
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        특별한 다이닝 경험
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary" paragraph sx={{ mb: 8 }}>
        Dev hotel는 미식의 즐거움을 선사하는 다양한 다이닝 옵션을 제공합니다. 세계 각국의 요리를 맛보며 잊지 못할 추억을 만드세요.
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="300"
              image="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop"
              alt="파인 다이닝"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                [레스토랑 이름] - 파인 다이닝
              </Typography>
              <Typography variant="body2" color="text.secondary">
                호텔 최상층에 위치한 [레스토랑 이름]은 숨 막히는 도시 전경과 함께 비할 데 없는 미식 경험을 선사합니다. 미슐랭 스타 셰프가 엄선한 제철 현지 재료로 만든 혁신적인 현대 유럽 요리의 절묘한 테이스팅 메뉴를 선보입니다. 세련된 분위기, 흠잡을 데 없는 서비스, 전 세계 희귀 빈티지 와인으로 엄선된 와인 리스트를 즐겨보세요.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="300"
              image="https://images.unsplash.com/photo-1555396273-367ba0b6ee65?q=80&w=2070&auto=format&fit=crop"
              alt="캐주얼 다이닝"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                [카페 이름] - 캐주얼 다이닝
              </Typography>
              <Typography variant="body2" color="text.secondary">
                [카페 이름]에서 지중해의 활기찬 맛을 경험해보세요. 햇살 가득한 요리와 고요한 [바다/정원] 배경이 어우러져 있습니다. 지속 가능한 방식으로 잡은 신선한 해산물, 장인의 파스타, 활기찬 농산물을 모두 정통 지역 기술로 준비합니다. 매력적인 테라스에서 상쾌한 칵테일과 부드러운 바닷바람을 맞으며 야외 식사를 즐겨보세요.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="300"
              image="https://images.unsplash.com/photo-1578474846640-404270117561?q=80&w=2070&auto=format&fit=crop"
              alt="바 & 라운지"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                [바 이름] - 바 & 라운지
              </Typography>
              <Typography variant="body2" color="text.secondary">
                [바 이름]에서 세련된 우아함의 세계로 들어서세요. 현대적인 아시아 퓨전 요리의 오아시스입니다. 저희 요리 장인들은 전통적인 기술과 혁신적인 프레젠테이션을 능숙하게 혼합하여 일본, 태국 등 다양한 맛의 교향곡을 제공합니다. 섬세한 스시와 사시미부터 육즙이 풍부한 구운 고기와 향긋한 카레까지, 각 요리는 감각을 즐겁게 하기 위해 고안된 걸작입니다.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dining;
