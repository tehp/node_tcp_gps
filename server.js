var net = require('net');
var timestamp = require('console-timestamp');
var express = require('express');
var path = require('path');
var pug = require('pug');
var app = express();

var client = function(name, point, ip) {
  return {
    "name": name,
    "point": point,
    "ip": ip
  };
};

var point = function(x, y) {
  return {
    "x": x,
    "y": y
  };
};

var clients = [];

var server = net.createServer();
server.on('connection', handle_connection);

server.listen(9000, function() {
  log('server listening to: ' + JSON.stringify(server.address()));
});


function handle_connection(connection) {

  var remoteAddress = connection.remoteAddress + ':' + connection.remotePort;
  log('new client connection from: ' + remoteAddress);

  connection.on('data', onConnData);
  connection.once('close', onConnClose);
  connection.on('error', onConnError);

  clients[connection.remoteAddress] = client("name", point(0, 0), connection.remoteAddress);
  console.log(clients[connection.remoteAddress]);

  function onConnData(d) {
    console.log("-----------------------");
    log('Address: ' + remoteAddress);
    log('Data: ' + d);
    console.log("-----------------------");

    var data = "" + d;
    var message = data.split("_");

    var name = message[0];
    var client_x = message[1];
    var client_y = message[2];

    log("-> " + name + " x:" + client_x + " y:" + client_y);

    clients[connection.remoteAddress].name = name;
    clients[connection.remoteAddress].point.x = client_x;
    clients[connection.remoteAddress].point.y = client_y;

    console.log(clients);
    connection.write(d);
  }

  function onConnClose() {
    log('connection closed: ' + remoteAddress);
  }

  function onConnError(err) {
    log('err' + remoteAddress + " " + err.message);
  }

}

function log(msg) {
  var now = new Date();
  console.log("[ " + timestamp('MM-DD hh:mm:ss', now) + " ] " + msg);
}

app.set('views', __dirname + '/views');

app.set('view engine', 'pug');

app.get('/', function(req, res) {
  res.render("index");
});

app.get('/json', function(req, res) {
  res.json({
    clients: clients
  })
});

app.listen(8080);