import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const NoticePostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        // 실제 API 호출로 대체해야 합니다
        const fetchPost = async () => {
            const sampleNoticePost = {
                id: id,
                title: "YU FOOD",
                content: `영남대학교의 주변 맛집들을 소개하는 사이트입니다.`,
            };
            setPost(sampleNoticePost);
        };

        fetchPost();
    }, [id]);

    if (!post) return <div>Loading...</div>;

    return (
        <div className="page-container">
            <div className="qna-banner">
                <h2>사이트 소개</h2>
            </div>

            <div className="content-wrapper">
                <div className="post-detail-container">
                    <h1 className="post-title">{post.title}</h1>

                        <div className="post-info">
                            <span className="value"></span>
                        </div>

                    <div className="post-content">
                        {post.content.split('\n').map((line, index) => (
                            <p key={index}>{line}</p>
                        ))}
                    </div>

                    
                </div>
            </div>
        </div>
    );
};

export default NoticePostDetail;