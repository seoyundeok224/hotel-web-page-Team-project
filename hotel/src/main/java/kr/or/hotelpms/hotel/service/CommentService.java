package kr.or.hotelpms.hotel.service;

import jakarta.persistence.EntityNotFoundException;
import kr.or.hotelpms.hotel.model.Comment;
import kr.or.hotelpms.hotel.model.Review;
import kr.or.hotelpms.hotel.repository.CommentRepository;
import kr.or.hotelpms.hotel.repository.ReviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CommentService {
    private final CommentRepository commentRepository;
    private final ReviewRepository reviewRepository;

    public CommentService(CommentRepository commentRepository, ReviewRepository reviewRepository) {
        this.commentRepository = commentRepository;
        this.reviewRepository = reviewRepository;
    }

    @Transactional(readOnly = true)
    public List<Comment> getCommentsByReviewId(Long reviewId) {
        // 1. 특정 후기에 달린 모든 댓글을 가져온다.
        List<Comment> allComments = commentRepository.findByReviewIdOrderByCreatedAtAsc(reviewId);
        
        // 2. 계층 구조로 조립한다.
        Map<Long, Comment> commentMap = new HashMap<>();
        List<Comment> rootComments = new ArrayList<>();

        allComments.forEach(comment -> {
            comment.setChildren(new ArrayList<>()); // 자식 리스트 초기화
            commentMap.put(comment.getId(), comment);
        });

        allComments.forEach(comment -> {
            if (comment.getParent() != null) {
                Comment parent = commentMap.get(comment.getParent().getId());
                if (parent != null) {
                    parent.getChildren().add(comment);
                }
            } else {
                rootComments.add(comment);
            }
        });

        return rootComments;
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