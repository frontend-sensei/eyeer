const store = require("./store/store");
const {ipcMain} = require("electron");
const createBreakWindow = require("./break/createBreakWindow");
const lockScreen = require('./lockscreen/lockscreen');
const initScreenPowerMonitoring = require('./lockscreen/initScreenPowerMonitoring')

async function initApp() {
  const breakInterval = 5000 || store.break.interval
  const breakEndData = {
    timeoutID: null,
    window: null,
    cancelPromise: null
  };

  ipcMain.on('break-end', () => {
    handleBreakEnd(breakEndData)
  })
  // when important settings updated
  ipcMain.on('restart-break', () => {
    handleBreakEnd(breakEndData)
  })
  ipcMain.on('custom-unlock-screen', () => {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    console.log('Screen unlocked', time)
    store.screenLocked = false
    store.windows.trap?.close()
    handleBreakEnd(breakEndData)
  })

  ipcMain.on('lock-screen', lockScreen)
  initScreenPowerMonitoring({
    store,
    onUnlock: () => {
      // wait ~ 10 secs and run break
      handleBreakEnd(breakEndData)
    },
    onLock: () => {
      handleBreakEnd(breakEndData)
    },
  })

  setupBreak()

  /**
   * Close opened window, reset started timeout, setup timeout for new break
   * @param breakData
   * @returns {Promise<void>}
   */
  async function handleBreakEnd(breakData) {
    const {timeoutID, window} = breakData

    clearTimeout(timeoutID)
    // need to hide window to not exit from app.
    // after creation a new window, we can close previous
    window?.hide()

    setupBreak()
  }

  function setupBreak() {
    if (store.screenLocked) {
      console.log('cancelled break setup', store.screenLocked)
      return
    }
    breakEndData.timeoutID = setTimeout(() => {
      const newWindow = createBreakWindow()
      breakEndData.window?.close()
      breakEndData.window = newWindow
      breakEndData.window.webContents.on('did-finish-load', () => {
        breakEndData.window.webContents.send('get-break-data', store.break)
      });
    }, breakInterval)
  }
}

module.exports = initApp



