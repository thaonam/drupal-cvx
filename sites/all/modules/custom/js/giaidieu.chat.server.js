/* Chat nodejs server js */
var app = require('http').createServer();
var io = require('socket.io').listen(app);
var http = require('http');

var clients = {};
var sockets = {};

app.listen(8888, function() {
  console.log('Chat server listening on port 8888');
});

io.sockets.on('connection', function(socket) {
  // Notice user has logged in. Will disable when live.
	console.log('Client connected: ' + socket.id);

  // When user disconnected, update to global store.
	socket.on('disconnect', function() {
	  if (sockets[socket.id] != undefined) {
	    var uid = sockets[socket.id];

      if (clients && clients[uid] != undefined) {
	      delete clients[uid];
	    }
	    delete sockets[socket.id];
    }

	  //io.emit('user_online_update', clients);
	});

	// When user connected, update to global store.
	socket.on('user_connected', function(data) {
		if (data['uid'] > 0) {
			clients[data.uid] = {
			  socketid: data.socketid,
			  status: 1, // 1=online, 0=idle.
			  updated: Date.now()
			}

			sockets[data.socketid] = data.uid;

			io.emit('user_online_update', clients);
		}
	});

  // Send a message.
	socket.on('chat', function(message) {
	  // If the receiver is online, send a notice to him/her.
	  if (clients[message.receiver] != undefined) {
	    io.to(clients[message.receiver].socketid).emit('chat', message);
	  }
	});

	socket.on('chat_php', function(message) {
	  var params = message.split(/\|/);
	  message = {
	    channel: 'chat',
      id: params[0],
	    sender: params[1],
	    receiver: params[2],
	    chat_message: params[3],
	    options: {
	      timestamp: params[4],
	      status: 0
	    }
	  };

	  // If the receiver is online, send a notice to him/her.
	  if (clients[params[2]] != undefined) {
	    io.to(clients[params[2]]).emit('chat', message);
	  }
	});

});