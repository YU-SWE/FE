// src/ghost-leg/Components/Players.js
import React from "react";
import styled from "styled-components";
import A11yTitle from "./A11yTitle";

const Players = ({ players }) => {
    const height = (window.innerHeight * 0.8) / players.length;

    return (
        <>
            <PlayerList height={height}>
                {players.map(({ id, name, src }) => (
                    <Player key={id} height={height}>
                        <PlayerImg src={src} alt={`${name} 플레이어`} />
                    </Player>
                ))}
            </PlayerList>
        </>
    );
};

const PlayerList = styled.ul`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin: 0 auto;
  margin-top: 8rem;
  width: 80%;
  height: ${({ height }) => height};

  @media ${({ theme }) => theme.mobile} {
    width: 100%;
    margin-top: 7rem;
  }
`;

const Player = styled.li`
  width: 20%;
  height: ${({ height }) => height};
  display: flex;
  justify-content: center;
`;

const PlayerImg = styled.img`
  display: block;
  margin: 0 auto;
  width: 70%;
  min-height: 4rem;
  min-width: 4rem;
  max-width: 8rem;
  object-fit: contain;
  padding: 0.5rem;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  .dark & {
    background-color: #27272a;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }

  @media ${({ theme }) => theme.mobile} {
    max-width: 6rem;
    width: 30%;
  }
`;

export default React.memo(Players);