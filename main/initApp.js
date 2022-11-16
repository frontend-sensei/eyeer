const store = require("./store/store");
const path = require("path");
const { app, ipcMain, Menu, Tray } = require("electron");
const createBreakWindow = require("./break/createBreakWindow");
const createSettingsWindow = require("./settings/createSettingsWindow");
const lockScreen = require("./lockscreen/lockscreen");

async function initApp() {
  if (process.platform === "linux") {
    app.commandLine.appendSwitch("enable-transparent-visuals");
    app.commandLine.appendSwitch("disable-gpu");
  }

  app.whenReady().then(() => {
    const tray = new Tray(path.resolve(__dirname, "assets/braker-icon.png"));
    const contextMenu = Menu.buildFromTemplate([
      {
        label: "Settings",
        type: "normal",
        click: () => {
          createSettingsWindow();
        },
      },
      { type: "separator" },
      {
        label: "Quit Braker",
        type: "normal",
        click: () => {
          app.exit(0);
        },
      },
    ]);
    tray.setToolTip("This is my application.");
    tray.setContextMenu(contextMenu);
  });

  const breakInterval = store.break.interval * 1000;
  const breakEndData = {
    timeoutID: null,
    window: null,
    cancelPromise: null,
    timeLost: 0,
    timestamp: 0,
  };

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
    store.screenLocked = false;
    store.windows.trap?.close();
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
    if (store.screenLocked) {
      console.log("cancelled break setup", store.screenLocked);
      return;
    }

    breakEndData.timeoutID = setTimeout(launchBreak, breakInterval);
  }

  function launchBreak() {
    const newBreakData = breakEndData.timeLost
      ? { ...store.break, duration: breakEndData.timeLost }
      : store.break;
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
