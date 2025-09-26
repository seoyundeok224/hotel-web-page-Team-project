package kr.or.hotelpms.hotel.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

/**
 * 결제 완료 처리 요청 DTO
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentCompleteRequest {
    
    /**
     * 예약 ID
     */
    private Long reservationId;
    
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
    private Integer paidAmount;
    
    /**
     * 결제 방법
     */
    private String payMethod;
    
    /**
     * PG사
     */
    private String pgProvider;
}