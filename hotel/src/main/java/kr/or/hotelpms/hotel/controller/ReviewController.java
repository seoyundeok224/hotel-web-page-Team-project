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
    public Page<ReviewDto> getReviews(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
            @AuthenticationPrincipal UserDetails userDetails) {
        return reviewService.getAllReviews(pageable, userDetails);
    }

    @PostMapping
    public ResponseEntity<ReviewDto> createReview(@RequestBody ReviewDto reviewDto,
                                          @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        Review review = new Review();
        review.setUsername(userDetails.getUsername());
        review.setContent(reviewDto.getContent());
        review.setRating(reviewDto.getRating());
        
        ReviewDto savedReviewDto = reviewService.createReviewAndGetDto(review);
        return ResponseEntity.ok(savedReviewDto);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ReviewDto> updateReview(@PathVariable Long id, @RequestBody ReviewDto reviewDto,
                                          @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }

        Review review = reviewService.findById(id);
        if (!review.getUsername().equals(userDetails.getUsername())) {
            return ResponseEntity.status(403).build();
        }

        ReviewDto updatedReviewDto = reviewService.updateReviewAndGetDto(id, reviewDto.getContent(), reviewDto.getRating(), userDetails);
        return ResponseEntity.ok(updatedReviewDto);
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
    public ResponseEntity<ReviewDto> likeReview(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        ReviewDto responseDto = reviewService.toggleLikeAndGetDto(id, userDetails.getUsername());
        return ResponseEntity.ok(responseDto);
    }
}