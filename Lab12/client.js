const RPCWebSocket = require('rpc-websockets').Client;

const socket = new RPCWebSocket('ws://localhost:7000');
socket.on('open', () => {
    socket.subscribe('changed');

    socket.on('changed', () => {
        console.log('student-list.json file was changed');
    });
});
