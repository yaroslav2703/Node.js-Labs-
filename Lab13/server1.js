const net = require('net');
const config = require('./config').tcp;

const server = net.createServer(socket => {
    socket.on('data', data => {
    	 const responseMessage = "ECHO: " + data;
        console.log(data.toString());       
        socket.write(responseMessage);
    });

   
   
});

server.listen(config.port, config.host, () => {
    console.log(`Listening to ${config.host}:${config.port}`);
});
