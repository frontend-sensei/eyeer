const { BrowserWindow } = require("electron");
const path = require("path");

function createSettingsWindow() {
  const mainWindow = new BrowserWindow({
    center: true,
    webPreferences: {
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, "preload.js"),
    },
  });
  mainWindow.setMenu(null);
  mainWindow.loadFile(path.join(__dirname, "index.html"));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  return mainWindow;
}

module.exports = createSettingsWindow;
