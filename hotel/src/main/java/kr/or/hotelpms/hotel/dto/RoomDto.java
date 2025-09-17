package kr.or.hotelpms.hotel.dto;

import kr.or.hotelpms.hotel.model.Room;
import kr.or.hotelpms.hotel.model.RoomStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoomDto {
    private Long id;
    private String roomNumber;
    private String roomType;
    private BigDecimal price;
    private RoomStatus status;

    public static RoomDto fromEntity(Room room) {
        return new RoomDto(
                room.getId(),
                room.getRoomNumber(),
                room.getRoomType(),
                room.getPrice(),
                room.getStatus()
        );
    }
}