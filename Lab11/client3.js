const WebSocket = require('ws');




let filesCount = 0;

const name = process.argv[2];
const jsonSocket = new WebSocket('ws://localhost:4000/');
jsonSocket.onopen = () => {
    let message = {client: name, timestamp: new Date()};
    jsonSocket.send(JSON.stringify(message));
};
jsonSocket.onmessage = message => {
    console.log(message.data);
};
