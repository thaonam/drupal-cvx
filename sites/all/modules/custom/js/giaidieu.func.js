/* custom function made by giaidieu.com */

/**
 * Event handler for register form when Account type is changed.
 */
function custom_account_type_changes(obj, account_type) {
  var wrapper = jQuery("#custom-register-form-wrapper");
  
  if (account_type == 0) {
    wrapper.find('input[name="fullname"]').parent().css('display', 'none');
    wrapper.find('input[name="mobile"]').parent().css('display', 'none');
    wrapper.find('select[name="city"]').parent().css('display', 'none');
  }
  else if (account_type == 1) {
    wrapper.find('input[name="fullname"]').parent().css('display', 'block');
    wrapper.find('input[name="mobile"]').parent().css('display', 'block');
    wrapper.find('select[name="city"]').parent().css('display', 'block');
  }
}

/**
 * Open user image library.
 */
function custom_user_dashoard_open_library() {
            if (!jQuery("#custom-user-files-wrapper").length) {
              var div = jQuery("<div id='custom-user-files-wrapper'></div>");
              div.dialog({
                modal: true,
                width: 600,
                height: 400,
                autoOpen: true,
                closeOnEscape: true,
                title: 'Thư viện ảnh của bạn',
                buttons: [
                  {
                    text: 'Chọn ảnh',
                    class: 'button-ok',
                    click: function() {
                      // Collect all those selected image.
                      var selected_files = [];
                      div.find('.file-wrapper.selected').each(function() {
                        selected_files.push({fid: jQuery(this).attr('fid'), src: jQuery(this).find('img').attr('src')});
                        jQuery(this).removeClass('selected');
                      });
                      
                      // Update the list.
                      if (selected_files.length) {
                        for (var i = 0; i < selected_files.length; i++) {
                          var image = '<img src="' + selected_files[i]['src'] + '" fid="' + selected_files[i]['fid'] + '" class="photo-thumb" />';
                          var list = jQuery("div.custom-form-wrapper div.images_list");
                          var item = jQuery('<div class="photo-thumb-wrapper"><span class="custom-op"><i class="fa fa-check-circle-o icon-primary" aria-hidden="true" title="Đặt làm ảnh chính đại diện" onclick="custom_image_set_primary(this);"></i><i class="fa fa-trash" aria-hidden="true" title="Nhấn để xóa ảnh này." onclick="custom_image_remove(this);"></i></span></div>');
                          item.append(image);
                          
                          if (jQuery("td.file_upload").length) {
                            jQuery("#image-add-wrapper").before(item);                            
                          }
                          else{
                            list.append(item);
                          }
          
                          // Set the first image to be primary if none set.
                          if (!list.children('.photo-thumb-wrapper.primary').length) {
                            list.children('.photo-thumb-wrapper:first-child').addClass('primary');
                          }
                        }
                      }
                      else{
                        alert('Bạn chưa chọn ảnh nào. Vui lòng nhấn chuột lên ảnh để chọn.');
                        return false;
                      }
                      
                      jQuery(this).dialog("close");
                    }
                  },
                  {
                    text: 'Bỏ qua',
                    class: 'button-cancel',
                    click: function() {
                      jQuery(this).dialog("close");
                    }
                  }
                ]
              });
              
              jQuery.get('/custom/user/files/image', {}, function(result) {
                div.html(result);
                
                // Make file is selectable.
                div.on('click', 'div.file-wrapper', function() {
                  if (jQuery(this).hasClass('selected')) {
                    jQuery(this).removeClass('selected');
                  }
                  else{
                    jQuery(this).addClass('selected');
                  }
                });
              });
            }
            else{
              jQuery("#custom-user-files-wrapper").dialog('open');
            }
}

/**
 * Verify a course video code.
 */
function custom_video_course_code_verify(obj, nid) {
  if (jQuery(obj).hasClass('disabled')) {return false;}

  var code = jQuery(obj).parent().find('input[name="video_code"]').val().trim();
  if (code == '') {
    alert('Vui lòng nhập mã khóa học để tiếp tục.');
    return false;
  }
  
  jQuery(obj).addClass('disabled');
  custom_services_request('video_course_code_verify', {nid: nid, code: code}, function(result) {
    jQuery(obj).removeClass('disabled');
    
    if (result['is_error']) {
      jQuery(obj).parent().find('input[name="video_code"]').val('');
      alert(result['message']);
      return false;
    }
    else{
      // Allow to watch the video.
      var params = document.location.href.split(/\?/);
      document.location.href = params[0] + '?c=' + result['code'];
    }
  });
  
  return false;
}

/**
 * Delete a coupon.
 */
function custom_coupon_delete(cid) {
  custom_services_request('coupon_delete', {cid: cid}, function(result) {
    alert(result['message']);
    document.location.href = document.location.href;
  });
}

/**
 * Check SKU and show result on field suffix.
 */
function custom_sku_is_existed(obj) {
  var sku = jQuery(obj).val().trim();
  if (sku == '' || sku == jQuery(obj).attr('sku') || sku == jQuery(obj).attr('last-check')) {return false;}
  
  // Show a message let you know this is in checking.
  jQuery(obj).next('span.sku-status').removeClass('ok').removeClass('error').html('Đang kiểm tra...');
  
  custom_services_request('sku_is_existed', {sku: sku}, function(result) {
    // Update last check so that it won't check again.
    jQuery(obj).attr('last-check', sku);
    
    if (result['is_error']) {
      jQuery(obj).next('span.sku-status').addClass('error').html(result['message']);
    }
    else{
      jQuery(obj).next('span.sku-status').addClass('ok').html(result['message']);
    }
  });
}

/**
 * Add more group field for product / service addon.
 */
function custom_group_add_more(obj) {
  if (jQuery(obj).hasClass('disabled')) {return false;}
  jQuery(obj).addClass('disabled');
  
  var group = jQuery(obj).parent().children('ul.field-group').last();
  if (!group.length) {return false;}
  
  // Remove select2 before cloning.
  group.find('select.field-node').select2('destroy');
  
  // Clone to add more group fields.
  var item_no = parseInt(group.attr('rel')) + 1;
  var item_type = group.attr('type');
  var group_clone = group.clone();
  
  group_clone.attr('rel', item_no);
  group_clone.find('select.field-node').attr('name', item_type + '_addon_' + item_no);
  group_clone.find('input.field-promotion').attr('name', item_type + '_addon_promotion_' + item_no).val('0');
  group_clone.find('input.field-sell-price').attr('name', item_type + '_addon_sell_price_' + item_no).val('0');
  
  // Show.
  group.after(group_clone);

  // Reinit all select2s.
  group.find('select.field-node').select2({
    language: {
      noResults: function () {
        return 'Không tìm thấy.';
      }
    }
  });

  group_clone.find('select.field-node').select2({
    language: {
      noResults: function () {
        return 'Không tìm thấy.';
      }
    }
  });

  jQuery(obj).removeClass('disabled');
  return false;
}

/**
 * Product / Service addons select in user dashboard.
 */
function custom_addon_select(obj) {
  // Collect info.
  var nid = jQuery(obj).val();
  var list_price = nid > 0 ? jQuery(obj).children('option[value="' + nid + '"]').attr('list_price') : 0;
  var group = jQuery(obj).closest('ul.field-group');
  
  // Update to fields.
  group.find('input.field-sell-price').val(custom_thousand_format(list_price, ','));
}

/**
 * Product / Service addons promotion.
 */
function custom_addon_promotion_select(obj) {  
  // Collect info.
  var group = jQuery(obj).closest('ul.field-group');
  var nid = parseInt(group.find('select.field-node').val());
  if (!nid) {return false;}
    
  var list_price = parseInt(group.find('select.field-node').children('option[value="' + nid + '"]').attr('list_price'));
  var promotion_rate = parseInt(jQuery(obj).val());
  if (isNaN(promotion_rate)) {return false;}

  // Calculate sell_price.
  var sell_price = list_price - Math.floor(list_price * promotion_rate / 100);
  group.find('input.field-sell-price').val(custom_thousand_format(sell_price, ','));
}

/**
 * Submit to create / edit a product combo.
 */
function custom_product_combo_form_submit(obj) {
  var submit = jQuery(obj);
    
  // Collect info.
  var uid = jQuery("#custom-product-combo-form-wrapper input[name='uid']").val();
  var nid = jQuery("#custom-product-combo-form-wrapper input[name='nid']").val();
  
  var title = jQuery("#custom-product-combo-form-wrapper input[name='title']").val().trim();
  var sku = jQuery("#custom-product-combo-form-wrapper input[name='sku']").val().trim();
  
  var list_price = jQuery("#custom-product-combo-form-wrapper input[name='list_price']").val().replace(/\s+|\,/g, '');
  var sell_price = jQuery("#custom-product-combo-form-wrapper input[name='sell_price']").val().replace(/\s+|\,/g, '');
  
  // Get products / services list.
  // Update total available price.
  var list = jQuery("#custom-combo-list-wrapper ul");
  var product_combo_list = [];

  if (list.children('li:not(".remove")').length) {
    list.children('li:not(".remove")').each(function() {
      product_combo_list.push(jQuery(this).attr('nid'));
    });
  }

  var product_images = [];
  var product_images_primary = 0;
  jQuery("#custom-product-combo-form-wrapper div.images_list div.photo-thumb-wrapper").each(function() {
    product_images.push(jQuery(this).children('img.photo-thumb').attr('fid'));
    
    if (jQuery(this).hasClass('primary')) {
      product_images_primary = jQuery(this).children('img.photo-thumb').attr('fid');
    }
  });
  
  // Validate all the required fields.
  if (title == '') {
    alert('Xin vui lòng nhập Tên sản phẩm.');
    return false;
  }

  if (sku == '') {
    alert('Xin vui lòng nhập Mã hàng.');
    return false;
  }
  
  if (!product_combo_list.length) {
    alert('Xin vui lòng chọn ít nhất một Sản phẩm hoặc Dịch vụ để đưa vào gói Combo.');
    return false;
  }

  if (!product_images.length) {
    alert('Xin vui lòng tải Hình ảnh cho sản phẩm.');
    return false;
  }

  if (sell_price == '' || parseInt(sell_price) == NaN) {
    alert('Xin vui lòng nhập Giá bán cho sản phẩm Combo này.');
    return false;
  }

  // Prepare data for product combo creation.
  var node_fields = {
    type: 'combo',
    title: title,
    model: sku,
    product_images: {
      product_images: product_images,
      product_images_primary: product_images_primary
    },
    list_price: (list_price != '') ? list_price : 0,
    sell_price: (sell_price != '') ? sell_price : 0,
    product_combo_list: {'product_combo_list': product_combo_list},
    status: 0
  };

  // Send data to server for creation.
  submit.attr('disabled', true);
  custom_services_request('node_store', {nid: nid, node_fields: node_fields}, function(result) {
    submit.attr('disabled', false);
    
    if (result['error']) {
      alert(result['message']);
      return false;
    }
    
    // Go to product list.
    if (nid == 0) {
      alert('Sản phẩm Combo đã được tạo thành công. Nhấn OK để chuyển tới trang Xem Sản Phẩm.');
    }
    else{
      alert('Sản phẩm Combo đã được sửa thành công. Nhấn OK để chuyển tới trang Xem Sản Phẩm.');
    }
    document.location.href = '/user/shop/combo';
  });
  
  return false;
}

/**
 * Remove an item from combo list.
 */
function custom_product_service_remove_from_combo_list(nid, price) {
  // Remove from list.
  jQuery("#custom-combo-list-wrapper ul li[nid='" + nid + "']").addClass('remove').fadeOut(function() {
    jQuery(this).remove();
  });
  
  // Update dropdown - Show it again.
  var select = jQuery('#custom-product-combo-form-wrapper select[name="product_service_group"]');
  select.find('option[value="' + nid + '"]').removeClass('hide').show();

  // Update number of available items left.
  var product_total = select.find('optgroup.product option:not(".hide")').length;
  select.children('optgroup.product').attr('label', 'Sản Phẩm (' + product_total + ')');

  var service_total = select.find('optgroup.service option:not(".hide")').length;
  select.children('optgroup.service').attr('label', 'Dịch Vụ (' + service_total + ')');

  // Update total available price.
  var list = jQuery("#custom-combo-list-wrapper ul");
  var total_list_price = 0;
  
  if (list.children('li:not(".remove")').length) {
    list.children('li:not(".remove")').each(function() {
      total_list_price += parseInt(jQuery(this).attr('price'));
    });
  }
  
  jQuery("#custom-product-combo-form-wrapper input[name='list_price']").val(custom_thousand_format(total_list_price, ','));
  
  // Recalculate Sell price.
  var promotion_rate = jQuery("#custom-product-combo-form-wrapper input[name='product_percent']").val();
  if (promotion_rate == '') {
    promotion_rate = 0;
    jQuery("#custom-product-combo-form-wrapper input[name='product_percent']").val(promotion_rate);
  }
  
  var sell_price = total_list_price - (total_list_price * promotion_rate / 100);
  jQuery("#custom-product-combo-form-wrapper input[name='sell_price']").val(custom_thousand_format(sell_price, ','));
}

/**
 * Select to add a product / service to combo list (user backend). 
 */
function custom_product_service_add_to_combo_list(obj) {
  var list = jQuery("#custom-combo-list-wrapper ul");
  var nid = jQuery(obj).val();
  if (!nid) {return false;}
  
  // Get the option row.
  var row = jQuery(obj).find('option[value="' + nid + '"]');
  
  // Add to list.
  list.append('<li nid="' + nid + '" price="' + row.attr('price') + '">' + row.html() + '<span onclick="custom_product_service_remove_from_combo_list(' + nid + ');"><i class="fa fa-minus-circle" aria-hidden="true"></i></span></li>');
  
  // Hide item from dropdown list.
  jQuery(row).addClass('hide').hide();
  jQuery(obj).val('0');
  
  // Update number of available items left.
  var product_total = jQuery(obj).find('optgroup.product option:not(".hide")').length;
  jQuery(obj).children('optgroup.product').attr('label', 'Sản Phẩm (' + product_total + ')');

  var service_total = jQuery(obj).find('optgroup.service option:not(".hide")').length;
  jQuery(obj).children('optgroup.service').attr('label', 'Dịch Vụ (' + service_total + ')');

  // Update total available price.
  var total_list_price = 0;
  
  if (list.children('li').length) {
    list.children('li').each(function() {
      total_list_price += parseInt(jQuery(this).attr('price'));
    });
  }
  
  jQuery("#custom-product-combo-form-wrapper input[name='list_price']").val(custom_thousand_format(total_list_price, ','));
  
  // Recalculate Sell price.
  var promotion_rate = jQuery("#custom-product-combo-form-wrapper input[name='product_percent']").val();
  if (promotion_rate == '') {
    promotion_rate = 0;
    jQuery("#custom-product-combo-form-wrapper input[name='product_percent']").val(promotion_rate);
  }
  
  var sell_price = total_list_price - (total_list_price * promotion_rate / 100);
  jQuery("#custom-product-combo-form-wrapper input[name='sell_price']").val(custom_thousand_format(sell_price, ','));
}

/**
 * Detect and send alert to user about profile completeness.
 */
function custom_profile_alert_popup() {
  // Continue only for logged in user.
  var uid = jQuery("body").attr('uid');
  if (!parseInt(uid) || jQuery("body").hasClass('page-cart')) {return false;}
        
  // Contract the today date string.
  var today = new Date();
  var today_str = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();

  var storage = jQuery.localStorage;
  var tasscare = !storage.isEmpty('tasscare') ? storage.get('tasscare') : {};

  // If already enough for the day, stop.
  if (!jQuery.isEmptyObject(tasscare) && !jQuery.isEmptyObject(tasscare.user) && !jQuery.isEmptyObject(tasscare.user[uid])) {
    if (tasscare.user[uid].profile_popup_never_again == 1 || tasscare.user[uid].profile_popup_already_today == today_str) {
      return false;
    }
  }

  // Get user info from server.
  custom_services_request('user_profile_completeness', {}, function(result) {
    if (result && result.data.profile_complete_percent < 100 && result.data.profile_popup_no <= result.data.profile_popup_max) {
      // Show the popup.
      jQuery('body').append(result.message);
      jQuery("#custom-profile-alert-popup-wrapper").dialog({
        modal: true,
        width: 350,
        height: 300,
        autoOpen: true
      });

      // Update the show to user's localstorage.
      if (tasscare.user == undefined) {tasscare.user = {};}
            
      tasscare.user[uid] = {
        profile_popup_never_again: result.data.profile_popup_no == result.data.profile_popup_max ? 1 : 0,
        profile_popup_already_today: today_str
      }
    }
    else{
      // Update.
      profile_popup_never_again = 0;
      if (result.data.profile_complete_percent == 100 || result.data.profile_popup_no == result.data.profile_popup_max) {
        profile_popup_never_again = 1;
      }

      // Update the show to user's localstorage.
      if (tasscare.user == undefined) {tasscare.user = {};}
            
      tasscare.user[uid] = {
        profile_popup_never_again: profile_popup_never_again,
        profile_popup_already_today: today_str
      }
    }
          
    storage.set('tasscare', tasscare);
  });
}

/**
 * Close a dialog popup.
 */
function custom_dialog_close(obj) {
  var popup_id = jQuery(obj).closest('div.dialog-popup').attr('id');
  jQuery("#" + popup_id).dialog('close');
}

/**
 * Update an order status.
 */
function custom_uc_order_update_status(order_id, obj) {
  if (confirm('Bạn chắc chắn muốn CẬP NHẬT TRẠNG THÁI MỚI cho đơn hàng này?')) {
    var new_status = jQuery("#custom-order-form-wrapper select[name='order_status']").val();
    var current_status = jQuery("#custom-order-form-wrapper select[name='order_status']").attr('current_status');
    
    if (new_status == current_status) {
      alert('Xin vui lòng chọn trạng thái mới cho đơn hàng để cập nhật.');
      return false;
    }

    // Disable the button then send to server for update.
    jQuery(obj).attr('disabled', true);
    custom_services_request('ubercart_order_update_status', {order_id: order_id, order_status: new_status}, function(result) {
      jQuery(obj).attr('disabled', false);
      
      if (result['error']) {
        alert(result['message']);
        return false;
      }
      
      // Done.
      jQuery("#custom-order-form-wrapper select[name='order_status']").attr('current_status', new_status);
      alert(result['message']);
    });
  }
}


/**
 * Khách hàng tự huỷ đơn.
 */
function custom_uc_order_customer_canceled_by_customer(order_id, obj) {
  if (confirm('Bạn chắc chắn muốn HUỶ đơn hàng này?')) {
    var new_status = 'canceled_by_customer';
    // Disable the button then send to server for update.
    jQuery(obj).attr('disabled', true);
    custom_services_request('ubercart_order_update_status', {order_id: order_id, order_status: new_status}, function(result) {      
      if (result['error']) {
        alert(result['message']);
        return false;
      }
      
      // Done.
      jQuery(obj).prev('.customer-order-status').text('Đơn Hàng Đã Bị Huỷ');
      jQuery(obj).remove();
      alert(result['message']);
    });
  }
}

/**
 * Node op: refresh.
 */
function custom_node_set_refresh(nid, obj) {
  if (confirm('Bạn chắc chắn muốn LÀM MỚI nội dung này?')) {
    custom_services_request('node_set_refresh', {nid: nid}, function(result) {
      if (result['error']) {
        alert(result['message']);
        return false;
      }
      
      // Return message and make this icon not clickable in 1 min.
      // To-do.
      alert(result['message']);
      
      // Move to the stop list.
      var nth = jQuery(obj).closest('.view-content').find('.node-sticky').length;
      if (nth == 0)
        jQuery(obj).closest('.views-row').prependTo(jQuery(obj).closest('.view-content'));
      else
        jQuery(obj).closest('.view-content').find('.views-row:nth-child('+ nth +')').after(jQuery(obj).closest('.views-row'));
    });
  }
}

/**
 * Node op: sticky.
 */
function custom_node_set_sticky(nid, obj) {
  var status = jQuery(obj).attr('status') == 1 ? 0 : 1; // New status to be set.
  var text = status == 1 ? 'NỔI BẬT' : 'BỎ NỔ BẬT';
  
  if (confirm('Bạn chắc chắn muốn đặt ' + text + ' nội dung này?')) {
    custom_services_request('node_set_sticky', {nid: nid, status: status}, function(result) {
      if (result['error']) {
        alert(result['message']);
        return false;
      }
      
      // Change to new status.
      jQuery(obj).attr('status', status);
      
      if (status == 1) {
        // Change from unsticky to sticky.
        jQuery(obj).children('i.fa').removeClass('fa-star');
        jQuery(obj).children('i.fa').addClass('fa-star-o');
        jQuery(obj).children('span').html('Bỏ nổi bật');
      }
      else{
        jQuery(obj).children('i.fa').removeClass('fa-star-o');
        jQuery(obj).children('i.fa').addClass('fa-star');
        jQuery(obj).children('span').html('Nổi bật');
      }

      alert(result['message']);
    });
  }
}

/**
 * Node op: published.
 */
function custom_node_set_published(nid, obj) {
  var status = jQuery(obj).attr('status') == 1 ? 0 : 1; // New status to be set.
  var text = status == 1 ? 'MỞ KHÓA' : 'KHÓA';

  if (confirm('Bạn chắc chắn muốn ' + text + ' nội dung này?')) {
    custom_services_request('node_set_published', {nid: nid, status: status}, function(result) {
      if (result['error']) {
        alert(result['message']);
        return false;
      }
      
      // Change status of this node.
      jQuery(obj).attr('status', status);
      
      if (status == 1) {
        // Change from unpublished to published.
        jQuery(obj).children('i.fa').removeClass('fa-unlock');
        jQuery(obj).children('i.fa').addClass('fa-lock');
        jQuery(obj).children('span').html('Khóa');
      }
      else{
        jQuery(obj).children('i.fa').removeClass('fa-lock');
        jQuery(obj).children('i.fa').addClass('fa-unlock');
        jQuery(obj).children('span').html('Mở khóa');
        jQuery(obj).attr('title', 'Liên hệ với quản trị viên để mở khóa nội dung').addClass('disabled').removeAttr('onclick');
      }

      alert(result['message']);
    });
  }
}

/**
 * Node op: edited.
 */
function custom_node_set_edited(nid, content_type) {
  if (confirm('Bạn chắc chắn muốn SỬA nội dung này?')) {
    document.location.href = '/user/' + content_type + '/edit/' + nid;
  }
}

/**
 * Node op: deleted.
 */
function custom_node_set_deleted(nid, obj) {
  if (confirm('Bạn chắc chắn muốn XÓA nội dung này?')) {
    custom_services_request('node_set_deleted', {nid: nid}, function(result) {
      if (result['error']) {
        alert(result['message']);
        return false;
      }
      
      // Remove it.
      jQuery(obj).closest('.views-row').fadeOut(function() {
        jQuery(this).remove();
      });
    });
  }
}

/**
 * Toogle to hide / show adding more seller form.
 */
function custom_seller_add_more(obj) {
  if (jQuery(obj).hasClass('add-seller')) {
    // Reset the seller list.
    jQuery(obj).parent().find('select').val('0').trigger('change');
    
    // Show it.
    jQuery("#seller-add-new-wrapper").fadeIn();
    jQuery("#seller-add-new-wrapper input[name='field_intro_seller_title']").focus();
    
    jQuery("#seller-edit-wrapper").attr('data-nid', 0).fadeOut();
    jQuery('#seller-edit-wrapper').fadeOut();
  }
  else{
    // Hide new field if exist.
    jQuery("#seller-add-new-wrapper").fadeOut();
    if (obj.value != 0) {
      jQuery(obj).parent().find('span.edit-seller').attr('data-nid', obj.value).fadeIn();
      jQuery('#seller-edit-wrapper').fadeOut();
    }
    else{
      jQuery(obj).parent().find('span.edit-seller').attr('data-nid', 0).fadeOut();
      jQuery('#seller-edit-wrapper').fadeOut();
    }
  }
}

/**
 * Edit exit seller
 */
function custom_seller_edit(obj) {
  var edit = jQuery('#seller-edit-wrapper');
  if (obj.dataset && obj.dataset.nid > 0) {
    var curNode = jQuery.get('/drupalgap/node/'+ obj.dataset.nid +'.json', function (node) {
      edit.fadeIn();
      edit.find('[name="edit_intro_seller_title"]').val(node.title);
      CKEDITOR.instances['field_edit_intro_seller_body'].setData(node.body.und["0"].value);
    });

  }
}

/**
 * Detect to add new term if not existing in the list.
 */
function custom_add_more(obj) {
  // Get field id.
  var field_new_id = jQuery(obj).attr('name') + '_add_new';

  if (jQuery(obj).val() == 'new') {
    // Show it.
    if (jQuery("#" + field_new_id).length) {
      jQuery("#" + field_new_id).fadeIn().focus();
    }
    else{
      var field_new = jQuery('<input style="display: none;" type="text" class="field-add-new-term" id="' + field_new_id + '" value="" placeholder="Vui lòng nhập.. *"></div>');
      jQuery(obj).after(field_new);
      field_new.fadeIn().focus();
    }
  }
  else{
    // Hide new field if exist.
    if (jQuery("#" + field_new_id).length) {
      jQuery("#" + field_new_id).fadeOut();
    }
  }
}

/**
 * set an image to be primary / cover.
 */
function custom_image_set_primary(obj) {
  if (confirm('Bạn chắc chắn muốn sử dụng ảnh này làm hình đại diện chính khi hiện ra bên ngoài?')) {
    // Remove the current primary image status.
    jQuery(obj).closest('div.images_list').children('.photo-thumb-wrapper.primary').removeClass('primary');
    
    // Set new primary.
    jQuery(obj).closest('div.photo-thumb-wrapper').addClass('primary');
  }
}

/**
 * Remove an image file from the list.
 */
function custom_image_remove(obj) {
  if (confirm('Bạn chắc chắn muốn HỦY BỎ ảnh này? Lưu ý: Thao tác sẽ không thể đảo ngược.')) {
    if (jQuery("#video-node-form").length || jQuery("#custom-video-form-wrapper").length) {
      jQuery(obj).closest('div.video-wrapper').addClass('no-video');
      jQuery(obj).closest('div.video-wrapper').children('img').attr('src', '/sites/default/files/styles/thumbnail/public/default_images/default-video-thumbnail.jpg');
      jQuery(obj).closest('div.video-wrapper').children('img').removeClass('photo-thumb').addClass('no-photo');
      jQuery(obj).closest('div.video-wrapper').children('img').attr('video_fid', '');
      jQuery(obj).closest('div.video-wrapper').children('img').attr('thumbnail_fid', '');
    }
    else{
      jQuery(obj).closest('div.photo-thumb-wrapper').fadeOut(function() {
        jQuery(this).remove();
      });
    }
  }
}

/**
 * Update promotion price.
 */
function custom_promotion_price_update() {
  var list_price = jQuery("div.custom-form-wrapper input[name='list_price']").length ? parseInt(jQuery("div.custom-form-wrapper input[name='list_price']").val().replace(/\,/g, '')) : '';
  var sell_price = jQuery("div.custom-form-wrapper input[name='sell_price']").length ? parseInt(jQuery("div.custom-form-wrapper input[name='sell_price']").val().replace(/\,/g, '')) : '';
  var promotion_text = 'Nhập Giá gốc và Giá bán để tính % khuyến mại.';
  var promotion_price = 0;
  
  if (list_price >= 0 && sell_price >= 0) {
    if (list_price > sell_price) {
      promotion_price = Math.floor(((list_price - sell_price) / list_price) * 100);
      promotion_text = '<span class="highlight">Giảm giá: <strong>' + promotion_price + '%</strong></span>';
    }
    else{
      promotion_text = 'Không có giảm giá'
    }
  }
  
  if (!jQuery('.promotion_price').hasClass('value-only')) {
    jQuery('.promotion_price').html(promotion_text);
  }
  
  jQuery('input[name="product_percent"]').val(promotion_price);
}

/**
 * Update price by promotion percent.
 */
function custom_price_update_by_percent(obj) {
  var list_price = parseInt(jQuery("div.custom-form-wrapper input[name='list_price']").val().replace(/\,/g, ''));
  var sell_price = parseInt(jQuery("div.custom-form-wrapper input[name='sell_price']").val().replace(/\,/g, ''));
  var precent = parseFloat(obj.value);
  
  if (precent > 0 && precent <= 100 && list_price > 0) {
    var promotion_price = Math.floor(list_price - (precent / 100) * list_price);
    //jQuery("div.custom-form-wrapper input[name='sell_price']").val(promotion_price).trigger('keyup');
    jQuery("div.custom-form-wrapper input[name='sell_price']").val(custom_thousand_format(promotion_price, ','));
  }
  else if (precent == 0) {
    jQuery("div.custom-form-wrapper input[name='sell_price']").val(custom_thousand_format(list_price, ','));
  }
}

/**
 * Auto change the number to currency.
 */
function custom_thousand_format_auto(obj) {
  var number = jQuery(obj).val().trim();
  
  // Convert string to number.
  var number_validated = custom_string_to_number(number);
  
  // Convert to currency format.
  jQuery(obj).val(custom_thousand_format(number_validated, ','));
}

/**
 * Video form submit.
 */
function custom_video_form_submit(obj) {
  var submit = jQuery(obj);

  // Collect info.
  var uid = jQuery("#custom-video-form-wrapper input[name='uid']").val();
  var nid = jQuery("#custom-video-form-wrapper input[name='nid']").val();

  var title = jQuery("#custom-video-form-wrapper input[name='title']").val().trim();

  // Collect multiple values.
  var video_categories = [];
  jQuery("#custom-video-form-wrapper select[name='video_category']").find(':selected').each(function() {
    video_categories.push(jQuery(this).attr('value'));
  });

  var video_group = [];
  jQuery("#custom-video-form-wrapper select[name='video_group']").find(':selected').each(function() {
    video_group.push(jQuery(this).attr('value'));
  });

  var youtube_link = jQuery("#custom-video-form-wrapper input[name='youtube_link']").val().trim();
  
  var video_fid = jQuery("#custom-video-form-wrapper #video-photo-thumbnail").attr('video_fid');
  var thumbnail_fid = jQuery("#custom-video-form-wrapper #video-photo-thumbnail").attr('thumbnail_fid');
  
  var video_adv_fid = jQuery("#custom-video-form-wrapper #video-adv-photo-thumbnail").attr('video_fid');
  var thumbnail_adv_fid = jQuery("#custom-video-form-wrapper #video-adv-photo-thumbnail").attr('thumbnail_fid');

  var video_is_free = jQuery("#custom-video-form-wrapper input[name='video_is_free']").is(':checked') ? 1 : 0;
  
  var video_free_in_second = jQuery("#custom-video-form-wrapper input[name='video_free_in_second']").val().trim();
  var video_adv_insert_at = jQuery("#custom-video-form-wrapper input[name='video_adv_insert_at']").val().trim();

  var list_price = jQuery("#custom-video-form-wrapper input[name='list_price']").val().replace(/\s+|\,/g, '');
  var sell_price = jQuery("#custom-video-form-wrapper input[name='sell_price']").val().replace(/\s+|\,/g, '');

  //var short_intro_video = CKEDITOR.instances['field_short_desc'].getData();
  var intro_video = CKEDITOR.instances['field_full_desc'].getData();

  var comment = jQuery('#custom-video-form-wrapper [name="comment"]:checked').length ? jQuery('#custom-video-form-wrapper [name="comment"]:checked').val() : 1;

  // Validate all the required fields.
  if (title == '') {
    alert('Xin vui lòng nhập Tiêu đề video.');
    return false;
  }

  if (!video_categories.length) {
    alert('Xin vui lòng chọn Danh mục video.');
    return false;
  }
  
  if (youtube_link != '' && !custom_validate_is_url(youtube_link)) {
    alert('Xin vui lòng nhập đường dẫn Youtube hợp lệ.');
    return false;
  }
  else if (youtube_link != '' && youtube_link.indexOf('youtube.com') == -1 && youtube_link.indexOf('youtu.be') == -1) {
    alert('Xin vui lòng nhập đường dẫn Youtube hợp lệ.');
    return false;
  }

  if (intro_video == '') {
    alert('Xin vui lòng nhập thông tin Giới thiệu chi tiết cho video.');
    return false;
  }

  // Prepare data for service creation.
  var node_fields = {
    type: 'video',
    title: title,
    video_categories: {'video_categories': video_categories},
   	field_video_description: {
      'value': intro_video
    },
    field_video_youtube: {'input': youtube_link},
    field_free_mode: {'value': video_is_free},
    field_video_free_in_second: {'value': video_free_in_second},
    sell_price: 0,
    comment: comment
  };
  
  if (video_fid != undefined && parseInt(video_fid) > 0) {
    node_fields['field_video'] = {
      video_fid: video_fid,
      thumbnail_fid: thumbnail_fid
    };
  }

  if (video_adv_fid != undefined && parseInt(video_adv_fid) > 0) {
    node_fields['field_video_adv'] = {
      video_fid: video_adv_fid,
      thumbnail_fid: thumbnail_adv_fid
    };
  }
  
  if (video_adv_insert_at != '') {
    node_fields['field_video_adv_insert_at'] = {'value': video_adv_insert_at};
  }

  if (list_price != '' && parseInt(list_price) >= 0) {
    node_fields['list_price'] = list_price;
  }

  if (sell_price != '' && parseInt(sell_price) >= 0) {
    node_fields['sell_price'] = sell_price;
  }

  if (video_group.length) {
    node_fields['video_group'] = {'video_group': video_group};
  }

  // Send data to server for creation.
  submit.attr('disabled', true);
  custom_services_request('node_store', {nid: nid, node_fields: node_fields}, function(result) {
    submit.attr('disabled', false);
    
    if (result['error']) {
      alert(result['message']);
      return false;
    }

    // Go to service list.
    if (nid == 0) {
      alert('Video đã được tạo thành công. Nhấn OK để chuyển tới trang Xem Video.');
    }
    else{
      alert('Video đã được sửa thành công. Nhấn OK để chuyển tới trang Xem Video.');
    }
    document.location.href = '/user/shop/video';
  });
  
  return false;
}

/**
 * Service form submit.
 */
function custom_service_form_submit(obj) {
  var submit = jQuery(obj);
    
  // Collect info.
  var uid = jQuery("#custom-service-form-wrapper input[name='uid']").val();
  var nid = jQuery("#custom-service-form-wrapper input[name='nid']").val();

  var title = jQuery("#custom-service-form-wrapper input[name='title']").val().trim();
  
  // Collect multiple values.
  var service_categories = [];
  jQuery("#custom-service-form-wrapper select[name='service_category']").find(':selected').each(function() {
    service_categories.push(jQuery(this).attr('value'));
  });

  var service_cities = [];
  jQuery("#custom-service-form-wrapper select[name='service_cities']").find(':selected').each(function() {
    service_cities.push(jQuery(this).attr('value'));
  });

  var service_group = [];
  jQuery("#custom-service-form-wrapper select[name='service_group']").find(':selected').each(function() {
    service_group.push(jQuery(this).attr('value'));
  });

  var product_addons = [];
  var service_addons = [];

  jQuery("#custom-service-form-wrapper ul.product-addons.field-group").each(function() {
    if (parseInt(jQuery(this).find('select.field-node').val()) > 0) {
      product_addons.push({
        'nid': jQuery(this).find('select.field-node').val(),
        'promotion_rate': jQuery(this).find('input.field-promotion').val(),
        'price': jQuery(this).find('input.field-sell-price').val()
      });
    }
  });

  jQuery("#custom-service-form-wrapper ul.service-addons.field-group").each(function() {
    if (parseInt(jQuery(this).find('select.field-node').val()) > 0) {
      service_addons.push({
        'nid': jQuery(this).find('select.field-node').val(),
        'promotion_rate': jQuery(this).find('input.field-promotion').val(),
        'price': jQuery(this).find('input.field-sell-price').val()
      });
    }
  });

  var list_price = jQuery("#custom-service-form-wrapper input[name='list_price']").val().replace(/\s+|\,/g, '');
  var sell_price = jQuery("#custom-service-form-wrapper input[name='sell_price']").val().replace(/\s+|\,/g, '');

  var promotion_date_end_day = jQuery("#custom-service-form-wrapper .datetime select[name='day']").val();
  var promotion_date_end_month = jQuery("#custom-service-form-wrapper .datetime select[name='month']").val();
  var promotion_date_end_year = jQuery("#custom-service-form-wrapper .datetime select[name='year']").val();
  var promotion_date_end_hour = jQuery("#custom-service-form-wrapper .datetime select[name='hour']").val();
  var promotion_date_end_minute = jQuery("#custom-service-form-wrapper .datetime select[name='minute']").val();
  var promotion_date_end = '';
  if (promotion_date_end_day > 0 && promotion_date_end_month > 0 && promotion_date_end_year > 0 && promotion_date_end_hour >= 0 && promotion_date_end_minute >= 0) {
    promotion_date_end = promotion_date_end_year + '-' + promotion_date_end_month + '-' + promotion_date_end_day + 'T' + promotion_date_end_hour + ':' + promotion_date_end_minute + ':00';
  }

  var service_images = [];
  var service_images_primary = 0;
  jQuery("#custom-service-form-wrapper div.images_list div.photo-thumb-wrapper").each(function() {
    service_images.push(jQuery(this).children('img.photo-thumb').attr('fid'));
    
    if (jQuery(this).hasClass('primary')) {
      service_images_primary = jQuery(this).children('img.photo-thumb').attr('fid');
    }
  });

  var short_intro_service = CKEDITOR.instances['field_short_intro_service'].getData();
  var intro_service = CKEDITOR.instances['field_intro_service'].getData();

/*
  var service_seller = jQuery("#custom-service-form-wrapper select[name='service_seller']").val();
  var service_reseller_is_edited = jQuery("#custom-service-form-wrapper #seller-edit-wrapper:visible").length ? true : false;
  var service_reseller_is_new = jQuery("#custom-service-form-wrapper #seller-add-new-wrapper:visible").length ? true : false;

  var service_seller_new_title = '';
  var service_seller_new_intro = '';

  if (service_reseller_is_new) {
    service_seller_new_title = jQuery("#custom-service-form-wrapper #seller-add-new-wrapper input[name='intro_seller_title']").val().trim();
    service_seller_new_intro = CKEDITOR.instances['field_intro_seller_body'].getData();
  }
  else if (service_reseller_is_edited) {
    service_seller_new_title = jQuery("#custom-service-form-wrapper #seller-edit-wrapper input[name='edit_intro_seller_title']").val().trim();
    service_seller_new_intro = CKEDITOR.instances['field_edit_intro_seller_body'].getData();
  }
*/  
  var promotion = CKEDITOR.instances['field_promotion'].getData();
  var comment = jQuery('#custom-service-form-wrapper [name="comment"]:checked').length ? jQuery('#custom-service-form-wrapper [name="comment"]:checked').val() : 1;
  
  // Validate all the required fields.
  if (title == '') {
    alert('Xin vui lòng nhập Tên dịch vụ.');
    jQuery("#custom-service-form-wrapper [name='title']").focus();
    return false;
  }

  if (!service_categories.length) {
    alert('Xin vui lòng chọn Danh mục dịch vụ.');
    jQuery("#custom-service-form-wrapper select[name='service_category']").focus();
    return false;
  }

  if (!service_cities.length) {
    alert('Xin vui lòng chọn Thành phố / Tỉnh thành, nơi cung cấp dịch vụ.');
    jQuery("#custom-service-form-wrapper [name='service_cities']").focus();
    return false;
  }

  if (sell_price == '' || parseInt(sell_price) == NaN) {
    alert('Xin vui lòng nhập Giá bán cho dịch vụ.');
    jQuery("#custom-service-form-wrapper [name='sell_price']").focus();
    return false;
  }

  if (!service_images.length) {
    alert('Xin vui lòng tải Hình ảnh cho dịch vụ.');
    jQuery("#custom-service-form-wrapper [name='service_image']").focus();
    return false;
  }

  if (short_intro_service == '') {
    alert('Xin vui lòng nhập thông tin Giới thiệu ngắn cho dịch vụ.');
    jQuery("#custom-service-form-wrapper [name='short_intro_service']").focus();
    return false;
  }

  if (intro_service == '') {
    alert('Xin vui lòng nhập thông tin Giới thiệu chi tiết cho dịch vụ.');
    jQuery("#custom-service-form-wrapper [name='intro_service']").focus();
    return false;
  }
/*
  if ((service_reseller_is_new || service_reseller_is_edited) && service_seller_new_title == '') {
    alert('Xin vui lòng nhập Tên cho Nhà cung cấp dịch vụ.');
    return false;
  }
  else if ((!service_reseller_is_new && !service_reseller_is_edited) && service_seller == '0') {
    alert('Xin vui lòng chọn Nhà cung cấp dịch vụ từ trong danh sách.');
    return false;
  }
*/
  // Prepare data for service creation.
  var node_fields = {
    type: 'service',
    title: title,
    list_price: (list_price != '') ? list_price : 0,
    sell_price: (sell_price != '') ? sell_price : 0,
    service_categories: {'service_categories': service_categories},
    service_cities: {'service_cities': service_cities},
    service_images: {
      service_images: service_images,
      service_images_primary: service_images_primary
    },
    field_intro_service: {
      'summary': short_intro_service,
      'value': intro_service
    },
    comment: comment,
    /*
    service_seller: {
      service_seller: service_seller,
      service_seller_new_title: service_seller_new_title,
      service_seller_new_intro: service_seller_new_intro
    }
    */
  };

  if (promotion_date_end != '') {
    node_fields['field_deal_time'] = {'value': promotion_date_end};
  }

  if (service_group.length) {
    node_fields['service_group'] = {'service_group': service_group};
  }

  if (product_addons.length) {
    node_fields['product_addons'] = {'product_addons': product_addons};
  }

  if (service_addons.length) {
    node_fields['service_addons'] = {'service_addons': service_addons};
  }

  if (promotion != '') {
    node_fields['field_promotion'] = {'value': promotion};
  }
  
  // Send data to server for creation.
  submit.attr('disabled', true);
  custom_services_request('node_store', {nid: nid, node_fields: node_fields}, function(result) {
    submit.attr('disabled', false);
    
    if (result['error']) {
      alert(result['message']);
      return false;
    }

    // Go to service list.
    if (nid == 0) {
      alert('Dịch vụ đã được tạo thành công. Nhấn OK để chuyển tới trang Xem Dịch Vụ.');
    }
    else{
      alert('Dịch vụ đã được sửa thành công. Nhấn OK để chuyển tới trang Xem Dịch Vụ.');
    }
    document.location.href = '/user/shop/service';
  });
  
  return false;
}

/**
 * Product form submit.
 */
function custom_product_form_submit(obj) {
  var submit = jQuery(obj);
    
  // Collect info.
  var uid = jQuery("#custom-product-form-wrapper input[name='uid']").val();
  var nid = jQuery("#custom-product-form-wrapper input[name='nid']").val();
  
  var title = jQuery("#custom-product-form-wrapper input[name='title']").val().trim();
  var sku = jQuery("#custom-product-form-wrapper input[name='sku']").val().trim();
  
  // Collect multiple values.
  var product_categories = [];
  jQuery("#custom-product-form-wrapper select[name='product_category']").find(':selected').each(function() {
    product_categories.push(jQuery(this).attr('value'));
  });

  var product_cities = [];
  jQuery("#custom-product-form-wrapper select[name='product_cities']").find(':selected').each(function() {
    product_cities.push(jQuery(this).attr('value'));
  });

  var product_group = [];
  jQuery("#custom-product-form-wrapper select[name='product_group']").find(':selected').each(function() {
    product_group.push(jQuery(this).attr('value'));
  });

  var list_price = jQuery("#custom-product-form-wrapper input[name='list_price']").val().replace(/\s+|\,/g, '');
  var sell_price = jQuery("#custom-product-form-wrapper input[name='sell_price']").val().replace(/\s+|\,/g, '');

  var promotion_date_end_day = jQuery("#custom-product-form-wrapper .datetime select[name='day']").val();
  var promotion_date_end_month = jQuery("#custom-product-form-wrapper .datetime select[name='month']").val();
  var promotion_date_end_year = jQuery("#custom-product-form-wrapper .datetime select[name='year']").val();
  var promotion_date_end_hour = jQuery("#custom-product-form-wrapper .datetime select[name='hour']").val();
  var promotion_date_end_minute = jQuery("#custom-product-form-wrapper .datetime select[name='minute']").val();
  var promotion_date_end = '';
  if (promotion_date_end_day > 0 && promotion_date_end_month > 0 && promotion_date_end_year > 0 && promotion_date_end_hour >= 0 && promotion_date_end_minute >= 0) {
    promotion_date_end = promotion_date_end_year + '-' + promotion_date_end_month + '-' + promotion_date_end_day + 'T' + promotion_date_end_hour + ':' + promotion_date_end_minute + ':00';
  }
  
  var product_images = [];
  var product_images_primary = 0;
  jQuery("#custom-product-form-wrapper div.images_list div.photo-thumb-wrapper").each(function() {
    product_images.push(jQuery(this).children('img.photo-thumb').attr('fid'));
    
    if (jQuery(this).hasClass('primary')) {
      product_images_primary = jQuery(this).children('img.photo-thumb').attr('fid');
    }
  });

  var product_image_type = jQuery("#custom-product-form-wrapper input[name='product_image_type']:checked").val();

  var short_intro_product = CKEDITOR.instances['field_short_intro_product'].getData();
  var intro_product = CKEDITOR.instances['field_intro_product'].getData();

/*
  var product_seller = jQuery("#custom-product-form-wrapper select[name='product_seller']").val();
  var product_reseller_is_edited = jQuery("#custom-product-form-wrapper #seller-edit-wrapper:visible").length ? true : false;
  var product_reseller_is_new = jQuery("#custom-product-form-wrapper #seller-add-new-wrapper:visible").length ? true : false;

  var product_seller_new_title = '';
  var product_seller_new_intro = '';
  
  if (product_reseller_is_new) {
    product_seller_new_title = jQuery("#custom-product-form-wrapper #seller-add-new-wrapper input[name='intro_seller_title']").val().trim();
    product_seller_new_intro = CKEDITOR.instances['field_intro_seller_body'].getData();
  }
  else if (product_reseller_is_edited) {
    product_seller_new_title = jQuery("#custom-product-form-wrapper #seller-edit-wrapper input[name='edit_intro_seller_title']").val().trim();
    product_seller_new_intro = CKEDITOR.instances['field_edit_intro_seller_body'].getData();
  }
*/
  var product_percent = jQuery("#custom-product-form-wrapper input[name='product_percent']").val().trim();

  var preferential_policy = CKEDITOR.instances['field_preferential_policy'].getData();

  var product_addons = [];
  var service_addons = [];

  jQuery("#custom-product-form-wrapper ul.product-addons.field-group").each(function() {
    if (parseInt(jQuery(this).find('select.field-node').val()) > 0) {
      product_addons.push({
        'nid': jQuery(this).find('select.field-node').val(),
        'promotion_rate': jQuery(this).find('input.field-promotion').val(),
        'price': jQuery(this).find('input.field-sell-price').val()
      });
    }
  });

  jQuery("#custom-product-form-wrapper ul.service-addons.field-group").each(function() {
    if (parseInt(jQuery(this).find('select.field-node').val()) > 0) {
      service_addons.push({
        'nid': jQuery(this).find('select.field-node').val(),
        'promotion_rate': jQuery(this).find('input.field-promotion').val(),
        'price': jQuery(this).find('input.field-sell-price').val()
      });
    }
  });

  var comment = jQuery('#custom-product-form-wrapper [name="comment"]:checked').length ? jQuery('#custom-product-form-wrapper [name="comment"]:checked').val() : 1;

  // Validate all the required fields.
  if (title == '') {
    alert('Xin vui lòng nhập Tên sản phẩm.');
    return false;
  }

  if (sku == '') {
    alert('Xin vui lòng nhập Mã hàng.');
    return false;
  }
  
  if (!product_categories.length) {
    alert('Xin vui lòng chọn Danh mục sản phẩm.');
    return false;
  }

  if (!product_cities.length) {
    alert('Xin vui lòng chọn Thành phố / Tỉnh thành, nơi bán sản phẩm.');
    return false;
  }  
  
  if (sell_price == '' || parseInt(sell_price) == NaN) {
    alert('Xin vui lòng nhập Giá bán cho sản phẩm.');
    return false;
  }
  
  if (!product_images.length) {
    alert('Xin vui lòng tải Hình ảnh cho sản phẩm.');
    return false;
  }

  if (product_image_type == undefined) {
    alert('Xin vui lòng chọn Kiểu ảnh đại diện cho sản phẩm.');
    return false;
  }

  if (short_intro_product == '') {
    alert('Xin vui lòng nhập thông tin Giới thiệu ngắn cho sản phẩm.');
    return false;
  }

  if (intro_product == '') {
    alert('Xin vui lòng nhập thông tin Giới thiệu chi tiết cho sản phẩm.');
    return false;
  }

/*
  if ((product_reseller_is_new || product_reseller_is_edited) && product_seller_new_title == '') {
    alert('Xin vui lòng nhập Tên cho Nhà cung cấp sản phẩm.');
    return false;
  }
  else if ((!product_reseller_is_new && !product_reseller_is_edited) && product_seller == '0') {
    alert('Xin vui lòng chọn Nhà cung cấp sản phẩm từ trong danh sách.');
    return false;
  }
*/
  if (preferential_policy == '') {
    alert('Xin vui lòng nhập thông tin Các chính sách ưu đãi cho sản phẩm.');
    return false;
  }
  
  // Prepare data for product creation.
  var node_fields = {
    type: 'product',
    title: title,
    model: sku,
    comment: comment,
    product_cities: {'product_cities': product_cities},
    product_categories: {'product_categories': product_categories},
    list_price: (list_price != '') ? list_price : 0,
    sell_price: (sell_price != '') ? sell_price: 0,
    field_percent: {'value': product_percent},
    product_images: {
      product_images: product_images,
      product_images_primary: product_images_primary
    },
    field_intro_product: {
      'summary': short_intro_product,
      'value': intro_product
    },
    /*
    product_seller: {
      product_seller: product_seller,
      product_seller_new_title: product_seller_new_title,
      product_seller_new_intro: product_seller_new_intro
    },
    */
    field_preferential_policy: {'value': preferential_policy},
    field_img_type: {'value': product_image_type}
  };
  console.log(node_fields);
  
  if (promotion_date_end != '') {
    node_fields['field_deal_time'] = {'value': promotion_date_end};
  }
  
  if (product_group.length) {
    node_fields['product_group'] = {'product_group': product_group};
  }
  
  if (product_addons.length) {
    node_fields['product_addons'] = {'product_addons': product_addons};
  }

  if (service_addons.length) {
    node_fields['service_addons'] = {'service_addons': service_addons};
  }
  
  // Send data to server for creation.
  submit.attr('disabled', true);
  custom_services_request('node_store', {nid: nid, node_fields: node_fields}, function(result) {
    submit.attr('disabled', false);
    
    if (result['error']) {
      alert(result['message']);
      return false;
    }
    
    // Go to product list.
    if (nid == 0) {
      alert('Sản phẩm đã được tạo thành công. Nhấn OK để chuyển tới trang Xem Sản Phẩm.');
    }
    else{
      alert('Sản phẩm đã được sửa thành công. Nhấn OK để chuyển tới trang Xem Sản Phẩm.');
    }
    document.location.href = '/user/shop/product';
  });
  
  return false;
}

/**
 * Check on / off for admin permission.
 */
function custom_user_settings_admin_permission_check(obj) {
  if (obj.checked) {
    jQuery("#custom-user-settings-form-wrapper select[name='admin_uid']").attr('disabled', false);
  }
  else{
    jQuery("#custom-user-settings-form-wrapper select[name='admin_uid']").val('0');
    jQuery("#custom-user-settings-form-wrapper select[name='admin_uid']").attr('disabled', true);
  }
}

/**
 * User settings change form submit.
 */
function custom_user_settings_form_submit() {
  var submit = jQuery("#custom-user-settings-form-wrapper input[name='submit']");
  var uid = jQuery("#custom-user-settings-form-wrapper input[name='uid']").val();
  var admin_permission_is_checked = jQuery("#custom-user-settings-form-wrapper input[name='admin_permission']:checked").val() == undefined ? 0 : 1;
  var admin_uid = jQuery("#custom-user-settings-form-wrapper select[name='admin_uid']").val();
  var subdomain = jQuery("#custom-user-settings-form-wrapper input[name='user_subdomain']").val().trim();
  
  // Validate form.
  if (admin_permission_is_checked && admin_uid < 1) {
    alert('Bạn chưa chọn một TASSCARE admin từ trong danh sách để phân quyền.');
    return false;
  }

  // Process to authenticate then login.
  submit.attr('disabled', true);
  
  var account_fields = {
    'field_admin_permission': {'target_id': admin_uid},
    'field_subdomain': {'value': subdomain}
  };

  // Process to register then login.
  submit.attr('disabled', true);
  custom_services_request('user_store', {uid: uid, account_fields: account_fields}, function(result) {
    submit.attr('disabled', false);
    
    if (result['is_error']) {
      alert(result['message']);
      return false;
    }

    // Alert.
    alert('Thiết lập tùy chọn của bạn đã được cập nhật.');
    document.location.href = document.location.href;
  });
  
  return false;  
}

/**
 * Password change form submit.
 */
function custom_password_edit_form_submit() {
  var submit = jQuery("#custom-password-edit-form-wrapper input[name='submit']");
  var uid = jQuery("#custom-password-edit-form-wrapper input[name='uid']").val();
  var old_pass = jQuery("#custom-password-edit-form-wrapper input[name='old_pass']").val().trim();
  var password = jQuery("#custom-password-edit-form-wrapper input[name='password']").val().trim();
  var password_confirm = jQuery("#custom-password-edit-form-wrapper input[name='password_confirm']").val().trim();
  
  if (old_pass == '') {
    alert('Xin vui lòng nhập Mật khẩu hiện tại của bạn.');
    return false;
  }

  if (password == '') {
    alert('Xin vui lòng nhập Mật khẩu mới bạn muốn đổi.');
    return false;
  }

  if (password != password_confirm) {
    alert('Mật khẩu mới và Xác nhận mật khẩu phải trùng nhau.');
    return false;
  }

  // Process to authenticate then login.
  submit.attr('disabled', true);
  custom_services_request('user_password_update', {uid: uid, pass: password, old_pass: old_pass}, function(result) {
    submit.attr('disabled', false);
    if (result['error']) {
      alert(result['message']);
      return false;
    }

    // Reset fields.
    jQuery("#custom-password-edit-form-wrapper input[name='old_pass']").val('');
    jQuery("#custom-password-edit-form-wrapper input[name='password']").val('');
    jQuery("#custom-password-edit-form-wrapper input[name='password_confirm']").val('');
    
    // Alert.
    alert('Mật khẩu của bạn đã được cập nhật.');
  });
  
  return false;  
}

/**
 * Login form submit.
 */
function custom_login_form_submit() {
  var submit = jQuery("#custom-login-form-wrapper input[name='submit']");
  var username = jQuery("#custom-login-form-wrapper input[name='username']").val().trim();
  var password = jQuery("#custom-login-form-wrapper input[name='password']").val().trim();
  
  // Validate.
  if (username == '') {
    alert('Xin vui lòng nhập Tên truy nhập của bạn.');
    return false;
  }

  if (password == '') {
    alert('Xin vui lòng nhập Mật khẩu của bạn.');
    return false;
  }
  
  // Process to authenticate then login.
  submit.attr('disabled', true);
  custom_services_request('account_login', {username: username, password: password}, function(result) {
    submit.attr('disabled', false);
    if (result['error']) {
      alert(result['message']);
      return false;
    }

    // Reset fields.
    jQuery("#custom-login-form-wrapper input[name='username']").val('');
    jQuery("#custom-login-form-wrapper input[name='password']").val('');
    
    // Close and reload page.
    jQuery("#custom-login-form-wrapper").dialog('close');
    
    if (result['is_admin']) {
      document.location.href = 'admin/dashboard';
    }
    else{
      document.location.href = document.location.href;
    }
  });
  
  return false;
}

/**
 * Coupon form submit.
 */
function custom_coupon_form_submit() {
  var submit = jQuery("#custom-coupon-form-wrapper input[name='submit']");
  var uid = jQuery("#custom-coupon-form-wrapper input[name='uid']").val();
  var cid = jQuery("#custom-coupon-form-wrapper input[name='cid']").val();

  var name = jQuery("#custom-coupon-form-wrapper input[name='name']").val().trim();
  var code = jQuery("#custom-coupon-form-wrapper input[name='code']").val().trim();
  var type = jQuery("#custom-coupon-form-wrapper select[name='type']").val();
  var value = jQuery("#custom-coupon-form-wrapper input[name='value']").val().trim().replace(/\,/g, '');

  var status = jQuery("#custom-coupon-form-wrapper input[name='status']").is(':checked') ? 1 : 0;
  var bulk_number = jQuery("#custom-coupon-form-wrapper input[name='bulk_number']").val().trim();

  var valid_till_day = jQuery("#custom-coupon-form-wrapper select[name='day']").val();
  var valid_till_month = jQuery("#custom-coupon-form-wrapper select[name='month']").val();
  var valid_till_year = jQuery("#custom-coupon-form-wrapper select[name='year']").val();
  var valid_until = '';
  if (valid_till_day > 0 && valid_till_month > 0 && valid_till_year) {
    valid_until = valid_till_year + '-' + valid_till_month + '-' + valid_till_day;
  }

  // Validate.
  if (name == '') {
    alert('Xin vui lòng nhập Tên của mã.');
    return false;
  }

  if (code == '') {
    alert('Xin vui lòng nhập Mã khuyến mại để tạo.');
    return false;
  }
  else {
    for (var i = 0; i < code.length; i++) {
      if (!code.charAt(i).match(/[a-zA-Z0-9]/)) {
        alert('Mã khuyến mại chứa ký tự đặc biệt. Vui lòng chỉ nhập ký tự A-Z hoặc số.');
        return false;
      }
    }
  }

  if (value == '') {
    alert('Xin vui lòng nhập Giá trị của Mã khuyến mại.');
    return false;
  }
  else if (isNaN(parseInt(value))) {
    alert('Xin vui lòng nhập Giá trị Mã khuyến mại là chữ số.');
    return false;
  }
  else if (type == 'percentage' && parseInt(value) > 100) {
    alert('Tỷ lệ phần trăm chỉ được phép trong khoảng 0-100.');
    return false;
  }
  else if (type == 'price' && parseInt(value) > 9999999) {
    alert('Giá trị khuyến mại quá lớn. Xin vui lòng kiểm tra.');
    return false;
  }

  if (bulk_number == '') {
    alert('Xin vui lòng nhập Số lượng mã sẽ tạo.');
    return false;
  }
  else if (isNaN(parseInt(bulk_number))) {
    alert('Xin vui lòng nhập Số lượng mã sẽ tạo là chữ số.');
    return false;
  }
  
  // Validate expiry date.
  if (valid_until != '') {
    var valid_until_date = new Date(valid_until);
    var today = new Date();
    today.setHours(0,0,0,0);
  
    if (valid_until_date < today) {
      alert('Xin vui lòng chọn Ngày hết hạn của Mã giảm giá ở thời tương lai.');
      return false;    
    }
  }
  
  // Collect data.
  var coupon_fields = {
    'cid': cid,
    'name': name,
    'code': code,
    'type': type,
    'value': value,
    'status': status,
    'bulk_number': bulk_number,
    'valid_until': valid_until
  };

  // Process to register then login.
  submit.attr('disabled', true);
  custom_services_request('coupon_store', {uid: uid, coupon_fields: coupon_fields}, function(result) {
    submit.attr('disabled', false);
    
    if (result['is_error']) {
      alert(result['message']);
      return false;
    }
    
    alert('Mã khuyến mại đã được tạo thành công. Nhấn OK để trở về trang Xem mã.');
    document.location.href = '/user/coupon';
  });
  
  return false;
}

/**
 * User edit form submit.
 */
function custom_user_form_submit() {
  var submit = jQuery("#custom-user-edit-form-wrapper input[name='submit']");
  var uid = jQuery("#custom-user-edit-form-wrapper input[name='uid']").val();
  var fullname = jQuery("#custom-user-edit-form-wrapper input[name='fullname']").val().trim();
  var mobile = jQuery("#custom-user-edit-form-wrapper input[name='mobile']").val().trim();
  var city = jQuery("#custom-user-edit-form-wrapper select[name='city']").val();
  var address = jQuery("#custom-user-edit-form-wrapper input[name='address']").val().trim();
  var current_address = jQuery("#custom-user-edit-form-wrapper input[name='current_address']").length ? jQuery("#custom-user-edit-form-wrapper input[name='current_address']").val().trim() : '';
  var email = jQuery("#custom-user-edit-form-wrapper input[name='email']").val().trim();
  var description = jQuery("#field_user_description").length ? CKEDITOR.instances['field_user_description'].getData() : '';

  var facebook_page = jQuery("#custom-user-edit-form-wrapper input[name='facebook_page']").length ? jQuery("#custom-user-edit-form-wrapper input[name='facebook_page']").val().trim() : '';
  var skype_id = jQuery("#custom-user-edit-form-wrapper input[name='skype_id']").length ? jQuery("#custom-user-edit-form-wrapper input[name='skype_id']").val().trim() : '';
  
  var avatar_fid = jQuery("#custom-user-edit-form-wrapper div.photo-thumb-wrapper.avatar img").attr('fid');
  var cover_fid = jQuery("#custom-user-edit-form-wrapper div.photo-thumb-wrapper.cover img").attr('fid');

  var birthdate = '';
  var day = jQuery("#custom-user-edit-form-wrapper select[name='day']").val();
  var month = jQuery("#custom-user-edit-form-wrapper select[name='month']").val();
  var year = jQuery("#custom-user-edit-form-wrapper select[name='year']").val();
  
  // Validate.
  if (fullname == '') {
    alert('Xin vui lòng nhập Họ và tên của bạn.');
    return false;
  }

  if (mobile == '') {
    alert('Xin vui lòng nhập Số di động của bạn.');
    return false;
  }
  else if (!custom_validate_is_mobile_number(mobile)) {
    alert('Số di động của bạn không hợp lệ.');
    return false;
  }

  if (city == '0') {
    alert('Xin vui lòng chọn Tỉnh / Thành phố của bạn.');
    return false;
  }

  if (email == '') {
    alert('Xin vui lòng nhập Địa chỉ e-mail của bạn.');
    return false;
  }
  else if (!custom_validate_is_email(email)) {
    alert('Địa chỉ e-mail của bạn không hợp lệ.');
    return false;
  }

  if (day > 0 || month > 0 || year > 0) {
    if (day == 0) {
      alert('Xin vui lòng chọn Ngày sinh của bạn.');
      return false;
    }
    if (month == 0) {
      alert('Xin vui lòng chọn Tháng sinh của bạn.');
      return false;
    }
    if (year == 0) {
      alert('Xin vui lòng chọn Năm sinh của bạn.');
      return false;
    }
    
    // Make birthdate.
    birthdate = month + '/' + day + '/' + year + ' 00:00:00';
  }


  var account_fields = {
    'email': email,
    'field_full_name': {'value': fullname},
    'field_mobile_number': {'value': mobile},
    'field_cities': {'tid': city}
  };
  
  if (description != '') {
    account_fields['field_user_description'] = {'value': description};
  }

  if (facebook_page != '') {
    account_fields['facebook_page'] = {facebook_page};
  }

  if (skype_id != '') {
    account_fields['field_skype_id'] = {'value': skype_id};
  }

  if (address != '') {
    account_fields['field_address'] = {'value': address};
  }

  if (current_address != '') {
    account_fields['field_current_address'] = {'value': current_address};
  }
  
  if (birthdate != '') {
    account_fields['field_birthdate'] = {'value': birthdate};
  }
  
  if (avatar_fid > 0) {
    account_fields['field_photo'] = avatar_fid;
  }

  if (cover_fid > 0) {
    account_fields['field_cover_picture'] = cover_fid;
  }

  // Process to register then login.
  submit.attr('disabled', true);
  custom_services_request('user_store', {uid: uid, account_fields: account_fields}, function(result) {
    submit.attr('disabled', false);
    
    if (!result['uid']) {
      alert(result['message']);
      return false;
    }
    
    alert('Hồ sơ của bạn đã được cập nhật thành công.');
    document.location.href = document.location.href;
  });
  
  return false;
}

/**
 * Register form submit.
 */
function custom_register_form_submit() {
  var submit = jQuery("#custom-register-form-wrapper input[name='submit']");
  var account_type = jQuery("#custom-register-form-wrapper input[name='account_type']:checked").val();
  var fullname = jQuery("#custom-register-form-wrapper input[name='fullname']").val().trim();
  var mobile = jQuery("#custom-register-form-wrapper input[name='mobile']").val().trim();
  var city = jQuery("#custom-register-form-wrapper select[name='city']").val();
  var username = jQuery("#custom-register-form-wrapper input[name='username']").val().trim();
  var email = jQuery("#custom-register-form-wrapper input[name='email']").val().trim();
  var password = jQuery("#custom-register-form-wrapper input[name='password']").val().trim();
  var password_confirm = jQuery("#custom-register-form-wrapper input[name='password_confirm']").val().trim();

  // Validate.
  if (account_type == null) {
    alert('Xin vui lòng chọn loại tài khoản: Khách hàng hoặc Bác sĩ.');
    return false;
  }

  if (account_type == 1 && fullname == '') {
    alert('Xin vui lòng nhập Họ và tên của bạn.');
    return false;
  }

  if (account_type == 1 && mobile == '') {
    alert('Xin vui lòng nhập Số di động của bạn.');
    return false;
  }
  else if (account_type == 1 && !custom_validate_is_mobile_number(mobile)) {
    alert('Số di động của bạn không hợp lệ.');
    return false;
  }

  if (account_type == 1 && city == '0') {
    alert('Xin vui lòng chọn Tỉnh / Thành phố của bạn.');
    return false;
  }

  if (username == '') {
    alert('Xin vui lòng nhập Tên truy nhập của bạn.');
    return false;
  }

  if (email == '') {
    alert('Xin vui lòng nhập Địa chỉ e-mail của bạn.');
    return false;
  }
  else if (!custom_validate_is_email(email)) {
    alert('Địa chỉ e-mail của bạn không hợp lệ.');
    return false;
  }

  if (password == '') {
    alert('Xin vui lòng nhập Mật khẩu của bạn.');
    return false;
  }
  else if (password.length < 6) {
    alert('Mật khẩu của bạn phải có ít nhất 6 ký tự để đảm bảo an ninh.');
    return false;
  }

  if (password != password_confirm) {
    alert('Mật khẩu và Xác nhận mật khẩu phải trùng nhau.');
    return false;
  }
  
  var account_fields = {
    'name': username,
    'email': email,
    'password': password,
    'field_account_type': {'value': account_type}
    //'field_full_name': {'value': fullname},
    //'field_mobile_number': {'value': mobile},
    //'field_cities': {'tid': city}
  };
  
  if (account_type == 0) {
    account_fields['field_full_name'] = {'value': email};
  }
  else if (account_type == 1) {
    account_fields['field_full_name'] = {'value': fullname};
    account_fields['field_mobile_number'] = {'value': mobile};
    account_fields['field_cities'] = {'tid': city};
  }

  // Process to register then login.
  submit.attr('disabled', true);
  custom_services_request('user_store', {uid: 0, account_fields: account_fields}, function(result) {
    submit.attr('disabled', false);
    
    if (result['is_error']) {
      alert(result['message']);
      return false;
    }
    
    // Reset all fields.
    jQuery("#custom-register-form-wrapper input[name='account_type']:checked").attr('checked', false);
    jQuery("#custom-register-form-wrapper input[name='fullname']").val('');
    jQuery("#custom-register-form-wrapper input[name='mobile']").val('');
    jQuery("#custom-register-form-wrapper select[name='city']").val('0');
    jQuery("#custom-register-form-wrapper input[name='username']").val('');
    jQuery("#custom-register-form-wrapper input[name='email']").val('');
    jQuery("#custom-register-form-wrapper input[name='password']").val('');
    jQuery("#custom-register-form-wrapper input[name='password_confirm']").val('');
    
    // Move to next step for account activation.
    jQuery("#custom-register-form-wrapper input[name='uid']").val(result['uid']);
    
    jQuery("#custom-register-form-wrapper div.custom-form.active").removeClass('active');
    jQuery("#custom-register-form-wrapper div.custom-form.step-2").addClass('active');
  });
  
  return false;
}

/**
 * User register activation.
 */
function custom_register_confirm_form_submit() {
  var submit = jQuery("#custom-register-form-wrapper div.custom-form.step-2 input[name='submit']");
  var uid = jQuery("#custom-register-form-wrapper input[name='uid']").val().trim();
  var code = jQuery("#custom-register-form-wrapper input[name='code']").val().trim();
  
  if (code == '') {
    alert('Xin vui lòng nhập Mã xác nhận đã được gửi tới địa chỉ E-mail của bạn.');
    return false;
  }
  
  if (!parseInt(uid)) {
    alert('Lỗi không xác định. Vui lòng tải lại trang rồi thử lại.');
    return false;
  }
  
  submit.attr('disabled', true);
  custom_services_request('user_register_confirm', {uid: uid, code: code}, function(result) {
    submit.attr('disabled', false);
    
    if (result['is_error']) {
      alert(result['message']);
      return false;
    }
    
    // Move to next form for entering verified code.
    jQuery("#custom-register-form-wrapper div.custom-form.active").removeClass('active');
    jQuery("#custom-register-form-wrapper div.custom-form.step-3").addClass('active');
  });  

  return false;
}

/**
 * Forgot password submit.
 */
function custom_password_form_submit() {
  var submit = jQuery("#custom-password-form-wrapper div.custom-form.step-1 input[name='submit']");
  var username = jQuery("#custom-password-form-wrapper input[name='username']").val().trim();
  
  if (username == '') {
    alert('Xin vui lòng nhập Tên truy nhập hoặc Địa chỉ e-mail đã sử dụng đăng ký.');
    return false;
  }
  
  submit.attr('disabled', true);
  custom_services_request('user_password_reset', {username: username}, function(result) {
    submit.attr('disabled', false);
    
    if (result['is_error']) {
      alert(result['message']);
      return false;
    }
    
    // Move to next form for entering verified code.
    jQuery("#custom-password-form-wrapper div.custom-form.step-2 p.row.desc").html(result['message']);
    jQuery("#custom-password-form-wrapper input[name='uid']").val(result['uid']);
    
    jQuery("#custom-password-form-wrapper div.custom-form.active").removeClass('active');
    jQuery("#custom-password-form-wrapper div.custom-form.step-2").addClass('active');
  });

  return false;
}

/**
 * Forgot password verify submit (confirm with passcode).
 */
function custom_password_confirm_form_submit() {
  var submit = jQuery("#custom-password-form-wrapper div.custom-form.step-2 input[name='submit']");
  var uid = jQuery("#custom-password-form-wrapper input[name='uid']").val().trim();
  var code = jQuery("#custom-password-form-wrapper input[name='code']").val().trim();
  
  if (code == '') {
    alert('Xin vui lòng nhập Mã xác nhận đã được gửi tới địa chỉ E-mail của bạn.');
    return false;
  }
  
  if (!parseInt(uid)) {
    alert('Lỗi không xác định. Vui lòng tải lại trang rồi thử lại.');
    return false;
  }
  
  submit.attr('disabled', true);
  custom_services_request('user_password_reset_confirm', {uid: uid, code: code}, function(result) {
    submit.attr('disabled', false);
    
    if (result['is_error']) {
      alert(result['message']);
      return false;
    }
    
    // Move to next form for entering verified code.
    jQuery("#custom-password-form-wrapper div.custom-form.step-3 p.row.desc").html(result['message']);
    jQuery("#custom-password-form-wrapper input[name='confirmed_code']").val(result['confirmed_code']);

    jQuery("#custom-password-form-wrapper div.custom-form.active").removeClass('active');
    jQuery("#custom-password-form-wrapper div.custom-form.step-3").addClass('active');
  });  

  return false;
}

/**
 * Forgot password change form submit.
 */
function custom_password_change_form_submit() {
  var submit = jQuery("#custom-password-form-wrapper div.custom-form.step-3 input[name='submit']");

  var uid = jQuery("#custom-password-form-wrapper input[name='uid']").val().trim();
  var confirmed_code = jQuery("#custom-password-form-wrapper input[name='confirmed_code']").val().trim();

  var new_pass = jQuery("#custom-password-form-wrapper input[name='password']").val().trim();
  var pass_confirm = jQuery("#custom-password-form-wrapper input[name='password_confirm']").val().trim();
  
  if (new_pass == '') {
    alert('Xin vui lòng nhập Mật khẩu mới của bạn để đổi.');
    return false;
  }

  if (new_pass != '' && new_pass != pass_confirm) {
    alert('Mật khẩu mới và Xác nhận mật khẩu phải trùng nhau.');
    return false;
  }
  
  if (!parseInt(uid) || confirmed_code == '') {
    alert('Lỗi không xác định. Vui lòng tải lại trang rồi thử lại.');
    return false;
  }
  
  submit.attr('disabled', true);
  custom_services_request('user_password_reset_change_confirm', {uid: uid, confirmed_code: confirmed_code, new_pass: new_pass}, function(result) {
    submit.attr('disabled', false);
    
    if (result['is_error']) {
      alert(result['message']);
      return false;
    }
    
    // Reset fields.
    jQuery("#custom-password-form-wrapper input[name='username']").val('');
    
    // Move to next form for entering verified code.
    jQuery("#custom-password-form-wrapper div.custom-form.active").removeClass('active');
    jQuery("#custom-password-form-wrapper div.custom-form.step-4").addClass('active');
  });  

  return false;
}

/**
 * To switch from forgot password popup to login form.
 */
function custom_password_to_login_form() {
  jQuery("#custom-password-form-wrapper").dialog('close');
  jQuery("#block-system-user-menu ul.menu li a[href='/custom/login-form']").click();
  return false;
}

/**
 * To switch from register popup to login form.
 */
function custom_register_to_login_form() {
  jQuery("#custom-register-form-wrapper").dialog('close');
  jQuery("#block-system-user-menu ul.menu li a[href='/custom/login-form']").click();
  return false;
}

/**
 * To switch from login to forgot pass form.
 */
function custom_to_password_form() {
  jQuery("#custom-login-form-wrapper").dialog('close');
  jQuery("#forgot-password").click();  
  return false;
}

/**
 * To switch from login to register form.
 */
function custom_to_register_form() {
  jQuery("#custom-login-form-wrapper").dialog('close');
  jQuery("#block-system-user-menu ul.menu li a[href='/custom/register-form']").click();
  return false;
}