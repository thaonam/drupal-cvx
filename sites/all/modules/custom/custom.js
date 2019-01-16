/* custom.js file created by giaidieu */ 
(function($){
	Drupal.behaviors.custom = {
		attach: function(context, settings) {
		  // User profile popup notice.
      if ($("body:not('.processed')").length) {
        // Add a flag for detecting accessing from App mobile.
        if (Drupal.settings['app_order'] != undefined && Drupal.settings['app_order']) {
          $("body").addClass('is-app-access');
          
          // Auto click on radio.
          $("#uc-cart-checkout-form fieldset#payment-pane input[value='" + Drupal.settings['payment_method'] + "']").click();
        }
        
        // Delete a coupon.
        $("a.coupon-delete").click(function() {
          if (confirm('Bạn chắc chắn muốn xóa Mã này? Thao tác sẽ không thể đảo ngược.')) {
            var cid = $(this).attr('cid');
          
            if (parseInt(cid) > 0) {
              custom_coupon_delete(cid);
            }
            else{
              document.location.href = document.location.href;
            }
          }
          
          return false;
        });
        
        // Turn on Chosen select field for some multiple select.
        $("select.custom-dropdown-enabled").each(function() {
          $(this).select2({
            //minimumResultsForSearch: 10,
            language: {
              noResults: function () {
                return 'Không tìm thấy.';
              }
            }
          });

          if ($(this).hasClass('is-tagging-enabled')) {
            $(this).select2({
              allowClear: true,
              tags: true,
              tokenSeparators: [',', ';']
            });
          }
        });
        
        // Detect and send alert to user about profile completeness.
        custom_profile_alert_popup();

        $("body").addClass('processed');
      }
      
      // Add acctions button to admin content page
      if ($('.custom-action').length) {
        $('.custom-action').each(function () {
          $(this).attr('onclick', this.dataset.action + '('+ this.dataset.nid +', this)');
          if (this.dataset.action == 'custom_node_set_sticky') {
            if ($(this).attr('status') == '1') {
              $(this).children('span').html('Bỏ nổi bật');
            }
          }
          if (this.dataset.action == 'custom_node_set_published') {
            if ($(this).attr('status') == '0') {
              $(this).children('span').html('Mở khóa');
            }
          }
        })
      }

		  // Set all matching textarea to be rich text editor.
      $("textarea.rich_text_enabled:not('.processed')").each(function() {
        var element_id = jQuery(this).attr('id');
        $(this).addClass('processed');
      });
      
		  // Form handler.
      if ($("div.custom-form-wrapper:not('.processed')").length) {
        // Auto format the price for first time load (in edit form).
        if ($("div.custom-form-wrapper input[name='list_price']").length && $("div.custom-form-wrapper input[name='list_price']").val() != '') {
          custom_thousand_format_auto($("div.custom-form-wrapper input[name='list_price']"));
        }
        if ($("div.custom-form-wrapper input[name='sell_price']").length && $("div.custom-form-wrapper input[name='sell_price']").val() != '') {
          custom_thousand_format_auto($("div.custom-form-wrapper input[name='sell_price']"));
        }
        if ($("div.custom-form-wrapper input[name='list_price']").length || $("div.custom-form-wrapper input[name='sell_price']").length) {
          custom_promotion_price_update();
        }
        
        // Put an image file handler for product/service form.
        if ($("#fileimage").length) {
          $("#image-add").click(function() {
            $("#fileimage").click();
          });

          $("#image-reuse").click(function() {
            // Open a dialog for selecting images.
            custom_user_dashoard_open_library();
          });
        
          giaidieu_file_handler('fileimage', {min_width: 300, min_height: 300, url: '/custom/photo-upload'}, function(image) {
            var list = $("div.custom-form-wrapper div.images_list");
            var item = $('<div class="photo-thumb-wrapper"><span class="custom-op"><i class="fa fa-check-circle-o icon-primary" aria-hidden="true" title="Đặt làm ảnh chính đại diện" onclick="custom_image_set_primary(this);"></i><i class="fa fa-trash" aria-hidden="true" title="Nhấn để xóa ảnh này." onclick="custom_image_remove(this);"></i></span></div>');
            item.append(image);
          
            $("#image-add-wrapper").before(item);
          
            // Set the first image to be primary if none set.
            if (!list.children('.photo-thumb-wrapper.primary').length) {
              list.children('.photo-thumb-wrapper:first-child').addClass('primary');
            }
          });
        }
        
        $("div.custom-form-wrapper").addClass('processed');
      }

      // Put image file handler for user profile form.
      if ($("div#custom-user-edit-form-wrapper:not('.processed')").length) {
        $("#avatar-image-add").click(function() {
          $("#avatar-image").click();
        });

        $("#cover-image-add").click(function() {
          $("#cover-image").click();
        });

        giaidieu_file_handler('avatar-image', {min_width: 300, min_height: 300, url: '/custom/photo-upload'}, function(image) {
          var item = $("div#custom-user-edit-form-wrapper div.images_list div.photo-thumb-wrapper.avatar");
          image.removeClass('photo-thumb').addClass('photo-thumb-avatar');
          item.empty().append(image);
        });

        giaidieu_file_handler('cover-image', {min_width: 300, min_height: 300, url: '/custom/photo-upload'}, function(image) {
          var item = $("div#custom-user-edit-form-wrapper div.images_list div.photo-thumb-wrapper.cover");
          image.removeClass('photo-thumb').addClass('photo-thumb-cover');
          item.empty().append(image);
        });

        $("div#custom-user-edit-form-wrapper").addClass('processed');
      }

		  // Handle the forgot password popup.
      if ($("#forgot-password:not('.processed')").length) {
        $("#forgot-password").click(function(e) {
          e.preventDefault();
          
          if ($("#custom-password-form-wrapper").length) {
            $("#custom-password-form-wrapper").remove();
          }
          
          // Build and show dialog.
          $.post('/custom/password-form', {}, function(data) {
            $('body').append(data);
            $("#custom-password-form-wrapper").dialog({
              modal: true,
              width: 600,
              // height: 532,
              autoOpen: true,
              draggable: false,
              resizable: false
            });
          }, 'json');
          
          return false;
        });
        
        $("#forgot-password").addClass('processed');
      }
      
      // Handle the login / register popup.
      if ($("#block-system-user-menu:not('.processed')").length) {
        // Login popup load.
        $("#block-system-user-menu ul.menu li a[href='/custom/login-form']").click(function(e) {
          e.preventDefault();
          
          if ($("#custom-login-form-wrapper").length) {
            $("#custom-login-form-wrapper").remove();
          }
          
          // Build and show dialog.
          $.post('/custom/login-form', {}, function(data) {
            $('body').append(data);
            $("#custom-login-form-wrapper").dialog({
              modal: true,
              width: 600,
              // height: 532,
              autoOpen: true,
              draggable: false,
              resizable: false
            });
          }, 'json');
          
          return false;
        });

        // Register popup load.
        $("#block-system-user-menu ul.menu li a[href='/custom/register-form']").click(function(e) {
          e.preventDefault();

          if ($("#custom-register-form-wrapper").length) {
            $("#custom-register-form-wrapper").remove();
          }
          
          // Build and show dialog.
          $.post('/custom/register-form', {}, function(data) {
            $('body').append(data);
            
            // Auto check for customer by default.
            $("#custom-register-form-wrapper").find('#type_customer').click();
              
            $("#custom-register-form-wrapper").dialog({
              modal: true,
              width: 600,
              // height: 532,
              autoOpen: true,
              draggable: false,
              resizable: false
            });
          }, 'json');
          
          return false;
        });
        
        $("#block-system-user-menu").addClass('processed');
      }

      // Khi tạo node slideshow cho "Trang khách hàng" sẽ hiện field Video Youtube, nếu không sẽ ẩn đi.
      if ($('form.node-slideshow-form .field-name-field-video-youtube').length) {
        $('form.node-slideshow-form .field-name-field-video-youtube').hide();
        var feedback = $('form.node-slideshow-form .field-name-field-slide-position [name="field_slide_position[und]"]');
        if (feedback.val() == 327) {
          $('form.node-slideshow-form .field-name-field-video-youtube').show();
          if ($('form.node-slideshow-form .field-name-field-video-youtube').find('input').val() != '') {
            $('form.node-slideshow-form .field-name-body').hide();
            $('form.node-slideshow-form .field-name-field-intro-slide').hide();
            $('form.node-slideshow-form .field-name-field-images').hide();
          }
        }
        feedback.change(function () {
          if (this.value == 327) {
            $('form.node-slideshow-form .field-name-field-video-youtube').show();
          } else {
            $('form.node-slideshow-form .field-name-field-video-youtube').hide();
          }
        });
        $('form.node-slideshow-form .field-name-field-video-youtube').find('input').keyup(function (e) {
          if (this.value != '') {
            $('form.node-slideshow-form .field-name-body').hide();
            $('form.node-slideshow-form .field-name-field-intro-slide').hide();
            $('form.node-slideshow-form .field-name-field-images').hide();
          } else {
            $('form.node-slideshow-form .field-name-body').show();
            $('form.node-slideshow-form .field-name-field-intro-slide').show();
            $('form.node-slideshow-form .field-name-field-images').show();
          }
        })
      }
		}
  };
})(jQuery);
