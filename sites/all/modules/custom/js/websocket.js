/* Signaling server */
var https = require('https');
var fs = require('fs');
var request = require('request');
var multiparty = require("multiparty");

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

io.on('connection', function(socket) {
  console.log('Client connected: ' + socket.id);

	socket.on('video_data_transfer', function(data) {
	  console.log('Data received: ', data);
    
    giaidieu_send_data_to_server2('https://cauvongxanh.net/custom/video-livestream-upload', 'POST', data, function(result) {
      console.log('Done with result: ', result);
    });
	});
});

/**
 * Helper function to send a data to server. 
 */
function giaidieu_send_data_to_server(path, method, data, callback) {
  // Set the headers.
  var headers = {
    'User-Agent': 'Super Agent/0.0.1',
    //'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Type': 'multipart/form-data',
    'transfer-encoding': 'chunked'
  };

  // Configure the request.
  var options = {
    url: path,
    method: method,
    headers: headers
  };

  if (method == 'GET') {
    options['qs'] = data;
  }
  else if (method == 'POST') {
    options['form'] = data;
  }

  // Send the request.
  request(options, function (error, response, result) {
    if (!error && response.statusCode == 200) {
      if (typeof callback == 'function') {callback(result);}
    }
    else if (error) {
      console.log('File upload error: ', error);
    }
  });
}