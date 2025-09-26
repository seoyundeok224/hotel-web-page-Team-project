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
      
      // 재귀적으로 총 댓글 수를 계산
      const countTotalComments = (commentList) => {
        let count = 0;
        for (const comment of commentList) {
          count++;
          if (comment.children && comment.children.length > 0) {
            count += countTotalComments(comment.children);
          }
        }
        return count;
      };
      const totalComments = countTotalComments(res.data);
      onCommentAction(totalComments);

    } catch (error) {
      setSnackbar({ open: true, message: '댓글 로딩에 실패했습니다.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [reviewId, setSnackbar, onCommentAction]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return (
    <Box sx={{ p: 2, pt: 0, bgcolor: 'grey.50' }}>
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