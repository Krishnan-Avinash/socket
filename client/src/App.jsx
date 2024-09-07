import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

import { Button, Container, TextField, Typography, Stack } from "@mui/material";

const App = () => {
  const socket = useMemo(() => io("http://localhost:3030"), []);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("connected with ID::", socket.id);
    });

    socket.on("welcome", (s) => {
      console.log(`User with ID:: ${socket.id}`, "\n", s);
    });

    socket.on("receive-message", (data) => {
      console.log("RECEIVE-MESSAGE EMIT::::", data);
      setMessages((messages) => [...messages, data.message]);
    });
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };

  return (
    <Container>
      <Typography>Welcome to SOCKET.IO</Typography>
      <Typography>Current ID:::::{socketId}</Typography>
      <form onSubmit={joinRoomHandler}>
        <h5>Join Room</h5>
        <TextField
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          id="outlined-basic"
          label="Room Name"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Join
        </Button>
      </form>
      <form onSubmit={submitHandler}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="outlined-basic"
          label="Message"
          variant="outlined"
        />
        <TextField
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          id="outlined-basic"
          label="Room"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>
      <Stack>
        {messages.map((item, index) => (
          <Typography key={index}>{item}</Typography>
        ))}
      </Stack>
    </Container>
  );
};

export default App;
