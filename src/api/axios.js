import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true, // 쿠키 포함
});

// 요청 인터셉터
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 응답 에러 처리
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API error:', error.response || error);
        if (error.response?.status === 401) {
            // 401 Unauthorized 처리
            localStorage.removeItem('token');
            window.location.href = '/login'; // 로그인 페이지로 리다이렉트
        }
        return Promise.reject(error);
    }
);

export default api;
