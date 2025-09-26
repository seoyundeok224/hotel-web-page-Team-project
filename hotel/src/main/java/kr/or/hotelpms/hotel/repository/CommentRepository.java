package kr.or.hotelpms.hotel.repository;

import kr.or.hotelpms.hotel.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    // 특정 후기의 모든 댓글을 생성 시간순으로 가져오는 메서드
    List<Comment> findByReviewIdOrderByCreatedAtAsc(Long reviewId);
}