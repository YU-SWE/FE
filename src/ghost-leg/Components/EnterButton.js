// src/ghost-leg/Components/EnterButton.js
import React from "react";
import styled from "styled-components";

const EnterButton = ({ enterGame }) => {
    return (
        <Button aria-label="게임 입장" onClick={enterGame}>
            ENTER
        </Button>
    );
};

const Button = styled.button`
    background-color: #26baa4;
    color: white;
    font-size: 1.5rem;
    font-weight: 600;
    width: 200px;
    height: 3.5rem;
    margin: 2rem auto 0;
    display: block;
    border-radius: 8px;
    transition: all 0.2s ease;

    &:hover {
        background-color: #229e8a;
        transform: translateY(-1px);
    }

    &:focus {
        box-shadow: 0 0 0 2px white, 0 0 0 4px #26baa4;
    }

    @media ${({ theme }) => theme.mobile} {
        font-size: 1.2rem;
        height: 3rem;
        width: 160px;
    }
`;

export default React.memo(EnterButton);