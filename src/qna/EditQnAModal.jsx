import React, { useState } from 'react';
import '../styles/QnA.css';

const EditQnAModal = ({ post, onClose, onSubmit }) => {
    const [QnAData, setQnAData] = useState({
        title: post?.title || '',
        content: post?.content || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setQnAData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onSubmit(QnAData);
        } catch (error) {
            console.error('수정 실패:', error);
            alert('수정에 실패했습니다.');
        }
    };

    return (
        <div className="write-container">
            <h2>QnA 수정</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">제목</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={QnAData.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="content">내용</label>
                    <textarea
                        id="content"
                        name="content"
                        value={QnAData.content}
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

export default EditQnAModal;