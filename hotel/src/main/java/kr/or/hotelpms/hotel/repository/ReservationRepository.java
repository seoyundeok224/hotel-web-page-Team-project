package kr.or.hotelpms.hotel.repository;

import kr.or.hotelpms.hotel.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByRoomIdAndCheckOutAfterAndCheckInBefore(
            Long roomId,
            LocalDate checkIn,
            LocalDate checkOut
    );

    List<Reservation> findByUserId(Long userId);

    // 특정 날짜에 활성화된 예약 조회 (checkIn <= date < checkOut)
    List<Reservation> findByCheckInLessThanEqualAndCheckOutAfter(LocalDate checkOutDate, LocalDate checkInDate);
}
