// ...existing code...
import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, Button, List, ListItem, 
  ListItemText, Divider, Paper, CircularProgress, Alert 
} from '@mui/material';

// ...existing code...
// 변경: 임시 useAuth와 임시 reviewService 삭제하고 실제 것들을 사용
import { useAuth } from '../contexts/AuthContext';
import reviewService from '../services/reviewService';

const Reviews = () => {
  const { isAuthenticated } = useAuth();
  const token = localStorage.getItem('token'); // 또는 AuthContext에서 token을 제공하도록 변경

  const [reviews, setReviews] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await reviewService.getAllReviews();
      setReviews(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setError(null);
    } catch (err) {
      console.error("후기 목록 로딩 실패:", err);
      setError('후기를 불러오는 데 실패했습니다. 백엔드 서버가 실행 중인지 확인하세요.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      const res = await reviewService.createReview(content, token);
      // 신규 후기를 화면에 바로 반영
      setReviews(prev => [res.data, ...prev].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setContent('');
    } catch (err) {
      console.error("후기 작성 실패:", err);
      alert('후기 작성에 실패했습니다. 로그인 상태를 확인하세요.');
    }
  };

  // ...existing code (렌더링 부분)...
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
          {reviews.map((review) => (
            <React.Fragment key={review.id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={<strong>{review.username}</strong>}
                  secondary={<Typography variant="body2">{review.content}</Typography>}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
};

export default Reviews;
// ...existing code...