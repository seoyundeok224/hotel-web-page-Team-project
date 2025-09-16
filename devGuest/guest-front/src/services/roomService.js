// src/services/roomService.js
import { apiGet, apiPost, apiPut, apiDelete } from './api';

const API_BASE = '/rooms'; // The /api prefix is handled by api.js

export const roomService = {
    // 전체 객실 조회
    getAllRoomsList: async () => {
        return apiGet(API_BASE);
    },

    // 객실 상세 조회
    getRoomById: async (id) => {
        return apiGet(`${API_BASE}/${id}`);
    },

    // 객실 상태 업데이트
    updateRoomStatus: async (id, status) => {
        // The controller has a dedicated endpoint for this, but for simplicity
        // and consistency with the old code, we use the general update endpoint.
        return apiPut(`${API_BASE}/${id}`, { status });
    },

    // 객실 추가
    createRoom: async (room) => {
        return apiPost(API_BASE, room);
    },

    // 객실 전체 정보 수정
    updateRoom: async (id, room) => {
        return apiPut(`${API_BASE}/${id}`, room);
    },

    // 객실 삭제
    deleteRoom: async (id) => {
        return apiDelete(`${API_BASE}/${id}`);
    }
};