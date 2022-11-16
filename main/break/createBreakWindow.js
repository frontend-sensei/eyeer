const { BrowserWindow } = require("electron");
const path = require("path");

function createBreakWindow() {
  const mainWindow = new BrowserWindow({
    frame: true,
    fullscreen: true,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile(path.join(__dirname, "index.html"));
  // mainWindow.webContents.openDevTools();

  return mainWindow;
}

module.exports = createBreakWindow;
