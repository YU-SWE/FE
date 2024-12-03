import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import '../styles/QnA.css';

const QnAWrite = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem('token'); // JWT 토큰 가져오기
            if (!token) {
                alert('로그인이 필요합니다.');
                navigate('/login');
                return;
            }
            try {
                const response = await axios.get('http://localhost:8080/api/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsername(response.data.username); // 서버에서 전달받은 username 설정
            } catch (error) {
                console.error('사용자 정보 가져오기 실패:', error);
                alert('사용자 정보를 가져오는 데 실패했습니다.');
            }
        };

        fetchUserInfo();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }

        try {
            const token = localStorage.getItem('token'); // JWT 토큰 가져오기
            const requestBody = {
                title: title.trim(),
                content: content.trim(),
                username, // 작성자 정보 포함
            };

            await axios.post('http://localhost:8080/api/questions', requestBody, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert('질문이 등록되었습니다.');
            navigate('/QnABoard'); // QnA 목록으로 이동
        } catch (error) {
            console.error('질문 등록 실패:', error);
            if (error.response?.data?.message) {
                alert(`질문 등록 실패: ${error.response.data.message}`);
            } else {
                alert('질문 등록에 실패했습니다. 다시 시도해주세요.');
            }
        }
    };

    return (
        <div className="page-container">
            <div className="qna-write-container">
                <div className="qna-banner">
                    <h2>질문 작성</h2>
                </div>
                <form onSubmit={handleSubmit} className="qna-form">
                    <input
                        type="text"
                        placeholder="제목을 입력하세요"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="qna-title-input"
                    />
                    <textarea
                        placeholder="내용을 입력하세요"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        className="qna-content-input"
                    ></textarea>
                    <button type="submit" className="qna-submit-button">등록</button>
                </form>
            </div>
        </div>
    );
};

export default QnAWrite;
