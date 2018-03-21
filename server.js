var net = require('net');
var timestamp = require('console-timestamp');
var express = require('express');
var path = require('path');
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

for (var i = 0; i < 8; i++) {
  clients[i] = client("name", point(0, 0), 0);
}

var current_clients = 0;

print_all_clients();

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

  clients[current_clients] = client("unnamed client", point(0, 0), connection.remoteAddress);
  print_all_clients();

  function onConnData(d) {
    log("received data: ");
    log('Address: ' + remoteAddress);
    log('Data: ' + d);
    // clients[current_clients].point = point(" " + d, 0);
    // print_all_clients();
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
  console.log("[ " + timestamp('MM-DD hh:mm', now) + " ] " + msg);
}

function print_all_clients() {
  for (var i = 0; i < 8; i++) {
    log(JSON.stringify(clients[i]));
  }
}

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/views/index.html'));
});

app.listen(8080);