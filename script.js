"use strict";
const boardTiles = document.querySelectorAll(".board__tile");
const allBoardRows = document.querySelectorAll(".board__row");
const keyboard = document.querySelector(".keyboard");
const keyboardButtons = document.querySelectorAll(".keyboard__button");
const keyboardButtonBackspace = document.querySelector(
  ".keyboard__button--backspace"
);
const keyboardButtonEnter = document.querySelector(".keyboard__button--enter");
const frontOfBoardTiles = document.querySelectorAll(".front");
const backOfBoardTiles = document.querySelectorAll(".back");
const boardTileContainers = document.querySelectorAll(
  ".board__tile__container"
);
const successMessage = document.querySelector(".success__message");
const errorMessageWordTooShort = document.querySelector(
  ".error__message--short"
);
const errorMessageInvalidWord = document.querySelector(
  ".error__message--invalid"
);
const rulesModalCloseIcon = document.querySelector(".rules-modal__close-icon");
const headerIconRules = document.querySelector(".header__rules-icon");
const modalContainer = document.querySelector(".modal__container");
const rulesModal = document.querySelector(".rules-modal");
const exampleDivFlips = document.querySelectorAll(".example__div-flip");
const exampleBack = document.querySelector(".example__back");
const headerIconSettings = document.querySelector(".header__settings-icon");
const settingsModal = document.querySelector(".settings-modal");
const settingsModalCloseIcon = document.querySelector(
  ".settings-modal__close-icon"
);
const headerIconStatistics = document.querySelector(".header__statistics-icon");
const statisticsModalContainer = document.querySelector(
  ".statistics-modal__container"
);
const statisticsModal = document.querySelector(".statistics-modal");
const statisticsModalCloseIcon = document.querySelector(
  ".statistics-modal__close-icon"
);
const numberOfGamesPlayed = document.querySelector(
  ".statistics-modal__games-played"
);
const percentageOfGamesWon = document.querySelector(
  ".statistics-modal__percent-games-won"
);
const currentStreak = document.querySelector(
  ".statistics-modal__current-streak"
);
const maxStreak = document.querySelector(".statistics-modal__max-streak");

class KeyboardButtonObject {
  constructor(backgroundColor, color) {
    this.backgroundColor = backgroundColor;
    this.color = color;
  }
}

class Tile {
  constructor(tileFlipStatus, tileBackgroundColor, tileColor, tileText) {
    this.tileFlipStatus = tileFlipStatus;
    this.tileBackgroundColor = tileBackgroundColor;
    this.tileColor = tileColor;
    this.tileText = tileText;
  }
}

class App {
  #theGameIsNotActive = false;
  #scoreForCurrentRound;
  #guessArray = [];
  #answerArray = [];
  #rowIndex = 0;
  #pressedKey;
  #guessArrayIsFull = false;
  #playerGuessMatchesTheAnswer = false;
  #currentRowOfPlay;
  #allTileContainersInCurrentRowOfPlay;
  #frontOfAllTilesInCurrentRowOfPlay;
  #backOfAllTilesInCurrentRowOfPlay;
  #arrayOfAllKeyboardValues = [];
  #theKeyPressedIsAcceptable;
  #randomNumber;
  #theGuessIsAnAcceptableWord = true;
  #playerIsOnFinalRowOfPlay = false;
  #numberOfGamesPlayed;
  #percentageOfGamesWon;
  #numberOfGamesWon;
  #currentStreak;
  #maxStreak;
  #playerDataArray;
  #playerBoardDataArray = [];
  #keyboardButtonDataArray = [];
  #keyboardButtonBackgroundColor;
  #keyboardButtonColor;
  #thereIsNoAnAnswerInTheAnswerArray;
  #playerData;
  #thereIsDataForPlayerStatistics;

  constructor() {
    this._getTheAnswerFromLocalStorage();
    this._checkIfThereIsCurrentlyAnAnswerInTheAnswerArray();
    if (this.#thereIsNoAnAnswerInTheAnswerArray)
      this._pushTheLettersOfARandomWordFromTheWordListIntoTheAnswerArray();
    console.log(this.#answerArray);
    this._storeTheAnswerInLocalStorage();
    this._getTheBoardDataFromLocalStorage();
    this._createNewTileObjectsAndPushThemIntoTheBoardDataArray();
    this._removeOldTileObjectsFromTheBoardDataArray();
    this._setTheContentForTheBoardTiles();
    this._flipTheTilesThatHaveContent();
    this._getTheKeyboardDataFromLocalStorage();
    this._createNewKeyboardButtonObjectsAndPushThemIntoTheKeyboardButtonDataArray();
    this._removeOldKeyboardButtonObjectsFromTheEndOfTheKeyboardButtonDataArray();
    this._getDataForPlayersStatisticsFromLocalStorage();
    this._checkIfThereIsDataForPlayerStatistics();
    if (!this.#thereIsDataForPlayerStatistics)
      this._setDataForPlayerStatisticsToZero();
    if (this.#thereIsDataForPlayerStatistics)
      this._updateDataForPlayerStatistics();
    this._setTheColorsForTheKeyboardButtons();
    this._displayPlayerStatistics();
    this._buildArrayOfAllKeyboardValues();

    keyboard.addEventListener("click", this._playTheGame.bind(this));
    window.addEventListener("keydown", this._playTheGame.bind(this));
    headerIconRules.addEventListener("click", this._toggleModal.bind(this));
    headerIconSettings.addEventListener("click", this._toggleModal.bind(this));
    rulesModalCloseIcon.addEventListener("click", this._toggleModal.bind(this));
    settingsModalCloseIcon.addEventListener(
      "click",
      this._toggleModal.bind(this)
    );
    headerIconStatistics.addEventListener(
      "click",
      this._toggleStatisticsModal.bind(this)
    );
    statisticsModalCloseIcon.addEventListener(
      "click",
      this._toggleStatisticsModal.bind(this)
    );
  }

  /* *********************************************************************************
  These methods are called immediately by the constructor function when the page loads
  ********************************************************************************* */
  _getTheAnswerFromLocalStorage() {
    let answer = JSON.parse(localStorage.getItem("answer"));
    if (!answer) return;
    this.#answerArray = answer;
  }

  _checkIfThereIsCurrentlyAnAnswerInTheAnswerArray() {
    if (this.#answerArray.length !== 0)
      this.#thereIsNoAnAnswerInTheAnswerArray = false;
    if (this.#answerArray.length === 0)
      this.#thereIsNoAnAnswerInTheAnswerArray = true;
  }

  _pushTheLettersOfARandomWordFromTheWordListIntoTheAnswerArray() {
    this.#randomNumber = Math.floor(Math.random() * 2316) + 1;
    let answer = acceptableWordList[this.#randomNumber];
    [...answer].forEach((el) => this.#answerArray.push(el));
    console.log(this.#answerArray);
  }

  _storeTheAnswerInLocalStorage() {
    localStorage.setItem("answer", JSON.stringify(this.#answerArray));
  }

  _getTheBoardDataFromLocalStorage() {
    let boardData = JSON.parse(localStorage.getItem("playerBoard"));
    let rowData = JSON.parse(localStorage.getItem("rowIndex"));

    if (!boardData) return;

    this.#rowIndex = rowData + 1;
    this.#playerBoardDataArray = boardData;
    console.log(this.#playerBoardDataArray);
  }

  _createNewTileObjectsAndPushThemIntoTheBoardDataArray() {
    boardTileContainers.forEach((tile, i) => {
      let tileBackgroundColor = backOfBoardTiles[i].style.backgroundColor;
      let tileColor = backOfBoardTiles[i].style.color;
      let tileText = backOfBoardTiles[i].textContent;
      let tileFlipStatus;
      if (tile.classList.contains("flipped")) tileFlipStatus = true;
      if (!tile.classList.contains("flipped")) tileFlipStatus = false;
      let boardTile = new Tile(
        tileFlipStatus,
        tileBackgroundColor,
        tileColor,
        tileText
      );
      this.#playerBoardDataArray.push(boardTile);
    });
  }

  _removeOldTileObjectsFromTheBoardDataArray() {
    this.#playerBoardDataArray.splice(30);
  }

  _setTheContentForTheBoardTiles() {
    backOfBoardTiles.forEach((tile, i) => {
      tile.style.backgroundColor =
        this.#playerBoardDataArray[i].tileBackgroundColor;
      tile.style.color = this.#playerBoardDataArray[i].tileColor;
      tile.textContent = this.#playerBoardDataArray[i].tileText;
    });
  }

  _flipTheTilesThatHaveContent() {
    boardTileContainers.forEach((tile, i) => {
      if (this.#playerBoardDataArray[i].tileFlipStatus === true) {
        tile.classList.add("flip");
        tile.classList.add("flipped");
      }
    });
  }

  _getTheKeyboardDataFromLocalStorage() {
    const keyboardData = JSON.parse(localStorage.getItem("keyboard"));

    if (!keyboardData) return;

    this.#keyboardButtonDataArray = keyboardData;
  }

  _createNewKeyboardButtonObjectsAndPushThemIntoTheKeyboardButtonDataArray() {
    keyboardButtons.forEach((button, i) => {
      this.#keyboardButtonBackgroundColor = button.style.backgroundColor;
      this.#keyboardButtonColor = button.style.color;
      let keyboardButtonObject = new KeyboardButtonObject(
        this.#keyboardButtonBackgroundColor,
        this.#keyboardButtonColor
      );
      this.#keyboardButtonDataArray.push(keyboardButtonObject);
    });
  }

  _removeOldKeyboardButtonObjectsFromTheEndOfTheKeyboardButtonDataArray() {
    this.#keyboardButtonDataArray.splice(28);
  }

  _getDataForPlayersStatisticsFromLocalStorage() {
    this.#playerData = JSON.parse(localStorage.getItem("playerStatistics"));
  }

  _checkIfThereIsDataForPlayerStatistics() {
    if (!this.#playerData) this.#thereIsDataForPlayerStatistics = false;
    if (this.#playerData) this.#thereIsDataForPlayerStatistics = true;
  }

  _setDataForPlayerStatisticsToZero() {
    this.#playerDataArray = [0, 0, 0, 0, 0];
    this.#numberOfGamesPlayed = 0;
    this.#numberOfGamesWon = 0;
    this.#percentageOfGamesWon = 0;
    this.#currentStreak = 0;
    this.#maxStreak = 0;
  }

  _updateDataForPlayerStatistics() {
    this.#playerDataArray = this.#playerData;
    [
      this.#numberOfGamesPlayed,
      this.#numberOfGamesWon,
      this.#percentageOfGamesWon,
      this.#currentStreak,
      this.#maxStreak,
    ] = this.#playerDataArray;
  }

  _setTheColorsForTheKeyboardButtons() {
    keyboardButtons.forEach((button, i) => {
      if ((button.style.backgroundColor = "#68a868"))
        button.style.backgroundColor = "#68a868";
      button.style.backgroundColor =
        this.#keyboardButtonDataArray[i].backgroundColor;
      button.style.color = this.#keyboardButtonDataArray[i].color;
    });
  }

  _displayPlayerStatistics() {
    numberOfGamesPlayed.textContent = this.#numberOfGamesPlayed;
    percentageOfGamesWon.textContent = this.#percentageOfGamesWon;
    currentStreak.textContent = this.#currentStreak;
    maxStreak.textContent = this.#maxStreak;
  }

  _buildArrayOfAllKeyboardValues() {
    keyboardButtons.forEach((el) => {
      this.#arrayOfAllKeyboardValues.push(el.value);
    });
  }

  /* *******************************************************************
  This method runs the game whenever a letter/backspace/enter is pressed
  ******************************************************************* */
  _playTheGame(e) {
    if (this.#theGameIsNotActive) return;

    this._identifyCurrentRowOfPlay();
    this._selectTilesInCurrentRowOfPlay();
    this._identifyWhichKeyWasPressed(e);

    if (this.#pressedKey === "Enter") {
      this._checkIfGuessArrayIsFull();
      if (!this.#guessArrayIsFull) {
        this._shakeCurrentRowOfPlay();
        this._displayErrorMessageWordTooShort();
      }
      if (this.#guessArrayIsFull) {
        this._checkIfTheGuessIsAnAcceptableWord();
        if (!this.#theGuessIsAnAcceptableWord) {
          this._shakeCurrentRowOfPlay();
          this._displayErrorMessageInvalidWord();
        }
        if (this.#theGuessIsAnAcceptableWord) {
          this._checkIfPlayerGuessMatchesTheAnswer();
          this._updateTheColorsForTheTilesAndKeyboardButtons();
          this._flipTiles();
          // this._resetBoardTiles();
          this.#playerBoardDataArray = [];
          this._createNewTileObjectsAndPushThemIntoTheBoardDataArray();
          setTimeout(() => {
            this._createNewKeyboardButtonObjectsAndPushThemIntoTheKeyboardButtonDataArray();
            this._removeOldKeyboardButtonObjectsFromTheBeginningOfTheKeyboardButtonDataArray();
            this._storeTheKeyboardDataInLocalStorage();
          }, 2200);
          this._storeTheBoardDataInLocalStorage();
          if (this.#playerGuessMatchesTheAnswer) {
            this.#numberOfGamesPlayed++;
            this.#numberOfGamesWon++;
            this.#currentStreak++;
            this._applyJumpAnimationForTilesInCurrentRowOfPlay();
            this._displaySuccessMessage();
            this._checkIfTheMaxStreakShouldIncrease();
            this._calculateThePercentageOfGamesWon();
            this._updateValuesInThePlayerDataArray();
            this._setTheScoreForTheCurrentRound();
            this._displayPlayerStatistics();
            this.#theGameIsNotActive = true;
            this._storeTheDataForPlayerStatisticsInLocalStorage();
          }
          if (!this.#playerGuessMatchesTheAnswer) {
            this._checkIfPlayerIsOnFinalRow();
            if (this.#playerIsOnFinalRowOfPlay) {
              this.#numberOfGamesPlayed++;
              this.#currentStreak = 0;
              this._calculateThePercentageOfGamesWon();
              this._updateValuesInThePlayerDataArray();
              this._setTheScoreForTheCurrentRound();
              this._displayPlayerStatistics();
              this.#theGameIsNotActive = true;
              this._storeTheDataForPlayerStatisticsInLocalStorage();
            }
            this._moveToTheNextRowOfPlay();
            this._resetTheGuessArrayToEmpty();
          }
        }
      }
    }

    if (this.#pressedKey === "Backspace") {
      this._removeTheLastLetterFromTheGuessArray();
      this._setTheTextContentForTilesInCurrentRowOfPlay();
      // this._checkIfGuessArrayIsFull();
    }

    if (this.#pressedKey !== "Enter" && this.#pressedKey !== "Backspace") {
      this._addTheLetterOfThePressedKeyToGuessArray();
      if (!this.#theKeyPressedIsAcceptable)
        this._removeTheLastLetterFromTheGuessArray();
      this._checkIfGuessArrayIsFull();
      if (this.#guessArrayIsFull) this._stopAddingLettersToTheGuessArray();
      this._setTheTextContentForTilesInCurrentRowOfPlay();
    }
  }

  /* ****************************************************
  These are all the methods called in the playGame method
  **************************************************** */
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

  _identifyWhichKeyWasPressed(e) {
    e.preventDefault();
    if (e.type === "keydown") {
      this._setTheValueForThePressedKey(e);
    }
    if (e.type === "click") {
      this.#theKeyPressedIsAcceptable = true;
      this.#pressedKey = e.target.closest(".keyboard__button").value;
    }
  }

  _setTheValueForThePressedKey(e) {
    if (
      this.#arrayOfAllKeyboardValues.includes(
        e.key[0].toUpperCase() + e.key.slice(1)
      )
    ) {
      this.#pressedKey = e.key[0].toUpperCase() + e.key.slice(1);
      this.#theKeyPressedIsAcceptable = true;
    } else {
      this.#pressedKey = " ";
      this.#theKeyPressedIsAcceptable = false;
    }
  }

  _checkIfGuessArrayIsFull() {
    if (this.#guessArray.length < 5) this.#guessArrayIsFull = false;
    if (this.#guessArray.length >= 5) this.#guessArrayIsFull = true;
  }

  _shakeCurrentRowOfPlay() {
    this.#currentRowOfPlay.style.animation = "shake 0.3s linear";
    setTimeout(() => {
      this.#currentRowOfPlay.style.animation = "";
    }, 400);
  }

  _displayErrorMessageWordTooShort() {
    errorMessageWordTooShort.classList.remove("hidden");
    setTimeout(() => {
      errorMessageWordTooShort.classList.add("hidden");
    }, 1000);
  }

  _checkIfTheGuessIsAnAcceptableWord() {
    if (!acceptableWordList.includes(this.#guessArray.join(""))) {
      this.#theGuessIsAnAcceptableWord = false;
    }
    if (acceptableWordList.includes(this.#guessArray.join(""))) {
      this.#theGuessIsAnAcceptableWord = true;
    }
  }

  _displayErrorMessageInvalidWord() {
    errorMessageInvalidWord.classList.remove("hidden");
    setTimeout(() => {
      errorMessageInvalidWord.classList.add("hidden");
    }, 1000);
  }

  _checkIfPlayerGuessMatchesTheAnswer() {
    if (!this.#guessArray.every((el, i) => el === this.#answerArray[i])) {
      this.#playerGuessMatchesTheAnswer = false;
    }
    if (this.#guessArray.every((el, i) => el === this.#answerArray[i])) {
      this.#playerGuessMatchesTheAnswer = true;
    }
  }

  _updateTheColorsForTheTilesAndKeyboardButtons() {
    this.#backOfAllTilesInCurrentRowOfPlay.forEach((tile, i) => {
      // Update the tile colors based on guess
      if (tile.textContent !== this.#answerArray[i]) {
        tile.style.backgroundColor = "grey";
        tile.style.color = "white";
      }
      if (this.#answerArray.includes(tile.textContent)) {
        tile.style.backgroundColor = "#d0b363";
        tile.style.color = "white";
      }
      if (tile.textContent === this.#answerArray[i]) {
        tile.style.backgroundColor = "#68a868";
        tile.style.color = "white";
      }

      // Update the keyboard button colors based on guess
      keyboardButtons.forEach((button) => {
        if (button.value === tile.textContent) {
          setTimeout(() => {
            button.style.color = "white";
            if (button.style.backgroundColor === "rgb(104, 168, 104)") {
              button.style.backgroundColor = "rgb(104, 168, 104)";
            }
            if (button.style.backgroundColor !== "rgb(104, 168, 104)") {
              button.style.backgroundColor = tile.style.backgroundColor;
            }
          }, 2200);
        }
      });
    });
  }

  _flipTiles() {
    this.#allTileContainersInCurrentRowOfPlay.forEach((el, i) => {
      el.classList.add("flipped");
      setTimeout(() => {
        el.classList.add("flip");
      }, i * 300);
    });
  }

  _removeOldKeyboardButtonObjectsFromTheBeginningOfTheKeyboardButtonDataArray() {
    this.#keyboardButtonDataArray.splice(0, 28);
  }

  _storeTheKeyboardDataInLocalStorage() {
    console.log(this.#keyboardButtonDataArray);
    localStorage.setItem(
      "keyboard",
      JSON.stringify(this.#keyboardButtonDataArray)
    );
  }

  _storeTheBoardDataInLocalStorage() {
    localStorage.setItem(
      "playerBoard",
      JSON.stringify(this.#playerBoardDataArray)
    );
    localStorage.setItem("rowIndex", JSON.stringify(this.#rowIndex));
  }

  _checkIfTheMaxStreakShouldIncrease() {
    if (this.#currentStreak > this.#maxStreak) {
      this.#maxStreak = this.#currentStreak;
    }
  }

  _calculateThePercentageOfGamesWon() {
    this.#percentageOfGamesWon = Math.floor(
      (this.#numberOfGamesWon / this.#numberOfGamesPlayed) * 100
    );
  }

  _updateValuesInThePlayerDataArray() {
    this.#playerDataArray = [
      this.#numberOfGamesPlayed,
      this.#numberOfGamesWon,
      this.#percentageOfGamesWon,
      this.#currentStreak,
      this.#maxStreak,
    ];
  }

  _applyJumpAnimationForTilesInCurrentRowOfPlay() {
    this.#allTileContainersInCurrentRowOfPlay.forEach((tile, i) => {
      setTimeout(() => {
        tile.style.animation = `jump 0.5s ease-in-out ${i / 7}s`;
      }, 2200);
      setTimeout(() => {
        tile.style.animation = ``;
      }, 4000);
    });
  }

  _displaySuccessMessage() {
    setTimeout(() => {
      successMessage.classList.remove("hidden");
      setTimeout(() => {
        successMessage.classList.add("hidden");
      }, 1000);
    }, 2300);
  }

  _setTheScoreForTheCurrentRound() {
    if (this.#playerGuessMatchesTheAnswer)
      this.#scoreForCurrentRound = this.#rowIndex + 1;
    if (!this.#playerGuessMatchesTheAnswer) this.#scoreForCurrentRound = 6;
  }

  _checkIfPlayerIsOnFinalRow() {
    if (this.#rowIndex >= 5) {
      this.#rowIndex = 5;
      this.#playerIsOnFinalRowOfPlay = true;
    }
  }

  _storeTheDataForPlayerStatisticsInLocalStorage() {
    localStorage.setItem(
      "playerStatistics",
      JSON.stringify(this.#playerDataArray)
    );
  }

  _moveToTheNextRowOfPlay() {
    this.#rowIndex++;
    if (this.#rowIndex > 6) this.#rowIndex = 6;
  }

  _resetTheGuessArrayToEmpty() {
    this.#guessArray = [];
  }

  _removeTheLastLetterFromTheGuessArray() {
    this.#guessArray.pop();
  }

  _addTheLetterOfThePressedKeyToGuessArray() {
    this.#guessArray.push(this.#pressedKey);
  }

  _stopAddingLettersToTheGuessArray() {
    if (this.#guessArray.length > 5) this.#guessArray.pop();
  }

  _setTheTextContentForTilesInCurrentRowOfPlay() {
    this.#frontOfAllTilesInCurrentRowOfPlay.forEach((tile, i) => {
      tile.textContent = this.#guessArray[i];
    });
    this.#backOfAllTilesInCurrentRowOfPlay.forEach((tile, i) => {
      tile.textContent = this.#guessArray[i];
    });
  }

  /* ***************************
  These methods handle modal toggles
  *************************** */
  _resetGame() {
    this.#theGameIsNotActive = false;
    this._resetKeyboard();
  }

  _toggleStatisticsModal() {
    statisticsModalContainer.classList.toggle("invisible");
    statisticsModal.classList.toggle("transform-up");
  }

  _toggleModal(e) {
    modalContainer.classList.toggle("invisible");
    if (e.target.classList.contains("header__rules-icon")) {
      settingsModal.classList.toggle("hidden");
      rulesModal.classList.toggle("translate-up");
      setTimeout(() => {
        exampleDivFlips.forEach((el) => {
          el.classList.toggle("flip");
        });
      }, 200);
    }
    if (e.target.classList.contains("rules-modal__close-icon")) {
      rulesModal.classList.toggle("translate-up");
      setTimeout(() => {
        settingsModal.classList.toggle("hidden");
        exampleDivFlips.forEach((el) => {
          el.classList.toggle("flip");
        });
      }, 200);
    }
    if (
      e.target.classList.contains("header__settings-icon") ||
      e.target.classList.contains("settings-modal__close-icon")
    ) {
      settingsModal.classList.toggle("translate-up");
    }
  }

  _resetKeyboard() {
    keyboardButtons.forEach((button) => {
      button.style.backgroundColor = "#d2d4d9";
      button.style.color = "black";
    });
  }

  _reset() {
    localStorage.removeItem("playerStatistics");
    localStorage.removeItem("playerBoard");
    localStorage.removeItem("keyboard");
    localStorage.removeItem("answer");
  }
}

const acceptableWordList = [
  "CIGAR",
  "REBUT",
  "SISSY",
  "HUMPH",
  "AWAKE",
  "BLUSH",
  "FOCAL",
  "EVADE",
  "NAVAL",
  "SERVE",
  "HEATH",
  "DWARF",
  "MODEL",
  "KARMA",
  "STINK",
  "GRADE",
  "QUIET",
  "BENCH",
  "ABATE",
  "FEIGN",
  "MAJOR",
  "DEATH",
  "FRESH",
  "CRUST",
  "STOOL",
  "COLON",
  "ABASE",
  "MARRY",
  "REACT",
  "BATTY",
  "PRIDE",
  "FLOSS",
  "HELIX",
  "CROAK",
  "STAFF",
  "PAPER",
  "UNFED",
  "WHELP",
  "TRAWL",
  "OUTDO",
  "ADOBE",
  "CRAZY",
  "SOWER",
  "REPAY",
  "DIGIT",
  "CRATE",
  "CLUCK",
  "SPIKE",
  "MIMIC",
  "POUND",
  "MAXIM",
  "LINEN",
  "UNMET",
  "FLESH",
  "BOOBY",
  "FORTH",
  "FIRST",
  "STAND",
  "BELLY",
  "IVORY",
  "SEEDY",
  "PRINT",
  "YEARN",
  "DRAIN",
  "BRIBE",
  "STOUT",
  "PANEL",
  "CRASS",
  "FLUME",
  "OFFAL",
  "AGREE",
  "ERROR",
  "SWIRL",
  "ARGUE",
  "BLEED",
  "DELTA",
  "FLICK",
  "TOTEM",
  "WOOER",
  "FRONT",
  "SHRUB",
  "PARRY",
  "BIOME",
  "LAPEL",
  "START",
  "GREET",
  "GONER",
  "GOLEM",
  "LUSTY",
  "LOOPY",
  "ROUND",
  "AUDIT",
  "LYING",
  "GAMMA",
  "LABOR",
  "ISLET",
  "CIVIC",
  "FORGE",
  "CORNY",
  "MOULT",
  "BASIC",
  "SALAD",
  "AGATE",
  "SPICY",
  "SPRAY",
  "ESSAY",
  "FJORD",
  "SPEND",
  "KEBAB",
  "GUILD",
  "ABACK",
  "MOTOR",
  "ALONE",
  "HATCH",
  "HYPER",
  "THUMB",
  "DOWRY",
  "OUGHT",
  "BELCH",
  "DUTCH",
  "PILOT",
  "TWEED",
  "COMET",
  "JAUNT",
  "ENEMA",
  "STEED",
  "ABYSS",
  "GROWL",
  "FLING",
  "DOZEN",
  "BOOZY",
  "ERODE",
  "WORLD",
  "GOUGE",
  "CLICK",
  "BRIAR",
  "GREAT",
  "ALTAR",
  "PULPY",
  "BLURT",
  "COAST",
  "DUCHY",
  "GROIN",
  "FIXER",
  "GROUP",
  "ROGUE",
  "BADLY",
  "SMART",
  "PITHY",
  "GAUDY",
  "CHILL",
  "HERON",
  "VODKA",
  "FINER",
  "SURER",
  "RADIO",
  "ROUGE",
  "PERCH",
  "RETCH",
  "WROTE",
  "CLOCK",
  "TILDE",
  "STORE",
  "PROVE",
  "BRING",
  "SOLVE",
  "CHEAT",
  "GRIME",
  "EXULT",
  "USHER",
  "EPOCH",
  "TRIAD",
  "BREAK",
  "RHINO",
  "VIRAL",
  "CONIC",
  "MASSE",
  "SONIC",
  "VITAL",
  "TRACE",
  "USING",
  "PEACH",
  "CHAMP",
  "BATON",
  "BRAKE",
  "PLUCK",
  "CRAZE",
  "GRIPE",
  "WEARY",
  "PICKY",
  "ACUTE",
  "FERRY",
  "ASIDE",
  "TAPIR",
  "TROLL",
  "UNIFY",
  "REBUS",
  "BOOST",
  "TRUSS",
  "SIEGE",
  "TIGER",
  "BANAL",
  "SLUMP",
  "CRANK",
  "GORGE",
  "QUERY",
  "DRINK",
  "FAVOR",
  "ABBEY",
  "TANGY",
  "PANIC",
  "SOLAR",
  "SHIRE",
  "PROXY",
  "POINT",
  "ROBOT",
  "PRICK",
  "WINCE",
  "CRIMP",
  "KNOLL",
  "SUGAR",
  "WHACK",
  "MOUNT",
  "PERKY",
  "COULD",
  "WRUNG",
  "LIGHT",
  "THOSE",
  "MOIST",
  "SHARD",
  "PLEAT",
  "ALOFT",
  "SKILL",
  "ELDER",
  "FRAME",
  "HUMOR",
  "PAUSE",
  "ULCER",
  "ULTRA",
  "ROBIN",
  "CYNIC",
  "AGORA",
  "AROMA",
  "CAULK",
  "SHAKE",
  "PUPAL",
  "DODGE",
  "SWILL",
  "TACIT",
  "OTHER",
  "THORN",
  "TROVE",
  "BLOKE",
  "VIVID",
  "SPILL",
  "CHANT",
  "CHOKE",
  "RUPEE",
  "NASTY",
  "MOURN",
  "AHEAD",
  "BRINE",
  "CLOTH",
  "HOARD",
  "SWEET",
  "MONTH",
  "LAPSE",
  "WATCH",
  "TODAY",
  "FOCUS",
  "SMELT",
  "TEASE",
  "CATER",
  "MOVIE",
  "LYNCH",
  "SAUTE",
  "ALLOW",
  "RENEW",
  "THEIR",
  "SLOSH",
  "PURGE",
  "CHEST",
  "DEPOT",
  "EPOXY",
  "NYMPH",
  "FOUND",
  "SHALL",
  "HARRY",
  "STOVE",
  "LOWLY",
  "SNOUT",
  "TROPE",
  "FEWER",
  "SHAWL",
  "NATAL",
  "FIBRE",
  "COMMA",
  "FORAY",
  "SCARE",
  "STAIR",
  "BLACK",
  "SQUAD",
  "ROYAL",
  "CHUNK",
  "MINCE",
  "SLAVE",
  "SHAME",
  "CHEEK",
  "AMPLE",
  "FLAIR",
  "FOYER",
  "CARGO",
  "OXIDE",
  "PLANT",
  "OLIVE",
  "INERT",
  "ASKEW",
  "HEIST",
  "SHOWN",
  "ZESTY",
  "HASTY",
  "TRASH",
  "FELLA",
  "LARVA",
  "FORGO",
  "STORY",
  "HAIRY",
  "TRAIN",
  "HOMER",
  "BADGE",
  "MIDST",
  "CANNY",
  "FETUS",
  "BUTCH",
  "FARCE",
  "SLUNG",
  "TIPSY",
  "METAL",
  "YIELD",
  "DELVE",
  "BEING",
  "SCOUR",
  "GLASS",
  "GAMER",
  "SCRAP",
  "MONEY",
  "HINGE",
  "ALBUM",
  "VOUCH",
  "ASSET",
  "TIARA",
  "CREPT",
  "BAYOU",
  "ATOLL",
  "MANOR",
  "CREAK",
  "SHOWY",
  "PHASE",
  "FROTH",
  "DEPTH",
  "GLOOM",
  "FLOOD",
  "TRAIT",
  "GIRTH",
  "PIETY",
  "PAYER",
  "GOOSE",
  "FLOAT",
  "DONOR",
  "ATONE",
  "PRIMO",
  "APRON",
  "BLOWN",
  "CACAO",
  "LOSER",
  "INPUT",
  "GLOAT",
  "AWFUL",
  "BRINK",
  "SMITE",
  "BEADY",
  "RUSTY",
  "RETRO",
  "DROLL",
  "GAWKY",
  "HUTCH",
  "PINTO",
  "GAILY",
  "EGRET",
  "LILAC",
  "SEVER",
  "FIELD",
  "FLUFF",
  "HYDRO",
  "FLACK",
  "AGAPE",
  "WENCH",
  "VOICE",
  "STEAD",
  "STALK",
  "BERTH",
  "MADAM",
  "NIGHT",
  "BLAND",
  "LIVER",
  "WEDGE",
  "AUGUR",
  "ROOMY",
  "WACKY",
  "FLOCK",
  "ANGRY",
  "BOBBY",
  "TRITE",
  "APHID",
  "TRYST",
  "MIDGE",
  "POWER",
  "ELOPE",
  "CINCH",
  "MOTTO",
  "STOMP",
  "UPSET",
  "BLUFF",
  "CRAMP",
  "QUART",
  "COYLY",
  "YOUTH",
  "RHYME",
  "BUGGY",
  "ALIEN",
  "SMEAR",
  "UNFIT",
  "PATTY",
  "CLING",
  "GLEAN",
  "LABEL",
  "HUNKY",
  "KHAKI",
  "POKER",
  "GRUEL",
  "TWICE",
  "TWANG",
  "SHRUG",
  "TREAT",
  "UNLIT",
  "WASTE",
  "MERIT",
  "WOVEN",
  "OCTAL",
  "NEEDY",
  "CLOWN",
  "WIDOW",
  "IRONY",
  "RUDER",
  "GAUZE",
  "CHIEF",
  "ONSET",
  "PRIZE",
  "FUNGI",
  "CHARM",
  "GULLY",
  "INTER",
  "WHOOP",
  "TAUNT",
  "LEERY",
  "CLASS",
  "THEME",
  "LOFTY",
  "TIBIA",
  "BOOZE",
  "ALPHA",
  "THYME",
  "ECLAT",
  "DOUBT",
  "PARER",
  "CHUTE",
  "STICK",
  "TRICE",
  "ALIKE",
  "SOOTH",
  "RECAP",
  "SAINT",
  "LIEGE",
  "GLORY",
  "GRATE",
  "ADMIT",
  "BRISK",
  "SOGGY",
  "USURP",
  "SCALD",
  "SCORN",
  "LEAVE",
  "TWINE",
  "STING",
  "BOUGH",
  "MARSH",
  "SLOTH",
  "DANDY",
  "VIGOR",
  "HOWDY",
  "ENJOY",
  "VALID",
  "IONIC",
  "EQUAL",
  "UNSET",
  "FLOOR",
  "CATCH",
  "SPADE",
  "STEIN",
  "EXIST",
  "QUIRK",
  "DENIM",
  "GROVE",
  "SPIEL",
  "MUMMY",
  "FAULT",
  "FOGGY",
  "FLOUT",
  "CARRY",
  "SNEAK",
  "LIBEL",
  "WALTZ",
  "APTLY",
  "PINEY",
  "INEPT",
  "ALOUD",
  "PHOTO",
  "DREAM",
  "STALE",
  "VOMIT",
  "OMBRE",
  "FANNY",
  "UNITE",
  "SNARL",
  "BAKER",
  "THERE",
  "GLYPH",
  "POOCH",
  "HIPPY",
  "SPELL",
  "FOLLY",
  "LOUSE",
  "GULCH",
  "VAULT",
  "GODLY",
  "THREW",
  "FLEET",
  "GRAVE",
  "INANE",
  "SHOCK",
  "CRAVE",
  "SPITE",
  "VALVE",
  "SKIMP",
  "CLAIM",
  "RAINY",
  "MUSTY",
  "PIQUE",
  "DADDY",
  "QUASI",
  "ARISE",
  "DONT",
  "REPOS",
  "AGING",
  "VALET",
  "OPIUM",
  "AVERT",
  "STUCK",
  "RECUT",
  "MULCH",
  "GENRE",
  "PLUME",
  "RIFLE",
  "COUNT",
  "INCUR",
  "TOTAL",
  "WREST",
  "MOCHA",
  "DETER",
  "STUDY",
  "LOVER",
  "SAFER",
  "RIVET",
  "FUNNY",
  "SMOKE",
  "MOUND",
  "UNDUE",
  "SEDAN",
  "PAGAN",
  "SWINE",
  "GUILE",
  "GUSTY",
  "EQUIP",
  "TOUGH",
  "CANOE",
  "CHAOS",
  "COVET",
  "HUMAN",
  "UDDER",
  "LUNCH",
  "BLAST",
  "STRAY",
  "MANGA",
  "MELEE",
  "LEFTY",
  "QUICK",
  "PASTE",
  "GIVEN",
  "OCTET",
  "RISEN",
  "GROAN",
  "LEAKY",
  "GRIND",
  "CARVE",
  "LOOSE",
  "SADLY",
  "SPILT",
  "APPLE",
  "SLACK",
  "HONEY",
  "FINAL",
  "SHEEN",
  "EERIE",
  "MINTY",
  "SLICK",
  "DERBY",
  "WHARF",
  "SPELT",
  "COACH",
  "ERUPT",
  "SINGE",
  "PRICE",
  "SPAWN",
  "FAIRY",
  "JIFFY",
  "FILMY",
  "STACK",
  "CHOSE",
  "SLEEP",
  "ARDOR",
  "NANNY",
  "NIECE",
  "WOOZY",
  "HANDY",
  "GRACE",
  "DITTO",
  "STANK",
  "CREAM",
  "USUAL",
  "DIODE",
  "VALOR",
  "ANGLE",
  "NINJA",
  "MUDDY",
  "CHASE",
  "REPLY",
  "PRONE",
  "SPOIL",
  "HEART",
  "SHADE",
  "DINER",
  "ARSON",
  "ONION",
  "SLEET",
  "DOWEL",
  "COUCH",
  "PALSY",
  "BOWEL",
  "SMILE",
  "EVOKE",
  "CREEK",
  "LANCE",
  "EAGLE",
  "IDIOT",
  "SIREN",
  "BUILT",
  "EMBED",
  "AWARD",
  "DROSS",
  "ANNUL",
  "GOODY",
  "FROWN",
  "PATIO",
  "LADEN",
  "HUMID",
  "ELITE",
  "LYMPH",
  "EDIFY",
  "MIGHT",
  "RESET",
  "VISIT",
  "GUSTO",
  "PURSE",
  "VAPOR",
  "CROCK",
  "WRITE",
  "SUNNY",
  "LOATH",
  "CHAFF",
  "SLIDE",
  "QUEER",
  "VENOM",
  "STAMP",
  "SORRY",
  "STILL",
  "ACORN",
  "APING",
  "PUSHY",
  "TAMER",
  "HATER",
  "MANIA",
  "AWOKE",
  "BRAWN",
  "SWIFT",
  "EXILE",
  "BIRCH",
  "LUCKY",
  "FREER",
  "RISKY",
  "GHOST",
  "PLIER",
  "LUNAR",
  "WINCH",
  "SNARE",
  "NURSE",
  "HOUSE",
  "BORAX",
  "NICER",
  "LURCH",
  "EXALT",
  "ABOUT",
  "SAVVY",
  "TOXIN",
  "TUNIC",
  "PRIED",
  "INLAY",
  "CHUMP",
  "LANKY",
  "CRESS",
  "EATER",
  "ELUDE",
  "CYCLE",
  "KITTY",
  "BOULE",
  "MORON",
  "TENET",
  "PLACE",
  "LOBBY",
  "PLUSH",
  "VIGIL",
  "INDEX",
  "BLINK",
  "CLUNG",
  "QUALM",
  "CROUP",
  "CLINK",
  "JUICY",
  "STAGE",
  "DECAY",
  "NERVE",
  "FLIER",
  "SHAFT",
  "CROOK",
  "CLEAN",
  "CHINA",
  "RIDGE",
  "VOWEL",
  "GNOME",
  "SNUCK",
  "ICING",
  "SPINY",
  "RIGOR",
  "SNAIL",
  "FLOWN",
  "RABID",
  "PROSE",
  "THANK",
  "POPPY",
  "BUDGE",
  "FIBER",
  "MOLDY",
  "DOWDY",
  "KNEEL",
  "TRACK",
  "CADDY",
  "QUELL",
  "DUMPY",
  "PALER",
  "SWORE",
  "REBAR",
  "SCUBA",
  "SPLAT",
  "FLYER",
  "HORNY",
  "MASON",
  "DOING",
  "OZONE",
  "AMPLY",
  "MOLAR",
  "OVARY",
  "BESET",
  "QUEUE",
  "CLIFF",
  "MAGIC",
  "TRUCE",
  "SPORT",
  "FRITZ",
  "EDICT",
  "TWIRL",
  "VERSE",
  "LLAMA",
  "EATEN",
  "RANGE",
  "WHISK",
  "HOVEL",
  "REHAB",
  "MACAW",
  "SIGMA",
  "SPOUT",
  "VERVE",
  "SUSHI",
  "DYING",
  "FETID",
  "BRAIN",
  "BUDDY",
  "THUMP",
  "SCION",
  "CANDY",
  "CHORD",
  "BASIN",
  "MARCH",
  "CROWD",
  "ARBOR",
  "GAYLY",
  "MUSKY",
  "STAIN",
  "DALLY",
  "BLESS",
  "BRAVO",
  "STUNG",
  "TITLE",
  "RULER",
  "KIOSK",
  "BLOND",
  "ENNUI",
  "LAYER",
  "FLUID",
  "TATTY",
  "SCORE",
  "CUTIE",
  "ZEBRA",
  "BARGE",
  "MATEY",
  "BLUER",
  "AIDER",
  "SHOOK",
  "RIVER",
  "PRIVY",
  "BETEL",
  "FRISK",
  "BONGO",
  "BEGUN",
  "AZURE",
  "WEAVE",
  "GENIE",
  "SOUND",
  "GLOVE",
  "BRAID",
  "SCOPE",
  "WRYLY",
  "ROVER",
  "ASSAY",
  "OCEAN",
  "BLOOM",
  "IRATE",
  "LATER",
  "WOKEN",
  "SILKY",
  "WRECK",
  "DWELT",
  "SLATE",
  "SMACK",
  "SOLID",
  "AMAZE",
  "HAZEL",
  "WRIST",
  "JOLLY",
  "GLOBE",
  "FLINT",
  "ROUSE",
  "CIVIL",
  "VISTA",
  "RELAX",
  "COVER",
  "ALIVE",
  "BEECH",
  "JETTY",
  "BLISS",
  "VOCAL",
  "OFTEN",
  "DOLLY",
  "EIGHT",
  "JOKER",
  "SINCE",
  "EVENT",
  "ENSUE",
  "SHUNT",
  "DIVER",
  "POSER",
  "WORST",
  "SWEEP",
  "ALLEY",
  "CREED",
  "ANIME",
  "LEAFY",
  "BOSOM",
  "DUNCE",
  "STARE",
  "PUDGY",
  "WAIVE",
  "CHOIR",
  "STOOD",
  "SPOKE",
  "OUTGO",
  "DELAY",
  "BILGE",
  "IDEAL",
  "CLASP",
  "SEIZE",
  "HOTLY",
  "LAUGH",
  "SIEVE",
  "BLOCK",
  "MEANT",
  "GRAPE",
  "NOOSE",
  "HARDY",
  "SHIED",
  "DRAWL",
  "DAISY",
  "PUTTY",
  "STRUT",
  "BURNT",
  "TULIP",
  "CRICK",
  "IDYLL",
  "VIXEN",
  "FUROR",
  "GEEKY",
  "COUGH",
  "NAIVE",
  "SHOAL",
  "STORK",
  "BATHE",
  "AUNTY",
  "CHECK",
  "PRIME",
  "BRASS",
  "OUTER",
  "FURRY",
  "RAZOR",
  "ELECT",
  "EVICT",
  "IMPLY",
  "DEMUR",
  "QUOTA",
  "HAVEN",
  "CAVIL",
  "SWEAR",
  "CRUMP",
  "DOUGH",
  "GAVEL",
  "WAGON",
  "SALON",
  "NUDGE",
  "HAREM",
  "PITCH",
  "SWORN",
  "PUPIL",
  "EXCEL",
  "STONY",
  "CABIN",
  "UNZIP",
  "QUEEN",
  "TROUT",
  "POLYP",
  "EARTH",
  "STORM",
  "UNTIL",
  "TAPER",
  "ENTER",
  "CHILD",
  "ADOPT",
  "MINOR",
  "FATTY",
  "HUSKY",
  "BRAVE",
  "FILET",
  "SLIME",
  "GLINT",
  "TREAD",
  "STEAL",
  "REGAL",
  "GUEST",
  "EVERY",
  "MURKY",
  "SHARE",
  "SPORE",
  "HOIST",
  "BUXOM",
  "INNER",
  "OTTER",
  "DIMLY",
  "LEVEL",
  "SUMAC",
  "DONUT",
  "STILT",
  "ARENA",
  "SHEET",
  "SCRUB",
  "FANCY",
  "SLIMY",
  "PEARL",
  "SILLY",
  "PORCH",
  "DINGO",
  "SEPIA",
  "AMBLE",
  "SHADY",
  "BREAD",
  "FRIAR",
  "REIGN",
  "DAIRY",
  "QUILL",
  "CROSS",
  "BROOD",
  "TUBER",
  "SHEAR",
  "POSIT",
  "BLANK",
  "VILLA",
  "SHANK",
  "PIGGY",
  "FREAK",
  "WHICH",
  "AMONG",
  "FECAL",
  "SHELL",
  "WOULD",
  "ALGAE",
  "LARGE",
  "RABBI",
  "AGONY",
  "AMUSE",
  "BUSHY",
  "COPSE",
  "SWOON",
  "KNIFE",
  "POUCH",
  "ASCOT",
  "PLANE",
  "CROWN",
  "URBAN",
  "SNIDE",
  "RELAY",
  "ABIDE",
  "VIOLA",
  "RAJAH",
  "STRAW",
  "DILLY",
  "CRASH",
  "AMASS",
  "THIRD",
  "TRICK",
  "TUTOR",
  "WOODY",
  "BLURB",
  "GRIEF",
  "DISCO",
  "WHERE",
  "SASSY",
  "BEACH",
  "SAUNA",
  "COMIC",
  "CLUED",
  "CREEP",
  "CASTE",
  "GRAZE",
  "SNUFF",
  "FROCK",
  "GONAD",
  "DRUNK",
  "PRONG",
  "LURID",
  "STEEL",
  "HALVE",
  "BUYER",
  "VINYL",
  "UTILE",
  "SMELL",
  "ADAGE",
  "WORRY",
  "TASTY",
  "LOCAL",
  "TRADE",
  "FINCH",
  "ASHEN",
  "MODAL",
  "GAUNT",
  "CLOVE",
  "ENACT",
  "ADORN",
  "ROAST",
  "SPECK",
  "SHEIK",
  "MISSY",
  "GRUNT",
  "SNOOP",
  "PARTY",
  "TOUCH",
  "MAFIA",
  "EMCEE",
  "ARRAY",
  "SOUTH",
  "VAPID",
  "JELLY",
  "SKULK",
  "ANGST",
  "TUBAL",
  "LOWER",
  "CREST",
  "SWEAT",
  "CYBER",
  "ADORE",
  "TARDY",
  "SWAMI",
  "NOTCH",
  "GROOM",
  "ROACH",
  "HITCH",
  "YOUNG",
  "ALIGN",
  "READY",
  "FROND",
  "STRAP",
  "PUREE",
  "REALM",
  "VENUE",
  "SWARM",
  "OFFER",
  "SEVEN",
  "DRYER",
  "DIARY",
  "DRYLY",
  "DRANK",
  "ACRID",
  "HEADY",
  "THETA",
  "JUNTO",
  "PIXIE",
  "QUOTH",
  "BONUS",
  "SHALT",
  "PENNE",
  "AMEND",
  "DATUM",
  "BUILD",
  "PIANO",
  "SHELF",
  "LODGE",
  "SUING",
  "REARM",
  "CORAL",
  "RAMEN",
  "WORTH",
  "PSALM",
  "INFER",
  "OVERT",
  "MAYOR",
  "OVOID",
  "GLIDE",
  "USAGE",
  "POISE",
  "RANDY",
  "CHUCK",
  "PRANK",
  "FISHY",
  "TOOTH",
  "ETHER",
  "DROVE",
  "IDLER",
  "SWATH",
  "STINT",
  "WHILE",
  "BEGAT",
  "APPLY",
  "SLANG",
  "TAROT",
  "RADAR",
  "CREDO",
  "AWARE",
  "CANON",
  "SHIFT",
  "TIMER",
  "BYLAW",
  "SERUM",
  "THREE",
  "STEAK",
  "ILIAC",
  "SHIRK",
  "BLUNT",
  "PUPPY",
  "PENAL",
  "JOIST",
  "BUNNY",
  "SHAPE",
  "BEGET",
  "WHEEL",
  "ADEPT",
  "STUNT",
  "STOLE",
  "TOPAZ",
  "CHORE",
  "FLUKE",
  "AFOOT",
  "BLOAT",
  "BULLY",
  "DENSE",
  "CAPER",
  "SNEER",
  "BOXER",
  "JUMBO",
  "LUNGE",
  "SPACE",
  "AVAIL",
  "SHORT",
  "SLURP",
  "LOYAL",
  "FLIRT",
  "PIZZA",
  "CONCH",
  "TEMPO",
  "DROOP",
  "PLATE",
  "BIBLE",
  "PLUNK",
  "AFOUL",
  "SAVOY",
  "STEEP",
  "AGILE",
  "STAKE",
  "DWELL",
  "KNAVE",
  "BEARD",
  "AROSE",
  "MOTIF",
  "SMASH",
  "BROIL",
  "GLARE",
  "SHOVE",
  "BAGGY",
  "MAMMY",
  "SWAMP",
  "ALONG",
  "RUGBY",
  "WAGER",
  "QUACK",
  "SQUAT",
  "SNAKY",
  "DEBIT",
  "MANGE",
  "SKATE",
  "NINTH",
  "JOUST",
  "TRAMP",
  "SPURN",
  "MEDAL",
  "MICRO",
  "REBEL",
  "FLANK",
  "LEARN",
  "NADIR",
  "MAPLE",
  "COMFY",
  "REMIT",
  "GRUFF",
  "ESTER",
  "LEAST",
  "MOGUL",
  "FETCH",
  "CAUSE",
  "OAKEN",
  "AGLOW",
  "MEATY",
  "GAFFE",
  "SHYLY",
  "RACER",
  "PROWL",
  "THIEF",
  "STERN",
  "POESY",
  "ROCKY",
  "TWEET",
  "WAIST",
  "SPIRE",
  "GROPE",
  "HAVOC",
  "PATSY",
  "TRULY",
  "FORTY",
  "DEITY",
  "UNCLE",
  "SWISH",
  "GIVER",
  "PREEN",
  "BEVEL",
  "LEMUR",
  "DRAFT",
  "SLOPE",
  "ANNOY",
  "LINGO",
  "BLEAK",
  "DITTY",
  "CURLY",
  "CEDAR",
  "DIRGE",
  "GROWN",
  "HORDE",
  "DROOL",
  "SHUCK",
  "CRYPT",
  "CUMIN",
  "STOCK",
  "GRAVY",
  "LOCUS",
  "WIDER",
  "BREED",
  "QUITE",
  "CHAFE",
  "CACHE",
  "BLIMP",
  "DEIGN",
  "FIEND",
  "LOGIC",
  "CHEAP",
  "ELIDE",
  "RIGID",
  "FALSE",
  "RENAL",
  "PENCE",
  "ROWDY",
  "SHOOT",
  "BLAZE",
  "ENVOY",
  "POSSE",
  "BRIEF",
  "NEVER",
  "ABORT",
  "MOUSE",
  "MUCKY",
  "SULKY",
  "FIERY",
  "MEDIA",
  "TRUNK",
  "YEAST",
  "CLEAR",
  "SKUNK",
  "SCALP",
  "BITTY",
  "CIDER",
  "KOALA",
  "DUVET",
  "SEGUE",
  "CREME",
  "SUPER",
  "GRILL",
  "AFTER",
  "OWNER",
  "EMBER",
  "REACH",
  "NOBLY",
  "EMPTY",
  "SPEED",
  "GIPSY",
  "RECUR",
  "SMOCK",
  "DREAD",
  "MERGE",
  "BURST",
  "KAPPA",
  "AMITY",
  "SHAKY",
  "HOVER",
  "CAROL",
  "SNORT",
  "SYNOD",
  "FAINT",
  "HAUNT",
  "FLOUR",
  "CHAIR",
  "DETOX",
  "SHREW",
  "TENSE",
  "PLIED",
  "QUARK",
  "BURLY",
  "NOVEL",
  "WAXEN",
  "STOIC",
  "JERKY",
  "BLITZ",
  "BEEFY",
  "LYRIC",
  "HUSSY",
  "TOWEL",
  "QUILT",
  "BELOW",
  "BINGO",
  "WISPY",
  "BRASH",
  "SCONE",
  "TOAST",
  "EASEL",
  "SAUCY",
  "VALUE",
  "SPICE",
  "HONOR",
  "ROUTE",
  "SHARP",
  "BAWDY",
  "RADII",
  "SKULL",
  "PHONY",
  "ISSUE",
  "LAGER",
  "SWELL",
  "URINE",
  "GASSY",
  "TRIAL",
  "FLORA",
  "UPPER",
  "LATCH",
  "WIGHT",
  "BRICK",
  "RETRY",
  "HOLLY",
  "DECAL",
  "GRASS",
  "SHACK",
  "DOGMA",
  "MOVER",
  "DEFER",
  "SOBER",
  "OPTIC",
  "CRIER",
  "VYING",
  "NOMAD",
  "FLUTE",
  "HIPPO",
  "SHARK",
  "DRIER",
  "OBESE",
  "BUGLE",
  "TAWNY",
  "CHALK",
  "FEAST",
  "RUDDY",
  "PEDAL",
  "SCARF",
  "CRUEL",
  "BLEAT",
  "TIDAL",
  "SLUSH",
  "SEMEN",
  "WINDY",
  "DUSTY",
  "SALLY",
  "IGLOO",
  "NERDY",
  "JEWEL",
  "SHONE",
  "WHALE",
  "HYMEN",
  "ABUSE",
  "FUGUE",
  "ELBOW",
  "CRUMB",
  "PANSY",
  "WELSH",
  "SYRUP",
  "TERSE",
  "SUAVE",
  "GAMUT",
  "SWUNG",
  "DRAKE",
  "FREED",
  "AFIRE",
  "SHIRT",
  "GROUT",
  "ODDLY",
  "TITHE",
  "PLAID",
  "DUMMY",
  "BROOM",
  "BLIND",
  "TORCH",
  "ENEMY",
  "AGAIN",
  "TYING",
  "PESKY",
  "ALTER",
  "GAZER",
  "NOBLE",
  "ETHOS",
  "BRIDE",
  "EXTOL",
  "DECOR",
  "HOBBY",
  "BEAST",
  "IDIOM",
  "UTTER",
  "THESE",
  "SIXTH",
  "ALARM",
  "ERASE",
  "ELEGY",
  "SPUNK",
  "PIPER",
  "SCALY",
  "SCOLD",
  "HEFTY",
  "CHICK",
  "SOOTY",
  "CANAL",
  "WHINY",
  "SLASH",
  "QUAKE",
  "JOINT",
  "SWEPT",
  "PRUDE",
  "HEAVY",
  "WIELD",
  "FEMME",
  "LASSO",
  "MAIZE",
  "SHALE",
  "SCREW",
  "SPREE",
  "SMOKY",
  "WHIFF",
  "SCENT",
  "GLADE",
  "SPENT",
  "PRISM",
  "STOKE",
  "RIPER",
  "ORBIT",
  "COCOA",
  "GUILT",
  "HUMUS",
  "SHUSH",
  "TABLE",
  "SMIRK",
  "WRONG",
  "NOISY",
  "ALERT",
  "SHINY",
  "ELATE",
  "RESIN",
  "WHOLE",
  "HUNCH",
  "PIXEL",
  "POLAR",
  "HOTEL",
  "SWORD",
  "CLEAT",
  "MANGO",
  "RUMBA",
  "PUFFY",
  "FILLY",
  "BILLY",
  "LEASH",
  "CLOUT",
  "DANCE",
  "OVATE",
  "FACET",
  "CHILI",
  "PAINT",
  "LINER",
  "CURIO",
  "SALTY",
  "AUDIO",
  "SNAKE",
  "FABLE",
  "CLOAK",
  "NAVEL",
  "SPURT",
  "PESTO",
  "BALMY",
  "FLASH",
  "UNWED",
  "EARLY",
  "CHURN",
  "WEEDY",
  "STUMP",
  "LEASE",
  "WITTY",
  "WIMPY",
  "SPOOF",
  "SANER",
  "BLEND",
  "SALSA",
  "THICK",
  "WARTY",
  "MANIC",
  "BLARE",
  "SQUIB",
  "SPOON",
  "PROBE",
  "CREPE",
  "KNACK",
  "FORCE",
  "DEBUT",
  "ORDER",
  "HASTE",
  "TEETH",
  "AGENT",
  "WIDEN",
  "ICILY",
  "SLICE",
  "INGOT",
  "CLASH",
  "JUROR",
  "BLOOD",
  "ABODE",
  "THROW",
  "UNITY",
  "PIVOT",
  "SLEPT",
  "TROOP",
  "SPARE",
  "SEWER",
  "PARSE",
  "MORPH",
  "CACTI",
  "TACKY",
  "SPOOL",
  "DEMON",
  "MOODY",
  "ANNEX",
  "BEGIN",
  "FUZZY",
  "PATCH",
  "WATER",
  "LUMPY",
  "ADMIN",
  "OMEGA",
  "LIMIT",
  "TABBY",
  "MACHO",
  "AISLE",
  "SKIFF",
  "BASIS",
  "PLANK",
  "VERGE",
  "BOTCH",
  "CRAWL",
  "LOUSY",
  "SLAIN",
  "CUBIC",
  "RAISE",
  "WRACK",
  "GUIDE",
  "FOIST",
  "CAMEO",
  "UNDER",
  "ACTOR",
  "REVUE",
  "FRAUD",
  "HARPY",
  "SCOOP",
  "CLIMB",
  "REFER",
  "OLDEN",
  "CLERK",
  "DEBAR",
  "TALLY",
  "ETHIC",
  "CAIRN",
  "TULLE",
  "GHOUL",
  "HILLY",
  "CRUDE",
  "APART",
  "SCALE",
  "OLDER",
  "PLAIN",
  "SPERM",
  "BRINY",
  "ABBOT",
  "RERUN",
  "QUEST",
  "CRISP",
  "BOUND",
  "BEFIT",
  "DRAWN",
  "SUITE",
  "ITCHY",
  "CHEER",
  "BAGEL",
  "GUESS",
  "BROAD",
  "AXIOM",
  "CHARD",
  "CAPUT",
  "LEANT",
  "HARSH",
  "CURSE",
  "PROUD",
  "SWING",
  "OPINE",
  "TASTE",
  "LUPUS",
  "GUMBO",
  "MINER",
  "GREEN",
  "CHASM",
  "LIPID",
  "TOPIC",
  "ARMOR",
  "BRUSH",
  "CRANE",
  "MURAL",
  "ABLED",
  "HABIT",
  "BOSSY",
  "MAKER",
  "DUSKY",
  "DIZZY",
  "LITHE",
  "BROOK",
  "JAZZY",
  "FIFTY",
  "SENSE",
  "GIANT",
  "SURLY",
  "LEGAL",
  "FATAL",
  "FLUNK",
  "BEGAN",
  "PRUNE",
  "SMALL",
  "SLANT",
  "SCOFF",
  "TORUS",
  "NINNY",
  "COVEY",
  "VIPER",
  "TAKEN",
  "MORAL",
  "VOGUE",
  "OWING",
  "TOKEN",
  "ENTRY",
  "BOOTH",
  "VOTER",
  "CHIDE",
  "ELFIN",
  "EBONY",
  "NEIGH",
  "MINIM",
  "MELON",
  "KNEED",
  "DECOY",
  "VOILA",
  "ANKLE",
  "ARROW",
  "MUSHY",
  "TRIBE",
  "CEASE",
  "EAGER",
  "BIRTH",
  "GRAPH",
  "ODDER",
  "TERRA",
  "WEIRD",
  "TRIED",
  "CLACK",
  "COLOR",
  "ROUGH",
  "WEIGH",
  "UNCUT",
  "LADLE",
  "STRIP",
  "CRAFT",
  "MINUS",
  "DICEY",
  "TITAN",
  "LUCID",
  "VICAR",
  "DRESS",
  "DITCH",
  "GYPSY",
  "PASTA",
  "TAFFY",
  "FLAME",
  "SWOOP",
  "ALOOF",
  "SIGHT",
  "BROKE",
  "TEARY",
  "CHART",
  "SIXTY",
  "WORDY",
  "SHEER",
  "LEPER",
  "NOSEY",
  "BULGE",
  "SAVOR",
  "CLAMP",
  "FUNKY",
  "FOAMY",
  "TOXIC",
  "BRAND",
  "PLUMB",
  "DINGY",
  "BUTTE",
  "DRILL",
  "TRIPE",
  "BICEP",
  "TENOR",
  "KRILL",
  "WORSE",
  "DRAMA",
  "HYENA",
  "THINK",
  "RATIO",
  "COBRA",
  "BASIL",
  "SCRUM",
  "BUSED",
  "PHONE",
  "COURT",
  "CAMEL",
  "PROOF",
  "HEARD",
  "ANGEL",
  "PETAL",
  "POUTY",
  "THROB",
  "MAYBE",
  "FETAL",
  "SPRIG",
  "SPINE",
  "SHOUT",
  "CADET",
  "MACRO",
  "DODGY",
  "SATYR",
  "RARER",
  "BINGE",
  "TREND",
  "NUTTY",
  "LEAPT",
  "AMISS",
  "SPLIT",
  "MYRRH",
  "WIDTH",
  "SONAR",
  "TOWER",
  "BARON",
  "FEVER",
  "WAVER",
  "SPARK",
  "BELIE",
  "SLOOP",
  "EXPEL",
  "SMOTE",
  "BALER",
  "ABOVE",
  "NORTH",
  "WAFER",
  "SCANT",
  "FRILL",
  "AWASH",
  "SNACK",
  "SCOWL",
  "FRAIL",
  "DRIFT",
  "LIMBO",
  "FENCE",
  "MOTEL",
  "OUNCE",
  "WREAK",
  "REVEL",
  "TALON",
  "PRIOR",
  "KNELT",
  "CELLO",
  "FLAKE",
  "DEBUG",
  "ANODE",
  "CRIME",
  "SALVE",
  "SCOUT",
  "IMBUE",
  "PINKY",
  "STAVE",
  "VAGUE",
  "CHOCK",
  "FIGHT",
  "VIDEO",
  "STONE",
  "TEACH",
  "CLEFT",
  "FROST",
  "PRAWN",
  "BOOTY",
  "TWIST",
  "APNEA",
  "STIFF",
  "PLAZA",
  "LEDGE",
  "TWEAK",
  "BOARD",
  "GRANT",
  "MEDIC",
  "BACON",
  "CABLE",
  "BRAWL",
  "SLUNK",
  "RASPY",
  "FORUM",
  "DRONE",
  "WOMEN",
  "MUCUS",
  "BOAST",
  "TODDY",
  "COVEN",
  "TUMOR",
  "TRUER",
  "WRATH",
  "STALL",
  "STEAM",
  "AXIAL",
  "PURER",
  "DAILY",
  "TRAIL",
  "NICHE",
  "MEALY",
  "JUICE",
  "NYLON",
  "PLUMP",
  "MERRY",
  "FLAIL",
  "PAPAL",
  "WHEAT",
  "BERRY",
  "COWER",
  "ERECT",
  "BRUTE",
  "LEGGY",
  "SNIPE",
  "SINEW",
  "SKIER",
  "PENNY",
  "JUMPY",
  "RALLY",
  "UMBRA",
  "SCARY",
  "MODEM",
  "GROSS",
  "AVIAN",
  "GREED",
  "SATIN",
  "TONIC",
  "PARKA",
  "SNIFF",
  "LIVID",
  "STARK",
  "TRUMP",
  "GIDDY",
  "REUSE",
  "TABOO",
  "AVOID",
  "QUOTE",
  "DEVIL",
  "LIKEN",
  "GLOSS",
  "GAYER",
  "BERET",
  "NOISE",
  "GLAND",
  "DEALT",
  "SLING",
  "RUMOR",
  "OPERA",
  "THIGH",
  "TONGA",
  "FLARE",
  "WOUND",
  "WHITE",
  "BULKY",
  "ETUDE",
  "HORSE",
  "CIRCA",
  "PADDY",
  "INBOX",
  "FIZZY",
  "GRAIN",
  "EXERT",
  "SURGE",
  "GLEAM",
  "BELLE",
  "SALVO",
  "CRUSH",
  "FRUIT",
  "SAPPY",
  "TAKER",
  "TRACT",
  "OVINE",
  "SPIKY",
  "FRANK",
  "REEDY",
  "FILTH",
  "SPASM",
  "HEAVE",
  "MAMBO",
  "RIGHT",
  "CLANK",
  "TRUST",
  "LUMEN",
  "BORNE",
  "SPOOK",
  "SAUCE",
  "AMBER",
  "LATHE",
  "CARAT",
  "CORER",
  "DIRTY",
  "SLYLY",
  "AFFIX",
  "ALLOY",
  "TAINT",
  "SHEEP",
  "KINKY",
  "WOOLY",
  "MAUVE",
  "FLUNG",
  "YACHT",
  "FRIED",
  "QUAIL",
  "BRUNT",
  "GRIMY",
  "CURVY",
  "CAGEY",
  "RINSE",
  "DEUCE",
  "STATE",
  "GRASP",
  "MILKY",
  "BISON",
  "GRAFT",
  "SANDY",
  "BASTE",
  "FLASK",
  "HEDGE",
  "GIRLY",
  "SWASH",
  "BONEY",
  "COUPE",
  "ENDOW",
  "ABHOR",
  "WELCH",
  "BLADE",
  "TIGHT",
  "GEESE",
  "MISER",
  "MIRTH",
  "CLOUD",
  "CABAL",
  "LEECH",
  "CLOSE",
  "TENTH",
  "PECAN",
  "DROIT",
  "GRAIL",
  "CLONE",
  "GUISE",
  "RALPH",
  "TANGO",
  "BIDDY",
  "SMITH",
  "MOWER",
  "PAYEE",
  "SERIF",
  "DRAPE",
  "FIFTH",
  "SPANK",
  "GLAZE",
  "ALLOT",
  "TRUCK",
  "KAYAK",
  "VIRUS",
  "TESTY",
  "TEPEE",
  "FULLY",
  "ZONAL",
  "METRO",
  "CURRY",
  "GRAND",
  "BANJO",
  "AXION",
  "BEZEL",
  "OCCUR",
  "CHAIN",
  "NASAL",
  "GOOEY",
  "FILER",
  "BRACE",
  "ALLAY",
  "PUBIC",
  "RAVEN",
  "PLEAD",
  "GNASH",
  "FLAKY",
  "MUNCH",
  "DULLY",
  "EKING",
  "THING",
  "SLINK",
  "HURRY",
  "THEFT",
  "SHORN",
  "PYGMY",
  "RANCH",
  "WRING",
  "LEMON",
  "SHORE",
  "MAMMA",
  "FROZE",
  "NEWER",
  "STYLE",
  "MOOSE",
  "ANTIC",
  "DROWN",
  "VEGAN",
  "CHESS",
  "GUPPY",
  "UNION",
  "LEVER",
  "LORRY",
  "IMAGE",
  "CABBY",
  "DRUID",
  "EXACT",
  "TRUTH",
  "DOPEY",
  "SPEAR",
  "CRIED",
  "CHIME",
  "CRONY",
  "STUNK",
  "TIMID",
  "BATCH",
  "GAUGE",
  "ROTOR",
  "CRACK",
  "CURVE",
  "LATTE",
  "WITCH",
  "BUNCH",
  "REPEL",
  "ANVIL",
  "SOAPY",
  "METER",
  "BROTH",
  "MADLY",
  "DRIED",
  "SCENE",
  "KNOWN",
  "MAGMA",
  "ROOST",
  "WOMAN",
  "THONG",
  "PUNCH",
  "PASTY",
  "DOWNY",
  "KNEAD",
  "WHIRL",
  "RAPID",
  "CLANG",
  "ANGER",
  "DRIVE",
  "GOOFY",
  "EMAIL",
  "MUSIC",
  "STUFF",
  "BLEEP",
  "RIDER",
  "MECCA",
  "FOLIO",
  "SETUP",
  "VERSO",
  "QUASH",
  "FAUNA",
  "GUMMY",
  "HAPPY",
  "NEWLY",
  "FUSSY",
  "RELIC",
  "GUAVA",
  "RATTY",
  "FUDGE",
  "FEMUR",
  "CHIRP",
  "FORTE",
  "ALIBI",
  "WHINE",
  "PETTY",
  "GOLLY",
  "PLAIT",
  "FLECK",
  "FELON",
  "GOURD",
  "BROWN",
  "THRUM",
  "FICUS",
  "STASH",
  "DECRY",
  "WISER",
  "JUNTA",
  "VISOR",
  "DAUNT",
  "SCREE",
  "IMPEL",
  "AWAIT",
  "PRESS",
  "WHOSE",
  "TURBO",
  "STOOP",
  "SPEAK",
  "MANGY",
  "EYING",
  "INLET",
  "CRONE",
  "PULSE",
  "MOSSY",
  "STAID",
  "HENCE",
  "PINCH",
  "TEDDY",
  "SULLY",
  "SNORE",
  "RIPEN",
  "SNOWY",
  "ATTIC",
  "GOING",
  "LEACH",
  "MOUTH",
  "HOUND",
  "CLUMP",
  "TONAL",
  "BIGOT",
  "PERIL",
  "PIECE",
  "BLAME",
  "HAUTE",
  "SPIED",
  "UNDID",
  "INTRO",
  "BASAL",
  "SHINE",
  "GECKO",
  "RODEO",
  "GUARD",
  "STEER",
  "LOAMY",
  "SCAMP",
  "SCRAM",
  "MANLY",
  "HELLO",
  "VAUNT",
  "ORGAN",
  "FERAL",
  "KNOCK",
  "EXTRA",
  "CONDO",
  "ADAPT",
  "WILLY",
  "POLKA",
  "RAYON",
  "SKIRT",
  "FAITH",
  "TORSO",
  "MATCH",
  "MERCY",
  "TEPID",
  "SLEEK",
  "RISER",
  "TWIXT",
  "PEACE",
  "FLUSH",
  "CATTY",
  "LOGIN",
  "EJECT",
  "ROGER",
  "RIVAL",
  "UNTIE",
  "REFIT",
  "AORTA",
  "ADULT",
  "JUDGE",
  "ROWER",
  "ARTSY",
  "RURAL",
  "SHAVE",
];

const app = new App();
