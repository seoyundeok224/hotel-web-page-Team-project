import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardActions, Avatar, Typography, Rating, IconButton, Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Collapse } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import reviewService from '../../services/reviewService';
import CommentSection from './CommentSection';

const stringToColor = (string) => { /* ... */ };

const ReviewCard = ({ review, isOwner, token, onAction, setSnackbar }) => {
  const [likeCount, setLikeCount] = useState(review.likeCount);
  const [liked, setLiked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  const isLongReview = review.content.length > 200;
  const handleExpandClick = () => setIsExpanded(!isExpanded);
  const handleToggleComments = () => setShowComments(!showComments);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleOpenDeleteDialog = () => { setOpenDeleteDialog(true); handleMenuClose(); };
  const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);

  const handleLike = async () => { /* ... */ };
  const handleDelete = async () => { /* ... */ };

  return (
    <>
      <Card variant="outlined" sx={{ '&:hover': { boxShadow: 3 } }}>
        <CardHeader /* ... */ />
        <CardContent sx={{ pt: 0 }}>
          <Rating value={review.rating} readOnly />
          <Collapse in={isExpanded} collapsedSize={isLongReview ? 100 : 'auto'}>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 1 }}>{review.content}</Typography>
          </Collapse>
          {isLongReview && (<Button size="small" onClick={handleExpandClick} sx={{ mt: 1 }}>{isExpanded ? '간략히' : '...더보기'}</Button>)}
        </CardContent>
        <CardActions disableSpacing>
          <IconButton onClick={handleLike}>{liked ? <ThumbUpIcon color="primary" /> : <ThumbUpAltOutlinedIcon />}</IconButton>
          <Typography variant="body2" sx={{ mr: 1 }}>{likeCount}</Typography>
          <IconButton onClick={handleToggleComments}><ChatBubbleOutlineIcon /></IconButton>
          <Typography variant="body2">{review.comments?.length || 0}</Typography>
        </CardActions>
        <Collapse in={showComments} timeout="auto" unmountOnExit>
          <CommentSection reviewId={review.id} token={token} setSnackbar={setSnackbar} />
        </Collapse>
      </Card>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleMenuClose}>수정</MenuItem>
        <MenuItem onClick={handleOpenDeleteDialog}>삭제</MenuItem>
      </Menu>
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>리뷰 삭제</DialogTitle>
        <DialogContent><DialogContentText>정말로 이 리뷰를 삭제하시겠습니까?</DialogContentText></DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>취소</Button>
          <Button onClick={handleDelete} color="error">삭제</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReviewCard;