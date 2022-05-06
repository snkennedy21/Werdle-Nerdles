"use strict";
const boardTiles = document.querySelectorAll(".board__tile");
const allBoardRows = document.querySelectorAll(".board__row");
const keyboard = document.querySelector(".keyboard");
const keyboardButons = document.querySelectorAll(".keyboard__button");
const keyboardButtonBackspace = document.querySelector(
  ".keyboard__button--backspace"
);
const keyboardButtonEnter = document.querySelector(".keyboard__button--enter");

class App {
  #guessArray = [];
  #answerArray = ["W", "A", "T", "E", "R"];
  #rowIndex = 0;
  #tiles;
  #pressedKey;
  #guessArrayIsFull = false;
  #playerGuessMatchesTheAnswer = false;
  #currentRowOfPlay;
  #allTilesInCurrentRowOfPlay;
  constructor() {
    keyboard.addEventListener("click", this._playTheGame.bind(this));
    window.addEventListener("keydown", this._playTheGame.bind(this));
  }

  _playTheGame(e) {
    this._identifyCurrentRowOfPlay();
    this._selectTilesInCurrentRowOfPlay();
    this._identifyWhichKeyWasPressed(e);
    if (this.#pressedKey === "Enter") {
      this._checkIfGuessArrayIsFull();
      console.log(this.#guessArray);
      if (!this.#guessArrayIsFull) alert("not complete word");
      if (this.#guessArrayIsFull) {
        this._submitPlayerGuess();
        this._increaseRowIndex();
        this._resetGuessArrayToEmpty();
      }
    }
    if (this.#pressedKey === "Backspace") {
      this._removeLastLetterFromGuessArray();
      console.log(this.#guessArray);
      this._setTheTextContentForTilesInCurrentRowOfPlay();
    }
    if (this.#pressedKey !== "Enter" && this.#pressedKey !== "Backspace") {
      this._addLetterOfPressedKeyToGuessArray();
      console.log(this.#guessArray);
      this._checkIfGuessArrayIsFull();
      if (this.#guessArrayIsFull) this._stopAddingLettersToGuessArray();
      this._setTheTextContentForTilesInCurrentRowOfPlay();
    }
  }

  _checkIfPlayerGuessMatchesTheAnswer() {
    if (this.#guessArray.every((el, i) => el === this.#answerArray[i])) {
      this.#playerGuessMatchesTheAnswer = true;
    }
  }

  _updateTileColors() {
    this.#allTilesInCurrentRowOfPlay.forEach((tile, i) => {
      if (tile.textContent !== this.#answerArray[i]) {
        tile.style.backgroundColor = "grey";
        tile.style.color = "white";
        tile.style.border = "none";
      }
      if (this.#answerArray.includes(tile.textContent)) {
        tile.style.backgroundColor = "#ffc425";
        tile.style.color = "white";
        tile.style.border = "none";
      }
      if (tile.textContent === this.#answerArray[i]) {
        tile.style.backgroundColor = "#008000";
        tile.style.color = "white";
        tile.style.border = "none";
      }
    });
  }

  _submitPlayerGuess() {
    this._updateTileColors();
    this._checkIfPlayerGuessMatchesTheAnswer();
  }

  _resetGuessArrayToEmpty() {
    this.#guessArray = [];
  }

  _increaseRowIndex() {
    this.#rowIndex++;
  }

  _removeLastLetterFromGuessArray() {
    this.#guessArray.pop();
  }

  _identifyWhichKeyWasPressed(e) {
    e.preventDefault();
    if (e.type === "keydown") {
      this.#pressedKey = e.key[0].toUpperCase() + e.key.slice(1);
    }
    if (e.type === "click") {
      this.#pressedKey = e.target.closest(".keyboard__button").value;
    }
  }

  _addLetterOfPressedKeyToGuessArray() {
    this.#guessArray.push(this.#pressedKey);
  }

  _checkIfGuessArrayIsFull() {
    if (this.#guessArray.length < 5) this.#guessArrayIsFull = false;
    if (this.#guessArray.length >= 5) this.#guessArrayIsFull = true;
  }

  _stopAddingLettersToGuessArray() {
    if (this.#guessArray.length > 5) this.#guessArray.pop();
  }

  _identifyCurrentRowOfPlay() {
    this.#currentRowOfPlay = allBoardRows[this.#rowIndex];
  }

  _selectTilesInCurrentRowOfPlay() {
    this.#allTilesInCurrentRowOfPlay =
      this.#currentRowOfPlay.querySelectorAll(".board__tile");
  }

  _setTheTextContentForTilesInCurrentRowOfPlay() {
    this.#allTilesInCurrentRowOfPlay.forEach((tile, i) => {
      tile.textContent = this.#guessArray[i];
    });
  }
}

const app = new App();
