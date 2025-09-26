package kr.or.hotelpms.hotel.service;

import jakarta.persistence.EntityNotFoundException;
import kr.or.hotelpms.hotel.dto.ReviewDto;
import kr.or.hotelpms.hotel.model.Review;
import kr.or.hotelpms.hotel.model.ReviewLike;
import kr.or.hotelpms.hotel.repository.ReviewLikeRepository;
import kr.or.hotelpms.hotel.repository.ReviewRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewLikeRepository reviewLikeRepository;
    private static final int MAX_REVIEWS = 100;

    public ReviewService(ReviewRepository reviewRepository, ReviewLikeRepository reviewLikeRepository) {
        this.reviewRepository = reviewRepository;
        this.reviewLikeRepository = reviewLikeRepository;
    }

    @Transactional(readOnly = true)
    public Page<ReviewDto> getAllReviews(Pageable pageable, UserDetails currentUser) {
        Page<Review> reviewsPage = reviewRepository.findAll(pageable);
        Set<Long> likedReviewIds = Collections.emptySet();

        if (currentUser != null) {
            List<Long> reviewIds = reviewsPage.getContent().stream()
                    .map(Review::getId)
                    .collect(Collectors.toList());

            if (!reviewIds.isEmpty()) {
                likedReviewIds = reviewLikeRepository.findByReviewIdInAndUsername(reviewIds, currentUser.getUsername())
                        .stream()
                        .map(like -> like.getReview().getId())
                        .collect(Collectors.toSet());
            }
        }

        final Set<Long> finalLikedReviewIds = likedReviewIds;
        return reviewsPage.map(review -> new ReviewDto(review, finalLikedReviewIds.contains(review.getId())));
    }

    private Review saveReview(Review review) {
        Review savedReview = reviewRepository.save(review);
        long totalReviews = reviewRepository.count();
        if (totalReviews > MAX_REVIEWS) {
            reviewRepository.findFirstByOrderByCreatedAtAsc()
                    .ifPresent(reviewRepository::delete);
        }
        return savedReview;
    }

    public ReviewDto createReviewAndGetDto(Review review) {
        Review savedReview = this.saveReview(review);
        return new ReviewDto(savedReview, false);
    }

    public ReviewDto updateReviewAndGetDto(Long id, String content, int rating, UserDetails userDetails) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Review not found with id: " + id));
        review.setContent(content);
        review.setRating(rating);
        boolean isLiked = reviewLikeRepository.findByReviewIdAndUsername(id, userDetails.getUsername()).isPresent();
        return new ReviewDto(review, isLiked);
    }

    public void deleteReview(Long id) {
        if (!reviewRepository.existsById(id)) {
            throw new EntityNotFoundException("Review not found with id: " + id);
        }
        reviewRepository.deleteById(id);
    }

    private Review toggleLikeInternal(Long reviewId, String username) {
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

    public ReviewDto toggleLikeAndGetDto(Long reviewId, String username) {
        Review updatedReview = this.toggleLikeInternal(reviewId, username);
        boolean isLikedNow = reviewLikeRepository.findByReviewIdAndUsername(reviewId, username).isPresent();
        return new ReviewDto(updatedReview, isLikedNow);
    }

    public Review findById(Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Review not found with id: " + id));
    }
}