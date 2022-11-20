const store = require("../store/store");
const { ipcMain, screen } = require("electron");
const lockScreen = require("../lockscreen/lockscreen");
const createBreakWindow = require("./createBreakWindow");
const getLostTime = require("getLostTime");
const handleBreakEnd = require("handleBreakEnd");

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
    breakEndData.timeLost = 0;
    handleBreakEnd(breakEndData);
    setupBreak();
  });
  ipcMain.on("custom-lock-screen", (_event, timeLost) => {
    breakEndData.timeLost = timeLost;
    breakEndData.timestamp = Date.now();
    lockScreen();
    handleBreakEnd(breakEndData);
  });
  ipcMain.on("custom-unlock-screen", () => {
    store.data.screenLocked = false;
    store.data.windows.traps.forEach((trapWindow) => trapWindow?.destroy());
    const lostTime = getLostTime(breakEndData);
    if (lostTime) {
      breakEndData.timeLost = lostTime;
      launchBreak();
      return;
    }
    setupBreak();
  });

  setupBreak();

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
}

module.exports = setupBreaks;
