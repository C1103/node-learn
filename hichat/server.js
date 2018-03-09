var express = require('express')
var app = express()

var server = require('http').createServer(app)
var io = require('socket.io').listen(server)
var users = []
// 静态服务器
app.use('/', express.static(__dirname + '/www'))
server.listen(3000);
// socket 是实时RealTime核心，
// http协议是无法常连接，一旦送达，立马断开
// ajax(长期轮询) 提交，再提交get/post
// iframe
io.sockets.on('connection', function(socket) {
  socket.on('login', function(nickname) {
    console.log(nickname)
    if (users.indexOf(nickname) > -1) {
      socket.emit('neckExisted')
    } else {
      socket.nickname = nickname
      users.push(nickname)
      socket.emit('loginSuccess')
      io.sockets.emit('system', nickname, users.length)
    }
  })
})