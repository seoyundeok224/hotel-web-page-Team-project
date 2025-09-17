package kr.or.hotelpms.hotel.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import kr.or.hotelpms.hotel.util.JwtUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, 
                                  @NonNull HttpServletResponse response, 
                                  @NonNull FilterChain filterChain) throws ServletException, IOException {
        
        try {
            // HTTP 요청에서 JWT 토큰 추출
            String jwt = getJwtFromRequest(request);
            log.debug("Request URL: {}, JWT Token: {}", request.getRequestURI(), jwt != null ? "present" : "null");
            
            if (StringUtils.hasText(jwt) && jwtUtil.canTokenBeParsed(jwt)) {
                // 토큰에서 사용자명 추출
                String username = jwtUtil.getUsernameFromToken(jwt);
                log.debug("Username from token: {}", username);
                
                // 토큰 유효성 검증
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    log.debug("UserDetails loaded: {}", userDetails.getUsername());
                    
                    if (jwtUtil.validateToken(jwt, username)) {
                        // 인증 객체 생성 및 SecurityContext에 설정
                        UsernamePasswordAuthenticationToken authentication = 
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        log.debug("JWT 토큰으로 사용자 '{}' 인증 완료", username);
                    } else {
                        log.debug("Token validation failed for user: {}", username);
                    }
                } else {
                    log.debug("Username is null or authentication already exists");
                }
            } else {
                log.debug("JWT token is empty or cannot be parsed");
            }
        } catch (Exception e) {
            log.error("JWT 토큰 처리 중 오류 발생: {}", e.getMessage(), e);
            // 인증 실패 시 SecurityContext 초기화
            SecurityContextHolder.clearContext();
        }
        
        filterChain.doFilter(request, response);
    }

    /**
     * HTTP 요청에서 Authorization 헤더로부터 JWT 토큰 추출
     * Authorization: Bearer <token> 형태에서 토큰 부분만 추출
     */
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // "Bearer " 부분 제거하고 토큰만 반환
        }
        
        return null;
    }
}