import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const createAuthHeaders = (token) => {
  return { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } };
};

const reviewService = {
  // --- Review API (변경 없음) ---
  getAllReviews: (page = 0, size = 10, sort = 'createdAt,desc') => {
    return axios.get(`${API_BASE_URL}/reviews?page=${page}&size=${size}&sort=${sort}`);
  },
  createReview: (reviewData, token) => {
    return axios.post(`${API_BASE_URL}/reviews`, reviewData, createAuthHeaders(token));
  },
  updateReview: (id, reviewData, token) => {
    return axios.put(`${API_BASE_URL}/reviews/${id}`, reviewData, createAuthHeaders(token));
  },
  deleteReview: (id, token) => {
    return axios.delete(`${API_BASE_URL}/reviews/${id}`, createAuthHeaders(token));
  },
  likeReview: (id, token) => {
    return axios.post(`${API_BASE_URL}/reviews/${id}/like`, {}, createAuthHeaders(token));
  },

  // --- Comment API (수정 및 추가) ---
  getComments: (reviewId) => {
    // [수정] 경로 변경
    return axios.get(`${API_BASE_URL}/comments/review/${reviewId}`);
  },
  createComment: (reviewId, commentData, token) => {
    // [수정] 경로 변경
    return axios.post(`${API_BASE_URL}/comments/review/${reviewId}`, commentData, createAuthHeaders(token));
  },
  // [추가] 댓글 삭제 함수
  deleteComment: (commentId, token) => {
    return axios.delete(`${API_BASE_URL}/comments/${commentId}`, createAuthHeaders(token));
  }
};

export default reviewService;