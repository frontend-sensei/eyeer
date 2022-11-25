const electron = require("electron");
const path = require("path");
const fs = require("fs");

function parseDataFile(filePath, defaults) {
  return defaults;
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch (error) {
    return defaults;
  }
}

class Store {
  constructor(opts) {
    const userDataPath = (electron.app || electron.remote.app).getPath(
      "userData"
    );
    this.path = path.join(userDataPath, `${opts.configName}.json`);
    this.data = parseDataFile(this.path, opts.defaults);
    this.formatData();
  }

  setNextMessage() {
    const { size } = this.data.break.messages;
    if (this.data.break.currentMessageId === size - 1) {
      this.data.break.currentMessageId = 0;
      return;
    }
    this.data.break.currentMessageId += 1;
  }

  formatData() {
    if (!(this.data.break.messages instanceof Set)) {
      this.data.break.messages = this.objectToSet(this.data.break.messages);
    }
  }

  save() {
    try {
      this.data.break.messages = this.setToObject(this.data.break.messages);
      fs.writeFileSync(this.path, JSON.stringify(this.data));
      this.data.break.messages = this.objectToSet(this.data.break.messages);
    } catch (err) {
      setTimeout(() => {
        this.save();
      }, 5000);
    }
  }

  setToObject(set = new Set()) {
    const object = {};
    let index = 0;
    set.forEach((element) => {
      object[index] = element;
      index++;
    });
    return object;
  }

  objectToSet(object) {
    const set = new Set();
    for (const property in object) {
      set.add(object[property]);
    }
    return set;
  }
}

module.exports = new Store({
  configName: "user-preferences",
  defaults: {
    break: {
      interval: 5, // 25 mins
      duration: 30, // 5 mins
      longDuration: 60 * 30, // 30 mins
      currentMessageId: 0,
      messages: new Set([
        "Tightly close your eyes",
        "Take a walk",
        "Drop your eyes",
        "Get out into the fresh air",
        "Do exercises for the eyes",
      ]),
    },
    windows: {
      traps: [],
    },
    screenLocked: false,
  },
});
