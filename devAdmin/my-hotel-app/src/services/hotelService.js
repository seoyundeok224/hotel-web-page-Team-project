import api from './api'

// Room 관련 API
export const roomService = {
  // 모든 객실 조회 (페이징)
  getAllRooms: (page = 0, size = 10) => 
    api.get(`/rooms?page=${page}&size=${size}`),
  
  // 모든 객실 리스트 조회
  getAllRoomsList: () => 
    api.get('/rooms/all'),
  
  // 특정 객실 조회
  getRoomById: (id) => 
    api.get(`/rooms/${id}`),
  
  // 객실 번호로 조회
  getRoomByNumber: (roomNumber) => 
    api.get(`/rooms/number/${roomNumber}`),
  
  // 객실 타입별 조회
  getRoomsByType: (roomType) => 
    api.get(`/rooms/type/${roomType}`),
  
  // 객실 상태별 조회
  getRoomsByStatus: (status) => 
    api.get(`/rooms/status/${status}`),
  
  // 예약 가능한 객실 조회
  getAvailableRooms: (checkIn, checkOut) => 
    api.get(`/rooms/available?checkIn=${checkIn}&checkOut=${checkOut}`),
  
  // 객실 생성
  createRoom: (roomData) => 
    api.post('/rooms', roomData),
  
  // 객실 수정
  updateRoom: (id, roomData) => 
    api.put(`/rooms/${id}`, roomData),
  
  // 객실 상태 변경
  updateRoomStatus: (id, status) => 
    api.put(`/rooms/${id}/status`, status, {
      headers: { 'Content-Type': 'application/json' }
    }),
  
  // 객실 삭제
  deleteRoom: (id) => 
    api.delete(`/rooms/${id}`)
}

// Guest 관련 API
export const guestService = {
  // 모든 고객 조회 (페이징)
  getAllGuests: (page = 0, size = 10) => 
    api.get(`/guests?page=${page}&size=${size}`),
  
  // 모든 고객 리스트 조회
  getAllGuestsList: () => 
    api.get('/guests/all'),
  
  // 특정 고객 조회
  getGuestById: (id) => 
    api.get(`/guests/${id}`),
  
  // 이메일로 고객 조회
  getGuestByEmail: (email) => 
    api.get(`/guests/email/${email}`),
  
  // 고객 검색
  searchGuests: (name = '', page = 0, size = 10) => 
    api.get(`/guests/search?name=${name}&page=${page}&size=${size}`),
  
  // 이름으로 고객 검색
  searchGuestsByName: (name) => 
    api.get(`/guests/search/name/${name}`),
  
  // 고객 생성
  createGuest: (guestData) => 
    api.post('/guests', guestData),
  
  // 고객 정보 수정
  updateGuest: (id, guestData) => 
    api.put(`/guests/${id}`, guestData),
  
  // 고객 삭제
  deleteGuest: (id) => 
    api.delete(`/guests/${id}`)
}

// Reservation 관련 API
export const reservationService = {
  // 모든 예약 조회 (페이징)
  getAllReservations: (page = 0, size = 10) => 
    api.get(`/reservations?page=${page}&size=${size}`),
  
  // 모든 예약 리스트 조회
  getAllReservationsList: () => 
    api.get('/reservations/all'),
  
  // 특정 예약 조회
  getReservationById: (id) => 
    api.get(`/reservations/${id}`),
  
  // 고객별 예약 조회
  getReservationsByGuest: (guestId) => 
    api.get(`/reservations/guest/${guestId}`),
  
  // 객실별 예약 조회
  getReservationsByRoom: (roomId) => 
    api.get(`/reservations/room/${roomId}`),
  
  // 상태별 예약 조회
  getReservationsByStatus: (status) => 
    api.get(`/reservations/status/${status}`),
  
  // 오늘 체크인 예정 조회
  getTodaysCheckIns: () => 
    api.get('/reservations/today/checkins'),
  
  // 오늘 체크아웃 예정 조회
  getTodaysCheckOuts: () => 
    api.get('/reservations/today/checkouts'),
  
  // 기간별 예약 조회
  getReservationsByDateRange: (startDate, endDate) => 
    api.get(`/reservations/date-range?startDate=${startDate}&endDate=${endDate}`),
  
  // 예약 생성
  createReservation: (reservationData) => 
    api.post('/reservations', reservationData),
  
  // 예약 수정
  updateReservation: (id, reservationData) => 
    api.put(`/reservations/${id}`, reservationData),
  
  // 체크인 처리
  checkIn: (id) => 
    api.put(`/reservations/${id}/checkin`),
  
  // 체크아웃 처리
  checkOut: (id) => 
    api.put(`/reservations/${id}/checkout`),
  
  // 예약 취소
  cancelReservation: (id) => 
    api.put(`/reservations/${id}/cancel`),
  
  // 예약 삭제
  deleteReservation: (id) => 
    api.delete(`/reservations/${id}`)
}

// Auth 관련 API
export const authService = {
  // 로그인
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  
  // 회원가입
  register: (userData) => 
    api.post('/auth/register', userData),
  
  // 로그아웃
  logout: () => 
    api.post('/auth/logout'),
  
  // 토큰 갱신
  refreshToken: (refreshToken) => 
    api.post('/auth/refresh', { refreshToken }),
  
  // 현재 사용자 정보
  getCurrentUser: () => 
    api.get('/auth/me')
}

// Dashboard 관련 API
export const dashboardService = {
  // 대시보드 통계 조회
  getStats: () => 
    api.get('/dashboard/stats'),
  
  // 오늘의 활동 조회
  getTodayActivities: () => 
    api.get('/dashboard/today-activities'),
  
  // 객실 상태 요약 조회
  getRoomStatusSummary: () => 
    api.get('/dashboard/room-status-summary'),
  
  // 주간 예약 조회
  getWeeklyReservations: () => 
    api.get('/dashboard/weekly-reservations')
}
