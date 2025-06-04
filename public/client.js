const socket = io();
const nickname = localStorage.getItem("nickname");

if (!nickname) {
    window.location.href = "/";
}

const msgInput = document.getElementById("msg");
const messagesDiv = document.getElementById("messages");

function appendMessage(text, isSystem = false) {
    const div = document.createElement("div");
    div.textContent = text;
    div.className = isSystem ? "system-message" : "chat-message";
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

socket.emit("set-nickname", nickname, () => {});

socket.on("user-joined", (user) => {
    if (user !== nickname) appendMessage(`${user} entrou no chat.`, true);
});

socket.on("user-left", (user) => {
    appendMessage(`${user} saiu do chat.`, true);
});

socket.on("new-message", ({ sender, text }) => {
    appendMessage(`${sender}: ${text}`);
});

function sendMessage() {
    const msg = msgInput.value.trim();
    if (msg) {
        socket.emit("send-message", msg);
        msgInput.value = "";
    }
}
