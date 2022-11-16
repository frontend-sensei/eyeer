const { app, Menu, Tray } = require("electron");
const path = require("path");
const createSettingsWindow = require("../../settings/createSettingsWindow");

const setupTray = () => {
  app.whenReady().then(() => {
    const tray = new Tray(
      path.resolve(__dirname, "../../assets/braker-icon.png")
    );
    const contextMenu = Menu.buildFromTemplate([
      {
        label: "Settings",
        type: "normal",
        click: () => {
          createSettingsWindow();
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
    tray.setToolTip("This is my application.");
    tray.setContextMenu(contextMenu);
  });
};

module.exports = setupTray;
