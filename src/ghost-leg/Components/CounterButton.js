// src/ghost-leg/Components/CounterButton.js
import React from "react";
import styled from "styled-components";
import { ArrowLeft, ArrowRight } from 'lucide-react';

const CounterButton = ({ playerCount, direction, incPlayers, decPlayers }) => {
  return (
      <>
        {direction === "left" ? (
            <Button
                aria-label="플레이어 수 감소"
                onClick={decPlayers}
                disabled={playerCount <= 2}
            >
              <ArrowLeft
                  size={32}
                  color={playerCount < 3 ? "#ccc" : "#26baa4"}
              />
            </Button>
        ) : (
            <Button
                aria-label="플레이어 수 증가"
                onClick={incPlayers}
                disabled={playerCount >= 10}
            >
              <ArrowRight
                  size={32}
                  color={playerCount > 9 ? "#ccc" : "#26baa4"}
              />
            </Button>
        )}
      </>
  );
};

const Button = styled.button`
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    &:not(:disabled):hover {
        background-color: rgba(38, 186, 164, 0.1);
    }

    &:disabled {
        cursor: not-allowed;
    }

    &:focus {
        box-shadow: 0 0 0 2px white, 0 0 0 4px #26baa4;
    }

    @media ${({ theme }) => theme.mobile} {
        width: 3rem;
        height: 3rem;
    }
`;

export default React.memo(CounterButton);