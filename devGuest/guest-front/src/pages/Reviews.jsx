import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert, Pagination, Snackbar, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import { useAuth } from '../contexts/AuthContext';
import reviewService from '../services/reviewService';
import ReviewForm from '../components/reviews/ReviewForm';
import ReviewList from '../components/reviews/ReviewList';

const Reviews = () => {
  const { user, isAuthenticated } = useAuth(); // 'user'가 로그인 정보입니다.
  const token = localStorage.getItem('token');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sort, setSort] = useState('createdAt,desc');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchReviews = useCallback(async (currentPage, currentSort) => {
    setLoading(true);
    try {
      const res = await reviewService.getAllReviews(currentPage - 1, 10, currentSort);
      setReviews(res.data.content);
      setTotalPages(res.data.totalPages);
      setError(null);
    } catch (err) {
      setError('후기를 불러오는 데 실패했습니다.');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews(page, sort);
  }, [page, sort, fetchReviews]);
  
  const handleSortChange = (event) => {
    setSort(event.target.value);
    setPage(1);
  };

  const refreshReviews = () => fetchReviews(page, sort);

  const handleCreateReview = (newReview) => {
    setSort('createdAt,desc');
    setPage(1); // 새 글 작성 후 첫 페이지로 이동하며 새로고침
    fetchReviews(1, 'createdAt,desc');
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };
  
  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>고객 후기</Typography>
      {isAuthenticated && <ReviewForm token={token} onReviewSubmit={handleCreateReview} setSnackbar={setSnackbar} />}
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>정렬</InputLabel>
          <Select value={sort} label="정렬" onChange={handleSortChange}>
            <MenuItem value={'createdAt,desc'}>최신순</MenuItem>
            <MenuItem value={'rating,desc'}>별점 높은 순</MenuItem>
            <MenuItem value={'likeCount,desc'}>좋아요 많은 순</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? ( <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box> ) 
        : error ? ( <Alert severity="error">{error}</Alert> ) 
        : reviews.length === 0 ? ( 
        <Paper sx={{ p: 4, textAlign: 'center', mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <RateReviewOutlinedIcon sx={{ fontSize: 48, color: 'grey.500' }} />
          <Typography variant="h6">아직 작성된 후기가 없습니다.</Typography>
          {isAuthenticated && <Typography color="text.secondary">첫 후기를 남겨주세요!</Typography>}
        </Paper>
        ) : (
        <>
          <ReviewList 
            reviews={reviews} 
            currentUser={user} // [수정] ReviewList로 currentUser={user} prop 추가
            token={token} 
            onAction={refreshReviews} 
            setSnackbar={setSnackbar}
          />
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination count={totalPages} page={page} onChange={(event, value) => setPage(value)} color="primary"/>
            </Box>
          )}
        </>
      )}

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Reviews;