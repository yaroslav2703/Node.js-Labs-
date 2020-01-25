const WebSocket = require('ws');
const fs = require('fs');


const socket = new WebSocket.Server({
    port: 4000,
    host: 'localhost',
    path: '/'
});


socket.on('connection', ws => {
    ws.on('message', message => {
        if (message === 'start') {
             sendFile(ws);
        }
    });
});

function sendFile(ws) {
    const duplex = WebSocket.createWebSocketStream(ws, {encoding: 'utf8'});
    let readFileStream = fs.createReadStream('./download-from/server.txt');
    readFileStream.pipe(duplex);
    ws.send('finish');
}

