var ws = require('nodejs-websocket')
console.log('开始建立连接...')
let userMap = new Map()
var server = ws.createServer(function (connect){
  connect.on('text', function (str) {
    console.log('收到的信息为: ' + str)
    let {name, time, message} = JSON.parse(str)
    userMap.set(name, connect)
    for(let user of userMap.keys()){
      let userConnect = userMap.get(user)
      userConnect && userConnect.sendText(str)
    }
  })
  connect.on('close', function (code, reason){
    console.log('关闭连接')
  })
  connect.on('error', function (code, reason){
    console.log('异常关闭' + code)
  })
}).listen(8001)
console.log('WebSocket建立完毕')