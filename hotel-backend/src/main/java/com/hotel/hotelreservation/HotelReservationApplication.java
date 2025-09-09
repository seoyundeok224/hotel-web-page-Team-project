package com.hotel.hotelreservation;

import com.hotel.hotelreservation.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@RequiredArgsConstructor
public class HotelReservationApplication implements CommandLineRunner {

	private final AuthService authService;

	public static void main(String[] args) {
		SpringApplication.run(HotelReservationApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		// 애플리케이션 시작 시 초기 관리자 계정 생성
		authService.createInitialAdmin();
		System.out.println("=== 초기 계정 생성 완료 ===");
		System.out.println("관리자 계정: admin / admin");
		System.out.println("고객 계정: customer / password");
	}
}