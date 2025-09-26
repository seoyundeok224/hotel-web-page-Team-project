import React, { useState } from 'react';
import { Box, Typography, Paper, Alert, Pagination, Snackbar, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import { useAuth } from '../contexts/AuthContext';
import ReviewForm from '../components/reviews/ReviewForm';
import ReviewList from '../components/reviews/ReviewList';
import { useReviews } from '../hooks/useReviews';
import ReviewCardSkeleton from '../components/reviews/ReviewCardSkeleton';

const Reviews = () => {
  const { user, isAuthenticated } = useAuth();
  const token = localStorage.getItem('token');
  
  const { reviews, setReviews, loading, error, page, totalPages, sort, setPage, setSort, fetchReviews } = useReviews();

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSortChange = (event) => {
    setSort(event.target.value);
    setPage(1);
  };

  const handleReviewAction = () => {
    fetchReviews(page, sort);
  };

  const handleCreateReview = (newReview) => {
    setSort('createdAt,desc');
    setPage(1);
    setReviews(prevReviews => [newReview, ...prevReviews]);
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

      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ReviewCardSkeleton />
            <ReviewCardSkeleton />
            <ReviewCardSkeleton />
        </Box>
      ) : error ? ( <Alert severity="error">{error}</Alert> ) 
        : reviews.length === 0 ? ( 
        <Paper sx={{ p: 4, textAlign: 'center', mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, bgcolor: 'grey.50' }}>
          <RateReviewOutlinedIcon sx={{ fontSize: 48, color: 'grey.500' }} />
          <Typography variant="h6">아직 작성된 후기가 없습니다.</Typography>
          {isAuthenticated && <Typography color="text.secondary">첫 후기를 남겨주세요!</Typography>}
        </Paper>
        ) : (
        <>
          <ReviewList reviews={reviews} currentUser={user} token={token} onAction={handleReviewAction} setSnackbar={setSnackbar}/>
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