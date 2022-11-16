window.api.receive("get-break-data", (breakData) => {
  initRenderer(breakData);
});

const startedBreakData = {
  timeLost: 0,
};

function initRenderer(breakData) {
  initTimer(breakData);
  initSkipButton();
  initLockButton();
}

function initLockButton() {
  const lockButton = document.getElementById("lockButton");
  if (!lockButton) {
    console.error("lockButton not found!");
  }
  lockButton.addEventListener("click", () => {
    window.api.lockScreen(startedBreakData.timeLost);
  });
}

function initSkipButton() {
  const skipButton = document.getElementById("skipButton");
  if (!skipButton) {
    console.error("skipButton not found!");
  }
  skipButton.addEventListener("click", window.api.breakEnd);
}

function initTimer(store) {
  const timerNode = document.getElementById("timer");
  if (!timerNode) {
    console.error("timerNode not found!");
  }
  let duration = +store.duration;
  startedBreakData.timeLost = duration;

  updateTimer();
  let timerID = setInterval(() => {
    if (duration === 0) {
      clearInterval(timerID);
      window.api.breakEnd();
    }
    duration--;
    updateTimer();
  }, 1000);

  function updateTimer() {
    timerNode.innerText = getTimerValue(duration);
    startedBreakData.timeLost = duration;
  }
}

function getTimerValue(duration) {
  return `${getMinutes(duration)}:${getSeconds(duration)}`;
}

function getMinutes(seconds) {
  return formatWithZero(Math.trunc(seconds / 60));
}

function getSeconds(seconds) {
  return formatWithZero(seconds % 60);
}

function formatWithZero(value) {
  return value > 9 ? value : `0${value}`;
}
