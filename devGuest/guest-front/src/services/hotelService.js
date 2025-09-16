import { apiGet, apiPost, apiPut, apiDelete } from './api';

// 대시보드 관련 서비스
export const dashboardService = {
  // 대시보드 통계 데이터 가져오기
  getStats: async () => {
    try {
      // 실제 API 호출 대신 더미 데이터 반환
      return {
        data: {
          totalRooms: 120,
          availableRooms: 85,
          occupiedRooms: 35,
          occupancyRate: 29,
          totalGuests: 87,
          totalReservations: 156,
          confirmedReservations: 142
        }
      };
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      throw error;
    }
  },

  // 오늘의 활동 데이터 가져오기
  getTodayActivities: async () => {
    try {
      return {
        data: {
          checkIns: [
            {
              guest: { name: '김철수' },
              room: { roomNumber: '101' }
            },
            {
              guest: { name: '이영희' },
              room: { roomNumber: '205' }
            }
          ],
          checkOuts: [
            {
              guest: { name: '박민수' },
              room: { roomNumber: '312' }
            }
          ]
        }
      };
    } catch (error) {
      console.error('Failed to fetch today activities:', error);
      throw error;
    }
  },

  // 객실 상태 요약 가져오기
  getRoomStatusSummary: async () => {
    try {
      return {
        data: {
          'AVAILABLE': 85,
          'OCCUPIED': 35,
          'MAINTENANCE': 0,
          'CLEANING': 0
        }
      };
    } catch (error) {
      console.error('Failed to fetch room status summary:', error);
      throw error;
    }
  }
};

// 객실 관련 서비스
export const roomService = {
  // 모든 객실 가져오기
  getAllRooms: async () => {
    try {
      // 실제 API 호출: return apiGet('/rooms');
      // 더미 데이터 반환
      return {
        data: generateDummyRooms()
      };
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
      throw error;
    }
  },

  // 객실 생성
  createRoom: async (roomData) => {
    try {
      // return apiPost('/rooms', roomData);
      console.log('Creating room:', roomData);
      return { data: { ...roomData, id: Date.now() } };
    } catch (error) {
      console.error('Failed to create room:', error);
      throw error;
    }
  },

  // 객실 업데이트
  updateRoom: async (roomId, roomData) => {
    try {
      // return apiPut(`/rooms/${roomId}`, roomData);
      console.log('Updating room:', roomId, roomData);
      return { data: { ...roomData, id: roomId } };
    } catch (error) {
      console.error('Failed to update room:', error);
      throw error;
    }
  },

  // 객실 상태 변경
  updateRoomStatus: async (roomId, status) => {
    try {
      // return apiPut(`/rooms/${roomId}/status`, { status });
      console.log('Updating room status:', roomId, status);
      return { data: { id: roomId, status } };
    } catch (error) {
      console.error('Failed to update room status:', error);
      throw error;
    }
  },

  // 객실 삭제
  deleteRoom: async (roomId) => {
    try {
      // return apiDelete(`/rooms/${roomId}`);
      console.log('Deleting room:', roomId);
      return { success: true };
    } catch (error) {
      console.error('Failed to delete room:', error);
      throw error;
    }
  }
};

// 고객 관련 서비스
export const guestService = {
  // 모든 고객 가져오기
  getAllGuests: async () => {
    try {
      // return apiGet('/guests');
      return { data: [] }; // 더미 데이터
    } catch (error) {
      console.error('Failed to fetch guests:', error);
      throw error;
    }
  },

  // 고객 생성
  createGuest: async (guestData) => {
    try {
      // return apiPost('/guests', guestData);
      return { data: { ...guestData, id: Date.now() } };
    } catch (error) {
      console.error('Failed to create guest:', error);
      throw error;
    }
  },

  // 고객 업데이트
  updateGuest: async (guestId, guestData) => {
    try {
      // return apiPut(`/guests/${guestId}`, guestData);
      return { data: { ...guestData, id: guestId } };
    } catch (error) {
      console.error('Failed to update guest:', error);
      throw error;
    }
  }
};

// 예약 관련 서비스
export const reservationService = {
  // 모든 예약 가져오기
  getAllReservations: async () => {
    try {
      // return apiGet('/reservations');
      return { data: [] }; // 더미 데이터
    } catch (error) {
      console.error('Failed to fetch reservations:', error);
      throw error;
    }
  },

  // 예약 생성
  createReservation: async (reservationData) => {
    try {
      // return apiPost('/reservations', reservationData);
      return { data: { ...reservationData, id: Date.now() } };
    } catch (error) {
      console.error('Failed to create reservation:', error);
      throw error;
    }
  },

  // 예약 업데이트
  updateReservation: async (reservationId, reservationData) => {
    try {
      // return apiPut(`/reservations/${reservationId}`, reservationData);
      return { data: { ...reservationData, id: reservationId } };
    } catch (error) {
      console.error('Failed to update reservation:', error);
      throw error;
    }
  },

  // 예약 취소
  cancelReservation: async (reservationId) => {
    try {
      // return apiPut(`/reservations/${reservationId}/cancel`);
      return { success: true };
    } catch (error) {
      console.error('Failed to cancel reservation:', error);
      throw error;
    }
  }
};

// 인증 관련 서비스
export const authService = {
  // 회원가입
  register: async (userData) => {
    try {
      // 실제 Spring Boot API 호출
      return apiPost('/auth/register', {
        username: userData.username,
        password: userData.password,
        email: userData.email,
        name: userData.name,
        phone: userData.phone
      });
    } catch (error) {
      console.error('Failed to register user:', error);

      // 개발 중에는 더미 응답 반환
      if (process.env.NODE_ENV === 'development') {
        console.log('Using dummy response for registration:', userData);
        return {
          data: {
            id: Date.now(),
            username: userData.username,
            email: userData.email,
            name: userData.name,
            phone: userData.phone,
            enabled: true,
            roles: ['ROLE_USER']
          },
          message: '회원가입이 완료되었습니다.'
        };
      }
      throw error;
    }
  },

  // 로그인
  login: async (credentials) => {
    try {
      // 실제 Spring Boot API 호출
      return apiPost('/auth/login', {
        username: credentials.username,
        password: credentials.password
      });
    } catch (error) {
      console.error('Failed to login:', error);

      // 개발 중에는 더미 로그인 로직
      if (process.env.NODE_ENV === 'development') {
        console.log('Using dummy response for login:', credentials);

        if (credentials.username === 'admin' && credentials.password === 'admin') {
          return {
            data: {
              user: {
                id: 1,
                username: 'admin',
                name: '관리자',
                email: 'admin@test.com',
                role: 'ADMIN'
              },
              token: 'admin-jwt-token'
            }
          };
        } else if (credentials.username === 'customer' && credentials.password === 'password') {
          return {
            data: {
              user: {
                id: 2,
                username: 'customer',
                name: '고객',
                email: 'customer@test.com',
                role: 'USER'
              },
              token: 'customer-jwt-token'
            }
          };
        } else {
          throw new Error('아이디 또는 비밀번호가 잘못되었습니다.');
        }
      }
      throw error;
    }
  },

  // 사용자명 중복 확인
  checkUsername: async (username) => {
    try {
      // 실제 Spring Boot API 호출
      return apiGet(`/auth/check-username?username=${encodeURIComponent(username)}`);
    } catch (error) {
      console.error('Failed to check username:', error);

      // 개발 중에는 더미 중복 확인
      if (process.env.NODE_ENV === 'development') {
        console.log('Using dummy response for username check:', username);
        const existingUsernames = ['admin', 'customer', 'test', 'user'];
        const isAvailable = !existingUsernames.includes(username.toLowerCase());

        return {
          data: {
            available: isAvailable
          }
        };
      }
      throw error;
    }
  },

  // 이메일 중복 확인
  checkEmail: async (email) => {
    try {
      // 실제 Spring Boot API 호출
      return apiGet(`/auth/check-email?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error('Failed to check email:', error);

      // 개발 중에는 더미 중복 확인
      if (process.env.NODE_ENV === 'development') {
        console.log('Using dummy response for email check:', email);
        const existingEmails = ['admin@test.com', 'customer@test.com'];
        const isAvailable = !existingEmails.includes(email.toLowerCase());

        return {
          data: {
            available: isAvailable
          }
        };
      }
      throw error;
    }
  }
};

// 사용자 관련 서비스
export const userService = {
  // 사용자 프로필 조회
  getProfile: async () => {
    try {
      return apiGet('/users/profile');
    } catch (error) {
      console.error('Failed to get user profile:', error);
      throw error;
    }
  },

  // 사용자 프로필 수정
  updateProfile: async (profileData) => {
    try {
      return apiPut('/users/profile', {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  },

  // 비밀번호 변경
  changePassword: async (passwordData) => {
    try {
      return apiPut('/users/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      });
    } catch (error) {
      console.error('Failed to change password:', error);
      throw error;
    }
  },

  // 회원 탈퇴
  deleteAccount: async (requestData) => {
    try {
      return apiDelete('/users/account', requestData);
    } catch (error) {
      console.error('Failed to delete account:', error);
      throw error;
    }
  }
};

// 더미 객실 데이터 생성 함수
const generateDummyRooms = () => {
  const rooms = [];
  const roomTypes = ['SINGLE', 'DOUBLE', 'SUITE', 'DELUXE'];
  const statuses = ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'CLEANING'];
  const prices = { SINGLE: 80000, DOUBLE: 120000, SUITE: 200000, DELUXE: 150000 };
  const capacities = { SINGLE: 1, DOUBLE: 2, SUITE: 4, DELUXE: 3 };

  for (let floor = 1; floor <= 5; floor++) {
    for (let room = 1; room <= 24; room++) {
      const roomNumber = `${floor}${room.toString().padStart(2, '0')}`;
      const roomType = roomTypes[Math.floor(Math.random() * roomTypes.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      rooms.push({
        id: parseInt(roomNumber),
        roomNumber,
        roomType,
        status,
        price: prices[roomType],
        capacity: capacities[roomType],
        description: `${roomType.toLowerCase()} 객실`,
        floor
      });
    }
  }

  return rooms;
};

export default {
  dashboard: dashboardService,
  room: roomService,
  guest: guestService,
  reservation: reservationService,
  auth: authService,
  user: userService
};
