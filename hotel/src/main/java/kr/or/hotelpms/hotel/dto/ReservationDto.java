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
        private String roomNumber;  // 객실번호
        private LocalDate checkIn;
        private LocalDate checkOut;
        private int people;         // 투숙객 수
    }

    @Getter
    @Setter
    public static class ReservationResponse {
        private Long id;
        private String reservationNumber;
        private String guestName;
        private String guestPhone;
        private String roomNumber;
        private String roomType;
        private LocalDate checkIn;
        private LocalDate checkOut;
        private int people;
        private String paymentStatus;

        public ReservationResponse(Reservation reservation) {
            this.id = reservation.getId();
            this.reservationNumber = "RSV-" + String.format("%03d", reservation.getId());
            this.guestName = reservation.getUser().getName();
            this.guestPhone = reservation.getUser().getPhone();
            this.roomNumber = reservation.getRoom().getRoomNumber();
            this.roomType = reservation.getRoom().getRoomType(); // 엔티티에 맞게 수정
            this.checkIn = reservation.getCheckIn();
            this.checkOut = reservation.getCheckOut();
            this.people = reservation.getPeople();
            this.paymentStatus = reservation.getPaymentStatus();
        }
    }
}
