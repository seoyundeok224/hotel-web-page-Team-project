package kr.or.hotelpms.hotel.repository;

import kr.or.hotelpms.hotel.model.Room;
import kr.or.hotelpms.hotel.model.RoomStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    // 상태별 조회
    List<Room> findByStatus(RoomStatus status);

    // 타입별 조회
    List<Room> findByRoomTypeIgnoreCase(String roomType);

    // 가격 범위 조회
    List<Room> findByPriceBetween(BigDecimal min, BigDecimal max);

     Optional<Room> findByRoomNumber(String roomNumber);
}
