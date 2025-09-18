import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, Button, List, ListItem, 
  ListItemText, Divider, Paper, CircularProgress, Alert 
} from '@mui/material';

// --- 오류 해결을 위한 임시 코드 ---
// 1. AuthContext가 없으므로, 임시 useAuth 훅을 만듭니다.
const useAuth = () => ({
  isAuthenticated: true, // 로그인된 상태로 가정
  token: 'dummy-jwt-token' // 테스트용 임시 토큰
});

// 2. reviewService가 없으므로, 임시 reviewService 객체를 만듭니다.
const reviewService = {
  getAllReviews: () => {
    // 1.5초 후 가짜 후기 데이터를 반환하는 Promise를 시뮬레이션합니다.
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          data: [
            { id: 1, username: '김개발', content: '호텔이 정말 깨끗하고 좋았어요!', createdAt: new Date().toISOString() },
            { id: 2, username: '이코딩', content: '조식이 맛있었습니다. 다음에 또 올게요.', createdAt: new Date().toISOString() }
          ]
        });
      }, 1500);
    });
  },
  createReview: (content, token) => {
    // 후기 작성이 성공했다고 가정하고, 새 후기 데이터를 반환하는 Promise를 시뮬레이션합니다.
    return new Promise(resolve => {
      console.log("새로운 후기 등록 시도:", { content, token });
      resolve({
        data: { id: Math.random(), username: '새 사용자', content, createdAt: new Date().toISOString() }
      });
    });
  }
};
// --- 임시 코드 끝 ---

// import { useAuth } from '../contexts/AuthContext'; // 주석 처리
// import reviewService from '../services/reviewService'; // 주석 처리

const Reviews = () => {
  const { isAuthenticated, token } = useAuth(); 
  const [reviews, setReviews] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = () => {
    setLoading(true);
    reviewService.getAllReviews()
      .then(response => {
        setReviews(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setError(null);
      })
      .catch(err => {
        console.error("후기 목록 로딩 실패:", err);
        setError('후기를 불러오는 데 실패했습니다. 백엔드 서버가 실행 중인지 확인해주세요.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const response = await reviewService.createReview(content, token);
      // 임시 서비스에서는 fetchReviews를 다시 호출하는 대신, 직접 상태를 업데이트합니다.
      setReviews(prevReviews => [response.data, ...prevReviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setContent('');
    } catch (err) {
      console.error("후기 작성 실패:", err);
      alert('후기 작성에 실패했습니다. 다시 로그인 후 시도해주세요.');
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>고객 후기</Typography>
      {isAuthenticated && (
        <Paper component="form" onSubmit={handleSubmit} sx={{ p: 2, mb: 4 }}>
          <TextField
            fullWidth multiline rows={4} value={content}
            onChange={(e) => setContent(e.target.value)}
            label="소중한 후기를 남겨주세요."
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>후기 등록</Button>
        </Paper>
      )}
      {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box> : 
       error ? <Alert severity="error">{error}</Alert> : (
        <List>
          {reviews.map((review, index) => (
            <React.Fragment key={review.id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={<strong>{review.username}</strong>}
                  secondary={
                    <>
                      <Typography component="span" variant="body2">{review.content}</Typography>
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        {new Date(review.createdAt).toLocaleString('ko-KR')}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              {index < reviews.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
};

export default Reviews;