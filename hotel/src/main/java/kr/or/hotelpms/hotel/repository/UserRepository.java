package kr.or.hotelpms.hotel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import kr.or.hotelpms.hotel.model.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // 사용자명으로 사용자 찾기
    Optional<User> findByUsername(String username);
    
    // 이메일로 사용자 찾기
    Optional<User> findByEmail(String email);
    
    // 사용자명 존재 여부 확인
    boolean existsByUsername(String username);
    
    // 이메일 존재 여부 확인
    boolean existsByEmail(String email);
    
    // 활성화된 사용자 찾기
    Optional<User> findByUsernameAndEnabled(String username, Boolean enabled);

    // 이메일 + 이름으로 사용자 찾기 (아이디 찾기용)
    Optional<User> findByEmailAndName(String email, String name);
    
    // 탈퇴 후 3일 지난 사용자 찾기 (삭제 대상)
    @Query("SELECT u FROM User u WHERE u.enabled = false AND u.deletedAt IS NOT NULL AND u.deletedAt <= :cutoffDate")
    List<User> findUsersToDelete(@Param("cutoffDate") LocalDateTime cutoffDate);
}