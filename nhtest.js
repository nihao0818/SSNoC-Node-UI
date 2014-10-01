var http = require('http');

var port = 9123;
http.createServer(function (req, res){

res.writeHead(200, {'Content-Type': 'text/plain'});
res.end("weuiw");	

}).listen(port);

console.log("on going");