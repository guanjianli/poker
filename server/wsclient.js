const WebSocket = require('ws');
 
const ws = new WebSocket('wss://www.liguanjian.com');
 
ws.on('open', function open() {
  ws.send(process.argv[2]);
});
 
ws.on('message', function incoming(data) {
  console.log(data);
});