import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MainPage from './components/MainPage/MainPage.jsx'; // 새로 만든 페이지
import DetailPage from './components/DetailPage/DetailPage.jsx';
import Login from "./page/Login.jsx";
import Join from "./page/Join.jsx";
import QnABoard from "./qna/QnABoard.jsx";
import PostDetail from "./qna/QnADetail.jsx";
import NoticePostDetail from "./notice/NoticePostDetail.jsx"; // 경로 수정
import FindIdPage from "./page/FindIdPage";
import FindPasswordPage from "./page/FindPasswordPage";
import Profile from "./page/Profile.jsx";
import MorePage from "./components/MainPage/MorePage.js"
import SearchResultsPage from './components/MainPage/SearchResultsPage';
import Roulette from './components/MainPage/Roulette.js';
import QnAWrite from './qna/QnAWrite.jsx';
import ThemeToggle from './components/common/ThemeToggle';
import { ThemeProvider } from './contexts/ThemeContext';
import './styles/darkMode.css';
import { AuthProvider } from './contexts/AuthContext.js';
import { HeaderProvider } from './components/common/HeaderContext.js';
import Header from './components/common/Header.js';
import Introduction from './page/Introduction.jsx';
import GamePage from './ghost-leg/Pages/GamePage.jsx';
import NoticeBoard from './notice/NoticeBoard.jsx';
import CreateNotice from './notice/CreateNotice.jsx';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리

    useEffect(() => {
        // JWT 토큰이 localStorage에 있으면 로그인 상태로 설정
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        // 로그아웃 시 토큰 삭제 및 상태 초기화
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    const ProtectedRoute = ({ element }) => {
        // 로그인 상태를 확인하여 보호된 경로에 접근 여부 결정
        return isLoggedIn ? element : <Navigate to="/login" />;
    };

    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <Header />
                    <Routes>
                        <Route path="/" element={<MainPage />} />
                        <Route path="/restaurant/:restaurantId" element={<DetailPage />} />
                        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                        <Route path="/join" element={<Join />} />
                        <Route path="/more" element={<MorePage />} />
                        <Route path="/search" element={<SearchResultsPage />} />
                        <Route path="/QnABoard" element={<QnABoard />} />
                        <Route path="/QnABoard/:id" element={<PostDetail />} />
                        <Route path="/notice/:id" element={<NoticePostDetail />} />
                        <Route path="/FindIdPage" element={<FindIdPage />} />
                        <Route path="/FindPasswordPage" element={<FindPasswordPage />} />
                        <Route path="/Roulette" element={<Roulette />} />
                        <Route path="/about" element={<Introduction />} />
                        <Route path="/ladder" element={<GamePage />} />
                        <Route path="/notice" element={<NoticeBoard />} />
                        <Route path="/CreateNotice" element={<CreateNotice />} />

                        {/* 보호된 경로 */}
                        <Route
                            path="/profile"
                            element={<ProtectedRoute element={<Profile />} />}
                        />
                        <Route
                            path="/QnABoard/Write"
                            element={<ProtectedRoute element={<QnAWrite />} />}
                        />
                        <Route
                            path="/qna"
                            element={<ProtectedRoute element={<div>Q&A 작성 페이지</div>} />}
                        />
                    </Routes>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
