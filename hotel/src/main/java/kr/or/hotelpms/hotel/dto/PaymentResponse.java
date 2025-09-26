package kr.or.hotelpms.hotel.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;

/**
 * 결제 응답 DTO
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaymentResponse {
    
    /**
     * 결제 성공 여부
     */
    private boolean success;
    
    /**
     * 결제 ID
     */
    private Long paymentId;
    
    /**
     * PortOne 거래 고유번호
     */
    private String impUid;
    
    /**
     * 가맹점 주문번호
     */
    private String merchantUid;
    
    /**
     * 결제 금액
     */
    private Integer amount;
    
    /**
     * 결제 상태
     */
    private String status;
    
    /**
     * 결제 방법
     */
    private String payMethod;
    
    /**
     * PG사
     */
    private String pgProvider;
    
    /**
     * 응답 메시지
     */
    private String message;
    
    /**
     * 에러 코드 (실패시)
     */
    private String errorCode;
}