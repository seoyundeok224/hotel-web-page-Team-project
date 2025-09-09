
package com.hotel.hotelreservation.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
			.csrf(csrf -> csrf.disable())
			.authorizeHttpRequests(auth -> auth
				.anyRequest().permitAll()
			)
			.cors(cors -> cors.disable());

		return http.build();
	}
}

// Spring Security 설정 클래스 //
// 권장 (보안 필수 시) 만들어야 함 //
// 난이도: 중급(스프링 시큐리티 설정) //

// 백앤드 - 보안 설정
// Spring Security 설정 (인증 필터, 권한, CORS 정책 설정)
// 프론트엔드 React 앱에서 오는 요청을 허용하기 위한 CORS 설정 매우 중요
