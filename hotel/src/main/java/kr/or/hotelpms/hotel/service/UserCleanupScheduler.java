package kr.or.hotelpms.hotel.service;

import kr.or.hotelpms.hotel.model.User;
import kr.or.hotelpms.hotel.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserCleanupScheduler {

    private final UserRepository userRepository;

    /**
     * 매일 자정(00:00)에 실행되어 탈퇴 후 3일이 지난 사용자를 삭제합니다.
     * cron 표현식: "초 분 시 일 월 요일"
     * 0 0 0 * * * = 매일 자정
     */
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void deleteExpiredUsers() {
        log.info("탈퇴 회원 정리 작업 시작");
        
        try {
            // 3일 전 시점 계산 (현재 시간에서 3일을 뺀 시점)
            LocalDateTime cutoffDate = LocalDateTime.now().minusDays(3);
            
            // 삭제 대상 사용자 조회
            List<User> usersToDelete = userRepository.findUsersToDelete(cutoffDate);
            
            if (usersToDelete.isEmpty()) {
                log.info("삭제할 탈퇴 회원이 없습니다.");
                return;
            }
            
            log.info("삭제 대상 탈퇴 회원 수: {}", usersToDelete.size());
            
            // 사용자 정보 삭제
            for (User user : usersToDelete) {
                log.info("사용자 삭제: ID={}, 사용자명={}, 탈퇴일={}", 
                        user.getId(), user.getUsername(), user.getDeletedAt());
                userRepository.delete(user);
            }
            
            log.info("탈퇴 회원 정리 작업 완료: {}명 삭제", usersToDelete.size());
            
        } catch (Exception e) {
            log.error("탈퇴 회원 정리 작업 중 오류 발생", e);
        }
    }

    /**
     * 테스트용 메서드 - 개발 시에만 사용 (운영환경에서는 주석처리 필요)
     * 테스트를 위해 3분 전 탈퇴한 사용자를 삭제 대상으로 설정
     */
    // @Scheduled(fixedRate = 60000) // 1분(60초)마다 실행 - 테스트용이므로 주석처리
    @Transactional
    public void deleteExpiredUsersForTesting() {
        // 테스트를 위해 3분 전으로 설정 (실제로는 위의 메서드를 사용)
        LocalDateTime cutoffDate = LocalDateTime.now().minusMinutes(3);
        
        List<User> usersToDelete = userRepository.findUsersToDelete(cutoffDate);
        
        if (!usersToDelete.isEmpty()) {
            log.info("[테스트] 삭제 대상 탈퇴 회원 수: {}", usersToDelete.size());
            
            for (User user : usersToDelete) {
                log.info("[테스트] 사용자 삭제: ID={}, 사용자명={}, 탈퇴일={}", 
                        user.getId(), user.getUsername(), user.getDeletedAt());
                userRepository.delete(user);
            }
        }
    }
}