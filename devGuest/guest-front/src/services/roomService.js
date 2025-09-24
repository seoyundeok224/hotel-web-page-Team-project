import { apiGet, apiPost, apiPut, apiDelete } from './api';

const API_BASE = '/rooms';

export const roomService = {
  getAllRoomsList: async () => apiGet(API_BASE),
  getRoomById: async (id) => apiGet(`${API_BASE}/${id}`),
  updateRoomStatus: async (id, status) => apiPut(`${API_BASE}/${id}`, { status }),
  createRoom: async (room) => apiPost(API_BASE, room),
  updateRoom: async (id, room) => apiPut(`${API_BASE}/${id}`, room),
  deleteRoom: async (id) => apiDelete(`${API_BASE}/${id}`)
};
