const express = require('express')
const app = express()
const port = 3000
// 托管静态资源-express.static()
app.use(express.static('public'))
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// 引入 ws，并且解构使用我们需要的 WebSocketServer        
const { WebSocketServer,WebSocket  } = require('ws');
// 创建WebSocketServer的实例wss，并指定端口号
const wss = new WebSocketServer({ port: 8080 });
// 通过实例wss进行监听
// wss.on('connection', function connection(ws) {
//   ws.on('error', console.error);
//   // 接收客户端发送过来的消息
//   ws.on('message', function message(data) {
//     console.log('客户端发送过来的消息', data.toString());
//   });
//   ws.send('服务端发送的消息');
// });
wss.on('connection', function connection(ws) {
  ws.on('error', console.error);
  // 客户端
  ws.on('message', function message(data) {
    console.log('received: %s', data);
    // 服务器广播
    // 广播到所有连接的WebSocket客户端，包括其自身。
    console.log('连接了多少个',wss.clients.size)
    wss.clients.forEach(function each(client) {
      // 判断当前连接服务端的所有客户端的ws。
      if (client!==ws && client.readyState === WebSocket.OPEN) {
        // binary表示数据是否是二进制。binary:false表示不是二进制
        client.send(data, { binary:false  });
      }
    });
  });
  ws.send('服务端发送的消息');
});