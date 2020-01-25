const net = require('net');
const config = require('./config').tcp;

///*
const client = new net.Socket();
let buffer = Buffer.alloc(4);
let counter = 0;

client.connect(config.port, config.host, () => {
    let interval = setInterval(() => {
        client.write((buffer.writeInt32LE(counter++, 0), buffer));
    }, 1000);

    setTimeout(() => {
        clearInterval(interval);
        client.end();
    }, 20000);
});

client.on('data', data => {
    console.log('From server: ' + data.readInt32LE());
});
