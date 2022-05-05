"use strict";
const boardTiles = document.querySelectorAll(".board__tile");
const boardRows = document.querySelectorAll(".board__row");
const keyboardButons = document.querySelectorAll(".keyboard__button");
const keyboardButtonBackspace = document.querySelector(
  ".keyboard__button--backspace"
);
const keyboardButtonEnter = document.querySelector(".keyboard__button--enter");

const boardRow1 = document.querySelector(".board__row__1");
const boardRow2 = document.querySelector(".board__row__2");
const boardRow3 = document.querySelector(".board__row__3");
const boardRow4 = document.querySelector(".board__row__4");
const boardRow5 = document.querySelector(".board__row__5");
const boardRow6 = document.querySelector(".board__row__6");

let guessArray = [];
let answerArray = ["W", "A", "T", "E", "R"];

let rowIndex = 0;

let tiles = boardRows[rowIndex].querySelectorAll(".board__tile");

const updateTiles = function () {
  rowIndex++;
  tiles = boardRows[rowIndex].querySelectorAll(".board__tile");
};

keyboardButons.forEach((button) => {
  button.addEventListener("click", function () {
    guessArray.push(button.value);
    if (guessArray.length > 5) {
      guessArray.pop();
    }
    console.log(guessArray);

    tiles.forEach((tile, i) => {
      tile.textContent = guessArray[i];
    });
  });
});

keyboardButtonBackspace.addEventListener("click", function () {
  guessArray.pop();
  console.log(guessArray);
  tiles.forEach((tile, i) => {
    tile.textContent = guessArray[i];
  });
});

keyboardButtonEnter.addEventListener("click", function () {
  if (guessArray.length === 5) {
    tiles.forEach((tile, i) => {
      if (tile.textContent !== answerArray[i]) {
        tile.style.backgroundColor = "grey";
        tile.style.color = "white";
      }
      if (answerArray.includes(tile.textContent)) {
        tile.style.backgroundColor = "yellow";
        tile.style.color = "white";
      }
      if (tile.textContent === answerArray[i]) {
        tile.style.backgroundColor = "green";
        tile.style.color = "white";
      }
    });
    guessArray = [];
    updateTiles();
  }
});
