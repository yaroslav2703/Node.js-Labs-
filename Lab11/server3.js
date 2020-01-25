const WebSocket = require('ws');



const PORT = 4000;
const HOST = 'localhost';

const jsonSocket = new WebSocket.Server({
    port: PORT,
    host: HOST,
    path: '/'
});
let messageCount = 0;
jsonSocket.on('connection', ws => {
    ws.on('message', message => {
        message = JSON.parse(message);
        message.server = messageCount++;
        ws.send(JSON.stringify(message));
    });
});
