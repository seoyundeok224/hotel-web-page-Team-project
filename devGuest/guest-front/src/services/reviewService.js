import axios from 'axios';

// 백엔드 Spring Boot 서버의 정확한 전체 주소입니다.
const API_BASE_URL = 'http://localhost:8080/api';

const reviewService = {
  /**
   * 모든 후기 목록을 서버로부터 가져옵니다.
   * @returns {Promise} Axios Promise 객체
   */
  getAllReviews: () => {
    return axios.get(`${API_BASE_URL}/reviews`);
  },

  /**
   * 새로운 후기를 서버에 등록합니다.
   * @param {string} content - 작성할 후기 내용
   * @param {string} token - 사용자의 JWT 인증 토큰
   * @returns {Promise} Axios Promise 객체
   */
  createReview: (content, token) => {
    // 백엔드 Review 모델에 맞게 content만 전송합니다.
    // username은 백엔드에서 토큰을 통해 자동으로 설정합니다.
    const reviewData = { content };
    
    return axios.post(`${API_BASE_URL}/reviews`, reviewData, {
      headers: {
        'Content-Type': 'application/json',
        // HTTP 요청 헤더에 Authorization을 추가하여 JWT 토큰을 보냅니다.
        'Authorization': `Bearer ${token}`
      }
    });
  }
};

export default reviewService;