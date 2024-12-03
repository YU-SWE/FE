import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// const CreateNotice = () => {
//     const navigate = useNavigate();
//     const [noticeData, setNoticeData] = useState({
//         title: '',
//         content: ''
//     });
//
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setNoticeData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };
//
//     // const handleSubmit = async (e) => {
//     //     e.preventDefault();
//     //     try {
//     //         const username = localStorage.getItem('username');
//     //         const response = await axios.post('http://localhost:8080/api/notice', {
//     //             title: noticeData.title,
//     //             content: noticeData.content,
//     //             author: username,
//     //             username: username
//     //         }, {
//     //             headers: {
//     //                 'Content-Type': 'application/json'
//     //             }
//     //         });
//     //
//     //         if (response.status === 200) {
//     //             navigate('/notice');
//     //         }
//     //     } catch (error) {
//     //         console.error('공지사항 작성 실패:', error);
//     //         alert('공지사항 작성에 실패했습니다.');
//     //     }
//     // };
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 navigate('/login');
//                 return;
//             }
//
//             const config = {
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 }
//             };
//             const response = await axios.post('http://localhost:8080/api/notice', {
//                 title: noticeData.title,
//                 content: noticeData.content
//             }, {
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 }
//             });
//         } catch (error) {
//             if (error.response?.status === 403) {
//                 alert('로그인이 필요합니다.');
//                 navigate('/login');
//                 return;
//             }
//             alert('공지사항 작성에 실패했습니다.');
//         }
//     };
//
//     return (
//         <div className="write-container">
//             <h2>공지사항 작성</h2>
//             <form onSubmit={handleSubmit}>
//                 <div className="form-group">
//                     <label htmlFor="title">제목</label>
//                     <input
//                         type="text"
//                         id="title"
//                         name="title"
//                         value={noticeData.title}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label htmlFor="content">내용</label>
//                     <textarea
//                         id="content"
//                         name="content"
//                         value={noticeData.content}
//                         onChange={handleChange}
//                         required
//                         rows={10}
//                     />
//                 </div>
//                 <div className="button-group">
//                     <button type="submit">등록</button>
//                     <button type="button" onClick={() => navigate('/notice')}>
//                         취소
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };

const CreateNotice = () => {
    const navigate = useNavigate();
    const [noticeData, setNoticeData] = useState({
        title: '',
        content: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNoticeData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('로그인이 필요합니다.');
                navigate('/login');
                return;
            }

            const response = await axios.post(
                'http://localhost:8080/api/notice',
                {
                    title: noticeData.title,
                    content: noticeData.content
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true  // 중요: CORS 인증을 위해 필요
                }
            );

            if (response.status === 200 || response.status === 201) {
                alert('공지사항이 작성되었습니다.');
                navigate('/notice');
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
                navigate('/login');
            } else {
                alert('공지사항 작성에 실패했습니다.');
            }
        }
    };

    return (
        <div className="write-container">
            <h2>공지사항 작성</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">제목</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={noticeData.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="content">내용</label>
                    <textarea
                        id="content"
                        name="content"
                        value={noticeData.content}
                        onChange={handleChange}
                        required
                        rows={10}
                    />
                </div>
                <div className="button-group">
                    <button type="submit">등록</button>
                    <button type="button" onClick={() => navigate('/notice')}>
                        취소
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateNotice;