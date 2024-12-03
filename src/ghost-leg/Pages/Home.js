// src/ghost-leg/Pages/Home.js
import React from "react";
import EnterButtonContainer from "../Containers/EnterButtonContainer";
import CounterContainer from "../Containers/CounterContainer";
import styled from "styled-components";

const Home = () => {
    return (
        <HomeWrapper>
            <ContentContainer>
                <Title>참여할 인원 수를 선택하세요</Title>
                <SubTitle>(2-10명)</SubTitle>
                <CounterContainer />
                <EnterButtonContainer />
            </ContentContainer>
        </HomeWrapper>
    );
};

const HomeWrapper = styled.div`
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: calc(100vh - 300px);
  padding-top: 3px;
`;

const ContentContainer = styled.div`
  background: ${({ theme }) => theme.dark ? '#27272a' : 'white'};
  padding: 2rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 600px;
  margin-top: 15px;
  transition: background-color 0.3s ease;

  .dark & {
    background-color: #27272a;
  }
`;

const Title = styled.h3`
  text-align: center;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.dark ? '#e4e4e7' : '#333'};
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;

  .dark & {
    color: #e4e4e7;
  }
`;

const SubTitle = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.dark ? '#a1a1aa' : '#666'};
  margin-bottom: 2rem;
  transition: color 0.3s ease;

  .dark & {
    color: #a1a1aa;
  }
`;

export default React.memo(Home);

// src/ghost-leg/Components/CounterButton.js
const CounterButton = styled.button`
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    background-color: ${({ theme }) => theme.dark ? '#3f3f46' : 'white'};

    &:not(:disabled):hover {
        background-color: ${({ theme }) =>
    theme.dark ? '#52525b' : 'rgba(38, 186, 164, 0.1)'};
    }

    &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }

    .dark & {
        background-color: #3f3f46;
        
        &:not(:disabled):hover {
            background-color: #52525b;
        }
    }
`;

// src/ghost-leg/Components/EnterButton.js
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
        box-shadow: 0 0 0 2px ${({ theme }) =>
    theme.dark ? '#27272a' : 'white'}, 
            0 0 0 4px #26baa4;
    }

    .dark & {
        &:focus {
            box-shadow: 0 0 0 2px #27272a, 0 0 0 4px #26baa4;
        }
    }
`;