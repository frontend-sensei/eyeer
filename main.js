const { app } = require("electron");
const initApp = require("./main/initApp.js");

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(initApp);
