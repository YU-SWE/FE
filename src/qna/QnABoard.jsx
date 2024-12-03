import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/QnA.css';

const QnABoard = () => {
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    alert('로그인이 필요합니다.');
                    navigate('/login');
                }
                const response = await axios.get('http://localhost:8080/api/questions', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        //'Content-Type': 'application/json'
                    }
                }); // API 경로
                setQuestions(response.data); // 데이터 설정
            } catch (err) {
                setError(err.message || '데이터를 가져오는 중 오류가 발생했습니다.');
            } finally {
                setIsLoading(false); // 로딩 종료
            }
        };

        fetchQuestions();
    }, []);

    if (isLoading) return (
        <div className="board-wrapper">
            <div className="loading">로딩 중...</div>
        </div>
    );

    if (error) return (
        <div className="board-wrapper">
            <div className="error">에러: {error}</div>
        </div>
    );

    return (
        <div>
            <div className="qna-banner">
                <h2>QnA</h2>
                <div
                    className="qna-tag"
                    onClick={() => navigate('/QnABoard/write')}
                    style={{ cursor: 'pointer' }}
                >
                    글작성
                </div>
            </div>

            <div className="board-wrapper">
                <div className="board-container">
                    <table className="board-table">
                        <thead>
                            <tr>
                                <th className="col-number">번호</th>
                                <th className="col-title">제목</th>
                                <th className="col-author">작성자</th>
                                <th className="col-date">작성일</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questions.map((question, index) => (
                                <tr
                                    key={question.id}
                                    onClick={() => navigate(`/QnABoard/${question.id}`)} // 상세 페이지로 이동
                                    className="clickable-row"
                                >
                                    <td>{index + 1}</td>
                                    <td>{question.title}</td>
                                    <td>{question.username || '알 수 없음'}</td> {/* 작성자 이름 표시 */}
                                    <td>{new Date(question.updatedAt).toLocaleDateString()}</td> {/* 날짜 표시 */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default QnABoard;
