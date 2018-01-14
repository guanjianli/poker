const WebSocket = require('ws');
 
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  var val;
  ws.on('message', function incoming(message) {
      val = Number(message)
    console.log('received: %s', message);
  });
  
  setInterval(function(){
      var result = (Math.random() * 100 >> 0) + val;
    ws.send('something send from server .' + result);
  }, 1000)
  
  
});