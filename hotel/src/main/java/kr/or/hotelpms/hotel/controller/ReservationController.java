package kr.or.hotelpms.hotel.controller;

import com.hotel.hotelreservation.dto.ReservationDto;
import com.hotel.hotelreservation.model.Reservation;
import com.hotel.hotelreservation.model.Room;
import com.hotel.hotelreservation.repository.ReservationRepository;
import com.hotel.hotelreservation.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;

<<<<<<< HEAD:hotel/src/main/java/kr/or/hotelpms/hotel/controller/ReservationController.java
// 백앤드 - 컨트롤러
// 예약 생성, 조회, 취소 API
// 프론트엔드 예약 페이지와 통신
=======
    @PostMapping
    public ResponseEntity<Reservation> createReservation(@RequestBody ReservationDto dto) {

        // 1️⃣ roomId로 Room 찾기
        Room room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        // 2️⃣ Reservation 엔티티 생성
        Reservation reservation = Reservation.builder()
                .room(room)
                .reservationName(dto.getReservationName())
                .phone(dto.getPhone())
                .email(dto.getEmail())
                .adults(dto.getAdults())
                .children(dto.getChildren())
                .date(LocalDate.parse(dto.getDate()))
                .startTime(LocalTime.parse(dto.getStartTime()))
                .endTime(LocalTime.parse(dto.getEndTime()))
                .specialRequests(dto.getSpecialRequests())
                .build();

        // 3️⃣ DB에 저장
        Reservation saved = reservationRepository.save(reservation);

        return ResponseEntity.ok(saved);
    }
}
>>>>>>> 589edce1e47781545bf7ec0a936ae8b591a5fd34:hotel-backend/src/main/java/com/hotel/hotelreservation/controller/ReservationController.java
