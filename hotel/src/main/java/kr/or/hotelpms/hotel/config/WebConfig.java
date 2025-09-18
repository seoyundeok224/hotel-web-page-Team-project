package kr.or.hotelpms.hotel.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // "/api/"로 시작하는 모든 요청에 대해
                .allowedOrigins("http://localhost:5173") // 프론트엔드 주소(5173)에서의 요청을 허용
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 허용할 HTTP 메소드 종류
                .allowedHeaders("*") // 모든 종류의 헤더를 허용 (Authorization 헤더 포함)
                .allowCredentials(true) // 쿠키나 인증 정보를 함께 보낼 수 있도록 허용
                .maxAge(3600); // pre-flight 요청 결과를 3600초(1시간) 동안 캐싱
    }
}
