const net = require('net');
const config = require('./config').tcp;

const client = new net.Socket();

client.connect(config.port, config.host, () => {
   
        client.write(`Message to tcp server`);
});


client.on('data', data => {
    console.log(`Message from server: ${data.toString()}`);
   
});