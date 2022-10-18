const eventData = {
  called: 0
}
document.addEventListener('mousemove', () => {
  if (!eventData.called) {
    return eventData.called = 1, false
  }
  var today = new Date();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  console.log('called', time)

  window.api.restartBreak()
})
