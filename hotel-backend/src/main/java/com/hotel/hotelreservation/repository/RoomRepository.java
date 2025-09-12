package com.hotel.hotelreservation.repository;

import com.hotel.hotelreservation.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomRepository extends JpaRepository<Room, Long> {
}
