<<<<<<< HEAD:hotel/src/main/java/kr/or/hotelpms/hotel/model/Reservation.java
package kr.or.hotelpms.hotel.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
=======
package com.hotel.hotelreservation.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
>>>>>>> 589edce1e47781545bf7ec0a936ae8b591a5fd34:hotel-backend/src/main/java/com/hotel/hotelreservation/model/Reservation.java

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
<<<<<<< HEAD:hotel/src/main/java/kr/or/hotelpms/hotel/model/Reservation.java
=======
@Builder
@EntityListeners(AuditingEntityListener.class)
>>>>>>> 589edce1e47781545bf7ec0a936ae8b591a5fd34:hotel-backend/src/main/java/com/hotel/hotelreservation/model/Reservation.java
@Table(name = "reservations")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 어떤 방/시설 예약인지
    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Column(name = "reservation_name", nullable = false, length = 50)
    private String reservationName;

    @Column(name = "phone", nullable = false, length = 20)
    private String phone;

<<<<<<< HEAD:hotel/src/main/java/kr/or/hotelpms/hotel/model/Reservation.java
    @Column(name = "payment_status", columnDefinition = "VARCHAR(20) DEFAULT 'PENDING'")
    private String paymentStatus; // 결제 상태

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt; // 예약 생성일
=======
    @Column(name = "email", nullable = false, length = 100)
    private String email;

    @Column(name = "adults", nullable = false)
    private int adults;

    @Column(name = "children", nullable = false)
    private int children;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "special_requests", length = 500)
    private String specialRequests;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
>>>>>>> 589edce1e47781545bf7ec0a936ae8b591a5fd34:hotel-backend/src/main/java/com/hotel/hotelreservation/model/Reservation.java

    @UpdateTimestamp
    @Column(name = "updated_at")
<<<<<<< HEAD:hotel/src/main/java/kr/or/hotelpms/hotel/model/Reservation.java
    private LocalDateTime updatedAt; // 예약 수정일
}
=======
    private LocalDateTime updatedAt;
}
>>>>>>> 589edce1e47781545bf7ec0a936ae8b591a5fd34:hotel-backend/src/main/java/com/hotel/hotelreservation/model/Reservation.java
