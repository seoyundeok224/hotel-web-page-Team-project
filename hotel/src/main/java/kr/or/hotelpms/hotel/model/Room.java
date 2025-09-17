package kr.or.hotelpms.hotel.model;

import jakarta.persistence.*;
<<<<<<< HEAD:hotel/src/main/java/kr/or/hotelpms/hotel/model/Room.java
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
=======
import lombok.*;
>>>>>>> 74543a7abb863427b645178a119a535d6ac416b6:hotel-backend/src/main/java/com/hotel/hotelreservation/model/Room.java
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Rooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
<<<<<<< HEAD:hotel/src/main/java/kr/or/hotelpms/hotel/model/Room.java
@Table(name = "rooms")
=======
@Builder
>>>>>>> 74543a7abb863427b645178a119a535d6ac416b6:hotel-backend/src/main/java/com/hotel/hotelreservation/model/Room.java
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

<<<<<<< HEAD:hotel/src/main/java/kr/or/hotelpms/hotel/model/Room.java
    @Column(name = "room_number", unique = true, nullable = false, length = 20)
=======
    @Column(name = "room_number", length = 20, unique = true, nullable = false)
>>>>>>> 74543a7abb863427b645178a119a535d6ac416b6:hotel-backend/src/main/java/com/hotel/hotelreservation/model/Room.java
    private String roomNumber;

    @Column(name = "room_type", length = 50, nullable = false)
    private String roomType;

    @Column(name = "price", precision = 10, scale = 2, nullable = false)
    private BigDecimal price;

<<<<<<< HEAD:hotel/src/main/java/kr/or/hotelpms/hotel/model/Room.java
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, columnDefinition = "VARCHAR(20) DEFAULT 'AVAILABLE'")
    private RoomStatus status;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
=======
    @Column(name = "status", length = 20)
    private String status = "AVAILABLE";

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
>>>>>>> 74543a7abb863427b645178a119a535d6ac416b6:hotel-backend/src/main/java/com/hotel/hotelreservation/model/Room.java
    private LocalDateTime updatedAt;
}