const fs = require('fs');
const http = require('http');



const PORT = 5000;
const HOST = 'localhost';



let http405 = (req, res) =>
{
    console.log(`${req.method}: ${req.url}, HTTP status 405`);
    res.writeHead(405, {'Content-Type' : 'application/json; charset=utf-8'});
    res.end(`Error" : "${req.method}: ${req.url}, HTTP status 405"`);
}

let http_handler = (req, res)=>
{
    switch (req.method)
    {
        case 'GET': getHandler(req, res);  break;
        case 'POST': postHandler(req, res);  break;
        default: http405(req, res);  break;
    }
};

let getHandler = (req, res)=>
{

    if(req.url == '/upload')
    {
        console.log('Get Upload');
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(fs.readFileSync(__dirname + "/upload.html"));

    }
        else
    {
        console.log(`${req.method}: ${req.url}, HTTP status 404`);
        res.writeHead(404, {'Content-Type' : 'application/json; charset=utf-8'});
        res.end(`"error" : "${req.method}: ${req.url}, HTTP status 404"`);
    }

};

let postHandler = (req, res)=>
{
    let body = ' ';
    if (req.url == '/upload')
    {
            body = ' ';
            req.on('data', chunk => {
                body = chunk.toString();

            });
            req.on('end', () => {
                let fname = '';

                let rex = new RegExp('filename="(.*?)"', "gmi");
                while(re = rex.exec(body)){ fname=re[1];}

                res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
                res.write(`<h1>File Upload</h1>`);
                res.end("compileted");
                fs.writeFile(__dirname + '/copy' + fname, body, (err) =>
                {
                    if (err) throw err;
                    console.log('The file has been saved!');
                });
            });


    }
};


const server = http.createServer().listen(PORT, (v) =>
{
    console.log(`Listening on http://localhost:${PORT}`);
})
    .on('error', (e) => {console.log(`${URL} | error: ${e.code}`)})
    .on('request', http_handler);
