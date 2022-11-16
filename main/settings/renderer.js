window.api.receive("get-settings-data", (data) => initRenderer(data));

const settings = {};
function initRenderer(data) {
  settings.messages = data.messages;
  initAddMessageButton();
  initMessages(data);
  initSaveButton();
}

function initMessages(data) {
  const messagesNode = document.getElementById("messages");
  let messagesHTML = "";
  data.messages.forEach((message) => {
    messagesHTML += `
    <div class="message-box">
      ${getMessageBoxInnerHTML(message)}
    </div>
    `;
  });
  messagesNode.innerHTML = messagesHTML;

  [...document.querySelectorAll(".message-delete")].forEach((button) => {
    button.addEventListener("click", handleDeleteMessage);
  });
}

function initSaveButton() {
  const messagesNode = document.getElementById("messages");
  const saveButton = document.createElement("button");
  saveButton.className = "save-button";
  saveButton.innerText = "Save";
  const saveButtonNode = messagesNode.appendChild(saveButton);
  saveButtonNode.addEventListener("click", saveButtonHandler);

  function saveButtonHandler() {
    const messages = new Set();
    const messageBoxes = [...document.querySelectorAll(".message-box")];
    messageBoxes.forEach((messageBox) => {
      const message = messageBox.querySelector("input").value;
      messages.add(message);
    });
    window.api.updateMessages(messages);
  }
}

function initAddMessageButton() {
  const addMessageButton = document.getElementById("addMessageButton");
  addMessageButton.addEventListener("click", handleAddMessage);
}

function handleAddMessage() {
  const addMessageInput = document.getElementById("addMessageInput");
  const message = addMessageInput.value;
  if (!message) {
    return;
  }
  const messagesNode = document.getElementById("messages");
  const messageNode = document.createElement("div");
  messageNode.className = "message-box";
  messageNode.innerHTML = getMessageBoxInnerHTML(message);

  (() => messagesNode.prepend(messageNode))();
  const createdMessageNode = document.querySelector(".message-box");
  const button = createdMessageNode.querySelector("button");
  button.addEventListener("click", handleDeleteMessage);

  addMessageInput.value = "";
}

function handleDeleteMessage(event) {
  const button = event.target;
  const input = button.previousElementSibling;
  const message = input.value;
  settings.messages.delete(message);
  button.parentNode.remove();
}

function getMessageBoxInnerHTML(message) {
  return `
  <input type="text" class="message-field" value="${message}" />
  <button class="message-delete">X</button>
  `;
}
