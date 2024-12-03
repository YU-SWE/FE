import React, { createContext } from "react";
import useHook from "./Hooks";

export const Context = createContext(null);

export const Provider = ({ children }) => {
  const {
    state,
    incPlayers,
    decPlayers,
    enterGame,
    startGame,
    checkReady,
    inputCase,
    goHome,
    goResult,
    goGame,
    updateResult,
  } = useHook();

  const contextValue = {
    state,
    incPlayers,
    decPlayers,
    enterGame,
    startGame,
    checkReady,
    inputCase,
    goHome,
    goResult,
    goGame,
    updateResult,
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export default Context;  // default export 추가