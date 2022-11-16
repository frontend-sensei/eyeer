const { contextBridge, ipcRenderer } = require("electron");

const validChannels = ["main", "get-settings-data"];
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
  updateMessages: (messages) => ipcRenderer.send("update-messages", messages),
});
