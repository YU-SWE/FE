import api from './axios';
import axios from "./axios";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api/yufood', // 백엔드의 API 엔드포인트
    timeout: 5000,
});

export const authService = {

    // 프로필 정보를 가져오는 함수
    getProfile: async (token) => {
        const response = await axiosInstance.get('/profile', {
            headers: { Authorization: `Bearer ${token}` }, // JWT 토큰을 헤더에 추가
        });
        return response.data;
    },

    /**
     * 일반 로그인
     */
    login: async (email, password) => {
        try {
            const response = await api.post('/api/user/login', {
                email,
                password,
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            return response.data;
        } catch (error) {
            console.error('Login service error:', error);
            throw new Error(
                error.response?.data?.message || '로그인 중 문제가 발생했습니다. 다시 시도해주세요.'
            );
        }
    },

    /**
     * 로그아웃
     */
    logout: () => {
        localStorage.removeItem('token');
    },

    /**
     * 소셜 로그인 (Google, Kakao 등)
     */
    socialLogin: (provider) => {
        // 브라우저 리다이렉트로 Google OAuth2 처리
        window.location.href = `http://localhost:8080/login/oauth2/code/${provider}`;
    },

    /**
     * 현재 사용자 인증 상태 확인
     */
    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        return !!token; // 토큰이 존재하면 true, 없으면 false
    },
};
