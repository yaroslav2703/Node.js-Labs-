const WebSocket = require('ws');
const fs = require('fs');

const socket = new WebSocket('ws://localhost:4000/');

socket.onopen = () => {
    socket.send('start');
};

socket.onmessage = message => {
    if (message.data === 'finish') {
        saveFile(socket);
    }
};


function saveFile(ws) {
    const duplex = WebSocket.createWebSocketStream(ws, {encoding: 'utf8'});
    let writeFileStream = fs.createWriteStream(`./download-to/server.txt`);
    duplex.pipe(writeFileStream);
}

