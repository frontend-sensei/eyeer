const { app } = require("electron");
const setupTray = require("./app-setup/tray/tray");
const setupFlags = require("./app-setup/flags/flags");
const setupBreaks = require("./break/setupBreaks");
const setupOpeningOnLogin = require("./app-setup/setupOpeningOnLogin");

async function initApp() {
  app.on("window-all-closed", (e) => e.preventDefault());
  setupFlags();
  setupTray();
  setupBreaks();
  setupOpeningOnLogin();
}

module.exports = initApp;
