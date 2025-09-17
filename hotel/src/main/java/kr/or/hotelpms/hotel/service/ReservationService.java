package kr.or.hotelpms.hotel.service;

import kr.or.hotelpms.hotel.model.Reservation;
import kr.or.hotelpms.hotel.model.Room;
import kr.or.hotelpms.hotel.model.User;
import kr.or.hotelpms.hotel.repository.ReservationRepository;
import kr.or.hotelpms.hotel.repository.RoomRepository;
import kr.or.hotelpms.hotel.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    @Transactional
    public Reservation createReservation(Long userId, Long roomId, LocalDate checkIn, LocalDate checkOut) {
        // 유저 & 객실 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저입니다."));
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 객실입니다."));

        // 체크인 < 체크아웃 검증
        if (!checkIn.isBefore(checkOut)) {
            throw new IllegalArgumentException("체크인 날짜는 체크아웃 날짜보다 앞서야 합니다.");
        }

        // 예약 가능 여부 확인
        List<Reservation> overlapping = reservationRepository
                .findByRoomIdAndCheckOutAfterAndCheckInBefore(roomId, checkIn, checkOut);
        if (!overlapping.isEmpty()) {
            throw new IllegalStateException("해당 기간에 이미 예약이 존재합니다.");
        }

        // 예약 생성
        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setRoom(room);
        reservation.setCheckIn(checkIn);
        reservation.setCheckOut(checkOut);
        reservation.setPaymentStatus("PENDING");

        return reservationRepository.save(reservation);
    }

    @Transactional(readOnly = true)
    public List<Reservation> getReservationsByUser(Long userId) {
        return reservationRepository.findByUserId(userId);
    }
}
