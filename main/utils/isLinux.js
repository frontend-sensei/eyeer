function isLinux() {
  return process.platform === "linux";
}

module.exports = isLinux();
