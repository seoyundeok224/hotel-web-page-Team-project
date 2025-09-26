package kr.or.hotelpms.hotel.service;

import jakarta.persistence.EntityNotFoundException;
import kr.or.hotelpms.hotel.model.Review;
import kr.or.hotelpms.hotel.model.ReviewLike; // 추가
import kr.or.hotelpms.hotel.repository.ReviewLikeRepository; // 추가
import kr.or.hotelpms.hotel.repository.ReviewRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional; // 추가

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewLikeRepository reviewLikeRepository; // 추가
    private static final int MAX_REVIEWS = 100;

    // [수정] 생성자에서 ReviewLikeRepository 주입
    public ReviewService(ReviewRepository reviewRepository, ReviewLikeRepository reviewLikeRepository) {
        this.reviewRepository = reviewRepository;
        this.reviewLikeRepository = reviewLikeRepository;
    }

    public Page<Review> getAllReviews(Pageable pageable) {
        return reviewRepository.findAll(pageable);
    }

    @Transactional
    public Review saveReview(Review review) {
        Review savedReview = reviewRepository.save(review);
        long totalReviews = reviewRepository.count();
        if (totalReviews > MAX_REVIEWS) {
            reviewRepository.findFirstByOrderByCreatedAtAsc()
                    .ifPresent(reviewRepository::delete);
        }
        return savedReview;
    }
    
    @Transactional
    public Review updateReview(Long id, String content, int rating) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Review not found with id: " + id));
        review.setContent(content);
        review.setRating(rating);
        return review;
    }
    
    public void deleteReview(Long id) {
        if (!reviewRepository.existsById(id)) {
            throw new EntityNotFoundException("Review not found with id: " + id);
        }
        reviewRepository.deleteById(id);
    }

    // [수정] '좋아요' 로직 전체 변경
    @Transactional
    public Review toggleLike(Long reviewId, String username) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new EntityNotFoundException("Review not found with id: " + reviewId));

        Optional<ReviewLike> existingLike = reviewLikeRepository.findByReviewIdAndUsername(reviewId, username);

        if (existingLike.isPresent()) {
            reviewLikeRepository.delete(existingLike.get());
            review.setLikeCount(review.getLikeCount() - 1);
        } else {
            reviewLikeRepository.save(new ReviewLike(review, username));
            review.setLikeCount(review.getLikeCount() + 1);
        }
        return review;
    }
    
    public Review findById(Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Review not found with id: " + id));
    }
}