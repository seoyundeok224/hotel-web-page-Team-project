package kr.or.hotelpms.hotel;

import kr.or.hotelpms.hotel.service.AuthService;
import kr.or.hotelpms.hotel.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@RequiredArgsConstructor
public class HotelReservationApplication implements CommandLineRunner {

	private final AuthService authService;
	private final RoomService roomService;

	public static void main(String[] args) {
		SpringApplication.run(HotelReservationApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		// 애플리케이션 시작 시 초기 관리자 계정 생성
		authService.createInitialAdmin();
		// 애플리케이션 시작 시 초기 객실 정보 생성
		roomService.createInitialRooms();
		System.out.println("=== 초기 데이터 생성 완료 ===");
		System.out.println("관리자 계정: admin / admin");
		System.out.println("고객 계정: customer / password");
		System.out.println("초기 객실 데이터가 성공적으로 생성되었습니다.");
	}
}

