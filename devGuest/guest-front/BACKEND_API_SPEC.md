# Spring Boot 백엔드 API 명세서

## 인증 관련 API

### 1. 회원가입
- **URL**: `POST /api/auth/register`
- **Description**: 새 사용자를 등록합니다.
- **Request Body**:
```json
{
  "username": "string (3자 이상, 고유값)",
  "password": "string (6자 이상)",
  "email": "string (이메일 형식, 고유값)",
  "name": "string (2자 이상)",
  "phone": "string (선택사항)"
}
```
- **Response**:
```json
{
  "data": {
    "id": "number",
    "username": "string",
    "email": "string",
    "name": "string",
    "phone": "string",
    "enabled": true,
    "roles": ["ROLE_USER"]
  },
  "message": "회원가입이 완료되었습니다."
}
```

### 2. 로그인
- **URL**: `POST /api/auth/login`
- **Description**: 사용자 로그인을 처리합니다.
- **Request Body**:
```json
{
  "username": "string",
  "password": "string"
}
```
- **Response**:
```json
{
  "data": {
    "user": {
      "id": "number",
      "username": "string",
      "name": "string",
      "email": "string",
      "role": "string (USER 또는 ADMIN)"
    },
    "token": "string (JWT 토큰)"
  }
}
```

### 3. 사용자명 중복 확인
- **URL**: `GET /api/auth/check-username?username={username}`
- **Description**: 사용자명 중복 여부를 확인합니다.
- **Response**:
```json
{
  "data": {
    "available": "boolean"
  }
}
```

### 4. 이메일 중복 확인
- **URL**: `GET /api/auth/check-email?email={email}`
- **Description**: 이메일 중복 여부를 확인합니다.
- **Response**:
```json
{
  "data": {
    "available": "boolean"
  }
}
```

## 데이터베이스 스키마

### users 테이블
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    enabled BOOLEAN DEFAULT TRUE
);
```

### roles 테이블
```sql
CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- 기본 권한 데이터
INSERT INTO roles (name) VALUES ('ROLE_USER');
INSERT INTO roles (name) VALUES ('ROLE_ADMIN');
```

### user_roles 테이블
```sql
CREATE TABLE user_roles (
    user_id BIGINT,
    role_id BIGINT,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);
```

## Spring Boot 구현 예시

### UserController.java
```java
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5174")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            User user = userService.register(request);
            return ResponseEntity.ok(new ApiResponse("success", user, "회원가입이 완료되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse("error", null, e.getMessage()));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            LoginResponse response = userService.login(request);
            return ResponseEntity.ok(new ApiResponse("success", response, "로그인 성공"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse("error", null, e.getMessage()));
        }
    }
    
    @GetMapping("/check-username")
    public ResponseEntity<?> checkUsername(@RequestParam String username) {
        boolean available = userService.isUsernameAvailable(username);
        return ResponseEntity.ok(new ApiResponse("success", 
            Map.of("available", available), null));
    }
    
    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        boolean available = userService.isEmailAvailable(email);
        return ResponseEntity.ok(new ApiResponse("success", 
            Map.of("available", available), null));
    }
}
```

### DTO 클래스들
```java
// RegisterRequest.java
public class RegisterRequest {
    private String username;
    private String password;
    private String email;
    private String name;
    private String phone;
    // getters and setters
}

// LoginRequest.java
public class LoginRequest {
    private String username;
    private String password;
    // getters and setters
}

// LoginResponse.java
public class LoginResponse {
    private UserDto user;
    private String token;
    // getters and setters
}

// ApiResponse.java
public class ApiResponse {
    private String status;
    private Object data;
    private String message;
    // constructors, getters and setters
}
```
