import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
const app = express();

app.get("/", (req, res) => {
  res.send("hello world");
});

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log("user private room ", userData._id);
    socket.emit("connected");
  });

  socket.on("typing", (data) => {
    console.log(data);
    socket.to(data.reciever).emit("typing", data);
  });

  socket.on("stop typing", (data) =>
    socket.to(data.reciever).emit("stop typing", data)
  );

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.to(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.on("disconnect", () => {
    console.log("000000000");
  });
});

httpServer.listen(5000, () => {
  console.log("listening on *:5000");
});
