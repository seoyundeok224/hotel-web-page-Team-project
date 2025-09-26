package kr.or.hotelpms.hotel.service;

import jakarta.persistence.EntityNotFoundException;
import kr.or.hotelpms.hotel.exception.AuthorizationException;
import kr.or.hotelpms.hotel.model.Comment;
import kr.or.hotelpms.hotel.model.Review;
import kr.or.hotelpms.hotel.repository.CommentRepository;
import kr.or.hotelpms.hotel.repository.ReviewRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class CommentService {
    private final CommentRepository commentRepository;
    private final ReviewRepository reviewRepository;

    public CommentService(CommentRepository commentRepository, ReviewRepository reviewRepository) {
        this.commentRepository = commentRepository;
        this.reviewRepository = reviewRepository;
    }

    @Transactional(readOnly = true)
    public List<Comment> getCommentsByReviewId(Long reviewId) {
        // ... (이전과 동일)
        List<Comment> allComments = commentRepository.findByReviewIdOrderByCreatedAtAsc(reviewId);
        Map<Long, Comment> commentMap = new HashMap<>();
        allComments.forEach(comment -> {
            comment.setChildren(new ArrayList<>());
            commentMap.put(comment.getId(), comment);
        });
        allComments.forEach(comment -> {
            if (comment.getParent() != null) {
                Comment parent = commentMap.get(comment.getParent().getId());
                if (parent != null) {
                    parent.getChildren().add(comment);
                }
            }
        });
        List<Comment> rootComments = new ArrayList<>();
        allComments.forEach(comment -> {
            if(comment.getParent() == null) {
                rootComments.add(comment);
            }
        });
        return rootComments;
    }

    public Comment createComment(Long reviewId, Long parentId, String content, String username) {
        // ... (이전과 동일)
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new EntityNotFoundException("Review not found"));
        Comment comment = new Comment();
        comment.setReview(review);
        comment.setContent(content);
        comment.setUsername(username);
        if (parentId != null) {
            Comment parentComment = commentRepository.findById(parentId)
                    .orElseThrow(() -> new EntityNotFoundException("Parent comment not found"));
            comment.setParent(parentComment);
        }
        return commentRepository.save(comment);
    }

    // [추가된 삭제 메서드]
    public void deleteComment(Long commentId, UserDetails userDetails) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found with id: " + commentId));

        if (!comment.getUsername().equals(userDetails.getUsername())) {
            throw new AuthorizationException("You do not have permission to delete this comment.");
        }
        commentRepository.delete(comment);
    }
}