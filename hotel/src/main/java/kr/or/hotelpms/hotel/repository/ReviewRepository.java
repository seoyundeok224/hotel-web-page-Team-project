package kr.or.hotelpms.hotel.repository;

import kr.or.hotelpms.hotel.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    // 기본 CRUD 제공됨
}