// src/ghost-leg/Components/Main.js
import React from "react";
import styled from "styled-components";

const Main = ({ page, gameState, children }) => {
  return (
      <Wrapper>
        {children}
      </Wrapper>
  );
};

const Wrapper = styled.main`
    width: 100vw;
    height: 80vh;
    position: relative;
`;

export default React.memo(Main);