const { app } = require("electron");
const initApp = require("./main/initApp.js");

app.whenReady().then(initApp);
