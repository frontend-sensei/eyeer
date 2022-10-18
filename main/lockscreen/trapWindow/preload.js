const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld(
  "api", {
    restartBreak: () => ipcRenderer.send("custom-unlock-screen"),
  }
);
