package com.hotel.hotelreservation.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class BookingRequestDto {
    private String guestName;
    private String roomType;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private int numberOfGuests;
}
