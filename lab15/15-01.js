const MongoClient = require('mongodb').MongoClient;

//const uri = "mongodb+srv://student:fitfit@cluster0-1urly.mongodb.net/admin?retryWrites=true&w=majority";

const uri = "mongodb+srv://user:1234@cluster0-pr8mn.mongodb.net/admin?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var http = require('http');
var fs = require('fs');

let GET_handler = (req, res) => {
    var parseUrl = require('url').parse(req.url);

    if (parseUrl.pathname.includes("/api/")) {
        var table = parseUrl.pathname.replace("/api/", "");
        console.log("table: " + table);

        client.connect(err => {
            if (err) {
                console.log("MongoDB: error connection");
                res.end(JSON.stringify({
                    code: 2,
                    message: "MongoDB: error connection"
                }));
            } else {
                console.log("MongoDB: connect successful");

                const collection = client.db("BSTU").collection(table, (err, collection) => {
                    if (err) {
                        console.log("error: ", err);
                        res.end(JSON.stringify({
                            code: -1,
                            message: `Collection error: ${err}`
                        }));
                    } else {
                        collection.find({}).toArray((err, docs) => {
                            if (err) {
                                console.log("Collection.find error: ", err);
                                res.end(JSON.stringify({
                                    code: 2,
                                    message: `Collection.find error: ${err}`
                                }));
                            } else {
                                var selectdObjects = [];
                                docs.forEach(el => {
                                    selectdObjects.push(el);
                                });
                                //client.close();
                                res.end(JSON.stringify(selectdObjects));
                            }
                        })
                    }
                })


            }
        })

    }

    console.log(parseUrl);
}


let POST_handler = (req, res) => {
    var parseUrl = require('url').parse(req.url);

    var insertedObject = '';

    if (parseUrl.pathname.includes("/api/")) {
        var table = parseUrl.pathname.replace("/api/", "");
        console.log("table: " + table);

        req.on('data', (data) => {
            insertedObject += data;
        });
        req.on('end', () => {
            try {
                let obj = JSON.parse(insertedObject);
                console.log(obj);

                client.connect(err => {
                    if (err) {
                        console.log("MongoDB: error connection");
                        // res json
                    } else {
                        console.log("MongoDB: connect successful");

                        let db = client.db("BSTU");

                        db.collection(table).insertOne(obj, (err, r) => {
                            if (err) {
                                res.end(JSON.stringify({
                                    code: 2,
                                    message: `such an object already exists; ${err}`
                                }));
                            } else {
                                console.log("Object: " + obj + " inserted");
                                // res end 

                                res.end(JSON.stringify(obj));

                            }
                        });
                    }
                })


            } catch {
                console.log("PARSE ERROR");
            }
        })
    }



}


let PUT_handler = (req, res) => {
    var parseUrl = require('url').parse(req.url);

    var updatedObject = '';

    if (parseUrl.pathname.includes("/api/")) {
        var table = parseUrl.pathname.replace("/api/", "");
        console.log("table: " + table);

        req.on('data', (data) => {
            updatedObject += data;
        });
        req.on('end', () => {
            try {
                let obj = JSON.parse(updatedObject);
                console.log(obj);

                client.connect(err => {
                    if (err) {
                        res.end(JSON.stringify({
                            code: 3,
                            message: ` ${err}`
                        }));

                    } else {
                        const db = client.db("BSTU");
                        const col = db.collection(table);

                        var doc = {};
                        var key = String(table);
                        console.log(key);
                        doc[key] = obj[String(table)];
                        console.log(doc); // should print  Object { name="John"}


                        col.findOneAndUpdate(
                            // Критерий выборки
                            doc,
                            {
                                $set: obj
                            },
                            (err, result) => {
                               if(err || result.value == null){
                                   res.end(JSON.stringify({
                                       code: 3,
                                        message: `data not updated; ${err}`
                                   }));
                               }else{
                                    console.log(result);
                                   res.end(JSON.stringify(obj));
                               }

                            }
                        )


                    }
                })


            } catch {
                console.log("PARSE ERROR");
            }
        })
    }



}

let DELETE_handler = (req, res) => {
    var parseUrl = require('url').parse(req.url);

    var deleteObject = '';

    if (parseUrl.pathname.includes("/api/")) {
        var str = parseUrl.pathname.replace("/api/", "");

        // table name
        table = str.substring(0, str.indexOf("/"));

        // id of deleted element
        id = str.replace(table + "/", "");
        console.log("table: " + table + " id: " + id);

        client.connect(err => {
            if (err) {

            } else {
                const db = client.db("BSTU");
                const col = db.collection(table);
                var doc = {};
                var key = String(table);
                console.log(key);
                doc[key] = id;
                console.log(doc); // should print  Object { name="John"}

                col.deleteMany(doc, function (err, result) {
                  if(err || result.deletedCount === 0){
                      res.end(JSON.stringify({
                          code: 4,
                          message: "no such data;"
                      }));
                  }
                  else {
                      console.log(result);
                      res.end(JSON.stringify(doc));

                  }

                });
            }
        })



    }

}


OTHER_handler = (req, res) => {
    res.end("такой метод не обрабатывается сервером");
}

let http_handler = (req, res) => {
    res.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8"
    })
    console.log(req.method, " - ", req.url);
    switch (req.method) {
        case "GET": GET_handler(req, res); break;
        case "POST": POST_handler(req, res); break;
        case "PUT": PUT_handler(req, res); break;
        case "DELETE": DELETE_handler(req, res); break;
        default: OTHER_handler(req, res); break;
    }
}

let server = http.createServer();
server.listen(4000, (v) => {
    console.log("server.listen(4000): http://localhost:4000");
}).on('error', (e) => {
    console.log("server.listen(4000); error: ", e);
}).on('request', http_handler);







