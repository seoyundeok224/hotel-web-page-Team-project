package kr.or.hotelpms.hotel.service;

import kr.or.hotelpms.hotel.dto.PaymentCompleteRequest;
import kr.or.hotelpms.hotel.dto.PaymentResponse;
import kr.or.hotelpms.hotel.dto.PaymentVerificationRequest;
import kr.or.hotelpms.hotel.model.Payment;
import kr.or.hotelpms.hotel.model.Reservation;
import kr.or.hotelpms.hotel.model.User;
import kr.or.hotelpms.hotel.repository.PaymentRepository;
import kr.or.hotelpms.hotel.repository.ReservationRepository;
import kr.or.hotelpms.hotel.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * 결제 서비스
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PaymentService {
    
    private final PaymentRepository paymentRepository;
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    // PortOne API 설정
    @Value("${portone.api-key:}")
    private String portoneApiKey;
    
    @Value("${portone.api-secret:}")
    private String portoneApiSecret;
    
    @Value("${portone.imp-code:imp10391932}")
    private String impCode;
    
    private static final String PORTONE_API_URL = "https://api.iamport.kr";
    
    /**
     * PortOne 액세스 토큰 발급
     */
    private String getPortOneAccessToken() {
        try {
            String url = PORTONE_API_URL + "/users/getToken";
            
            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("imp_key", portoneApiKey);
            requestBody.put("imp_secret", portoneApiSecret);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            
            if (response.getStatusCode() == HttpStatus.OK) {
                JsonNode jsonNode = objectMapper.readTree(response.getBody());
                return jsonNode.path("response").path("access_token").asText();
            }
            
            throw new RuntimeException("PortOne 액세스 토큰 발급 실패");
            
        } catch (Exception e) {
            log.error("PortOne 액세스 토큰 발급 실패", e);
            throw new RuntimeException("PortOne 액세스 토큰 발급 실패: " + e.getMessage());
        }
    }
    
    /**
     * PortOne 결제 정보 조회
     */
    private JsonNode getPortOnePaymentInfo(String impUid) {
        try {
            String accessToken = getPortOneAccessToken();
            String url = PORTONE_API_URL + "/payments/" + impUid;
            
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            
            HttpEntity<Void> request = new HttpEntity<>(headers);
            
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, request, String.class);
            
            if (response.getStatusCode() == HttpStatus.OK) {
                JsonNode jsonNode = objectMapper.readTree(response.getBody());
                return jsonNode.path("response");
            }
            
            throw new RuntimeException("PortOne 결제 정보 조회 실패");
            
        } catch (Exception e) {
            log.error("PortOne 결제 정보 조회 실패: impUid={}", impUid, e);
            throw new RuntimeException("PortOne 결제 정보 조회 실패: " + e.getMessage());
        }
    }
    
    /**
     * 결제 검증
     */
    public PaymentResponse verifyPayment(PaymentVerificationRequest request) {
        try {
            log.info("결제 검증 시작: impUid={}, merchantUid={}", request.getImp_uid(), request.getMerchant_uid());
            
            // PortOne에서 결제 정보 조회
            JsonNode paymentInfo = getPortOnePaymentInfo(request.getImp_uid());
            
            String status = paymentInfo.path("status").asText();
            int amount = paymentInfo.path("amount").asInt();
            String merchantUid = paymentInfo.path("merchant_uid").asText();
            
            // 주문번호 검증
            if (!merchantUid.equals(request.getMerchant_uid())) {
                throw new RuntimeException("주문번호가 일치하지 않습니다.");
            }
            
            // 결제 상태 확인
            if (!"paid".equals(status)) {
                throw new RuntimeException("결제가 완료되지 않았습니다: " + status);
            }
            
            return PaymentResponse.builder()
                    .success(true)
                    .impUid(request.getImp_uid())
                    .merchantUid(merchantUid)
                    .amount(amount)
                    .status(status)
                    .message("결제 검증 성공")
                    .build();
                    
        } catch (Exception e) {
            log.error("결제 검증 실패", e);
            return PaymentResponse.builder()
                    .success(false)
                    .message("결제 검증 실패: " + e.getMessage())
                    .build();
        }
    }
    
    /**
     * 결제 완료 처리
     */
    public PaymentResponse completePayment(PaymentCompleteRequest request) {
        try {
            log.info("결제 완료 처리 시작: reservationId={}, impUid={}", 
                    request.getReservationId(), request.getImpUid());
            
            // 예약 정보 조회
            Reservation reservation = reservationRepository.findById(request.getReservationId())
                    .orElseThrow(() -> new RuntimeException("예약을 찾을 수 없습니다."));
            
            // 이미 결제된 예약인지 확인
            Optional<Payment> existingPayment = paymentRepository.findByMerchantUid(request.getMerchantUid());
            if (existingPayment.isPresent()) {
                throw new RuntimeException("이미 처리된 결제입니다.");
            }
            
            // PortOne에서 최종 검증
            JsonNode paymentInfo = getPortOnePaymentInfo(request.getImpUid());
            
            String status = paymentInfo.path("status").asText();
            int verifiedAmount = paymentInfo.path("amount").asInt();
            
            if (!"paid".equals(status)) {
                throw new RuntimeException("결제가 완료되지 않았습니다: " + status);
            }
            
            if (verifiedAmount != request.getPaidAmount()) {
                throw new RuntimeException("결제 금액이 일치하지 않습니다.");
            }
            
            // 결제 정보 저장
            Payment payment = Payment.builder()
                    .reservation(reservation)
                    .user(reservation.getUser())
                    .impUid(request.getImpUid())
                    .merchantUid(request.getMerchantUid())
                    .amount(request.getPaidAmount())
                    .status(Payment.PaymentStatus.COMPLETED)
                    .payMethod(request.getPayMethod())
                    .pgProvider(request.getPgProvider())
                    .applyNum(paymentInfo.path("apply_num").asText())
                    .cardNumber(paymentInfo.path("card_number").asText())
                    .cardName(paymentInfo.path("card_name").asText())
                    .build();
            
            Payment savedPayment = paymentRepository.save(payment);
            
            // 예약 상태를 결제 완료로 변경
            reservation.setStatus("PAID");
            reservationRepository.save(reservation);
            
            log.info("결제 완료 처리 성공: paymentId={}", savedPayment.getId());
            
            return PaymentResponse.builder()
                    .success(true)
                    .paymentId(savedPayment.getId())
                    .impUid(request.getImpUid())
                    .merchantUid(request.getMerchantUid())
                    .amount(request.getPaidAmount())
                    .status("COMPLETED")
                    .payMethod(request.getPayMethod())
                    .pgProvider(request.getPgProvider())
                    .message("결제가 성공적으로 완료되었습니다.")
                    .build();
                    
        } catch (Exception e) {
            log.error("결제 완료 처리 실패", e);
            return PaymentResponse.builder()
                    .success(false)
                    .message("결제 완료 처리 실패: " + e.getMessage())
                    .build();
        }
    }
    
    /**
     * 결제 실패로 인한 예약 취소
     */
    public void cancelReservationOnPaymentFailure(Long reservationId) {
        try {
            log.info("결제 실패로 인한 예약 취소 처리: reservationId={}", reservationId);
            
            Reservation reservation = reservationRepository.findById(reservationId)
                    .orElseThrow(() -> new RuntimeException("예약을 찾을 수 없습니다."));
            
            // 예약 상태를 취소로 변경
            reservation.setStatus("CANCELLED");
            reservationRepository.save(reservation);
            
            log.info("예약 취소 완료: reservationId={}", reservationId);
            
        } catch (Exception e) {
            log.error("예약 취소 처리 실패: reservationId={}", reservationId, e);
            throw new RuntimeException("예약 취소 처리 실패: " + e.getMessage());
        }
    }
    
    /**
     * 결제 취소/환불
     */
    public PaymentResponse cancelPayment(Long paymentId, String reason) {
        try {
            Payment payment = paymentRepository.findById(paymentId)
                    .orElseThrow(() -> new RuntimeException("결제 정보를 찾을 수 없습니다."));
            
            if (payment.getStatus() != Payment.PaymentStatus.COMPLETED) {
                throw new RuntimeException("완료된 결제만 취소할 수 있습니다.");
            }
            
            // PortOne API로 결제 취소 요청
            String accessToken = getPortOneAccessToken();
            String url = PORTONE_API_URL + "/payments/cancel";
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("imp_uid", payment.getImpUid());
            requestBody.put("reason", reason);
            requestBody.put("amount", payment.getAmount());
            
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            
            if (response.getStatusCode() == HttpStatus.OK) {
                JsonNode jsonNode = objectMapper.readTree(response.getBody());
                JsonNode cancelResponse = jsonNode.path("response");
                
                // 결제 상태 업데이트
                payment.setStatus(Payment.PaymentStatus.CANCELLED);
                payment.setCancelAmount(payment.getAmount());
                payment.setCancelReason(reason);
                payment.setCancelledAt(LocalDateTime.now());
                
                paymentRepository.save(payment);
                
                // 예약 상태도 취소로 변경
                Reservation reservation = payment.getReservation();
                reservation.setStatus("CANCELLED");
                reservationRepository.save(reservation);
                
                return PaymentResponse.builder()
                        .success(true)
                        .paymentId(payment.getId())
                        .status("CANCELLED")
                        .message("결제가 성공적으로 취소되었습니다.")
                        .build();
            }
            
            throw new RuntimeException("결제 취소 API 호출 실패");
            
        } catch (Exception e) {
            log.error("결제 취소 실패: paymentId={}", paymentId, e);
            return PaymentResponse.builder()
                    .success(false)
                    .message("결제 취소 실패: " + e.getMessage())
                    .build();
        }
    }
    
    /**
     * 사용자의 결제 내역 조회
     */
    @Transactional(readOnly = true)
    public List<Payment> getUserPayments(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        return paymentRepository.findByUserOrderByCreatedAtDesc(user);
    }
    
    /**
     * 결제 정보 조회
     */
    @Transactional(readOnly = true)
    public Optional<Payment> getPaymentById(Long paymentId) {
        return paymentRepository.findById(paymentId);
    }
    
    /**
     * 예약의 결제 정보 조회
     */
    @Transactional(readOnly = true)
    public List<Payment> getPaymentsByReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("예약을 찾을 수 없습니다."));
        
        return paymentRepository.findByReservation(reservation);
    }
}