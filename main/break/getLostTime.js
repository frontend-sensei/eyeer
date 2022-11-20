function getLostTime(breakData) {
  const lostTime = Date.now() - breakData.timestamp;
  const seconds = Math.floor(lostTime / 1000);
  return breakData.timeLost - seconds;
}

module.exports = getLostTime;
