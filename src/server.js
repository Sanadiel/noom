import http from "http";
import SocketIO from "socket.io";
import express from "express";
import { timeStamp } from "console";
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

const app = express();

// app.set("view engine", "pug");
// app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.sendFile(__dirname + '/public/views/index.html'));
app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
  socket["nickname"] = "otherGuy";

  socket.on("join_room", (roomName) => {
    socket.join(roomName);
    socket.to(roomName).emit("welcome", `${socket.nickname}`);
  });
  socket.on("offer", (offer, roomName) => {
    socket.to(roomName).emit("offer", offer);
  });
  socket.on("answer", (answer, roomName) => {
    socket.to(roomName).emit("answer", answer);
  });
  socket.on("ice", (ice, roomName) => {
    socket.to(roomName).emit("ice", ice);
  });

  // socket.on("enter_room", (roomName, done) => {
  //  // socket.join(roomName);
  //   done();
  //   socket.to(roomName).emit("welcome", socket.nickname);
  // });
  socket.on("new_message", (msg, room, done) => {
    // socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
    socket.to(room).emit("new_message", `${socket.nickname}`, `${msg}`, `${moment().format(`HH:mm`)}`);
    console.log(`${socket.nickname}`, `${msg}`, `${moment().format(`HH:mm`)}`);
    done();
  });
  socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);
