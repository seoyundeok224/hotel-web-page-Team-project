package kr.or.hotelpms.hotel.repository;

import kr.or.hotelpms.hotel.model.Payment;
import kr.or.hotelpms.hotel.model.Reservation;
import kr.or.hotelpms.hotel.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 결제 정보 리포지토리
 */
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    /**
     * PortOne 거래 고유번호로 결제 조회
     */
    Optional<Payment> findByImpUid(String impUid);
    
    /**
     * 가맹점 주문번호로 결제 조회
     */
    Optional<Payment> findByMerchantUid(String merchantUid);
    
    /**
     * 예약 ID로 결제 목록 조회
     */
    List<Payment> findByReservation(Reservation reservation);
    
    /**
     * 사용자의 결제 목록 조회 (최신순)
     */
    List<Payment> findByUserOrderByCreatedAtDesc(User user);
    
    /**
     * 결제 상태별 조회
     */
    List<Payment> findByStatus(Payment.PaymentStatus status);
    
    /**
     * 특정 기간 내 결제 조회
     */
    @Query("SELECT p FROM Payment p WHERE p.createdAt BETWEEN :startDate AND :endDate")
    List<Payment> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, 
                                        @Param("endDate") LocalDateTime endDate);
    
    /**
     * 사용자와 상태별 결제 조회
     */
    List<Payment> findByUserAndStatus(User user, Payment.PaymentStatus status);
    
    /**
     * 예약의 완료된 결제 조회
     */
    @Query("SELECT p FROM Payment p WHERE p.reservation = :reservation AND p.status = 'COMPLETED'")
    Optional<Payment> findCompletedPaymentByReservation(@Param("reservation") Reservation reservation);
    
    /**
     * 결제 방법별 통계 조회
     */
    @Query("SELECT p.payMethod, COUNT(p) FROM Payment p WHERE p.status = 'COMPLETED' GROUP BY p.payMethod")
    List<Object[]> getPaymentMethodStats();
    
    /**
     * 월별 결제 금액 통계
     */
    @Query("SELECT YEAR(p.createdAt), MONTH(p.createdAt), SUM(p.amount) " +
           "FROM Payment p WHERE p.status = 'COMPLETED' " +
           "GROUP BY YEAR(p.createdAt), MONTH(p.createdAt) " +
           "ORDER BY YEAR(p.createdAt) DESC, MONTH(p.createdAt) DESC")
    List<Object[]> getMonthlyPaymentStats();
}