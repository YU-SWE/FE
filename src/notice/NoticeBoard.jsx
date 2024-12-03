import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/QnA.css';

const NoticeBoard = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    alert('로그인이 필요합니다.');
                    navigate('/login');
                }
                const response = await axios.get('http://localhost:8080/api/notices', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        //'Content-Type': 'application/json'
                    }
                });
                setPosts(response.data);
                setIsLoading(false);
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        };

        fetchNotices();
    }, []);

    useEffect(() => {
        const checkAdmin = () => {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('role');

            if (!token || !role) {
                setIsAdmin(false);
                return;
            }

            setIsAdmin(role === 'ADMIN');
        };

        checkAdmin();
    }, []);

    if (isLoading) return <div>로딩중...</div>;
    if (error) return <div>에러: {error}</div>;

    // const handleRowClick = async (id) => {
    //     try {
    //         const token = localStorage.getItem('token');
    //         if (!token) {
    //             alert('로그인이 필요합니다.');
    //             navigate('/login');
    //             return;
    //         }
    //
    //         const response = await axios.get(
    //             `http://localhost:8080/api/notice/${id}`,
    //             {
    //                 headers: {
    //                     'Authorization': `Bearer ${token}`,
    //                     'Content-Type': 'application/json'
    //                 },
    //                 withCredentials: true
    //             }
    //         );
    //
    //         navigate(`/notice/${id}`, {
    //             state: { noticeData: response.data }
    //         });
    //     } catch (error) {
    //         console.error('Error fetching notice:', error);
    //         if (error.response?.status === 403 || error.response?.status === 401) {
    //             alert('로그인이 필요합니다.');
    //             navigate('/login');
    //         } else {
    //             alert('공지사항을 불러오는데 실패했습니다.');
    //         }
    //     }
    // };

    const handleRowClick = async (id) => {
        try {
            const token = localStorage.getItem('token');
            

            // Authorization 헤더에 'Bearer ' 접두사를 추가
            const response = await axios.get(
                `http://localhost:8080/api/notice/${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );

            if (response.data) {
                navigate(`/notice/${id}`, {
                    state: { noticeData: response.data }
                });
            } else {
                alert('공지사항을 찾을 수 없습니다.');
            }
        } catch (error) {
            console.error('Error fetching notice:', error);

            if (error.response?.status === 403 || error.response?.status === 401) {
                alert('로그인이 필요하거나 접근 권한이 없습니다.');
                navigate('/login');
            } else {
                alert(`공지사항을 불러오는데 실패했습니다. (${error.response?.status || 'unknown error'})`);
            }
        }
    };


    return (
        <div>
            <div className="qna-banner">
                <h2>공지사항</h2>
                {isAdmin && (
                    <div
                        className="qna-tag"
                        onClick={() => navigate('/CreateNotice')}
                        style={{ cursor: 'pointer' }}
                    >
                        공지 작성
                    </div>
                )}
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
                        {posts.map((post) => (
                            <tr
                                key={post.id}
                                onClick={() => handleRowClick(post.id)}
                                className="clickable-row"
                            >
                                <td>{post.id}</td>
                                <td>{post.title}</td>
                                <td>{post.author}</td>
                                <td>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default NoticeBoard;