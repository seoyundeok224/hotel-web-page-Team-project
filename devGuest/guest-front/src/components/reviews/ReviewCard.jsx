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
    
    if (!review) {
        return null; 
    }

    const [currentReview, setCurrentReview] = useState(review);
    const [commentCount, setCommentCount] = useState(review.commentCount || 0);
    const [liked, setLiked] = useState(review.likedByCurrentUser || false);
    const [isLiking, setIsLiking] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(review.content || '');
    const [editedRating, setEditedRating] = useState(review.rating || 0);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        setCurrentReview(review);
        setCommentCount(review.commentCount || 0);
        setLiked(review.likedByCurrentUser || false);
    }, [review]);

    const isLongReview = currentReview.content?.length > 200;

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    const handleToggleComments = () => setShowComments(!showComments);
    const handleExpandClick = () => setIsExpanded(!isExpanded);
    const handleEdit = () => { setIsEditing(true); setEditedContent(currentReview.content); setEditedRating(currentReview.rating); handleMenuClose(); };
    const handleCancelEdit = () => { setIsEditing(false); };
    const handleSaveEdit = async () => { try { const res = await reviewService.updateReview(currentReview.id, { content: editedContent, rating: editedRating }, token); setCurrentReview(res.data); setSnackbar({ open: true, message: '후기가 수정되었습니다.', severity: 'success' }); setIsEditing(false); } catch (err) { setSnackbar({ open: true, message: '후기 수정에 실패했습니다.', severity: 'error' }); } };
    const handleOpenDeleteDialog = () => { setOpenDeleteDialog(true); handleMenuClose(); };
    const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);
    const handleDelete = async () => { try { await reviewService.deleteReview(currentReview.id, token); setSnackbar({ open: true, message: '후기가 삭제되었습니다.', severity: 'success' }); onAction(); } catch (err) { setSnackbar({ open: true, message: '후기 삭제에 실패했습니다.', severity: 'error' }); } finally { handleCloseDeleteDialog(); } };
    
    const handleLike = async () => {
        if (!token || isLiking) return;

        const originalReview = { ...currentReview };
        const originalLiked = liked;
        
        const newLiked = !liked;
        setLiked(newLiked);
        
        // [수정] UI 예측 로직을 서버와 동일하게 수정 (깜빡임 문제 해결)
        setCurrentReview(prev => ({
            ...prev,
            likeCount: newLiked ? (prev.likeCount || 0) + 1 : (prev.likeCount || 0) - 1
        }));

        setIsLiking(true);
        try {
            const response = await reviewService.likeReview(currentReview.id, token);
            // 서버의 최종 결과로 UI를 한 번 더 동기화
            setCurrentReview(response.data);
            setLiked(response.data.likedByCurrentUser);
        } catch (err) {
            setSnackbar({ open: true, message: '오류가 발생했습니다. 다시 시도해주세요.', severity: 'error' });
            // 실패 시 원래 상태로 복원
            setCurrentReview(originalReview);
            setLiked(originalLiked);
        } finally {
            setIsLiking(false);
        }
    };
    
    const handleCommentChange = (change) => {
        setCommentCount(prevCount => prevCount + change);
    };

    return (
        <>
            <Card variant="outlined" sx={{ '&:hover': { boxShadow: 3 } }}>
                <CardHeader 
                    avatar={<Avatar sx={{ bgcolor: stringToColor(currentReview.username || '') }}>{(currentReview.username || '?').charAt(0)}</Avatar>} 
                    action={isOwner && <IconButton onClick={handleMenuOpen}><MoreVertIcon /></IconButton>} 
                    title={currentReview.username || '알 수 없는 사용자'} 
                    subheader={currentReview.createdAt ? new Date(currentReview.createdAt).toLocaleString('ko-KR') : ''} 
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
                        <Rating value={currentReview.rating || 0} readOnly /> 
                        {isLongReview ? ( 
                            <> 
                                <Collapse in={isExpanded} collapsedSize={100} timeout="auto"> 
                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 1 }}> 
                                        {currentReview.content || ''} 
                                    </Typography> 
                                </Collapse> 
                                <Button size="small" onClick={handleExpandClick} sx={{ mt: 1 }}> 
                                    {isExpanded ? '간략히' : '...더보기'} 
                                </Button> 
                            </> 
                        ) : ( 
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 1 }}> 
                                {currentReview.content || ''} 
                            </Typography> 
                        )} 
                    </CardContent> 
                )}
                <CardActions disableSpacing>
                    <IconButton component={motion.button} whileTap={{ scale: 1.2 }} onClick={handleLike} disabled={isLiking}>
                        {isLiking ? <CircularProgress size={20} /> : (liked ? <ThumbUpIcon color="primary" /> : <ThumbUpAltOutlinedIcon />)}
                    </IconButton>
                    <Typography variant="body2" sx={{ mr: 1 }}>{currentReview.likeCount || 0}</Typography>
                    <IconButton onClick={handleToggleComments}><ChatBubbleOutlineIcon /></IconButton>
                    <Typography variant="body2">{commentCount || 0}</Typography>
                </CardActions>
                <Collapse in={showComments} timeout="auto" unmountOnExit>
                    <CommentSection 
                        reviewId={currentReview.id} 
                        token={token} 
                        currentUser={currentUser}
                        setSnackbar={setSnackbar}
                        onCommentChange={handleCommentChange}
                    />
                </Collapse>
            </Card>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleEdit}>수정</MenuItem>
                <MenuItem onClick={handleOpenDeleteDialog} sx={{ color: 'error.main' }}>삭제</MenuItem>
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