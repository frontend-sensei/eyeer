const { app } = require("electron");
const setupTray = require("./app-setup/tray/tray");
const setupFlags = require("./app-setup/flags/flags");
const setupBreaks = require("./break/setupBreaks");

async function initApp() {
  app.on("window-all-closed", (e) => e.preventDefault());
  setupFlags();
  setupTray();
  setupBreaks();
}

module.exports = initApp;
