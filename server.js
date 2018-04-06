/*------------------------------------------------------------------------------------------------------------------
-- SOURCE FILE: server.js
--
-- PROGRAM: tracker
--
-- FUNCTIONS:
-- handle_connection()
--
-- DATE: April 5, 2018
--
-- REVISIONS: (Date and Description)
--
-- DESIGNER: Mackenzie Craig
--
-- PROGRAMMER: Mackenzie Craig
--
-- NOTES:
-- This program is a server written in NodeJS. The program servers an endpoint using express that provides a dictionary
-- of connected android clients who are reporting their coordinates periodically through TCP sockets. The dictionary
-- is used in a view which maps the clients on a google maps page that is updated each second.
----------------------------------------------------------------------------------------------------------------------*/

var net = require('net');
var timestamp = require('console-timestamp');
var express = require('express');
var path = require('path');
var pug = require('pug');
var app = express();

var clients = {};

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

var server = net.createServer();
server.on('connection', handle_connection);

server.listen(9000, function() {
  log('server listening to: ' + JSON.stringify(server.address()));
});

/*------------------------------------------------------------------------------------------------------------------
-- FUNCTION: handle_connection
--
-- DATE: April 5, 2018
--
-- REVISIONS: (Date and Description)
--
-- DESIGNER: Mackenzie Craig
--
-- PROGRAMMER: Mackenzie Craig
--
-- INTERFACE: function handle_connection(connection)
--
-- RETURNS: N/A
--
-- NOTES:
-- This function is called once per connection made to the server from a client, and runs until that client disconnects.
-- The function handles the creation of the connection and the reading and using of the clients messages.
----------------------------------------------------------------------------------------------------------------------*/
function handle_connection(connection) {

  var remoteAddress = connection.remoteAddress + ':' + connection.remotePort;
  log('new client connection from: ' + remoteAddress);

  connection.on('data', on_data);
  connection.once('close', on_close);
  connection.on('error', on_error);

  clients[connection.remoteAddress] = client("name", point(0, 0), connection.remoteAddress);
  console.log(clients[connection.remoteAddress]);

  function on_data(d) {

    if (d != " ") {

      log('Address: ' + remoteAddress);
      log('Data: ' + d);

      var data = "" + d;
      var message = data.split("_");

      var name = message[0];
      var client_x = message[1];
      var client_y = message[2];

      log("-> " + name + " x:" + client_x + " y:" + client_y);

      log("─────────────────────────────────────");

      clients[connection.remoteAddress].name = name;
      clients[connection.remoteAddress].point.x = client_x;
      clients[connection.remoteAddress].point.y = client_y;

      connection.write(d);

    }

  }

  function on_close() {
    delete clients[connection.remoteAddress];
  }

  function on_error(err) {
    log('err' + remoteAddress + " " + err.message);
  }

}

function log(msg) {
  var now = new Date();
  console.log("[ " + timestamp('MM-DD hh:mm:ss', now) + " ] " + msg);
}

app.set('views', __dirname + '/views');
app.use(express.static('public'));

app.set('view engine', 'pug');

app.get('/', function(req, res) {
  res.render("index");
});

app.get('/json', function(req, res) {

  var password = req.query.password;

  if (password == "4815162342") {
    res.json({
      clients
    })
  } else {
    return res.status(403).send({
      success: false,
      message: 'Invalid password'
    });
  }
});

app.listen(8080);