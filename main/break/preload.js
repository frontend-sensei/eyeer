const {contextBridge, ipcRenderer} = require('electron')

const validChannels = ["main", 'get-break-data'];
contextBridge.exposeInMainWorld(
  "api", {
    send: (channel, data) => {
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    receive: (channel, func) => {
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    breakEnd: () => ipcRenderer.send('break-end'),
    lockScreen: () => ipcRenderer.send('lock-screen')
  }
);
