// src/ghost-leg/Pages/GamePage.jsx
import React from 'react';
import { Provider } from '../Context';
import MainContainer from '../Containers/MainContainer';

const GamePage = () => {
    return (
        <Provider>
            <div className="page-container">
                <MainContainer />
            </div>

            <style jsx>{`
                .qna-banner {
                    background:#EAB048;
                    color: white;
                    padding: 40px 0;
                    text-align: center;
                    min-height: 180px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .qna-banner h2 {
                    font-size: 36px;
                    margin: 0;
                    color: white;
                }

                .page-container {
                    min-height: 100vh;
                    background-color: #f8f9fa;
                }
            `}</style>
        </Provider>
    );
};

export default GamePage;