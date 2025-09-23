// API 기본 설정
//const API_BASE_URL = 'http://ec2-13-209-26-60.ap-northeast-2.compute.amazonaws.com:8080/api';
//배포용 URL
const API_BASE_URL = 'http://localhost:8080/api';
//개발용 URL

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

  console.log('API Request:', {
    url: `${API_BASE_URL}${endpoint}`,
    method: config.method || 'GET',
    headers: config.headers,
    hasToken: !!token
  });

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    console.log('API Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      let errorData = null;
      
      try {
        // response body를 먼저 텍스트로 읽음
        const responseText = await response.text();
        console.error('API Error Response Text:', responseText);
        
        // JSON 파싱 시도
        if (responseText) {
          try {
            errorData = JSON.parse(responseText);
            console.error('API Error Response (JSON):', errorData);
            errorMessage = errorData.message || errorMessage;
          } catch (parseError) {
            console.error('Failed to parse error response as JSON:', parseError);
            errorMessage = responseText || errorMessage;
          }
        }
      } catch (readError) {
        console.error('Failed to read error response:', readError);
      }
      
      const error = new Error(errorMessage);
      error.response = { data: errorData, status: response.status };
      throw error;
    }

    if (response.status === 204) {
      return null; // 204 No Content 응답은 내용이 없으므로 null 반환
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
export const apiDelete = (endpoint, data) => {
  const config = {
    method: 'DELETE',
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  return apiRequest(endpoint, config);
};

export default {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  delete: apiDelete,
};
