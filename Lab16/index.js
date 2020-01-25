const graphqlHTTP = require('./GraphQL/graphqQL');

const http = require('http');
const url = require('url');

const config = require('./config').http;
const schema = require('./schema');

const graphqlMiddleware = graphqlHTTP({ schema: schema });

const server = http.createServer(async (request, response) => {
    const urlPath = url.parse(request.url).pathname;

    if (urlPath === '/') {
        graphqlMiddleware(request, response);
    }
});

server.listen(config.port);

console.log(`Listening to http://${config.host}:${config.port}`);