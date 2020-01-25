const udpConfig = require('./config').udp;
const dgram = require('dgram');
const message = 'Message to udp server\0';
const client = dgram.createSocket('udp4');

client.send(message, 0, message.length, udpConfig.port, udpConfig.host, err => {
    if (err) {
        throw err;
    }
    console.log(`The message: "${message}" has been sent`);
});

client.on('message', message => {
    console.log(`Message from server: ${message}`);
    client.close();
});