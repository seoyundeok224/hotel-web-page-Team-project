package kr.or.hotelpms.hotel.service;

import kr.or.hotelpms.hotel.dto.*;
import kr.or.hotelpms.hotel.model.User;
import kr.or.hotelpms.hotel.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // 사용자 프로필 조회
    @Transactional(readOnly = true)
    public UserDto getUserProfile(String username) {
        System.out.println("UserService.getUserProfile called with username: " + username);
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + username));
        
        System.out.println("User found: " + user.getUsername() + ", enabled: " + user.getEnabled());
        return convertToUserDto(user);
    }

    // 사용자 프로필 수정
    public UserDto updateProfile(String username, UpdateProfileRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // 이메일 중복 확인 (자신의 이메일이 아닌 경우에만)
        if (!user.getEmail().equals(request.getEmail()) && 
            userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("이미 사용 중인 이메일입니다.");
        }

        // 사용자 정보 업데이트
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());

        User updatedUser = userRepository.save(user);
        return convertToUserDto(updatedUser);
    }

    // 비밀번호 변경
    public void changePassword(String username, ChangePasswordRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // 현재 비밀번호 확인
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("현재 비밀번호가 일치하지 않습니다.");
        }

        // 새 비밀번호와 확인 비밀번호 일치 확인
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
        }

        // 비밀번호 업데이트
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    // 회원 탈퇴
    public void deleteAccount(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // 비밀번호 확인
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        // 사용자 계정 비활성화 (완전 삭제 대신)
        user.setEnabled(false);
        userRepository.save(user);
    }

    // ✅ 아이디 찾기 (이메일 + 이름으로 username 조회)
    @Transactional(readOnly = true)
    public String findUsernameByEmailAndName(String email, String name) {
        User user = userRepository.findByEmailAndName(email, name)
                .orElseThrow(() -> new RuntimeException("해당 정보로 가입된 사용자를 찾을 수 없습니다."));
        return user.getUsername();
    }

    // User 엔티티를 UserDto로 변환
    private UserDto convertToUserDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setUsername(user.getUsername());
        userDto.setEmail(user.getEmail());
        userDto.setName(user.getName());
        userDto.setPhone(user.getPhone());
        userDto.setEnabled(user.getEnabled());
        userDto.setCreatedAt(user.getCreatedAt());
        userDto.setUpdatedAt(user.getUpdatedAt());
        
        // 권한 설정
        Set<String> roles = user.getRoles().stream()
                .map(role -> role.getName())
                .collect(Collectors.toSet());
        userDto.setRoles(roles);
        
        return userDto;
    }
}