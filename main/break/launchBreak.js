const breakEndData = require("./breakEndData");
const store = require("../store/store");
const { screen } = require("electron");
const createBreakWindow = require("./createBreakWindow");

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
      breakEndData.windows[1].webContents.send("get-break-data", newBreakData);
    });
  }

  breakEndData.windows[0]?.close();
  breakEndData.windows[0] = newWindow;
  breakEndData.windows[0].webContents.on("did-finish-load", () => {
    breakEndData.windows[0].webContents.send("get-break-data", newBreakData);
  });
}

module.exports = launchBreak;
