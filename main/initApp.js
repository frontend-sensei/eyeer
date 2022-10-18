const store = require("./store/store");
const {ipcMain} = require("electron");
const createBreakWindow = require("./break/createBreakWindow");
const lockScreen = require('./lockscreen/lockscreen');

async function initApp() {
  const breakInterval = store.break.interval * 1000
  const breakEndData = {
    timeoutID: null,
    window: null,
    cancelPromise: null,
    timeLost: 0,
    timestamp: 0,
  };

  ipcMain.on('break-end', () => {
    handleBreakEnd(breakEndData)
    setupBreak()
  })
  ipcMain.on('custom-lock-screen', (_event, timeLost) => {
    breakEndData.timeLost = timeLost
    breakEndData.timestamp = Date.now()
    lockScreen()
    handleBreakEnd(breakEndData)
  })
  ipcMain.on('custom-unlock-screen', () => {
    store.screenLocked = false
    store.windows.trap?.close()
    handleBreakEnd(breakEndData)
    if (isTimeLost()) {
      launchBreak()
      return
    }

    setupBreak()
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
  }

  function setupBreak() {
    if (store.screenLocked) {
      console.log('cancelled break setup', store.screenLocked)
      return
    }

    breakEndData.timeoutID = setTimeout(launchBreak, breakInterval)
  }

  function launchBreak() {
    const newBreakData = breakEndData.timeLost ? {...store.break, duration: breakEndData.timeLost} : store.break
    breakEndData.timeLost = 0

    const newWindow = createBreakWindow()
    breakEndData.window?.close()
    breakEndData.window = newWindow
    breakEndData.window.webContents.on('did-finish-load', () => {
      breakEndData.window.webContents.send('get-break-data', newBreakData)
    });
  }

  function isTimeLost() {
    const lostTime = Date.now() - breakEndData.timestamp
    const seconds = Math.floor(lostTime / 1000)
    return seconds - breakEndData.timeLost
  }
}

module.exports = initApp



