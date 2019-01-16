/* custom_wysiwyg.js file created by giaidieu */
(function($){
	Drupal.behaviors.custom_wysiwyg = {
		attach: function(context, settings) {
		  if ($("#media-tabs-wrapper:not('.processed')").length) {
		    // Hand uploading files.
        $("#media-content-wrapper #giaidieu-media-files-upload-placeholder").click(function() {
          $("#media-content-wrapper #giaidieu-media-files-upload").click();
          return false;
        });
        
        var list = $("#media-content-wrapper #giaidieu-media-files-upload-placeholder div.media_list");
        giaidieu_file_media_handler('giaidieu-media-files-upload', {list: '#media-content-wrapper #giaidieu-media-files-upload-placeholder div.media_list'}, function(image_url) {
          list.find('img.no-photo').first().parent().find('img.ajax-loader').remove();
          list.find('img.no-photo').first().attr('src', image_url).removeClass('no-photo').addClass('photo-thumb');
        });

        // Popup tabs.
		    $("#media-tabs-wrapper ul.tab-items li").click(function() {
		      if ($(this).hasClass('active')) {return false;}
          
          // Switch tab and content.
          var tab_id = $(this).attr('rel');
          
          $(this).parent().children('li.active').removeClass('active');
          $(this).addClass('active');
          
          $("#media-content-wrapper").children('div.media-tab-content.active').removeClass('active');
          $("#media-content-wrapper #" + tab_id).addClass('active');
		    });
        
        // Add event handler for selecting media on the list.
        $("#media-content-wrapper #media-tab-content-browser-wrapper").on('click', 'div.file-wrapper', function() {
          if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
          }
          else{
            $(this).addClass('selected');
          }
        });
        
        $("#media-tabs-wrapper").addClass('processed');
		  }
		}
  };
})(jQuery);
