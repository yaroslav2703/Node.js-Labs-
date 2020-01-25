
 const rpcWSC = WebSocket = require('rpc-websockets').Client;

let ws = new rpcWSC('ws://localhost:4000');

ws.on('open', () => {
ws.subscribe('A');
 ws.subscribe('B');
 ws.subscribe('C');

ws.on('A', (p) => {
console.log('A: ', p);
});
 ws.on('B', (p) => {
console.log('B', p);
});

 ws.on('C', (p) => {
 console.log('C', p);
});
});
 
