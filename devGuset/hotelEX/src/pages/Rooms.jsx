// Rooms.jsx
import React, { useState } from 'react';
import { Container, Typography, Box, IconButton, useMediaQuery } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import RoomCard from '../components/RoomCard';

// 객실 데이터 (롯데호텔 정보 기반)
const rooms = [
  {
    name: "슈페리어 룸",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
    desc: "비즈니스와 여행의 여유를 동시에 만족시키는 메인 타워의 기본 객실입니다. 효율적인 공간 활용과 편안함을 제공합니다.",
    features: ["메인 타워", "35㎡", "더블/트윈 베드", "해온(he:on) 침구류", "무료 Wi-Fi"]
  },
  {
    name: "그랜드 디럭스 룸",
    image: "https://images.unsplash.com/photo-1582719478250-c8dbe16ad9cf?q=80&w=400&h=200&fit=crop",
    desc: "럭셔리한 경험에 초점을 맞춘 이그제큐티브 타워의 기본 객실로, 현대적이고 세련된 인테리어를 자랑합니다.",
    features: ["이그제큐티브 타워", "40㎡", "킹/트윈 베드", "르 살롱 라운지", "해온(he:on) 침구류"]
  },
  {
    name: "주니어 스위트",
    image: "https://images.unsplash.com/photo-1598035743484-022792572d33?q=80&w=2070&auto=format&fit=crop",
    desc: "침실과 거실이 분리된 구조로, 편안한 휴식과 효율적인 비즈니스 업무가 모두 가능한 공간입니다.",
    features: ["메인 타워", "62㎡", "거실 분리", "전망 욕실 옵션", "클럽 라운지"]
  },
  {
    name: "프리미어 룸",
    image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop",
    desc: "보라색 포인트 인테리어가 돋보이는 넓은 객실로, 여유로운 공간에서 도심의 야경을 감상할 수 있습니다.",
    features: ["이그제큐티브 타워", "60㎡", "파노라마 시티뷰", "르 살롱 라운지", "독립형 욕조"]
  },
  {
    name: "디럭스 스위트",
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=400&h=200&fit=crop",
    desc: "별도의 응접실과 침실, 드레스룸을 갖춘 럭셔리 스위트입니다. 최상급의 휴식을 경험할 수 있습니다.",
    features: ["이그제큐티브 타워", "76㎡", "별도 응접실", "라심(La Cime) 라운지", "드레스룸"]
  },
  {
    name: "로얄 스위트",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&q=80",
    desc: "국내외 VIP를 위한 단 하나의 최고급 객실. 별도의 회의실과 사무공간, 서재 등을 갖추고 있습니다.",
    features: ["이그제큐티브 타워", "460㎡", "프라이빗 회의실", "전용 버틀러", "최고급 어메니티"]
  }
];

function Rooms() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1200px)');
  const isLarge = useMediaQuery('(min-width: 1600px)');
  
  const visibleCount = isMobile ? 1 : isTablet ? 2 : 3;
  const useVertical = isMobile;

  const [startIdx, setStartIdx] = useState(0);

  // 카드 크기 동적 설정
  let cardWidth = 260;
  let cardHeight = 400;
  let imageHeight = 180;
  let gridWidth = '900px';
  let buttonGap = isLarge ? 12 : 8;

  if (isLarge) {
    cardWidth = 400;
    cardHeight = 520;
    imageHeight = 260;
    gridWidth = '1400px';
  } else if (isTablet) {
    cardWidth = 280;
    cardHeight = 420;
    imageHeight = 190;
    gridWidth = '650px';
  } else if (isMobile) {
    cardWidth = '90vw';
    cardHeight = 370;
    imageHeight = 150;
    gridWidth = '100%';
    buttonGap = 0;
  }

  const handlePrev = () => {
    setStartIdx((prev) => Math.max(prev - visibleCount, 0));
  };

  const handleNext = () => {
    setStartIdx((prev) => Math.min(prev + visibleCount, rooms.length - visibleCount));
  };

  const visibleRooms = rooms.slice(startIdx, startIdx + visibleCount);
  const roomsToRender = useVertical ? rooms : visibleRooms;

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        객실 안내
      </Typography>
      <Typography align="center" color="text.secondary" sx={{ mb: 4 }}>
        Dev hotel은 비즈니스를 위한 메인 타워와 럭셔리한 휴식을 위한 이그제큐티브 타워로 나뉘어 운영됩니다.<br />
        고객님의 필요에 맞는 최적의 객실을 선택하여 최고의 경험을 누려보세요.
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        {!useVertical && (
          <Box sx={{ mr: buttonGap }}>
            <IconButton onClick={handlePrev} disabled={startIdx === 0}>
              <ArrowBackIosNewIcon />
            </IconButton>
          </Box>
        )}
        <Box
          sx={{
            width: gridWidth,
            maxWidth: '100%',
            display: 'flex',
            flexDirection: useVertical ? 'column' : 'row',
            gap: 4,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {roomsToRender.map((room) => (
            <RoomCard
              key={room.name}
              name={room.name}
              image={room.image}
              desc={room.desc}
              features={room.features}
              cardWidth={cardWidth}
              cardHeight={cardHeight}
              imageHeight={imageHeight}
            />
          ))}
        </Box>
        {!useVertical && (
          <Box sx={{ ml: buttonGap }}>
            <IconButton onClick={handleNext} disabled={startIdx + visibleCount >= rooms.length}>
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default Rooms;