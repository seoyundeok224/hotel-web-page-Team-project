import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Divider, CircularProgress } from '@mui/material';
import reviewService from '../../services/reviewService';
import Comment from './Comment';
import CommentForm from './CommentForm';

const CommentSection = ({ reviewId, token, setSnackbar, onCommentAction }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reviewService.getComments(reviewId);
      setComments(res.data);
    } catch (error) {
      setSnackbar({ open: true, message: '댓글을 불러오는 중 오류가 발생했습니다.', severity: 'error' });
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [reviewId, setSnackbar]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleCommentCreation = () => {
    if (onCommentAction) {
      onCommentAction();
    }
  };

  return (
    <Box sx={{ p: 2, pt: 0, bgcolor: 'grey.50' }}>
      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle1" gutterBottom>댓글</Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            reviewId={reviewId}
            token={token}
            onCommentCreated={handleCommentCreation}
            setSnackbar={setSnackbar}
          />
        ))
      )}
      <Box sx={{ mt: 2 }}>
        <CommentForm
          reviewId={reviewId}
          token={token}
          onCommentCreated={handleCommentCreation}
          setSnackbar={setSnackbar}
        />
      </Box>
    </Box>
  );
};

export default CommentSection;