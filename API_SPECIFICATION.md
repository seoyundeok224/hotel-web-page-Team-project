# 🏨 Hotel Reservation System API 명세서

## 📋 목차
1. [개요](#개요)
2. [기본 설정](#기본-설정)
3. [인증 API](#인증-api)
4. [객실 API](#객실-api)
5. [예약 API](#예약-api)
6. [후기 API](#후기-api)
7. [관리자 API](#관리자-api)
8. [알림 API](#알림-api)
9. [공통 응답 형식](#공통-응답-형식)
10. [에러 코드](#에러-코드)

---

## 📖 개요

호텔 예약 시스템의 REST API 명세서입니다. Spring Boot 기반으로 구현되었으며, JWT 토큰을 사용한 인증 시스템을 포함합니다.

### 기술 스택
- **Backend**: Spring Boot 3.x, Spring Security, Spring Data JPA
- **Database**: MariaDB
- **인증**: JWT (JSON Web Token)
- **문서화**: Swagger/OpenAPI 3.0

---

## ⚙️ 기본 설정

### Base URL
```
http://localhost:8080/api
```

### 인증 헤더
```
Authorization: Bearer {JWT_TOKEN}
```

### Content-Type
```
Content-Type: application/json
```

---

## 🔐 인증 API

### 1. 회원가입
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "password123",
  "email": "john@example.com",
  "name": "홍길동",
  "phone": "010-1234-5678"
}
```

**Response (Success):**
```json
{
  "status": "success",
  "message": "회원가입이 완료되었습니다.",
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "name": "홍길동",
    "phone": "010-1234-5678",
    "createdAt": "2024-12-15T10:30:00",
    "updatedAt": "2024-12-15T10:30:00",
    "enabled": true,
    "role": "USER",
    "roles": ["USER"]
  }
}
```

**Validation Rules:**
- `username`: 3-50자, 영문/숫자/언더스코어만 허용
- `password`: 6-100자
- `email`: 유효한 이메일 형식, 최대 100자
- `name`: 2-100자
- `phone`: 한국 휴대폰 번호 형식 (010-XXXX-XXXX)

---

### 2. 로그인
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "status": "success",
  "message": "로그인 성공",
  "data": {
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "name": "홍길동",
      "phone": "010-1234-5678",
      "role": "USER",
      "roles": ["USER"]
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 86400
  }
}
```

---

### 3. 사용자명 중복 확인
```http
GET /api/auth/check-username?username=john_doe
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "available": false
  }
}
```

---

### 4. 이메일 중복 확인
```http
GET /api/auth/check-email?email=john@example.com
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "available": true
  }
}
```

---

### 5. 현재 사용자 정보 조회
```http
GET /api/auth/me
```
*🔒 인증 필요*

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "name": "홍길동",
    "phone": "010-1234-5678",
    "createdAt": "2024-12-15T10:30:00",
    "role": "USER",
    "roles": ["USER"]
  }
}
```

---

## 🏠 객실 API

### 1. 객실 목록 조회
```http
GET /api/rooms
```

**Query Parameters:**
- `page` (optional): 페이지 번호 (default: 0)
- `size` (optional): 페이지 크기 (default: 10)
- `roomType` (optional): 객실 타입 (STANDARD, DELUXE, SUITE, FAMILY, CONFERENCE)
- `status` (optional): 객실 상태 (AVAILABLE, OCCUPIED, MAINTENANCE, CLEANING)
- `minPrice` (optional): 최소 가격
- `maxPrice` (optional): 최대 가격
- `checkIn` (optional): 체크인 날짜 (yyyy-MM-dd)
- `checkOut` (optional): 체크아웃 날짜 (yyyy-MM-dd)

**Response:**
```json
{
  "status": "success",
  "data": {
    "content": [
      {
        "id": 1,
        "roomNumber": "101",
        "roomType": "STANDARD",
        "status": "AVAILABLE",
        "price": 120000,
        "capacity": 2,
        "floor": 1,
        "description": "편안한 스탠다드 룸",
        "amenities": ["에어컨", "WiFi", "TV", "냉장고"],
        "images": [
          "https://example.com/room1-1.jpg",
          "https://example.com/room1-2.jpg"
        ]
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 10,
      "totalElements": 50,
      "totalPages": 5
    }
  }
}
```

---

### 2. 객실 상세 조회
```http
GET /api/rooms/{roomId}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "roomNumber": "101",
    "roomType": "STANDARD",
    "status": "AVAILABLE",
    "price": 120000,
    "capacity": 2,
    "floor": 1,
    "description": "편안한 스탠다드 룸입니다. 도시 전망과 함께 편안한 휴식을 제공합니다.",
    "amenities": ["에어컨", "WiFi", "TV", "냉장고", "헤어드라이어"],
    "images": [
      "https://example.com/room1-1.jpg",
      "https://example.com/room1-2.jpg",
      "https://example.com/room1-3.jpg"
    ],
    "createdAt": "2024-01-01T00:00:00",
    "updatedAt": "2024-12-15T10:30:00"
  }
}
```

---

### 3. 객실 가용성 확인
```http
GET /api/rooms/{roomId}/availability?checkIn=2024-12-20&checkOut=2024-12-25
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "available": true,
    "roomId": 1,
    "checkIn": "2024-12-20",
    "checkOut": "2024-12-25",
    "totalPrice": 600000,
    "nights": 5
  }
}
```

---

## 📅 예약 API

### 1. 예약 생성
```http
POST /api/reservations
```
*🔒 인증 필요*

**Request Body:**
```json
{
  "roomId": 1,
  "checkInDate": "2024-12-20",
  "checkOutDate": "2024-12-25",
  "guestCount": 2,
  "specialRequests": "늦은 체크인 희망",
  "guestDetails": {
    "name": "홍길동",
    "phone": "010-1234-5678",
    "email": "hong@example.com"
  }
}
```

**Response:**
```json
{
  "status": "success",
  "message": "예약이 완료되었습니다.",
  "data": {
    "id": 1001,
    "reservationNumber": "RES-2024-001001",
    "userId": 1,
    "roomId": 1,
    "checkInDate": "2024-12-20",
    "checkOutDate": "2024-12-25",
    "guestCount": 2,
    "totalPrice": 600000,
    "status": "CONFIRMED",
    "specialRequests": "늦은 체크인 희망",
    "guestDetails": {
      "name": "홍길동",
      "phone": "010-1234-5678",
      "email": "hong@example.com"
    },
    "room": {
      "roomNumber": "101",
      "roomType": "STANDARD"
    },
    "createdAt": "2024-12-15T10:30:00"
  }
}
```

---

### 2. 예약 목록 조회
```http
GET /api/reservations
```
*🔒 인증 필요*

**Query Parameters:**
- `page` (optional): 페이지 번호
- `size` (optional): 페이지 크기
- `status` (optional): 예약 상태 (PENDING, CONFIRMED, CANCELLED, COMPLETED)

**Response:**
```json
{
  "status": "success",
  "data": {
    "content": [
      {
        "id": 1001,
        "reservationNumber": "RES-2024-001001",
        "checkInDate": "2024-12-20",
        "checkOutDate": "2024-12-25",
        "guestCount": 2,
        "totalPrice": 600000,
        "status": "CONFIRMED",
        "room": {
          "roomNumber": "101",
          "roomType": "STANDARD"
        },
        "createdAt": "2024-12-15T10:30:00"
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 10,
      "totalElements": 5,
      "totalPages": 1
    }
  }
}
```

---

### 3. 예약 상세 조회
```http
GET /api/reservations/{reservationId}
```
*🔒 인증 필요*

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": 1001,
    "reservationNumber": "RES-2024-001001",
    "userId": 1,
    "roomId": 1,
    "checkInDate": "2024-12-20",
    "checkOutDate": "2024-12-25",
    "guestCount": 2,
    "totalPrice": 600000,
    "status": "CONFIRMED",
    "specialRequests": "늦은 체크인 희망",
    "guestDetails": {
      "name": "홍길동",
      "phone": "010-1234-5678",
      "email": "hong@example.com"
    },
    "room": {
      "id": 1,
      "roomNumber": "101",
      "roomType": "STANDARD",
      "price": 120000
    },
    "user": {
      "id": 1,
      "username": "john_doe",
      "name": "홍길동"
    },
    "createdAt": "2024-12-15T10:30:00",
    "updatedAt": "2024-12-15T10:30:00"
  }
}
```

---

### 4. 예약 취소
```http
DELETE /api/reservations/{reservationId}
```
*🔒 인증 필요*

**Response:**
```json
{
  "status": "success",
  "message": "예약이 취소되었습니다.",
  "data": {
    "id": 1001,
    "status": "CANCELLED",
    "cancelledAt": "2024-12-15T11:00:00"
  }
}
```

---

## ⭐ 후기 API

### 1. 후기 작성
```http
POST /api/reviews
```
*🔒 인증 필요*

**Request Body:**
```json
{
  "reservationId": 1001,
  "rating": 5,
  "title": "최고의 숙박 경험",
  "content": "정말 좋았습니다. 직원분들도 친절하고 객실도 깨끗했어요.",
  "anonymous": false
}
```

**Response:**
```json
{
  "status": "success",
  "message": "후기가 등록되었습니다.",
  "data": {
    "id": 101,
    "userId": 1,
    "reservationId": 1001,
    "roomId": 1,
    "rating": 5,
    "title": "최고의 숙박 경험",
    "content": "정말 좋았습니다. 직원분들도 친절하고 객실도 깨끗했어요.",
    "anonymous": false,
    "createdAt": "2024-12-15T12:00:00",
    "user": {
      "name": "홍길동"
    },
    "room": {
      "roomNumber": "101",
      "roomType": "STANDARD"
    }
  }
}
```

---

### 2. 후기 목록 조회
```http
GET /api/reviews
```

**Query Parameters:**
- `page` (optional): 페이지 번호
- `size` (optional): 페이지 크기
- `roomId` (optional): 객실 ID 필터
- `rating` (optional): 평점 필터 (1-5)
- `sortBy` (optional): 정렬 기준 (createdAt, rating)
- `sortDir` (optional): 정렬 방향 (asc, desc)

**Response:**
```json
{
  "status": "success",
  "data": {
    "content": [
      {
        "id": 101,
        "rating": 5,
        "title": "최고의 숙박 경험",
        "content": "정말 좋았습니다. 직원분들도 친절하고 객실도 깨끗했어요.",
        "anonymous": false,
        "createdAt": "2024-12-15T12:00:00",
        "user": {
          "name": "홍길동"
        },
        "room": {
          "roomNumber": "101",
          "roomType": "STANDARD"
        }
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 10,
      "totalElements": 25,
      "totalPages": 3
    },
    "averageRating": 4.2,
    "totalReviews": 25
  }
}
```

---

### 3. 후기 삭제
```http
DELETE /api/reviews/{reviewId}
```
*🔒 인증 필요 (작성자 또는 관리자)*

---

## 👨‍💼 관리자 API

### 1. 전체 예약 관리
```http
GET /api/admin/reservations
```
*🔒 관리자 권한 필요*

**Query Parameters:**
- `page`, `size`: 페이징
- `status`: 예약 상태 필터
- `roomId`: 객실 ID 필터
- `userId`: 사용자 ID 필터
- `dateFrom`, `dateTo`: 날짜 범위 필터

---

### 2. 객실 관리 (생성)
```http
POST /api/admin/rooms
```
*🔒 관리자 권한 필요*

**Request Body:**
```json
{
  "roomNumber": "201",
  "roomType": "DELUXE",
  "price": 180000,
  "capacity": 3,
  "floor": 2,
  "description": "고급 디럭스 룸",
  "amenities": ["에어컨", "WiFi", "TV", "냉장고", "미니바", "발코니"]
}
```

---

### 3. 객실 상태 업데이트
```http
PUT /api/admin/rooms/{roomId}/status
```
*🔒 관리자 권한 필요*

**Request Body:**
```json
{
  "status": "MAINTENANCE",
  "reason": "정기 점검"
}
```

---

### 4. 사용자 관리
```http
GET /api/admin/users
```
*🔒 관리자 권한 필요*

---

### 5. 대시보드 통계
```http
GET /api/admin/dashboard/stats
```
*🔒 관리자 권한 필요*

**Response:**
```json
{
  "status": "success",
  "data": {
    "totalReservations": 1250,
    "totalRevenue": 150000000,
    "occupancyRate": 85.5,
    "averageRating": 4.3,
    "monthlyStats": [
      {
        "month": "2024-12",
        "reservations": 120,
        "revenue": 14000000,
        "occupancyRate": 88.2
      }
    ],
    "popularRoomTypes": [
      {
        "roomType": "STANDARD",
        "count": 450,
        "percentage": 36.0
      }
    ]
  }
}
```

---

## 🔔 알림 API

### 1. 알림 목록 조회
```http
GET /api/notifications
```
*🔒 인증 필요*

**Response:**
```json
{
  "status": "success",
  "data": {
    "content": [
      {
        "id": 501,
        "type": "RESERVATION_CONFIRMED",
        "title": "예약 확인",
        "message": "2024-12-20 체크인 예약이 확인되었습니다.",
        "read": false,
        "createdAt": "2024-12-15T10:30:00",
        "relatedId": 1001,
        "relatedType": "RESERVATION"
      }
    ],
    "unreadCount": 3
  }
}
```

---

### 2. 알림 읽음 처리
```http
PUT /api/notifications/{notificationId}/read
```
*🔒 인증 필요*

---

## 📋 공통 응답 형식

### 성공 응답
```json
{
  "status": "success",
  "data": { /* 응답 데이터 */ },
  "message": "작업이 완료되었습니다."
}
```

### 에러 응답
```json
{
  "status": "error",
  "message": "에러 메시지",
  "errors": [
    {
      "field": "username",
      "message": "사용자명은 필수입니다."
    }
  ]
}
```

### 페이징 응답
```json
{
  "content": [/* 데이터 배열 */],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "totalElements": 100,
    "totalPages": 10,
    "first": true,
    "last": false
  }
}
```

---

## ❌ 에러 코드

| HTTP Status | Error Code | 설명 |
|-------------|------------|------|
| 400 | BAD_REQUEST | 잘못된 요청 |
| 401 | UNAUTHORIZED | 인증 실패 |
| 403 | FORBIDDEN | 권한 없음 |
| 404 | NOT_FOUND | 리소스를 찾을 수 없음 |
| 409 | CONFLICT | 중복된 리소스 |
| 422 | VALIDATION_FAILED | 유효성 검사 실패 |
| 500 | INTERNAL_SERVER_ERROR | 서버 에러 |

### 비즈니스 에러 코드

| Code | 설명 |
|------|------|
| USER_NOT_FOUND | 사용자를 찾을 수 없음 |
| INVALID_CREDENTIALS | 잘못된 인증 정보 |
| USERNAME_ALREADY_EXISTS | 이미 존재하는 사용자명 |
| EMAIL_ALREADY_EXISTS | 이미 존재하는 이메일 |
| ROOM_NOT_AVAILABLE | 객실을 예약할 수 없음 |
| RESERVATION_NOT_FOUND | 예약을 찾을 수 없음 |
| CANNOT_CANCEL_RESERVATION | 예약을 취소할 수 없음 |
| REVIEW_ALREADY_EXISTS | 이미 후기를 작성함 |

---

## 📝 참고사항

1. **인증**: JWT 토큰을 Authorization 헤더에 포함하여 전송
2. **CORS**: 프론트엔드 도메인(`http://localhost:5173`, `http://localhost:5174`)에서의 요청 허용
3. **Rate Limiting**: API 호출 횟수 제한 (분당 100회)
4. **Validation**: 모든 입력 데이터에 대한 유효성 검사 수행
5. **Timezone**: 모든 날짜/시간은 Asia/Seoul 기준

---

## 🔄 버전 정보

- **API Version**: v1.0
- **Last Updated**: 2024-12-15
- **Spring Boot Version**: 3.5.5
- **Java Version**: 21

---

*이 문서는 프로젝트 진행에 따라 지속적으로 업데이트됩니다.*