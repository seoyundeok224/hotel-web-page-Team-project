package kr.or.hotelpms.hotel.service;

import kr.or.hotelpms.hotel.model.Room;
import kr.or.hotelpms.hotel.model.RoomStatus;
import kr.or.hotelpms.hotel.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;

    // 초기 객실 생성
    @Transactional
    public void createInitialRooms() {
        if (roomRepository.count() == 0) {
            List<Room> rooms = new ArrayList<>();

            // 3층 - 싱글 (20)
            for (int i = 1; i <= 20; i++) {
                Room room = new Room();
                room.setRoomNumber("3" + String.format("%02d", i));
                room.setRoomType("SINGLE");
                room.setPrice(new BigDecimal("150000"));
                room.setStatus(RoomStatus.AVAILABLE);
                rooms.add(room);
            }

            // 4층 - 더블(10), 패밀리(10)
            for (int i = 1; i <= 10; i++) {
                Room room = new Room();
                room.setRoomNumber("4" + String.format("%02d", i));
                room.setRoomType("DOUBLE");
                room.setPrice(new BigDecimal("200000"));
                room.setStatus(RoomStatus.AVAILABLE);
                rooms.add(room);
            }
            for (int i = 11; i <= 20; i++) {
                Room room = new Room();
                room.setRoomNumber("4" + String.format("%02d", i));
                room.setRoomType("FAMILY");
                room.setPrice(new BigDecimal("250000"));
                room.setStatus(RoomStatus.AVAILABLE);
                rooms.add(room);
            }

            // 5층 - 디럭스(10), 스위트(10)
            for (int i = 1; i <= 10; i++) {
                Room room = new Room();
                room.setRoomNumber("5" + String.format("%02d", i));
                room.setRoomType("DELUXE");
                room.setPrice(new BigDecimal("250000"));
                room.setStatus(RoomStatus.AVAILABLE);
                rooms.add(room);
            }
            for (int i = 11; i <= 20; i++) {
                Room room = new Room();
                room.setRoomNumber("5" + String.format("%02d", i));
                room.setRoomType("SUITE");
                room.setPrice(new BigDecimal("300000"));
                room.setStatus(RoomStatus.AVAILABLE);
                rooms.add(room);
            }

            // 6층 - 컨퍼런스(5)
            for (int i = 1; i <= 5; i++) {
                Room room = new Room();
                room.setRoomNumber("6" + String.format("%02d", i));
                room.setRoomType("CONFERENCE");
                room.setPrice(new BigDecimal("400000"));
                room.setStatus(RoomStatus.AVAILABLE);
                rooms.add(room);
            }

            roomRepository.saveAll(rooms);
        }
    }

    // 전체 조회
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    // ID로 조회
    public Optional<Room> getRoomById(Long id) {
        return roomRepository.findById(id);
    }

    // 상태별 조회
    public List<Room> getRoomsByStatus(RoomStatus status) {
        return roomRepository.findAll().stream()
                .filter(room -> room.getStatus() == status)
                .toList();
    }

    // 타입별 조회
    public List<Room> getRoomsByType(String type) {
        return roomRepository.findAll().stream()
                .filter(room -> room.getRoomType().equalsIgnoreCase(type))
                .toList();
    }

    // 가격 범위 조회
    public List<Room> getRoomsByPriceRange(BigDecimal min, BigDecimal max) {
        return roomRepository.findAll().stream()
                .filter(room -> room.getPrice().compareTo(min) >= 0 && room.getPrice().compareTo(max) <= 0)
                .toList();
    }

    // 객실 생성
    @Transactional
    public Room createRoom(Room room) {
        return roomRepository.save(room);
    }

    // 객실 수정
    @Transactional
    public Optional<Room> updateRoom(Long id, Room roomDetails) {
        return roomRepository.findById(id).map(room -> {
            if (roomDetails.getRoomNumber() != null) {
                room.setRoomNumber(roomDetails.getRoomNumber());
            }
            if (roomDetails.getRoomType() != null) {
                room.setRoomType(roomDetails.getRoomType());
            }
            if (roomDetails.getPrice() != null) {
                room.setPrice(roomDetails.getPrice());
            }
            if (roomDetails.getStatus() != null) {
                room.setStatus(roomDetails.getStatus());
            }
            return roomRepository.save(room);
        });
    }

    // 객실 삭제
    @Transactional
    public boolean deleteRoom(Long id) {
        return roomRepository.findById(id).map(room -> {
            roomRepository.delete(room);
            return true;
        }).orElse(false);
    }

    // ✅ 객실 상태만 업데이트
    @Transactional
    public Optional<Room> updateRoomStatus(Long roomId, RoomStatus status) {
        return roomRepository.findById(roomId).map(room -> {
            room.setStatus(status);
            return room;
        });
    }
}
