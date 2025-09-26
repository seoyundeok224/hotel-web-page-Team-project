import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardActions, Avatar, Typography, Rating, IconButton, Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Collapse, CircularProgress, Box, TextField } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { motion } from 'framer-motion';
import reviewService from '../../services/reviewService';
import CommentSection from './CommentSection';

const stringToColor = (s) => { let h=0; for(let i=0;i<s.length;i++)h=s.charCodeAt(i)+((h<<5)-h); let c='#'; for(let i=0;i<3;i++)c+=('00'+((h>>(i*8))&0xFF).toString(16)).slice(-2); return c; };

const ReviewCard = ({ review, isOwner, currentUser, token, onAction, setSnackbar }) => {
  const [likeCount, setLikeCount] = useState(review.likeCount);
  const [liked, setLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(review.content);
  const [editedRating, setEditedRating] = useState(review.rating);
  const [isExpanded, setIsExpanded] = useState(false);

  const isLongReview = review.content.length > 200;

  useEffect(() => {
    const likedReviews = JSON.parse(localStorage.getItem('likedReviews') || '[]');
    if (likedReviews.includes(review.id)) setLiked(true);
  }, [review.id]);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleToggleComments = () => setShowComments(!isExpanded);
  const handleExpandClick = () => setIsExpanded(!isExpanded);

  // ... (다른 핸들러 함수들은 이전과 동일) ...
  const handleEdit = () => { setIsEditing(true); setEditedContent(review.content); setEditedRating(review.rating); handleMenuClose(); };
  const handleCancelEdit = () => { setIsEditing(false); };
  const handleSaveEdit = async () => { try { await reviewService.updateReview(review.id, { content: editedContent, rating: editedRating }, token); setSnackbar({ open: true, message: '후기가 수정되었습니다.', severity: 'success' }); setIsEditing(false); onAction(); } catch (err) { setSnackbar({ open: true, message: '후기 수정에 실패했습니다.', severity: 'error' }); } };
  const handleOpenDeleteDialog = () => { setOpenDeleteDialog(true); handleMenuClose(); };
  const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);
  const handleDelete = async () => { try { await reviewService.deleteReview(review.id, token); setSnackbar({ open: true, message: '후기가 삭제되었습니다.', severity: 'success' }); onAction(); } catch (err) { setSnackbar({ open: true, message: '후기 삭제에 실패했습니다.', severity: 'error' }); } finally { handleCloseDeleteDialog(); } };
  const handleLike = async () => { if (!token) { setSnackbar({ open: true, message: '로그인이 필요합니다.', severity: 'warning' }); return; } if (isLiking) return; setIsLiking(true); try { await reviewService.likeReview(review.id, token); const newCount = liked ? likeCount - 1 : likeCount + 1; setLikeCount(newCount); setLiked(!liked); const store = JSON.parse(localStorage.getItem('likedReviews')||'[]'); if(!liked){localStorage.setItem('likedReviews',JSON.stringify([...store,review.id]))}else{localStorage.setItem('likedReviews',JSON.stringify(store.filter(id=>id!==review.id)))} } catch (err) { setSnackbar({ open: true, message: '오류가 발생했습니다.', severity: 'error' }); } finally { setIsLiking(false); } };

  return (
    <>
      <Card variant="outlined" sx={{ '&:hover': { boxShadow: 3 } }}>
        <CardHeader
          avatar={<Avatar sx={{ bgcolor: stringToColor(review.username) }}>{review.username.charAt(0)}</Avatar>}
          action={isOwner && <IconButton onClick={handleMenuOpen}><MoreVertIcon /></IconButton>}
          title={review.username}
          subheader={new Date(review.createdAt).toLocaleString('ko-KR')}
        />
        
        {isEditing ? (
          <CardContent sx={{ pt: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Rating value={editedRating} onChange={(e, newValue) => setEditedRating(newValue)} />
            <TextField fullWidth multiline rows={4} value={editedContent} onChange={(e) => setEditedContent(e.target.value)} variant="outlined"/>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button onClick={handleCancelEdit}>취소</Button>
              <Button variant="contained" onClick={handleSaveEdit}>저장</Button>
            </Box>
          </CardContent>
        ) : (
          <CardContent sx={{ pt: 0 }}>
            <Rating value={review.rating} readOnly />
            
            {/* [수정] 긴 글일 때와 짧은 글일 때를 분리해서 렌더링 */}
            {isLongReview ? (
              <>
                <Collapse in={isExpanded} collapsedSize={100} timeout="auto">
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 1 }}>
                    {review.content}
                  </Typography>
                </Collapse>
                <Button size="small" onClick={handleExpandClick} sx={{ mt: 1 }}>
                  {isExpanded ? '간략히' : '...더보기'}
                </Button>
              </>
            ) : (
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 1 }}>
                {review.content}
              </Typography>
            )}
          </CardContent>
        )}

        <CardActions disableSpacing>
          <IconButton component={motion.button} whileTap={{ scale: 1.2 }} onClick={handleLike} disabled={isLiking}>
            {isLiking ? <CircularProgress size={20} /> : (liked ? <ThumbUpIcon color="primary" /> : <ThumbUpAltOutlinedIcon />)}
          </IconButton>
          <Typography variant="body2" sx={{ mr: 1 }}>{likeCount}</Typography>
          <IconButton onClick={handleToggleComments}><ChatBubbleOutlineIcon /></IconButton>
          <Typography variant="body2">{review.comments?.length || 0}</Typography>
        </CardActions>
        
        <Collapse in={showComments} timeout="auto" unmountOnExit>
          <CommentSection 
            reviewId={review.id} 
            token={token} 
            currentUser={currentUser}
            setSnackbar={setSnackbar}
            onCommentAction={onAction}
          />
        </Collapse>
      </Card>
      
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}><MenuItem onClick={handleEdit}>수정</MenuItem><MenuItem onClick={handleOpenDeleteDialog} sx={{ color: 'error.main' }}>삭제</MenuItem></Menu>
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}><DialogTitle>리뷰 삭제</DialogTitle><DialogContent><DialogContentText>정말로 이 리뷰를 삭제하시겠습니까?</DialogContentText></DialogContent><DialogActions><Button onClick={handleCloseDeleteDialog}>취소</Button><Button onClick={handleDelete} color="error">삭제</Button></DialogActions></Dialog>
    </>
  );
};

export default ReviewCard;