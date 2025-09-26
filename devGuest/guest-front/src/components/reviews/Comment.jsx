import React, { useState } from 'react';
import { Box, Avatar, Typography, Button, Collapse, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CommentForm from './CommentForm';
import reviewService from '../../services/reviewService';
import Timestamp from './Timestamp';

const stringToColor = (s) => { let h=0; for(let i=0;i<s.length;i++)h=s.charCodeAt(i)+((h<<5)-h); let c='#'; for(let i=0;i<3;i++)c+=('00'+((h>>(i*8))&0xFF).toString(16)).slice(-2); return c; };

const Comment = ({ comment, reviewId, token, currentUser, onCommentDeleted, onReplyCreated, setSnackbar }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const isOwner = currentUser && currentUser.username === comment.username;

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    const handleOpenDeleteDialog = () => { setOpenDeleteDialog(true); handleMenuClose(); };
    const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);

    const handleDelete = async () => {
        try {
            await reviewService.deleteComment(comment.id, token);
            setSnackbar({ open: true, message: '댓글이 삭제되었습니다.', severity: 'success' });
            if (onCommentDeleted) onCommentDeleted();
        } catch (err) {
            setSnackbar({ open: true, message: '댓글 삭제에 실패했습니다.', severity: 'error' });
        } finally {
            handleCloseDeleteDialog();
        }
    };

    const handleReplyCreated = () => { setShowReplyForm(false); if (onReplyCreated) onReplyCreated(); };

    return (
        <>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Avatar sx={{ bgcolor: stringToColor(comment.username || 'U'), width: 32, height: 32 }}>
                    {(comment.username || 'U').charAt(0)}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                            <Typography variant="body2" component="strong" sx={{ fontWeight: 'bold' }}>{comment.username}</Typography>
                            <Timestamp date={comment.createdAt} />
                        </Box>
                        {isOwner && (
                            <IconButton size="small" onClick={handleMenuOpen}><MoreVertIcon fontSize="small" /></IconButton>
                        )}
                    </Box>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 0.5 }}>{comment.content}</Typography>
                    {token && <Button size="small" onClick={() => setShowReplyForm(!showReplyForm)} sx={{ mt: 0.5, p: 0.2 }}>{showReplyForm ? '취소' : '답글'}</Button>}
                    
                    <Collapse in={showReplyForm}>
                        <CommentForm reviewId={reviewId} parentId={comment.id} token={token} onCommentCreated={handleReplyCreated} setSnackbar={setSnackbar}/>
                    </Collapse>

                    {comment.children?.length > 0 && (
                        <Box sx={{ mt: 1, pl: 2, borderLeft: '2px solid #eee' }}>
                            {comment.children.map((childComment) => (
                                <Comment key={childComment.id} comment={childComment} reviewId={reviewId} token={token} currentUser={currentUser} onCommentDeleted={onCommentDeleted} onReplyCreated={onReplyCreated} setSnackbar={setSnackbar}/>
                            ))}
                        </Box>
                    )}
                </Box>
            </Box>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleOpenDeleteDialog} sx={{color: 'error.main'}}>삭제</MenuItem>
            </Menu>
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>댓글 삭제</DialogTitle>
                <DialogContent><DialogContentText>정말로 이 댓글을 삭제하시겠습니까?</DialogContentText></DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>취소</Button>
                    <Button onClick={handleDelete} color="error">삭제</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Comment;