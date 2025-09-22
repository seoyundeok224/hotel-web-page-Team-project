import { apiGet, apiPost, apiPut, apiDelete } from './api'

// 관리자용 전체 예약 조회
export const getAllReservations = () => apiGet('/reservations/admin/all')

// 예약 생성
export const createReservation = (data) => apiPost('/reservations', data)

// 예약 수정
export const updateReservation = (id, data) => apiPut(`/reservations/${id}`, data)

// 예약 삭제
export const deleteReservation = (id) => apiDelete(`/reservations/${id}`)
