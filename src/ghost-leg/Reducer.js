import { resetCase, getRandomLegs, getRandomPlayers } from "./Utils";
import tiger from './icon/tiger.png';
import pig from './icon/pig.png';
import penguin from './icon/penguin.png';
import giraffe from './icon/giraffe.png';
import dog from './icon/dog.png';
import elephant from './icon/elephant.png';
import fox from './icon/fox.png';
import dolphin from './icon/dolphin.png';
import horse from './icon/horse.png';
import panda from './icon/panda.png';

export const data = [
  {
    id: 1,
    name: "호랑이",
    src: tiger,
    color: "gray",
  },
  {
    id: 2,
    name: "돼지",
    src: pig,
    color: "crimson",
  },
  {
    id: 3,
    name: "펭귄",
    src: penguin,
    color: "darkolivegreen",
  },
  {
    id: 4,
    name: "판다",
    src: panda,
    color: "lightseagreen",
  },
  {
    id: 5,
    name: "강아지",
    src: dog,
    color: "darkorange",
  },
  {
    id: 6,
    name: "기린",
    src: giraffe,
    color: "peru",
  },
  {
    id: 7,
    name: "돌고래",
    src: dolphin,
    color: "royalblue",
  },
  {
    id: 8,
    name: "말",
    src: horse,
    color: "saddlebrown",
  },
  {
    id: 9,
    name: "여우",
    src: fox,
    color: "salmon",
  },
  {
    id: 10,
    name: "코끼리",
    src: elephant,
    color: "rebeccapurple",
  },
];

export const initState = {
  page: "home",
  playerCount: 2,
  players: [],
  cases: {},
  results: {},
  gameState: "notReady",
  legs: [],
};

export const reducer = (state, action) => {
  const bla = () => console.log("from reducer", state);

  switch (action.type) {
    case "INC_PLAYERS":
      return {
        ...state,
        playerCount: state.playerCount + 1,
      };
    case "DEC_PLAYERS":
      return {
        ...state,
        playerCount: state.playerCount - 1,
      };
    case "ENTER_GAME":
      return {
        ...state,
        page: "game",
        players: getRandomPlayers(state.playerCount, data),
        cases: resetCase(state.playerCount),
        legs: getRandomLegs(state.playerCount),
      };
    case "START_GAME":
      return {
        ...state,
        gameState: "playing",
      };
    case "INPUT_CASE":
      return {
        ...state,
        cases: {
          ...state.cases,
          [action.idx]: action.value,
        },
      };
    case "CHECK_READY":
      return {
        ...state,
        gameState: action.isReady ? "ready" : "notReady",
      };
    case "GO_HOME":
      return {
        ...state,
        page: "home",
        gameState: "notReady",
      };
    case "GO_RESULT":
      return {
        ...state,
        page: "result",
        gameState: "notReady",
      };
    case "GO_GAME":
      return {
        ...state,
        page: "game",
        gameState: "notReady",
        results: {},
        players: getRandomPlayers(state.playerCount, data),
        cases: resetCase(state.playerCount),
        legs: getRandomLegs(state.playerCount),
      };
    case "UPDATE_RESULT":
      return {
        ...state,
        gameState: Object.keys(state.results).length + 1 === state.playerCount ? "done" : "playing",
        results: {
          ...state.results,
          [action.idx]: action.posX,
        },
      };
    default:
      throw new Error("Unhandled action type");
  }
};

export default reducer;