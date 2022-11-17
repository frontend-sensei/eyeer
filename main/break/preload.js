const { contextBridge, ipcRenderer } = require("electron");

const validChannels = ["main", "get-break-data", "screen-locking"];
contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (_event, ...args) => func(...args));
    }
  },
  breakEnd: () => ipcRenderer.send("break-end"),
  lockScreen: (timeLost) => ipcRenderer.send("custom-lock-screen", timeLost),
  sendTimeLost: (timeLost) => ipcRenderer.send("screen-locking", timeLost),
});
