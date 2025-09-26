import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const createAuthHeaders = (token) => {
  return { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } };
};

const reviewService = {
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
  getComments: (reviewId) => {
    return axios.get(`${API_BASE_URL}/reviews/${reviewId}/comments`);
  },
  createComment: (reviewId, commentData, token) => {
    return axios.post(`${API_BASE_URL}/reviews/${reviewId}/comments`, commentData, createAuthHeaders(token));
  },
};

export default reviewService;