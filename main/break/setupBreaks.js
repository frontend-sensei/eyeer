const store = require("../store/store");
const { ipcMain, screen } = require("electron");
const lockScreen = require("../lockscreen/lockscreen");
const createBreakWindow = require("./createBreakWindow");

function setupBreaks() {
  const breakInterval = store.data.break.interval * 1000;
  const breakEndData = {
    timeoutID: null,
    windows: [],
    timeLost: 0,
    timestamp: 0,
    isFinished: false,
  };

  ipcMain.on("break-end", () => {
    if (breakEndData.isFinished) {
      return;
    }
    breakEndData.isFinished = true;
    handleBreakEnd();
    setupBreak();
  });
  ipcMain.on("custom-lock-screen", (_event, timeLost) => {
    breakEndData.timeLost = timeLost;
    breakEndData.timestamp = Date.now();
    lockScreen();
    handleBreakEnd();
  });
  ipcMain.on("lock-screen", (_event) => {
    breakEndData.windows[0].webContents.send("screen-locking");
    ipcMain.on("screen-locking", (_event, timeLost) => {
      breakEndData.timeLost = timeLost;
      breakEndData.timestamp = Date.now();
      handleBreakEnd();
    });
  });
  ipcMain.on("custom-unlock-screen", () => {
    store.data.screenLocked = false;
    store.data.windows.traps.forEach((trapWindow) => trapWindow?.destroy());
    if (isTimeLost(breakEndData)) {
      launchBreak();
      return;
    }
    setupBreak();
  });
  ipcMain.on("unlock-screen", () => {
    if (isTimeLost(breakEndData)) {
      launchBreak();
      return;
    }
    setupBreak();
  });

  setupBreak();

  /**
   * Close opened window, reset started timeout, hide opened window.
   */
  function handleBreakEnd() {
    const { timeoutID, windows } = breakEndData;
    clearTimeout(timeoutID);
    store.setNextMessage();
    // need to hide window to not exit from app.
    // after creation a new window, we can close previous
    windows[0]?.hide();
    windows[1]?.hide();
  }

  function setupBreak() {
    if (store.data.screenLocked) {
      console.log("cancelled break setup", store.data.screenLocked);
      return;
    }

    breakEndData.timeoutID = setTimeout(launchBreak, breakInterval);
  }

  function launchBreak() {
    const newBreakData = breakEndData.timeLost
      ? { ...store.data.break, duration: breakEndData.timeLost }
      : store.data.break;
    breakEndData.timeLost = 0;
    breakEndData.isFinished = false;

    const displays = screen.getAllDisplays();
    const externalDisplay = displays.find((display) => {
      return display.bounds.x !== 0 || display.bounds.y !== 0;
    });

    const newWindow = createBreakWindow();
    if (externalDisplay) {
      const newExternalWindow = createBreakWindow({
        x: externalDisplay.bounds.x,
        y: externalDisplay.bounds.y,
      });
      breakEndData.windows[1]?.close();
      breakEndData.windows[1] = newExternalWindow;
      breakEndData.windows[1].webContents.on("did-finish-load", () => {
        breakEndData.windows[1].webContents.send(
          "get-break-data",
          newBreakData
        );
      });
    }

    breakEndData.windows[0]?.close();
    breakEndData.windows[0] = newWindow;
    breakEndData.windows[0].webContents.on("did-finish-load", () => {
      breakEndData.windows[0].webContents.send("get-break-data", newBreakData);
    });
  }

  function isTimeLost(breakData) {
    const lostTime = Date.now() - breakData.timestamp;
    const seconds = Math.floor(lostTime / 1000);
    return seconds - breakData.timeLost;
  }
}

module.exports = setupBreaks;
