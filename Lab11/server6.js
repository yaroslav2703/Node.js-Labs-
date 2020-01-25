
const RPCWebSocket = require('rpc-websockets').Server;



let server = new RPCWebSocket({
port: 4000,
host: 'localhost'
});


server.register('A', (params) => {
console.log('Notify A: ', params)
}).public();

server.register('B', (params) => {
console.log('Notify B: ', params)
}).public();

server.register('C', (params) => {
console.log('Notify C: ', params)
}).public();