// Where the servers are created!

const express = require('express');
const socketio = require('socket.io');
const app = express();

app.use(express.static(__dirname + '/public'));
const expressServer = app.listen(9000);

const io = socketio(expressServer);

// App organization
// servers.js in NOT the entry point, it creates our servers
// and exports them

module.exports = {
  app,
  io,
};
