import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardActions, Avatar, Typography, Rating, IconButton, Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Collapse, Box, CircularProgress } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { motion } from 'framer-motion';
import reviewService from '../../services/reviewService';
import CommentSection from './CommentSection';

const stringToColor = (string) => {
  let hash = 0;
  let i;
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
};

const ReviewCard = ({ review, isOwner, token, onAction, setSnackbar }) => {
  const [likeCount, setLikeCount] = useState(review.likeCount);
  const [liked, setLiked] = useState(false);
  const [commentCount, setCommentCount] = useState(review.comments?.length || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    const likedReviews = JSON.parse(localStorage.getItem('likedReviews') || '[]');
    if (likedReviews.includes(review.id)) {
      setLiked(true);
    }
  }, [review.id]);

  const isLongReview = review.content.length > 200;
  const handleExpandClick = () => setIsExpanded(!isExpanded);
  const handleToggleComments = () => setShowComments(!showComments);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleOpenDeleteDialog = () => { setOpenDeleteDialog(true); handleMenuClose(); };
  const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);

  const handleLike = async () => {
    if (!token) {
        setSnackbar({ open: true, message: '좋아요는 로그인 후 가능합니다.', severity: 'warning' });
        return;
    }
    if (isLiking) return;
    setIsLiking(true);

    try {
        await reviewService.likeReview(review.id, token);
        const newLikeCount = liked ? likeCount - 1 : likeCount + 1;
        setLikeCount(newLikeCount);
        setLiked(!liked);
        
        const likedReviews = JSON.parse(localStorage.getItem('likedReviews') || '[]');
        if (!liked) {
            localStorage.setItem('likedReviews', JSON.stringify([...likedReviews, review.id]));
        } else {
            localStorage.setItem('likedReviews', JSON.stringify(likedReviews.filter(id => id !== review.id)));
        }
    } catch (err) {
        setSnackbar({ open: true, message: '요청 처리 중 오류가 발생했습니다.', severity: 'error' });
    } finally {
        setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    try {
      await reviewService.deleteReview(review.id, token);
      setSnackbar({ open: true, message: '후기가 삭제되었습니다.', severity: 'success' });
      onAction();
    } catch (err) {
      setSnackbar({ open: true, message: '후기 삭제에 실패했습니다.', severity: 'error' });
    } finally {
      handleCloseDeleteDialog();
    }
  };

  const handleUpdate = async () => {
    handleMenuClose();
    const newContent = prompt("수정할 내용을 입력하세요:", review.content);
    if (newContent && newContent.trim() !== "" && newContent !== review.content) {
        try {
            await reviewService.updateReview(review.id, { content: newContent, rating: review.rating }, token);
            setSnackbar({ open: true, message: '후기가 수정되었습니다.', severity: 'success' });
            onAction();
        } catch (err) {
            setSnackbar({ open: true, message: '후기 수정에 실패했습니다.', severity: 'error' });
        }
    }
  };
  
  const onCommentAction = (count) => {
    setCommentCount(count);
  };

  return (
    <>
      <Card variant="outlined" sx={{ '&:hover': { boxShadow: 3 } }}>
        <CardHeader
          avatar={<Avatar sx={{ bgcolor: stringToColor(review.username) }}>{review.username.charAt(0)}</Avatar>}
          action={ isOwner && (
              <IconButton onClick={handleMenuOpen}><MoreVertIcon /></IconButton>
          )}
          title={review.username}
          subheader={new Date(review.createdAt).toLocaleString('ko-KR')}
        />
        <CardContent sx={{ pt: 0 }}>
          <Rating value={review.rating} readOnly />
          <Collapse in={isExpanded} collapsedSize={isLongReview ? 100 : 'auto'}>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 1 }}>{review.content}</Typography>
          </Collapse>
          {isLongReview && (<Button size="small" onClick={handleExpandClick} sx={{ mt: 1 }}>{isExpanded ? '간략히' : '...더보기'}</Button>)}
        </CardContent>
        <CardActions disableSpacing>
          <IconButton component={motion.button} whileTap={{ scale: 1.2 }} onClick={handleLike} disabled={isLiking}>
            {isLiking ? <CircularProgress size={20} /> : (liked ? <ThumbUpIcon color="primary" /> : <ThumbUpAltOutlinedIcon />)}
          </IconButton>
          <Typography variant="body2" sx={{ mr: 1 }}>{likeCount}</Typography>
          <IconButton onClick={handleToggleComments}><ChatBubbleOutlineIcon /></IconButton>
          <Typography variant="body2">{commentCount}</Typography>
        </CardActions>
        <Collapse in={showComments} timeout="auto" unmountOnExit>
          <CommentSection 
            reviewId={review.id} 
            token={token} 
            setSnackbar={setSnackbar}
            onCommentAction={onCommentAction}
          />
        </Collapse>
      </Card>
      
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleUpdate}>수정</MenuItem>
        <MenuItem onClick={handleOpenDeleteDialog} sx={{color: 'error.main'}}>삭제</MenuItem>
      </Menu>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>리뷰 삭제</DialogTitle>
        <DialogContent><DialogContentText>정말로 이 리뷰를 삭제하시겠습니까? 되돌릴 수 없습니다.</DialogContentText></DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>취소</Button>
          <Button onClick={handleDelete} color="error">삭제</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReviewCard;