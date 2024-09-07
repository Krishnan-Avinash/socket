import express from "express";

import { Server } from "socket.io";
import { createServer } from "http";

import cors from "cors";

const port = 3030;
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

io.on("connection", (socket) => {
  console.log("User Connected::::", socket.id);
  socket.emit("welcome", "Welcome to my server huihuihui");
  // socket.broadcast.emit("welcome", `${socket.id} has joined the server`);
  socket.on("message", (data) => {
    console.log("DATA::::", data);
    io.to(data.room).emit("receive-message", data);
  });
  socket.on("disconnect", () => {
    console.log(`User with id: ${socket.id} has been DISCONNECTED`);
  });
  socket.on("join-room", (room) => {
    socket.join(room);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
