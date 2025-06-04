const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");

const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

app.use(express.static(path.join(__dirname, "public")));

const nicknames = new Set();

io.on("connection", (socket) => {
    let userNickname = null;

    socket.on("set-nickname", (nickname, callback) => {
        if (nicknames.has(nickname)) {
            callback({ success: false });
        } else {
            userNickname = nickname;
            nicknames.add(nickname);
            callback({ success: true });
            io.emit("user-joined", nickname);
        }
    });

    socket.on("send-message", (message) => {
        if (userNickname) {
            io.emit("new-message", {
                sender: userNickname,
                text: message,
            });
        }
    });

    socket.on("disconnect", () => {
        if (userNickname) {
            nicknames.delete(userNickname);
            io.emit("user-left", userNickname);
        }
    });
});

http.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
