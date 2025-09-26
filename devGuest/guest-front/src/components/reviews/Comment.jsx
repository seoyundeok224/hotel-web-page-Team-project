import React, { useState } from 'react';
import { Box, Avatar, Typography, Button, Collapse } from '@mui/material';
import CommentForm from './CommentForm';

const stringToColor = (s) => { let h=0; for(let i=0;i<s.length;i++)h=s.charCodeAt(i)+((h<<5)-h); let c='#'; for(let i=0;i<3;i++)c+=('00'+((h>>(i*8))&0xFF).toString(16)).slice(-2); return c; };

const Comment = ({ comment, reviewId, token, onCommentCreated, setSnackbar }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReplyCreated = () => {
    setShowReplyForm(false);
    if (onCommentCreated) onCommentCreated();
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
      <Avatar sx={{ bgcolor: stringToColor(comment.username || 'U'), width: 32, height: 32 }}>
        {(comment.username || 'U').charAt(0)}
      </Avatar>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body2" component="strong" sx={{ fontWeight: 'bold' }}>{comment.username}</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>{new Date(comment.createdAt).toLocaleString('ko-KR')}</Typography>
        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 0.5 }}>{comment.content}</Typography>
        {token && <Button size="small" onClick={() => setShowReplyForm(!showReplyForm)} sx={{ mt: 0.5 }}>{showReplyForm ? '취소' : '답글'}</Button>}
        
        <Collapse in={showReplyForm}>
          <CommentForm 
            reviewId={reviewId} 
            parentId={comment.id} 
            token={token} 
            onCommentCreated={handleReplyCreated} 
            setSnackbar={setSnackbar}
          />
        </Collapse>

        {comment.children?.length > 0 && (
          <Box sx={{ mt: 1, pl: 2, borderLeft: '2px solid #eee' }}>
            {comment.children.map((childComment) => (
              <Comment 
                key={childComment.id} 
                comment={childComment} 
                reviewId={reviewId} 
                token={token} 
                onCommentCreated={onCommentCreated} 
                setSnackbar={setSnackbar}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Comment;