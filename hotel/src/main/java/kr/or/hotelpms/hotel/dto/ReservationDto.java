package kr.or.hotelpms.hotel.dto;


import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationDto {
    private Long roomId;
    private String reservationName;
    private String phone;
    private String email;
    private int adults;
    private int children;
    private String date;       // yyyy-MM-dd
    private String startTime;  // HH:mm
    private String endTime;    // HH:mm
    private String specialRequests;
}
<<<<<<< HEAD:hotel/src/main/java/kr/or/hotelpms/hotel/dto/ReservationDto.java

// 예약 관련 DTO //
// 필수(중요)로 만들어야 함 //
// 난이도: 초급 (예약 정보 전달 객체) //

// 백앤드 - DTO
// API 요청/응답 시 주고받는 데이터 객체 (JSON 변환 대상)
=======
>>>>>>> 589edce1e47781545bf7ec0a936ae8b591a5fd34:hotel-backend/src/main/java/com/hotel/hotelreservation/dto/ReservationDto.java
