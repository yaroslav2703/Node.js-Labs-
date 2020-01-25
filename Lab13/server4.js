const net = require('net');
const config = require('./config').tcp;







let clientCount = 0;
function clientHandler(socket, port) {
    let clientId = clientCount++;

    console.log(`Client ${clientId} has been connected to the port of ${port}`);
    socket.on('data', data => {
        console.log(data.readInt32LE() + ` - received from client ${clientId}`);
        socket.write(`ECHO: ${data.readInt32LE()}`);
    });
}

net.createServer(socket => clientHandler(socket, 40000)).listen(40000, config.host, () => {
    console.log(`Listening to ${config.host}:40000`);
});

net.createServer(socket => clientHandler(socket, 50000)).listen(50000, config.host, () => {
    console.log(`Listening to ${config.host}:50000`);
});

