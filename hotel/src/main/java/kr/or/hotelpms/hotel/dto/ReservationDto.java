package kr.or.hotelpms.hotel.dto;

import kr.or.hotelpms.hotel.model.Reservation;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

public class ReservationDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReservationRequest {
        private String username;    // 로그인 아이디
        private String guestName;   // 고객명
        private String guestPhone;  // 고객 연락처
        private String roomNumber;  // 객실번호 (선택사항)
        private String roomType;    // 객실 타입 (SINGLE, DOUBLE, 등)
        private LocalDate checkIn;
        private LocalDate checkOut;
        private int people;         // 투숙객 수
        private String message; // 특별 요청사항

        // Getter 메소드들 (Lombok이 작동하지 않을 경우를 대비)
        public String getUsername() { return username; }
        public String getGuestName() { return guestName; }
        public String getGuestPhone() { return guestPhone; }
        public String getRoomNumber() { return roomNumber; }
        public String getRoomType() { return roomType; }
        public LocalDate getCheckIn() { return checkIn; }
        public LocalDate getCheckOut() { return checkOut; }
        public int getPeople() { return people; }
        public String getMessage() { return message; }
    }

        @Getter
    @Setter
    public static class ReservationResponse {
        private Long id;
        private String reservationNumber;
        private String guestName;
        private String guestPhone;
        private Long roomId;
        private String roomNumber;
        private String roomType;
        private LocalDate checkIn;
        private LocalDate checkOut;
        private int people;
        private String paymentStatus;
        private String status;
        private String message;

        public ReservationResponse(Reservation reservation) {
            this.id = reservation.getId();
            this.reservationNumber = "RSV-" + String.format("%03d", reservation.getId());
            this.guestName = reservation.getGuestName() != null ? reservation.getGuestName() : reservation.getUser().getName();
            this.guestPhone = reservation.getGuestPhone() != null ? reservation.getGuestPhone() : reservation.getUser().getPhone();
            this.roomId = reservation.getRoom().getId();
            this.roomNumber = reservation.getRoom().getRoomNumber();
            this.roomType = reservation.getRoom().getRoomType(); // 엔티티에 맞게 수정
            this.checkIn = reservation.getCheckIn();
            this.checkOut = reservation.getCheckOut();
            this.people = reservation.getPeople();
            this.paymentStatus = reservation.getPaymentStatus();
            this.status = reservation.getStatus();
            this.message = reservation.getMessage();
        }
    }
}
