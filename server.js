//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//

var express = require('express')
var http = require('http');
var app = express();
//app.get("/", function(request, response) {  response.end("Welcome to the homepage!");})

app.set("views", __dirname + "/public");
app.set("view engine", "pug");
app.get("/", function(request, response) {response.render("index", { message: "I love anime" })});
app.use('/public', express.static(process.cwd() + '/public'));
//app.get("/new/:url", function(req, res) {res.end("Hello, " + req.params.url + ".");})

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//

var server = http.createServer(app);


server.listen(process.env.PORT || 8080, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
