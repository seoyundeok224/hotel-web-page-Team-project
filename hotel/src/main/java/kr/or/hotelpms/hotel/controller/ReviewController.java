package kr.or.hotelpms.hotel.controller;

import kr.or.hotelpms.hotel.dto.ReviewDto;
import kr.or.hotelpms.hotel.model.Review;
import kr.or.hotelpms.hotel.service.ReviewService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // 후기 전체 조회 (로그인 여부 무관)
    @GetMapping
    public List<Review> getReviews() {
        return reviewService.getAllReviews();
    }

    // 후기 작성 (로그인한 사용자만 가능)
    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody ReviewDto reviewDto,
                                          @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        Review review = new Review();
        review.setUsername(userDetails.getUsername());
        review.setContent(reviewDto.getContent());

        Review savedReview = reviewService.saveReview(review);
        return ResponseEntity.ok(savedReview);
    }
}