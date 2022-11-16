const { BrowserWindow } = require("electron");
const path = require("path");

function createBreakWindow() {
  const mainWindow = new BrowserWindow({
    frame: true,
    fullscreen: true,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, "preload.js"),
    },
  });
  mainWindow.setMenuBarVisibility(false);

  var today = new Date();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  console.log("window created", time);

  mainWindow.loadFile(path.join(__dirname, "index.html"));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  return mainWindow;
}

module.exports = createBreakWindow;
