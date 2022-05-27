"use strict";
const allBoardTiles = document.querySelectorAll(".board__tile");
const allBoardRows = document.querySelectorAll(".board__row");
const keyboard = document.querySelector(".keyboard");
const keyboardButtons = document.querySelectorAll(".keyboard__button");
const keyboardButtonBackspace = document.querySelector(
  ".keyboard__button--backspace"
);
const keyboardButtonEnter = document.querySelector(".keyboard__button--enter");
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
const exampleDiv = document.querySelectorAll(".example__flip");
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
const timerContainer = document.querySelector(
  ".statistics-modal__share-and-timer-container"
);

let primaryColor = "#ffffff";
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
  #allTilesIncurrentRowOfPlay;
  #arrayOfAllKeyboardValues = [];
  #theKeyPressedIsAcceptable;
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
  #midnight;
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
  #answerArrayAttributes;
  #gameLaunchTime;
  #timeSinceGameLaunched;
  #numberOfDaysSinceGameLaunched;

  constructor() {
    this._getDataForPlayerStatisticsFromLocalStorage();
    if (!this.#thereIsDataForPlayerStatistics)
      this._setDataForPlayerStatisticsToZero();
    if (this.#thereIsDataForPlayerStatistics)
      this._updateDataForPlayerStatistics();

    this._getDataForNumberOfDaysSinceGameLaunch();
    this._setGameLaunchTime();
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
    this._getTheKeyboardDataFromLocalStorage();
    this._createNewKeyboardButtonObjectsAndPushThemIntoTheKeyboardButtonDataArray();
    this._removeOldKeyboardButtonObjectsFromTheEndOfTheKeyboardButtonDataArray();

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

    this._identifyCurrentRowOfPlay();
    if (!this.#theGameIsNotActive) this._selectTilesInCurrentRowOfPlay();

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

    this._flipTheTilesThatHaveContent();

    if (this.#theGameIsNotActive) {
      timerContainer.classList.remove("hidden");
      setTimeout(() => {
        this._toggleStatisticsModal();
      }, 1000);
    }

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

  _setGameLaunchTime() {
    this.#gameLaunchTime = new Date(2022, 4, 26, 24, 0, 0, 0);
    this.#gameLaunchTime = this.#gameLaunchTime.getTime();
  }

  _calculateTimeSinceGameLaunched() {
    this.#now = new Date();
    this.#timeSinceGameLaunched = this.#gameLaunchTime - this.#now.getTime();
  }

  _calculateTimeUntileMidnight() {
    this.#now = new Date();
    this.#midnight = new Date();
    this.#midnight.setHours(24, 0, 0, 0);
    this.#timeUntilMidnight = this.#midnight - this.#now.getTime();
  }

  _getDataForNumberOfDaysSinceGameLaunch() {
    let days = JSON.parse(localStorage.getItem("daysSinceLaunch"));
    if (!days) return;
    this.#numberOfDaysSinceGameLaunched = days;
  }

  _storeDataForNumberOfDaysSinceGameLaunch() {
    localStorage.setItem(
      "daysSinceLaunch",
      this.#numberOfDaysSinceGameLaunched
    );
  }

  _countdown() {
    this._calculateTimeSinceGameLaunched();

    if (this.#timeSinceGameLaunched < 0) {
      let currentNumberOfDaysSinceGameLaunced = Math.ceil(
        Math.abs(this.#timeSinceGameLaunched / 86400000)
      );
      this.#werdleNumber = currentNumberOfDaysSinceGameLaunced;
      if (
        currentNumberOfDaysSinceGameLaunced -
          this.#numberOfDaysSinceGameLaunched ===
        1
      )
        this._reset();

      this.#numberOfDaysSinceGameLaunched = currentNumberOfDaysSinceGameLaunced;
      this._storeDataForNumberOfDaysSinceGameLaunch();

      this.#werdleNumber = currentNumberOfDaysSinceGameLaunced;
      this._calculateTimeUntileMidnight();

      // if (!this.#theGameIsNotActive) this.#currentStreak = 0;
      this._updateValuesInThePlayerDataArray();
      this._displayPlayerStatistics();
    }

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
    }, 1000);
  }

  _pushTheLettersOfARandomWordFromTheWordListIntoTheAnswerArray() {
    let answer = acceptableWordList[this.#werdleNumber - 1];
    [...answer].forEach((el) => this.#answerArray.push(el));
  }

  _displayPlayerStatistics() {
    numberOfGamesPlayed.textContent = this.#numberOfGamesPlayed;
    percentageOfGamesWon.textContent = this.#percentageOfGamesWon;
    currentStreak.textContent = this.#currentStreak;
    maxStreak.textContent = this.#maxStreak;
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

  _reset() {
    localStorage.removeItem("answer");
    localStorage.removeItem("playerBoard");
    localStorage.removeItem("keyboard");
    localStorage.removeItem("gamestate");
    localStorage.removeItem("hardModeLetters");
    localStorage.removeItem("score");
    allBoardTiles.forEach((tile) => {
      tile.style.borderColor = lightGrey;
      tile.style.animation = "";
      tile.textContent = "";
    });
    allBoardTiles.forEach((tile) => {
      tile.classList.remove("flipped");
      tile.classList.remove("flip");
      tile.style.backgroundColor = primaryColor;
      tile.style.color = secondaryColor;
      tile.style.border = "2px solid var(--grey-light)";
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
    this.#playerIsOnFinalRowOfPlay = false;
    hardModeCheckbox.disabled = false;
    this.#theGameIsNotActive = false;
    guessDistributionBars.forEach(
      (bar) => (bar.style.backgroundColor = "rgb(128,128,128)")
    );
    timerContainer.classList.add("hidden");
    this._pushTheLettersOfARandomWordFromTheWordListIntoTheAnswerArray();
    this._storeTheAnswerInLocalStorage();
    this._storeTheDataForPlayerStatisticsInLocalStorage();
  }

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
      primaryColor = "#131313";
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
      allBoardTiles.forEach((tile) => {
        tile.style.borderColor = lightGrey;
      });

      allBoardTiles.forEach((tile) => {
        if (tile.style.backgroundColor === "rgb(208, 179, 99)")
          tile.style.backgroundColor = "rgb(208, 179, 99)";
        if (tile.style.backgroundColor === "rgb(104, 168, 104)")
          tile.style.backgroundColor = "rgb(104, 168, 104)";
        if (tile.style.backgroundColor === "rgb(128, 128, 128)")
          tile.style.backgroundColor = "rgb(60, 60, 60)";
        if (tile.style.backgroundColor === "rgb(255, 255, 255)")
          tile.style.backgroundColor = "rgb(19, 19, 19)";
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
      primaryColor = "#ffffff";
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
      allBoardTiles.forEach((tile) => {
        tile.style.borderColor = lightGrey;
      });
      allBoardTiles.forEach((tile) => {
        if (tile.style.backgroundColor === "rgb(208, 179, 99)")
          tile.style.backgroundColor = "rgb(208, 179, 99)";
        if (tile.style.backgroundColor === "rgb(104, 168, 104)")
          tile.style.backgroundColor = "rgb(104, 168, 104)";
        if (tile.style.backgroundColor === "rgb(60, 60, 60)")
          tile.style.backgroundColor = "rgb(128, 128, 128)";
        if (tile.style.backgroundColor === "rgb(19, 19, 19)")
          tile.style.backgroundColor = "rgb(255, 255, 255)";
      });
    }

    exampleDiv.forEach((el) => {
      el.style.backgroundColor = primaryColor;
      el.style.color = secondaryColor;
    });
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
      allBoardTiles.forEach((tile) => {
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
      allBoardTiles.forEach((tile) => {
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
    this.#allTilesIncurrentRowOfPlay.forEach((el, i) => {
      if (i + 1 === this.#tileIndex) {
        el.style.animation = "pulse 0.1s linear";
        el.style.borderColor = darkGrey;
      }
    });
  }

  _removeTileBorderColor() {
    this.#allTilesIncurrentRowOfPlay.forEach((el, i) => {
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
      if (allBoardTiles[i].style.backgroundColor === "rgb(128, 128, 128)")
        text = text + greySquare;
      if (allBoardTiles[i].style.backgroundColor === "rgb(60, 60, 60)")
        text = text + blackSquare;
      if (allBoardTiles[i].style.backgroundColor === "rgb(104, 168, 104)")
        text = text + greenSquare;
      if (allBoardTiles[i].style.backgroundColor === "rgb(245, 121, 58)")
        text = text + orangSquare;
      if (allBoardTiles[i].style.backgroundColor === "rgb(208, 179, 99)")
        text = text + yellowSquare;
      if (allBoardTiles[i].style.backgroundColor === "rgb(133, 192, 249)")
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

  _setTheScoreForTheCurrentRound() {
    if (this.#playerGuessMatchesTheAnswer)
      this.#scoreForCurrentRound = this.#rowIndex;
    if (!this.#playerGuessMatchesTheAnswer) this.#scoreForCurrentRound = null;
    console.log(this.#scoreForCurrentRound);
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
    this.#playerScoresDataArray.forEach((score, i) => {
      if (i === this.#rowIndex - 1) {
        score++;
        this.#playerScoresDataArray.splice(i, 1, score);
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
    allBoardTiles.forEach((tile, i) => {
      let tileBackgroundColor = tile.style.backgroundColor;
      let tileColor = tile.style.color;
      let tileText = tile.textContent;
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
    allBoardTiles.forEach((tile, i) => {
      tile.style.backgroundColor =
        this.#playerBoardDataArray[i].tileBackgroundColor;
      tile.style.color = this.#playerBoardDataArray[i].tileColor;
      tile.textContent = this.#playerBoardDataArray[i].tileText;
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
          this._flipTiles();
          this._updateTheKeyboardColors();
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
            this.#rowIndex++;
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
            timerContainer.classList.remove("hidden");
            setTimeout(() => {
              this._toggleStatisticsModal();
            }, 3800);
            this._storeTheDataForPlayerStatisticsInLocalStorage();
            this._storeTheDataForPlayerScoreStatisticsInLocalStorage();
          }
          if (!this.#playerGuessMatchesTheAnswer) {
            this._setTheScoreForTheCurrentRound();
            this._storeTheDataForTheScoreInLocalStorage();
            this._checkIfPlayerIsOnFinalRow();
            if (this.#playerIsOnFinalRowOfPlay) {
              setTimeout(() => {
                this._displayMessage(`🤦‍♂️ ${this.#answerArray.join("")} 🤦‍♀️`);
              }, 2200);
              this.#numberOfGamesPlayed++;
              this.#currentStreak = 0;
              this._calculateThePercentageOfGamesWon();
              this._updateValuesInThePlayerDataArray();
              this._setTheScoreForTheCurrentRound();
              this._displayPlayerStatistics();
              this._updatePlayerScoreStatisticsChart();
              this.#theGameIsNotActive = true;
              timerContainer.classList.remove("hidden");
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
    this.#allTilesIncurrentRowOfPlay =
      this.#currentRowOfPlay.querySelectorAll(".board__tile");
    this.#allTilesIncurrentRowOfPlay.forEach((tile) => {
      tile.style.color = secondaryColor;
    });
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

  _updateTheKeyboardColors() {
    this.#allTilesIncurrentRowOfPlay.forEach((tile) => {
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

  _flipTheTilesThatHaveContent() {
    allBoardTiles.forEach((tile) => {
      tile.style.backgroundColor = primaryColor;
      tile.style.color = secondaryColor;
    });

    for (let index = 0; index < this.#rowIndex; index++) {
      this.#answerArrayCopy = [...this.#answerArray];
      let boardTiles = allBoardRows[index].querySelectorAll(".board__tile");

      boardTiles.forEach((tile, i) => {
        if (tile.textContent === this.#answerArray[i]) {
          this.#answerArrayCopy.splice(
            this.#answerArrayCopy.findIndex((el) => el === tile.textContent),
            1
          );
        }
      });

      boardTiles.forEach((tile, i) => {
        if (tile.textContent !== this.#answerArray[i]) {
          tile.setAttribute("color", wrongLetterColor);
        }

        if (
          this.#answerArrayCopy.includes(tile.textContent) &&
          tile.textContent !== this.#answerArray[i]
        ) {
          tile.setAttribute("color", wrongPlaceColor);
          this.#answerArrayCopy.splice(
            this.#answerArrayCopy.findIndex((el) => el === tile.textContent),
            1
          );
        }

        if (tile.textContent === this.#answerArray[i]) {
          tile.setAttribute("color", correctPlaceColor);
        }
      });

      boardTiles.forEach((tile, i) => {
        tile.classList.add("flipped");
        setTimeout(() => {
          tile.classList.add("flip");
        }, i * 300);

        tile.addEventListener("transitionend", () => {
          tile.classList.remove("flip");
          tile.style.border = "none";
          tile.style.backgroundColor = tile.getAttribute("color");
          tile.style.color = "white";
        });
      });
    }
  }

  _flipTiles() {
    this.#answerArrayAttributes = JSON.parse(JSON.stringify(this.#answerArray));

    this.#allTilesIncurrentRowOfPlay.forEach((tile, i) => {
      if (tile.textContent === this.#answerArray[i]) {
        this.#answerArrayAttributes.splice(
          this.#answerArrayAttributes.findIndex(
            (el) => el === tile.textContent
          ),
          1
        );
      }
    });

    this.#allTilesIncurrentRowOfPlay.forEach((tile, i) => {
      if (tile.textContent !== this.#answerArray[i]) {
        tile.setAttribute("color", wrongLetterColor);
      }

      if (
        this.#answerArrayAttributes.includes(tile.textContent) &&
        tile.textContent !== this.#answerArray[i]
      ) {
        tile.setAttribute("color", wrongPlaceColor);
        this.#answerArrayAttributes.splice(
          this.#answerArrayAttributes.findIndex(
            (el) => el === tile.textContent
          ),
          1
        );
      }

      if (tile.textContent === this.#answerArray[i]) {
        tile.setAttribute("color", correctPlaceColor);
      }
    });

    this.#allTilesIncurrentRowOfPlay.forEach((tile, i) => {
      tile.classList.add("flipped");
      setTimeout(() => {
        tile.classList.add("flip");
      }, i * 300);
      tile.addEventListener("transitionend", () => {
        tile.classList.remove("flip");
        tile.style.border = "none";

        tile.style.backgroundColor = tile.getAttribute("color");
        tile.style.color = "white";
      });
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

  _applyJumpAnimationForTilesInCurrentRowOfPlay() {
    this.#allTilesIncurrentRowOfPlay.forEach((tile, i) => {
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
    this.#allTilesIncurrentRowOfPlay.forEach((tile, i) => {
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
        exampleDiv.forEach((el, i) => {
          el.classList.add("flip");
          el.addEventListener("transitionend", () => {
            el.classList.remove("flip");
            el.style.border = "none";
            el.style.color = "white";
            if (i === 0) el.style.backgroundColor = correctPlaceColor;
            if (i === 1) el.style.backgroundColor = wrongPlaceColor;
            if (i === 2) el.style.backgroundColor = wrongLetterColor;
          });
        });
      }, 200);
    }
    if (e.target.classList.contains("rules-modal__close-icon")) {
      rulesModal.classList.toggle("translate-up");
      setTimeout(() => {
        settingsModal.classList.toggle("hidden");
        exampleDiv.forEach((el) => {
          el.style.border = "2px solid var(--grey-dark)";
          el.style.color = secondaryColor;
          el.style.backgroundColor = primaryColor;
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
    localStorage.removeItem("daysSinceLaunch");
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
<<<<<<< HEAD
  "BEACH",
  "CHRIS",
  "DUNES",
  "POINT",
  "SANDY",
  "DAISY",
  "GRACE",
  "KATIE",
  "BRIAN",
  "CALEB",
  "HENRY",
  "UNCLE",
  "AUNTS",
  "NIECE",
  "TOWEL",
  "OCEAN",
  "GELOS",
  "JAMES",
  "KAELA",
  "DRINK",
  "MONEY",
  "WAVES",
  "DRUNK",
];

const app = new App();
