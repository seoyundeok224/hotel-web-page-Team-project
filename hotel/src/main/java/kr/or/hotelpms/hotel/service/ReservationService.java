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

    public Long getUserIdByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저입니다."))
                .getId();
    }

    @Transactional
    public Reservation createReservationByUsername(ReservationDto.ReservationRequest request) {
        Long userId = getUserIdByUsername(request.getUsername());
        
        // 방 타입을 기반으로 사용 가능한 방 자동 배정
        if (request.getRoomType() == null || request.getRoomType().isEmpty()) {
            throw new IllegalArgumentException("방타입이 필요합니다.");
        }
        
        Long roomId = findAvailableRoomByType(request.getRoomType(), request.getCheckIn(), request.getCheckOut());
        
        return createReservation(userId, roomId, request);
    }
    
    // 방 타입을 기반으로 사용 가능한 방 찾기 (가장 작은 호수부터 우선 배정)
    private Long findAvailableRoomByType(String roomType, LocalDate checkIn, LocalDate checkOut) {
        List<Room> roomsOfType = roomRepository.findByRoomTypeIgnoreCase(roomType).stream()
                .sorted((room1, room2) -> {
                    // 방번호를 숫자로 변환하여 정렬
                    try {
                        Integer roomNum1 = Integer.parseInt(room1.getRoomNumber());
                        Integer roomNum2 = Integer.parseInt(room2.getRoomNumber());
                        return roomNum1.compareTo(roomNum2);
                    } catch (NumberFormatException e) {
                        // 숫자가 아닌 경우 문자열로 정렬
                        return room1.getRoomNumber().compareTo(room2.getRoomNumber());
                    }
                })
                .toList();
                
        if (roomsOfType.isEmpty()) {
            throw new IllegalArgumentException("해당 타입의 방이 없습니다: " + roomType);
        }
        
        // 예약 가능한 방 찾기 (가장 작은 호수부터)
        for (Room room : roomsOfType) {
            boolean isAvailable = reservationRepository
                    .findByRoomIdAndCheckOutAfterAndCheckInBefore(room.getId(), checkIn, checkOut)
                    .isEmpty();
            if (isAvailable) {
                return room.getId();
            }
        }
        
        throw new IllegalStateException("해당 기간에 " + roomType + " 타입의 예약 가능한 방이 없습니다.");
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
        reservation.setMessage(request.getMessage()); // 요청사항 추가 (getSpecialRequests() -> getMessage())
        reservation.setPaymentStatus("PENDING");
        reservation.setStatus("RESERVED");

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

        Room room = roomRepository.findByRoomNumber(request.getRoomNumber())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 객실입니다."));

        if (!request.getCheckIn().isBefore(request.getCheckOut())) {
            throw new IllegalArgumentException("체크인 날짜는 체크아웃 날짜보다 앞서야 합니다.");
        }

        boolean overlapExists = reservationRepository
                .findByRoomIdAndCheckOutAfterAndCheckInBefore(room.getId(), request.getCheckIn(), request.getCheckOut())
                .stream()
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
        reservation.setMessage(request.getMessage()); // 요청사항 추가 (getSpecialRequests() -> getMessage())

        return reservationRepository.saveAndFlush(reservation);
    }

    @Transactional(readOnly = true)
    public List<ReservationDto.ReservationResponse> getReservationsByDate(LocalDate date) {
        // DB에서 직접 필터링하여 성능 개선
        return reservationRepository.findByCheckInLessThanEqualAndCheckOutAfter(date, date).stream()
                .map(ReservationDto.ReservationResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public Reservation updateStatus(Long reservationId, String status) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 예약입니다."));
        reservation.setStatus(status);
        return reservationRepository.save(reservation);
    }
}
