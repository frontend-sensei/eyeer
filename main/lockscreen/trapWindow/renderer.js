const eventData = {
  called: 0,
};
document.addEventListener("mousemove", () => {
  if (!eventData.called) {
    return (eventData.called = 1), false;
  }
  window.api.screenUnlocked();
});
