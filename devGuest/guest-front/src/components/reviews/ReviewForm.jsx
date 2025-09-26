import React, { useState } from 'react';
import { Paper, TextField, Button, Box, Typography, CircularProgress, Rating } from '@mui/material';
import reviewService from '../../services/reviewService';

const ReviewForm = ({ token, onReviewSubmit, setSnackbar }) => {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || !rating) {
      setSnackbar({ open: true, message: '내용과 별점을 모두 입력해주세요.', severity: 'warning' });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await reviewService.createReview({ content, rating }, token);
      setSnackbar({ open: true, message: '소중한 후기가 등록되었습니다!', severity: 'success' });
      setContent('');
      setRating(5);
      onReviewSubmit(res.data);
    } catch (err) {
      const message = err.response?.data || '후기 작성에 실패했습니다.';
      setSnackbar({ open: true, message: message, severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper component="form" onSubmit={handleSubmit} sx={{ p: 2, mb: 4, boxShadow: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography component="legend">별점:</Typography>
        <Rating
          name="review-rating"
          value={rating}
          onChange={(event, newValue) => {
            setRating(newValue);
          }}
        />
      </Box>
      <TextField
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        label="소중한 후기를 남겨주세요."
        disabled={isSubmitting}
        inputProps={{ maxLength: 1000 }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
        <Typography variant="caption" color="text.secondary">{content.length} / 1000</Typography>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? <CircularProgress size={24} color="inherit" /> : '후기 등록'}
        </Button>
      </Box>
    </Paper>
  );
};

export default ReviewForm;