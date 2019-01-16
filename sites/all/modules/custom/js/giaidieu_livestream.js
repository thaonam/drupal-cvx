/**
 * The WebRTC object created by giaidieu.com on 27 Jan 2018
 * https://giaidieu.com
 * Params:
 * config: Firebase server config.
 * servers: iceServers config.
 * userId: Unique username in the system.
 * localVideo: A document.getElementById DOM object (video tag) for local user.
 * remoteVideo: A document.getElementById DOM object (video tag) for remote user.
 */

// WebRTC object implementation.
function Giaidieu_Livestream(config, servers, userId, localVideo, remoteVideo) {
  // Properties.
  // Config: A Firebase config.
  // Create a project at firebase https://firebase.google.com/
  // Add proejct to web.
  // Database > Rules > Set Read / Write to True.
  // Use default config if not an input config provided.
  this.defaultConfig = {
    apiKey: "AIzaSyATU7e7G9DyDadGas7EkcCvyw3YSqZSvu0",
    authDomain: "signaling-server-edd1b.firebaseapp.com",
    databaseURL: "https://signaling-server-edd1b.firebaseio.com",
    projectId: "signaling-server-edd1b",
    storageBucket: "",
    messagingSenderId: "247708293010"
  };
  this.config = config == null ? this.defaultConfig : config;
  
  // Handling RTC Connection Signaling.
  this.database_rtc = null;
  
  // Handling online users count.
  //this.database_users = null;
  this.number_viewers = 0;

  // STUN / TURN servers.
  // Register free TURN server at http://numb.viagenie.ca/
  this.defaultServers = {'iceServers': [{'urls': 'stun:stun.services.mozilla.com'}, {'urls': 'stun:stun.l.google.com:19302'}, {'urls': 'turn:numb.viagenie.ca','credential': 'cbkmta78','username': 'tuan@giaidieu.com'}]};
  this.servers = servers == null ? this.defaultServers : servers;

  // RTC Connection for exchanging between parties.
  this.peerConnection = null; // client.
  this.peerConnections = {}; // host.

  // Video of the local user (your face video).
  this.localVideo = localVideo;
  // Video of the remote user (your friend video).
  this.remoteVideo = remoteVideo;
  // Video stream instance, use for remove stream later.
  this.offerToExchange = {audio:true, video:true};
  this.offerToReceive = {offerToReceiveAudio: 1, offerToReceiveVideo: 1};
  this.mediaStream = null;

  // For Recording / Download stuff.
  this.mediaSource = new MediaSource();
  this.mediaRecorder = null;
  this.recordedBlobs = [];
  this.recordedBlobsTmp = [];
  this.sourceBuffer = null;
  this.mediaStreamFile = {};

  // Id of yours. Can be randomly generated if not provided.
  this.userId = userId == null ? Math.random().toString(36).substring(7) : userId;
  this.userHost = null; // Who is live stream owner.
  
  // Methods.
  // Init / Events handling.
  // * isHost: Whether this user should be Host.
  this.init = function(callback) {
    // Refer to sub-function used.
    var parent = this;
    
    // Init Firebase. Assume firebase is loaded.
    // <script src="https://www.gstatic.com/firebasejs/4.9.0/firebase.js"></script>
    firebase.initializeApp(this.config);

    // Init database event for RTC Connection.
    this.database_rtc = firebase.database().ref('/rtc');
    this.database_rtc.on('child_added', function(data) {
      parent.readMessage(data);
    });
    
    // Everything looks good. Callback.
    if (typeof callback == 'function') {
      console.log('Init: done!');
      callback();
    }
  };
  
  // Make the connection Offline manually.
  this.goOffline = function() {
    firebase.database().goOffline();
  };
  
  // Make the connection Online manually.
  this.goOnline = function() {
    firebase.database().goOnline();
  };
  
  // Connect to the network as Client user.
  this.connectAsClient = function(callback) {
    var parent = this;
    
    // Init a peer connection for this user.
    var RTCPeerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    
    this.peerConnection = new RTCPeerConnection(this.servers);
    this.peerConnection.onicecandidate = function(event) {
      if (event.candidate) {
        parent.sendMessage(parent.userId, null, JSON.stringify({'ice': event.candidate}));
      }
    };

    //this.peerConnection.onaddstream = (event => this.remoteVideo.srcObject = event.stream);
    this.peerConnection.onaddstream = function(event) {
      console.log('Show Remote stream!');
      parent.remoteVideo.srcObject = event.stream;
      parent.mediaStream = event.stream;
    };
    
    // Send a signal to Host for grating access to Video.
    var database_request = firebase.database().ref('/request');
    var request = database_request.push({name: this.userId});
    request.remove();

    // Continue other processes.
    if (typeof callback == 'function') {callback();}
  };

  // Connect to the network as Client user.
  this.connectAsHost = function(offerToExchange, offerToReceive, callback) {
    // Assign media options if available.
    if (offerToExchange != undefined && offerToExchange != null) {
      this.offerToExchange = offerToExchange;
    }
    if (offerToReceive != undefined && offerToReceive != null) {
      this.offerToReceive = offerToReceive;
    }
    
    var parent = this;
    parent.userHost = parent.userId;
    
    // Access the camera.
    navigator.mediaDevices.getUserMedia(parent.offerToExchange).then(function(stream) {
      // Show Local video.
      parent.localVideo.srcObject = stream;
      parent.mediaStream = stream;
      
      // Get a list of current existing client users.
      // Then establish connections.
      parent.usersListGet(function(users_list) {
        console.log('Users list to be establish connection: ', users_list);
      
        for (var i = 0; i < users_list.length; i++) {
          var name = users_list[i];
        
          if (parent.peerConnections[name] == undefined || parent.peerConnections[name] == null) {
            parent.createPeerConnection(name);
          }
        }
      });
    }).catch(function(e) {
      console.log('getUserMedia() error: ', e);
    });

    // Listening to client request.
    var database_request = firebase.database().ref('/request');
    database_request.on('child_added', function(data) {
      // Create connection with this user.
      var name = data.val().name;
      console.log('Request from ' + name);
      
      parent.createPeerConnection(name);
    });

    // Continue other processes.
    if (typeof callback == 'function') {callback();}
  };
  
  // Helper function to get list of devices.
  this.getMediaDevices = function(callback) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      // No device found.
      if (typeof callback == 'function') {callback(null);}
    }
    else{
      navigator.mediaDevices.enumerateDevices().then(function(devices) {
        if (!devices.length) {
          // No devices found.
          if (typeof callback == 'function') {callback(null);}
        }
        else{
          var devices_list = {};
          for (var i = 0; i < devices.length; i++) {
            var device = devices[i];
            if (devices_list[device.kind] == undefined || devices_list[device.kind] == null) {
              devices_list[device.kind] = [];
            }
            
            devices_list[device.kind].push(device);
          }
          
          //console.log(devices_list);
          if (typeof callback == 'function') {callback(devices_list);}
        }
      });
    }
  };
  
  // Helper function to create connection from host to client.
  this.createPeerConnection = function(name) {
    var parent = this;
    
    // Create connection and add listener event.
    var RTCPeerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    
    parent.peerConnections[name] = new RTCPeerConnection(parent.servers);
    parent.peerConnections[name].onicecandidate = function(event) {
      if (event.candidate) {
        parent.sendMessage(parent.userId, name, JSON.stringify({'ice': event.candidate}));
      }
    };

    // Add media stream to this.
    parent.peerConnections[name].addStream(parent.mediaStream);
    //console.log('Done established connection: ', parent.peerConnections[name]);
      
    // Create offer then send to client.
    parent.peerConnections[name].createOffer(parent.offerToReceive).then(function(offer) {
      parent.peerConnections[name].setLocalDescription(offer, function() {
        //console.log('Send offer to ' + name);
        //console.log(offer);
          
        parent.sendMessage(parent.userId, name, JSON.stringify({'sdp': parent.peerConnections[name].localDescription}));
      }, function(error) {
        console.log('Failed to create session description: ' + error.toString());
      });        
        
    }, function(error) {
      console.log('Failed to create session description: ' + error.toString());
    });
  };

  // Send a message to parties via Firebase.
  this.sendMessage = function(senderId, receiverId, data) {
    var msg = this.database_rtc.push({sender: senderId, receiver: receiverId, message: data});
    msg.remove();
  };

  // Read a message from paties via Firebase.
  this.readMessage = function(data) {
    var msg = JSON.parse(data.val().message);
    var sender = data.val().sender;
    var receiver = data.val().receiver == null ? this.userHost : data.val().receiver;
    
    if (sender != this.userId && this.userId == receiver) {
      var thisPeer = this.userId != this.userHost ? this.peerConnection : this.peerConnections[sender];
      
      if (msg.ice != undefined) {
        thisPeer.addIceCandidate(new RTCIceCandidate(msg.ice));
      }
      else if (msg.sdp.type == "offer") {
        thisPeer.setRemoteDescription(new RTCSessionDescription(msg.sdp))
        .then(() => thisPeer.createAnswer())
        .then(answer => thisPeer.setLocalDescription(answer))
        .then(() => this.sendMessage(this.userId, sender, JSON.stringify({'sdp': thisPeer.localDescription})));
      }
      else if (msg.sdp.type == "answer") {
        thisPeer.setRemoteDescription(new RTCSessionDescription(msg.sdp));
      }
    }
  };
  
  // Users presence.
  // showViewers: DOM object.
  this.usersPresenceMonitor = function(showViewers, callback) {
    // Users presence handler.
    var parent = this;
    var database_users = firebase.database().ref('/users');
    var connected_user = firebase.database().ref('.info/connected');
    
    // Online / Disconnect changed.
    connected_user.on('value', function(snap) {
      // User is online.
      if (snap.val() === true) {
        // Add to online list.
        var con = database_users.push();

        // Remove when disconnected.
        con.onDisconnect().remove();
        con.set(parent.userId);
      }
    });

    // Number of online users is the number of objects in the presence list.
    database_users.on('value', function(snap) {
      parent.number_viewers = snap.numChildren();

      // Show number of viewers to DOM.
      if (showViewers) {
        showViewers.innerHTML = parent.number_viewers;
      }
    });
    
    // Continue other processes.
    if (typeof callback == 'function') {
      callback();
    }
  };
  
  // Get Users list and return in callback function.
  this.usersListGet = function(callback) {
    var database_users = firebase.database().ref('/users');
    database_users.once('value').then(function(snap) {
      var users_list = [];
      
      for (var key in snap.val()) {
        var name = snap.val()[key];
        if (users_list.indexOf(name) == -1) {
          users_list.push(name);
        }
      }
      
      if (typeof callback == 'function') {callback(users_list);}
    });
  };
  
  // Start to record the stream.
  this.recordStart = function() {
    // Setup.
    var parent = this;
    this.mediaSource.addEventListener('sourceopen', function(event) {
      parent.sourceBuffer = parent.mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
    }, false);
    
    //this.recordedBlobs = [];

    // Get the codec supported by browser.
    var options = {mimeType: 'video/webm;codecs=vp9'};
    
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      console.log(options.mimeType + ' is not Supported');
      options = {mimeType: 'video/webm;codecs=vp8'};
      
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.log(options.mimeType + ' is not Supported');
        options = {mimeType: 'video/webm'};
      
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          console.log(options.mimeType + ' is not Supported');
          options = {mimeType: ''};
        }
      }
    }
    
    // Try to init the record. 
    try {
      this.mediaRecorder = new MediaRecorder(this.mediaStream, options);
    }
    catch (e) {
      console.error('Exception while creating MediaRecorder: ' + e);
      alert('Exception while creating MediaRecorder: ' + e + '. mimeType: ' + options.mimeType);
      return;
    }
    
    console.log('Created MediaRecorder', this.mediaRecorder, 'with options', options);
    
    this.mediaRecorder.onstop = function(event) {
      console.log('Recorder stopped: ', event);
    };
    
    this.mediaRecorder.ondataavailable = function(event) {
      if (event.data && event.data.size > 0) {
        parent.recordedBlobs.push(event.data);
      }
    };

    this.mediaRecorder.start(3000); // collect 3 second of data
    console.log('MediaRecorder started', this.mediaRecorder);
  };
  
  // Stop the recording.
  this.recordStop = function() {
    if (this.mediaRecorder != null) {
      this.mediaRecorder.stop();
      this.mediaRecorder = null;
    }
  };

  // Play the recording.
  this.recordPlay = function(recordedVideo) {
    if (recordedVideo == undefined || recordedVideo == null) {
      alert('Không tìm thấy Video Player nào để chạy.');
      return;
    }

    var parent = this;
    if (parent.mediaStreamFile && parent.mediaStreamFile['url'] != undefined) {
      console.log('Start to play the recording.');
      recordedVideo.src = parent.mediaStreamFile['url'];
    }
    
    // Play it.
    /*
    var superBuffer = new Blob(this.recordedBlobs, {type: 'video/webm'});
    recordedVideo.src = window.URL.createObjectURL(superBuffer);
    
    console.log('Start playing the recording: ', window.URL.createObjectURL(superBuffer));
    
    // workaround for non-seekable video taken from
    // https://bugs.chromium.org/p/chromium/issues/detail?id=642012#c23
    recordedVideo.addEventListener('loadedmetadata', function() {
      if (recordedVideo.duration === Infinity) {
        recordedVideo.currentTime = 1e101;
        recordedVideo.ontimeupdate = function() {
          recordedVideo.currentTime = 0;
          recordedVideo.ontimeupdate = function() {
            delete recordedVideo.ontimeupdate;
            recordedVideo.play();
            console.log('Played!');
          };
        };
      }
    });
    */
  };
  
  // Upload the recording.
  this.recordUpload = function() {
    if (!this.recordedBlobs.length) {
      alert('Bạn chưa bật "Thu hình". Chưa có đoạn hình ảnh nào được ghi.');
      return;
    }

    // Popup and disable all activities for this upload.
    var overlay = jQuery('<div class="custom-overlay"></div>');
    jQuery('body').append(overlay);

    var popup = jQuery('<div class="custom-overlay-popup">Đang xử lý, xin vui lòng chờ...</div>');
    jQuery('body').append(popup);

    // Send blob to server for storing.
    //var superBuffer = new Blob(this.recordedBlobs, {type: 'video/webm'});
    var superBuffer = new Blob(this.recordedBlobs, {type: 'video/mp4'});
    var formData = new FormData();
    formData.append('file_data', superBuffer);
    formData.append('file_name', this.userId);
        
    // Send to server.
    var parent = this;
    
    jQuery.ajax({
      url: '/custom/video-livestream-upload',
      type: 'POST',
      cache: false,
      data: formData,
      processData: false,
      contentType: false,
      success: function(result) {
        //console.log(result);
        
        // Remove overlay / popup.
        popup.remove();
        overlay.remove();

        if (result['is_error']) {
          alert(result['message']);
          return false;
        }
        
        // Update the filename for play / download later.
        parent.mediaStreamFile = {
          fid: result['fid'],
          url: result['url'],
          filename: result['filename']
        };
        
        console.log('Done uploading file.');
        console.log(parent.mediaStreamFile);
      }
    });
  };

  // Download the recording.
  this.recordDownload = function() {
    var parent = this;
    
    if (parent.mediaStreamFile && parent.mediaStreamFile['url'] != undefined) {
      var a = document.createElement('a');
      a.style.display = 'none';
      a.href = parent.mediaStreamFile['url'];
      a.download = parent.mediaStreamFile['filename'];
      document.body.appendChild(a);
      a.click();
      
      setTimeout(function() {
        document.body.removeChild(a);
        //window.URL.revokeObjectURL(parent.mediaStreamFile);
      }, 100);
    }
  };
  
  // Save the video with the uploaded video.
  this.save = function(nid, status, callback) {
    if (jQuery.isEmptyObject(this.mediaStreamFile) || !this.mediaStreamFile['fid']) {
      alert('Chưa có file Video nào được tạo. Vui lòng bật chức năng thu hình để tạo Video từ Live Stream.');
      return false;
    }
    
    // Popup and disable all activities for this upload.
    var overlay = jQuery('<div class="custom-overlay"></div>');
    jQuery('body').append(overlay);

    var popup = jQuery('<div class="custom-overlay-popup">Đang xử lý, xin vui lòng chờ...</div>');
    jQuery('body').append(popup);

    custom_services_request('node_video_update_video', {nid: nid, status: status, fid: this.mediaStreamFile['fid']}, function(result) {
      // Remove overlay / popup.
      popup.remove();
      overlay.remove();

      if (result['is_error']) {
        alert(result['message']);
        return false;
      }
      
      if (typeof callback == 'function') {callback();}
    });
  };
  
  // Pause the stream.
  this.pause = function() {
    // Pause the video.
    if (this.mediaStream != null) {
      console.log('Pause local Stream.');
      this.mediaStream.getTracks().forEach(track => track.enabled = false);
    }
  };

  // Resume the stream.
  this.resume = function() {
    // Resume the video.
    if (this.mediaStream != null) {
      console.log('Resume local Stream.');
      this.mediaStream.getTracks().forEach(track => track.enabled = true);
    }
  };

  // Stop the stream.
  this.stop = function() {
    // Stop the video.
    if (this.mediaStream != null) {
      console.log('Remove local Stream.');
      this.mediaStream.getTracks().forEach(track => track.stop());
    }

    // Stop the peer connection.
    var parent = this;
    this.usersListGet(function(users_list) {
      console.log('Users list to be closed connection: ', users_list);
      
      for (var i = 0; i < users_list.length; i++) {
        var name = users_list[i];
        
        if (parent.peerConnections[name] != undefined && parent.peerConnections[name] != null) {
          parent.peerConnections[name].close();
          parent.peerConnections[name] = null;
        }
      }
    });

    // Upload the Stream to server for storing.
    this.recordUpload();

    // Free the blob buffer if any.
    this.recordedBlobs = [];
  };

  // Start the stream.
  this.start = function() {
    // Reset some values.
    this.recordedBlobs = [];
    this.mediaStreamFile = {};
    
    this.connectAsHost();
  };
}