import React from 'react';
import { Typography, Container, Grid, Card, CardMedia, CardContent } from '@mui/material';

const services = [
  {
    name: "르 살롱 (Le Salon) 라운지",
    desc: "이그제큐티브 타워 투숙객 전용 라운지로, 조식, 가벼운 스낵, 애프터눈 티, 칵테일 서비스 등 온종일 다채로운 다이닝 서비스를 제공하는 프리미엄 공간입니다.",
    image: "https://images.unsplash.com/photo-1512485800893-b08ec1ea59b1?q=80&w=2070&auto=format&fit=crop"
  },
  {
    name: "라심 (La Cime) 라운지",
    desc: "스위트 객실 투숙객만을 위한 최상위 프라이빗 라운지입니다. 최고의 전망과 함께 한층 더 격조 높은 서비스와 시설, 다이닝을 경험하실 수 있습니다.",
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop"
  },
  {
    name: "해온(he:on) 침구 시스템",
    desc: "시몬스와 공동 개발한 최고급 침구 시스템으로, 당신의 편안한 숙면을 보장합니다. 최상의 소재와 인체공학적 설계를 통해 구름 위에서의 휴식을 선사합니다.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=2070&auto=format&fit=crop"
  },
  {
    name: "컨시어지 서비스",
    desc: "교통, 쇼핑, 엔터테인먼트 등 고객의 필요에 맞춘 최적의 정보를 제공하고 예약을 대행하는 개인 맞춤형 비서 서비스를 경험해 보세요.",
    image: "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?q=80&w=1935&auto=format&fit=crop"
  },
  {
    name: "인룸 다이닝 (룸 서비스)",
    desc: "24시간 이용 가능한 룸서비스로, 객실 안에서 편안하게 세계 각국의 요리와 최고의 셰프가 준비한 미식을 즐기실 수 있습니다.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz5qQNSj_UT2F3xIXk7exbN4P2OpkOfAjvHg&s"
  },
  {
    name: "피트니스 및 부대시설",
    desc: "최첨단 시설을 갖춘 피트니스 센터, 실내 수영장, 사우나 등 활력을 재충전하고 여유를 즐길 수 있는 다양한 부대시설이 마련되어 있습니다.",
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1949&auto=format&fit=crop"
  }
];

const Services = () => {
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        고객을 위한 최상의 서비스
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary" paragraph sx={{ mb: 8 }}>
        Dev hotel은 고객님의 모든 순간이 특별한 경험이 되도록, 세심하고 품격 높은 서비스를 제공합니다.
      </Typography>

      <Grid container spacing={4}>
        {services.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service.name}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="250"
                image={service.image}
                alt={service.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {service.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {service.desc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Services;
