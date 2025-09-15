package kr.or.hotelpms.hotel.service;

import com.hotel.hotelreservation.model.Room;
import com.hotel.hotelreservation.model.RoomStatus;
import com.hotel.hotelreservation.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;

    @Transactional
    public void createInitialRooms() {
        if (roomRepository.count() == 0) {
            List<Room> rooms = new ArrayList<>();

            // 3층 - 싱글 (20)
            for (int i = 1; i <= 20; i++) {
                Room room = new Room();
                room.setRoomNumber("3" + String.format("%02d", i));
                room.setRoomType("Single");
                room.setPrice(new BigDecimal("150000"));
                room.setStatus(RoomStatus.AVAILABLE);
                rooms.add(room);
            }

            // 4층 - 더블(10), 패밀리(10)
            for (int i = 1; i <= 10; i++) {
                Room room = new Room();
                room.setRoomNumber("4" + String.format("%02d", i));
                room.setRoomType("Double");
                room.setPrice(new BigDecimal("200000"));
                room.setStatus(RoomStatus.AVAILABLE);
                rooms.add(room);
            }
            for (int i = 11; i <= 20; i++) {
                Room room = new Room();
                room.setRoomNumber("4" + String.format("%02d", i));
                room.setRoomType("Family");
                room.setPrice(new BigDecimal("250000"));
                room.setStatus(RoomStatus.AVAILABLE);
                rooms.add(room);
            }

            // 5층 - 디럭스(10),스위트(10)
            for (int i = 1; i <= 10; i++) {
                Room room = new Room();
                room.setRoomNumber("5" + String.format("%02d", i));
                room.setRoomType("Deluxe");
                room.setPrice(new BigDecimal("250000"));
                room.setStatus(RoomStatus.AVAILABLE);
                rooms.add(room);
            }
            for (int i = 11; i <= 20; i++) {
                Room room = new Room();
                room.setRoomNumber("5" + String.format("%02d", i));
                room.setRoomType("Suite");
                room.setPrice(new BigDecimal("300000"));
                room.setStatus(RoomStatus.AVAILABLE);
                rooms.add(room);
            }

            // 6층 - 컨퍼런스(5)
            for (int i = 1; i <= 5; i++) {
                Room room = new Room();
                room.setRoomNumber("6" + String.format("%02d", i));
                room.setRoomType("Conference");
                room.setPrice(new BigDecimal("400000"));
                room.setStatus(RoomStatus.AVAILABLE);
                rooms.add(room);
            }

            roomRepository.saveAll(rooms);
        }
    }
}
