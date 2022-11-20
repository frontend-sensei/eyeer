const store = require("../store/store");
const launchBreak = require("./launchBreak");
const breakEndData = require("./breakEndData");

function setupBreak() {
  if (store.data.screenLocked) {
    console.log("cancelled break setup", store.data.screenLocked);
    return;
  }
  const breakInterval = store.data.break.interval * 1000;

  breakEndData.timeoutID = setTimeout(launchBreak, breakInterval);
}

module.exports = setupBreak;
