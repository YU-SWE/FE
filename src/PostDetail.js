import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './styles/QnA.css';
import './styles/PostDetail.css'
import Header from "./components/common/Header";
import NavBar from "./components/common/NavBar";

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        // 실제 API 호출로 대체해야 합니다
        const fetchPost = async () => {
            const samplePost = {
                id: id,
                title: "리뷰 작성 어떻게 하나요?",
                author: "윤민서",
                date: "2024.09.01",
                content: "리뷰 작성 어떻게 하나요?",
                votes: 5,
                views: 120
            };
            setPost(samplePost);
        };

        fetchPost();
    }, [id]);

    if (!post) return <div>Loading...</div>;

    return (
        <div>
            <Header />
            <NavBar />
            <div className="qna-banner">
                <h2>QnA</h2>
                <div className="qna-tag">
                    글작성
                </div>
            </div>

            <div className="content-area">
                <div className="post-detail-container">
                    <h1 className="post-title">{post.title}</h1>

                    <div className="post-info">
                        <div className="info-item">
                            <span className="label">작성자</span>
                            <span className="value">{post.author}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">작성일</span>
                            <span className="value">{post.date}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">추천</span>
                            <span className="value">{post.votes}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">조회수</span>
                            <span className="value">{post.views}</span>
                        </div>
                    </div>

                    <div className="post-content">
                        {post.content}
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

export default PostDetail;

