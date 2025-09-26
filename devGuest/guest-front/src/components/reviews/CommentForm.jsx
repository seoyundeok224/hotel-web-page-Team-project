import React, { useState } from 'react';
import { Box, TextField, Button, CircularProgress } from '@mui/material';
import reviewService from '../../services/reviewService';

const CommentForm = ({ reviewId, parentId = null, token, onCommentCreated, setSnackbar }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!token) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
        setSnackbar({ open: true, message: '댓글 내용을 입력해주세요.', severity: 'warning' });
        return;
    }

    setIsSubmitting(true);
    try {
      await reviewService.createComment(reviewId, { content, parentId }, token);
      setContent('');
      setSnackbar({ open: true, message: '댓글이 등록되었습니다.', severity: 'success' });
      if (onCommentCreated) {
        onCommentCreated();
      }
    } catch (error) {
      setSnackbar({ open: true, message: '댓글 작성에 실패했습니다. 다시 시도해주세요.', severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1, mt: 1 }}>
      <TextField
        fullWidth
        size="small"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={parentId ? "답글을 입력하세요..." : "댓글을 입력하세요..."}
        disabled={isSubmitting}
        variant="outlined"
      />
      <Button
        type="submit"
        variant="contained"
        disabled={!content.trim() || isSubmitting}
        sx={{ flexShrink: 0 }}
      >
        {isSubmitting ? <CircularProgress size={24} color="inherit" /> : '등록'}
      </Button>
    </Box>
  );
};

export default CommentForm;