package kr.or.hotelpms.hotel.controller;

import kr.or.hotelpms.hotel.model.Room;
import kr.or.hotelpms.hotel.model.RoomStatus;
import kr.or.hotelpms.hotel.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    // 전체 객실 조회
    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    // ID로 객실 조회
    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoomById(@PathVariable Long id) {
        Optional<Room> room = roomService.getRoomById(id);
        return room.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    // 상태별 필터 조회
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Room>> getRoomsByStatus(@PathVariable RoomStatus status) {
        return ResponseEntity.ok(roomService.getRoomsByStatus(status));
    }

    // 타입별 필터 조회
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Room>> getRoomsByType(@PathVariable String type) {
        return ResponseEntity.ok(roomService.getRoomsByType(type));
    }

    // 가격 범위 조회
    @GetMapping("/price")
    public ResponseEntity<List<Room>> getRoomsByPriceRange(
            @RequestParam BigDecimal min,
            @RequestParam BigDecimal max) {
        return ResponseEntity.ok(roomService.getRoomsByPriceRange(min, max));
    }

    // 객실 생성
    @PostMapping
    public ResponseEntity<Room> createRoom(@RequestBody Room room) {
        return ResponseEntity.ok(roomService.createRoom(room));
    }

    // 객실 수정
    @PutMapping("/{id}")
    public ResponseEntity<Room> updateRoom(@PathVariable Long id, @RequestBody Room roomDetails) {
        Optional<Room> updatedRoom = roomService.updateRoom(id, roomDetails);
        return updatedRoom.map(ResponseEntity::ok)
                          .orElse(ResponseEntity.notFound().build());
    }

    // 객실 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        boolean deleted = roomService.deleteRoom(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    // ✅ 객실 상태만 업데이트
    @PutMapping("/{id}/status")
    public ResponseEntity<Room> updateRoomStatus(
            @PathVariable Long id,
            @RequestParam RoomStatus status) {

        Optional<Room> updatedRoom = roomService.updateRoomStatus(id, status);
        return updatedRoom.map(ResponseEntity::ok)
                          .orElse(ResponseEntity.notFound().build());
    }
}
