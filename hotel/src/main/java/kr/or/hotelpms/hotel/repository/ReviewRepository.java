package kr.or.hotelpms.hotel.repository;

import kr.or.hotelpms.hotel.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    Optional<Review> findFirstByOrderByCreatedAtAsc();
}