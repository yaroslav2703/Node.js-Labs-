const WebSocket = require('ws');


const PORT = 4000;
const HOST = 'localhost';

const broadcastSocket = new WebSocket.Server({
    port: PORT,
    host: HOST,
    path: '/'
});
let outMessageCount = 0;
broadcastSocket.on('connection', ws => {
    ws.on('pong', data => {
        console.log('working client detected: ' + data);
    });

   setInterval(() => {
        broadcastSocket.clients.forEach(client => {
            client.ping('ping');
        })
    }, 5000);

    setInterval(() => {
        broadcastSocket.clients.forEach(client => {
            client.send('11-03-server: ' + outMessageCount++);
        })
    }, 15000);
});