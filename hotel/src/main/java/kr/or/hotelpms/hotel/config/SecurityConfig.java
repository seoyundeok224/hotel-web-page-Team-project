package kr.or.hotelpms.hotel.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod; // HttpMethod import
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import kr.or.hotelpms.hotel.security.CustomUserDetailsService;
import kr.or.hotelpms.hotel.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf
                // CSRF 보호 비활성화 (포트원 결제 API 호출을 위해)
                .disable()
            )
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // CORS 설정 적용
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // 세션 비활성화
            .headers(headers -> headers
                // 포트원 결제창을 iframe으로 사용할 수 있도록 허용
                .frameOptions(frameOptions -> frameOptions.sameOrigin())
                // Content Security Policy 헤더 설정
                .contentSecurityPolicy(csp -> csp
                    .policyDirectives("frame-ancestors 'self' https://*.portone.io https://checkout.portone.io")
                )
            )
            .authorizeHttpRequests(auth -> auth
                // 공개적으로 접근 가능한 경로들
                .requestMatchers("/api/auth/**", "/api/users/find-username").permitAll()
                .requestMatchers("/actuator/**").permitAll()
                // 포트원 결제 관련 경로 허용
                .requestMatchers("/api/payment/**").permitAll()
                .requestMatchers("/api/payments/**").permitAll()
                .requestMatchers("/portone/**").permitAll()
                .requestMatchers("/webhook/**").permitAll()
                // GET 방식으로 /api/reviews를 요청하는 것은 누구나 허용
                .requestMatchers(HttpMethod.GET, "/api/reviews").permitAll()
                // 나머지 모든 /api/** 경로의 요청은 인증(로그인)이 필요함
                .requestMatchers("/api/**").authenticated()
                // 그 외 모든 요청(React의 정적 파일 등)은 일단 허용
                .anyRequest().permitAll()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // 프론트엔드 주소와 포트원 관련 도메인을 허용
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:5173",
            "https://api.portone.io",
            "https://service.portone.io",
            "https://checkout.portone.io",
            "https://*.portone.io"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        // Preflight 요청에 대한 캐시 시간 설정
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // 모든 경로에 대해 CORS 정책을 적용 (포트원 결제 요청 포함)
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}