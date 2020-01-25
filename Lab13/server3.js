const net = require('net');
const config = require('./config').tcp;





let clientCount = 0;
const server = net.createServer(socket => {
    let controlSum = 0;
    let clientId = clientCount++;

    console.log(`Client ${clientId} has been connected`);
    socket.on('data', data => {
        console.log(data.readInt32LE() + ` - received from client ${clientId}`);
        controlSum += data.readInt32LE();
    });

    let buffer = Buffer.alloc(4);
    let interval = setInterval(() => {
        console.log(`Control sum for a client ${clientId}: ${controlSum}`);
        buffer.writeInt32LE(controlSum, 0);
        socket.write(buffer);
    }, 5000);

    socket.on('close', () => clearInterval(interval));
});

server.listen(config.port, config.host, () => {
    console.log(`Listening to ${config.host}:${config.port}`);
});
