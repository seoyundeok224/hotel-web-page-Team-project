package kr.or.hotelpms.hotel;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import io.github.cdimascio.dotenv.Dotenv;
import kr.or.hotelpms.hotel.service.AuthService;
import kr.or.hotelpms.hotel.service.RoomService;
import lombok.RequiredArgsConstructor;

@SpringBootApplication
@EnableScheduling
@RequiredArgsConstructor
public class HotelReservationApplication implements CommandLineRunner {

	private final AuthService authService;
	private final RoomService roomService;

	public static void main(String[] args) {
		// .env 파일 로드하여 환경 변수를 시스템 프로퍼티로 설정
		try {
			// hotel 디렉토리 경로 찾기
			String currentDir = System.getProperty("user.dir");
			String envDir = currentDir.endsWith("hotel") ? currentDir : currentDir + "/hotel";
			
			Dotenv dotenv = Dotenv.configure()
					.directory(envDir)
					.ignoreIfMissing()
					.load();
			
			// 환경 변수를 시스템 프로퍼티로 설정
			dotenv.entries().forEach(entry -> 
				System.setProperty(entry.getKey(), entry.getValue())
			);
			
			System.out.println("Environment variables loaded successfully from: " + envDir);
		} catch (Exception e) {
			System.err.println("Failed to load .env file: " + e.getMessage());
			System.err.println("Working directory: " + System.getProperty("user.dir"));
		}
		
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
		System.out.println("고객은 회원가입을 통해 계정을 생성하세요.");
		System.out.println("초기 객실 데이터가 성공적으로 생성되었습니다.");
	}
}

