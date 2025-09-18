package kr.or.hotelpms.hotel.service;

import kr.or.hotelpms.hotel.dto.ReservationDto;
import kr.or.hotelpms.hotel.model.Reservation;
import kr.or.hotelpms.hotel.model.Room;
import kr.or.hotelpms.hotel.model.User;
import kr.or.hotelpms.hotel.repository.ReservationRepository;
import kr.or.hotelpms.hotel.repository.RoomRepository;
import kr.or.hotelpms.hotel.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    // username → userId
    public Long getUserIdByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저입니다."))
                .getId();
    }

    // roomNumber → roomId
    public Long getRoomIdByRoomNumber(String roomNumber) {
        return roomRepository.findByRoomNumber(roomNumber)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 객실입니다."))
                .getId();
    }

    @Transactional
    public Reservation createReservationByUsername(ReservationDto.ReservationRequest request) {
        Long userId = getUserIdByUsername(request.getUsername());
        Long roomId = getRoomIdByRoomNumber(request.getRoomNumber());
        return createReservation(userId, roomId, request);
    }

    @Transactional
    public Reservation createReservation(Long userId, Long roomId, ReservationDto.ReservationRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저입니다."));
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 객실입니다."));

        if (!request.getCheckIn().isBefore(request.getCheckOut())) {
            throw new IllegalArgumentException("체크인 날짜는 체크아웃 날짜보다 앞서야 합니다.");
        }

        boolean overlapExists = reservationRepository
                .findByRoomIdAndCheckOutAfterAndCheckInBefore(roomId, request.getCheckIn(), request.getCheckOut())
                .size() > 0;
        if (overlapExists) {
            throw new IllegalStateException("해당 기간에 이미 예약이 존재합니다.");
        }

        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setRoom(room);
        reservation.setCheckIn(request.getCheckIn());
        reservation.setCheckOut(request.getCheckOut());
        reservation.setPeople(request.getPeople());
        reservation.setPaymentStatus("PENDING");

        return reservationRepository.save(reservation);
    }

    @Transactional(readOnly = true)
    public List<ReservationDto.ReservationResponse> getAllReservations() {
        return reservationRepository.findAll().stream()
                .map(ReservationDto.ReservationResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReservationDto.ReservationResponse> getReservationsByUser(Long userId) {
        return reservationRepository.findByUserId(userId).stream()
                .map(ReservationDto.ReservationResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteReservation(Long reservationId) {
        reservationRepository.deleteById(reservationId);
    }
}
