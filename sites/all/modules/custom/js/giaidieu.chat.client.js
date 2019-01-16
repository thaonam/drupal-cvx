/* Chat client created by giaidieu */

/**
 * Helper function to send a service to server.
 */
function giaidieu_services_request(service_name, params_str, callback) {
  try {
	  // Obtain session token.
		var token_url = "?q=services/session/token"
		jQuery.ajax({
		  url: token_url,
		  type: 'get',
		  dataType: 'text',
		  error:function (jqXHR, textStatus, errorThrown) {
				if (!errorThrown) {
				  errorThrown = Drupal.t('Token retrieval failed!');
				}
		  },
		  success: function(token) {
				// Call the web service.
				jQuery.ajax({
				  url: '/?q=drupalgap/drupalapp/' + service_name + '.json',
				  type: 'post',
				  data: params_str,
				  dataType: 'json',
				  beforeSend: function(request) {
						request.setRequestHeader("X-CSRF-Token", token);
				  },
				  error: function (jqXHR, textStatus, errorThrown) {
						console.log(arguments);
				  },
				  success: function(data) {
				    callback(data);
				  }
				});
		  }
		});
  }
  catch (error) { console.log('drupalgap service error - ' + error); }
}

/**
 * To send a chat message to friends.
 */
function giaidieu_message_send(channel, from_uid, to_uid, chat_message, options, callback) {
  // Send to channel (private).
  if (socket) {
    var timestamp = new Date().getTime() / 1000;

    options['timestamp'] = timestamp;
    options['readstatus'] = 0;

    var message = {
      channel: channel,
      sender: from_uid,
      receiver: to_uid,
      chat_message: chat_message,
      options: options
    };

    // Process to send message.
   	try {
      socket.emit(channel, message);
      giaidieu_message_own_receive(message);

      if (typeof callback === 'function') {callback();}
    }
    catch (error) {console.log('Sending message - ' + error);}
  }
}

/**
 * To receive a message.
 * User is receiver. Room is made for sender.
 */
function giaidieu_message_receive(message) {
  // To-do.
}

/**
 * To update to sender's own message.
 */
function giaidieu_message_own_receive(message) {
  // To-do.
}

/**
 * Listening to the channels.
 */
function giaidieu_channel_update() {
  if (socket && socket.id) {
    if (jQuery('body').hasClass('socket-processed')) {return false;}

    // Send connecting signal to server.
    //socket.emit('user_connected', {uid: Drupal.settings.drupalapp.user.uid, socketid: socket.id});

    // Handle when users are connected / disconnected.
		socket.on('user_online_update', function(clients) {
		});

		// Handle when user receiving a chat.
		socket.on('chat', function(message) {
      giaidieu_message_receive(message);
		});

		jQuery('body').addClass('socket-processed');
  }
  else{
    setTimeout(function() {
      giaidieu_channel_update();
    }, 1000);
  }
}