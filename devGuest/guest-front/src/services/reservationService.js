import { apiGet, apiPost, apiPut, apiDelete } from './api'

export const getAllReservations = () => apiGet('/reservations/admin/all')
export const createReservation = (data) => apiPost('/reservations', data)
export const updateReservation = (id, data) => apiPut(`/reservations/${id}`, data)
export const deleteReservation = (id) => apiDelete(`/reservations/${id}`)
export const updateReservationStatus = (id, status) => apiPut(`/reservations/${id}/status?status=${status}`)
