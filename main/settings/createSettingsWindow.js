const { BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const store = require("../store/store");

function createSettingsWindow() {
  const window = new BrowserWindow({
    center: true,
    webPreferences: {
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  window.setMenuBarVisibility(false);
  window.loadFile(path.join(__dirname, "index.html"));
  window.webContents.on("did-finish-load", () => {
    window.webContents.send("get-settings-data", store.data.break);
  });

  ipcMain.on("update-messages", (_event, messages) => {
    store.data.break.messages = messages;
    store.save();
  });

  return window;
}

module.exports = createSettingsWindow;
