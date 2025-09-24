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

    @PostMapping
    public ResponseEntity<ReservationDto.ReservationResponse> createReservation(
            @RequestBody ReservationDto.ReservationRequest request) {
        Reservation reservation = reservationService.createReservationByUsername(request);
        return ResponseEntity.ok(new ReservationDto.ReservationResponse(reservation));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReservationDto.ReservationResponse>> getUserReservations(@PathVariable Long userId) {
        return ResponseEntity.ok(reservationService.getReservationsByUser(userId));
    }

    @GetMapping("/admin/all")
    public ResponseEntity<List<ReservationDto.ReservationResponse>> getAllReservations() {
        return ResponseEntity.ok(reservationService.getAllReservations());
    }

    @GetMapping("/date")
    public ResponseEntity<List<ReservationDto.ReservationResponse>> getReservationsByDate(
            @RequestParam("date") String dateStr) {
        LocalDate date = LocalDate.parse(dateStr);
        return ResponseEntity.ok(reservationService.getReservationsByDate(date));
    }

    @PutMapping("/{reservationId}")
    public ResponseEntity<ReservationDto.ReservationResponse> updateReservation(
            @PathVariable Long reservationId,
            @RequestBody ReservationDto.ReservationRequest request) {
        Reservation updated = reservationService.updateReservation(reservationId, request);
        return ResponseEntity.ok(new ReservationDto.ReservationResponse(updated));
    }

    @PutMapping("/{reservationId}/status")
    public ResponseEntity<ReservationDto.ReservationResponse> updateStatus(
            @PathVariable Long reservationId,
            @RequestParam String status) {
        Reservation updated = reservationService.updateStatus(reservationId, status);
        return ResponseEntity.ok(new ReservationDto.ReservationResponse(updated));
    }

    @DeleteMapping("/{reservationId}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long reservationId) {
        reservationService.deleteReservation(reservationId);
        return ResponseEntity.ok().build();
    }
}
