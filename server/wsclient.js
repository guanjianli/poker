const WebSocket = require('ws');
 
const ws = new WebSocket('ws://127.0.0.1:8080');
 
ws.on('open', function open() {
  ws.send(process.argv[2]);
});
 
ws.on('message', function incoming(data) {
  console.log(data);
});