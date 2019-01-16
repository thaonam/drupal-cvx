<?php /* Core library for shared functions made by giaidieu.com */

/**
 * Create / update video livestream data.
 */
function custom_video_data_upload($filename, $videodata) {
  // Get the temp folder for storing data.
  $tmp_path = file_directory_temp();
  
  // Check the filename if it does exist.
  $filepath = $tmp_path . '/' . $filename;
  $result = file_put_contents($filepath, $videodata, FILE_APPEND);
  
  watchdog('custom', 'File: ' + $filepath + ' - Size: ' + $result);
  
  return $result;
}

/**
 * Custom video stream upload create actual file.
 */
function custom_video_livestream_upload() {
  // Collect data.
  $tmp_data = $_FILES['file_data'];
  $tmp_name = $_POST['file_name'];

  $filepath = 'private://videos/original';
  //$filename = 'stream_' . $tmp_name . '_' . time() . '.webm';
  $filename = 'stream_' . $tmp_name . '_' . time() . '.mp4';

  $filepath_real = drupal_realpath($filepath) . '/' . $filename;

  if (!move_uploaded_file($tmp_data['tmp_name'], $filepath_real)) {
    watchdog('custom', t('Could not move the uploaded video file %filename to the right folder!', array('%filename' => $filename)));
  }
  else{
    // Create fieldfield object then store.
    global $user;
    $video = new stdClass();
    $video->uid = $user->uid;
    $video->filename = $filename;
    $video->filesize = filesize($filepath_real);
    $video->uri = $filepath . '/' . $filename;
    $video->type = 'video';
    $video->filemine = mime_content_type($filepath_real);
    $video->status = 0;

    file_save($video);

    if ($video->fid) {
      drupal_json_output(array('is_error' => false, 'fid' => $video->fid, 'url' => file_create_url($video->uri), 'filename' => $filename));
      exit;
    }
  }

  drupal_json_output(array('is_error' => true, 'message' => 'Có lỗi trong quá trình xử lý. Vui lòng thử lại sau'));
  exit;
}

/**
 * Custom video upload.
 */
function custom_video_upload() {
  // Get the file.
  $file = isset($_FILES['file']) ? $_FILES['file'] : null;

  // Move the images file into the folder.
  if (!is_null($file) and !empty($file['name'])) {
    $filepath = 'private://videos/original';
    $filename = strtolower($file['name']);

    // Clean the filename.
    if (module_exists('transliteration')) {
      $filename = transliteration_clean_filename($filename);
    }
    else{
      $filename = preg_replace('/\s+/', '_', $filename);
    }

    // Get the absolute filepath.
    $filename = time() . '_' . strtolower($filename); // Make this filename unique.
    $filepath_real = drupal_realpath($filepath) . '/' . $filename;

    if (!move_uploaded_file($file['tmp_name'], $filepath_real)) {
      watchdog('custom', t('Could not move the uploaded video file %filename to the right folder!', array('%filename' => $filename)));
    }
    else{
      // Create fieldfield object then store.
      global $user;
      $video = new stdClass();
      $video->uid = $user->uid;
      $video->filename = $filename;
      $video->filesize = filesize($filepath_real);
      $video->uri = $filepath . '/' . $filename;
      $video->type = 'video';
      $video->filemine = mime_content_type($filepath_real);
      $video->status = 0;

      file_save($video);

      if ($video->fid) {
        // Get video thumbnail.
        $video_thumbnail = custom_video_thumbnail_create($video->fid);
        if ($video_thumbnail) {
          // Return to client handler for continuing processing.
          echo $video->fid . '|' . $video_thumbnail->fid . '|' . image_style_url('media_thumbnail', $video_thumbnail->uri);
        }

        exit;
      }
    }
  }
  else{
    echo '0|Vui lòng chọn file Video để tải lên.';
    exit;
  }

  // Failed to process the file. Return fid as 0.
  echo 0;
  exit;
}

/**
 * Get current userpoints.
 */
function custom_userpoints_get_current_points($uid) {
  if (module_exists('userpoints')) {
    return (int) userpoints_get_current_points($uid);
  }

  return 0;
}

/**
 * Add point to userpoints.
 */
function custom_userpoints_add_points($uid, $points) {
  if (module_exists('userpoints')) {
    $params = array(
      'uid' => $uid,
      'points' => $points,
      'entity_id' => $uid,
      'entity_type' => 'user',
    );
    
    $result = userpoints_userpointsapi($params);
    if ($result['status']) {
      $result['total_points'] = userpoints_get_current_points($uid);
      return $result;
    }
    else{
      $result['reason'] = t($result['reason']);
      return $result;
    }
  }
  
  return false;
}

/**
 * Login with social (FB / Google+) info. Can be used for other as well.
 * $data: An array of user data; requires: $data['email'].
 */
function custom_social_login($data) {
  // Collect data.
  $email = strtolower($data['email']);

  // Check if email does exists. If does, do login.
  $uid = db_query("SELECT uid FROM {users} WHERE LOWER(mail)=:mail", array(':mail' => $email))->fetchColumn();
  if (!$uid) {
    // Register this user with the email.
    $result = custom_user_create_by_data($data);
    if ($result['uid']) {
      $uid = $result['uid'];
      
      // Send the username / password to user via email for keeping.
      $account = user_load($uid);
      $account->plain_pass = $result['pass'];
      drupal_mail('custom', 'custom_user_create_social_confirm', $account->mail, language_default(), array('account' => $account), variable_get('site_mail', 'giaidieu1999@gmail.com'));
    }
  }

  if (!$uid) {return false;}

  // Auto login this user.
  global $user;
  $user = isset($account) ? $account : user_load($uid);
  drupal_session_regenerate();

  if (isset($user->roles[4]) or isset($user->roles[5])) {
    module_load_include('inc', 'custom', 'custom');
    custom_user_log_activity('Bạn đã ĐĂNG NHẬP vào hệ thống bằng tài khoản mạng xã hội.', 'user');
  }

  return $user;
}

/**
 * Send a push notification to receiver.
 * $payload is an array of array('title' => '', 'alert' => '', 'nid' => '').
 */
function custom_push_notification_send($uid, $payload) {
  if (!module_exists('push_notifications')) {return;}

  // Get all user's tokens.
  $tokens = push_notification_get_user_tokens($uid);

  if (!empty($tokens)) {
		push_notifications_send_alert($tokens, $payload);
  }
}

/**
 * Determine all tokens.
 * @return array Array of token database records.
 *
 */
function custom_push_notification_get_all_tokens() {
  // Select all tokens.
  $query = db_select('push_notifications_tokens', 'pnt');
  $query->fields('pnt');
  //$query->condition('pnt.uid', $uid);
  $result = $query->execute();

  $tokens = array();
  foreach ($result as $record) {
    $tokens[$record->token] = $record;
  }

  return $tokens;
}

/**
 * Send a push notification to all users.
 */
function custom_push_notification_send_all($payload) {
  if (!module_exists('push_notifications')) {return;}

  // Get all registered tokens.
  $tokens = custom_push_notification_get_all_tokens();

  if (!empty($tokens)) {
		push_notifications_send_alert($tokens, $payload);
  }
}

/**
 * Process to upload image data to server then return its fid.
 * Mostly will used via the HTML 5 canvas imagedata upload.
 */
function custom_photo_data_upload($filename, $imagedata) {
  // Remove old unpublic images.
	global $user;
	custom_temp_files_remove($user->uid);

	// Clean the filename.
	if (module_exists('transliteration')) {
		$filename = transliteration_clean_filename($filename);
	}

	// Create image fieldfield object then store.
  $filepath = 'public://user-photos/' . $filename;
	$file = file_save_data(base64_decode($imagedata), $filepath, FILE_EXISTS_RENAME);
	image_path_flush($file->uri);

	// Set to temp file.
	$file->status = 0;
	file_save($file);

	if ($file->fid) {
	  // Return the fid for continuing processing.
		return $file->fid;
	}

  // Failed to process. Return fid as 0.
  return 0;
}

/**
 * Process to upload image file to server then return its fid.
 * Mostly will use this function via the ajax caller for filefield uploader.
 */
function custom_photo_upload() {
  // Move the images file into the folder
  if (isset($_FILES['file']) and !empty($_FILES['file']['name'])) {
    $filepath_public = 'public://user-photos';
    $image_name = strtolower($_FILES['file']['name']);

    // Clean the filename.
    if (module_exists('transliteration')) {
      $image_name = transliteration_clean_filename($image_name);
    }

    // Get the absolute filepath.
    $filepath_real = drupal_realpath($filepath_public) . '/' . $image_name;

    if (!move_uploaded_file($_FILES['file']['tmp_name'], $filepath_real)) {
      watchdog('custom', t('Could not move the uploaded image %image_name to the right folder!', array('%image_name' => $image_name)));
    }
    else{
      // Create image fieldfield object then store.
      $image = file_get_contents($filepath_real);
      unlink($filepath_real);

      if ($image) {
        // Remove all temp files those relate to this user, avoid buggy duplicated filename.
        //global $user;
        //custom_temp_files_remove($user->uid);
        //$image_name = custom_temp_files_rename($user->uid, $image_name);
        
        // Workaround to skip duplicated tmp file issue.
        $image_name = 'r_' . time() . '_' . $image_name;

        $file = file_save_data($image, $filepath_public . '/' . $image_name, FILE_EXISTS_RENAME);
        image_path_flush($file->uri);

        // Set to temp file.
        $file->status = 0;
        file_save($file);

        if ($file->fid) {
          // Return to client handler for continuing processing.
          echo $file->fid;
          exit;
        }
      }
      else{
        watchdog('custom', t('Could not store image name %image_name', array('%image_name' => $image_name)));
      }
    }
  }

  // Failed to process the file. Return fid as 0.
  echo 0;
  exit;
}

/**
 * Process to upload image file to server then return its fid.
 * Mostly will use this function via the ajax caller for filefield uploader.
 */
function custom_photo_upload2() {
  // Move the images file into the folder
  if (isset($_FILES['file']) and !empty($_FILES['file']['name'])) {
    $filepath_public = 'public://user-photos';
    $image_name = strtolower($_FILES['file']['name']);

    // Clean the filename.
    if (module_exists('transliteration')) {
      $image_name = transliteration_clean_filename($image_name);
    }

    // Get the absolute filepath.
    $filepath_real = drupal_realpath($filepath_public) . '/' . $image_name;

    if (!move_uploaded_file($_FILES['file']['tmp_name'], $filepath_real)) {
      watchdog('custom', t('Could not move the uploaded image %image_name to the right folder!', array('%image_name' => $image_name)));
    }
    else{
      // Create image fieldfield object then store.
      $image = file_get_contents($filepath_real);
      unlink($filepath_real);

      if ($image) {
        // Workaround to skip duplicated tmp file issue.
        $image_name = 'r_' . time() . '_' . $image_name;

        $file = file_save_data($image, $filepath_public . '/' . $image_name, FILE_EXISTS_RENAME);
        image_path_flush($file->uri);

        // Set to temp file.
        $file->status = 0;
        $file->alt = $_FILES['file']['name'];
        file_save($file);

        if ($file->fid) {
          // Return to client handler for continuing processing.
          echo $file->fid . '|' . image_style_url('media_thumbnail', $file->uri) . '|' . $_FILES['file']['name'];
          exit;
        }
      }
      else{
        watchdog('custom', t('Could not store image name %image_name', array('%image_name' => $image_name)));
      }
    }
  }

  // Failed to process the file. Return fid as 0.
  echo 0;
  exit;
}

/**
 * Generate passcode for new user when registering from mobile.
 */
function custom_pass_code_mobile_activate($account) {
  // Generate the code and store.
  $pass_code = custom_user_password(6, '0123456789');
  $account->field_otp_code[LANGUAGE_NONE][0]['value'] = $pass_code;
  $account->field_otp_stored_timestamp[LANGUAGE_NONE][0]['value'] = time();
  user_save($account);
  
  // Process to send SMS.
  if (module_exists('esms')) {
    $site_name = variable_get('site_name', 'TASSCARE');
    $message = variable_get('esms_user_register', '%CODE%');
    
    $tokens = array('/\%SITE_NAME\%/', '/\%CODE\%/');
    $replacements = array($site_name, $pass_code);
    $message = preg_replace($tokens, $replacements, $message);
    
    $mobile = $account->field_mobile_number[LANGUAGE_NONE][0]['value'];
    
    $result = esms_send_message($message, $mobile, 4); // 4=verify; 6=notify.
    if ($result['CodeResult'] == 100) {
      // Do nothing.
    }
    else{
      watchdog('custom', 'Cannot send SMS to this number: ' . $mobile);
    }
  }
  else{
    watchdog('custom', 'You may need to enable esms module for SMS feature.');
  }
}

/**
 * Do a smart login via username, email, or mobile number.
 */
function custom_account_smart_login($name, $password) {
  // $name can be anything.
  $name = strtolower($name);
  $username = '';
  $username_type = '';
  
  // If it is an email.
  if (filter_var($name, FILTER_VALIDATE_EMAIL)) {
    $username = db_query("SELECT name FROM {users} WHERE mail=:mail", array(':mail' => $name))->fetchColumn();
    $username_type = 'Địa chỉ E-mail';
  }

  // If it is a mobile number.
  if ($username == '' and mobilevn_is_valid_mobile_number($name)) {
    $result = views_get_view_result('drupalapp_user_functions', 'block_1', $name);
    if (!empty($result)) {
      $username = $result[0]->users_name;
      $username_type = 'Số điện thoại';
    }
  }

  // If it is a username.
  if ($username == '') {
    // Must lah.
    $username = $name;
    $username_type = 'Tên truy nhập';
  }

  // Authenticate this account.
  $uid = user_authenticate($username, $password);
  if (!$uid) {
    return array('is_error' => true, 'message' => $username_type . ' hoặc Mật khẩu không đúng. Xin vui lòng kiểm tra.');
  }

  // Process to login.
  global $user;
  $user = user_load($uid);
  drupal_session_regenerate();

  if (isset($user->roles[4]) or isset($user->roles[5])) {
    module_load_include('inc', 'custom', 'custom');
    custom_user_log_activity('Bạn đã ĐĂNG NHẬP vào hệ thống bằng ' . $username_type . '.', 'user');
  }

  // Return the username for login via App.
  return array('is_error' => false, 'message' => 'Đăng nhập có thể thành công.', 'username' => strtolower($username), 'user' => $user, 'login_type' => $username_type);
}

/**
 * Create a new user account by data.
 * E-mail must exist in the $account_fields.
 */
function custom_user_create_by_data($account_fields) {
  // Check for username / email existance.
  $email = strtolower($account_fields['email']);
  $name = isset($account_fields['name']) ? strtolower($account_fields['name']) : $email;

  // Create a valid and unique username.
  if (module_exists('email_registration')) {
    $name = email_registration_cleanup_username($name);
    $name = email_registration_unique_username($name);
  }

  $uid = db_query("SELECT uid FROM {users} WHERE mail=:mail OR name=:name", array(':mail' => $email, 'name' => $name))->fetchColumn();
  if ($uid) {
    return array('uid' => 0, 'message' => 'Địa chỉ E-mail đã tồn tại rồi. Vui lòng chọn một địa chỉ khác hoặc lấy lại mật khẩu nếu e-mail này là của bạn.');
  }
  
  // Check mobile phone, must be unique also.
  if (isset($account_fields['field_mobile_number']) and isset($account_fields['field_mobile_number']['value'])) {
    $check_mobile = views_get_view_result('drupalapp_user_functions', 'block_1', $account_fields['field_mobile_number']['value']);
    if (!empty($check_mobile)) {
      return array('uid' => 0, 'message' => 'Số điện thoại đã tồn tại rồi. Vui lòng chọn một số khác hoặc lấy lại mật khẩu nếu số điện thoại này là của bạn.');
    }
  }


  // Set up the user fields.
  $fields = array(
    'name' => $name,
    'mail' => $account_fields['email'],
    'pass' => isset($account_fields['password']) ? $account_fields['password'] : custom_user_password(6),
    'status' => isset($account_fields['status']) ? $account_fields['status'] : 1,
    'init' => $account_fields['email'],
    'roles' => array(
      DRUPAL_AUTHENTICATED_RID => 'authenticated user',
    ),
  );
  
  // If register from social network, we need the pass to be returned to send to user later.
  $password = '';
  if (!isset($account_fields['password'])) {
    $password = $fields['pass'];
  }
  
  // Add role.
  if (isset($account_fields['field_account_type'])) {
    if ($account_fields['field_account_type']['value'] == 0) {
      $fields['field_account_type'][LANGUAGE_NONE][0]['value'] = 0;
      $fields['roles'][4] = 'customer';
    }
    else if ($account_fields['field_account_type']['value'] == 1) {
      $fields['field_account_type'][LANGUAGE_NONE][0]['value'] = 1;
      $fields['roles'][5] = 'doctor';
    }
  }
  else{
    // Workaround for profile type.
    $fields['field_account_type'][LANGUAGE_NONE][0]['value'] = 0;
    $fields['roles'][4] = 'customer';
  }
  
  if (isset($account_fields['field_full_name'])) {
    $fields['field_full_name'][LANGUAGE_NONE][0]['value'] = $account_fields['field_full_name']['value'];
  }

  if (isset($account_fields['first_name']) and $account_fields['first_name'] != '') {
    $fields['field_full_name'][LANGUAGE_NONE][0]['value'] = $account_fields['first_name'] . ' ' . $account_fields['last_name'];
  }

  if (isset($account_fields['gender']) and $account_fields['gender'] != '') {
    $fields['field_gender'][LANGUAGE_NONE][0]['value'] = $account_fields['gender'];
  }

  // Setup cover if presence.
  // This is for creating a user from social login.
  if (!empty($account_fields['cover']) and isset($account_fields['cover']['source']) and $account_fields['cover']['source'] != '') {
    $image_url = preg_split('/\?/', $account_fields['cover']['source']);
    if ($account_fields['caller'] == 'facebook') {
      $image = file_get_contents($account_fields['cover']['source']);
    }
    else{
      $image = file_get_contents($image_url[0]);
    }

    if ($image) {
      $filepath_public = 'public://user-photos';
      $image_name = basename($image_url[0]);
      $file = file_save_data($image, $filepath_public . '/' . $image_name, FILE_EXISTS_RENAME);
      image_path_flush($file->uri);

      $file->status = 1;
      file_save($file);
      
      if ($file->fid) {
        $fields['field_photo'][LANGUAGE_NONE][0] = (array) $file;
      }
    }
  }
  
  $user = user_save('', $fields);

  return array('uid' => $user->uid, 'pass' => $password, 'message' => t('Successfully registered to the system.'));
}

/**
 * Update an existing user account.
 * $account_fields contains fields used in the update.
 * $account_fields['field_name']['value'] = value.
 * 
 * Invention for speical fields:
 * $account_fields = array('email', 'name', 'password');
 */
function custom_user_store($uid, $account_fields) {
  // Create a new user if 0 is given.
  $is_new = $uid > 0 ? false : true;
  if ($is_new) {
    $result = custom_user_create_by_data($account_fields);
    if (!$result['uid']) {
      $result['is_error'] = true;
      return $result;
    }
    
    $uid = $result['uid'];
  }
  
  // Load the account for adding more field values.
  $account = user_load($uid);
  $edit = array();
  
  // By default, set user to be inactive.
  if ($is_new) {
    $edit['status'] = 0;

    // Generate pass code to send to user via either email or SMS.
    $pass_code = custom_user_password(6, '0123456789');
    $edit['field_otp_code'][LANGUAGE_NONE][0]['value'] = $pass_code;
    $edit['field_otp_stored_timestamp'][LANGUAGE_NONE][0]['value'] = time();
    $edit['field_otp_code_resend'][LANGUAGE_NONE][0]['value'] = time(); // spam protector.
  }

  // Validate inputs.
  if (!$account or !$account->uid) {
    return array('is_error' => true, 'uid' => 0, 'message' => t('Cannot retrieve user data.'));
  }
  
  // Lower username / email for validation purpose.
  if (isset($account_fields['name'])) {
    $account_fields['name'] = strtolower($account_fields['name']);
  }
  if (isset($account_fields['email'])) {
    $account_fields['email'] = strtolower($account_fields['email']);
  }

  // If username changed, validate existance.
  if (!$is_new and isset($account_fields['name']) and $account->name != $account_fields['name']) {
    $uid = db_query("SELECT uid FROM {users} WHERE name=:name", array(':name' => $account_fields['name']))->fetchColumn();
    if ($uid) {
      return array('is_error' => true, 'uid' => 0, 'message' => 'Tên truy nhập mới đã tồn tại rồi.');
    }
  }

  if (!$is_new and isset($account_fields['email']) and $account->mail != $account_fields['email']) {
    $uid = db_query("SELECT uid FROM {users} WHERE mail=:mail", array(':mail' => $account_fields['email']))->fetchColumn();
    if ($uid) {
      return array('is_error' => true, 'uid' => 0, 'message' => 'Địa chỉ e-mail mới đã tồn tại rồi.');
    }
  }

  foreach ($account_fields as $field_name => $field_value) {
    // Handle special fields for updated cases.
    if ($field_name == 'email' and !$is_new) {
      if ($account->mail != $account_fields['email'] and filter_var($account_fields['email'], FILTER_VALIDATE_EMAIL)) {
        // Update user e-mail.
        $edit['mail'] = $field_value;
      }
    }
    else if ($field_name == 'field_admin_permission') {
      if ($field_value['target_id'] == 0) {
        $edit['field_admin_permission'][LANGUAGE_NONE] = array();
      }
      else{
        $edit['field_admin_permission'][LANGUAGE_NONE][0] = $field_value;
      }
    }
    else if ($field_name == 'field_subdomain') {
      // Validate, make sure this subdomain is valid.
      if (module_exists('subdomain')) {
        $field_value['value'] = _subdomain_clean_up_name($field_value['value']);
        $subdomain = _subdomain_load_record_by_subdomain($field_value['value']);

        if ($subdomain and $subdomain->uid != $uid) {
          return array('is_error' => true, 'message' => 'Sub-domain này đã tồn tại rồi. Xin vui lòng chọn một tên khác.');
        }
        else if ($subdomain and $subdomain->subdomain != $field_value['value']) {
          // Store to user account.
          $edit['field_subdomain'][LANGUAGE_NONE][0] = $field_value;

          // Update the subdomain URL.
          _subdomain_subdomain_save($uid, $field_value['value']);
        }
        else{
          // Store to user account.
          $edit['field_subdomain'][LANGUAGE_NONE][0] = $field_value;

          // Create a new subdomain URL.
          _subdomain_subdomain_save($uid, $field_value['value']);          
        }
      }
    }
    else if ($field_name == 'password' and !$is_new) {
      // Update user password.
      $edit['pass'] = $field_value;
    }
    else if ($field_name == 'field_birthdate') {
      //$field_value['value'] = strtotime($field_value['value']);
      $edit['field_birthdate'][LANGUAGE_NONE][0] = $field_value;
    }
    else if ($field_name == 'field_address') {
      $profile = custom_profile_load($uid);
      $profile->field_address[LANGUAGE_NONE][0] = $field_value;
      node_save($profile);
    }
    else if ($field_name == 'field_current_address') {
      $profile = custom_profile_load($uid);
      $profile->field_current_address[LANGUAGE_NONE][0] = $field_value;
      node_save($profile);
    }
    else if ($field_name == 'facebook_page') {
      $profile = custom_profile_load($uid);
      $profile->field_social_address[LANGUAGE_NONE][0] = array(
        'service' => 'facebook',
        'url' => $field_value,
        'weight' => -10,
      );
      node_save($profile);
    }
    else if ($field_name == 'field_skype_id') {
      $profile = custom_profile_load($uid);
      $profile->field_skype_id[LANGUAGE_NONE][0] = $field_value;
      node_save($profile);
    }
    else if ($field_name == 'field_cover_picture') {
      $profile = custom_profile_load($uid);

      // Load image file.
      $file = file_load($field_value);
      if ($file) {
        $file->status = 1;
        file_save($file);

        // Remove current file if exist.
        if (!empty($profile->field_cover_picture[LANGUAGE_NONE])) {
          drupal_unlink($profile->field_cover_picture[LANGUAGE_NONE][0]['uri']);
        }

        $profile->field_cover_picture[LANGUAGE_NONE][0] = (array) $file;
        node_save($profile);
      }
    }
    else if ($field_name == 'field_full_name') {
      // Update both account and profile field - same value.
      $profile = custom_profile_load($uid);
      $profile->title = $field_value['value'];
      node_save($profile);
      
      $edit['field_full_name'][LANGUAGE_NONE][0] = $field_value;
    }
    
    // Go through and take only fields those exist in user account fields.
    else if (isset($account->{$field_name})) {
      if (is_array($field_value)) {
        $edit[$field_name][LANGUAGE_NONE][0] = $field_value; // $field_value['value']
      }
      else if ($field_name == 'field_photo') {
        $file = file_load($field_value);
        if ($file) {
          $file->status = 1;
          file_save($file);

          // Remove current file if exist.
          if (!empty($account->field_photo[LANGUAGE_NONE])) {
            drupal_unlink($account->field_photo[LANGUAGE_NONE][0]['uri']);
          }

          $edit['field_photo'][LANGUAGE_NONE][0] = (array) $file;
        }
      }
      else{
        $edit[$field_name] = $field_value;
      }
    }
  }

  // Save the changes and return new account.
  user_save($account, $edit);
  
  // Update image link.
  $account->field_photo[LANGUAGE_NONE][0]['url'] = image_style_url('cut_480x480', $account->field_photo[LANGUAGE_NONE][0]['uri']);
  
  // Send the passcode to user for account activation.
  if ($is_new and $account->uid) {
    if (isset($account_fields['register_from']) and $account_fields['register_from'] == 'mobile') {
      // Send SMS.
      custom_pass_code_mobile_activate($account);
    }
    else{
      // Send email.
      drupal_mail('custom', 'custom_user_create_activation_required', $account->mail, language_default(), array('account' => $account), variable_get('site_mail', 'giaidieu1999@gmail.com'));
    }
  }

  return array('is_error' => false, 'uid' => $account->uid, 'message' => 'Thông tin tài khoản của bạn đã được cập nhật.', 'account' => $account);
}

/**
 * Create / Update a node.
 * $node_fields contains fields used in the update.
 * $node_fields['field_name']['value'] = value.
 */
function custom_node_store($nid, $node_fields) {
  global $user;
  
  // Create a new node if $nid = 0;
  if ($nid == 0 and isset($node_fields['type'])) {
    /**
     * $uid, $name, $type, $title = '', $status = 1, $body = ''
     * Create product service with status 0
     */
    $status = (isset($node_fields['status'])) ? $node_fields['status'] : 0;
    $nid = custom_node_create($user->uid, $user->name, $node_fields['type'], '', $status);
    if (!$nid) {return array('error' => true, 'message' => 'Không tạo được dữ liệu mới. Vui lòng liên hệ để được giúp đỡ.');}
  }

  // Load the node for adding more field values.
  $node = node_load($nid);
  if (!$node) {return array('error' => true, 'message' => 'Không tìm thấy dữ liệu.');}

  foreach ($node_fields as $field_name => $field_value) {
    // Check SKU / Model - must not exist.
    if ($field_name == 'model') {
      if ($node->model == '' or $node->model != $field_value) {
        // Check existance.
        $check_model = views_get_view_result('node_functions', 'block_69', $field_value);
        if (!empty($check_model)) {
          return array('error' => true, 'message' => 'Mã SKU đã tồn tại rồi. Xin vui lòng chọn mã khác.');
        }
      }
      
      $node->model = $field_value;
    }
    
    // Some special fields for VIDEO.
    else if ($field_name == 'video_categories') {
      $node->field_video_category[LANGUAGE_NONE] = array();
      
      for ($i = 0; $i < count($field_value['video_categories']); $i++) {
        if (is_numeric($field_value['video_categories'][$i]) and $field_value['video_categories'][$i] > 0) {
          $node->field_video_category[LANGUAGE_NONE][$i]['tid'] = $field_value['video_categories'][$i];
        }
        else{
          $term_id = custom_term_create(3, $field_value['video_categories'][$i]);
          if ($term_id) {
            $node->field_video_category[LANGUAGE_NONE][$i]['tid'] = $term_id;
          }
        }
      }
    }
    else if ($field_name == 'video_group') {
      $node->field_tags[LANGUAGE_NONE] = array();
      
      for ($i = 0; $i < count($field_value['video_group']); $i++) {
        if (is_numeric($field_value['video_group'][$i]) and $field_value['video_group'][$i] > 0) {
          $node->field_tags[LANGUAGE_NONE][$i]['tid'] = $field_value['video_group'][$i];
        }
        else{
          $term_id = custom_term_create(11, $field_value['video_group'][$i]);
          if ($term_id) {
            $node->field_tags[LANGUAGE_NONE][$i]['tid'] = $term_id;
          }
        }
      }
    }
    else if ($field_name == 'field_video') {
      // Process video field.
      if ($field_value['video_fid'] > 0) {
        $video_file = file_load($field_value['video_fid']);
        if ($video_file) {
          $video_file->status = 1;
          file_save($video_file);
          
          // Remove old video / thumbnail.
          if (!empty($node->field_video[LANGUAGE_NONE])) {
            $file_video_old = file_load($node->field_video[LANGUAGE_NONE][0]['fid']);
            file_delete($file_video_old);
            
            if (is_object($node->field_video[LANGUAGE_NONE][0]['thumbnailfile'])) {
              $file_thumbnail_old = file_load($node->field_video[LANGUAGE_NONE][0]['thumbnailfile']->fid);
              file_delete($file_thumbnail_old);
            }
          }
          
          // Get video thumbnail.
          if ($field_value['thumbnail_fid'] > 0) {
            $thumb = file_load($field_value['thumbnail_fid']);
            if ($thumb->fid) {
              $thumb->status = 1;
              file_save($thumb);
            }
          }
          
          if (!$thumb) {
            $thumb = custom_video_thumbnail_create($field_value['video_fid'], 1);
          }

          $video_file->thumbnail = $thumb->fid;
          $video_file->thumbnailfile = $thumb;
  
          $node->field_video[LANGUAGE_NONE] = array();
          $node->field_video[LANGUAGE_NONE][0] = (array) $video_file;
        }
      }
    }
    else if ($field_name == 'field_video_adv') {
      // Process video field.
      if ($field_value['video_fid'] > 0) {
        $video_file = file_load($field_value['video_fid']);
        if ($video_file) {
          $video_file->status = 1;
          file_save($video_file);
          
          // Remove old video / thumbnail.
          if (!empty($node->field_video_adv[LANGUAGE_NONE])) {
            $file_video_old = file_load($node->field_video_adv[LANGUAGE_NONE][0]['fid']);
            file_delete($file_video_old);
            
            if (is_object($node->field_video_adv[LANGUAGE_NONE][0]['thumbnailfile'])) {
              $file_thumbnail_old = file_load($node->field_video_adv[LANGUAGE_NONE][0]['thumbnailfile']->fid);
              file_delete($file_thumbnail_old);
            }
          }
          
          // Get video thumbnail.
          if ($field_value['thumbnail_fid'] > 0) {
            $thumb = file_load($field_value['thumbnail_fid']);
            if ($thumb->fid) {
              $thumb->status = 1;
              file_save($thumb);
            }
          }
          
          if (!$thumb) {
            $thumb = custom_video_thumbnail_create($field_value['video_fid'], 1);
          }

          $video_file->thumbnail = $thumb->fid;
          $video_file->thumbnailfile = $thumb;
  
          $node->field_video_adv[LANGUAGE_NONE] = array();
          $node->field_video_adv[LANGUAGE_NONE][0] = (array) $video_file;
        }
      }
    }
    else if ($field_name == 'field_video_youtube') {
      if ($field_value['input'] == '') {
        $node->field_video_youtube[LANGUAGE_NONE] = array();
      }
      else{
        $node->field_video_youtube[LANGUAGE_NONE] = [$field_value];
      }
    }
    
    // Some special fields for add-ons.
    else if ($field_name == 'product_addons') {
      // Remove all existing collection values.
      if (!empty($node->field_products_addon[LANGUAGE_NONE])) {
        $collection_items = array();
        foreach ($node->field_products_addon[LANGUAGE_NONE] as $index => $value) {
          $collection_items[] = $value['value'];
        }
        
        entity_delete_multiple('field_collection_item', $collection_items);
        $node->field_products_addon[LANGUAGE_NONE] = array();
      }
      
      foreach ($field_value['product_addons'] as $item) {
        if (!$item['nid']) {continue;}
        
        $field_entity = entity_create('field_collection_item', array('field_name' => 'field_products_addon'));
      
        if ($field_entity) {
          $field_entity->setHostEntity('node', $node);
          $field_entity->field_product_addon[LANGUAGE_NONE][0]['target_id'] = $item['nid'];
          $field_entity->field_promotion_rate[LANGUAGE_NONE][0]['value'] = $item['promotion_rate'];
          $field_entity->field_price[LANGUAGE_NONE][0]['value'] = $item['price'];
          $field_entity->save();
        }
      }
    }
    else if ($field_name == 'service_addons') {
      // Remove all existing collection values.
      if (!empty($node->field_services_addon[LANGUAGE_NONE])) {
        $collection_items = array();
        foreach ($node->field_services_addon[LANGUAGE_NONE] as $index => $value) {
          $collection_items[] = $value['value'];
        }
        
        entity_delete_multiple('field_collection_item', $collection_items);
        $node->field_services_addon[LANGUAGE_NONE] = array();
      }

      foreach ($field_value['service_addons'] as $item) {
        if (!$item['nid']) {continue;}
        
        $field_entity = entity_create('field_collection_item', array('field_name' => 'field_services_addon'));
      
        if ($field_entity) {
          $field_entity->setHostEntity('node', $node);
          $field_entity->field_service[LANGUAGE_NONE][0]['target_id'] = $item['nid'];
          $field_entity->field_promotion_rate[LANGUAGE_NONE][0]['value'] = $item['promotion_rate'];
          $field_entity->field_price[LANGUAGE_NONE][0]['value'] = $item['price'];
          $field_entity->save();
        }
      }      
    }
    
    // Some special fields for SERVICE.
    else if ($field_name == 'service_group') {
      $node->field_tags[LANGUAGE_NONE] = array();
      
      for ($i = 0; $i < count($field_value['service_group']); $i++) {
        if (is_numeric($field_value['service_group'][$i]) and $field_value['service_group'][$i] > 0) {
          $node->field_tags[LANGUAGE_NONE][$i]['tid'] = $field_value['service_group'][$i];
        }
        else{
          $term_id = custom_term_create(11, $field_value['service_group'][$i]);
          if ($term_id) {
            $node->field_tags[LANGUAGE_NONE][$i]['tid'] = $term_id;
          }
        }
      }
    }
    else if ($field_name == 'service_categories') {
      $node->field_type_of_service[LANGUAGE_NONE] = array();
      
      for ($i = 0; $i < count($field_value['service_categories']); $i++) {
        if (is_numeric($field_value['service_categories'][$i]) and $field_value['service_categories'][$i] > 0) {
          $node->field_type_of_service[LANGUAGE_NONE][$i]['tid'] = $field_value['service_categories'][$i];
        }
        else{
          $term_id = custom_term_create(2, $field_value['service_categories'][$i]);
          if ($term_id) {
            $node->field_type_of_service[LANGUAGE_NONE][$i]['tid'] = $term_id;
          }
        }
      }
    }
    else if ($field_name == 'service_cities') {
      $node->field_cities[LANGUAGE_NONE] = array();
      
      for ($i = 0; $i < count($field_value['service_cities']); $i++) {
        if (is_numeric($field_value['service_cities'][$i]) and $field_value['service_cities'][$i] > 0) {
          $node->field_cities[LANGUAGE_NONE][$i]['tid'] = $field_value['service_cities'][$i];
        }
        else{
          $term_id = custom_term_create(5, $field_value['service_cities'][$i]);
          if ($term_id) {
            $node->field_cities[LANGUAGE_NONE][$i]['tid'] = $term_id;
          }
        }
      }
    }
    else if ($field_name == 'service_images') {
      // Disable all image list if any.
      if (!empty($node->uc_product_image[LANGUAGE_NONE])) {
        for ($i = 0; $i < count($node->uc_product_image[LANGUAGE_NONE]); $i++) {
          $file = file_load($node->uc_product_image[LANGUAGE_NONE][$i]['fid']);
          $file->status = 0;
          file_save($file);
        }
      }

      // Reset the current images list.
      $node->uc_product_image[LANGUAGE_NONE] = array();

      if (!empty($field_value['service_images'])) {
        // Set the image primary to be the first one.
        if ($field_value['service_images_primary'] > 0) {
          $file = file_load($field_value['service_images_primary']);
          $file->status = 1;
          file_save($file);
          
          $node->uc_product_image[LANGUAGE_NONE][0] = (array) $file;
        }
        
        // Take all other except the primary.
        $index = count($node->uc_product_image[LANGUAGE_NONE]);
        foreach ($field_value['service_images'] as $fid) {
          if ($field_value['service_images_primary'] != $fid) {
            $file = file_load($fid);
            $file->status = 1;
            file_save($file);
            
            $node->uc_product_image[LANGUAGE_NONE][$index] = (array) $file;
            $index++;
          }
        }
      }
    }
    /*
    else if ($field_name == 'service_seller') {
      if ($field_value['service_seller'] == '0') {
        // Create a new service seller.
        $intro_service_seller_nid = custom_node_create($user->uid, $user->name, 'intro_product_seller', $field_value['service_seller_new_title'], 1, $field_value['service_seller_new_intro']);
        if ($intro_service_seller_nid) {
          $node->field_intro_product_seller[LANGUAGE_NONE][0]['target_id'] = $intro_service_seller_nid;
        }
      }
      else{
        if ($field_value['service_seller_new_title'] != '') {
          $intro_product_seller = node_load($field_value['service_seller']);
          $intro_product_seller->title = $field_value['service_seller_new_title'];
          $intro_product_seller->body[LANGUAGE_NONE][0]['value'] = $field_value['service_seller_new_intro'];
          node_save($intro_product_seller);
        }
        $node->field_intro_product_seller[LANGUAGE_NONE][0]['target_id'] = $field_value['service_seller'];
      }
    }
    */
    
    // Some special fields for PRODUCT.
    else if ($field_name == 'product_group') {
      $node->field_tags[LANGUAGE_NONE] = array();
      for ($i = 0; $i < count($field_value['product_group']); $i++) {
        if (is_numeric($field_value['product_group'][$i]) and $field_value['product_group'][$i] > 0) {
          $node->field_tags[LANGUAGE_NONE][$i]['tid'] = $field_value['product_group'][$i];
        }
        else{
          $term_id = custom_term_create(11, $field_value['product_group'][$i]);
          if ($term_id) {
            $node->field_tags[LANGUAGE_NONE][$i]['tid'] = $term_id;
          }
        }
      }
    }
    else if ($field_name == 'product_categories') {
      $node->field_product_category[LANGUAGE_NONE] = array();
      for ($i = 0; $i < count($field_value['product_categories']); $i++) {
        if (is_numeric($field_value['product_categories'][$i]) and $field_value['product_categories'][$i] > 0) {
          $node->field_product_category[LANGUAGE_NONE][$i]['tid'] = $field_value['product_categories'][$i];
        }
        else{
          $term_id = custom_term_create(1, $field_value['product_categories'][$i]);
          if ($term_id) {
            $node->field_product_category[LANGUAGE_NONE][$i]['tid'] = $term_id;
          }
        }
      }
    }
    else if ($field_name == 'product_cities') {
      $node->field_cities[LANGUAGE_NONE] = array();
      for ($i = 0; $i < count($field_value['product_cities']); $i++) {
        if (is_numeric($field_value['product_cities'][$i]) and $field_value['product_cities'][$i] > 0) {
          $node->field_cities[LANGUAGE_NONE][$i]['tid'] = $field_value['product_cities'][$i];
        }
        else{
          $term_id = custom_term_create(5, $field_value['product_cities'][$i]);
          if ($term_id) {
            $node->field_cities[LANGUAGE_NONE][$i]['tid'] = $term_id;
          }
        }
      }
    }
    else if ($field_name == 'product_images') {
      // Disable all image list if any.
      if (!empty($node->uc_product_image[LANGUAGE_NONE])) {
        for ($i = 0; $i < count($node->uc_product_image[LANGUAGE_NONE]); $i++) {
          $file = file_load($node->uc_product_image[LANGUAGE_NONE][$i]['fid']);
          $file->status = 0;
          file_save($file);
        }
      }

      // Reset the current images list.
      $node->uc_product_image[LANGUAGE_NONE] = array();

      if (!empty($field_value['product_images'])) {
        // Set the image primary to be the first one.
        if ($field_value['product_images_primary'] > 0) {
          $file = file_load($field_value['product_images_primary']);
          $file->status = 1;
          file_save($file);
          
          $node->uc_product_image[LANGUAGE_NONE][0] = (array) $file;
        }
        
        // Take all other except the primary.
        $index = count($node->uc_product_image[LANGUAGE_NONE]);
        foreach ($field_value['product_images'] as $fid) {
          if ($field_value['product_images_primary'] != $fid) {
            $file = file_load($fid);
            $file->status = 1;
            file_save($file);
            
            $node->uc_product_image[LANGUAGE_NONE][$index] = (array) $file;
            $index++;
          }
        }
      }
    }
    /*
    else if ($field_name == 'product_seller') {
      if ($field_value['product_seller'] == '0') {
        // Create a new product seller.
        $intro_product_seller_nid = custom_node_create($user->uid, $user->name, 'intro_product_seller', $field_value['product_seller_new_title'], 1, $field_value['product_seller_new_intro']);
        if ($intro_product_seller_nid) {
          $node->field_intro_product_seller[LANGUAGE_NONE][0]['target_id'] = $intro_product_seller_nid;
        }
      }
      else{
        if ($field_value['product_seller_new_title'] != '') {
          $intro_product_seller = node_load($field_value['product_seller']);
          $intro_product_seller->title = $field_value['product_seller_new_title'];
          $intro_product_seller->body[LANGUAGE_NONE][0]['value'] = $field_value['product_seller_new_intro'];
          node_save($intro_product_seller);
        }
        $node->field_intro_product_seller[LANGUAGE_NONE][0]['target_id'] = $field_value['product_seller'];
      }
    }
    */
    // Some special fields for PRODUCT COMBO.
    else if ($field_name == 'product_combo_list') {
      // Reset the current field.
      $node->field_product[LANGUAGE_NONE] = array();
      foreach ($field_value['product_combo_list'] as $index => $nid) {
        $node->field_product[LANGUAGE_NONE][$index]['target_id'] = $nid;
      }
    }
    // Other common content type fields.
    else if (isset($node->{$field_name})) {
      if (is_array($field_value)) {
        $node->{$field_name}[LANGUAGE_NONE][0] = $field_value; // $field_value['value/tid']
      }
      else if ($field_name == 'field_photo') {
        $file = file_load($field_value);
        if ($file) {
          $file->status = 1;
          file_save($file);

          // Remove current file if exist.
          if (!empty($node->field_photo[LANGUAGE_NONE])) {
            drupal_unlink($node->field_photo[LANGUAGE_NONE][0]['uri']);
          }

          $node->field_photo[LANGUAGE_NONE][0] = (array) $file;
        }
      }
      else{
        $node->{$field_name} = $field_value;
      }
    }
  }

  node_save($node);
  
  if ($node->nid) {
    return array('error' => false, 'message' => 'Dữ liệu đã được lưu thành công.', 'node' => $node);
  }
  else{
    return array('error' => true, 'message' => 'Có lỗi trong quá trình xử lý. Vui lòng liên hệ để được giúp đỡ.');
  }
}
