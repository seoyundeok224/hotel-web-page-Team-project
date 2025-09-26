package kr.or.hotelpms.hotel.repository;

import kr.or.hotelpms.hotel.model.ReviewLike;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface ReviewLikeRepository extends JpaRepository<ReviewLike, Long> {
    Optional<ReviewLike> findByReviewIdAndUsername(Long reviewId, String username);

    // [추가] 여러 리뷰에 대한 '좋아요' 상태를 한 번에 조회하기 위한 메소드
    Set<ReviewLike> findByReviewIdInAndUsername(List<Long> reviewIds, String username);
}