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

for (var i = 0; i < 8; i++) {
  clients[i] = client("name", point(0, 0), 0);
}

var current_clients = 0;

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

  clients[current_clients] = client(0, point(0, 0), connection.remoteAddress);

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

    clients[current_clients].name = name;
    clients[current_clients].point.x = client_x;
    clients[current_clients].point.y = client_y;

    // clients[current_clients].point = point(" " + d, 0);
    print_all_clients();
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

function print_all_clients() {
  for (var i = 0; i < 8; i++) {
    if (clients[i].name != "name") {
      log(JSON.stringify(clients[i]));
    }
  }
}

app.set('views', __dirname + '/views');

app.set('view engine', 'pug');

app.get('/', function(req, res) {
  res.render("index");
});

app.get('/json', function(req, res) {
  console.log(clients);
  res.json({
    x: clients[0].point.x,
    y: clients[0].point.y
  })
});

function test() {
  console.log("test");
}

app.listen(8080);