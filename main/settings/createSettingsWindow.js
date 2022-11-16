const { BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const store = require("../store/store");

function createSettingsWindow() {
  const mainWindow = new BrowserWindow({
    center: true,
    webPreferences: {
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile(path.join(__dirname, "index.html"));
  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.webContents.send("get-settings-data", store.data.break);
  });
  mainWindow.webContents.openDevTools();

  ipcMain.on("update-messages", (_event, messages) => {
    store.data.break.messages = messages;
    store.save();
  });

  return mainWindow;
}

module.exports = createSettingsWindow;
