const { app, Menu, Tray } = require("electron");
const path = require("path");
const createSettingsWindow = require("../../settings/createSettingsWindow");
const handleBreakEnd = require("../../break/handleBreakEnd");
const setupBreak = require("../../break/setupBreak");

const setupTray = () => {
  const windows = {
    settings: null,
  };
  const brakerController = {
    isPaused: false,
  };
  const tray = new Tray(
    path.resolve(__dirname, "../../assets/braker-icon.png")
  );
  app.whenReady().then(buildTray);

  function buildTray() {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: brakerController.isPaused ? "Continue" : "Pause",
        type: "normal",
        click: () => {
          if (brakerController.isPaused) {
            setupBreak();
          } else {
            handleBreakEnd();
          }
          brakerController.isPaused = !brakerController.isPaused;
          buildTray();
        },
      },
      {
        label: "Settings",
        type: "normal",
        click: () => {
          if (windows.settings) {
            windows.settings.destroy();
          }
          windows.settings = createSettingsWindow();
        },
      },
      { type: "separator" },
      {
        label: "Quit Braker",
        type: "normal",
        click: () => {
          app.exit(0);
        },
      },
    ]);
    tray.setToolTip("Braker");
    tray.setContextMenu(contextMenu);
  }
};

module.exports = setupTray;
