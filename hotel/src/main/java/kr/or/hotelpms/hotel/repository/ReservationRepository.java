package kr.or.hotelpms.hotel.repository;

import com.hotel.hotelreservation.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

<<<<<<< HEAD:hotel/src/main/java/kr/or/hotelpms/hotel/repository/ReservationRepository.java
// 예약 관련 리포지토리 //
// 필수(중요)로 만들어야 함 //
// 난이도: 초급 //

// 백앤드 - 리포지토리
// 예약 관련 데이터 CRUD
=======
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
}
>>>>>>> 589edce1e47781545bf7ec0a936ae8b591a5fd34:hotel-backend/src/main/java/com/hotel/hotelreservation/repository/ReservationRepository.java
