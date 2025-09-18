package kr.or.hotelpms.hotel.controller;

import kr.or.hotelpms.hotel.dto.*;
import kr.or.hotelpms.hotel.service.AuthService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // 회원가입
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserDto>> register(@Valid @RequestBody RegisterRequest request) {
        try {
            UserDto user = authService.register(request);
            return ResponseEntity.ok(ApiResponse.success(user, "회원가입이 완료되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.login(request);
            return ResponseEntity.ok(ApiResponse.success(response, "로그인 성공"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // 비밀번호 찾기
    @PostMapping("/find-password")
    public ResponseEntity<ApiResponse<Void>> findPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            authService.findPassword(email);
            return ResponseEntity.ok(ApiResponse.success(null, "임시 비밀번호가 이메일로 전송되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // 사용자명 중복 확인
    @GetMapping("/check-username")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> checkUsername(@RequestParam("username") String username) {
        try {
            boolean available = authService.isUsernameAvailable(username);
            return ResponseEntity.ok(ApiResponse.success(
                Map.of("available", available)
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // 이메일 중복 확인
    @GetMapping("/check-email")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> checkEmail(@RequestParam("email") String email) {
        try {
            boolean available = authService.isEmailAvailable(email);
            return ResponseEntity.ok(ApiResponse.success(
                Map.of("available", available)
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // 현재 사용자 정보 조회 (JWT 인증 필요)
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser() {
        try {
            // SecurityContext에서 인증된 사용자 정보 가져오기
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            
            UserDto user = authService.findByUsername(username);
            return ResponseEntity.ok(ApiResponse.success(user));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}