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
}
