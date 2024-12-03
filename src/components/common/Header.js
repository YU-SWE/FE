import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import './Header.css';
import Logo from '../Image/Logo.png';
import SearchIcon from '../Image/Search_icon.png';

export const Header = ({ isLoggedIn }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false); // 다크 모드 상태

    useEffect(() => {
        setSearchQuery(''); // 페이지가 변경되면 검색창 초기화
    }, [location]);

    useEffect(() => {
        // 로컬 스토리지에서 다크 모드 설정 불러오기
        const savedMode = localStorage.getItem('darkMode') === 'true';
        setIsDarkMode(savedMode);
        document.body.classList.toggle('dark', savedMode);
    }, []);

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        document.body.classList.toggle('dark', newMode);
        localStorage.setItem('darkMode', newMode); // 상태 저장
    };

    const token = localStorage.getItem('token');
    if (token) {
        isLoggedIn = true;
    } else {
        isLoggedIn = false;
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('email');
        localStorage.removeItem('name');
        alert("로그아웃 되었습니다.");
        navigate(`/`);
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
        } else {
            alert("검색어를 입력해주세요.");
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const handleLogoClick = () => {
        navigate('/'); // 메인 페이지로 이동
    };

    return (
        <>
            <header className="Header">
                <div className="Header_top">
                    <div className="Header_left" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
                        <img src={Logo} alt="Logo" className="Header_logo" />
                    </div>
                    <div className="Header_center_search">
                        <input
                            type="text"
                            placeholder="지역, 음식 또는 식당명을 입력해주세요!"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button onClick={handleSearch}>
                            <img src={SearchIcon} alt="Search" />
                        </button>
                    </div>
                    <div className="Header_right">
                        <button className="DarkMode_button" onClick={toggleDarkMode}>
                            {isDarkMode ? '🌙 다크 모드' : '☀️ 라이트 모드'}
                        </button>
                        {isLoggedIn ? (
                            <>
                                <Link to="/profile" className="Header_button">프로필</Link>
                                <button className="Header_button" onClick={handleLogout}>
                                    로그아웃
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="Header_button">로그인</Link>
                                <Link to="/join" className="Header_button">회원가입</Link>
                            </>
                        )}
                    </div>
                </div>
                <nav className="Header_nav">
                <ul className="nav_ul">
                    <li><Link to="/Notice">공지사항</Link></li>
                    <li><Link to="/about">사이트 소개</Link></li>
                    <li><Link to="/QnABoard">Q & A</Link></li>
                    <li><Link to="/roulette">룰렛</Link></li>
                    <li><Link to="/ladder">사다리 타기</Link></li>
                </ul>
            </nav>
        </header>
        </>
    );
};


export default Header;
