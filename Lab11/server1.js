const WebSocket = require('ws');
const fs = require('fs');

const PORT = 4000;
const HOST = 'localhost';

const socket = new WebSocket.Server({
    port: PORT,
    host: HOST,
    path: '/'
});
let filesCount = 0;

socket.on('connection', ws => {
    ws.on('message', message => {
        if (message === 'start') {
            saveFile(ws);
           // sendFile(ws);
        }
    });
});
function saveFile(ws) {
    const duplex = WebSocket.createWebSocketStream(ws, {encoding: 'utf8'});
    let writeFileStream = fs.createWriteStream(`./uploads-to/file${filesCount++}.txt`);
    duplex.pipe(writeFileStream);
}
function sendFile(ws) {
    ws.send('start');
    const duplex = WebSocket.createWebSocketStream(ws, {encoding: 'utf8'});
    let readFileStream = fs.createReadStream('./uploads-to/server-test.txt');
    readFileStream.pipe(duplex);
}



