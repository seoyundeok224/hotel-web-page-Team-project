package com.hotel.hotelreservation.controller;

import com.hotel.hotelreservation.dto.BookingRequestDto;
import com.hotel.hotelreservation.model.Booking;
import com.hotel.hotelreservation.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody BookingRequestDto requestDto) {
        Booking createdBooking = bookingService.createBooking(requestDto);
        return new ResponseEntity<>(createdBooking, HttpStatus.CREATED);
    }
}
