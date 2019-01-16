<?php /* Custom web service created by giaidieu */

/**
 * Load teach profile.
 */
function custom_teacher_node_load_callback($nid) {
  // Load profile.
  $node = node_load($nid);
  if (!$node or $node->type != 'teacher') {
    return array('is_error' => true, 'node' => null);
  }
  
  return array('is_error' => false, 'node' => $node);
}

/**
 * Load a video and return full info.
 */
function custom_video_node_load_callback($nid) {
  $node = node_load($nid);
  if (!$node or $node->type != 'video') {return array();}
  
  // Get video url.
  if (!empty($node->field_video[LANGUAGE_NONE])) {
    $node->field_video[LANGUAGE_NONE][0]['url'] = file_create_url($node->field_video[LANGUAGE_NONE][0]['uri']);
  }
  
  // Get video cover.
  $node->video_cover = custom_video_thumbnail_get($node, 'video_768x432');

  // Setup more info about the payment to be checked later in client.
  global $user;
  
  $video_is_free = (!empty($node->field_free_mode[LANGUAGE_NONE]) and $node->field_free_mode[LANGUAGE_NONE][0]['value'] == 1) ? true : false;
  $video_is_paid = false;
        
  if (!$video_is_free) {
    global $user;
    $account = user_load($user->uid);
          
    if ($account->uid == $node->uid) {
      // Video owner.
      $video_is_free = true;
      $video_is_paid = true;
    }
    else{
      if (!empty($account->field_video_subscription_end[LANGUAGE_NONE]) and $account->field_video_subscription_end[LANGUAGE_NONE][0]['value'] > time()) {
        $video_is_paid = true;
      }

      // Check whether this user has purchased this video.
      if (!$video_is_paid) {
        $result = views_get_view_result('uc_orders_user', 'block_1', $node->nid);
        if (!empty($result)) {
          $video_is_paid = true;
        }
      }
    }
  }
  
  // Load the video node path.
  $node->web_path = url('node/' . $node->nid, array('absolute' => true));
  
  // Collect main video payment info. 
  $node->payment_info = array(
    'video_is_free' => $video_is_free,
    'video_is_paid' => $video_is_paid,
    'video_free_in_second' => !empty($node->field_video_free_in_second[LANGUAGE_NONE]) ? (int) $node->field_video_free_in_second[LANGUAGE_NONE][0]['value'] : 0,
    'video_price' => (int) $node->sell_price,
  );
  
  // Get adv video if any.
  if (!empty($node->field_video_adv[LANGUAGE_NONE])) {
    $node->video_adv = array(
      'video_adv_id' => $node->field_video_adv[LANGUAGE_NONE][0]['fid'],
      'video_adv_insert_at' => !empty($node->field_video_adv_insert_at[LANGUAGE_NONE]) ? (int) $node->field_video_adv_insert_at[LANGUAGE_NONE][0]['value'] : -1,
      'video_adv_url' => file_create_url($node->field_video_adv[LANGUAGE_NONE][0]['uri']),
      'video_adv_mime_type' => $node->field_video_adv[LANGUAGE_NONE][0]['filemime'],
    );
  }

  return $node;
}

/**
 * Load videos to display to users.
 * $tag = 0 - latest; 1 - sticky; 2 - most views.
 * $cid: Video category; 0 = all. 
 */
function custom_user_videos_callback($tag, $cid = 0) {
  // Prefix the video category.
  $cid = !$cid ? 'all' : $cid;
  
  // Prefix the tagging.
  $result = array();
  $tag = (int) $tag;
  $tag = (!$tag or $tag > 2) ? 0 : $tag;
  
  switch ($tag) {
    case 0:
      // Latest.
      $result = views_get_view_result('drupalapp_node_functions', 'page_23', $cid);
      break;

    case 1:
      // Most views.
      $result = views_get_view_result('drupalapp_node_functions', 'page_24', $cid);
      break;

    case 2:
      // Hot videos.
      $result = views_get_view_result('drupalapp_node_functions', 'page_25', $cid);
      break;
  }
  
  // Collect results.
  $videos = array();

  foreach ($result as $row) {
    $video_node = node_load($row->nid);
    if (!$video_node) {continue;}
    
    $videos[] = array(
      'nid' => $row->nid,
      'title' => $row->node_title,
      'web_path' => url('node/' . $row->nid, array('absolute' => true)),
      //'author_name' => $row->field_field_full_name[0]['raw']['value'],
      'author_name' => $video_node->field_full_name,
      'video_thumb' => custom_video_thumbnail_get($video_node, 'video_115x70'),
      'total_views' => $video_node->statistics ? $video_node->statistics : 0,
      'updated' => 'Cách đây ' . format_interval(time() - $video_node->changed),
      'is_livestream' => empty($video_node->field_live_streaming[LANGUAGE_NONE]) ? 0 : $video_node->field_live_streaming[LANGUAGE_NONE][0]['value'],
    );
  }
  
  return $videos;
}

/**
 * Get user's videos by most views.
 */
function custom_user_video_manager_by_views_callback($uid = 0) {
  global $user;
  if (!$uid) {$uid = $user->uid;}
  
  $result = views_get_view_result('drupalapp_node_functions', 'page_22', $uid);
  $videos = array();
  
  foreach ($result as $row) {
    $video_node = node_load($row->nid);
    if (!$video_node) {continue;}
    
    $videos[] = array(
      'nid' => $row->nid,
      'title' => $row->node_title,
      'author_name' => $row->field_field_full_name[0]['raw']['value'],
      'video_thumb' => custom_video_thumbnail_get($video_node, 'video_115x70'),
      'total_views' => $row->node_counter_totalcount ? $row->node_counter_totalcount : 0,
      'updated' => 'Cách đây ' . format_interval(time() - $row->node_changed),
    );
  }
  
  return $videos;
}

/**
 * Get user's videos by posted date.
 */
function custom_user_video_manager_by_date_callback($uid = 0) {
  global $user;
  if (!$uid) {$uid = $user->uid;}
  
  $result = views_get_view_result('drupalapp_node_functions', 'page_10', $uid);
  $videos = array();
  
  foreach ($result as $row) {
    $video_node = node_load($row->nid);
    if (!$video_node) {continue;}
    
    $videos[] = array(
      'nid' => $row->nid,
      'title' => $row->node_title,
      'author_name' => $row->field_field_full_name[0]['raw']['value'],
      'video_thumb' => custom_video_thumbnail_get($video_node, 'video_115x70'),
      'status' => (int) $row->node_status,
      'updated' => 'Cách đây ' . format_interval(time() - $row->node_changed),
    );
  }
  
  return $videos;
}

/**
 * Update the video with node update.
 */
function custom_node_video_update_video_callback($nid, $status, $fid) {
  $video = node_load($nid);
  if (!$video or $video->type != 'video') {
    return array('is_error' => true, 'message' => 'Không tìm thấy Video node.');
  }
    
  // Apply new value for the video for publishing.
  $video->status = $status;
  $video->field_live_streaming[LANGUAGE_NONE][0]['value'] = 0; // turn off live streaming.
  $video->field_video_source[LANGUAGE_NONE][0]['value'] = 'livestream'; // Flag this is video stream.

  $video_file = file_load($fid);
  if ($video_file) {
    $video_file->status = 1;
          
    $video_thumbnail = custom_video_thumbnail_create($fid, 1);
    if ($video_thumbnail and $video_thumbnail->fid) {
      $video_file->thumbnail = $video_thumbnail->fid;
      $video_file->thumbnailfile = $video_thumbnail;
    }

    file_save($video_file);

    $video->field_video[LANGUAGE_NONE] = array();
    $video->field_video[LANGUAGE_NONE][0] = (array) $video_file;
  }
  
  node_save($video);
  return array('is_error' => false, 'message' => 'Hoàn thành tạo và công khai nội dung Video từ dữ liệu Live Stream.');
}

/**
 * Create a video node.
 */
function custom_node_video_create_callback($title, $video_category_tid) {
  global $user;
  $node = new stdClass();
  $node->type = 'video';
  $node->status = 1;
  $node->language = LANGUAGE_NONE;
  $node->title = $title;
  $node->field_live_streaming[LANGUAGE_NONE][0]['value'] = 1;
  $node->field_video_category[LANGUAGE_NONE][0]['tid'] = $video_category_tid;
  $node->uid = $user->uid;
  $node->name = $user->name;
  node_save($node);
  
  if ($node->nid) {
    return array('is_error' => false, 'message' => 'Đã tạo thành công.', 'nid' => $node->nid);
  }
  else{
    return array('is_error' => true, 'message' => 'Có lỗi hệ thống. Vui lòng liên hệ với quản trị để nhận trợ giúp.');
  }
}

/**
 * Validate a coupon code.
 */
function custom_ubercart_order_discount_validate($code) {
  if (!module_exists('uc_coupon')) {
    return array('is_error' => true, 'message' => 'Có lỗi hệ thống. Vui lòng liên hệ với quản trị để nhận trợ giúp.');
  }
  
  // Get user account.
  return array('is_error' => false, 'data' => uc_coupon_validate($code, false, false));
}

/**
 * Login owithout pas then return the user object.
 */
function custom_user_login_without_password_callback($uid) {
  if ($uid > 0) {
    global $user;
    $account = user_load($uid);
    
    if ($account) {
      $user = $account;
      drupal_session_regenerate();
    
      return $user;
    }
  }
  
  return false;
}

/**
 * Get the node media files.
 */
function custom_node_media_get_callback($nid, $type) {
  $node = node_load($nid);
  if (!$node) {return array('is_error' => true, 'message' => 'Không tìm thấy dữ liệu.', 'data' => array('nid' => $nid));}
  
  if ($type == 'image') {
    $image = array();
    
    if (isset($node->uc_product_image)) {
      foreach ($node->uc_product_image[LANGUAGE_NONE] as $index => $value) {
        $image[] = array(
          'fid' => $value['fid'],
          'filename' => $value['filename'],
          'url' => image_style_url('thumbnail', $value['uri']),
        );
      }
    }
    else if (isset($node->field_images)) {
      foreach ($node->field_images[LANGUAGE_NONE] as $index => $value) {
        $image[] = array(
          'fid' => $value['fid'],
          'filename' => $value['filename'],
          'url' => image_style_url('thumbnail', $value['uri']),
        );
      }      
    }
    
    return array('is_error' => false, 'message' => '', 'data' => $image);
  }
  else if ($type == 'video') {
    $video = array();
    foreach ($node->field_video[LANGUAGE_NONE] as $index => $value) {
      $video['video'] = array(
        'fid' => $value['fid'],
        'filename' => $value['filename'],
        'thumbnail_fid' => $value['thumbnailfile'] ? $value['thumbnailfile']->fid : '',
        'url' => $value['thumbnailfile'] ? image_style_url('thumbnail', $value['thumbnailfile']->uri) : '',
      );
    }

    foreach ($node->field_video_adv[LANGUAGE_NONE] as $index => $value) {
      $video['video_adv'] = array(
        'fid' => $value['fid'],
        'filename' => $value['filename'],
        'thumbnail_fid' => $value['thumbnailfile'] ? $value['thumbnailfile']->fid : '',
        'url' => $value['thumbnailfile'] ? image_style_url('thumbnail', $value['thumbnailfile']->uri) : '',
      );
    }
    
    return array('is_error' => false, 'message' => '', 'data' => $video);    
  }
}

/**
 * Check SKU existance.
 */
function custom_sku_is_existed_callback($sku) {
  // Check existance.
  $check_model = views_get_view_result('node_functions', 'block_69', $sku);
  if (!empty($check_model)) {
    return array('is_error' => true, 'message' => 'Mã SKU đã tồn tại rồi. Vui lòng chọn mã khác.');
  }
  else{
    return array('is_error' => false, 'message' => 'OK!');
  }
}

/**
 * Delete a coupon.
 */
function custom_coupon_delete_callback($cid) {
  uc_coupon_delete($cid);
  return array('is_error' => false, 'message' => 'Đã xóa Mã khuyến mại thành công. Nhấn OK để cập nhật lại trang.');
}

/**
 * Create / Store a coupon object.
 */
function custom_store_coupon_callback($uid, $coupon_fields) {
  if (!module_exists('uc_coupon')) {return array('is_error' => true, 'message' => 'Có lỗi hệ thống. Không thể tạo Mã khuyến mại.');}

  // Init the coupon object.
  $coupon = $coupon_fields['cid'] > 0 ? uc_coupon_load($coupon_fields['cid']) : false;
  
  if (!$coupon) {
    $coupon = new stdClass();
    $coupon->created = time();
    $coupon->max_uses = 1;
    $coupon->bulk = 1;
    $coupon->field_user[LANGUAGE_NONE][0]['target_id'] = $uid;

    $coupon->data = array(
      'bulk_number' => $coupon_fields['bulk_number'],
      'bulk_length' => 8,
      'max_uses_per_user' => 1,
      'apply_to' => 'subtotal',
    );

    if ($coupon_fields['valid_until'] != '') {
      $coupon->valid_from = time();
    }
    else{
      $coupon->valid_from = 0;
    }
  }
  
  $coupon->name = $coupon_fields['name'];
  $coupon->code = $coupon_fields['code'];
  $coupon->type = $coupon_fields['type'];
  $coupon->value = $coupon_fields['value'];
  $coupon->status = $coupon_fields['status'];

  if ($coupon_fields['valid_until'] != '') {
    $coupon->valid_until = strtotime($coupon_fields['valid_until'] . ' 23:59:59');
  }
  else{
    $coupon->valid_until = 0;
  }

  uc_coupon_save($coupon);

  if ($coupon->cid) {
    return array('is_error' => false, 'message' => 'Đã lưu thành công.', 'coupon' => $coupon);
  }
  else{
    return array('is_error' => true, 'message' => 'Có lỗi trong lúc tạo mã. Xin vui lòng thử lại sau.');
  }
}

/**
 * Verify a course code.
 */
function custom_video_course_code_verify_callback($nid, $code) {
  module_load_include('inc', 'custom', 'custom');
  
  // Get the course code.
  $result = custom_video_course_code_by_course_nid($nid);
  if (!empty($result) and $result['video_code'] == $code) {
    // Reconize the code.
    global $user;
    $code = md5($code . time());
    variable_set('video_course_' . $user->uid, $code);
    
    return array('is_error' => false, 'message' => 'Đã xác thực.', 'code' => $code);
  }
  
  return array('is_error' => true, 'message' => 'Mã khóa học không đúng. Vui lòng kiểm tra và nhập lại.');
}

/**
 * Load video content (URL, cover, etc).
 */
function custom_node_video_url_get_callback($nid, $cover_size) {
  $node = $nid > 0 ? node_load($nid) : false;
  if (!$node or $node->type != 'video') {
    return array('is_error' => true, 'message' => 'Dữ liệu không hợp lệ.');
  }
  
  module_load_include('inc', 'custom', 'custom');
  global $user;
  
  // Get video cover.
  $video_cover = custom_video_thumbnail_get($node, $cover_size);
  
  // Get video URL.
  $video_url = custom_video_url_get($node);
  
  // Get video details.
  $video_mime_type = !empty($node->field_video_youtube[LANGUAGE_NONE]) ? 'youtube' : $node->field_video[LANGUAGE_NONE][0]['filemime'];
  $video_id = !empty($node->field_video_youtube[LANGUAGE_NONE]) ? $node->field_video_youtube[LANGUAGE_NONE][0]['video_id'] : $node->field_video[LANGUAGE_NONE][0]['fid'];

  $video_is_free = (!empty($node->field_free_mode[LANGUAGE_NONE]) and $node->field_free_mode[LANGUAGE_NONE][0]['value'] == 1) ? true : false;
  $video_free_in_second = variable_get('tasscare_video_free_in_second', 10);
  $video_is_paid = false;
  
  $video_is_course = false;
  $video_course = array();
  if (!empty($node->field_is_video_course[LANGUAGE_NONE]) and $node->field_is_video_course[LANGUAGE_NONE][0]['value'] == 1) {
    $video_is_course = true;
    $video_course = custom_course_by_video_nid($node->nid);
    
    $course_stored_hash = variable_get('video_course_' . $user->uid, '');
      
    // Use one time only.
    if ($course_stored_hash != '') {
      variable_del('video_course_' . $user->uid);
      $video_is_paid = true;
    }
  }
        
  // Check payment for logged user.
  if (!$video_is_paid and $user->uid) {
    $account = user_load($user->uid);
          
    if (!empty($account->field_video_subscription_end[LANGUAGE_NONE]) and $account->field_video_subscription_end[LANGUAGE_NONE][0]['value'] > time()) {
      $video_is_paid = true;
    }

    // Check whether this user has purchased this video.
    if (!$video_is_paid) {
      $result = views_get_view_result('uc_orders_user', 'block_1', $node->nid);
      if (!empty($result)) {
        $video_is_paid = true;
      }
    }
  }

  // Get actual video free in seconds if any.
  if (!empty($node->field_video_free_in_second[LANGUAGE_NONE]) and $node->field_video_free_in_second[LANGUAGE_NONE][0]['value'] > 0) {
    $video_free_in_second = (int) $node->field_video_free_in_second[LANGUAGE_NONE][0]['value'];
  }

  // Collect and return.
  $data = array(
    'nid' => $node->nid,
    'video_id' => 'video-' . $nid . '-' . $video_id,
    'video_url' => $video_url,
    'video_cover' => $video_cover,
    'video_mime_type' => $video_mime_type,
    'video_is_free' => $video_is_free,
    'video_free_in_second' => $video_free_in_second,
    'video_is_paid' => $video_is_paid,
    'video_price' => $node->sell_price > 0 ? (int) $node->sell_price : 0,
    'video_is_course' => $video_is_course,
    'video_course' => $video_course
  );

  // Add dialog for payment popup.
  if (!$video_is_free and !$video_is_paid) {
    if ($video_is_course) {
      $data['video_subscription_popup'] = theme('custom__video_course_popup', array('tasscare_settings' => $data));
    }
    else{
      $data['video_subscription_popup'] = theme('custom__video_subscription_popup', array('tasscare_settings' => $data));
    }
  }
  
  // Add adv video if any.
  if (!empty($node->field_video_adv[LANGUAGE_NONE]) and $node->field_video_adv[LANGUAGE_NONE][0]['fid'] > 0) {
    $data['video_adv_id'] = 'video-adv-' . $nid . '-' . $video_id;
    $data['video_adv_url'] = file_create_url($node->field_video_adv[LANGUAGE_NONE][0]['uri']);
    $data['video_adv_mime_type'] = $node->field_video_adv[LANGUAGE_NONE][0]['filemime'];
    $data['video_adv_insert_at'] = !empty($node->field_video_adv_insert_at[LANGUAGE_NONE]) ? $node->field_video_adv_insert_at[LANGUAGE_NONE][0]['value'] : -1;
  }

  return array('is_error' => false, 'data' => $data);
}

/**
 * Load, calculate and return user profile completeness.
 */
function custom_user_profile_completeness_callback() {
  global $user;
  $account = user_load($user->uid);
  if (!$account) {return array('error' => true, 'message' => 'Không tìm thấy dữ liệu người dùng.');}
  
  // Get the current profile popup no and increase by 1.
  $profile_popup_max = variable_get('profile_notify_day', 3);
  $profile_popup_no = $account->field_profile_popup_no[LANGUAGE_NONE] ? $account->field_profile_popup_no[LANGUAGE_NONE][0]['value'] : 0;
  
  if ($profile_popup_no < $profile_popup_max) {
    // Assume the popup later will show.
    $profile_popup_no++;
    
    // Store to this user's profile.
    $edit = array();
    $edit['field_profile_popup_no'][LANGUAGE_NONE][0]['value'] = $profile_popup_no;
    user_save($account, $edit);
  }
  
  module_load_include('inc', 'custom', 'custom');
  return array(
    'error' => false,
    'message' => theme('custom__profile_alert_popup', array('account' => $account)),
    'data' => array(
      'profile_complete_percent' => (int) custom_user_profile_percentage($account),
      'profile_popup_no' => (int) $profile_popup_no,
      'profile_popup_max' => (int) $profile_popup_max,
    ),
  );
}

/**
 * Set a new order status.
 */
function ubercart_order_update_status_callback($order_id, $order_status) {
  if (uc_order_update_status($order_id, $order_status)) {
    return array('error' => false, 'message' => 'Đã cập nhật trạng thái của đơn hàng thành công.');
  }
  else{
    return array('error' => true, 'message' => 'Có lỗi trong lúc xử lý. Xin vui lòng thử lại.');
  }
}

/**
 * Set to delete a node.
 */
function custom_node_set_deleted_callback($nid) {
  $node = node_load($nid);
  if ($node) {
    // Check permission.
    if (!user_access('delete own ' . $node->type . ' content')) {
      return array('error' => true, 'message' => 'Bạn không có quyền thực hiện thao tác này.');
    }

    node_delete($nid);

    return array('error' => false, 'message' => 'Đã XÓA NỘI DUNG thành công.');
  }
  
  return array('error' => true, 'message' => 'Không tìm thấy dữ liệu. Xin vui lòng thử lại.');
}

/**
 * Set to publish a node.
 */
function custom_node_set_published_callback($nid, $status) {
  $node = node_load($nid);
  if ($node) {
    // Check permission.
    if (!user_access('bypass node access')) {
      if (!user_access('edit own ' . $node->type . ' content')) {
        return array(
          'error' => TRUE,
          'message' => 'Bạn không có quyền thực hiện thao tác này.'
        );
      }
    }
    
    $node->status = $status;
    node_save($node);

    $text = $status == 1 ? 'MỞ KHÓA' : 'KHÓA';
    return array('error' => false, 'message' => 'Đã cập nhật đặt ' . $text . ' thành công.');
  }
  
  return array('error' => true, 'message' => 'Không tìm thấy dữ liệu. Xin vui lòng thử lại.');
}

/**
 * Sticky a node.
 */
function custom_node_set_sticky_callback($nid, $status) {
  $node = node_load($nid);
  if ($node) {
    // Check permission.
    if (!user_access('bypass node access')) {
      if (!user_access('edit own ' . $node->type . ' content')) {
        return array(
          'error' => TRUE,
          'message' => 'Bạn không có quyền thực hiện thao tác này.'
        );
      }
    }

    $node->sticky = $status;
    node_save($node);

    $text = $status == 1 ? 'NỔI BẬT' : 'BỎ NỔI BẬT';
    return array('error' => false, 'message' => 'Đã cập nhật đặt ' . $text . ' thành công.');
  }
  
  return array('error' => true, 'message' => 'Không tìm thấy dữ liệu. Xin vui lòng thử lại.');
}

/**
 * Refreshen a node so that it can go top again.
 */
function custom_node_set_refresh_callback($nid) {
  $node = node_load($nid);
  if ($node) {
    // Check permission.
    if (!user_access('bypass node access')) {
      if (!user_access('edit own ' . $node->type . ' content')) {
        return array(
          'error' => TRUE,
          'message' => 'Bạn không có quyền thực hiện thao tác này.'
        );
      }
    }

    $node->changed = time();
    node_save($node);

    return array('error' => false, 'message' => 'Đã cập nhật LÀM MỚI thành công.');
  }
  
  return array('error' => true, 'message' => 'Không tìm thấy dữ liệu. Xin vui lòng thử lại.');
}

/**
 * Confirm a reset password (change the pass).
 */
function custom_user_password_reset_change_confirm_callback($uid, $confirmed_code, $new_pass) {
  module_load_include('inc', 'custom', 'custom');
  return custom_pass_code_change($uid, $confirmed_code, $new_pass);
}

/**
 * User account activation via passcode.
 */
function custom_user_register_confirm_callback($uid, $code) {
  // Load user account.
  $account = user_load($uid);
  if (!$account) {
    return array('is_error' => true, 'message' => 'Thông tin người dùng không tìm thấy.');
  }
  else if ($account->status) {
    return array('is_error' => true, 'message' => 'Tài khoản đã được kích hoạt rồi và có thể sử dụng để đăng nhập. Bạn không cần phải làm lại.');
  }
  
  // Verify.
  $stored_code = $account->field_otp_code[LANGUAGE_NONE][0]['value'];
  $stored_timestamp = $account->field_otp_stored_timestamp[LANGUAGE_NONE][0]['value'];
  
  $expired_time = 30 * 60; // 30 minutes -> to seconds.
  $time_gap = time() - $stored_timestamp;
  if ($time_gap > $expired_time) {
    return array('is_error' => true, 'message' => 'Mã xác nhận đã quá hạn và không còn giá trị. Vui lòng thử lại để nhận mã khác.');
  }
  
  if ($stored_code != $code) {
    return array('is_error' => true, 'message' => 'Mã xác nhận không đúng. Vui lòng kiểm tra và thử lại.');
  }
  
  // Verify successfully. Set account to be activated.
  $account->field_otp_code[LANGUAGE_NONE][0]['value'] = '';
  $account->field_otp_stored_timestamp[LANGUAGE_NONE][0]['value'] = 0;
  
  $account->status = 1;
  user_save($account);
  
  // Send email.
  if ($account->status) {
    drupal_mail('custom', 'custom_user_create_activation_confirm', $account->mail, language_default(), array('account' => $account), variable_get('site_mail', 'giaidieu1999@gmail.com'));
  }
  
  return array('is_error' => false, 'message' => 'Xác nhận và kích hoạt tài khoản thành công.', 'uid' => $account->uid);
}

/**
 * Confirm a reset password (passcode confirmation).
 */
function custom_user_password_reset_confirm_callback($uid, $code) {
  // Load user account.
  $account = user_load($uid);
  if (!$account) {
    return array('is_error' => true, 'message' => 'Thông tin người dùng không tìm thấy.');
  }
  
  // Verify.
  $stored_code = $account->field_otp_code[LANGUAGE_NONE][0]['value'];
  $stored_timestamp = $account->field_otp_stored_timestamp[LANGUAGE_NONE][0]['value'];
  
  $expired_time = 30 * 60; // 30 minutes -> to seconds.
  $time_gap = time() - $stored_timestamp;
  if ($time_gap > $expired_time) {
    return array('is_error' => true, 'message' => 'Mã xác nhận đã quá hạn và không còn giá trị. Vui lòng thử lại để nhận mã khác.');
  }
  
  if ($stored_code != $code) {
    return array('is_error' => true, 'message' => 'Mã xác nhận không đúng. Vui lòng kiểm tra và thử lại.');
  }
  
  // Verify successfully. Give new code signal and timestamp.
  $account->field_otp_code[LANGUAGE_NONE][0]['value'] = custom_user_password(10);
  $account->field_otp_stored_timestamp[LANGUAGE_NONE][0]['value'] = time();
  user_save($account);
  
  return array('is_error' => false, 'message' => 'Xác nhận thành công. Sử dụng hộp dưới đây để đặt mật khẩu mới của bạn.', 'uid' => $account->uid, 'confirmed_code' => $account->field_otp_code[LANGUAGE_NONE][0]['value']);
}

/**
 * Reset a user password.
 */
function custom_user_password_reset_callback($username) {
  // Check if the username or e-mail does exist.
  $username = strtolower($username);
  if (filter_var($username, FILTER_VALIDATE_EMAIL)) {
    // Check e-mail.
    $uid = db_query("SELECT uid FROM {users} WHERE mail=:mail", array(':mail' => $username))->fetchColumn();
    if (!$uid) {
      return array('is_error' => true, 'message' => 'Địa chỉ e-mail không tồn tại. Xin vui lòng kiểm tra.');
    }
  }
  else{
    // Check username.
    $uid = db_query("SELECT uid FROM {users} WHERE name=:name", array(':name' => $username))->fetchColumn();
    if (!$uid) {
      return array('is_error' => true, 'message' => 'Tên truy nhập không tồn tại. Xin vui lòng kiểm tra.');
    }
  }
  
  // Send the pass reset link to user's email.
  $account = user_load($uid);
  
  // Generate pass code to send to user via either email or SMS.
  $pass_code = custom_user_password(6, '0123456789');
  $fields = array();
  $fields['field_otp_code'][LANGUAGE_NONE][0]['value'] = $pass_code;
  $fields['field_otp_stored_timestamp'][LANGUAGE_NONE][0]['value'] = time();
  $fields['field_otp_code_resend'][LANGUAGE_NONE][0]['value'] = time(); // spam protector.

  // Store the user.
  user_save($account, $fields);
  
  // Notification to user.
  // Send email.
  drupal_mail('custom', 'custom_user_password_request_confirm', $account->mail, language_default(), array('account' => $account), variable_get('site_mail', 'giaidieu1999@gmail.com'));
  return array('is_error' => false, 'uid' => $account->uid, 'message' => 'Chúng tôi đã gửi Mã xác nhận vào địa chỉ e-mail của bạn. Xin vui lòng kiểm tra để nhập xác nhận vào hộp dưới đây.');
}

/**
 * Callback function to smart login a user.
 */
function custom_account_smart_login_callback($name, $password) {
  module_load_include('inc', 'custom', 'custom.core');
  return  custom_account_smart_login($name, $password);
}

/**
 * Callback function to authenticate then login a user.
 */
function custom_account_login_callback($username, $password) {
  // Authenticate this account.
  $uid = user_authenticate($username, $password);

  if (!$uid) {
    return array('error' => true, 'message' => 'Tên truy nhập hoặc Mật khẩu không đúng. Xin vui lòng kiểm tra.');
  }
  
  // Process to login.
  global $user;
  $user = user_load($uid);
  drupal_session_regenerate();
  
  if (isset($user->roles[4]) or isset($user->roles[5])) {
    module_load_include('inc', 'custom', 'custom');
    custom_user_log_activity('Bạn đã ĐĂNG NHẬP vào hệ thống.', 'user');
  }
  else if (isset($user->roles[3]) or isset($user->roles[6])) {
    return array('error' => false, 'message' => 'Đăng nhập thành công.', 'is_admin' => true);
  }
  
  return array('error' => false, 'message' => 'Đăng nhập thành công.');
}

/**
 * Callback function to create or update a node.
 */
function custom_node_store_callback($nid, $node_fields) {
  module_load_include('inc', 'custom', 'custom.core');
  return custom_node_store($nid, $node_fields);
}

/**
 * Callback function to create or update an user account.
 */
function custom_user_store_callback($uid, $account_fields) {
  module_load_include('inc', 'custom', 'custom.core');
  return custom_user_store($uid, $account_fields);
}

/**
 * Callback function to update user password (requires old pass input).
 */
function custom_user_password_update_callback($uid, $pass, $old_pass) {
  // Use function in custom.helper.inc.
  return custom_user_password_update($uid, $pass, $old_pass);
}

/**
 * Callback function to create / login a user via its social account.
 */
function custom_social_login_callback($data) {
  module_load_include('inc', 'custom', 'custom.core');
  return custom_social_login($data);
}

/**
 * Callback function to create a photo filename by its imagedata.
 */
function custom_photo_data_upload_callback($filename, $imagedata) {
  module_load_include('inc', 'custom', 'custom.core');
  return custom_photo_data_upload($filename, $imagedata);
}

/**
 * Callback function to create / update video chuck data.
 */
function custom_video_data_upload_callback($filename, $videodata) {
  module_load_include('inc', 'custom', 'custom.core');
  return custom_video_data_upload($filename, $videodata);  
}

/**
 * Callback function to return a user account by its username.
 */
function custom_user_get_by_name_callback($username) {
  // Using Drupal core function.
  return user_load_by_name($username);
}

/**
 * Callback function to convert coupon code to userpoints.
 */
function custom_account_coupon_to_userpoints_callback($uid, $code) {
  module_load_include('inc', 'custom', 'custom');
  return custom_account_coupon_to_userpoints($uid, $code);
}

/**
 * Callback function to change user password after passcode verification has done.
 */
function custom_pass_code_change_callback($uid, $confirmed_code, $new_pass) {
  module_load_include('inc', 'custom', 'custom');
  return custom_pass_code_change($uid, $confirmed_code, $new_pass);
}

/**
 * Callback function to verify a passcode sent via the SMS.
 */
function custom_pass_code_verify_callback($mobile_number, $code, $is_activation) {
  module_load_include('inc', 'custom', 'custom');
  return custom_pass_code_verify($mobile_number, $code, $is_activation);
}

/**
 * Callback function to generate a passcode to be sent to user via the SMS.
 * User uses this code to confirm that he is owner of the phone number.
 * $name: is username or mobile number.
 */
function custom_pass_code_generate_callback($name) {
  module_load_include('inc', 'custom', 'custom');
  return custom_pass_code_generate($name);
}

/**
 * Callback function to create a Drupal comment.
 */
function custom_comment_create_callback($nid, $parent_id, $subject, $comment_body, $comment_author, $comment_status) {
  module_load_include('inc', 'custom', 'custom');
  return custom_comment_create($nid, $parent_id, $subject, $comment_body, $comment_author, $comment_status);
}

/**
 * Callback function to create Ubercart order.
 */
function custom_ubercart_order_create_callback($order_status, $payment_method, $product_nids, $customer, $billing, $delivery, $other) {
  module_load_include('inc', 'custom', 'custom');
  return custom_ubercart_order_create($order_status, $payment_method, $product_nids, $customer, $billing, $delivery, $other);
}

/**
 * Callback function to update user geocode.
 * To-do: Will rebuild this function later.
 */
function custom_geocode_update_callback($uid, $nid, $lat, $lon) {
  module_load_include('inc', 'custom', 'custom');
  return custom_geocode_update($uid, $nid, $lat, $lon);
}