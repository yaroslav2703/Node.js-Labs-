const fs = require('fs');
var url = require("url");
const http = require('http');
const xm12js = require('xml2js');
const xmlbuilder = require('xmlbuilder');
let mp = require('multiparty');


const PORT = 5000;
const HOST = 'localhost';

let HTTP404 = (req, res) =>
{
    console.log(`${req.method}: ${req.url}, HTTP status 404`);
    res.writeHead(404, {'Content-Type' : 'application/json; charset=utf-8'});
    res.end(`"error" : "${req.method}: ${req.url}, HTTP status 404"`);
}

let HTTP405 = (req, res) =>
{
    console.log(`${req.method}: ${req.url}, HTTP status 405`);
    res.writeHead(405, {'Content-Type' : 'application/json; charset=utf-8'});
    res.end(`Error" : "${req.method}: ${req.url}, HTTP status 405"`);
}

let http_handler = (req, res)=>
{
  switch (req.method)
  {
    case 'GET': GET_handler(req, res);  break;
    case 'POST': POST_handler(req, res);  break;
    default: HTTP405(req, res);  break;
  }
};

let GET_handler = (req, res)=>
{
  let Url_forGet = req.url;
  let Path_forGet = url.parse(req.url, true).pathname;
  console.log(Path_forGet + ' | ' + Url_forGet);
  console.log('URL: /'+ GetUrlPart(Path_forGet, 1));
  switch ('/'+GetUrlPart(Path_forGet, 1))
  {
    case '/connection':
      let set = parseInt(url.parse(req.url, true).query.set);
      if (Number.isInteger(set))
      {
          console.log('Set connection');
          res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
          server.KeepAliveTimeout = set;
          res.end(`KeepAliveTimeout = ${server.KeepAliveTimeout}`);
      }
      else
      {
        console.log('Get connection');
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(`KeepAliveTimeout = ${server.KeepAliveTimeout}`);
      }
    break;
    case '/close':
      res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
      res.end(`<h1>Server will be closed after 10 sec.</h1>`);
      console.log("Server will be closed after 10 sec");
      setTimeout(() => server.close(() => console.log("Server closed")), 1000);
    break;
    case '/headers':
      res.setHeader("X-Type", "Created");
      console.log('Get headers');
      res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
      for(key in req.headers)
        res.write(`<h3>request: ${key}: ${req.headers[key]}</h3>`);
      for(key in res.getHeaders())
        res.write(`<h3>response: ${key}: ${res.getHeaders[key]}</h3>`);
      res.end();
    break;
    case '/socket':

        console.log('Get socket');
        res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
        res.write(`<h3>LocalAddress = ${req.socket.localAddress}</h3>`);
        res.write(`<h3>LocalPort = ${req.socket.localPort}</h3>`);
        res.write(`<h3>RemoteAddress = ${req.socket.remoteAddress}</h3>`);
        res.write(`<h3>RemoteFamily = ${req.socket.remoteFamily}</h3>`);
        res.write(`<h3>RemotePort = ${req.socket.remotePort}</h3>`);
        res.end();
    break;
    case '/req-data':
      let data = [];
      req.on('data', chunk => data.push(chunk));
      req.on('end', () =>
      {
        console.log(data);
        res.end();
      });
    break;
    case '/req-status':
      res.statusCode = url.parse(req.url, true).query.code;
      res.statusMessage = url.parse(req.url, true).query.mess;
      res.writeHead(res.statusCode, res.statusMessage);
      res.end();
    break;
    case '/formparameter':
      res.end(fs.readFileSync(__dirname + '/files/Formparameter.html'));
    break;
    case '/parameter':
      let x = 0, y = 0;
      if(!Url_forGet.toString().includes('?'))
      {
        x = Number(GetUrlPart(Path_forGet, 2));
        y = Number(GetUrlPart(Path_forGet, 3));
      }
      else
      {
        let baseURL = 'http://' + req.headers.host + '/';
        x = Number(url.parse(req.url, true).query.x);
        y = Number(url.parse(req.url, true).query.y);
      }
      parameterHandler(x, y, res);
    break;
    case '/upload':
      console.log('Get Upload');
      res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
      res.end(fs.readFileSync(__dirname + "/Update.html"));
    break;
    case '/files':
      let fname = GetUrlPart(Path_forGet, 2);
      console.log('file|'+fname+'|');
      if (fname==' ')
      {
        console.log('Get files count');
        fs.readdir( __dirname + '/files', (err, files) =>
        {
          if (err) res.statusCode = 500;
          res.setHeader('X-static-files-count', files.length);
          res.end();
        });
      }
      else
      {
        console.log(__dirname + '/files/' + fname);
        if(!fs.existsSync(__dirname + '/files/' +  fname))
          HTTP404(req, res);
        else
        {
          res.writeHead(200, {'Content-Type' : 'text/plain; charset=utf-8'});
          res.end(fs.readFileSync(__dirname + '/files/' +  fname));
        }
      }
    break;
    default: HTTP404(req, res);  break;
  }
};

let POST_handler = (req, res)=>
{
  let body = ' ';
  switch (req.url)
  {
    case '/formparameter':
        req.on('data',(data) =>{
            body = data.toString().replace(new RegExp('&','g'),', ');
            console.log(body);
            res.end(body);
        });
    break;
    case '/xml':
        req.on('data',(data)=>{
            let x = 0;
            let m = '';
            let id;
            xm12js.parseString(data,function (err, result){
                result.request.x.map((e,i)=>{
                    x = x + Number(e.$.value);
                })
                result.request.m.map((e,i)=>{
                    m = m + e.$.value;
                })
                id = result.request.$.id;
            })
            let xml = xmlbuilder.create('response').att('id',33).att('request',id)
            xml.ele('sum',{element:'x',result:x});
            xml.ele('concat',{element:'m',result:m});
            res.end(xml.toString({pretty:true}));
        });
    break;
    case '/json':
      console.log("Post JSON");
        req.on('data',(data)=>{
            body = JSON.parse(data);
            let answer = {
                comment: 'Response.'+ body.comment.split('.')[1],
                x_plus_y: body.x + body.y,
                Concatination_s_o: body.s +':'+ body.o.surname+','+body.o.name,
                Length_m: body.m.length
            };
            res.end(JSON.stringify(answer));
        });

        break;
    case '/upload':
      body = ' ';
      req.on('data', chunk => {
            body = chunk;
            console.log('BODY: ' + body);
      });
      req.on('end', async () => {
        let fname = '';

        let rex = new RegExp('filename="(.*?)"', "gmi");
        while(re = rex.exec(body)){ fname=re[1];}

        res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
        res.write(`<h1>File Upload</h1>`);
        res.end(body);
        fs.writeFile(__dirname + '/files/copy' + fname, body, (err) =>
        {
            if (err) throw err;
            console.log('The file has been saved!');
        });
    });
    break;
    default: HTTP404(req, res);  break;
  }
};

function GetUrlParam(url_parm, baseURL, name_parm)
{
  let curr_url = new URL(url_parm, baseURL);
  let serch_parm = curr_url.searchParams;
  if (serch_parm.has(name_parm))
    return curr_url.searchParams.get(name_parm);
  else return null;
}

function GetUrlPart(url_path, indx)
{
    let i = 0;
    let curr_url = ' ';
    i--;
    decodeURI(url_path).split('/').forEach(e =>
    {
      i++;
      console.log(i+' ' + e);
      if(i == indx)
      {
        curr_url = e;
        return;
      }
    });
    return curr_url?curr_url:' ';
}

function parameterHandler(x, y, res)
{
    if (Number.isInteger(x) && Number.isInteger(y))
    {
        res.end(JSON.stringify
          ({
            add: x + y,
            sub: x - y,
            mult: x * y,
            div: x / y
        }));
    }
    else
        res.end('Wrong data type');
}


const server = http.createServer().listen(PORT, (v) =>
{
  console.log(`Listening on http://localhost:${PORT}`);
})
.on('error', (e) => {console.log(`${URL} | error: ${e.code}`)})
.on('request', http_handler);
