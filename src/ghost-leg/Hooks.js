// Hooks.js
import { useReducer, useCallback } from "react";
import Reducer, { initState } from './Reducer';  // Reducer를 default export로 가정

const useHook = () => {
  const [state, dispatch] = useReducer(Reducer, initState);

  const incPlayers = useCallback(() => dispatch({ type: "INC_PLAYERS" }), []);
  const decPlayers = useCallback(() => dispatch({ type: "DEC_PLAYERS" }), []);
  const enterGame = useCallback(() => dispatch({ type: "ENTER_GAME" }), []);
  const startGame = useCallback(() => dispatch({ type: "START_GAME" }), []);

  const checkReady = useCallback((cases) => {
    const isReady = Object.values(cases).every((value) => value.trim() !== "");
    dispatch({ type: "CHECK_READY", isReady });
  }, []);

  const inputCase = useCallback((e, idx) => {
    const { value } = e.target;
    dispatch({ type: "INPUT_CASE", idx, value });
  }, []);

  const goHome = useCallback(() => dispatch({ type: "GO_HOME" }), []);
  const goResult = useCallback(() => dispatch({ type: "GO_RESULT" }), []);
  const goGame = useCallback(() => dispatch({ type: "GO_GAME" }), []);

  const updateResult = useCallback((idx, posX) =>
      dispatch({ type: "UPDATE_RESULT", idx, posX }), []);

  return {
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
};

export default useHook;