package kr.or.hotelpms.hotel.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.hotelpms.hotel.dto.LoginRequest;
import kr.or.hotelpms.hotel.dto.LoginResponse;
import kr.or.hotelpms.hotel.dto.RegisterRequest;
import kr.or.hotelpms.hotel.dto.UserDto;
import kr.or.hotelpms.hotel.model.Role;
import kr.or.hotelpms.hotel.model.User;
import kr.or.hotelpms.hotel.repository.RoleRepository;
import kr.or.hotelpms.hotel.repository.UserRepository;
import kr.or.hotelpms.hotel.util.JwtUtil;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

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
        // 사용자명으로 사용자 찾기 (enabled 상태와 무관하게)
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("아이디 또는 비밀번호가 잘못되었습니다."));

        // 비밀번호 확인
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("아이디 또는 비밀번호가 잘못되었습니다.");
        }

        // 탈퇴한 사용자인 경우 특별 처리
        if (!user.getEnabled() && user.getDeletedAt() != null) {
            // 3일이 지났는지 확인
            LocalDateTime threeDaysAfterDeletion = user.getDeletedAt().plusDays(3);
            if (LocalDateTime.now().isAfter(threeDaysAfterDeletion)) {
                throw new RuntimeException("탈퇴 처리된 계정입니다. 계정이 영구적으로 삭제되었습니다.");
            } else {
                // 탈퇴 취소 가능 기간 내
                throw new RuntimeException("ACCOUNT_DELETED"); // 특별한 메시지로 프론트엔드에서 처리
            }
        }

        // 비활성화된 계정 (일반적인 비활성화)
        if (!user.getEnabled()) {
            throw new RuntimeException("비활성화된 계정입니다. 관리자에게 문의하세요.");
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

    // 비밀번호 찾기 (임시 비밀번호 발급)
    public void findPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("해당 이메일로 가입된 사용자가 없습니다."));

        // 임시 비밀번호 생성
        String tempPassword = UUID.randomUUID().toString().substring(0, 8);
        user.setPassword(passwordEncoder.encode(tempPassword));
        userRepository.save(user);

        // 이메일로 임시 비밀번호 전송
        try {
            emailService.sendTemporaryPassword(user.getEmail(), tempPassword);
        } catch (IOException e) {
            // 이메일 전송 실패 시 예외 처리 (예: 로깅)
            e.printStackTrace();
            throw new RuntimeException("임시 비밀번호 이메일 전송에 실패했습니다.");
        }
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
        // 필수 역할(Role) 찾아오기 (없으면 생성)
        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_ADMIN")));
        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_USER")));

        // 'admin' 계정 처리
        userRepository.findByUsername("admin").ifPresentOrElse(
            admin -> {
                // 계정이 존재할 경우: ADMIN 역할이 없으면 추가
                if (!admin.hasRole("ROLE_ADMIN")) {
                    admin.addRole(adminRole);
                    userRepository.save(admin);
                }
            },
            () -> {
                // 계정이 존재하지 않을 경우: 새로 생성
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
        );

        // 역할(Role) 데이터는 유지하되, 테스트 고객 계정은 생성하지 않음
        // 고객은 회원가입을 통해 계정을 생성해야 함
    }
}