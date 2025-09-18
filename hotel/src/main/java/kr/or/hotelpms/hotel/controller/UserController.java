package kr.or.hotelpms.hotel.controller;

import kr.or.hotelpms.hotel.dto.*;
import kr.or.hotelpms.hotel.service.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 테스트 엔드포인트
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("User Controller Test Success");
    }

    // 현재 사용자 프로필 조회
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserDto>> getProfile() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            
            UserDto user = userService.getUserProfile(username);
            return ResponseEntity.ok(ApiResponse.success(user));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // 사용자 프로필 수정
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserDto>> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            
            UserDto updatedUser = userService.updateProfile(username, request);
            return ResponseEntity.ok(ApiResponse.success(updatedUser, "프로필이 수정되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // 비밀번호 변경
    @PutMapping("/password")
    public ResponseEntity<ApiResponse<String>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            
            userService.changePassword(username, request);
            return ResponseEntity.ok(ApiResponse.success("SUCCESS", "비밀번호가 변경되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // 회원 탈퇴
    @DeleteMapping("/account")
    public ResponseEntity<ApiResponse<String>> deleteAccount(@Valid @RequestBody DeleteAccountRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            
            userService.deleteAccount(username, request.getPassword());
            return ResponseEntity.ok(ApiResponse.success("SUCCESS", "회원 탈퇴가 완료되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // 회원 탈퇴 취소
    @PostMapping("/account/cancel-deletion")
    public ResponseEntity<ApiResponse<String>> cancelAccountDeletion(@Valid @RequestBody DeleteAccountRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            
            userService.cancelAccountDeletion(username, request.getPassword());
            return ResponseEntity.ok(ApiResponse.success("SUCCESS", "탈퇴 취소가 완료되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // ✅ 아이디 찾기
    @PostMapping("/find-username")
    public ResponseEntity<ApiResponse<String>> findUsername(@RequestBody FindUsernameRequest request) {
        try {
            String username = userService.findUsernameByEmailAndName(request.getEmail(), request.getName());
            return ResponseEntity.ok(ApiResponse.success(username, "아이디 찾기 성공"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}