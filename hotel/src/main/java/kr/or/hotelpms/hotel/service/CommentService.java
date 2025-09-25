package kr.or.hotelpms.hotel.service;

import jakarta.persistence.EntityNotFoundException;
import kr.or.hotelpms.hotel.model.Comment;
import kr.or.hotelpms.hotel.model.Review;
import kr.or.hotelpms.hotel.repository.CommentRepository;
import kr.or.hotelpms.hotel.repository.ReviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class CommentService {
    private final CommentRepository commentRepository;
    private final ReviewRepository reviewRepository;

    public CommentService(CommentRepository commentRepository, ReviewRepository reviewRepository) {
        this.commentRepository = commentRepository;
        this.reviewRepository = reviewRepository;
    }

    public List<Comment> getCommentsByReviewId(Long reviewId) {
        return commentRepository.findByReviewIdAndParentIsNullOrderByCreatedAtAsc(reviewId);
    }

    @Transactional
    public Comment createComment(Long reviewId, Long parentId, String content, String username) {
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
}