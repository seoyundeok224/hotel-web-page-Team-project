import React, { useState } from 'react';
import { Box, Avatar, Typography, Button, Collapse } from '@mui/material';
import CommentForm from './CommentForm';

const stringToColor = (string) => { /* ... */ };

const Comment = ({ comment, reviewId, token, onCommentCreated, setSnackbar }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);

  return (
    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
      <Avatar sx={{ bgcolor: stringToColor(comment.username || 'U'), width: 32, height: 32 }}>
        {(comment.username || 'U').charAt(0)}
      </Avatar>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body2" component="strong" sx={{ fontWeight: 'bold' }}>{comment.username}</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>{new Date(comment.createdAt).toLocaleString('ko-KR')}</Typography>
        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 0.5 }}>{comment.content}</Typography>
        <Button size="small" onClick={() => setShowReplyForm(!showReplyForm)} sx={{ mt: 0.5 }}>{showReplyForm ? '취소' : '답글'}</Button>
        <Collapse in={showReplyForm}>
          <CommentForm reviewId={reviewId} parentId={comment.id} token={token} onCommentCreated={() => { setShowReplyForm(false); onCommentCreated(); }} setSnackbar={setSnackbar}/>
        </Collapse>
        {comment.children?.length > 0 && (
          <Box sx={{ mt: 1 }}>
            {comment.children.map((childComment) => (
              <Comment key={childComment.id} comment={childComment} reviewId={reviewId} token={token} onCommentCreated={onCommentCreated} setSnackbar={setSnackbar}/>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Comment;