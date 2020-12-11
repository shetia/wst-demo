const app = require('express')()
app.all('*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});
const http = require('http').Server(app)
const io = require('socket.io')(http)
const port = 3001


// 在线用户
let onlineUserList = []
// 在线人数
let onlineUserCount = 0
app.get('/cleanUserList', (req, res) => {
  onlineUserList = []
  console.log('清空群聊成功!')
  res.send({
    msg: '清除成功'
  })
})
io.on('connection', function(socket){
  console.log('新连接已创建!')
  // 监听新用户加入
  socket.on('login', function(user){
    socket.socketId = user.id;
    let sign = onlineUserList.some(item => item.id === user.id)
    if (!sign) onlineUserList.push(user)
    onlineUserCount++
    this.broadcast.emit('login', {
      onlineUserList,
      onlineUserCount,
      msgUser: user
    })
    this.broadcast.emit('loginSuccess', {
      onlineUserList,
      sign: 1,
      user
    })
    console.log(user.name + '加入了群聊:' + user.group)
  })

  // 监听用户退出
  socket.on('disconnect', function () {
    let sign = false
    let user = {}
    for(let item of onlineUserList){
      if(item.id === socket.id){
        user = item
        sign = true
        break
      }
    }
    if(sign){
      onlineUserList = onlineUserList.filter(item => item.id !== user.id)
      onlineUserCount--
      // 向所有客户端广播用户退出
      this.broadcast.emit('logout', {
        onlineUserList,
        onlineUserCount,
        msgUser: user
      })
      console.log(user.name + '退出群聊')
    }
  })
  // 监听用户退出
  socket.on('exit', function (user) {
    if(user){
      onlineUserList = onlineUserList.filter(item => item.id !== user.id)
      onlineUserCount--
      // 向所有客户端广播用户退出
      this.broadcast.emit('logout', {
        onlineUserList,
        onlineUserCount,
        msgUser: user
      })
      console.log(user.name + '退出群聊')
    }
  })

  // 监听用户发布聊天内容
  socket.on('message', function (data){
    console.log(data, '服务端接收')
    data.onlineUserList = onlineUserList
    this.broadcast.emit('message', data)
    console.log(`${data.user.name}说了: ${data.msg}`)
  })
})

http.listen(port, () => {
  console.log('listening: http://localhost:' + port)
})