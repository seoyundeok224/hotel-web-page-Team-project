package com.hotel.hotelreservation.service;

import com.hotel.hotelreservation.dto.BookingRequestDto;
import com.hotel.hotelreservation.model.Booking;
import com.hotel.hotelreservation.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;

    public Booking createBooking(BookingRequestDto requestDto) {
        Booking booking = Booking.builder()
                .guestName(requestDto.getGuestName())
                .roomType(requestDto.getRoomType())
                .checkInDate(requestDto.getCheckInDate())
                .checkOutDate(requestDto.getCheckOutDate())
                .numberOfGuests(requestDto.getNumberOfGuests())
                .status("CONFIRMED") // 기본 상태를 CONFIRMED로 설정
                .build();

        return bookingRepository.save(booking);
    }
}
