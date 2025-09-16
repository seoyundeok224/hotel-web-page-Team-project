<<<<<<< HEAD:hotel/src/main/java/kr/or/hotelpms/hotel/model/Room.java
package kr.or.hotelpms.hotel.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
=======
    package com.hotel.hotelreservation.model;

    import jakarta.persistence.*;
    import lombok.AllArgsConstructor;
    import lombok.Getter;
    import lombok.NoArgsConstructor;
    import lombok.Setter;
    import org.springframework.data.annotation.CreatedDate;
    import org.springframework.data.annotation.LastModifiedDate;
    import org.springframework.data.jpa.domain.support.AuditingEntityListener;
>>>>>>> 589edce1e47781545bf7ec0a936ae8b591a5fd34:hotel-backend/src/main/java/com/hotel/hotelreservation/model/Room.java

    import java.math.BigDecimal;
    import java.time.LocalDateTime;

<<<<<<< HEAD:hotel/src/main/java/kr/or/hotelpms/hotel/model/Room.java
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "rooms")
public class Room {
=======
    @Entity
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @EntityListeners(AuditingEntityListener.class)
    @Table(name = "rooms")
    public class Room {
>>>>>>> 589edce1e47781545bf7ec0a936ae8b591a5fd34:hotel-backend/src/main/java/com/hotel/hotelreservation/model/Room.java

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

<<<<<<< HEAD:hotel/src/main/java/kr/or/hotelpms/hotel/model/Room.java
    @Column(name = "room_number", unique = true, nullable = false, length = 20)
    private String roomNumber;
=======
        @Column(name = "room_number", nullable = false, unique = true, length = 20)
        private String roomNumber;
>>>>>>> 589edce1e47781545bf7ec0a936ae8b591a5fd34:hotel-backend/src/main/java/com/hotel/hotelreservation/model/Room.java

        @Column(name = "room_type", nullable = false, length = 50)
        private String roomType;

        @Column(name = "price", nullable = false, precision = 10, scale = 2)
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
    private LocalDateTime updatedAt;
=======
        @Column(name = "status", nullable = false, length = 20)
        private String status = "AVAILABLE";

        @CreatedDate
        @Column(name = "created_at", nullable = false, updatable = false)
        private LocalDateTime createdAt;

        @LastModifiedDate
        @Column(name = "updated_at")
        private LocalDateTime updatedAt;
>>>>>>> 589edce1e47781545bf7ec0a936ae8b591a5fd34:hotel-backend/src/main/java/com/hotel/hotelreservation/model/Room.java

    }
