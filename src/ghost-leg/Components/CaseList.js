import React, { useEffect } from "react";
import styled, { css } from "styled-components";
import A11yTitle from "./A11yTitle";

const Case = React.memo(
  ({ idx, value, gameState, inputCase, resultColor, playerCount }) => {
    // console.log("cases rendering");
    return (
      <>
        <CaseWrapper playerCount={playerCount}>
          {["setting", "ready", "notReady"].includes(gameState) ? (
            <CaseInput
              type="text"
              aria-label={`금액`}
              placeholder={`금액`}
              gameState={gameState}
              onChange={(e) => inputCase(e, idx)}
              value={value}
              tabIndex={idx + 2}
              autoFocus={!idx}
            />
          ) : (
            <CaseBox resultColor={resultColor}>{value}</CaseBox>
          )}
        </CaseWrapper>
      </>
    );
  }
);

const CaseList = ({
  players,
  playerCount,
  gameState,
  results,
  cases,
  checkReady,
  inputCase,
}) => {
  // console.log("caselist rendering");
  useEffect(() => {
    Object.keys(cases).length && checkReady(cases);
  }, [cases]);

  return (
    <CaseListWrapper>
      {players.map((_, idx) => {
        let result = null;
        for (const player in results) {
          if (results[player] === idx) result = player;
        }
        return (
          <Case
            key={idx}
            idx={idx}
            value={cases[idx]}
            gameState={gameState}
            inputCase={inputCase}
            playerCount={playerCount}
            resultColor={players[result] && players[result].color}
          />
        );
      })}
    </CaseListWrapper>
  );
};

const CaseListWrapper = styled.ul`
  display: flex;
  justify-content: space-around;
  margin: 0 auto;
  width: 80%;
  list-style: none;  /* 추가: 점 제거 */
  padding: 0;  /* 추가: 기본 패딩 제거 */

  @media ${({ theme }) => theme.mobile} {
    width: 100%;
  }
`;

const CaseWrapper = styled.li`
  flex-basis: ${({ playerCount }) => (playerCount < 4 ? "30%" : "20%")};
  padding: 0 0.5%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  list-style: none;  /* 추가: 점 제거 */
`;

const caseStyle = css`
  height: 4rem;
  width: 100%;
  border: 2px solid cornflowerblue;
  border-radius: 5px;
  font-size: 1.6rem;
  text-align: center;

  @media ${({ theme }) => theme.mobile} {
    height: 3rem;
    font-size: 1.4rem;
  }
`;

const FoodLabel = styled.span`
    font-size: 1rem;
    color: #333;
    margin-bottom: 0.25rem;
    font-weight: 500;

    .dark & {
        color: #e4e4e7;
    }
`;

const CaseInput = styled.input`
  height: 3rem;  /* 수정: 높이 증가 */
  width: 100%;
  border: 2px solid #26baa4;
  border-radius: 5px;
  font-size: 1.2rem;  /* 수정: 폰트 크기 증가 */
  text-align: center;
  padding: 0.5rem;

  &::placeholder {
    text-align: center;
    font-size: 1.1rem;  /* 수정: placeholder 폰트 크기도 증가 */
    color: #999;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(38, 186, 164, 0.2);
  }

  @media ${({ theme }) => theme.mobile} {
    height: 2.5rem;
    font-size: 1.1rem;

    &::placeholder {
      font-size: 1rem;
    }
  }

  .dark & {
    background-color: #27272a;
    border-color: #26baa4;
    color: #e4e4e7;

    &::placeholder {
      color: #71717a;
    }
  }
`;

const CaseBox = styled.div`
  height: 3rem;  /* 수정: 높이 증가 */
  width: 100%;
  color: white;
  background-color: ${({ resultColor }) => resultColor || "#26baa4"};
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 0.5rem;
  font-size: 1.2rem;  /* 수정: 폰트 크기 증가 */

  @media ${({ theme }) => theme.mobile} {
    height: 2.5rem;
    font-size: 1.1rem;
  }
`;


export default React.memo(CaseList);
