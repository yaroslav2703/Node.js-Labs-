const udpConfig = require('./config').udp;
const dgram = require('dgram');
const server = dgram.createSocket('udp4');

server.on('listening', () => {
    let address = server.address();
    console.log(`Listening to ${address.address}:${address.port}`);
});

server.on('message', (message, remote) => {
    const responseMessage = "ECHO: " + message;
    server.send(responseMessage, 0, responseMessage.length, remote.port, remote.address, err => {
        if (err) {
            throw err;
        }
        console.log(`The message: "${responseMessage}" has been sent`);
    });
});

server.bind(udpConfig.port, udpConfig.host);
