const store = require("./store/store");
const { app, ipcMain } = require("electron");
const createBreakWindow = require("./break/createBreakWindow");
const lockScreen = require("./lockscreen/lockscreen");
const setupTray = require("./app-setup/tray/tray");
const setupFlags = require("./app-setup/flags/flags");

async function initApp() {
  setupFlags();
  setupTray();

  const breakInterval = store.data.break.interval * 1000;
  const breakEndData = {
    timeoutID: null,
    window: null,
    cancelPromise: null,
    timeLost: 0,
    timestamp: 0,
  };

  app.on("window-all-closed", (e) => e.preventDefault());

  ipcMain.on("break-end", () => {
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
    store.data.windows.trap?.close();
    handleBreakEnd();
    if (isTimeLost()) {
      launchBreak();
      return;
    }

    setupBreak();
  });

  setupBreak();

  /**
   * Close opened window, reset started timeout, hide opened window.
   * @returns {Promise<void>}
   */
  async function handleBreakEnd() {
    const { timeoutID, window } = breakEndData;

    clearTimeout(timeoutID);
    // need to hide window to not exit from app.
    // after creation a new window, we can close previous
    window?.hide();
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

    const newWindow = createBreakWindow();
    breakEndData.window?.close();
    breakEndData.window = newWindow;
    breakEndData.window.webContents.on("did-finish-load", () => {
      breakEndData.window.webContents.send("get-break-data", newBreakData);
    });
  }

  function isTimeLost() {
    const lostTime = Date.now() - breakEndData.timestamp;
    const seconds = Math.floor(lostTime / 1000);
    return seconds - breakEndData.timeLost;
  }
}

module.exports = initApp;
