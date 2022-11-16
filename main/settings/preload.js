const { contextBridge, ipcRenderer } = require("electron");

const validChannels = ["get-settings-data"];
contextBridge.exposeInMainWorld("api", {
  receive: (channel, func) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (_event, ...args) => func(...args));
    }
  },
  updateMessages: (messages) => ipcRenderer.send("update-messages", messages),
});
