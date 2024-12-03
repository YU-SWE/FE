import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Game from "./Pages/Game";
import Result from "./Pages/Result";
import './Styles/reset';
import { ThemeProvider } from "styled-components";
import theme from "./Styles/theme";

const GhostLegApp = () => {
    return (
        <ThemeProvider theme={theme}>
            <div className="page-container">
                <div className="qna-banner">
                    <h2>사다리타기</h2>
                </div>
                <div className="content-wrapper">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/game" element={<Game />} />
                        <Route path="/result" element={<Result />} />
                    </Routes>
                </div>
            </div>
        </ThemeProvider>
    );
};

export default React.memo(GhostLegApp);