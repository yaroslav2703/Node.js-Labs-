const WebSocket = require('ws');
let messageInterval;
let requestCount = 1;
const socket = new WebSocket('ws:/localhost:4000');

socket.onmessage = message => {
    let newMessage ="";
    newMessage = "server: "+ JSON.parse(message.data).server + " message";
    console.log(newMessage);
};

messageInterval = setInterval(() => {
    let message = JSON.stringify({client: requestCount++});
    socket.send(message);

    let newMessage = "";
    newMessage ="client: " + JSON.parse( message).client;
    console.log(newMessage);
}, 3000);

setTimeout(() => {
    clearInterval(messageInterval);
    socket.close();
}, 25000);


