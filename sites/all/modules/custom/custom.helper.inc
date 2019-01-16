<?php /* Helper function to be used everywhere - made by giaidieu.com */

/**
 * Get statistic votes by a node id.
 */
function custom_get_votes_by_node_id($nid) {
  $votes = array(
    'average' => 0,
    'count' => 0,
    'statistics' => array(),
  );
  
  // Get info calculated by firestar module.
  $fivestar = fivestar_get_votes('node', $nid, 'vote');
  
  if (!empty($fivestar)) {
    $votes['average'] = $fivestar['average']['value'];
    $votes['count'] = $fivestar['count']['value'];
  }
  
  // Return if no votes.
  if (!$votes['count']) {return $votes;}

  // Collect more info from db.
  $result = db_query("SELECT vote_id, value FROM {votingapi_vote} WHERE entity_id=:nid", array(':nid' => $nid));
  
  $statistics = array();
  foreach ($result as $row) {
    if (!isset($statistics[$row->value])) {
      $statistics[$row->value] = 0;
    }
    
    $statistics[$row->value]++;
  }
  
  ksort($statistics);
  
  // Calculate percent over the statistic.
  foreach ($statistics as $star_value => $count) {
    $votes['statistics'][$star_value] = array(
      'count' => $count,
      'percent' => round($count / $votes['count'] * 100),
    );
  }
  
  return $votes;
}

/**
 * Get video duration.
 */
function custom_get_youtube_video_length($video_id) {
  $result = drupal_http_request('https://www.googleapis.com/youtube/v3/videos?id=' . $video_id . '&key=AIzaSyCHph--dWq7tqjvb7HqRgu3SN9pOop31-8&part=contentDetails');
  $data = json_decode($result->data);
  
  $duration_iso = 0;
  if (!empty($data) and !empty($data->items) and isset($data->items[0]->contentDetails)) {
    $duration_iso = $data->items[0]->contentDetails->duration;
  }
  
  if ($duration_iso) {
    $interval = new DateInterval($duration_iso);
    return $interval->format('%H:%I:%S');
  }
  
  return '00:00:00';
}

/**
 * Get total a course duration.
 */
function custom_get_course_duration($nid, $formatted_time = 'H:i:s') {
  // Get all the video duration in the course.
  $result = views_get_view_result('node_functions', 'block_79', $nid);
  //dsm($result);
  
  $total_duration = 0;
  foreach ($result as $row) {
    if (!empty($row->field_field_video_duration)) {
      $time = $row->field_field_video_duration[0]['raw']['value'];
      if (strlen($time) < 8) {
        $time = '00:' . $time;
      }
      
      // Convert formatted time to seconds.
      $params = preg_split('/\:/', $time);
      $hour = (int) $params[0];
      $min = (int) $params[1];
      $sec = (int) $params[2];
      
      $total_duration += $hour * 60 * 60 + $min * 60 + $sec;
    }
  }
  
  return $total_duration ? gmdate($formatted_time, $total_duration) : '00:00:00';
}

/**
 * Give a node object, return video URL to be playable.
 */
function custom_video_url_get($node) {
  if (!empty($node->field_video_youtube[LANGUAGE_NONE]) and $node->field_video_youtube[LANGUAGE_NONE][0]['input'] != '') {
    return $node->field_video_youtube[LANGUAGE_NONE][0]['input'];
  }
  else if (!empty($node->field_video[LANGUAGE_NONE]) and !empty($node->field_video[LANGUAGE_NONE][0]['uri'])) {
    return file_create_url($node->field_video[LANGUAGE_NONE][0]['uri']);
  }
}

/**
 * Given a video node object and image style name, return the thumbnail.
 */
function custom_video_thumbnail_get($node, $image_style_name) {
  if (!empty($node->field_video_youtube[LANGUAGE_NONE])) {
    $youtube_file_uri = youtube_build_thumbnail_uri($node->field_video_youtube[LANGUAGE_NONE][0]['video_id']);
    
    if (!file_exists(drupal_realpath($youtube_file_uri))) {
      youtube_get_remote_image($node->field_video_youtube[LANGUAGE_NONE][0]['video_id']);
    }
    
    return image_style_url($image_style_name, $youtube_file_uri);
  }
  else if (!empty($node->field_video[LANGUAGE_NONE]) and !empty($node->field_video[LANGUAGE_NONE][0]['thumbnailfile'])) {
    return image_style_url($image_style_name, $node->field_video[LANGUAGE_NONE][0]['thumbnailfile']->uri);
  }

  return image_style_url($image_style_name, 'public://default_images/logo1024x1024.png');
}

/**
 * Given a video uploaded file, get its thumbnail via the ffmpeg library.
 */
function custom_video_thumbnail_create($video_fid, $status = 0) {
  // Load the video file object.
  $video = file_load($video_fid);
  if (!$video) {return false;}
  //dsm($video);

  // Prepare the folder.
  $filepath = 'public://videos/thumbnails/' . $video->fid;
  $thumbnail_path = drupal_realpath($filepath);
  
  if (!file_exists($thumbnail_path)) {
    if (!mkdir($thumbnail_path)) {
      watchdog('custom', 'Could not create new directory ' . $thumbnail_path);
      return false;
    }
  }

  // Create video thumbnail.
  $params = preg_split('/\./', $video->filename);
  $filename = time() . '_' . $params[0] . '.jpg';
  $thumbnail_image  = $thumbnail_path . '/' . $filename;
    
  $video_path = drupal_realpath($video->uri);
  shell_exec("ffmpeg -i " . $video_path . " -deinterlace -an -ss 1 -t 00:00:01 -r 1 -y -vcodec mjpeg -f mjpeg " . $thumbnail_image . " 2>&1");
  
  // Create the image file object then return.
  global $user;
  $file = new stdClass();
  $file->uid = $user->uid;
  $file->filename = $filename;
  $file->filesize = filesize($thumbnail_image);
  $file->uri = $filepath . '/' . $filename;
  $file->type = 'image';
  $file->filemine = mime_content_type($thumbnail_image);
  $file->status = $status;
  file_save($file);
  
  if ($file->fid) {
    return $file;
  }
  
  return false;
}

/**
 * Helper function to create a new term.
 */
function custom_term_create($vid, $name, $parent = 0) {
  $term = new stdClass();
  $term->vid = $vid;
  $term->name = $name;
  $term->parent = $parent;
  
  taxonomy_term_save($term);
  return $term->tid ? $term->tid : false;
}

/**
 * Helper function to load profile for customer and doctor user.
 */
function custom_profile_load($uid) {
  $account = user_load($uid);
  if (!empty($account->field_account_type[LANGUAGE_NONE])) {
    if ($account->field_account_type[LANGUAGE_NONE][0]['value'] == 0) {
      $nid = db_query("SELECT nid FROM {node} WHERE type='customer' AND uid=:uid", array(':uid' => $account->uid))->fetchColumn();
    }
    else if ($account->field_account_type[LANGUAGE_NONE][0]['value'] == 1) {
      $nid = db_query("SELECT nid FROM {node} WHERE type='doctor' AND uid=:uid", array(':uid' => $account->uid))->fetchColumn();
    }
      
    if ($nid) {
      return node_load($nid);
    }
  }
  
  return null;
}

/**
 * Check and rename if temp file does exist.
 */
function custom_temp_files_rename($uid, $filename) {
  // Check physical files.
  $result = db_query("SELECT fid, filename FROM {file_managed} WHERE uid=:uid", array(':uid' => $uid));
  foreach ($result as $row) {
    if ($filename == $row->filename) {
      return 'r_' . time() . '_' . $filename;
    }
  }
  
  return $filename;
}

/**
 * Remove temporary images belong to a user.
 */
function custom_temp_files_remove($uid) {
  // Remove physical files.
  $result = db_query("SELECT fid, uri FROM {file_managed} WHERE uid=:uid AND status='0'", array(':uid' => $uid));
  foreach ($result as $row) {
    drupal_unlink($row->uri);
  }

  // Remove temp files in db.
  db_query("DELETE FROM {file_managed} WHERE uid=:uid AND status='0'", array(':uid' => $uid));
}

/**
 * Create a new node by type.
 * @return: nid.
 */
function custom_node_create($uid, $name, $type, $title = '', $status = 0, $body = '') {
  global $language;
  
  $node = new stdClass();
  $node->type = $type;
  $node->language = $language->language;
  $node->uid = $uid;
  $node->name = $name;
  $node->title = $title == '' ? $name : $title;
  $node->status = $status;
  
  if ($body != '') {
    $node->body[LANGUAGE_NONE][0]['value'] = $body;
    $node->body[LANGUAGE_NONE][0]['format'] = 'full_html';
  }

  node_save($node);
  return $node->nid;
}

/**
 * Create a new user.
 */
function custom_user_create($name, $pass, $mail, $status, $role = null) {
  $account = array(
    'name' => $name,
    'pass' => $pass,
    'mail' => $mail,
    'status' => $status,
    'init' => $mail,
    'roles' => array(
      DRUPAL_AUTHENTICATED_RID => 'authenticated user',
    ),
  );
  
  // Assign role if available.
  // $role = array('rid' => $rid, 'value' => $value);
  if (is_array($role)) {
    $account['roles'][$role['rid']] = $role['value'];
  }
  
  return user_save('', $account);
}

/**
 * Update user password.
 */
function custom_user_password_update($uid, $pass, $old_pass = '') {
  $account = user_load($uid);
  if (!$account) {
    return array('error' => true, 'message' => 'Không tìm thấy thông tin tài khoản.');
  }
  
  // Validate user pass.
  if ($old_pass != '') {
    if (!user_authenticate($account->name, $old_pass)) {
      return array('error' => true, 'message' => 'Mật khẩu cũ của bạn không đúng.');
    }
  }

  if ($account) {
    $edit = array();
    $edit['pass'] = $pass;
    user_save($account, $edit);

    return array('error' => false, 'message' => 'Đổi mật khẩu thành công.');
  }
  
  return array('error' => true, 'message' => 'Lỗi không xác định.');
}

/**
 * Generate user password - copied from Drupal.org.
 */
function custom_user_password($length = 10, $allowable_characters = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789') {
  // Zero-based count of characters in the allowable list:
  $len = strlen($allowable_characters) - 1;

  // Declare the password as a blank string.
  $pass = '';

  // Loop the number of times specified by $length.
  for ($i = 0; $i < $length; $i++) {
    do {
      // Find a secure random number within the range needed.
      $index = ord(drupal_random_bytes(1));
    } while ($index > $len);

    // Each iteration, pick a random character from the
    // allowable string and append it to the password:
    $pass .= $allowable_characters[$index];
  }

  return $pass;
}