// API 기본 설정
const API_BASE_URL = 'http://localhost:8080/api';

// HTTP 요청을 위한 헬퍼 함수
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// GET 요청
export const apiGet = (endpoint) => apiRequest(endpoint);

// POST 요청
export const apiPost = (endpoint, data) => 
  apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });

// PUT 요청
export const apiPut = (endpoint, data) =>
  apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

// DELETE 요청
export const apiDelete = (endpoint) =>
  apiRequest(endpoint, {
    method: 'DELETE',
  });

export default {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  delete: apiDelete,
};
