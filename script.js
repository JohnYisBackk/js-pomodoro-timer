"use strict";

// ======================================================
// SELECT ELEMENTS
// ======================================================

const timerLabel = document.getElementById("timerLabel");
const timerDisplay = document.getElementById("timerDisplay");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

const focusInput = document.getElementById("focusInput");
const shortInput = document.getElementById("shortInput");
const longInput = document.getElementById("longInput");

const sessionCount = document.getElementById("sessionCount");
const totalFocus = document.getElementById("totalFocus");

const modeButtons = document.querySelectorAll(".mode-btn");

// ======================================================
// APP STATE
// ======================================================

let activeMode = "focus";

let timerDuration = 25 * 60;

let timeLeft = timerDuration;

let timerInterval = null;

let isRunning = false;

let sessions = 0;

let totalFocusMinutes = 0;

// ======================================================
// STORAGE SYSTEM
// ======================================================

function saveData() {
  localStorage.setItem(
    "pomodoroTimer",
    JSON.stringify({
      sessions,
      totalFocusMinutes,
      focusMinutes: focusInput.value,
      shortMinutes: shortInput.value,
      longMinutes: longInput.value,
    }),
  );
}

function loadData() {
  const storedData = localStorage.getItem("pomodoroTimer");

  if (!storedData) return;

  const data = JSON.parse(storedData);

  sessions = data.sessions || 0;
  totalFocusMinutes = data.totalFocusMinutes || 0;

  focusInput.value = data.focusMinutes || 25;
  shortInput.value = data.shortMinutes || 5;
  longInput.value = data.longMinutes || 15;
}

// ======================================================
// HELPER FUNCTIONS
// ======================================================

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secondsLeft = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(secondsLeft).padStart(2, "0")}`;
}

function getModeDuration(mode) {
  if (mode === "focus") {
    return Number(focusInput.value) * 60;
  }

  if (mode === "short") {
    return Number(shortInput.value) * 60;
  }

  if (mode === "long") {
    return Number(longInput.value) * 60;
  }
}

function getModeLabel(mode) {
  if (mode === "focus") {
    return "Focus Time";
  }

  if (mode === "short") {
    return "Short Break";
  }

  if (mode === "long") {
    return "Long Break";
  }
}

// ======================================================
// RENDER FUNCTIONS
// ======================================================

function renderTimer() {
  timerDisplay.textContent = formatTime(timeLeft);
  timerLabel.textContent = getModeLabel(activeMode);
}

function renderStats() {
  sessionCount.textContent = sessions;
  totalFocus.textContent = `${totalFocusMinutes} min`;
}

function renderModeButtons() {
  modeButtons.forEach((button) => {
    if (button.dataset.mode === activeMode) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
}

function renderAll() {
  renderTimer();
  renderStats();
  renderModeButtons();
}

// ======================================================
// TIMER ACTIONS
// ======================================================

function startTimer() {
  if (isRunning) return;

  isRunning = true;

  timerInterval = setInterval(() => {
    timeLeft--;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      isRunning = false;

      if (activeMode === "focus") {
        sessions++;
        totalFocusMinutes += Number(focusInput.value);
      }

      timeLeft = getModeDuration(activeMode);

      saveData();
      renderAll();

      return;
    }

    renderTimer();
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  isRunning = false;
}

function resetTimer() {
  pauseTimer();

  timeLeft = getModeDuration(activeMode);

  renderAll();
}

function switchMode(mode) {
  pauseTimer();

  activeMode = mode;

  timerDuration = getModeDuration(activeMode);

  timeLeft = timerDuration;

  renderAll();
}

function handleInputChange() {
  if (!isRunning) {
    timerDuration = getModeDuration(activeMode);
    timeLeft = timerDuration;
  }

  saveData();
  renderAll();
}

// ======================================================
// EVENT LISTENERS
// ======================================================

modeButtons.forEach((button) => {
  button.addEventListener("click", function () {
    switchMode(button.dataset.mode);
  });
});

startBtn.addEventListener("click", startTimer);

pauseBtn.addEventListener("click", pauseTimer);

resetBtn.addEventListener("click", resetTimer);

focusInput.addEventListener("input", handleInputChange);
shortInput.addEventListener("input", handleInputChange);
longInput.addEventListener("input", handleInputChange);

// ======================================================
// INITIAL LOAD
// ======================================================

loadData();
timeLeft = getModeDuration(activeMode);
renderAll();
