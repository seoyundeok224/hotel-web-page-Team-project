package kr.or.hotelpms.hotel.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name = "reservations")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 예약 고유 ID

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // 예약자

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room; // 예약한 객실

    @Column(name = "check_in", nullable = false)
    private LocalDate checkIn; // 체크인 날짜

    @Column(name = "check_out", nullable = false)
    private LocalDate checkOut; // 체크아웃 날짜

    @Column(name = "payment_status", nullable = false, length = 20)
    private String paymentStatus = "PENDING"; // 결제 상태

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDate createdAt; // 예약 생성일

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDate updatedAt; // 예약 수정일
}