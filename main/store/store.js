const electron = require('electron');
const path = require('path');
const fs = require('fs');

function parseDataFile(filePath, defaults) {
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch (error) {
    return defaults;
  }
}

class Store {
  constructor(opts) {
    const userDataPath = (electron.app || electron.remote.app).getPath('userData');
    this.path = path.join(userDataPath, `${opts.configName}.json`);
    this.data = parseDataFile(this.path, opts.defaults);
    return this.data
  }

  set(key, val) {
    this.data[key] = val;
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }

  remove(key) {
    delete this.data[key];
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }
}

module.exports = new Store({
  configName: 'user-preferences',
  defaults: {
    break: {
      interval: 10,
      duration: 10,
      longDuration: 60 * 30, // 30 mins
      currentMessageId: 0,
      messages: new Set([
        'Tightly close your eyes',
        'Take a walk',
        'Drop your eyes',
        'Get out into the fresh air',
        'Do exercises for the eyes',
      ])
    },
    windows: {
      trap: null
    },
    screenLocked: false,
  },
});
