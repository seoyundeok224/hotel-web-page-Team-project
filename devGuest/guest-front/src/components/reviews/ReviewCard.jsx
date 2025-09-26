import React, { useState, useEffect } from 'react'; // useEffect 추가
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
    // [수정] review prop을 내부 state로 관리하여 즉각적인 UI 변경을 가능하게 함
    const [currentReview, setCurrentReview] = useState(review);
    const [liked, setLiked] = useState(() => {
        const likedReviews = JSON.parse(localStorage.getItem('likedReviews') || '[]');
        return likedReviews.includes(review.id);
    });

    const [isLiking, setIsLiking] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(review.content);
    const [editedRating, setEditedRating] = useState(review.rating);
    const [isExpanded, setIsExpanded] = useState(false);

    // [추가] 부모 컴포넌트에서 review prop이 변경되면(예: 정렬, 페이지네이션) 내부 state도 동기화
    useEffect(() => {
        setCurrentReview(review);
    }, [review]);

    const isLongReview = currentReview.content.length > 200;

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
    
    // [수정] '좋아요' 핸들러에 낙관적 업데이트 적용
    const handleLike = async () => {
        if (!token || isLiking) return;

        const originalReview = { ...currentReview };
        const originalLiked = liked;

        // 1. UI를 즉시 업데이트 (낙관적)
        const newLiked = !originalLiked;
        const newLikeCount = newLiked ? originalReview.likeCount + 1 : originalReview.likeCount - 1;
        
        setLiked(newLiked);
        setCurrentReview(prev => ({ ...prev, likeCount: newLikeCount }));
        
        // localStorage도 업데이트
        const store = JSON.parse(localStorage.getItem('likedReviews') || '[]');
        if (newLiked) {
            localStorage.setItem('likedReviews', JSON.stringify([...store, review.id]));
        } else {
            localStorage.setItem('likedReviews', JSON.stringify(store.filter(id => id !== review.id)));
        }

        setIsLiking(true);
        try {
            // 2. 서버에 요청 전송
            await reviewService.likeReview(currentReview.id, token);
        } catch (err) {
            // 3. 실패 시 UI를 원래 상태로 롤백
            setSnackbar({ open: true, message: '오류가 발생했습니다. 다시 시도해주세요.', severity: 'error' });
            setCurrentReview(originalReview);
            setLiked(originalLiked);
            // localStorage도 롤백
            localStorage.setItem('likedReviews', JSON.stringify(store));
        } finally {
            setIsLiking(false);
        }
    };

    return (
        <>
            <Card variant="outlined" sx={{ '&:hover': { boxShadow: 3 } }}>
                {/* [수정] 모든 review prop을 currentReview state로 변경 */}
                <CardHeader
                    avatar={<Avatar sx={{ bgcolor: stringToColor(currentReview.username) }}>{currentReview.username.charAt(0)}</Avatar>}
                    action={isOwner && <IconButton onClick={handleMenuOpen}><MoreVertIcon /></IconButton>}
                    title={currentReview.username}
                    subheader={new Date(currentReview.createdAt).toLocaleString('ko-KR')}
                />
                
                {isEditing ? (
                   // ... (수정 UI는 동일)
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
                        <Rating value={currentReview.rating} readOnly />
                        {isLongReview ? (
                            <>
                                <Collapse in={isExpanded} collapsedSize={100} timeout="auto">
                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 1 }}>
                                        {currentReview.content}
                                    </Typography>
                                </Collapse>
                                <Button size="small" onClick={handleExpandClick} sx={{ mt: 1 }}>
                                    {isExpanded ? '간략히' : '...더보기'}
                                </Button>
                            </>
                        ) : (
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 1 }}>
                                {currentReview.content}
                            </Typography>
                        )}
                    </CardContent>
                )}

                <CardActions disableSpacing>
                    <IconButton component={motion.button} whileTap={{ scale: 1.2 }} onClick={handleLike} disabled={isLiking}>
                        {isLiking ? <CircularProgress size={20} /> : (liked ? <ThumbUpIcon color="primary" /> : <ThumbUpAltOutlinedIcon />)}
                    </IconButton>
                    <Typography variant="body2" sx={{ mr: 1 }}>{currentReview.likeCount}</Typography>
                    <IconButton onClick={handleToggleComments}><ChatBubbleOutlineIcon /></IconButton>
                    <Typography variant="body2">{currentReview.comments?.length || 0}</Typography>
                </CardActions>
                
                <Collapse in={showComments} timeout="auto" unmountOnExit>
                    <CommentSection 
                        reviewId={currentReview.id} 
                        token={token} 
                        currentUser={currentUser}
                        setSnackbar={setSnackbar}
                        onCommentAction={onAction} // 댓글 작성/삭제 시에는 목록 전체 새로고침이 필요하므로 onAction 유지
                    />
                </Collapse>
            </Card>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleEdit}>수정</MenuItem>
                <MenuItem onClick={handleOpenDeleteDialog} sx={{ color: 'error.main' }}>삭제</MenuItem>
            </Menu>
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>리뷰 삭제</DialogTitle>
                <DialogContent>
                    <DialogContentText>정말로 이 리뷰를 삭제하시겠습니까?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>취소</Button>
                    <Button onClick={handleDelete} color="error">삭제</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ReviewCard;
