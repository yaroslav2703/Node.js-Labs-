var http=require('http');
var url=require('url');
var fs=require('fs');
var data=require('./database');
var readline = require('readline');

var db = new data.DB();
var ID = 0;

db.on('GET', (req, res)=>{
  res.end(JSON.stringify(db.select()));
});
db.on('POST', (req, res)=>{
  req.on('data', data=>{
    let r = JSON.parse(data);
    db.insert(r);
    res.end(JSON.stringify(r));
  });
});
db.on('PUT', (req, res)=>{
  req.on('data', data=>{
    let r = JSON.parse(data);
    res.end(JSON.stringify(db.update(r)));
  });
});
db.on('DELETE', (req, res)=>{
  res.end(JSON.stringify(db.delete(ID)));
});
db.on('COMMIT', ()=>{db.commit();});
db.on('STAT', (res)=>{
  res.end(JSON.stringify(db.getStatistics()));
});

var server = http.createServer(function(request, response){
  if(url.parse(request.url).pathname === '/'){
    let html = fs.readFileSync('client.html');
    response.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
    response.end(html);
  }else if(url.parse(request.url).pathname === '/api/db'){
    response.writeHead(200,{'Content-Type':'application/json; charset=utf-8'});
    if(typeof url.parse(request.url, true).query.id!='undefined')
      ID = parseInt(url.parse(request.url,true).query.id);
    db.emit(request.method, request, response);
  }else if(url.parse(request.url).pathname === '/api/ss'){
    response.writeHead(200,{'Content-Type':'application/json; charset=utf-8'});
    db.emit('STAT', response);
  }
}).listen(5000, function () {
  console.log('Server running at http://localhost:5000/');
  rl.prompt();
});


var rl = readline.createInterface({
 input:process.stdin,
 output: process.stdout,
 prompt: '>>>'
});
var timerId = 0;
var intervalId = 0;
var statId = 0;


rl.on('line', (line)=>{
  var oper = line.split(' ');
  var param = parseInt(oper[1], 10);
  switch(oper[0]){
    case 'sd':
    if(param){ 
      if(timerId!=0)
        clearTimeout(timerId);
      timerId = setTimeout(()=>{process.exit(0);}, param*1000);
    }else{  
      clearTimeout(timerId);      
      console.log('break exit process');
      timerId=0;
    }
    break;
    case 'sc':
    if(param){
      if(intervalId!=0){
        clearInterval(intervalId);
        intervalId=0;
        console.log('break commit');
      }
        clearInterval(intervalId);
      intervalId = setInterval(()=>{db.emit('COMMIT');}, param*1000);
       intervalId.unref();
      }else{  
        clearInterval(intervalId);
        intervalId=0;
        console.log('break commit');
      }
      break;
      case 'ss':
      if(param){
        if(statId!=0)
          clearTimeout(statId);
        db.active = true;
        db.comm=0;
        db.count=0;
        db.startStatisticTime = new Date().toString();
        var interval = setInterval(()=>{console.log('...statistics calculation...')}, 2000);
        interval.unref();
        statId = setTimeout(()=>{db.stopStatisticTime= new Date().toString(); console.log(`calculation stopped: ${db.stopStatisticTime - db.startStatisticTime}`);
          clearInterval(interval);  db.active = false; rl.prompt();}, param*1000);
        statId.unref();
      }else{        
        clearTimeout(statId);
        statId=0;
        db.active = false;
      }
      break;
      case 'exit':
      process.exit(0);
      break;
      default:
      console.log('error operation!');
      break;
    }
    rl.prompt();
  });