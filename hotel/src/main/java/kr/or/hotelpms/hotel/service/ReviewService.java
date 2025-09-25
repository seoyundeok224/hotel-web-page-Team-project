package kr.or.hotelpms.hotel.service;

import jakarta.persistence.EntityNotFoundException;
import kr.or.hotelpms.hotel.model.Review;
import kr.or.hotelpms.hotel.repository.ReviewRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private static final int MAX_REVIEWS = 100;

    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
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

    // [수정] 생략되었던 내용 채우기
    @Transactional
    public Review updateReview(Long id, String content, int rating) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Review not found with id: " + id));
        review.setContent(content);
        review.setRating(rating);
        return review;
    }

    // [수정] 생략되었던 내용 채우기
    public void deleteReview(Long id) {
        if (!reviewRepository.existsById(id)) {
            throw new EntityNotFoundException("Review not found with id: " + id);
        }
        reviewRepository.deleteById(id);
    }

    // [수정] 생략되었던 내용 채우기
    @Transactional
    public Review likeReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Review not found with id: " + id));
        review.setLikeCount(review.getLikeCount() + 1);
        return review;
    }

    // [수정] 생략되었던 내용 채우기
    public Review findById(Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Review not found with id: " + id));
    }
}