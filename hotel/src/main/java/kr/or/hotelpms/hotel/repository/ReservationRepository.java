package kr.or.hotelpms.hotel.repository;

import kr.or.hotelpms.hotel.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // 특정 객실의 예약 기간 겹치는 예약 조회
    List<Reservation> findByRoomIdAndCheckOutAfterAndCheckInBefore(
            Long roomId,
            LocalDate checkIn,
            LocalDate checkOut
    );

    // 유저 기준 예약 조회
    List<Reservation> findByUserId(Long userId);
}
