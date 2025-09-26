import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import ReviewCard from './ReviewCard';

const ReviewList = ({ reviews, currentUser, token, onAction, setSnackbar }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      {reviews.map((review) => (
        <motion.div key={review.id} variants={itemVariants}>
          <ReviewCard
            review={review}
            isOwner={currentUser && currentUser.username === review.username}
            token={token}
            onAction={onAction}
            setSnackbar={setSnackbar}
          />
        </motion.div>
      ))}
    </Box>
  );
};

export default ReviewList;