function isMac() {
  return process.platform === "darwin";
}

module.exports = isMac();
