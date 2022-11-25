require('dotenv').config({})
const express = require('express');
const app = express();
const port = 3000
const Sequelize = require('sequelize');
const socket = require('socket.io')
const mainRoutes = require('./src/routes')

const http = require('http').Server(app)
const io = socket(http)
const Op = Sequelize.Op

app.use(express.urlencoded({extended:false}));
app.use('/', mainRoutes);
app.use((req, res, next) => {
    req.Op = Op
    res.io = io
    next()
})

app.listen(port, () => {
    console.log(`server run on port : ${port}`);
})
