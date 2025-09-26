package kr.or.hotelpms.hotel.repository;

import kr.or.hotelpms.hotel.model.ReviewLike;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ReviewLikeRepository extends JpaRepository<ReviewLike, Long> {
    Optional<ReviewLike> findByReviewIdAndUsername(Long reviewId, String username);
}