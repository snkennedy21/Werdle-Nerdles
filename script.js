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
const guessDistributionBars = document.querySelectorAll(
  ".statistics-modal__guess-distribution__bar"
);
const guessDistributionBarNumbers = document.querySelectorAll(
  ".statistics-modal__guess-distribution__bar__number"
);
const statisticsModalShareButton = document.querySelector(
  ".statistics-modal__share-button"
);
const darkThemeCheckbox = document.querySelector(".dark-theme-checkbox");
const highContrastModeCheckbox = document.querySelector(
  ".high-contrast-mode-checkbox"
);
const hardModeCheckbox = document.querySelector(".hard-mode-checkbox");
const messageContainer = document.querySelector(".message-container");
const hardModeSwitch = document.querySelector(".hard-mode-switch");

let secondaryColor = "#131313";
let lightGrey = "#d2d4d9";
let darkGrey = "#929397";
let correctPlaceColor = "#68a868";
let wrongPlaceColor = "#d0b363";
let wrongLetterColor = "#808080";

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
  #theGameIsNotActive;
  #scoreForCurrentRound;
  #guessArray = [];
  #answerArray = [];
  #rowIndex = 0;
  #tileIndex = 0;
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
  #thereIsDataForPlayerStatistics;
  #thereISDataForPlayerScoreStatistics;
  #upcomingMidnight;
  #now;
  #timeUntilMidnight;
  #numberOfGamesWithScoreOf1;
  #numberOfGamesWithScoreOf2;
  #numberOfGamesWithScoreOf3;
  #numberOfGamesWithScoreOf4;
  #numberOfGamesWithScoreOf5;
  #numberOfGamesWithScoreOf6;
  #playerScoresDataArray;
  #werdleNumber;
  #darkThemeIsEnabled;
  #highContrastModeIsEnabled;
  #hardModeIsEnabled;
  #hardModeLetterArray = [];
  #guessContainsLettersFromHardModeArray;
  #answerArrayCopy;
  #keyBoardIsDisabled;

  constructor() {
    this._setDateAndTime();
    this._countdown();
    this._getLettersForHardModeFromLocalStorage();
    this._getTheDataForTheGameStateFromLocalStorage();
    this._getTheAnswerFromLocalStorage();
    this._checkIfThereIsCurrentlyAnAnswerInTheAnswerArray();
    if (this.#thereIsNoAnAnswerInTheAnswerArray)
      this._pushTheLettersOfARandomWordFromTheWordListIntoTheAnswerArray();
    this._storeTheAnswerInLocalStorage();
    this._getTheBoardDataFromLocalStorage();
    this._createNewTileObjectsAndPushThemIntoTheBoardDataArray();
    this._removeOldTileObjectsFromTheBoardDataArray();
    this._setTheContentForTheBoardTiles();
    this._flipTheTilesThatHaveContent();
    this._getTheKeyboardDataFromLocalStorage();
    this._createNewKeyboardButtonObjectsAndPushThemIntoTheKeyboardButtonDataArray();
    this._removeOldKeyboardButtonObjectsFromTheEndOfTheKeyboardButtonDataArray();

    this._getDataForPlayerStatisticsFromLocalStorage();
    if (!this.#thereIsDataForPlayerStatistics)
      this._setDataForPlayerStatisticsToZero();
    if (this.#thereIsDataForPlayerStatistics)
      this._updateDataForPlayerStatistics();

    this._getDataForPlayerScoreStatisticsFromLocalStorage();
    if (!this.#thereISDataForPlayerScoreStatistics)
      this._setDataForPlayerScoreStatisticsToZero();
    if (this.#thereISDataForPlayerScoreStatistics)
      this._updateDataForPlayerScoreStatistics();

    this._setTheColorsForTheKeyboardButtons();
    this._displayPlayerStatistics();
    this._displayPlayerScoreStatistics();
    this._buildArrayOfAllKeyboardValues();
    this._updatePlayerScoreStatisticsChart();

    this._getDataForScoreFromLocalStorage();

    this._getHardModeInformationFromLocalStorage();
    if (this.#hardModeIsEnabled) {
      hardModeCheckbox.checked = true;
    }
    if (this.#hardModeIsEnabled && this.#rowIndex > 0)
      this._disableHardModeSlider();
    if (!this.#hardModeIsEnabled) hardModeCheckbox.checked = false;

    this._getTheInformationForDarkThemeFromLocalStorage();
    if (this.#darkThemeIsEnabled) darkThemeCheckbox.checked = true;
    if (!this.#darkThemeIsEnabled) darkThemeCheckbox.checked = false;
    this._toggleDarkTheme();
    this._getTheInformationForHighContrastModeFromLocalStorage();
    if (this.#highContrastModeIsEnabled)
      highContrastModeCheckbox.checked = true;
    if (!this.#highContrastModeIsEnabled)
      highContrastModeCheckbox.checked = false;
    this._toggleHighContrastMode();

    if (this.#theGameIsNotActive)
      setTimeout(() => {
        this._toggleStatisticsModal();
      }, 1000);

    this._checkIfHardModeCanBeActivated();
    this._updateColorsForGuessDistributionBars();
    console.log(this.#answerArray);

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
    statisticsModalShareButton.addEventListener(
      "click",
      this._buildBlocks.bind(this)
    );
    darkThemeCheckbox.addEventListener(
      "change",
      this._toggleDarkTheme.bind(this)
    );
    highContrastModeCheckbox.addEventListener(
      "change",
      this._toggleHighContrastMode.bind(this)
    );
    hardModeCheckbox.addEventListener(
      "change",
      this._toggleHardMode.bind(this)
    );
    hardModeSwitch.addEventListener(
      "click",
      this._displayHardModeMessage.bind(this)
    );
  }

  /* ***********
  Trial Features
  *********** */

  _disableKeyBoard() {
    this.#keyBoardIsDisabled = true;
    setTimeout(() => {
      this.#keyBoardIsDisabled = false;
    }, 2200);
  }

  _checkIfHardModeCanBeActivated() {
    if (this.#rowIndex > 0) hardModeCheckbox.disabled = true;
  }

  _displayHardModeMessage() {
    if (this.#rowIndex > 0 && !this.#hardModeIsEnabled) {
      this._displayMessage("hard mode can only be toggled at start");
    }
  }

  _toggleHardMode() {
    if (this.#rowIndex > 0 && this.#hardModeIsEnabled) {
      this._disableHardModeSlider();
      return;
    }
    if (hardModeCheckbox.checked) {
      this.#hardModeIsEnabled = true;
    }
    if (!hardModeCheckbox.checked) {
      this.#hardModeIsEnabled = false;
    }
    this._storeHardModeInformationInLocalStorage();
  }

  _getHardModeInformationFromLocalStorage() {
    let hardModeInfo = JSON.parse(localStorage.getItem("hardModeInfo"));
    if (!hardModeInfo) {
      this.#hardModeIsEnabled = false;
      return;
    }
    this.#hardModeIsEnabled = hardModeInfo;
  }

  _storeHardModeInformationInLocalStorage() {
    localStorage.setItem(
      "hardModeInfo",
      JSON.stringify(this.#hardModeIsEnabled)
    );
  }

  _checkIfGuessContainsLettersFromHardModeArray() {
    if (
      this.#hardModeLetterArray.every((letter) =>
        this.#guessArray.includes(letter)
      )
    )
      this.#guessContainsLettersFromHardModeArray = true;
    if (
      !this.#hardModeLetterArray.every((letter) =>
        this.#guessArray.includes(letter)
      )
    )
      this.#guessContainsLettersFromHardModeArray = false;
  }

  _addLettersFromGuessToHardModeLetterArray() {
    let letters = this.#answerArray.filter((el) =>
      this.#guessArray.includes(el)
    );
    letters.forEach((letter) => {
      this.#hardModeLetterArray.push(letter);
    });
    this.#hardModeLetterArray = [...new Set(this.#hardModeLetterArray)];
  }

  _storeLettersForHardModeInLocalStorage() {
    localStorage.setItem(
      "hardModeLetters",
      JSON.stringify(this.#hardModeLetterArray)
    );
  }

  _getLettersForHardModeFromLocalStorage() {
    let hardModeLetters = JSON.parse(localStorage.getItem("hardModeLetters"));
    if (!hardModeLetters) return;
    this.#hardModeLetterArray = hardModeLetters;
  }

  _disableHardModeSlider() {
    hardModeCheckbox.disabled = true;
    this.#hardModeIsEnabled = false;
  }

  _storeTheDarkThemeInformationInLocalStorage() {
    localStorage.setItem("darkTheme", JSON.stringify(this.#darkThemeIsEnabled));
  }

  _getTheInformationForDarkThemeFromLocalStorage() {
    let darkThemeInfo = JSON.parse(localStorage.getItem("darkTheme"));
    if (!darkThemeInfo) {
      this.#darkThemeIsEnabled = false;
      return;
    }
    this.#darkThemeIsEnabled = darkThemeInfo;
  }

  _toggleDarkTheme() {
    if (darkThemeCheckbox.checked) {
      this.#darkThemeIsEnabled = true;
      document.documentElement.style.setProperty("--primary", "#131313");
      document.documentElement.style.setProperty("--secondary", "#ffffff");
      document.documentElement.style.setProperty(
        "--primary-transparent",
        "#00000080"
      );
      document.documentElement.style.setProperty(
        "--secondary-shadow",
        "#ffffff1f"
      );
      document.documentElement.style.setProperty(
        "--grey-light",
        "rgb(63, 63, 63)"
      );
      document.documentElement.style.setProperty(
        "--grey-dark",
        "rgb(103, 104, 107)"
      );
      secondaryColor = "#ffffff";
      lightGrey = "rgb(63, 63, 63)";
      darkGrey = "rgb(103, 104, 107)";
      wrongLetterColor = "rgb(60, 60, 60)";
      keyboardButtons.forEach((button) => {
        button.style.color = "#ffffff";
        if (button.style.backgroundColor === "rgb(208, 179, 99)")
          button.style.backgroundColor = "rgb(208, 179, 99)";
        if (button.style.backgroundColor === "rgb(104, 168, 104)")
          button.style.backgroundColor = "rgb(104, 168, 104)";
        if (button.style.backgroundColor === "rgb(128, 128, 128)")
          button.style.backgroundColor = "rgb(60, 60, 60)";
        if (button.style.backgroundColor === "") {
          button.style.backgroundColor = "rgb(103, 104, 107)";
        }
        if (button.style.backgroundColor === "rgb(210, 212, 217)") {
          button.style.backgroundColor = "rgb(103, 104, 107)";
        }
      });
      frontOfBoardTiles.forEach((tile) => {
        tile.style.borderColor = lightGrey;
      });
      backOfBoardTiles.forEach((tile) => {
        if (tile.style.backgroundColor === "rgb(208, 179, 99)")
          tile.style.backgroundColor = "rgb(208, 179, 99)";
        if (tile.style.backgroundColor === "rgb(104, 168, 104)")
          tile.style.backgroundColor = "rgb(104, 168, 104)";
        if (tile.style.backgroundColor === "rgb(128, 128, 128)")
          tile.style.backgroundColor = "rgb(60, 60, 60)";
      });
    }

    if (!darkThemeCheckbox.checked) {
      this.#darkThemeIsEnabled = false;
      document.documentElement.style.setProperty("--primary", "#ffffff");
      document.documentElement.style.setProperty("--secondary", "#131313");
      document.documentElement.style.setProperty(
        "--primary-transparent",
        "#ffffff80"
      );
      document.documentElement.style.setProperty(
        "--secondary-shadow",
        "#0000001f"
      );
      document.documentElement.style.setProperty(
        "--grey-light",
        "rgb(210, 212, 217)"
      );
      document.documentElement.style.setProperty(
        "--grey-dark",
        "rgb(146, 147, 151)"
      );
      secondaryColor = "#131313";
      lightGrey = "rgb(210, 212, 217)";
      darkGrey = "rgb(146, 147, 151)";
      wrongLetterColor = "rgb(128, 128, 128)";
      keyboardButtons.forEach((button) => {
        button.style.color = "#000000";
        if (button.style.backgroundColor === "rgb(128, 128, 128)")
          button.style.color = "#ffffff";
        if (button.style.backgroundColor === "rgb(208, 179, 99)") {
          button.style.backgroundColor = "rgb(208, 179, 99)";
          button.style.color = "#ffffff";
        }
        if (
          button.style.backgroundColor === "rgb(245, 121, 58)" ||
          button.style.backgroundColor === "rgb(133, 192, 249)"
        )
          button.style.color = "#ffffff";
        if (button.style.backgroundColor === "rgb(104, 168, 104)") {
          button.style.backgroundColor = "rgb(104, 168, 104)";
          button.style.color = "#ffffff";
        }
        if (button.style.backgroundColor === "rgb(60, 60, 60)") {
          button.style.backgroundColor = "rgb(128, 128, 128)";
          button.style.color = "#ffffff";
        }
        if (button.style.backgroundColor === "rgb(103, 104, 107)")
          button.style.backgroundColor = "rgb(210, 212, 217)";
      });
      frontOfBoardTiles.forEach((tile) => {
        tile.style.borderColor = lightGrey;
      });
      backOfBoardTiles.forEach((tile) => {
        if (tile.style.backgroundColor === "rgb(208, 179, 99)")
          tile.style.backgroundColor = "rgb(208, 179, 99)";
        if (tile.style.backgroundColor === "rgb(104, 168, 104)")
          tile.style.backgroundColor = "rgb(104, 168, 104)";
        if (tile.style.backgroundColor === "rgb(60, 60, 60)")
          tile.style.backgroundColor = "rgb(128, 128, 128)";
      });
    }

    this._createNewKeyboardButtonObjectsAndPushThemIntoTheKeyboardButtonDataArray();
    this._removeOldKeyboardButtonObjectsFromTheBeginningOfTheKeyboardButtonDataArray();
    this._storeTheKeyboardDataInLocalStorage();
    this.#playerBoardDataArray = [];
    this._createNewTileObjectsAndPushThemIntoTheBoardDataArray();
    this._storeTheBoardDataInLocalStorage();
    this._storeTheDarkThemeInformationInLocalStorage();
  }

  _toggleHighContrastMode() {
    if (highContrastModeCheckbox.checked) {
      this.#highContrastModeIsEnabled = true;
      document.documentElement.style.setProperty(
        "--correct",
        "rgb(245, 121, 58)"
      );
      document.documentElement.style.setProperty(
        "--correct-tint",
        "rgb(246, 134, 78)"
      );
      document.documentElement.style.setProperty(
        "--wrong",
        "rgb(133, 192, 249)"
      );
      correctPlaceColor = "rgb(245, 121, 58)";
      wrongPlaceColor = "rgb(133, 192, 249)";
      backOfBoardTiles.forEach((tile) => {
        if (tile.style.backgroundColor === "rgb(104, 168, 104)")
          tile.style.backgroundColor = "rgb(245, 121, 58)";
        if (tile.style.backgroundColor === "rgb(208, 179, 99)")
          tile.style.backgroundColor = "rgb(133, 192, 249)";
      });
      keyboardButtons.forEach((button) => {
        if (button.style.backgroundColor === "rgb(104, 168, 104)")
          button.style.backgroundColor = "rgb(245, 121, 58)";
        if (button.style.backgroundColor === "rgb(208, 179, 99)")
          button.style.backgroundColor = "rgb(133, 192, 249)";
      });
    }
    if (!highContrastModeCheckbox.checked) {
      this.#highContrastModeIsEnabled = false;
      document.documentElement.style.setProperty(
        "--correct",
        "rgb(104, 168, 104)"
      );
      document.documentElement.style.setProperty(
        "--correct-tint",
        "rgb(111, 178, 111)"
      );
      document.documentElement.style.setProperty(
        "--wrong",
        "rgb(208, 179, 99)"
      );
      correctPlaceColor = "rgb(104, 168, 104)";
      wrongPlaceColor = "rgb(208, 179, 99)";
      backOfBoardTiles.forEach((tile) => {
        if (tile.style.backgroundColor === "rgb(245, 121, 58)")
          tile.style.backgroundColor = "rgb(104, 168, 104)";
        if (tile.style.backgroundColor === "rgb(133, 192, 249)")
          tile.style.backgroundColor = "rgb(208, 179, 99)";
      });
      keyboardButtons.forEach((button) => {
        if (button.style.backgroundColor === "rgb(245, 121, 58)")
          button.style.backgroundColor = "rgb(104, 168, 104)";
        if (button.style.backgroundColor === "rgb(133, 192, 249)")
          button.style.backgroundColor = "rgb(208, 179, 99)";
      });
    }
    this._updateColorsForGuessDistributionBars();
    this._createNewKeyboardButtonObjectsAndPushThemIntoTheKeyboardButtonDataArray();
    this._removeOldKeyboardButtonObjectsFromTheBeginningOfTheKeyboardButtonDataArray();
    this._storeTheKeyboardDataInLocalStorage();
    this.#playerBoardDataArray = [];
    this._createNewTileObjectsAndPushThemIntoTheBoardDataArray();
    this._storeTheBoardDataInLocalStorage();
    this._storeTheHighContrastModeInformationInLocalStorage();
  }

  _storeTheHighContrastModeInformationInLocalStorage() {
    localStorage.setItem(
      "highContrastModeInfo",
      JSON.stringify(this.#highContrastModeIsEnabled)
    );
  }

  _getTheInformationForHighContrastModeFromLocalStorage() {
    let highContrastModeInfo = JSON.parse(
      localStorage.getItem("highContrastModeInfo")
    );
    if (!highContrastModeInfo) {
      this.#highContrastModeIsEnabled = false;
      return;
    }
    this.#highContrastModeIsEnabled = highContrastModeInfo;
  }

  _animateTile() {
    this.#frontOfAllTilesInCurrentRowOfPlay.forEach((el, i) => {
      if (i + 1 === this.#tileIndex) {
        el.style.animation = "pulse 0.1s linear";
        el.style.borderColor = darkGrey;
      }
    });
  }

  _removeTileBorderColor() {
    this.#frontOfAllTilesInCurrentRowOfPlay.forEach((el, i) => {
      if (i === this.#tileIndex) {
        el.style.borderColor = lightGrey;
      }
      el.style.animation = "";
    });
  }

  _buildBlocks() {
    this._displayMessage("Copied Results To Clipboard");
    let text;
    if (!this.#hardModeIsEnabled)
      text = `Nerdle Werdle ${this.#werdleNumber} ${
        this.#scoreForCurrentRound
      }/6🟥🟥`;
    if (this.#hardModeIsEnabled)
      text = `Nerdle Werdle ${this.#werdleNumber} ${
        this.#scoreForCurrentRound
      }/6*🟥🟥`;
    let greenSquare = "🟩";
    let orangSquare = "🟧";
    let yellowSquare = "🟨";
    let blueSquare = "🟦";
    let greySquare = "⬜";
    let blackSquare = "⬛";
    let condition = (this.#rowIndex + 1) * 5 - 1;

    for (let i = 0; i <= condition; i++) {
      if (backOfBoardTiles[i].style.backgroundColor === "rgb(128, 128, 128)")
        text = text + greySquare;
      if (backOfBoardTiles[i].style.backgroundColor === "rgb(60, 60, 60)")
        text = text + blackSquare;
      if (backOfBoardTiles[i].style.backgroundColor === "rgb(104, 168, 104)")
        text = text + greenSquare;
      if (backOfBoardTiles[i].style.backgroundColor === "rgb(245, 121, 58)")
        text = text + orangSquare;
      if (backOfBoardTiles[i].style.backgroundColor === "rgb(208, 179, 99)")
        text = text + yellowSquare;
      if (backOfBoardTiles[i].style.backgroundColor === "rgb(133, 192, 249)")
        text = text + blueSquare;

      if (i === 4 || i === 9 || i === 14 || i === 19 || i == 24) text += "🟥";
    }
    let copyhelper = document.createElement("textarea");
    copyhelper.className = "copyhelper";
    document.body.appendChild(copyhelper);
    copyhelper.value = text;
    copyhelper.value = copyhelper.value
      .replace("🟥", "\n")
      .replace("🟥", "\n")
      .replace("🟥", "\n")
      .replace("🟥", "\n")
      .replace("🟥", "\n")
      .replace("🟥", "\n")
      .replace("🟥", "\n");
    copyhelper.select();
    document.execCommand("copy");
    document.body.removeChild(copyhelper);
  }

  _copyBlocks() {}

  _updatePlayerScoreStatisticsChart() {
    let number1 = 0;
    let number2 = 0;
    let number3 = 0;
    let number4 = 0;
    let number5 = 0;
    let number6 = 0;
    let numberArray = [number1, number2, number3, number4, number5, number6];

    guessDistributionBarNumbers.forEach((el, i) => {
      let number = Number(el.textContent);
      this.#playerScoresDataArray.forEach((score) => {
        if (number > score) numberArray[i]++;
      });
    });
    numberArray.forEach((number, i) => {
      if (number === 5) guessDistributionBars[i].style.width = "90%";
      if (number === 4) guessDistributionBars[i].style.width = "70%";
      if (number === 3) guessDistributionBars[i].style.width = "50%";
      if (number === 2) guessDistributionBars[i].style.width = "30%";
      if (number === 1) guessDistributionBars[i].style.width = "10%";
      if (number === 0) guessDistributionBars[i].style.width = "5%";
    });
  }

  _makeNumbeTwoDigits(n) {
    return (n < 10 ? "0" : "") + n;
  }

  _setDateAndTime() {
    this.#upcomingMidnight = new Date();
    this.#upcomingMidnight.setHours(24, 0, 0, 0);
    this.#now = new Date();
  }

  _calculateTimeUntileMidnight() {
    this.#timeUntilMidnight = this.#upcomingMidnight.getTime() - this.#now;
  }

  _countdown() {
    this._calculateTimeUntileMidnight();
    setInterval(() => {
      let second = 1000;
      let minute = second * 60;
      let hour = minute * 60;
      let day = hour * 24;

      let textHour = Math.floor((this.#timeUntilMidnight % day) / hour);
      let textMinute = Math.floor((this.#timeUntilMidnight % hour) / minute);
      let textSecond = Math.floor((this.#timeUntilMidnight % minute) / second);

      document.querySelector(
        ".statistics-modal__time"
      ).textContent = `${this._makeNumbeTwoDigits(
        textHour
      )}:${this._makeNumbeTwoDigits(textMinute)}:${this._makeNumbeTwoDigits(
        textSecond
      )}`;

      this.#timeUntilMidnight = this.#timeUntilMidnight - 1000;
      if (this.#timeUntilMidnight < 0) {
        this.#now = new Date().getTime();
        this.#upcomingMidnight = new Date();
        this.#upcomingMidnight.setHours(24, 0, 0, 0);
        this._calculateTimeUntileMidnight();
        if (!this.#theGameIsNotActive) this.#currentStreak = 0;
        this.#werdleNumber++;
        this._updateValuesInThePlayerDataArray();
        this._displayPlayerStatistics();
        this._reset();
        this._pushTheLettersOfARandomWordFromTheWordListIntoTheAnswerArray();
        this._storeTheAnswerInLocalStorage();
        this._storeTheDataForPlayerStatisticsInLocalStorage();
      }
    }, 1000);
  }

  _reset() {
    localStorage.removeItem("answer");
    localStorage.removeItem("playerBoard");
    localStorage.removeItem("keyboard");
    localStorage.removeItem("gamestate");
    localStorage.removeItem("hardModeLetters");
    localStorage.removeItem("score");
    frontOfBoardTiles.forEach((tile) => {
      tile.style.borderColor = lightGrey;
      tile.style.animation = "";
      tile.textContent = "";
    });
    boardTileContainers.forEach((tile) => {
      tile.classList.remove("flipped");
      tile.classList.remove("flip");
    });
    keyboardButtons.forEach((button) => {
      button.style.color = secondaryColor;
      if (!this.#darkThemeIsEnabled) button.style.backgroundColor = lightGrey;
      if (this.#darkThemeIsEnabled) button.style.backgroundColor = darkGrey;
    });
    this.#scoreForCurrentRound = 0;
    this.#rowIndex = 0;
    this.#tileIndex = 0;
    this.#answerArray = [];
    this.#guessArray = [];
    this.#hardModeLetterArray = [];
    hardModeCheckbox.disabled = false;
    this.#theGameIsNotActive = false;
    guessDistributionBars.forEach(
      (bar) => (bar.style.backgroundColor = "rgb(128,128,128)")
    );
  }

  _setTheScoreForTheCurrentRound() {
    if (this.#playerGuessMatchesTheAnswer)
      this.#scoreForCurrentRound = this.#rowIndex + 1;
  }

  _storeTheDataForTheScoreInLocalStorage() {
    localStorage.setItem("score", JSON.stringify(this.#scoreForCurrentRound));
  }

  _getDataForScoreFromLocalStorage() {
    let score = JSON.parse(localStorage.getItem("score"));
    if (!score) return;
    this.#scoreForCurrentRound = score;
  }

  _increaseNumberOfGamesForASpecificScore() {
    this.#playerScoresDataArray.forEach((el, i) => {
      if (i === this.#rowIndex) {
        el++;
        this.#playerScoresDataArray.splice(i, 1, el);
        guessDistributionBars[i].style.backgroundColor = correctPlaceColor;
      }
    });
  }

  _updateColorsForGuessDistributionBars() {
    if (this.#scoreForCurrentRound === 0) {
      guessDistributionBars.forEach(
        (bar) => (bar.style.backgroundColor = "rgb(128, 128, 128)")
      );
      return;
    }
    guessDistributionBars.forEach((bar, i) => {
      if (i + 1 === this.#scoreForCurrentRound)
        bar.style.backgroundColor = correctPlaceColor;
    });
  }

  _setDataForPlayerScoreStatisticsToZero() {
    this.#playerScoresDataArray = [0, 0, 0, 0, 0, 0];
    this.#numberOfGamesWithScoreOf1 = 0;
    this.#numberOfGamesWithScoreOf2 = 0;
    this.#numberOfGamesWithScoreOf3 = 0;
    this.#numberOfGamesWithScoreOf4 = 0;
    this.#numberOfGamesWithScoreOf5 = 0;
    this.#numberOfGamesWithScoreOf6 = 0;
  }

  _updateDataForPlayerScoreStatistics() {
    [
      this.#numberOfGamesWithScoreOf1,
      this.#numberOfGamesWithScoreOf2,
      this.#numberOfGamesWithScoreOf3,
      this.#numberOfGamesWithScoreOf4,
      this.#numberOfGamesWithScoreOf5,
      this.#numberOfGamesWithScoreOf6,
    ] = this.#playerScoresDataArray;
  }

  _updateValuesInThePlayerScoresDataArray() {
    this.#playerScoresDataArray = [
      this.#numberOfGamesWithScoreOf1,
      this.#numberOfGamesWithScoreOf2,
      this.#numberOfGamesWithScoreOf3,
      this.#numberOfGamesWithScoreOf4,
      this.#numberOfGamesWithScoreOf5,
      this.#numberOfGamesWithScoreOf6,
    ];
  }

  _setDataForPlayerStatisticsToZero() {
    this.#playerDataArray = [0, 0, 0, 0, 0, 1];
    this.#numberOfGamesPlayed = 0;
    this.#numberOfGamesWon = 0;
    this.#percentageOfGamesWon = 0;
    this.#currentStreak = 0;
    this.#maxStreak = 0;
    this.#werdleNumber = 1;
  }

  /* *********************************************************************************
  These methods are called immediately by the constructor function when the page loads
  ********************************************************************************* */
  _getTheDataForTheGameStateFromLocalStorage() {
    let gamestate = JSON.parse(localStorage.getItem("gamestate"));
    if (gamestate === null) this.#theGameIsNotActive = false;
    if (gamestate !== null) this.#theGameIsNotActive = gamestate;
  }

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
    if (this.#werdleNumber === undefined) this.#werdleNumber = 1;
    let answer = acceptableWordList[this.#werdleNumber - 1];
    [...answer].forEach((el) => this.#answerArray.push(el));
  }

  _storeTheAnswerInLocalStorage() {
    localStorage.setItem("answer", JSON.stringify(this.#answerArray));
  }

  _getTheBoardDataFromLocalStorage() {
    let boardData = JSON.parse(localStorage.getItem("playerBoard"));
    let rowData = JSON.parse(localStorage.getItem("rowIndex"));

    if (!boardData) return;

    this.#rowIndex = rowData;
    this.#playerBoardDataArray = boardData;
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

  _getDataForPlayerStatisticsFromLocalStorage() {
    let playerData = JSON.parse(localStorage.getItem("playerStatistics"));
    if (!playerData) {
      this.#thereIsDataForPlayerStatistics = false;
      return;
    }
    this.#thereIsDataForPlayerStatistics = true;
    this.#playerDataArray = playerData;
  }

  _getDataForPlayerScoreStatisticsFromLocalStorage() {
    let playerScoreData = JSON.parse(localStorage.getItem("playerScoreData"));
    if (!playerScoreData) {
      this.#thereISDataForPlayerScoreStatistics = false;
      return;
    }
    this.#thereISDataForPlayerScoreStatistics = true;
    this.#playerScoresDataArray = playerScoreData;
  }

  _storeTheDataForPlayerScoreStatisticsInLocalStorage() {
    localStorage.setItem(
      "playerScoreData",
      JSON.stringify(this.#playerScoresDataArray)
    );
  }

  _updateDataForPlayerStatistics() {
    [
      this.#numberOfGamesPlayed,
      this.#numberOfGamesWon,
      this.#percentageOfGamesWon,
      this.#currentStreak,
      this.#maxStreak,
      this.#werdleNumber,
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

  _displayPlayerScoreStatistics() {
    guessDistributionBarNumbers.forEach((el, i) => {
      el.textContent = this.#playerScoresDataArray[i];
    });
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
    if (this.#keyBoardIsDisabled) return;
    if (this.#theGameIsNotActive) return;

    this._identifyCurrentRowOfPlay();
    this._selectTilesInCurrentRowOfPlay();
    this._identifyWhichKeyWasPressed(e);

    if (this.#pressedKey === "Enter") {
      this._checkIfGuessArrayIsFull();
      if (!this.#guessArrayIsFull) {
        this._shakeCurrentRowOfPlay();
        this._displayMessage("Word Is Too Short");
      }
      if (this.#guessArrayIsFull) {
        this._checkIfTheGuessIsAnAcceptableWord();
        if (!this.#theGuessIsAnAcceptableWord) {
          this._shakeCurrentRowOfPlay();
          this._displayMessage("Not In Word List");
        }
        if (this.#theGuessIsAnAcceptableWord) {
          if (this.#hardModeIsEnabled) {
            this._checkIfGuessContainsLettersFromHardModeArray();
            if (!this.#guessContainsLettersFromHardModeArray) {
              this._shakeCurrentRowOfPlay();
              this._displayMessage("Must Contain Hints From Previous Guesses");
              return;
            }
          }
          this._disableKeyBoard();
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
            setTimeout(() => {
              if (this.#scoreForCurrentRound === 1)
                this._displayMessage("#$%@#! You Probaly Cheated You Nerdle!");
              if (this.#scoreForCurrentRound === 2)
                this._displayMessage("Amazing Job Nerdle");
              if (this.#scoreForCurrentRound === 3)
                this._displayMessage("Pretty Good Nerdle");
              if (this.#scoreForCurrentRound === 4)
                this._displayMessage("Not Bad Nerdle");
              if (this.#scoreForCurrentRound === 5)
                this._displayMessage("Close One Nerdle");
              if (this.#scoreForCurrentRound === 6)
                this._displayMessage("Damn! You Almost F***ed Up Nerdle");
            }, 2200);
            this._checkIfTheMaxStreakShouldIncrease();
            this._calculateThePercentageOfGamesWon();
            this._updateValuesInThePlayerDataArray();
            this._setTheScoreForTheCurrentRound();
            this._increaseNumberOfGamesForASpecificScore();
            this._displayPlayerStatistics();
            this._displayPlayerScoreStatistics();
            this._updatePlayerScoreStatisticsChart();
            this.#theGameIsNotActive = true;
            setTimeout(() => {
              this._toggleStatisticsModal();
            }, 3800);
            this._storeTheDataForPlayerStatisticsInLocalStorage();
            this._storeTheDataForPlayerScoreStatisticsInLocalStorage();
          }
          if (!this.#playerGuessMatchesTheAnswer) {
            this._checkIfPlayerIsOnFinalRow();
            if (this.#playerIsOnFinalRowOfPlay) {
              setTimeout(() => {
                this._displayMessage("The Word Was");
                this._displayMessage(`${this.#answerArray.join("")}`);
                this._displayMessage("And You Call Yourself A Nerdle");
              }, 2200);
              this.#numberOfGamesPlayed++;
              this.#currentStreak = 0;
              this._calculateThePercentageOfGamesWon();
              this._updateValuesInThePlayerDataArray();
              this._setTheScoreForTheCurrentRound();
              this._displayPlayerStatistics();
              this._updatePlayerScoreStatisticsChart();
              this.#theGameIsNotActive = true;
              setTimeout(() => {
                this._toggleStatisticsModal();
              }, 3500);
              this._storeTheDataForPlayerStatisticsInLocalStorage();
            }
            this._moveToTheNextRowOfPlay();
            this._addLettersFromGuessToHardModeLetterArray();
            this._storeLettersForHardModeInLocalStorage();
            this._resetTheGuessArrayToEmpty();
          }
          this._storeTheDataForTheScoreInLocalStorage();
          this._storeTheDataForGameStateInLocalStorage();
          this._storeTheBoardDataInLocalStorage();
        }
      }
    }

    if (this.#pressedKey === "Backspace") {
      this._removeTheLastLetterFromTheGuessArray();
      this._setTheTextContentForTilesInCurrentRowOfPlay();
      this._removeTileBorderColor();
      // this._checkIfGuessArrayIsFull();
    }

    if (this.#pressedKey !== "Enter" && this.#pressedKey !== "Backspace") {
      this._addTheLetterOfThePressedKeyToGuessArray();
      if (!this.#theKeyPressedIsAcceptable)
        this._removeTheLastLetterFromTheGuessArray();
      this._checkIfGuessArrayIsFull();
      if (this.#guessArrayIsFull) this._stopAddingLettersToTheGuessArray();
      this._setTheTextContentForTilesInCurrentRowOfPlay();
      this._animateTile();
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

  _displayMessage(content) {
    let message = document.createElement("div");
    message.textContent = content;
    message.classList.add("message");
    messageContainer.prepend(message);
    setTimeout(() => {
      message.classList.add("invisible");
      message.addEventListener("transitionend", () => {
        message.remove();
      });
    }, 1500);
  }

  _checkIfTheGuessIsAnAcceptableWord() {
    if (!acceptableWordList.includes(this.#guessArray.join(""))) {
      this.#theGuessIsAnAcceptableWord = false;
    }
    if (acceptableWordList.includes(this.#guessArray.join(""))) {
      this.#theGuessIsAnAcceptableWord = true;
    }
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
    this.#answerArrayCopy = [...this.#answerArray];

    this.#backOfAllTilesInCurrentRowOfPlay.forEach((tile, i) => {
      // Remove Any Correct Letters From Copy Array
      if (tile.textContent === this.#answerArray[i]) {
        this.#answerArrayCopy.splice(
          this.#answerArrayCopy.findIndex((el) => el === tile.textContent),
          1
        );
      }
    });

    this.#backOfAllTilesInCurrentRowOfPlay.forEach((tile, i) => {
      // Change Tile Color To Grey If It Is Not In The Correct Answer
      if (tile.textContent !== this.#answerArray[i]) {
        tile.style.backgroundColor = wrongLetterColor;
        tile.style.color = "white";
      }

      // Change Tile Color To Yellow If In Wrong Place And Remove It From Copy Array
      if (
        this.#answerArrayCopy.includes(tile.textContent) &&
        tile.textContent !== this.#answerArray[i]
      ) {
        tile.style.backgroundColor = wrongPlaceColor;
        tile.style.color = "white";
        this.#answerArrayCopy.splice(
          this.#answerArrayCopy.findIndex((el) => el === tile.textContent),
          1
        );
      }

      // Change Tile Color To Green If It Is In Correct Spot
      if (tile.textContent === this.#answerArray[i]) {
        tile.style.backgroundColor = correctPlaceColor;
        tile.style.color = "white";
      }

      // Update the keyboard button colors based on guess
      keyboardButtons.forEach((button) => {
        if (button.value === tile.textContent) {
          setTimeout(() => {
            button.style.color = "white";
            if (button.style.backgroundColor === correctPlaceColor)
              button.style.backgroundColor = correctPlaceColor;
            if (button.style.backgroundColor !== correctPlaceColor) {
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
    localStorage.setItem(
      "keyboard",
      JSON.stringify(this.#keyboardButtonDataArray)
    );
  }

  _getTheKeyboardDataFromLocalStorage() {
    const keyboardData = JSON.parse(localStorage.getItem("keyboard"));

    if (!keyboardData) return;
    this.#keyboardButtonDataArray = keyboardData;
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
      this.#werdleNumber,
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

  _storeTheDataForGameStateInLocalStorage() {
    localStorage.setItem("gamestate", JSON.stringify(this.#theGameIsNotActive));
  }

  _moveToTheNextRowOfPlay() {
    this.#rowIndex++;
    if (this.#rowIndex > 0 && !this.#hardModeIsEnabled)
      this._disableHardModeSlider();
    this.#tileIndex = 0;
    if (this.#rowIndex > 6) this.#rowIndex = 6;
  }

  _resetTheGuessArrayToEmpty() {
    this.#guessArray = [];
  }

  _removeTheLastLetterFromTheGuessArray() {
    this.#guessArray.pop();
    this.#tileIndex--;
    if (this.#tileIndex < 0) this.#tileIndex = 0;
  }

  _addTheLetterOfThePressedKeyToGuessArray() {
    this.#guessArray.push(this.#pressedKey);
    this.#tileIndex++;
    if (this.#tileIndex > 5) this.#tileIndex = 5;
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
      button.style.backgroundColor = lightGrey;
      button.style.color = "black";
    });
  }

  _globalReset() {
    localStorage.removeItem("playerStatistics");
    localStorage.removeItem("playerBoard");
    localStorage.removeItem("keyboard");
    localStorage.removeItem("answer");
    localStorage.removeItem("gamestate");
    localStorage.removeItem("playerScoreData");
    localStorage.removeItem("hardModeLetters");
    localStorage.removeItem("score");
  }

  _simpleReset() {
    localStorage.removeItem("playerStatistics");
    localStorage.removeItem("playerBoard");
    localStorage.removeItem("keyboard");
    localStorage.removeItem("gamestate");
    localStorage.removeItem("playerScoreData");
    localStorage.removeItem("hardModeLetters");
  }
}

const acceptableWordList = [
  "NOUNS",
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
  "SCARS",
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
