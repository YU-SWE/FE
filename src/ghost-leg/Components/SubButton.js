// src/ghost-leg/Components/SubButton.js
import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SubButton = ({ text, icon, label, live, event, focus }) => {
  return (
      <Button
          aria-label={label}
          aria-live={live || "off"}
          onClick={event}
          autoFocus={focus || false}
      >
        <Text>{text}</Text>
        <FontAwesomeIcon icon={icon} />
      </Button>
  );
};

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #26baa4;
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.2s ease;
  margin: 0.25rem;
  min-width: 120px;

  &:hover {
    background-color: #229e8a;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px white, 0 0 0 4px #26baa4;
  }

  svg {
    width: 1rem;
    height: 1rem;
  }

  .dark & {
    background-color: #229e8a;

    &:hover {
      background-color: #1a8a78;
    }

    &:focus {
      box-shadow: 0 0 0 2px #27272a, 0 0 0 4px #26baa4;
    }
  }

  @media ${({ theme }) => theme.mobile} {
    font-size: 0.8rem;
    padding: 0.5rem 1rem;
    min-width: 100px;
  }
`;

const Text = styled.span`
  color: white;
  font-size: inherit;
`;

export default React.memo(SubButton);