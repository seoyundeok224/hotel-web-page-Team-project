package com.hotel.hotelreservation.dto;


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
