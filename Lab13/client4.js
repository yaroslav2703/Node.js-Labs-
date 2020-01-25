const net = require('net');
const config = require('./config').tcp;






const counter = Number(process.argv[2]);
const port = Number(process.argv[3]);
const buffer = Buffer.alloc(4);
const client = new net.Socket();

client.connect(port, config.host, () => {
    setInterval(() => {
        client.write((buffer.writeInt32LE(counter, 0), buffer));
    }, 1000);
}).on('data', data => {
    console.log('From server: ' + data);
});
 
