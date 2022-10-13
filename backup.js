import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
const app = express();
import { get_Current_User, user_Disconnect, join_User } from "./users.js";

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  //for a new user joingin room
  console.log("connection");
  socket.on("joinRoom", ({ username, roomname }) => {
    // create user and
    const p_user = join_User(socket.id, username, roomname);
    console.log(socket.id, "=id");

    socket.join(p_user.room);

    // display a welcome message to the user who  have joined a room
    socket.emit("message", {
      userId: p_user.id,
      username: p_user.username,
      text: `Welcom ${p_user.username}`,
    });

    // display a joined room messsage to all other room users except that particular user
    socket.broadcast.to(p_user.room).emit("message", {
      userId: p_user.id,
      username: p_user.username,
      text: `${p_user.username} has joined the chat`,
    });
  });


  // user sending message
  socket.on("chat", (text) => {
    const p_user = get_Current_User(socket.id);
    console.log({p_user})

    io.to(p_user.room).emit("message", {

      userId: p_user.id,
      username: p_user.username,
      text: text,
    });
  });

  
  // when the user exists the room
  socket.on("disconnect", () => {
    //the user is deleted from array of users and a left room message displayed
    const p_user = user_Disconnect(socket.id);

    if (p_user) {
      io.to(p_user.room).emit("message", {
        userId: p_user.id,
        username: p_user.username,
        text: `${p_user.username} has left the room`,
      });
    }
  });
});

httpServer.listen(4000, () => {
  console.log("listening on *:4000");
});
