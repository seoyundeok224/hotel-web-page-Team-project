import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Divider, CircularProgress } from '@mui/material';
import reviewService from '../../services/reviewService';
import Comment from './Comment';
import CommentForm from './CommentForm';

const CommentSection = ({ reviewId, token, setSnackbar }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reviewService.getComments(reviewId);
      setComments(res.data);
    } catch (error) {
      setSnackbar({ open: true, message: '댓글 로딩에 실패했습니다.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [reviewId, setSnackbar]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return (
    <Box sx={{ p: 2, pt: 0 }}>
      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle1" gutterBottom>댓글</Typography>
      {loading ? (<CircularProgress size={24} />) : (
        comments.map((comment) => (
          <Comment key={comment.id} comment={comment} reviewId={reviewId} token={token} onCommentCreated={fetchComments} setSnackbar={setSnackbar}/>
        ))
      )}
      <Box sx={{ mt: 2 }}>
        <CommentForm reviewId={reviewId} token={token} onCommentCreated={fetchComments} setSnackbar={setSnackbar}/>
      </Box>
    </Box>
  );
};

export default CommentSection;