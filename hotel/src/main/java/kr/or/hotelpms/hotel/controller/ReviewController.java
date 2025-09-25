package kr.or.hotelpms.hotel.controller;

import kr.or.hotelpms.hotel.dto.ReviewDto;
import kr.or.hotelpms.hotel.model.Review;
import kr.or.hotelpms.hotel.service.ReviewService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public Page<Review> getReviews(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return reviewService.getAllReviews(pageable);
    }

    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody ReviewDto reviewDto,
                                          @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }
        Review review = new Review();
        review.setUsername(userDetails.getUsername());
        review.setContent(reviewDto.getContent());
        review.setRating(reviewDto.getRating());
        Review savedReview = reviewService.saveReview(review);
        return ResponseEntity.ok(savedReview);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateReview(@PathVariable Long id, @RequestBody ReviewDto reviewDto,
                                          @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) return ResponseEntity.status(401).body("로그인이 필요합니다.");

        Review review = reviewService.findById(id);
        if (!review.getUsername().equals(userDetails.getUsername())) {
            return ResponseEntity.status(403).body("수정 권한이 없습니다.");
        }

        Review updatedReview = reviewService.updateReview(id, reviewDto.getContent(), reviewDto.getRating());
        return ResponseEntity.ok(updatedReview);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) return ResponseEntity.status(401).body("로그인이 필요합니다.");

        Review review = reviewService.findById(id);
        if (!review.getUsername().equals(userDetails.getUsername())) {
            return ResponseEntity.status(403).body("삭제 권한이 없습니다.");
        }

        reviewService.deleteReview(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<?> likeReview(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }
        Review likedReview = reviewService.likeReview(id);
        return ResponseEntity.ok(likedReview);
    }
}