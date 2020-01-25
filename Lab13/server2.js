const net = require('net');
const config = require('./config').tcp;


let controlSum = 0;
const server = net.createServer(socket => {
    socket.on('data', data => {
        console.log(data, controlSum);
        controlSum += data.readInt32LE();
    });

    let buffer = Buffer.alloc(4);
    let interval = setInterval(() => {
        buffer.writeInt32LE(controlSum, 0);
        socket.write(buffer);
    }, 5000);

    socket.on('close', () => clearInterval(interval));
});

server.listen(config.port, config.host, () => {
    console.log(`Listening to ${config.host}:${config.port}`);
});

