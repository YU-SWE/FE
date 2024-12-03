import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AnswerList = ({ questionId }) => {
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        const fetchAnswers = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/answers/question/${questionId}`);
                setAnswers(response.data);
            } catch (error) {
                console.error('답변을 불러오는 중 오류:', error);
            }
        };

        fetchAnswers();
    }, [questionId]);

    return (
        <div className="answer-list">
            <h3>답변</h3>
            {answers.length > 0 ? (
                answers.map((answer) => (
                    <div key={answer.id} className="answer-item">
                        <p>{answer.content}</p>
                        <span>작성자: {answer.author}</span>
                        <span>작성일: {new Date(answer.createdAt).toLocaleDateString()}</span>
                    </div>
                ))
            ) : (
                <p>아직 답변이 없습니다.</p>
            )}
        </div>
    );
};

export default AnswerList;
