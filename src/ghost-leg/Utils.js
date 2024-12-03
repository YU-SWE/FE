// src/ghost-leg/Utils.js
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

const resetCase = (playerCount) => {
  const cases = {};
  for (let i = 0; i < playerCount; i++) cases[i] = "";
  return cases;
};

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const getRandomPlayers = (playerCount, data) => {
  const players = new Set();
  while (players.size < playerCount) players.add(data[getRandomNumber(0, 10)]);
  return [...players];
};

const getRandomLegs = (playerCount) => {
  const legCounts = [];
  const legs = [];
  let rows = new Set();
  let column = 0;

  for (let i = 1; i < playerCount; i++) legCounts.push(getRandomNumber(2, 5));

  while (column < playerCount - 1) {
    if (rows.size === legCounts[column]) {
      legs.push([...rows].sort());
      rows = new Set();
      column++;
    }

    const num = getRandomNumber(0, 9);
    if (column < 1) rows.add(num);
    else {
      const isDuplicate = legs[column - 1].includes(num);
      if (!isDuplicate) rows.add(num);
    }
  }

  return legs;
};

export { resetCase, getRandomLegs, getRandomPlayers };