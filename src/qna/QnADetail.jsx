import React, { useState, useEffect } from 'react';
import {useParams, useNavigate, useLocation} from 'react-router-dom';
import axios from 'axios';
import '../styles/PostDetail.css'
import EditNoticeModal from "../notice/EditNoticeModal";

const QnADetail = () => {
    const { id } = useParams(); // 질문 ID
    const navigate = useNavigate();
    const [question, setQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [newAnswer, setNewAnswer] = useState('');
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const [isAdmin, setIsAdmin] = useState(false);
    const [currentUsername, setCurrentUsername] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const location = useLocation();
    const [post, setPost] = useState(location.state?.noticeData);


    function base64UrlDecode(str) {
        try {
            // Base64 URL -> Base64 변환
            str = str.replace(/-/g, '+').replace(/_/g, '/');

            // Base64 디코딩
            const decodedStr = atob(str);

            // UTF-8 디코딩
            const bytes = new Uint8Array(decodedStr.split('').map(char => char.charCodeAt(0)));
            const decodedText = new TextDecoder('utf-8').decode(bytes);

            return JSON.parse(decodedText);
        } catch (e) {
            console.error("Failed to decode base64 string:", e);
            return null;
        }
    }

    function customJwtDecode(token) {
        const base64Url = token.split('.')[1]; // payload 부분만 가져오기
        return base64UrlDecode(base64Url);
    }

    useEffect(() => {
        const checkAdmin = () => {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('role');
            if (token) {
                const decoded = customJwtDecode(token);
                setCurrentUsername(decoded.username);
            }
            if (!token || !role) {
                setIsAdmin(false);
                return;
            }

            setIsAdmin(role === 'ADMIN');
        };

        checkAdmin();
    }, []);

    // 질문과 답변 데이터를 가져오는 함수
    const fetchQuestionAndAnswers = async () => {
        try {
            const token = localStorage.getItem('token');
    
            const questionResponse = await axios.get(`http://localhost:8080/api/questions/${id}`,{
                 headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }});
            setQuestion(questionResponse.data);
            const answerResponse = await axios.get(`http://localhost:8080/api/answers/${id}`, {
                headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }});
            setAnswers(answerResponse.data);
        } catch (error) {
            console.error('데이터를 가져오는 중 오류 발생:', error);
        }
    };

    // 컴포넌트 로드 시 데이터 가져오기
    useEffect(() => {
        fetchQuestionAndAnswers();
    }, [id]);

    // 답변 작성 핸들러
    // const handleAnswerSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         await axios.post(
    //             'http://localhost:8080/api/answers',
    //             {
    //                 questionId: id,
    //                 content: newAnswer,
    //             },
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                     'Content-Type': 'application/json',
    //                 },
    //             }
    //         );
    //         setNewAnswer('');
    //         fetchQuestionAndAnswers(); // 답변 목록 새로고침
    //     } catch (error) {
    //         console.error('답변 등록 실패:', error);
    //         alert('답변 등록에 실패했습니다.');
    //     }
    // };

    const handleAnswerSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:8080/api/answers',
                {
                    questionId: id,
                    content: newAnswer
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );

            if (response.status === 200 || response.status === 201) {
                setNewAnswer('');
                fetchQuestionAndAnswers();
            }
        } catch (error) {
            if (error.response?.status === 401) {
                alert('로그인이 필요합니다.');
                // 로그인 페이지로 리다이렉션
            } else {
                console.error('답변 등록 실패:', error);
                alert('답변 등록에 실패했습니다.');
            }
        }
    };

    // 질문 삭제 핸들러
    const handleDeleteQuestion = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/questions/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('질문이 삭제되었습니다.');
            navigate('/QnABoard'); // 삭제 후 목록 페이지로 이동
        } catch (error) {
            console.error('질문 삭제 실패:', error);
            alert('질문 삭제에 실패했습니다.');
        }
    };

    // 답변 삭제 핸들러
    // const handleDeleteAnswer = async (answerId) => {
    //     try {
    //         await axios.delete(`http://localhost:8080/api/answers/${answerId}`, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });
    //         alert('답변이 삭제되었습니다.');
    //         fetchQuestionAndAnswers(); // 답변 목록 새로고침
    //     } catch (error) {
    //         console.error('답변 삭제 실패:', error);
    //         alert('답변 삭제에 실패했습니다.');
    //     }
    // };

    const handleUpdateQuestion = async (updatedData) => {
        try {
            const response = await axios.put(
                `http://localhost:8080/api/questions/${id}`,
                {
                    title: updatedData.title,
                    content: updatedData.content
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                setQuestion(response.data);
                setPost(response.data);
                setIsEditing(false);
                alert('질문이 수정되었습니다.');
                fetchQuestionAndAnswers();
            }
        } catch (error) {
            console.error('수정 실패:', error);
            alert('수정에 실패했습니다.');
        }
    };

    const handleDeleteAnswer = async (answerId) => {
        try {
            const token = localStorage.getItem('token');
            await axios({
                method: 'DELETE',
                url: `http://localhost:8080/api/answers/${answerId}`,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                withCredentials: false
            });
            // 성공 시 답변 목록 새로고침
            fetchQuestionAndAnswers();
        } catch (error) {
            console.error('답변 삭제 실패:', error);
            if (error.response?.status === 403) {
                alert('삭제 권한이 없습니다.');
            } else if (error.response?.status === 401) {
                navigate('/login');
            } else {
                alert('답변 삭제에 실패했습니다.');
            }
        }
    };

    if (!question) return <div>로딩 중...</div>;

    return (
        <div className="page-container">
            <div className="qna-banner">
                <h2>QnA</h2>
            </div>
            <div className="content-wrapper">
                <div className="post-detail-container">
                    <h2 s>{question.title}</h2>
                    <p>{question.content}</p>
                    <p className='review-content'>작성자: {question.username}</p>


                    {/* 관리자 또는 작성자만 수정 및 삭제 가능 */}
                    {(question.username === currentUsername || isAdmin) && (
                        <div>
                            <button className='edit-review-btn' onClick={() => setIsEditing(true)}>수정</button>
                            <button className='delete-review-btn' onClick={handleDeleteQuestion}>삭제</button>
                        </div>
                    )}
                    {isEditing && (
                        <EditNoticeModal
                            post={post}
                            onClose={() => setIsEditing(false)}
                            onSubmit={handleUpdateQuestion}
                        />
                    )}
                    <hr />
                    <form className='form' onSubmit={handleAnswerSubmit}>
                            <textarea
                                className='textarea'
                                value={newAnswer}
                                onChange={(e) => setNewAnswer(e.target.value)}
                                placeholder="답변을 입력하세요"
                                required
                            />
                        <button className='primary-button' type="submit">답변 작성</button>
                    </form>

                    <hr />
                    <h3>답변</h3>
                    {answers.map((answer) => (
                        <div className='review'>
                            <div className='answer-context' key={answer.id}>
                                <p className='reviewer-name'>{answer.content}</p>
                                <p className='review-content'>작성자: {answer.username}</p>

                                {/* 관리자 또는 답변 작성자만 삭제 가능 */}
                                {(answer.username === currentUsername || isAdmin) && (
                                    <button className='primary-button' onClick={() => handleDeleteAnswer(answer.id)}>삭제</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QnADetail;
