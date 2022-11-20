const store = require("../store/store");
const getLostTime = require("./getLostTime");
const breakEndData = require("./breakEndData");

/**
 * Close opened window, reset started timeout, hide opened window.
 */
function handleBreakEnd() {
  const { timeoutID, windows } = breakEndData;
  clearTimeout(timeoutID);
  if (getLostTime(breakEndData) <= 0) {
    store.setNextMessage();
  }
  // need to hide window to not exit from app.
  // after creation a new window, we can close previous
  windows[0]?.hide();
  windows[1]?.hide();
}

module.exports = handleBreakEnd;
