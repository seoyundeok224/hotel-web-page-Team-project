package kr.or.hotelpms.hotel.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

/**
 * PortOne 결제 검증 요청 DTO
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentVerificationRequest {
    
    /**
     * PortOne 거래 고유번호
     */
    private String imp_uid;
    
    /**
     * 가맹점 주문번호
     */
    private String merchant_uid;
}