/* giaidieu.video.js file created by giaidieu */ 
var player = null;
var player_adv = null;
var player_adv_run = 0;
var countdown_adv_is_showing = false;

(function($){
	Drupal.behaviors.giaidieu_video = {
		attach: function(context, settings) {
		  // Video file upload handler.
      if ($('#video_upload_form').length) {
        giaidieu_file_video_handler('video_upload', {max_filesize: 1024, url: '/custom/video-upload'}, function(result) {
          // Process result.
          var params = result.split(/\|/);
          if (params.length > 1 && params[0] > 0) {
            // Update the thumbnail.
            if ($("#custom-video-form-wrapper").length) {
              $("#custom-video-form-wrapper #video-photo-thumbnail").closest('div.video-wrapper').removeClass('no-video');
              $("#custom-video-form-wrapper #video-photo-thumbnail").attr('video_fid', params[0]);
              $("#custom-video-form-wrapper #video-photo-thumbnail").attr('thumbnail_fid', params[1]);
              $("#custom-video-form-wrapper #video-photo-thumbnail").attr('src', params[2]);
          
              $("#custom-video-form-wrapper #video-photo-thumbnail").removeClass('no-photo').addClass('photo-thumb');
            }
            else if ($("#video-node-form").length) {
              $("div#video_upload_form #video-photo-thumbnail").closest('div.video-wrapper').removeClass('no-video');
              $("div#video_upload_form #video-photo-thumbnail").attr('video_fid', params[0]);
              $("div#video_upload_form #video-photo-thumbnail").attr('thumbnail_fid', params[1]);
              $("div#video_upload_form #video-photo-thumbnail").attr('src', params[2]);
          
              $("div#video_upload_form #video-photo-thumbnail").removeClass('no-photo').addClass('photo-thumb');              
            }
          }
          else if (params[0] == 0 && params[1] != '') {
            alert(params[1]);
            return false;
          }
          else{
            alert('Có lỗi trong quá trình xử lý file. Xin vui lòng thử lại sau.');
            return false;
          }
        });
      }
      
      if ($('#video_adv_upload_form').length) {
        giaidieu_file_video_handler('video_adv_upload', {max_filesize: 250, url: '/custom/video-upload'}, function(result) {
          // Process result.
          var params = result.split(/\|/);
          if (params.length > 1 && params[0] > 0) {
            // Update the thumbnail.
            if ($("#custom-video-form-wrapper").length) {
              $("#custom-video-form-wrapper #video-adv-photo-thumbnail").closest('div.video-wrapper').removeClass('no-video');
              $("#custom-video-form-wrapper #video-adv-photo-thumbnail").attr('video_fid', params[0]);
              $("#custom-video-form-wrapper #video-adv-photo-thumbnail").attr('thumbnail_fid', params[1]);
              $("#custom-video-form-wrapper #video-adv-photo-thumbnail").attr('src', params[2]);
          
              $("#custom-video-form-wrapper #video-adv-photo-thumbnail").removeClass('no-photo').addClass('photo-thumb');
            }
            else if ($("#video-node-form").length) {
              $("div#video_adv_upload_form #video-adv-photo-thumbnail").closest('div.video-wrapper').removeClass('no-video');
              $("div#video_adv_upload_form #video-adv-photo-thumbnail").attr('video_fid', params[0]);
              $("div#video_adv_upload_form #video-adv-photo-thumbnail").attr('thumbnail_fid', params[1]);
              $("div#video_adv_upload_form #video-adv-photo-thumbnail").attr('src', params[2]);
          
              $("div#video_adv_upload_form #video-adv-photo-thumbnail").removeClass('no-photo').addClass('photo-thumb');              
            }
          }
          else if (params[0] == 0 && params[1] != '') {
            alert(params[1]);
            return false;
          }
          else{
            alert('Có lỗi trong quá trình xử lý file. Xin vui lòng thử lại sau.');
            return false;
          }
        });
      }
      
		  // Play a video in the relative list itself.
      $("a.dh-video-top-player").each(function() {
        var link = $(this);
        
        link.click(function(e) {
          e.preventDefault();
          
          // Hide the the image holder.
          link.css('display', 'none'); 
        
          // Get the video node id.
          var video_wrapper = $(this).closest('div.node-video');
          var video_placeholder = video_wrapper.find('.video-placeholder');
          var video_nid = video_wrapper.attr('id').replace(/^node\-/, '');
 
           // If already being played, stop process.
          if (video_placeholder.hasClass('is-playing')) {
            return false;
          }
          else{
            video_placeholder.addClass('is-playing');
          }

          // Play it.
          custom_video_play(video_wrapper, video_nid, video_placeholder, 'crop_285x190', true, function(previous_video_placeholder) {
            if (previous_video_placeholder.attr('id') == 'videojs-player-wrapper') {
              // On the main section.
              previous_video_placeholder.empty().html('<img src="' + previous_video_placeholder.attr('video-cover') + '" />');
              previous_video_placeholder.removeClass('is-playing');
            }
            else{
              // On same list.
              previous_video_placeholder.empty();
              previous_video_placeholder.next().css('display', 'block');
              previous_video_placeholder.removeClass('is-playing');
            }
          });
        
          return false;
        });
      });

		  // Play a video in the landing page list itself.
      $("a.btn-dh-player").each(function() {
        $(this).click(function(e) {
          e.preventDefault();
        
          // Get the video node id.
          var video_wrapper = $(this).closest('div.node-video');
          var video_placeholder = video_wrapper.find('.video-placeholder');
          var video_nid = video_wrapper.attr('id').replace(/^node\-/, '');
          
          // If already being played, stop process.
          if (video_placeholder.hasClass('is-playing')) {
            return false;
          }
          else{
            video_placeholder.addClass('is-playing');
          }
        
          // Play it.
          custom_video_play(video_wrapper, video_nid, video_placeholder, 'crop_285x190', true);
        
          return false;
        });
      });

		  // Detect to setup a video on Video landing page.
      if ($("body.page-node-323 #videojs-player-wrapper:not('.video-processed')").length) {
        var video_item = $("#block-views-node-functions-slide-new-videos div.video-item:first");
        video_item.addClass('active').click();
        
        $("body.page-node-323 #videojs-player-wrapper").addClass('video-processed');
      }

      // Highlight video item on the landing page list (right hand side).
      $("#block-views-node-functions-slide-new-videos div.video-item").click(function() {
        $(this).closest('div.view-content').find('div.video-item.active').removeClass('active');
        $(this).addClass('active');
      });

      // Detect the video js handler.
      if ($("body.node-type-video:not('.video-processed')").length) {
        // Play the normal video.
        if ($("div.dh-block-video-details #videojs-player-wrapper").length) {
          var video_wrapper = $("div.dh-block-video-details #videojs-player-wrapper");
          var video_placeholder = $("div.dh-block-video-details #videojs-player-wrapper");
          var video_nid = video_wrapper.attr('nid');

          // If already being played, stop process.
          if (video_placeholder.hasClass('is-playing')) {
            return false;
          }
          else{
            video_placeholder.addClass('is-playing');
          }

          custom_video_play(video_wrapper, video_nid, video_placeholder, 'crop_285x190', false);
        }
        
        // Play the livestreaming.
        else if ($("video#livestream").length) {
          var livestream = document.getElementById('livestream');
          
          var offerToExchange = {audio:true, video:true}; // Exchange 2 way.
          var offerToReceive = {offerToReceiveAudio: 1, offerToReceiveVideo: 1}; // 1 way.
          
          // Show viewers. Hide old views.
          var viewers = document.querySelector('#livestream-viewers span');
          $("li.statistics_counter").hide();

          // Create the webrtc object instance.
          var webrtc = new Giaidieu_Livestream(null, null, null, livestream, livestream);

          // Init the connection.
          webrtc.init(function() {
            // Decide to connect as Host or Client.
            var current_user_uid = $('body').attr('uid');
            var video_owner_uid = $(livestream).attr('uid');
            
            if (current_user_uid > 0 && current_user_uid == video_owner_uid) {
              console.log('You are Host!');

              // Setup viewers and connect.
              webrtc.usersPresenceMonitor(viewers, function() {
                if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
                  alert('Bạn đang đăng nhập là chủ của Video Livestream này, tuy nhiên, máy tính của bạn đang dùng không có thiết bị để Livestream.');
                  return;
                }
                else{
                  navigator.mediaDevices.enumerateDevices().then(function(devices) {
                    if (!devices.length) {
                      alert('Bạn đang đăng nhập là chủ của Video Livestream này, tuy nhiên, máy tính của bạn đang dùng không có thiết bị để Livestream.');
                      return;
                    }
                    
                    var has_video_input = false;
                    devices.forEach(function(device) {
                      if (device.kind == 'videoinput') {
                        has_video_input = true;
                      }
                      //console.log(device.kind + ": " + device.label + " id = " + device.deviceId);
                    });
                    
                    if (!has_video_input) {
                      alert('Bạn đang đăng nhập là chủ của Video Livestream này, tuy nhiên, máy tính của bạn đang dùng không có thiết bị để Livestream.');
                      console.log('Switch to connect as Client');
                      webrtc.connectAsClient(function() {
                        $(livestream).parent().addClass('livestreaming');
                      });
                      return;
                    }
                    
                    // Connect as Host.
                    livestream.muted = true;
                    console.log('Set muted for Host!');
                    webrtc.connectAsHost(offerToExchange, offerToReceive, function() {
                      $(livestream).parent().addClass('livestreaming');
                      
                      // Control buttons.
                      $("#video-buttons-wrapper").css('display', 'block');
                    });
                    
                    // Setup livestream buttons event.
                    var pause_button = $("#video-buttons-wrapper #isPauseStream");
                    var resume_button = $("#video-buttons-wrapper #isResumeStream");

                    var stop_button = $("#video-buttons-wrapper #isStopStream"); // Stop Live Stream.
                    var start_button = $("#video-buttons-wrapper #isStartStream"); // Start Live Stream again.
                    var save_button = $("#video-buttons-wrapper #isSave"); // Attach to video node and publish.

                    var record_button = $("#video-buttons-wrapper #isStartRecordStream");
                    var stop_record_button = $("#video-buttons-wrapper #isStopRecordStream");
                    var play_record_button = $("#video-buttons-wrapper #isPlayRecordStream");
                    var download_record_button = $("#video-buttons-wrapper #isDownloadStream");

                    var local_video = document.getElementById('livestream');
                    var replay_video = document.getElementById('livestream_replay');

                    // Pause.
                    pause_button.click(function() {
                      pause_button.addClass('hide');
                      resume_button.removeClass('hide');
                      
                      webrtc.pause();
                    });
                    // Resume.
                    resume_button.click(function() {
                      resume_button.addClass('hide');
                      pause_button.removeClass('hide');
                      
                      webrtc.resume();
                    });

                    // Stop.
                    stop_button.click(function() {
                      stop_button.addClass('hide');
                      start_button.removeClass('hide');
                      
                      pause_button.addClass('hide');
                      resume_button.addClass('hide');
      
                      record_button.addClass('hide');
                      stop_record_button.addClass('hide');
                      play_record_button.removeClass('hide');
                      download_record_button.removeClass('hide');
                      save_button.removeClass('hide');
      
                      webrtc.recordStop();
                      webrtc.stop();
                    });
                    // Start.
                    start_button.click(function() {
                      replay_video.muted = true;
                      replay_video.pause();
                      replay_video.src = '';
      
                      $(replay_video).addClass('hide');
                      $(local_video).removeClass('hide');
                      
                      local_video.currentTime = 0;

                      start_button.addClass('hide');
                      stop_button.removeClass('hide');
                      pause_button.removeClass('hide');
      
                      record_button.removeClass('hide');
                      stop_record_button.addClass('hide');
                      play_record_button.addClass('hide');
                      download_record_button.addClass('hide');
                      save_button.addClass('hide');
      
                      webrtc.start();
                    });
                    // Save.
                    save_button.click(function() {
                      // Get the video nid to be attached the video.
                      var nid = $(local_video).attr('nid');
                      if (!nid) {
                        alert('Không tìm thấy Video id.');
                        return false;
                      }
      
                      webrtc.save(nid, 0, function() {
                        // Go to edit the video.
                        if (confirm('Video đã được lưu nhưng chưa công khai! Bạn có thể cập nhật thêm thông tin cho Video này trước khi công khai tới người dùng. Nhấn OK để vào cập nhật.')) {
                          //document.location.href = '/user/video/edit/' + nid;
                          document.location.href = '/node/' + nid + '/edit';
                          return false;
                        }
                        
                        // Reload page.
                        //document.location.reload(); 
                      });
                    });
                    
                    // Start recording.
                    record_button.click(function() {
                      record_button.addClass('hide');
                      stop_record_button.removeClass('hide');
                      play_record_button.addClass('hide');
      
                      webrtc.recordStart();
                    });
                    // Stop recording.
                    stop_record_button.click(function() {
                      stop_record_button.addClass('hide');
                      record_button.removeClass('hide');
                      play_record_button.addClass('hide');
      
                      webrtc.recordStop();
                    });
                    // Play the recorded video.
                    play_record_button.click(function() {
                      play_record_button.addClass('hide');
                      record_button.addClass('hide');
      
                      $(local_video).addClass('hide');
                      $(replay_video).removeClass('hide');
                      
                      replay_video.muted = false;
                      webrtc.recordPlay(replay_video);
                    });
                    // Download the record.
                    download_record_button.click(function() {
                      // Stop recording before download.
                      webrtc.recordStop();
                      
                      replay_video.muted = true;
                      //replay_video.stop();
                      
                      $(replay_video).addClass('hide');
                      $(local_video).removeClass('hide');
      
                      var video_title = $("h5.video-title").html();
                      webrtc.recordDownload(video_title);
                    });
                    
                  }).catch(function(err) {
                    console.log(err.name + ": " + err.message);
                  });
                }
              });
            }
            else{
              console.log('You are Client');

              // Setup viewers and connect.
              webrtc.usersPresenceMonitor(viewers, function() {
                webrtc.connectAsClient(function() {
                  $(livestream).parent().addClass('livestreaming');
                });
              });
            }
          });
        }
        
        // Show up a popup asking for subscription if live streaming not free.
        if (Drupal.settings['tasscare_settings'] && Drupal.settings['tasscare_settings']['video_livestreaming']) {
          if (!Drupal.settings['tasscare_settings']['video_livestreaming']['video_is_free'] && !Drupal.settings['tasscare_settings']['video_livestreaming']['video_is_paid']) {
            // Ask for payment.
            if (jQuery("#custom-video-subscription-wrapper").length) {
              jQuery("#custom-video-subscription-wrapper").remove();
            }
            
            // Store this video settings info to local for use later.
            //localStorage.setItem(, JSON.stringify({name: 'Test'}));
            //var test = JSON.parse(localStorage.getItem("lastname"));
        
            var dialog = jQuery('<div id="custom-video-subscription-wrapper" title="Xem Video Live Streaming"></div>');
            dialog.append(Drupal.settings['tasscare_settings']['video_livestreaming']['video_subscription_popup']);
            dialog.dialog({
              modal: true,
              autoOpen: true,
              width: 400,
              height: 350,
              resizable: false,
              close: function(event, ui) {
                // Remove the popup.
                jQuery("#custom-video-subscription-wrapper").remove();
              }
            });
          }
        }

        $("body.node-type-video").addClass('video-processed');
      }
		}
  };
})(jQuery);

/**
 * Video HTML code generator.
 */
function custom_video_html_generate(video_id, video_url, video_cover, video_mime_type) {
  if (video_mime_type == 'youtube') {
    return '<video id="' + video_id + '" class="video-js vjs-default-skin video-1810-video-dimensions" controls preload="auto" poster="' + video_cover + '" data-setup=\'{"techOrder": ["youtube"], "fluid": true, "aspectRatio": "16:9"}\'> <source src="' + video_url + '" type="video/youtube"></source><p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="http://videojs.com/html5-video-support/" target="_blank"> supports HTML5 video</a></p></video>';
  }
  else{
    video_mime_type = video_mime_type.replace(/video\/quicktime/, 'video/mp4');
    
    return '<video id="' + video_id + '" class="video-js vjs-default-skin video-1810-video-dimensions" controls preload="auto" poster="' + video_cover + '" data-setup=\'{"fluid": true, "aspectRatio": "16:9"}\'> <source src="' + video_url + '" type="'+ video_mime_type + '"></source><p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="http://videojs.com/html5-video-support/" target="_blank"> supports HTML5 video</a></p></video>';
  }
}

/**
 * Init videojs into a placeholder and play it.
 * @params: video node id (nid).
 */
function custom_video_play(obj, nid, selector, cover_size, play_now, callback = '') {
  // Free player if exist.
  if (player != null) {
    // Stop the player and paste back cover.
    var video_id = jQuery(player).attr('id');
    var video_cover = jQuery("#" + video_id).closest("div[video-id='" + video_id + "']").attr('video-cover');
    
    if (video_cover == undefined) {
      video_cover = jQuery("#" + video_id).attr('poster');
    }
    
    var video_placeholder = jQuery("#" + video_id).parent();
    player.dispose();
    video_placeholder.empty().append('<img src="' + video_cover + '" />');
    video_placeholder.removeClass('is-playing');
    
    // Remove in right handle side item list.
    jQuery('div.video-item[video-id="' + video_id + '"]').removeClass('active');
    
    if (typeof callback == 'function') {
      callback(video_placeholder);
    }
  }
  
  if (player_adv != null) {
    player_adv.dispose();
  }

  // Display a loading message.
  jQuery(selector).empty().html('<p class="loading-message">Đang tải...</p>');
  
  // Load the node content for video URL.
  if (jQuery(obj).attr('video-url') != undefined && jQuery(obj).attr('video-url') != '') {
    var video_id = jQuery(obj).attr('video-id')
    var video_url = jQuery(obj).attr('video-url');
    var video_cover = jQuery(obj).attr('video-cover')
    var video_mime_type = jQuery(obj).attr('video-mine-type')

    // Generate main player.
    var video_html = custom_video_html_generate(video_id, video_url, video_cover, video_mime_type);
    jQuery(selector).empty().html(video_html);
    jQuery("#" + video_id).addClass('player-is-active');
    
    // Generate adv player.
    if (Drupal.settings['tasscare'][video_id]['video_adv_insert_at'] != undefined && parseInt(Drupal.settings['tasscare'][video_id]['video_adv_insert_at']) >= 0) {
      var video_html = jQuery(custom_video_html_generate(Drupal.settings['tasscare'][video_id]['video_adv_id'], Drupal.settings['tasscare'][video_id]['video_adv_url'], '', Drupal.settings['tasscare'][video_id]['video_adv_mime_type']));
      jQuery(selector).append(video_html);
    }
    
    // Play and event handling.
    if (Drupal.settings['tasscare'] != undefined && Drupal.settings['tasscare'][video_id] != undefined) {
      custom_video_player_listening(selector, Drupal.settings['tasscare'][video_id], play_now);
    }
  }
  else{
    custom_services_request('node_video_url_get', {nid: nid, cover_size: cover_size}, function(result) {
      // Display error.
      if (result['is_error']) {
        alert(result['message']);
        return false;
      }
      
      // Store for later use in same session.
      if (Drupal.settings['tasscare'] == undefined) {
        Drupal.settings['tasscare'] = {};
      }
      Drupal.settings['tasscare'][result['data']['video_id']] = result['data'];

      jQuery(obj).attr('video-id', result['data']['video_id']);
      jQuery(obj).attr('video-url', result['data']['video_url']);
      jQuery(obj).attr('video-cover', result['data']['video_cover']);
      jQuery(obj).attr('video-mine-type', result['data']['video_mime_type']);
      
      // Generate main player.
      var video_html = custom_video_html_generate(result['data']['video_id'], result['data']['video_url'], result['data']['video_cover'], result['data']['video_mime_type']);
      jQuery(selector).empty().html(video_html);
      jQuery("#" + result['data']['video_id']).addClass('player-is-active');
      
      // Generate adv player.
      if (result['data']['video_adv_insert_at'] != undefined && parseInt(result['data']['video_adv_insert_at']) >= 0) {
        var video_html = jQuery(custom_video_html_generate(result['data']['video_adv_id'], result['data']['video_adv_url'], '', result['data']['video_adv_mime_type']));
        jQuery(selector).append(video_html);
      }

      // Play and event handling.
      custom_video_player_listening(selector, result['data'], play_now);
    });
  }
}

/**
 * Helper function to handle the player event.
 */
function custom_video_player_listening(selector, video_data, play_now) {
  //console.log(video_data);
  
  // Handle MAIN player state event.
  player = videojs(video_data['video_id'], {}, function onPlayerReady() {
    // Play immediately.
    if (play_now) {this.play();}

    // Handle video while playing.
    player.on('playing', function() {
    });

    // Player is ready state.
    player.on('canplay', function() {
    });

    // Handle video at timing change.
    player.on('timeupdate', function() {
      var current_time = Math.floor(player.currentTime());
      //console.log('Main player update: ' + current_time);

      // Countdown.
      if (current_time > 0) {
        custom_video_playing_free_in_seconds(selector, video_data, current_time);
      }

      // Advertisement.
      if (video_data['video_adv_insert_at'] != undefined && parseInt(video_data['video_adv_insert_at']) >= current_time) {
        var adv_showing_at = parseInt(video_data['video_adv_insert_at']) - current_time;
        
        if (adv_showing_at <= 5) {
          countdown_adv_is_showing = true;
          
          if (adv_showing_at > 0) {
            custom_video_countdown_text_update(video_data['video_id'], 'Quảng cáo sẽ bắt đầu sau <span class="countdown-s">' + adv_showing_at + '</span> giây');
          }
          else{
            custom_video_countdown_text_update(video_data['video_id'], '');
          }
        }
        else{
          countdown_adv_is_showing = false;
        }
        
        custom_video_playing_insert_adv_clip(selector, video_data, current_time);
      }
      else{
        countdown_adv_is_showing = false;
      }
    });

    // Handle when adv clip is ended.
    player.on('ended', function() {
    });
  });

  // Handle ADV player state event.
  if (video_data['video_adv_id'] != undefined) {
    player_adv = videojs(video_data['video_adv_id'], {}, function onPlayerReady() {
      // Handle video for countdown (free viewing in seconds).
      player_adv.on('playing', function() {
      });

      // Resume the main video at currentTime.
      player_adv.on('canplay', function() {
      });
        
      // Handle video for countdown and advertisement.
      player_adv.on('timeupdate', function() {
        var current_time_left = Math.floor(player_adv.duration()) - Math.floor(player_adv.currentTime());
        console.log('Adv player update: ' + Math.floor(player_adv.currentTime()));
      
        // Put a text for user know this is adv.
        custom_video_countdown_text_update(video_data['video_adv_id'], 'Quảng cáo <span class="countdown-s">' + current_time_left + '</span>');
      });
        
      // Handle when adv clip is ended.
      player_adv.on('ended', function() {
        // Remove text on adv player.
        custom_video_countdown_text_update(video_data['video_adv_id'], '');
      
        // Switch player.
        jQuery("#" + video_data['video_adv_id']).removeClass('player-is-active');
        jQuery("#" + video_data['video_id']).addClass('player-is-active');
      
        player.play();
      });
    });
  }
}

/**
 * Helper function to update text in countdown area.
 */
function custom_video_countdown_text_update(video_id, text) {
  if (!jQuery('#' + video_id + ' div.countdown').length) {
    jQuery('#' + video_id).prepend('<div class="countdown">' + text + '</div>');
  }
  else{
    jQuery('#' + video_id + ' div.countdown').html(text);
  }
}

/**
 * Helper function to update text in adv countdown area.
 */
function custom_video_countdown_adv_text_update(video_id, text) {
  if (!jQuery('#' + video_id + ' div.adv-countdown').length) {
    jQuery('#' + video_id).prepend('<div class="adv-countdown">' + text + '</div>');
  }
  else{
    jQuery('#' + video_id + ' div.adv-countdown').html(text);
  }
}

/**
 * Handle the video for inserting adv in the video clip.
 */
function custom_video_playing_insert_adv_clip(selector, data, current_time) {
  // Check if there is any ad clip.
  if (parseInt(data['video_adv_insert_at']) == current_time && !player_adv_run) {
    // Remove countdown text.
    custom_video_countdown_text_update(data['video_id'], '');
    player.pause();
    
    // Switch player.
    jQuery("#" + data['video_id']).removeClass('player-is-active');
    jQuery("#" + data['video_adv_id']).addClass('player-is-active');

    player_adv.play();
    player_adv_run++;
  }
}

/**
 * Handle the video play in x seconds and askes for payment.
 */
function custom_video_playing_free_in_seconds(selector, data, current_time) {
  var video_id = data['video_id'];

  // Set countdown if video is not free.
  var countdown = -1;
  if (!data['video_is_free'] && !data['video_is_paid']) {
    // Add the count down.
    if (!jQuery(selector).find('#' + video_id + ' div.countdown').length) {
      jQuery(selector).find('#' + video_id).prepend('<div class="countdown"></div>');
    }
                
    countdown = parseInt(data['video_free_in_second']);
  }
  
  // Play in countdown seconds for commercial video (user not paid).
  var countdown_remain = countdown > 0 ? countdown - current_time : 0;
    
  if (countdown_remain < 0) {
    // Stop the video.
    player.pause();
    player.reset();
    //player.currentTime(0);
    
    // Change to payment message.
    custom_video_countdown_text_update(video_id, 'Trả phí để xem tiếp');

    // Ask for payment.
    if (jQuery("#custom-video-subscription-wrapper").length) {
      jQuery("#custom-video-subscription-wrapper").remove();
    }
        
    var dialog = jQuery('<div id="custom-video-subscription-wrapper" title="Xem Video Thày Thuốc Gia Đình"></div>');
    dialog.append(data['video_subscription_popup']);
    dialog.dialog({
      modal: true,
      autoOpen: true,
      width: 400,
      height: 350,
      resizable: false,
      close: function(event, ui) {
        // Remove the popup.
        jQuery("#custom-video-subscription-wrapper").remove();
      }
    });
  }
  else if (countdown > 0 && !countdown_adv_is_showing) {
    custom_video_countdown_text_update(video_id, 'Bạn được xem miễn phí <span class="countdown-s">' + countdown_remain + '</span>');
  }
}

/**
 * Process to upload a video file via Ajax.
 */
function custom_upload_video_library(obj) {
  if (jQuery("#custom-user-files-wrapper").length) {
    jQuery("#custom-user-files-wrapper").remove();
  }
  
  // Open a dialog for selecting images.
  if (!jQuery("#custom-user-files-wrapper").length) {
    var div = jQuery("<div id='custom-user-files-wrapper'></div>");
    div.dialog({
      modal: true,
      width: 600,
      height: 400,
      autoOpen: true,
      closeOnEscape: true,
      title: 'Thư viện Video của bạn',
      buttons: [
      {
        text: 'Chọn video',
        class: 'button-ok',
        click: function() {
          // Collect all those selected image.
          var selected_files = [];
          div.find('.file-wrapper.selected').each(function() {
            selected_files.push({
              video_fid: jQuery(this).attr('video_fid'),
              thumbnail_fid: jQuery(this).attr('thumbnail_fid'),
              src: jQuery(this).find('img').attr('src')
            });
            
            jQuery(this).removeClass('selected');
          });

          // Update the list.
          if (selected_files.length) {
            for (var i = 0; i < selected_files.length; i++) {
              // Update to thumbnail placeholder.
              jQuery(obj).closest('div.file-wrapper').find('div.video-wrapper').removeClass('no-video');
              jQuery(obj).closest('div.file-wrapper').find('img').attr('src', selected_files[i]['src']);
              jQuery(obj).closest('div.file-wrapper').find('img').attr('video_fid', selected_files[i]['video_fid']);
              jQuery(obj).closest('div.file-wrapper').find('img').attr('thumbnail_fid', selected_files[i]['thumbnail_fid']);
              jQuery(obj).closest('div.file-wrapper').find('img').removeClass('no-photo').addClass('photo-thumb');
            }
          }
          else{
            alert('Bạn chưa chọn video nào. Vui lòng nhấn chuột lên ảnh video để chọn.');
            return false;
          }
                      
          jQuery(this).dialog("close");
        }
      },
      {
        text: 'Bỏ qua',
        class: 'button-cancel',
        click: function() {
          div.find('.file-wrapper.selected').each(function() {
            jQuery(this).removeClass('selected');
          });

          jQuery(this).dialog("close");
        }
      }
      ]
    });
              
    jQuery.get('/custom/user/files/video', {}, function(result) {
      div.html(result);
                
      // Make file is selectable.
      div.on('click', 'div.file-wrapper', function() {
        if (jQuery(this).hasClass('selected')) {
          jQuery(this).removeClass('selected');
        }
        else{
          // Remove all other selected files.
          jQuery(this).closest('div.view-content').find('div.file-wrapper.selected').removeClass('selected');
          jQuery(this).addClass('selected');
        }
      });
    });
  }
}

/**
 * Process to upload a video adv file via Ajax.
 * Upload using Progress bar.
 */
function custom_upload_video_adv() {
  var bar = jQuery("#custom-video-form-wrapper #bar_adv");
  var percent = jQuery("#custom-video-form-wrapper #percent_adv");
  
  jQuery("#custom-video-form-wrapper #video_adv_upload_form").ajaxForm({
    beforeSubmit: function() {
      document.getElementById("progress_div_adv").style.display = 'block';
      var percentVal = '0%';
      bar.width(percentVal)
      percent.html(percentVal);
    },

    uploadProgress: function(event, position, total, percentComplete) {
      var percentVal = percentComplete + '%';
      bar.width(percentVal)
      percent.html(percentVal);
    },
    
    success: function() {
      var percentVal = '100%';
      bar.width(percentVal)
      percent.html(percentVal);
    },

    complete: function(xhr) {
      if(xhr.responseText) {
        // Process result.
        var params = xhr.responseText.split(/\|/);
        console.log(params);
        
        if (params.length > 1 && params[0] > 0) {
          // Update the thumbnail.
          jQuery("#custom-video-form-wrapper #video-adv-photo-thumbnail").attr('video_fid', params[0]);
          jQuery("#custom-video-form-wrapper #video-adv-photo-thumbnail").attr('thumbnail_fid', params[1]);
          jQuery("#custom-video-form-wrapper #video-adv-photo-thumbnail").attr('src', params[2]);
          
          jQuery("#custom-video-form-wrapper #video-adv-photo-thumbnail").removeClass('no-photo').addClass('photo-thumb');
        }
        else{
          alert('Có lỗi trong quá trình xử lý file. Xin vui lòng thử lại sau.');
          return false;
        }
      }
    }
  });
}

/**
 * Trigger the file browser to upload video.
 */
function giaidieu_video_file_trigger(selector) {
  if (jQuery("#" + selector).hasClass('disabled')) {return false;}
  
  jQuery("#" + selector).trigger('click');
}

