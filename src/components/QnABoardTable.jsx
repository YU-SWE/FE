import React from 'react';
import { useNavigate } from 'react-router-dom';

const QnABoardTable = ({ posts }) => {
    const navigate = useNavigate();

    const handleRowClick = (id) => {
        navigate(`/QnABoard/${id}`);
    };

    return (
        <div className="board-container">
            <table className="board-table">
                <thead>
                <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>작성일</th>
                    <th>추천</th>
                    <th>조회</th>
                </tr>
                </thead>
                <tbody>
                {posts.map((post) => (
                    <tr key={post.id} onClick={() => handleRowClick(post.id)} className="clickable-row">
                        <td>{post.id}</td>
                        <td>{post.title}</td>
                        <td>{post.author}</td>
                        <td>{post.date}</td>
                        <td>{post.votes}</td>
                        <td>{post.views}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default QnABoardTable;