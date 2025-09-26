package kr.or.hotelpms.hotel.controller;

import kr.or.hotelpms.hotel.exception.AuthorizationException;
import kr.or.hotelpms.hotel.model.Comment;
import kr.or.hotelpms.hotel.service.CommentService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/review/{reviewId}")
    public List<Comment> getComments(@PathVariable Long reviewId) {
        return commentService.getCommentsByReviewId(reviewId);
    }

    @PostMapping("/review/{reviewId}")
    public ResponseEntity<?> createComment(@PathVariable Long reviewId,
                                           @RequestBody Map<String, Object> payload,
                                           @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }
        String content = (String) payload.get("content");
        Long parentId = payload.get("parentId") != null ? Long.valueOf(payload.get("parentId").toString()) : null;

        Comment createdComment = commentService.createComment(reviewId, parentId, content, userDetails.getUsername());
        return ResponseEntity.ok(createdComment);
    }

    // [추가된 삭제 엔드포인트]
    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId,
                                           @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }
        try {
            commentService.deleteComment(commentId, userDetails);
            return ResponseEntity.ok().body("Comment deleted successfully.");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (AuthorizationException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }
}