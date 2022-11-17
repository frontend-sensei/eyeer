const { exec } = require("child_process");
const createTrapWindow = require("./trapWindow/createTrapWindow");
const isLinux = require("../utils/isLinux");
const store = require("../store/store");

function lockscreen(cb, customCommands) {
  const lockCommands = customCommands || {
    darwin:
      '/System/Library/CoreServices/"Menu Extras"/User.menu/Contents/Resources/CGSession -suspend',
    win32: "rundll32.exe user32.dll, LockWorkStation",
    linux: "xdg-screensaver lock",
  };

  if (Object.keys(lockCommands).indexOf(process.platform) === -1) {
    throw new Error(
      `lockscreen doesn't support your platform (${process.platform})`
    );
  } else {
    exec(lockCommands[process.platform], (err, stdout) =>
      cb ? cb(err, stdout) : null
    );
  }
}

function lockScreen() {
  lockscreen((err) => {
    if (!isLinux) {
      return;
    }
    store.data.screenLocked = true;
    if (err) {
      console.log("Unable to lock the screen:", err);
    }
    if (!err) {
      setTimeout(() => {
        createTrapWindow();
      }, 1000);
    }
  });
}

module.exports = lockScreen;
