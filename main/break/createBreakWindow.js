const { BrowserWindow } = require("electron");
const path = require("path");
const isLinux = require("../utils/isLinux");
const isWindows = require("../utils/isWindows");
const isMac = require("../utils/isMac");

function createBreakWindow(additionalOptions) {
  const OSSpecificOptions = {
    linux: {
      windowOptions: {
        frame: true,
      },
      setup(win) {
        win.setVisibleOnAllWorkspaces(true);
      },
    },
    windows: {
      windowOptions: {
        show: false,
        frame: false,
      },
      setup(win) {
        win.once("ready-to-show", () => {
          win.setAlwaysOnTop(true, "screen-saver");
          win.maximize();
          win.show();
        });
      },
    },
    mac: {},
  };
  const getCurrentOSOptions = () => {
    const OS = {
      name: "",
    };
    if (isLinux) {
      OS.name = "linux";
    } else if (isWindows) {
      OS.name = "windows";
    } else if (isMac) {
      OS.name = "mac";
    }
    return OSSpecificOptions[OS.name] || {};
  };
  const OSOptions = getCurrentOSOptions();

  const window = new BrowserWindow({
    fullscreen: true,
    alwaysOnTop: true,
    webPreferences: {
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"),
    },
    ...OSOptions.windowOptions,
    ...additionalOptions,
  });

  OSOptions?.setup(window);

  window.setMenuBarVisibility(false);
  window.loadFile(path.join(__dirname, "index.html"));

  return window;
}

module.exports = createBreakWindow;
