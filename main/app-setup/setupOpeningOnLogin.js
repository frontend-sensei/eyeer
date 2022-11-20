const { app } = require("electron");

function setupOpeningOnLogin() {
  app.setLoginItemSettings({
    openAtLogin: true,
  });
}

module.exports = setupOpeningOnLogin;
