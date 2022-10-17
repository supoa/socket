import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
const app = express();

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

  // socket.on("join chat", (chat) => {
  //   socket.join(chat);
  //   console.log("User Joined Room: " + chat);
  // });

  socket.on("typing", (data) => {
    console.log(data);
    socket.to(data.reciever).emit("typing", data);
  });

  socket.on("stop typing", (data) =>
    socket.to(data.reciever).emit("stop typing", data)
  );

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    // socket.emit("message recieved", newMessageRecieved);
    // io.emit("message recieved", newMessageRecieved);

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.to(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  // socket.off("setup", () => {
  //   console.log("USER DISCONNECTED");
  //   socket.leave(userData._id);
  // });

  socket.on("disconnect", () => {
    console.log("000000000");
  });
});

httpServer.listen(5000, () => {
  console.log("listening on *:5000");
});
