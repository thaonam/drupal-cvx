(function ($) {
Drupal.behaviors.vimeo_connect = {
  attach: function (context) {
    // Handle file upload event.
    if ($("#vimeo-connect-browse").length) {
      var browse = document.getElementById('vimeo-connect-browse');
      browse.addEventListener('change', vimeo_connect_handle_file_select, false);
      
      // Trigger file browse when Vimeo field is clicked.
      $("#edit-field-vimeo input[type='text']").click(function() {
        $(browse).trigger('click');
      });
    }

    // Handle Scopes field, disable public and private from checking.
    if ($("#vimeo-connect-settings-form").length) {
      $("#edit-vimeo-connect-scopes input#edit-vimeo-connect-scopes-public").attr('disabled', true);
      $("#edit-vimeo-connect-scopes input#edit-vimeo-connect-scopes-private").attr('disabled', true);
    }
    
    // Handle content type enabling.
    if ($("#node-type-form").length) {
      $('fieldset#edit-vimeo-connect', context).drupalSetSummary(function (context) {
        if ($('input#edit-vimeo-connect-enabled').is(':checked')) {
          //$('.vimeo-connect-settings-wrapper').show();
          return Drupal.t('Enabled');
        }
        else {
          //$('.vimneo-connect-settings-wrapper').hide();
          return Drupal.t('Disabled');
        }
      });
    }
  }
};

})(jQuery);

/**
* Update progress bar.
*/
function vimeo_connect_update_progress(id, progress) {
  progress = Math.floor(progress * 100);
  var element = document.getElementById('' + id);
  
  element.setAttribute('style', 'width:' + progress + '%');
  element.innerHTML = '&nbsp;' + progress + '%';
}

/**
 * Vimeo handle file process and upload.
 */ 
function vimeo_connect_handle_file_select(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  var files = jQuery(this).get(0).files;
  var progress_id = 'progress';

  /* Rest the progress bar and show it */
  vimeo_connect_update_progress(progress_id, 0);
  document.getElementById('progress-container').style.display = 'block';

  /* Instantiate Vimeo Uploader */
  var uploader = new VimeoUpload({
    name: jQuery("#edit-title").length ? jQuery("#edit-title").val() : 'NoName',
    //description: document.getElementById('videoDescription').value,
    'file': files[0],
    'private': true,
    'token': Drupal.settings['vimeo_connect']['access_token'],
    'onError': function(data) {
      alert('Error: ' + JSON.parse(data).error);
    },
    'onProgress': function(data) {
      vimeo_connect_update_progress(progress_id, data.loaded / data.total);
    },
    'onComplete': function(videoId, index) {
      var url = 'https://vimeo.com/' + videoId;

      if (index > -1) {
        /* The metadata contains all of the uploaded video(s) details see: https://developer.vimeo.com/api/endpoints/videos#/{video_id} */
        url = this.metadata[index].link;

        /* add stringify the json object for displaying in a text area */
        var pretty = JSON.stringify(this.metadata[index], null, 2);
        //console.log(pretty); /* echo server data */
      }
      
      // Get the video id.
      var params = url.split(/\//);
      var video_id = params[params.length - 1];

      // Set to process wating status.
      jQuery("#progress-container #progress").html(' Đang xử lý định dạng. Vui lòng chờ...');
      
      // Do a loop for checking for video ready. Exit only if ready.
      var video_is_ready = setInterval(function() {
        jQuery.post('/vimeo_connect/video-is-ready', {'video_id': video_id}, function(is_ready) {
          if (is_ready) {
            clearInterval(video_is_ready);

            // Update to field.
            jQuery("#edit-field-vimeo input[type='text']").val(url);

            jQuery("#progress-container").fadeOut(function() {
              jQuery("#progress-container #progress").attr('width', '0%').html(' 0%');
            });
          }
        });
      }, 5000);
    }
  });

  uploader.upload();
}