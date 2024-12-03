import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate 추가
import '../styles/Join.css';
import '../styles/QnA.css';
import {authService} from "../api/authService";



export default function Login({ setIsLoggedIn }) {
    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');
    const [emailValid, setEmailValid] = useState(false);
    const [pwValid, setPwValid] = useState(false);
    const [notAllow, setNotAllow] = useState(true);
    const navigate = useNavigate(); // useNavigate 초기화

    useEffect(() => {
        // 이메일과 비밀번호 유효성 검증 결과에 따라 버튼 활성화/비활성화
        if (emailValid && pwValid) {
            setNotAllow(false);
        } else {
            setNotAllow(true);
        }
    }, [emailValid, pwValid]);

    const handleEmail = (e) => {
        setEmail(e.target.value);
        const regex =
            /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
        setEmailValid(regex.test(e.target.value));
    };

    const handlePw = (e) => {
        setPw(e.target.value);
        const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])[a-zA-Z0-9$`~!@$!%*#^?&\\(\\)\-_=+]{4,}$/;
        setPwValid(regex.test(e.target.value));
    };

    const onClickConfirmButton = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/user/login', {
                email: email,
                password: pw,
            });
            
            if (response.status === 200) {
                const { token } = response.data; // JWT 토큰
                localStorage.setItem('token', token); // 토큰 저장
                console.log(token); 
                localStorage.setItem('role', response.data.role);
                setIsLoggedIn(true); // 로그인 상태 업데이트
                alert('로그인에 성공했습니다.');
                navigate('/'); // 메인 화면으로 이동
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert('이메일 또는 비밀번호를 확인해주세요.');
            } else {
                alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            onClickConfirmButton();
        }
    };

    const handleSocialLogin = (provider) => {
        try {
            const providerName = provider.toLowerCase();
            const loginUrl = `http://localhost:8080/oauth2/authorization/${providerName}`;

            const width = 500;
            const height = 600;
            const left = (window.screen.width / 2) - (width / 2);
            const top = (window.screen.height / 2) - (height / 2);

            const popup = window.open(
                loginUrl,
                'Social Login',
                `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
            );

            window.addEventListener('message', async (event) => {
                if (event.origin !== 'http://localhost:8080') return;

                if (event.data.token) {
                    // 토큰과 사용자 정보 저장
                    localStorage.setItem('token', event.data.token);
                    localStorage.setItem('email', event.data.email);
                    localStorage.setItem('name', event.data.name);
                    localStorage.setItem('role', event.data.role);
                    setIsLoggedIn(true);

                    if (popup) popup.close();
                    navigate('/');
                }
            });
        } catch (error) {
            console.error(`${provider} login error:`, error);
            alert(`${provider} 로그인 중 오류가 발생했습니다.`);
        }
    };

    const showNotification = (message) => {
        // setAlertMessage(message);
        // setShowAlert(true);
        // setTimeout(() => {
        //     setShowAlert(false);
        // }, 3000);
    };

    const handleLogout = () => {
        // 로그아웃 시 토큰 삭제 및 상태 초기화
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };

        const handleLogin = async (e) => {
            e.preventDefault();
            try {
                const response = await authService.login(email, pw);
                if (response.token) {
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('email', response.email);
                    localStorage.setItem('role', response.role);
                    setIsLoggedIn(true);
                    navigate('/');
                }
            } catch (error) {
                console.error(`error:`, error);
            }
        };


    return (
        <div className="page-container">
            <div className="qna-banner">
                <h2>로그인</h2>
            </div>
            <div className="join-container">
                <div className="join-form">
                    <div className="input-group">
                        <div className="input-label">이메일</div>
                        <div className="input-wrapper">
                            <input
                                className={`input-field ${!emailValid && email.length > 0 ? 'error' : ''}`}
                                type="text"
                                placeholder="이메일을 입력해주세요."
                                value={email}
                                onChange={handleEmail}
                            />
                        </div>
                        {!emailValid && email.length > 0 && (
                            <div className="error-message">올바른 이메일을 입력해주세요.</div>
                        )}
                    </div>
                    <div className="input-group">
                        <div className="input-label">비밀번호</div>
                        <div className="input-wrapper">
                            <input
                                className={`input-field ${!pwValid && pw.length > 0 ? 'error' : ''}`}
                                type="password"
                                placeholder="비밀번호를 입력해주세요."
                                value={pw}
                                onChange={handlePw}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        {!pwValid && pw.length > 0 && (
                            <div className="error-message">올바른 비밀번호를 입력해주세요.</div>
                        )}
                    </div>
                </div>
                <button
                    className="submit-button"
                    onClick={onClickConfirmButton}
                    disabled={notAllow}
                >
                    로그인
                </button>
                <button
                    className="social-login-button google-button"
                    onClick={() => handleSocialLogin('Google')}
                >
                    <svg className="social-icon google-icon" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span>구글 로그인</span>
                </button>

                <button
                    className="social-login-button kakao-button"
                    onClick={() => handleSocialLogin('Kakao')}
                >
                    <img
                        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMiA0QzcuMTU4IDQgMy4yODggNy4wNTYgMy4yODggMTAuNzUyQzMuMjg4IDEzLjIzMiA0Ljk2IDE1LjQgNy41NjggMTYuNTc2TDYuNzA0IDE5Ljc0NEM2LjY1NiAxOS45MDQgNi43MiAyMC4wOCA2Ljg2NCAyMC4xNzZDNi45NiAyMC4yNCA3LjA3MiAyMC4yNzIgNy4xODQgMjAuMjcyQzcuMjk2IDIwLjI3MiA3LjQwOCAyMC4yNCA3LjUwNCAyMC4xNzZMMTEuMjI0IDE3LjY4QzExLjQ3MiAxNy43MDQgMTEuNzM2IDE3LjcwNCAxMiAxNy43MDRDMTYuODQyIDE3LjcwNCAyMC43MTIgMTQuNjQ4IDIwLjcxMiAxMC43NTJDMjAuNzEyIDcuMDU2IDE2Ljg0MiA0IDEyIDRaIiBmaWxsPSIjMDAwMDAwIi8+Cjwvc3ZnPg=="
                        alt="Kakao"
                        className="social-icon kakao-icon"
                    />
                    <span>카카오 로그인</span>
                </button>

                <button
                    className="social-login-button naver-button"
                    onClick={() => handleSocialLogin('Naver')}
                >
                    <img
                        src={require('../assets/naver_icon.png')}
                        alt="Naver"
                        className="social-icon naver-icon"
                    />
                    <span>네이버 로그인</span>
                </button>
                <div className="login-links">
                    <Link to="/join" className="link">회원가입</Link>
                    <span className="divider">|</span>
                    <Link to="/FindIdPage" className="link">아이디 찾기</Link>
                    <span className="divider">|</span>
                    <Link to="/FindPasswordPage" className="link">비밀번호 찾기</Link>
                </div>
            </div>
            <style>{`
              .custom-alert {
                width: 100%;
                max-width: 400px;
                margin: 0 auto 1rem auto;
                padding: 16px;
                border-radius: 6px;
                border: 1px solid;
              }

              .custom-alert.error {
                background-color: #fee2e2;
                border-color: #ef4444;
                color: #991b1b;
              }

              .alert-title {
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 4px;
              }

              .alert-message {
                font-size: 14px;
              }

              .dark .custom-alert.error {
                background-color: #7f1d1d;
                border-color: #dc2626;
                color: #fee2e2;
              }

              .social-login-button {
                position: relative;
                width: 100%;
                max-width: 400px;
                height: 45px;
                margin: 10px 0;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 500;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: opacity 0.2s ease;
              }

              .social-login-button:hover {
                opacity: 0.9;
              }

              .social-icon {
                position: absolute;
                left: 16px;
                width: 20px;
                height: 20px;
              }

              .google-button {
                background-color: white;
                color: #757575;
                border: 1px solid #ddd;
              }

              .kakao-button {
                background-color: #FEE500;
                color: #000000;
                border: none;
              }

              .naver-button {
                background-color: #03C75A;
                color: white;
                border: none;
              }

              .login-links {
                margin-top: 20px;
                text-align: center;
              }

              .login-links .link {
                color: #666;
                text-decoration: none;
                margin: 0 10px;
              }

              .login-links .divider {
                color: #ddd;
              }

              .dark .login-links .link {
                color: #a1a1aa;
              }

              .dark .login-links .divider {
                color: #52525b;
              }

              .dark .google-button {
                background-color: #27272a;
                border-color: #3f3f46;
                color: #e4e4e7;
              }
            `}</style>
        </div>
    );
}
