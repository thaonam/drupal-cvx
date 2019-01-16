/* custom js used for admin pages */
(function($){
	Drupal.behaviors.custom_admin = {
		attach: function(context, settings) {
		  // Insert video uploader to replace Drupal core files.
      if ($("#video-node-form:not('.processed')").length) {
        var form = $("#video-node-form");
        var id = form.attr('id');

        // Apply to only some forms.
        var is_custom_video_field = $("#" + id + " input[name='custom_video_field']").val();
        if (is_custom_video_field == undefined || is_custom_video_field != 1) {
          return false;
        }
        
        // Replace for video field.
        var video_field_html = '<div id="video_upload_form"><div class="file-wrapper">';
              video_field_html += '<label>Video</label>';
              video_field_html += '<div class="video-wrapper no-video">';
                video_field_html += '<img onclick="giaidieu_video_file_trigger(\'video_upload\');" src="/sites/default/files/styles/thumbnail/public/default_images/default-video-thumbnail.jpg" class="no-photo" id="video-photo-thumbnail" />';
                video_field_html += '<span class="custom-op"><i class="fa fa-trash" aria-hidden="true" title="Nhấn để xóa ảnh này." onclick="custom_image_remove(this);"></i></span>';
              video_field_html += '</div>';
              video_field_html += '<input type="file" name="video_upload" id="video_upload" accept="video/mp4,video/avi,video/mov,video/wmv,video/flv" style="display: none" />';
              video_field_html += '<div class="video-add-wrapper">';
                video_field_html += '<span>Thêm video</span>';
                video_field_html += '<div class="video-buttons">';
                  video_field_html += '<div class="video-add" onclick="giaidieu_video_file_trigger(\'video_upload\');">Tải mới</div>';
                  video_field_html += '<div class="video-reuse" onclick="custom_upload_video_library(this);">Thư viện video</div>';
                video_field_html += '</div>';
              video_field_html += '</div>';
            video_field_html += '</div>';
            video_field_html += '<div class="file-desc">';
              video_field_html += '<div class="desc">Kích thước của file phải nhỏ hơn <strong>1024 MB.</strong></div>';
              video_field_html += '<div class="desc">Chấp nhận các định dạng video phổ biến: <strong>mp4 avi mov wmv flv.</strong></div>';
            video_field_html += '</div></div>';

        $("#" + id + " #edit-field-video").css('display', 'none');
        $("#" + id + " #edit-field-video").after(video_field_html);          

        // Replace for video adv field.
        var video_adv_field_html = '<div id="video_adv_upload_form"><div class="file-wrapper">';
              video_adv_field_html += '<label>Video quảng cáo</label>';
              video_adv_field_html += '<div class="video-wrapper no-video">';
              video_adv_field_html += '<img onclick="giaidieu_video_file_trigger(\'video_adv_upload\');" src="/sites/default/files/styles/thumbnail/public/default_images/default-video-thumbnail.jpg" class="no-photo" id="video-adv-photo-thumbnail" />';
              video_adv_field_html += '<span class="custom-op"><i class="fa fa-trash" aria-hidden="true" title="Nhấn để xóa ảnh này." onclick="custom_image_remove(this);"></i></span>';
              video_adv_field_html += '</div>';
              video_adv_field_html += '<input type="file" name="video_adv_upload" id="video_adv_upload" accept="video/mp4,video/avi,video/mov,video/wmv,video/flv" style="display: none" />';
              video_adv_field_html += '<div class="video-add-wrapper">';
                video_adv_field_html += '<span>Thêm video</span>';
                video_adv_field_html += '<div class="video-buttons">';
                  video_adv_field_html += '<div class="video-add" onclick="giaidieu_video_file_trigger(\'video_adv_upload\');">Tải mới</div>';
                  video_adv_field_html += '<div class="video-reuse" onclick="custom_upload_video_library(this);">Thư viện video</div>';
                video_adv_field_html += '</div>';
              video_adv_field_html += '</div>';
            video_adv_field_html += '</div>';
            video_adv_field_html += '<div class="file-desc">';
              video_adv_field_html += '<div class="desc">Kích thước của file phải nhỏ hơn <strong>250 MB.</strong></div>';
              video_adv_field_html += '<div class="desc">Chấp nhận các định dạng video phổ biến: <strong>mp4 avi mov wmv flv.</strong></div>';
            video_adv_field_html += '</div></div>';

        $("#" + id + " #edit-field-video-adv").css('display', 'none');
        $("#" + id + " #edit-field-video-adv").after(video_adv_field_html);          

        // Build a preview list if existing.
        var nid = $("#" + id + " input[name='nid']").val();
        if (nid > 0) {
          custom_services_request('node_media_get', {nid: nid, type: 'video'}, function(result) {
            console.log(result['data']);
            
            if (result['is_error']) {
              alert(result['message']);
              return false;
            }
              
            // Update the list.
            if (result['data'] != undefined && !$.isEmptyObject(result['data'])) {
              if (result['data']['video'] != undefined && result['data']['video']['fid'] > 0) {
                $("#" + id + " #video-photo-thumbnail").closest('div.video-wrapper').removeClass('no-video');
                $("#" + id + " #video-photo-thumbnail").removeClass('no-photo').addClass('photo-thumb');
                $("#" + id + " #video-photo-thumbnail").attr('video_fid', result['data']['video']['fid']);
                $("#" + id + " #video-photo-thumbnail").attr('thumbnail_fid', result['data']['video']['thumbnail_fid']);

                if (result['data']['video']['url'] != '') {
                  $("#" + id + " #video-photo-thumbnail").attr('src', result['data']['video']['url']);
                }
              }
              
              if (result['data']['video_adv'] != undefined && result['data']['video_adv']['fid'] > 0) {
                $("#" + id + " #video-adv-photo-thumbnail").closest('div.video-wrapper').removeClass('no-video');
                $("#" + id + " #video-adv-photo-thumbnail").removeClass('no-photo').addClass('photo-thumb');
                $("#" + id + " #video-adv-photo-thumbnail").attr('video_fid', result['data']['video_adv']['fid']);
                $("#" + id + " #video-adv-photo-thumbnail").attr('thumbnail_fid', result['data']['video_adv']['thumbnail_fid']);
                
                if (result['data']['video_adv']['url'] != '') {
                  $("#" + id + " #video-adv-photo-thumbnail").attr('src', result['data']['video_adv']['url']);
                }
              }
            }
          });
        }

        // Handler the submission. Add fids to list.
        form.find('#edit-submit, #edit-save-continue').click(function() {
          var video_fid = $("#video-photo-thumbnail").attr('video_fid') > 0 ? $("#video-photo-thumbnail").attr('video_fid') : 0;
          var video_thumbnail_fid = $("#video-photo-thumbnail").attr('thumbnail_fid') > 0 ? $("#video-photo-thumbnail").attr('thumbnail_fid') : 0;

          var video_adv_fid = $("#video-adv-photo-thumbnail").attr('video_fid') > 0 ? $("#video-adv-photo-thumbnail").attr('video_fid') : 0;
          var video_adv_thumbnail_fid = $("#video-adv-photo-thumbnail").attr('thumbnail_fid') > 0 ? $("#video-adv-photo-thumbnail").attr('thumbnail_fid') : 0;
          
          if (!video_fid && $("#edit-field-video-youtube-und-0-input").val().trim() == '') {
            if (!$("#edit-field-live-streaming-und").is(':checked')) {
              alert('Xin vui lòng tải lên một Video.');
              return false;
            }
          }
          
          $("#" + id + " input[name='video_fid']").val(video_fid);
          $("#" + id + " input[name='video_thumbnail_fid']").val(video_thumbnail_fid);
          $("#" + id + " input[name='video_adv_fid']").val(video_adv_fid);
          $("#" + id + " input[name='video_adv_thumbnail_fid']").val(video_adv_thumbnail_fid);
        });

        form.addClass('processed');
      }
      
		  // Insert image uploader to replace Drupal core files.
      if ($("form.node-form:not('.processed')").length) {
        var form = $("form.node-form");
        var id = form.attr('id');
        
        // Apply to only some forms.
        var is_custom_image_field = $("#" + id + " input[name='custom_image_field']").val();
        if (is_custom_image_field == undefined || is_custom_image_field != 1) {
          return false;
        }

        var image_placeholder = '<div class="custom-form-wrapper">';
          image_placeholder += '<label>Hình ảnh</label>';
          image_placeholder += '<div class="images_list"></div>';
          
          image_placeholder += '<div id="image-add-wrapper">';
            image_placeholder += '<span>Thêm ảnh</span>';
            image_placeholder += '<div id="image-buttons">';
              image_placeholder += '<div id="image-add">Tải mới</div>';
              image_placeholder += '<div id="image-reuse">Thư viện ảnh</div>';
            image_placeholder += '</div>';
          image_placeholder += '</div>';
        image_placeholder += '</div>';
        
        image_placeholder += '<input type="file" name="product_image" id="fileimage" multiple="multiple" style="display: none;" />';

        if ($("#" + id + " #edit-uc-product-image").length) {
          $("#" + id + " #edit-uc-product-image").css('display', 'none');
          $("#" + id + " #edit-uc-product-image").after(image_placeholder);          
        }
        else if ($("#" + id + " #edit-field-images").length) {
          $("#" + id + " #edit-field-images").css('display', 'none');
          $("#" + id + " #edit-field-images").after(image_placeholder);          
        }

        $("#" + id + " #image-add").click(function() {
          $("#" + id + " #fileimage").click();
        });

        $("#" + id + " #image-reuse").click(function() {
          // Open a dialog for selecting images.
          custom_user_dashoard_open_library();
        });

        giaidieu_file_handler('fileimage', {min_width: 300, min_height: 300, url: '/custom/photo-upload'}, function(image) {
          var list = $("#" + id + " div.custom-form-wrapper div.images_list");
          var item = $('<div class="photo-thumb-wrapper"><span class="custom-op"><i class="fa fa-check-circle-o icon-primary" aria-hidden="true" title="Đặt làm ảnh chính đại diện" onclick="custom_image_set_primary(this);"></i><i class="fa fa-trash" aria-hidden="true" title="Nhấn để xóa ảnh này." onclick="custom_image_remove(this);"></i></span></div>');
          item.append(image);
          list.append(item);
          
          // Set the first image to be primary if none set.
          if (!list.children('.photo-thumb-wrapper.primary').length) {
            list.children('.photo-thumb-wrapper:first-child').addClass('primary');
          }
        });

        // Build a preview list if existing.
        var nid = $("#" + id + " input[name='nid']").val();
        if (nid > 0) {
          custom_services_request('node_media_get', {nid: nid, type: 'image'}, function(result) {
            //console.log(result);
            
            if (result['is_error']) {
              alert(result['message']);
              return false;
            }
              
            // Update the list.
            for (var i = 0; i < result['data'].length; i++) {
              var row = result['data'][i];
              var item = '';
              if (i == 0) {
                item += '<div class="photo-thumb-wrapper primary">';
                item += '<span class="custom-op"><i class="fa fa-trash" aria-hidden="true" title="Nhấn để xóa ảnh này." onclick="custom_image_remove(this);"></i></span>';
                item += '<img class="photo-thumb" alt="' + row['filename'] + '" fid="' + row['fid'] + '" src="' + row['url'] + '" />';
                item += '</div>';
              }
              else{
                item += '<div class="photo-thumb-wrapper">';
                item += '<span class="custom-op"><i class="fa fa-check-circle-o icon-primary" aria-hidden="true" title="Đặt làm ảnh chính đại diện" onclick="custom_image_set_primary(this);"></i><i class="fa fa-trash" aria-hidden="true" title="Nhấn để xóa ảnh này." onclick="custom_image_remove(this);"></i></span>';
                item += '<img class="photo-thumb" alt="' + row['filename'] + '" fid="' + row['fid'] + '" src="' + row['url'] + '" />';
                item += '</div>';                
              }

              $("#" + id + " div.custom-form-wrapper div.images_list").append(item);
            }
          });
        }
        
        // Handler the submission. Add fids to list.
        form.find('#edit-submit, #edit-save-continue').click(function() {
          var fids = [];
          var primary_fid = 0;
          $("#" + id).find('img.photo-thumb').each(function() {
            if ($(this).parent().hasClass('primary')) {
              primary_fid = $(this).attr('fid');
            }
            else{
              fids.push($(this).attr('fid'));
            }
          });
          
          if (!primary_fid) {
            alert('Xin vui lòng tải lên một hình ảnh làm đại diện.');
            return false;
          }
          
          // Add primary fid to top list.
          if (primary_fid > 0) {
            fids.unshift(primary_fid);
          }
          
          $("#" + id + " input[name='fid']").val(fids.join(','));
        });

        form.addClass('processed');
      };
      
      // Add handler to Product node form for automatically calculate the promotion price (node/add/product).
      if ($("#product-service-form-wrapper:not('.processed')").length) {
        var product_addon_wrapper = $("#product-service-form-wrapper div.field-name-field-products-addon");
        var service_addon_wrapper = $("#product-service-form-wrapper div.field-name-field-services-addon");
        
        product_addon_wrapper.on('change', 'div.field-name-field-product-addon input[type="text"]', function() {
          if ($(this).val() == '') {
            $(this).closest('td').find("div.field-name-field-price input[type='text']").val('0');
            $(this).closest('td').find("div.field-name-field-promotion-rate input[type='text']").val('0');
            return false;
          }
          
          // Get original price.
          // var params = $(this).children('option[value="' + $(this).val() + '"]').html().split('Giá bán:');
          var params = $(this).val().split('Giá bán:');
          var list_price = parseInt(params[1].trim().replace(/\Đ|\,/g, ''));
          if (list_price == 0) {
            $(this).closest('td').find("div.field-name-field-price input[type='text']").val('0');
            $(this).closest('td').find("div.field-name-field-promotion-rate input[type='text']").val('0');

            if (!isNaN(parseInt($(this).closest('td').find("div.field-name-field-promotion-rate input[type='text']").val()))) {
              alert('Sản phẩm có giá 0 đ, không áp dụng khuyến mại được.');
            }

            return false;
          }
          
          // Get promotion rate if any.
          var promotion_rate = parseInt($(this).closest('td').find("div.field-name-field-promotion-rate input[type='text']").val());
          if (isNaN(promotion_rate) || promotion_rate < 0) {
            promotion_rate = 0;
            $(this).closest('td').find("div.field-name-field-promotion-rate input[type='text']").val(promotion_rate);
          }
          
          var sell_price = list_price - Math.floor(list_price * promotion_rate / 100);
          $(this).closest('td').find("div.field-name-field-price input[type='text']").val(sell_price);
        });

        product_addon_wrapper.on('blur', 'div.field-name-field-promotion-rate input[type="text"]', function() {
          var promotion_rate = $(this).val() != '' ? parseInt($(this).val()) : 0;
          if (isNaN(promotion_rate) || promotion_rate < 0 || promotion_rate > 100) {
            alert('Vui lòng nhập tỷ lệ phần trăm khuyến mại trong khoảng từ 0-100. Ví dụ: 10');
            $(this).val('0');
            return false;
          }
          
          $(this).val(promotion_rate);          
          
          // Get original price.
          if ($(this).closest('td').find('div.field-name-field-product-addon input[type="text"]').val() == '') {
            alert('Vui lòng chọn sản phẩm mua kèm từ trong danh sách trên.');
            return false;
          }
          var params = $(this).closest('td').find('div.field-name-field-product-addon input[type="text"]').val().split('Giá bán:');
          var list_price = parseInt(params[1].trim().replace(/\Đ|\,/g, ''));
          if (list_price == 0) {
            $(this).closest('td').find("div.field-name-field-promotion-rate input[type='text']").val('0');
            $(this).closest('td').find("div.field-name-field-price input[type='text']").val('0');
            
            alert('Sản phẩm có giá 0 đ, không áp dụng khuyến mại được.');
            return false;
          }
          
          var sell_price = list_price - Math.floor(list_price * promotion_rate / 100);
          $(this).closest('td').find("div.field-name-field-price input[type='text']").val(sell_price);
        });
        
        // Add handler to Product node form for automatically calculate the promotion price (node/add/product) - services add on.
        service_addon_wrapper.on('change', 'div.field-name-field-service input[type="text"]', function() {
          if ($(this).val() == '') {
            $(this).closest('td').find("div.field-name-field-price input[type='text']").val('0');
            $(this).closest('td').find("div.field-name-field-promotion-rate input[type='text']").val('0')
            return false;
          }
          
          // Get original price.
          // var params = $(this).children('option[value="' + $(this).val() + '"]').html().split('Giá:');
          var params = $(this).val().split('Giá:');
          var list_price = parseInt(params[1].trim().replace(/\Đ|\,/g, ''));
          if (list_price == 0) {
            $(this).closest('td').find("div.field-name-field-price input[type='text']").val('0');
            $(this).closest('td').find("div.field-name-field-promotion-rate input[type='text']").val('0');

            if (!isNaN(parseInt($(this).closest('td').find("div.field-name-field-promotion-rate input[type='text']").val()))) {
              alert('Dịch vụ có giá 0 đ, không áp dụng khuyến mại được.');
            }

            return false;
          }
          
          // Get promotion rate if any.
          var promotion_rate = parseInt($(this).closest('td').find("div.field-name-field-promotion-rate input[type='text']").val());
          if (isNaN(promotion_rate) || promotion_rate < 0) {
            promotion_rate = 0;
            $(this).closest('td').find("div.field-name-field-promotion-rate input[type='text']").val(promotion_rate);
          }
          
          var sell_price = list_price - Math.floor(list_price * promotion_rate / 100);
          $(this).closest('td').find("div.field-name-field-price input[type='text']").val(sell_price);
        });
        
        service_addon_wrapper.on('blur', 'div.field-name-field-promotion-rate input[type="text"]', function() {
          var promotion_rate = $(this).val() != '' ? parseInt($(this).val()) : 0;
          if (isNaN(promotion_rate) || promotion_rate < 0 || promotion_rate > 100) {
            alert('Vui lòng nhập tỷ lệ phần trăm khuyến mại trong khoảng từ 0-100. Ví dụ: 10');
            $(this).val('0');
            return false;
          }
          
          $(this).val(promotion_rate);

          // Get original price.
          if ($(this).closest('td').find('div.field-name-field-service input[type="text"]').val() == '_none') {
            alert('Vui lòng chọn dịch vụ mua kèm từ trong danh sách trên.');
            return false;
          }
          var params = $(this).closest('td').find('div.field-name-field-service input[type="text"]').val().split('Giá:');
          var list_price = parseInt(params[1].trim().replace(/\Đ|\,/g, ''));
          if (list_price == 0) {
            $(this).closest('td').find("div.field-name-field-promotion-rate input[type='text']").val('0');
            $(this).closest('td').find("div.field-name-field-price input[type='text']").val('0');
            
            alert('Dịch vụ có giá 0 đ, không áp dụng khuyến mại được.');
            return false;
          }
          
          var sell_price = list_price - Math.floor(list_price * promotion_rate / 100);
          $(this).closest('td').find("div.field-name-field-price input[type='text']").val(sell_price);
        });
        
        // No more duplicates.
        $("#product-service-form-wrapper").addClass('processed');
      }
		}
  };
})(jQuery);