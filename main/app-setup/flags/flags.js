const { app } = require("electron");
const isLinux = require("../../utils/isLinux");

const setupFlags = () => {
  if (isLinux) {
    app.commandLine.appendSwitch("enable-transparent-visuals");
    app.commandLine.appendSwitch("disable-gpu");
  }
};

module.exports = setupFlags;
