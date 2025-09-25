import React, { useState } from 'react';
import { Box, TextField, Button, CircularProgress } from '@mui/material';
import reviewService from '../../services/reviewService';

const CommentForm = ({ reviewId, parentId = null, token, onCommentCreated, setSnackbar }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setIsSubmitting(true);
    try {
      await reviewService.createComment(reviewId, { content, parentId }, token);
      setContent('');
      if(onCommentCreated) onCommentCreated();
      setSnackbar({ open: true, message: '댓글이 등록되었습니다.', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: '댓글 작성에 실패했습니다.', severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1, mt: 1 }}>
      <TextField fullWidth size="small" value={content} onChange={(e) => setContent(e.target.value)} placeholder={parentId ? "답글 입력..." : "댓글 입력..."} disabled={isSubmitting}/>
      <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ flexShrink: 0 }}>
        {isSubmitting ? <CircularProgress size={24} /> : '등록'}
      </Button>
    </Box>
  );
};

export default CommentForm;