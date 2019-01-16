/* Signaling server */
var https = require('https');
var fs = require('fs');
var dash = require('lodash');

// Setup a secured connection server.
var options = {
  key: fs.readFileSync('/etc/httpd/ssl/cauvongxanh.key'),
  cert: fs.readFileSync('/etc/httpd/ssl/cauvongxanh.crt'),
  requestCert: true
};

var app = https.createServer(options, function() {
  console.log('Cauvongxanh App listening on port 3000');
}).listen(3000);

var io = require('socket.io').listen(app);

// Online users list.
var users = [];

io.on('connection', function(socket) {
  console.log('Client connected: ' + socket.id);
  
  socket.on('login', function(data) {
    var user = {
      name: data.name,
      socket: socket.id,
      is_host: data.is_host,
      room: data.room
    };
    
    if (dash.findIndex(users, {socket: socket.id}) == -1 && dash.findIndex(users, {name: data.name}) == -1) {
      // Add to list.
      users.push(user);
    }

    io.emit('online', {'user': user, 'viewers': users.length});
  });

  socket.on('disconnect', function() {
    var index = dash.findIndex(users, {socket: socket.id});
    if (index != -1) {
      var name = users[index].name;
      users.splice(index, 1);

      io.emit('offline', {'name': name, 'users': users});
      console.log(name + ' disconnected');
    }
  });

  socket.on('send_message', function(message) {
    console.log(message);
    
    var currentUser = dash.find(users, {socket: socket.id});
    if (!currentUser) {return;}

    var contact = dash.find(users, {name: message.receiver.name});
    if (!contact) {return;}
    
    io.to(contact.socket).emit('message_received', message);
    
    if (message.type == 'offer') {
      console.log(currentUser.name + ' OFFERING ' + contact.name);
    }
    else if (message.type == 'answer') {
      console.log(currentUser.name + ' ANSERING ' + contact.name);
    }
  });
});

//http.listen(3000, function(){
  //console.log('listening on *:3000');
//});