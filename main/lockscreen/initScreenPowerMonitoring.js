const {powerMonitor} = require("electron");
const {exec} = require('child_process');

function initScreenPowerMonitoring(data) {
  const {store, onLock, onUnlock} = data
  powerMonitor.addListener('lock-screen', () => {
    console.log('locked')
    store.screenLocked = true
    onLock?.()
  });

  powerMonitor.addListener('unlock-screen', () => {
    console.log('unlocked')
    store.screenLocked = false
    onUnlock?.()
  });
}

module.exports = initScreenPowerMonitoring
