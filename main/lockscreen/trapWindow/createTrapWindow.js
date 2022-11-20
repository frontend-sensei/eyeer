const { BrowserWindow } = require("electron");
const path = require("path");

async function createTrapWindow(additionalOptions) {
  const trapWindow = new BrowserWindow({
    frame: true,
    fullscreen: true,
    transparent: true,
    webPreferences: {
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"),
    },
    ...additionalOptions,
  });

  await trapWindow.loadFile(path.join(__dirname, "index.html"));

  return trapWindow;
}

module.exports = createTrapWindow;
