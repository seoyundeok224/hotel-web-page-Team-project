package kr.or.hotelpms.hotel.controller;

import kr.or.hotelpms.hotel.dto.ReservationDto;
import kr.or.hotelpms.hotel.model.Reservation;
import kr.or.hotelpms.hotel.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    // 예약 등록
    @PostMapping
    public ResponseEntity<ReservationDto.ReservationResponse> createReservation(
            @RequestBody ReservationDto.ReservationRequest request
    ) {
        Reservation reservation = reservationService.createReservationByUsername(request);
        return ResponseEntity.ok(new ReservationDto.ReservationResponse(reservation));
    }

    // 유저별 예약 조회
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReservationDto.ReservationResponse>> getUserReservations(@PathVariable Long userId) {
        return ResponseEntity.ok(reservationService.getReservationsByUser(userId));
    }

    // 모든 예약 조회 (관리자용)
    @GetMapping("/admin/all")
    public ResponseEntity<List<ReservationDto.ReservationResponse>> getAllReservations() {
        return ResponseEntity.ok(reservationService.getAllReservations());
    }

    // 예약 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
        reservationService.deleteReservation(id);
        return ResponseEntity.noContent().build();
    }
}
