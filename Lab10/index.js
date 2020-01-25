const http = require('http');
let fs = require('fs');
const WebSocket = require('ws');

const HTTP_PORT = 3000;
const WS_PORT = 4000;
const BROADCAST_WS_PORT = 5000;

const HOST = 'localhost';
const WS_ENDPOINT_PATH = '/';


const socket = new WebSocket.Server({
    port: WS_PORT,
    host: HOST,
    path: WS_ENDPOINT_PATH
});
const broadcastSocket = new WebSocket.Server({
    port: BROADCAST_WS_PORT,
    host: HOST,
    path: WS_ENDPOINT_PATH
});

let clientMessagesCount = 1;
let lastClientMessageNumber = -1;
let broadcastClientsCount = 0;

socket.on('connection', ws => {
    ws.on('message', message => {
        console.log('Message: ' + message);
        lastClientMessageNumber = JSON.parse(message).client;
    });

  let inter =  setInterval(() => {
        ws.send(JSON.stringify({server: `${lastClientMessageNumber}->${clientMessagesCount++}`}));
    }, 5000);

     setTimeout(() => {
                    clearInterval(inter); 
                      clientMessagesCount=1;               
                }, 25000);
});

broadcastSocket.on('connection', ws => {
    ws.on('message', () => {
        broadcastClientsCount++;
        if (broadcastClientsCount === 3) {
            broadcastSocket.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send('Hello from server!');
                }
            });
        }
    });

  setTimeout(() => {
                   
                      broadcastClientsCount=0;               
                }, 10000);

});



let GET_handler = (req, res)=>
{
    switch (req.url)
    {
        case '/start':
            res.end(fs.readFileSync(__dirname + '/public/start-form.html'));
            break;
        default: HTTP404(req, res);  break;
    }
};

let HTTP404 = (req, res)=>
{
    res.statusCode = 404;
    res.statusMessage = 'Resourse not found';
    res.end('Resourse not found');
};


server = http.createServer(function (request, response) {

    switch (request.method)
    {
        case 'GET': GET_handler(request, response);  break;
        default: HTTP404(request, response);  break;
    }

}).listen(HTTP_PORT, () => {
    const URL = `http://${HOST}:${HTTP_PORT}/start`;
    console.log('Listening on ' + URL);
});

