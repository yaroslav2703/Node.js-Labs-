/*
const WebSocket = require('ws');
const RPCWebSocket = require('rpc-websockets').Server;
const fs = require('fs');

const PORT = 4000;
const HOST = 'localhost';




const eventSocket = new RPCWebSocket({
    port: PORT,
    host: HOST,
    path: '/'
});
eventSocket.event('A');
eventSocket.event('B');
eventSocket.event('C');

console.log('Type A, B or C to fire such events');
let input = process.stdin;
input.setEncoding('utf-8');
process.stdout.write('> ');
input.on('data', data => {
    eventSocket.emit(data.slice(0, -1));
    process.stdout.write('> ');
});



*/



const rpcWSS = require('rpc-websockets').Server;

let k = 0;

let server = new rpcWSS({
port: 4000,
host: 'localhost'
});

server.event('A');
server.event('B');
server.event('C');



process.stdin.setEncoding('utf-8');
process.stdin.on('readable', () => {
while((chunk = process.stdin.read()) != null) {

if (chunk.trim() == 'A') {
server.emit('A', 'A emit!!');
} else if (chunk.trim() == "B") {
server.emit('B', 'B emit!!');
} else if (chunk.trim() == "C") {
server.emit('C', 'C emit!!');
}
}
});