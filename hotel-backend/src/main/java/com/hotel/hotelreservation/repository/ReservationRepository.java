package com.hotel.hotelreservation.repository;

import com.hotel.hotelreservation.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
}