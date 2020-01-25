const http = require("http");
const  fs = require("fs");
http.createServer(function(req,resp) {
    const filePathName = __dirname+'/image/image.jpg';
    switch(req.url){
        case '/html' :
                let html = fs.readFileSync(__dirname+"/index.html");
                resp.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8' });
                resp.end(html);
            break;
        case '/png' :
                let jpg = fs.readFileSync(filePathName);
                resp.writeHead(200, {'Content-Type': 'image/jpeg; charset=utf-8'});
                resp.end(jpg,'binary');
            break;
        case '/api/name':
            console.log(req.method);
            if(req.method === 'GET') {
                resp.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
                resp.end("pitsukha yaroslav anatolevich");
            } else {
                console.log('method is not a GET');
            }
            break;
        case '/xmlhttprequest':
            resp.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            let XmlHttp = fs.readFileSync(__dirname+"/xmlhttprequest.html");
            resp.end(XmlHttp);
            break;
        case '/fetch':
            resp.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            let fetchHttp = fs.readFileSync(__dirname+"/fetch.html");
            resp.end(fetchHttp);
            break;
        case '/jquery':
            resp.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            let jqueryHttp = fs.readFileSync(__dirname+"/jquery.html");
            resp.end(jqueryHttp);
            break;
        default:
                resp.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
                resp.end('404 page not found');
                console.log('404 page not found');



    }
}).listen(5000, "127.0.0.1", function(){
    console.log('server running at http://localhost:5000');
});
