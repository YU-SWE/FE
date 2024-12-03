import React, { useState } from 'react';
import axios from 'axios';

const AnswerForm = ({ questionId }) => {
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token'); // JWT 토큰 가져오기
            await axios.post('http://localhost:8080/api/answers', {
                content,
                questionId,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('답변이 등록되었습니다.');
            setContent(''); // 입력 필드 초기화
        } catch (error) {
            console.error('답변 등록 실패:', error);
            alert('답변 등록에 실패했습니다.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                placeholder="답변을 입력하세요"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="answer-input"
            ></textarea>
            <button type="submit" className="answer-submit-button">답변 등록</button>
        </form>
    );
};

export default AnswerForm;
