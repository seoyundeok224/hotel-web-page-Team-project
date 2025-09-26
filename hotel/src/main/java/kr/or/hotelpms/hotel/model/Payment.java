package kr.or.hotelpms.hotel.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * 결제 정보 엔티티
 */
@Entity
@Table(name = "payments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
@EntityListeners(AuditingEntityListener.class)
public class Payment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * 연관된 예약
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;
    
    /**
     * 결제한 사용자
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    /**
     * PortOne 거래 고유번호
     */
    @Column(name = "imp_uid", unique = true, nullable = false)
    private String impUid;
    
    /**
     * 가맹점 주문번호
     */
    @Column(name = "merchant_uid", unique = true, nullable = false)
    private String merchantUid;
    
    /**
     * 결제 금액
     */
    @Column(name = "amount", nullable = false)
    private Integer amount;
    
    /**
     * 결제 상태
     * PENDING: 결제 대기
     * COMPLETED: 결제 완료
     * FAILED: 결제 실패
     * CANCELLED: 결제 취소
     * REFUNDED: 환불 완료
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private PaymentStatus status;
    
    /**
     * 결제 방법
     * card: 신용카드
     * trans: 실시간 계좌이체
     * kakaopay: 카카오페이
     */
    @Column(name = "pay_method")
    private String payMethod;
    
    /**
     * PG사
     */
    @Column(name = "pg_provider")
    private String pgProvider;
    
    /**
     * 결제 승인 번호
     */
    @Column(name = "apply_num")
    private String applyNum;
    
    /**
     * 카드 번호 (마스킹)
     */
    @Column(name = "card_number")
    private String cardNumber;
    
    /**
     * 카드 이름
     */
    @Column(name = "card_name")
    private String cardName;
    
    /**
     * 결제 실패 사유
     */
    @Column(name = "fail_reason")
    private String failReason;
    
    /**
     * 환불 금액
     */
    @Column(name = "cancel_amount", columnDefinition = "integer default 0")
    @Builder.Default
    private Integer cancelAmount = 0;
    
    /**
     * 환불 사유
     */
    @Column(name = "cancel_reason")
    private String cancelReason;
    
    /**
     * 환불 일시
     */
    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;
    
    /**
     * 생성일시
     */
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    /**
     * 수정일시
     */
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    /**
     * 결제 상태 열거형
     */
    public enum PaymentStatus {
        PENDING("결제 대기"),
        COMPLETED("결제 완료"),
        FAILED("결제 실패"), 
        CANCELLED("결제 취소"),
        REFUNDED("환불 완료");
        
        private final String description;
        
        PaymentStatus(String description) {
            this.description = description;
        }
        
        public String getDescription() {
            return description;
        }
    }
}