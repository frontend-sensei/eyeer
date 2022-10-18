const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld(
  "api", {
    screenUnlocked: () => ipcRenderer.send("custom-unlock-screen"),
  }
);
