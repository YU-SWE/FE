import React, { useContext } from 'react';
import Main from '../Components/Main';
import Game from '../Pages/Game';
import Home from '../Pages/Home';
import Result from '../Pages/Result';
import { Context } from '../Context';

const MainContainer = () => {
    const { state } = useContext(Context);
    const { page } = state;

    const renderContent = () => {
        switch (page) {
            case 'home':
                return <Home />;
            case 'game':
                return <Game />;
            case 'result':
                return <Result />;
            default:
                return <Home />;
        }
    };

    return (
        <div className="page-container">
            <div className="qna-banner">
                <h2>사다리타기</h2>
            </div>
            <div className="content-wrapper">
                <Main page={page}>
                    {renderContent()}
                </Main>
            </div>
        </div>
    );
};

export default React.memo(MainContainer);