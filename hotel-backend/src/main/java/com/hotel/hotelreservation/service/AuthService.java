package com.hotel.hotelreservation.service;

import com.hotel.hotelreservation.dto.*;
import com.hotel.hotelreservation.model.Role;
import com.hotel.hotelreservation.model.User;
import com.hotel.hotelreservation.repository.RoleRepository;
import com.hotel.hotelreservation.repository.UserRepository;
import com.hotel.hotelreservation.util.JwtUtil;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // 회원가입
    public UserDto register(RegisterRequest request) {
        // 중복 확인
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("이미 사용 중인 사용자명입니다.");
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("이미 사용 중인 이메일입니다.");
        }

        // 기본 사용자 권한 찾기 또는 생성
        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_USER")));

        // 사용자 생성
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .name(request.getName())
                .phone(request.getPhone())
                .enabled(true)
                .build();

        user.addRole(userRole);
        
        User savedUser = userRepository.save(user);
        return convertToUserDto(savedUser);
    }

    // 로그인
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsernameAndEnabled(request.getUsername(), true)
                .orElseThrow(() -> new RuntimeException("아이디 또는 비밀번호가 잘못되었습니다."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("아이디 또는 비밀번호가 잘못되었습니다.");
        }

        // 주요 권한 결정 (ADMIN이 있으면 ADMIN, 없으면 USER)
        String mainRole = user.hasRole("ROLE_ADMIN") ? "ADMIN" : "USER";
        
        // JWT 토큰 생성
        String token = jwtUtil.generateToken(user.getUsername(), mainRole);

        UserDto userDto = convertToUserDto(user);
        userDto.setRole(mainRole);

        return LoginResponse.builder()
                .user(userDto)
                .token(token)
                .build();
    }

    // 사용자명 중복 확인
    @Transactional(readOnly = true)
    public boolean isUsernameAvailable(String username) {
        return !userRepository.existsByUsername(username);
    }

    // 이메일 중복 확인
    @Transactional(readOnly = true)
    public boolean isEmailAvailable(String email) {
        return !userRepository.existsByEmail(email);
    }

    // 사용자 조회
    @Transactional(readOnly = true)
    public UserDto findByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        return convertToUserDto(user);
    }

    // User 엔티티를 UserDto로 변환
    private UserDto convertToUserDto(User user) {
        Set<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        String mainRole = user.hasRole("ROLE_ADMIN") ? "ADMIN" : "USER";

        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .name(user.getName())
                .phone(user.getPhone())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .enabled(user.getEnabled())
                .role(mainRole)
                .roles(roleNames)
                .build();
    }

    // 초기 관리자 계정 생성 (애플리케이션 시작 시)
    @Transactional
    public void createInitialAdmin() {
        if (!userRepository.existsByUsername("admin")) {
            // ADMIN 권한 생성
            Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                    .orElseGet(() -> roleRepository.save(new Role("ROLE_ADMIN")));
            
            // USER 권한 생성
            Role userRole = roleRepository.findByName("ROLE_USER")
                    .orElseGet(() -> roleRepository.save(new Role("ROLE_USER")));

            // 관리자 계정 생성
            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin"))
                    .email("admin@test.com")
                    .name("관리자")
                    .enabled(true)
                    .build();

            admin.addRole(adminRole);
            admin.addRole(userRole);
            
            userRepository.save(admin);
        }

        // 테스트 고객 계정 생성
        if (!userRepository.existsByUsername("customer")) {
            Role userRole = roleRepository.findByName("ROLE_USER")
                    .orElseGet(() -> roleRepository.save(new Role("ROLE_USER")));

            User customer = User.builder()
                    .username("customer")
                    .password(passwordEncoder.encode("password"))
                    .email("customer@test.com")
                    .name("고객")
                    .enabled(true)
                    .build();

            customer.addRole(userRole);
            userRepository.save(customer);
        }
    }
}
