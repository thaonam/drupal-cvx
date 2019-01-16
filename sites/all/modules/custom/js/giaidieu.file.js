/* giaidieu.file.js created by giaidieu */

/**
 * Process showing thumbnail and store to server, return fid.
 */
function giaidieu_file_image_data_process(img_selector, imagedata, callback) {
  var img = $(img_selector);
  if (!img.length) {return false;}

	// Show image in preview section.
	img.attr('src', 'data:image/jpeg;base64,' + imagedata);

	// Send to server for fid returning.
	var filename = Drupal.user.name + '_' + Date.now() + '.jpg';
	giaidieu_services_call('photo_data_upload', {filename: filename, imagedata: imagedata}, function(result) {
		if (parseInt(result) > 0) {
			img.attr('fid', result);

			if (typeof callback == 'function') {callback(img);}
		}
		else{
			alert('Có lỗi trong lúc xử lý file. Xin vui lòng thử lại.');
		}
	});
}

/**
 * File handler.
 * file_id: id of the file field.
 * options: {
 *   max_filesize: 5,
 *   min_width: 300,
 *   min_height: 300,
 *   url: '/image-process' - This URL will return fid if success.
 * }
 * callback: use to output result and process.
 */
function giaidieu_file_handler(file_id, options, callback) {
  //var file = document.getElementById(file_id);
  var file = jQuery("#" + file_id);

  if (!file.length) {return false;}

  file.change(function(e) {
	//file.addEventListener('change', function(e) {
		e.stopPropagation();
		e.preventDefault();

		// Setup default value.
		options.max_filesize = options.max_filesize == undefined ? 5 : options.max_filesize; // in MB
		options.min_width = options.min_width == undefined ? 300 : options.min_width; // in pixels
		options.min_height = options.min_height == undefined ? 300 : options.min_height;
		options.url = options.url == undefined ? '/image-process' : options.url;

		var files = null;
		if (e.dataTransfer != undefined) {
			files = e.dataTransfer.files;
		}
		else{
			files = e.target.files;
		}

		for (var i = 0, f; f = files[i]; i++) {
			// Validate the input:
			// Must be images.
			if (!f.type.match('image.*')) {
				alert('File ' + f.name.toUpperCase() + ' không phải là định dạng ảnh.');
				continue;
			}

			// Must less than options.max_filesize * 1024 * 1024 MB.
			if (f.size > options.max_filesize * 1024 * 1024) {
				alert('File ' + f.name.toUpperCase() + ' có kích thước lớn hơn ' + options.max_filesize + 'MB.');
				continue;
			}

			// Read the file for checking dimension.
			var reader = new FileReader();

			// Closure to capture the file information.
			reader.onload = (function(theFile) {
				return function(e) {
					var image = new Image();
					var file = e;

					image.onload = function(e) {
						var width = this.width;
						var height = this.height;
						var is_error = false;

						if (width < options.min_width) {
							alert('File ' + theFile.name.toUpperCase() + ' có chiều rộng nhỏ hơn ' + options.min_width + 'px.');
							is_error = true;
						}

						if (height < options.min_height) {
							alert('File ' + theFile.name.toUpperCase() + ' có chiều cao nhỏ hơn ' + options.min_height + 'px.');
							is_error = true;
						}

						// Show the image in the list.
						if (!is_error) {
							var image = jQuery('<img src="' + file.target.result + '" class="photo-thumb" alt="' + theFile.name + '" />');
              //callback(image);

							// Build files form submit.
							var formData = new FormData();
							formData.append('file', theFile);

							var xhr = new XMLHttpRequest();
							xhr.open('POST', options.url);
							xhr.onload = function () {
								if (xhr.status === 200) {
									// Done, success.
									// Update and close popup.
									var fid = parseInt(xhr.response);
									if (fid > 0) {
									  // Output or process the result.
									  if (typeof callback == 'function') {
									    image.attr('fid', fid);
									    callback(image);
									  }
									}
                  else{
                    alert('Có lỗi trong quá trình tải ảnh. Xin vui lòng thử lại.');
                  }
								}
								else {
									alert('Không kết nối được tới máy chủ. Xin vui lòng thử lại.');
								}
							};

							xhr.send(formData);

						}
						else{
							// Error.
							// To-do.
              console.log('Error!');
						}
					};

					image.src = e.target.result;
				};
			})(f);

			// Read in the image file as a data URL.
			reader.readAsDataURL(f);
		}

	//}, false);
    return false;
	});
}

/**
 * File handler.
 * file_id: id of the file field.
 * options: {
 *   max_filesize: 5,
 *   url: '/custom/video-upload' - This URL will return fid if success.
 * }
 * callback: use to output result and process.
 */
function giaidieu_file_video_handler(file_id, options, callback) {
  //var file = document.getElementById(file_id);
  var file = jQuery("#" + file_id);

  if (!file.length || file.hasClass('disabled')) {return false;}

  file.change(function(e) {
		e.stopPropagation();
		e.preventDefault();

		// Setup default value.
		options.max_filesize = options.max_filesize == undefined ? 250 : options.max_filesize; // in MB
		options.url = options.url == undefined ? '/video-process' : options.url;

		var files = null;
		if (e.dataTransfer != undefined) {
			files = e.dataTransfer.files;
		}
		else{
			files = e.target.files;
		}

		for (var i = 0, f; f = files[i]; i++) {
			// Validate the input:
			// Must be video.
			//if (!f.type.match('image.*')) {
				//alert('File ' + f.name.toUpperCase() + ' không phải là định dạng ảnh.');
				//continue;
			//}

			// Must less than options.max_filesize * 1024 * 1024 MB.
			if (f.size > options.max_filesize * 1024 * 1024) {
				alert('File ' + f.name.toUpperCase() + ' có kích thước lớn hơn ' + options.max_filesize + 'MB.');
				continue;
			}
      
      // Disable the file field waiting for upload.
      file.addClass('disabled');
      
      // Show ajax loader.
      file.parent().children('.video-add-wrapper').addClass('is-uploading').prepend('<img src="/sites/all/themes/giaidieu/images/ajax-loader.gif" class="ajax-loader" />');

			// Read the file for checking dimension.
			var reader = new FileReader();

			// Closure to capture the file information.
			reader.onload = (function(theFile) {
				return function(e) {
					//var file = e;

          // Build files form submit.
          var formData = new FormData();
          formData.append('file', theFile);

          var xhr = new XMLHttpRequest();
          xhr.open('POST', options.url);
          xhr.onload = function() {
            // Enable field field back.
            file.removeClass('disabled');
            file.parent().children('.video-add-wrapper').removeClass('is-uploading').find('img.ajax-loader').remove();
            
            if (xhr.status === 200) {
              // Done, success.
		          // Output or process the result.
              if (typeof callback == 'function') {
				        callback(xhr.response);
              }
              else{
                alert('Có lỗi trong quá trình tải file. Xin vui lòng thử lại.');
              }
            }
            else{
              alert('Không kết nối được tới máy chủ. Xin vui lòng thử lại.');
            }
          };

          xhr.send(formData);
				};
			})(f);

			// Read in the image file as a data URL.
			reader.readAsDataURL(f);
		}

    return false;
	});
}

/**
 * File handler.
 * file_id: id of the file field.
 * options: {
 *   max_filesize: 5,
 *   url: '/custom/media-upload' - This URL will return fid if success.
 * }
 * callback: use to output result and process.
 */
function giaidieu_file_media_handler(file_id, options, callback) {
  var file = jQuery("#" + file_id);

  if (!file.length || file.hasClass('disabled')) {return false;}

  file.change(function(e) {
		e.stopPropagation();
		e.preventDefault();

		// Setup default value.
		options.max_image_filesize = 5; // in Mb.
		options.max_video_filesize = 1024; // in Mb.
		options.url = options.url == undefined ? '/media-process' : options.url;
    
    var list = jQuery(options.list);

		var files = null;
		if (e.dataTransfer != undefined) {
			files = e.dataTransfer.files;
		}
		else{
			files = e.target.files;
		}

		for (var i = 0, f; f = files[i]; i++) {
			// Validate the input:
			if (!f.type.match('image.*') && !f.type.match('video.*')) {
				alert('File ' + f.name.toUpperCase() + ' không phải là định dạng media.');
				continue;
			}

      if (f.type.match('image.*') && f.size > options.max_image_filesize * 1024 * 1024) {
				alert('File ' + f.name.toUpperCase() + ' có kích thước lớn hơn ' + options.max_image_filesize + 'MB.');
				continue;
      }
      else if (f.type.match('video.*') && f.size > options.max_video_filesize * 1024 * 1024) {
				alert('File ' + f.name.toUpperCase() + ' có kích thước lớn hơn ' + options.max_video_filesize + 'MB.');
				continue;
			}
      
      // Get the file type URL uploader.
      if (f.type.match('image.*')) {
        options.url = '/custom/photo-upload2';
        options.media_type = 'image';
        
        list.append(jQuery('<div class="photo-thumb-wrapper"><img src="/sites/all/themes/giaidieu/images/ajax-loader.gif" class="ajax-loader" /><img src="/sites/default/files/styles/media_thumbnail/public/default_images/no_photo.png" class="no-photo" alt="Image thumbnail" /></div>'));
      }
      else if (f.type.match('video.*')) {
        options.url = '/custom/video-upload';
        options.media_type = 'video';
        
        list.append(jQuery('<div class="photo-thumb-wrapper"><img src="/sites/all/themes/giaidieu/images/ajax-loader.gif" class="ajax-loader" /><img src="/sites/default/files/styles/media_thumbnail/public/default_images/video-x-generic.png" class="no-photo" alt="Video thumbnail" /></div>'));
      }
      
			// Read the file for checking dimension.
			var reader = new FileReader();

			// Closure to capture the file information.
			reader.onload = (function(theFile) {
				return function(e) {
          // Build files form submit.
          var formData = new FormData();
          formData.append('file', theFile);

          var xhr = new XMLHttpRequest();
          xhr.open('POST', options.url);
          xhr.onload = function() {
            if (xhr.status === 200) {
              // Done, success.
		          // Output or process the result.
              if (typeof callback == 'function') {
                if (options.media_type == 'image') {
                  var params = xhr.response.split(/\|/);
                  //thumbnail.find('img.ajax-loader').remove();
                  callback(params[1]);
                }
                else{
                  var params = xhr.response.split(/\|/);
                  //thumbnail.find('img.ajax-loader').remove();
                  callback(params[2]);
                }
              }
              else{
                alert('Có lỗi trong quá trình tải file. Xin vui lòng thử lại.');
              }
            }
            else{
              alert('Không kết nối được tới máy chủ. Xin vui lòng thử lại.');
            }
          };

          xhr.send(formData);
				};
			})(f);

			// Read in the image file as a data URL.
			reader.readAsDataURL(f);
		}

    return false;
	});
}