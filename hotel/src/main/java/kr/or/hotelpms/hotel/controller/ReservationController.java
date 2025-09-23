package kr.or.hotelpms.hotel.controller;

import kr.or.hotelpms.hotel.dto.ReservationDto;
import kr.or.hotelpms.hotel.model.Reservation;
import kr.or.hotelpms.hotel.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    // 예약 등록
    @PostMapping
    public ResponseEntity<ReservationDto.ReservationResponse> createReservation(
            @RequestBody ReservationDto.ReservationRequest request) {
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

    // 날짜별 예약 조회 (프론트 달력용)
    @GetMapping("/date")
    public ResponseEntity<List<ReservationDto.ReservationResponse>> getReservationsByDate(
            @RequestParam("date") String dateStr) {
        LocalDate date = LocalDate.parse(dateStr); // yyyy-MM-dd 형식
        List<ReservationDto.ReservationResponse> reservations = reservationService.getReservationsByDate(date);
        return ResponseEntity.ok(reservations);
    }

    // 예약 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
        reservationService.deleteReservation(id);
        return ResponseEntity.noContent().build();
    }

    // 예약 수정
    @PutMapping("/{id}")
    public ResponseEntity<ReservationDto.ReservationResponse> updateReservation(
            @PathVariable Long id,
            @RequestBody ReservationDto.ReservationRequest request) {
        Reservation updatedReservation = reservationService.updateReservation(id, request);
        return ResponseEntity.ok(new ReservationDto.ReservationResponse(updatedReservation));
    }
}
