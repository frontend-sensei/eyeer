const store = require("../store/store");
const { ipcMain } = require("electron");
const lockScreen = require("../lockscreen/lockscreen");
const getLostTime = require("./getLostTime");
const handleBreakEnd = require("./handleBreakEnd");
const breakEndData = require("./breakEndData");
const setupBreak = require("./setupBreak");
const launchBreak = require("./launchBreak");

function setupBreaks() {
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
  ipcMain.on("custom-unlock-screen", () => {
    store.data.screenLocked = false;
    store.data.windows.traps.forEach((trapWindow) => trapWindow?.destroy());
    const lostTime = getLostTime(breakEndData);
    if (lostTime >= 0) {
      breakEndData.timeLost = lostTime;
      launchBreak();
      return;
    }
    breakEndData.timeLost = 0;
    setupBreak();
  });

  setupBreak();
}

module.exports = setupBreaks;
