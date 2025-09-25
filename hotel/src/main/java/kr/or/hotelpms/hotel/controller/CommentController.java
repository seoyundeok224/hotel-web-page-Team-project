package kr.or.hotelpms.hotel.controller;

import kr.or.hotelpms.hotel.model.Comment;
import kr.or.hotelpms.hotel.service.CommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews/{reviewId}/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping
    public List<Comment> getComments(@PathVariable Long reviewId) {
        return commentService.getCommentsByReviewId(reviewId);
    }

    @PostMapping
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
}