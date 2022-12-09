// const express = require('express');
// const cors = require('cors')
// const app = express();
// const mongoose = require('mongoose')
// const socket = require('socket.io')
// const authRoutes = require('./routes/authRoutes')
// const messageRoutes = require('./routes/messageRoutes')
// require('dotenv').config({})

// app.use(cors());
// app.use(express.json());

// mongoose.set('strictQuery', true)

// mongoose.connect(process.env.MONGO_URL)
// .then(() => {
//     console.log("DB success connect");
// })
// .catch((error) => {
//     console.log(error.message);
// })



// app.use("/api/auth", authRoutes);
// app.use("api/messages", messageRoutes);

// const server = app.listen(process.env.PORT, () => {
//     console.log(`server run on port : ${process.env.PORT}`);
// })
// const io = socket(server, {
//     cors: {
//         origin: "http://localhost:3000",
//         credentials: true,
//     }
// })
// global.onlineUsers = new Map();
// io.on("connection", (socket) => {
//     global.chatSocket = socket;
//     socket.on("add-user", (userId) => {
//         onlineUsers.set(userId, socket.id);
//     });
//     socket.on("send-msg", (data) => {
//         const sendUserSocket = onlineUsers.get(data.to);
//         if (sendUserSocket) {
//             socket.to(sendUserSocket).emit("msg-recieve", data.msg)
//         }
//     })
// })

const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const socket = require("socket.io");
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
require("dotenv").config();

app.use(cors());
app.use(express.json());

mongoose.set('strictQuery', true)
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
})
.then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/testapi", (req, res) => {
    res.send({msg: "api its work"})
})
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
