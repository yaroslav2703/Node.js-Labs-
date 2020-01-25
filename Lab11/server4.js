
const RPCWebSocket = require('rpc-websockets').Server;


const PORT = 4000;
const HOST = 'localhost';



const socket = new RPCWebSocket({
    port: PORT,
    host: HOST,
    path: '/'
});

socket.setAuth(credentials => credentials.login === 'admin' && credentials.password === 'admin');
socket.register('sum', params => params.reduce((a, b) => a + b, 0)).public();
socket.register('mul', params => params.reduce((a, b) => a * b, 1)).public();
socket.register('square', square).public();
socket.register('fib', fib).protected();
socket.register('fact', fact).protected();

function square(args) {
    if (args.length === 1) {
        return Math.PI * Math.pow(args[0], 2);
    } else if (args.length === 2) {
        return args[0] * args[1];
    } else {
        return 0;
    }
}
function fib(n) {
    let currentSize = 0;
    let numbers = [];
    let curr = 1;
    let next = 1;
    while (currentSize < n) {
        numbers.push(curr + next);
        next += curr;
        curr = next - curr;
        currentSize++;
    }
    return numbers;
}
function fact(n) {
    return n === 1 ? 1 : n * fact(n - 1);
}
 
