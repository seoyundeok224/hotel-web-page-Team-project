import React from 'react';
import { Box } from '@mui/material';
import ReviewCard from './ReviewCard';

const ReviewList = ({ reviews, currentUser, token, onAction, setSnackbar }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          isOwner={currentUser && currentUser.username === review.username}
          token={token}
          onAction={onAction}
          setSnackbar={setSnackbar}
        />
      ))}
    </Box>
  );
};

export default ReviewList;