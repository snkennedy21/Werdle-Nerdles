"use strict";
const boardTiles = document.querySelectorAll(".board__tile");
const allBoardRows = document.querySelectorAll(".board__row");
const keyboard = document.querySelector(".keyboard");
const keyboardButons = document.querySelectorAll(".keyboard__button");
const keyboardButtonBackspace = document.querySelector(
  ".keyboard__button--backspace"
);
const keyboardButtonEnter = document.querySelector(".keyboard__button--enter");
const frontOfBoardTiles = document.querySelectorAll(".front");
const backOfBoardTiles = document.querySelectorAll(".back");
const boardTileContainers = document.querySelectorAll(
  ".board__tile__container"
);

class App {
  #guessArray = [];
  #answerArray = ["W", "A", "T", "E", "R"];
  #rowIndex = 0;
  #tiles;
  #pressedKey;
  #guessArrayIsFull = false;
  #playerGuessMatchesTheAnswer = false;
  #currentRowOfPlay;
  #allTileContainersInCurrentRowOfPlay;
  #frontOfAllTilesInCurrentRowOfPlay;
  #backOfAllTilesInCurrentRowOfPlay;
  #arrayOfAllKeyboardValues = [];
  #keyPressedIsNotAcceptable = true;
  constructor() {
    this._buildArrayOfAllKeyboardValues();
    keyboard.addEventListener("click", this._playTheGame.bind(this));
    window.addEventListener("keydown", this._playTheGame.bind(this));
  }

  _buildArrayOfAllKeyboardValues() {
    keyboardButons.forEach((el) => {
      this.#arrayOfAllKeyboardValues.push(el.value);
    });
  }

  _playTheGame(e) {
    this._identifyCurrentRowOfPlay();
    this._selectTilesInCurrentRowOfPlay();
    this._identifyWhichKeyWasPressed(e);
    if (this.#pressedKey === "Enter") {
      this._checkIfGuessArrayIsFull();
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
      this._checkIfGuessArrayIsFull();
    }
    if (this.#pressedKey !== "Enter" && this.#pressedKey !== "Backspace") {
      console.log(this.#pressedKey);
      this._addLetterOfPressedKeyToGuessArray();
      if (this.#keyPressedIsNotAcceptable)
        this._removeLastLetterFromGuessArray();
      this._checkIfGuessArrayIsFull();
      if (this.#guessArrayIsFull) this._stopAddingLettersToGuessArray();
      console.log(this.#guessArray);
      this._setTheTextContentForTilesInCurrentRowOfPlay();
    }
  }

  _checkIfPlayerGuessMatchesTheAnswer() {
    if (this.#guessArray.every((el, i) => el === this.#answerArray[i])) {
      this.#playerGuessMatchesTheAnswer = true;
    }
  }

  _flipTiles() {
    this.#allTileContainersInCurrentRowOfPlay.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add("flip");
      }, i * 300);
    });
  }

  _updateTileColors() {
    this.#backOfAllTilesInCurrentRowOfPlay.forEach((tile, i) => {
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
    this._flipTiles();
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

  _checkifKeyPressedIsAcceptable(e) {
    if (
      this.#arrayOfAllKeyboardValues.includes(
        e.key[0].toUpperCase() + e.key.slice(1)
      )
    ) {
      this.#pressedKey = e.key[0].toUpperCase() + e.key.slice(1);
      this.#keyPressedIsNotAcceptable = false;
    }
    if (
      !this.#arrayOfAllKeyboardValues.includes(
        e.key[0].toUpperCase() + e.key.slice(1)
      )
    ) {
      this.#pressedKey = " ";
      this.#keyPressedIsNotAcceptable = true;
    }
  }

  _identifyWhichKeyWasPressed(e) {
    e.preventDefault();
    if (e.type === "keydown") {
      this._checkifKeyPressedIsAcceptable(e);
    }
    if (e.type === "click") {
      this.#keyPressedIsNotAcceptable = false;
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
    this.#frontOfAllTilesInCurrentRowOfPlay =
      this.#currentRowOfPlay.querySelectorAll(".front");
    this.#backOfAllTilesInCurrentRowOfPlay =
      this.#currentRowOfPlay.querySelectorAll(".back");
    this.#allTileContainersInCurrentRowOfPlay =
      this.#currentRowOfPlay.querySelectorAll(".board__tile__container");
  }

  _setTheTextContentForTilesInCurrentRowOfPlay() {
    this.#frontOfAllTilesInCurrentRowOfPlay.forEach((tile, i) => {
      tile.textContent = this.#guessArray[i];
    });
    this.#backOfAllTilesInCurrentRowOfPlay.forEach((tile, i) => {
      tile.textContent = this.#guessArray[i];
    });
  }
}

const app = new App();
