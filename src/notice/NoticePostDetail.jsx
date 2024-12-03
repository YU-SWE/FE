// // import React, { useState, useEffect } from 'react';
// // import { useParams } from 'react-router-dom';
// // import axios from "axios";
// //
// //
// //
// // const NoticePostDetail = () => {
// //     const { id } = useParams();
// //     const [post, setPost] = useState(null);
// //     const [error, setError] = useState(null);
// //     const [loading, setLoading] = useState(true);
// //
// //
// // //     useEffect(() => {
// // //         // 실제 API 호출로 대체해야 합니다
// // //         const fetchPost = async () => {
// // //             const sampleNoticePost = {
// // //                 id: id,
// // //                 title: "시스템 점검 안내",
// // //                 author: "관리자",
// // //                 date: "2024.10.01",
// // //                 content: `10월 5일 새벽 2시부터 4시까지 시스템 점검이 있을 예정입니다.
// // //
// // // ■ 점검 일시
// // // 2024년 10월 5일 새벽 2:00 ~ 4:00 (약 2시간)
// // //
// // // ■ 점검 내용
// // // - 서버 안정화
// // // - 보안 업데이트
// // // - 시스템 최적화
// // //
// // // ■ 참고사항
// // // - 점검 시간 동안 서비스 이용이 제한됩니다.
// // // - 점검 완료 후 정상적으로 서비스 이용이 가능합니다.
// // //
// // // 이용에 불편을 드려 죄송합니다.
// // // 더 나은 서비스를 제공하도록 하겠습니다.`,
// // //                 views: 150
// // //             };
// // //             setPost(sampleNoticePost);
// // //         };
// // //
// // //         fetchPost();
// // //     }, [id]);
// //
// //     useEffect(() => {
// //         const fetchQuestion = async () => {
// //             try {
// //                 const response = await axios.get(`http://localhost:8080/api/notices/${id}`);
// //                 setPost(response.data);
// //             } catch (err) {
// //                 setError(err.message);
// //             } finally {
// //                 setLoading(false);
// //             }
// //         };
// //
// //         fetchQuestion();
// //     }, [id]);
// //
// //     if (loading) return <div>Loading...</div>;
// //     if (error) return <div>Error: {error}</div>;
// //
// //     return (
// //         <div className="page-container">
// //             <div className="qna-banner">
// //                 <h2>공지사항</h2>
// //                 <div className="qna-tag">
// //                     공지 작성
// //                 </div>
// //             </div>
// //
// //             <div className="content-wrapper">
// //                 <div className="post-detail-container">
// //                     <h1 className="post-title">{post.title}</h1>
// //
// //                     <div className="post-info">
// //                         <div className="info-item">
// //                             <span className="label">작성자</span>
// //                             <span className="value">{post.author}</span>
// //                         </div>
// //                         <div className="info-item">
// //                             <span className="label">작성일</span>
// //                             <span className="value">{post.created_at}</span>
// //                         </div>
// //                         <div className="info-item">
// //                             <span className="label">조회수</span>
// //                             <span className="value">{post.updated_at}</span>
// //                         </div>
// //                     </div>
// //
// //                     <div className="post-content">
// //                         {post.content.split('\n').map((line, index) => (
// //                             <p key={index}>{line}</p>
// //                         ))}
// //                     </div>
// //
// //                     <div className="button-container">
// //                         <button
// //                             onClick={() => window.history.back()}
// //                             className="post-button secondary-button"
// //                         >
// //                             목록으로
// //                         </button>
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };
// //
// // export default NoticePostDetail;
//
//
//
// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from "axios";
//
// const NoticePostDetail = () => {
//     const { id } = useParams();
//     const [post, setPost] = useState(null);
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(true);
//
//     useEffect(() => {
//         const fetchNotice = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:8080/api/notice/${id}`);
//                 setPost(response.data);
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };
//
//         fetchNotice();
//     }, [id]);
//
//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>Error: {error}</div>;
//
//     return (
//         <div className="page-container">
//             <div className="qna-banner">
//                 <h2>공지사항</h2>
//                 <div className="qna-tag">
//                     공지 작성
//                 </div>
//             </div>
//
//             <div className="content-wrapper">
//                 <div className="post-detail-container">
//                     <h1 className="post-title">{post.title}</h1>
//
//                     <div className="post-info">
//                         <div className="info-item">
//                             <span className="label">작성자</span>
//                             <span className="value">{post.user ? post.user.username : '관리자'}</span>
//                         </div>
//                         <div className="info-item">
//                             <span className="label">작성일</span>
//                             <span className="value">
//                                 {new Date(post.createdAt).toLocaleDateString('ko-KR')}
//                             </span>
//                         </div>
//                         <div className="info-item">
//                             <span className="label">수정일</span>
//                             <span className="value">
//                                 {new Date(post.updatedAt).toLocaleDateString('ko-KR')}
//                             </span>
//                         </div>
//                     </div>
//
//                     <div className="post-content">
//                         {post.content.split('\n').map((line, index) => (
//                             <p key={index}>{line}</p>
//                         ))}
//                     </div>
//
//                     <div className="button-container">
//                         <button
//                             onClick={() => window.history.back()}
//                             className="post-button secondary-button"
//                         >
//                             목록으로
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default NoticePostDetail;


import React, {useEffect, useState} from 'react';
import {useParams, useLocation, useNavigate} from 'react-router-dom';
import '../styles/PostDetail.css'
import axios from "axios";
import EditNoticeModal from "./EditNoticeModal";
const NoticePostDetail = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [isEditing, setIsEditing] = useState(false);
    const [post, setPost] = useState(location.state?.noticeData);

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

    const handleUpdateNotice = async (updatedData) => {
        try {
            const response = await axios.put(
                `http://localhost:8080/api/notice/${id}`,
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
                setPost(response.data);
                setIsEditing(false);
                alert('공지사항이 수정되었습니다.');
            }
        } catch (error) {
            console.error('수정 실패:', error);
            alert('수정에 실패했습니다.');
        }
    };

    const handleDeleteNotice = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/notice/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('질문이 삭제되었습니다.');
            navigate('/Notice'); // 삭제 후 목록 페이지로 이동
        } catch (error) {
            console.error('질문 삭제 실패:', error);
            alert('질문 삭제에 실패했습니다.');
        }
    };

    if (!post) return <div>Loading...</div>;

    return (
        <div className="page-container">
            <div className="qna-banner">
                <h2>공지사항</h2>
                {isAdmin && (
                    <div
                        className="qna-tag"
                        post={post}
                        onClick={() => setIsEditing(true)}
                        style={{ cursor: 'pointer' }}
                    >
                        공지 수정
                    </div>
                )}
                {isAdmin && (
                    <div
                        className="qna-tag"
                        onClick={handleDeleteNotice}
                        style={{ cursor: 'pointer' }}
                    >
                        공지 삭제
                    </div>
                )}
            </div>
            {isEditing && (
                <EditNoticeModal
                    post={post}
                    onClose={() => setIsEditing(false)}
                    onSubmit={handleUpdateNotice}
                />
            )}
            <div className="content-wrapper">
                <div className="post-detail-container">
                    <h1 className="post-title">{post.title}</h1>

                    <div className="post-info">
                        <div className="info-item">
                            <span className="label">작성자</span>
                            <span className="value">{post.author}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">작성일</span>
                            <span className="value">
                                {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                            </span>
                        </div>
                    </div>

                    <div className="post-content">
                        {post.content.split('\n').map((line, index) => (
                            <p key={index}>{line}</p>
                        ))}
                    </div>

                    <div className="button-container">
                        <button
                            onClick={() => window.history.back()}
                            className="post-button secondary-button"
                        >
                            목록으로
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoticePostDetail;