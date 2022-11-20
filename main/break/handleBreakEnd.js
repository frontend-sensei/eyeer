const store = require("../store/store");
const getLostTime = require("./getLostTime");

/**
 * Close opened window, reset started timeout, hide opened window.
 */
function handleBreakEnd(data) {
  const { timeoutID, windows } = data;
  clearTimeout(timeoutID);
  if (!getLostTime(data)) {
    store.setNextMessage();
  }
  // need to hide window to not exit from app.
  // after creation a new window, we can close previous
  windows[0]?.hide();
  windows[1]?.hide();
}

module.exports = handleBreakEnd;
