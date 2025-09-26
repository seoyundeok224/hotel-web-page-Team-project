package kr.or.hotelpms.hotel.controller;

import kr.or.hotelpms.hotel.dto.ApiResponse;
import kr.or.hotelpms.hotel.dto.PaymentCompleteRequest;
import kr.or.hotelpms.hotel.dto.PaymentResponse;
import kr.or.hotelpms.hotel.dto.PaymentVerificationRequest;
import kr.or.hotelpms.hotel.model.Payment;
import kr.or.hotelpms.hotel.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

/**
 * 결제 관련 컨트롤러
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class PaymentController {
    
    private final PaymentService paymentService;
    
    /**
     * 결제 검증
     */
    @PostMapping("/payments/verify")
    public ResponseEntity<ApiResponse<PaymentResponse>> verifyPayment(
            @Valid @RequestBody PaymentVerificationRequest request) {
        
        try {
            log.info("결제 검증 요청: impUid={}, merchantUid={}", 
                    request.getImp_uid(), request.getMerchant_uid());
            
            PaymentResponse response = paymentService.verifyPayment(request);
            
            if (response.isSuccess()) {
                return ResponseEntity.ok(ApiResponse.success(response, "결제 검증 성공"));
            } else {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error(response.getMessage()));
            }
            
        } catch (Exception e) {
            log.error("결제 검증 중 오류 발생", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("결제 검증 중 오류가 발생했습니다."));
        }
    }
    
    /**
     * 결제 완료 처리
     */
    @PostMapping("/reservations/payment-complete")
    public ResponseEntity<ApiResponse<PaymentResponse>> completePayment(
            @Valid @RequestBody PaymentCompleteRequest request) {
        
        try {
            log.info("결제 완료 처리 요청: reservationId={}, impUid={}", 
                    request.getReservationId(), request.getImpUid());
            
            PaymentResponse response = paymentService.completePayment(request);
            
            if (response.isSuccess()) {
                return ResponseEntity.ok(ApiResponse.success(response, "결제 완료 처리 성공"));
            } else {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error(response.getMessage()));
            }
            
        } catch (Exception e) {
            log.error("결제 완료 처리 중 오류 발생", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("결제 완료 처리 중 오류가 발생했습니다."));
        }
    }
    
    /**
     * 결제 실패로 인한 예약 취소
     */
    @PostMapping("/reservations/{reservationId}/cancel-payment-failure")
    public ResponseEntity<ApiResponse<Void>> cancelReservationOnPaymentFailure(
            @PathVariable Long reservationId) {
        
        try {
            log.info("결제 실패로 인한 예약 취소 요청: reservationId={}", reservationId);
            
            paymentService.cancelReservationOnPaymentFailure(reservationId);
            
            return ResponseEntity.ok(ApiResponse.success(null, "예약 취소 처리 완료"));
            
        } catch (Exception e) {
            log.error("예약 취소 처리 중 오류 발생: reservationId={}", reservationId, e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("예약 취소 처리 중 오류가 발생했습니다."));
        }
    }
    
    /**
     * 결제 취소/환불
     */
    @PostMapping("/payments/{paymentId}/cancel")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PaymentResponse>> cancelPayment(
            @PathVariable Long paymentId,
            @RequestParam String reason) {
        
        try {
            log.info("결제 취소 요청: paymentId={}, reason={}", paymentId, reason);
            
            PaymentResponse response = paymentService.cancelPayment(paymentId, reason);
            
            if (response.isSuccess()) {
                return ResponseEntity.ok(ApiResponse.success(response, "결제 취소 성공"));
            } else {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error(response.getMessage()));
            }
            
        } catch (Exception e) {
            log.error("결제 취소 중 오류 발생: paymentId={}", paymentId, e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("결제 취소 중 오류가 발생했습니다."));
        }
    }
    
    /**
     * 사용자의 결제 내역 조회
     */
    @GetMapping("/payments/user/{userId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<Payment>>> getUserPayments(
            @PathVariable Long userId) {
        
        try {
            log.info("사용자 결제 내역 조회: userId={}", userId);
            
            List<Payment> payments = paymentService.getUserPayments(userId);
            
            return ResponseEntity.ok(ApiResponse.success(payments, "결제 내역 조회 성공"));
            
        } catch (Exception e) {
            log.error("결제 내역 조회 중 오류 발생: userId={}", userId, e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("결제 내역 조회 중 오류가 발생했습니다."));
        }
    }
    
    /**
     * 결제 정보 상세 조회
     */
    @GetMapping("/payments/{paymentId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Payment>> getPayment(
            @PathVariable Long paymentId) {
        
        try {
            log.info("결제 정보 조회: paymentId={}", paymentId);
            
            Optional<Payment> payment = paymentService.getPaymentById(paymentId);
            
            if (payment.isPresent()) {
                return ResponseEntity.ok(ApiResponse.success(payment.get(), "결제 정보 조회 성공"));
            } else {
                return ResponseEntity.notFound().build();
            }
            
        } catch (Exception e) {
            log.error("결제 정보 조회 중 오류 발생: paymentId={}", paymentId, e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("결제 정보 조회 중 오류가 발생했습니다."));
        }
    }
    
    /**
     * 예약의 결제 정보 조회
     */
    @GetMapping("/payments/reservation/{reservationId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<Payment>>> getPaymentsByReservation(
            @PathVariable Long reservationId) {
        
        try {
            log.info("예약 결제 정보 조회: reservationId={}", reservationId);
            
            List<Payment> payments = paymentService.getPaymentsByReservation(reservationId);
            
            return ResponseEntity.ok(ApiResponse.success(payments, "예약 결제 정보 조회 성공"));
            
        } catch (Exception e) {
            log.error("예약 결제 정보 조회 중 오류 발생: reservationId={}", reservationId, e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("예약 결제 정보 조회 중 오류가 발생했습니다."));
        }
    }
    
    /**
     * PortOne 웹훅 처리
     * 결제 상태 변경 시 PortOne에서 호출하는 콜백
     */
    @PostMapping("/payments/webhook")
    public ResponseEntity<String> handleWebhook(@RequestBody String payload) {
        
        try {
            log.info("PortOne 웹훅 수신: {}", payload);
            
            // 웹훅 데이터 파싱 및 처리 로직
            // 실제 구현에서는 웹훅 서명 검증 등의 보안 처리가 필요
            
            return ResponseEntity.ok("OK");
            
        } catch (Exception e) {
            log.error("웹훅 처리 중 오류 발생", e);
            return ResponseEntity.internalServerError().body("ERROR");
        }
    }
}