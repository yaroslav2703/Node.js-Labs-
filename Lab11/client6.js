

const rpcWSC = WebSocket = require('rpc-websockets').Client;
let ws = new rpcWSC('ws://localhost:4000');

let k = 0;
ws.on('open', () => {
process.stdin.setEncoding('utf-8');
process.stdin.on('readable', () => {
while ((chunk = process.stdin.read()) != null) {

if (chunk.trim() == 'A') {
setTimeout(() => {
ws.notify('A', {n: ++k, x:'A', y:2});
}, 10);
} else if (chunk.trim() == "B") {
setTimeout(() => {
ws.notify('B', {n: ++k, x:'B', y:2});
}, 10);
} else if (chunk.trim() == "C") {
setTimeout(() => {
ws.notify('B', {n: ++k, x:'C', y:2});
}, 10);
}
}
});

})
