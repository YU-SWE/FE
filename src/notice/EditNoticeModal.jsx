// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import '../styles/QnA.css';
//
// const EditNoticeModal = ({ show, onClose, post, onSubmit }) => {
//     const [noticeData, setNoticeData] = useState({
//         title: post?.title || '',
//         content: post?.content || ''
//     });
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setNoticeData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 alert('로그인이 필요합니다.');
//                 onClose();
//                 return;
//             }
//
//             await onSubmit({
//                 title: noticeData.title,
//                 content: noticeData.content
//             });
//
//             alert('공지사항이 수정되었습니다.');
//             onClose();
//         } catch (error) {
//             console.error('Error:', error);
//             if (error.response?.status === 401 || error.response?.status === 403) {
//                 alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
//             } else {
//                 alert('공지사항 수정에 실패했습니다.');
//             }
//         }
//     };
//
//     return (
//         <div className="write-container">
//             <h2>공지사항 수정</h2>
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
//                     <button type="submit">수정</button>
//                     <button type="button" onClick={onClose}>
//                         취소
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };

import React, { useState } from 'react';
import '../styles/QnA.css';

const EditNoticeModal = ({ post, onClose, onSubmit }) => {
    const [noticeData, setNoticeData] = useState({
        title: post?.title || '',
        content: post?.content || ''
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
            await onSubmit(noticeData);
        } catch (error) {
            console.error('수정 실패:', error);
            alert('수정에 실패했습니다.');
        }
    };

    return (
        <div className="write-container">
            <h2>공지사항 수정</h2>
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
                    <button type="submit">수정</button>
                    <button type="button" onClick={onClose}>취소</button>
                </div>
            </form>
        </div>
    );
};

export default EditNoticeModal;