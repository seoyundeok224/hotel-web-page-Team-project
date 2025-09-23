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

import java.time.LocalDate;
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
        reservation.setGuestName(request.getGuestName());
        reservation.setGuestPhone(request.getGuestPhone());
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

    @Transactional
    public Reservation updateReservation(Long reservationId, ReservationDto.ReservationRequest request) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 예약입니다."));

        // 방 번호로 방을 찾습니다.
        Room room = roomRepository.findByRoomNumber(request.getRoomNumber())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 객실입니다."));

        if (!request.getCheckIn().isBefore(request.getCheckOut())) {
            throw new IllegalArgumentException("체크인 날짜는 체크아웃 날짜보다 앞서야 합니다.");
        }

        // 현재 예약을 제외하고 겹치는 예약을 확인합니다.
        boolean overlapExists = reservationRepository
                .findByRoomIdAndCheckOutAfterAndCheckInBefore(room.getId(), request.getCheckIn(), request.getCheckOut()).stream()
                .anyMatch(r -> !r.getId().equals(reservationId));

        if (overlapExists) {
            throw new IllegalStateException("해당 기간에 이미 예약이 존재합니다.");
        }

        reservation.setRoom(room);
        reservation.setCheckIn(request.getCheckIn());
        reservation.setCheckOut(request.getCheckOut());
        reservation.setPeople(request.getPeople());
        reservation.setGuestName(request.getGuestName());
        reservation.setGuestPhone(request.getGuestPhone());

        return reservationRepository.saveAndFlush(reservation);
    }

    @Transactional(readOnly = true)
    public List<ReservationDto.ReservationResponse> getReservationsByDate(LocalDate date) {
        List<Reservation> reservations = reservationRepository.findAll().stream()
                .filter(r -> !date.isBefore(r.getCheckIn()) && date.isBefore(r.getCheckOut()))
                .toList();
        return reservations.stream()
                .map(ReservationDto.ReservationResponse::new)
                .collect(Collectors.toList());
    }
}
