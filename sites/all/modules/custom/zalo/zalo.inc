<?php /* Zalo functionality created by giaidieu.com. */

/**
 * Zalo test.
 */
function zalo_test() {
  // Load library.
  print $_SERVER['HTTP_USER_AGENT'] . '<br />';
  print $_SERVER['HTTP_X_REQUESTED_WITH'];
  
  //return $output;
  exit;
}

/**
 * Zalo process to login.
 */
function zalo_login_process($access_token = '') {
  if (!_zalo_settings_is_done()) {return '';}

  if ($access_token == '') {
    // Go to login and create access token.
    $params = array(
      'app_id' => variable_get('zalo_app_id', ''),
      'redirect_uri' => variable_get('zalo_callback_url', ''),
    );
  
    $url = url('https://oauth.zaloapp.com/v3/auth', array('query' => $params));
    drupal_goto($url, array('external' => true));
  }
  else{
    $result = _zalo_http_request('https://graph.zalo.me/v2.0/me', array('access_token' => $access_token), 'GET');
    if ($result) {
      // Successfully got a name and user id.
      $record = _zalo_load_record($result->id);
      global $user;
      
      if (!$record) {
        // Create new user here.
        module_load_include('inc', 'custom', 'custom.core');

        $name = preg_replace('/\s+/', '', strtolower($result->name)) . '_' . $result->id;
        $pass = custom_user_password(6);
        $email = $name . '@zaloapp.com';
        $status = 1;
        //$account = custom_user_create($name, $pass, $email, $status);
        $account_field = array(
          'email' => transliteration_get($email, '_'),
          'name' => transliteration_get($name, '_'),
          'pass' => $pass,
          'status' => $status,
          'field_account_type' => array('value' => 0)
        );
        $account = custom_user_create_by_data($account_field);

        if (!empty($account['uid'])) {
          // Store into Zalo login table.
          $record = array(
            'id' => $result->id,
            'uid' => $account['uid'],
            'created' => time(),
          );
          drupal_write_record('zalo_login', $record);

          // Login.
          $user = user_load($account['uid']);
          if ($user) {
            drupal_session_regenerate();
          }
        }
      }
      else if ($record and $record->uid) {
        // Process to login.
        $user = user_load($record->uid);
        if ($user) {
          drupal_session_regenerate();
        }
      }

      // For App login, process specifically.
      if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) and $_SERVER['HTTP_X_REQUESTED_WITH'] == 'com.cauvongxanh') {
        drupal_goto('zalo/mobile-login-popup-close/' . $user->uid);
        exit;
      }
    }
    else{
      if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) and $_SERVER['HTTP_X_REQUESTED_WITH'] == 'com.cauvongxanh') {
        print t('Error occured during the processs.');
        exit;
      }
      
      drupal_set_message(t('Error occured during the processs.'), 'error');
    }
    
    // Close the parent window.
    echo '<script>window.opener.location.reload(); self.window.close();</script>';
    exit;
  }
}

/**
 * Process to login from App.
 */
function zalo_login_from_app_close($uid) {
  // Nothing to do, return a blank page for closing.
}

/**
 * Get access token return from Zalo web service.
 */
function zalo_access_token() {
  if (!_zalo_settings_is_done()) {return '';}
  
  // Prepare to get access token.
  //$uid = isset($_GET['uid']) ? $_GET['uid'] : '';
  $code = isset($_GET['code']) ? $_GET['code'] : '';

  if ($code != '') {
    $zalo_app_id = variable_get('zalo_app_id', '');
    $zalo_app_secret = variable_get('zalo_app_secret', '');
    $zalo_callback_url = variable_get('zalo_callback_url', '');
  
    $params = array(
      'app_id' => $zalo_app_id,
      'app_secret' => $zalo_app_secret,
      'code' => $code,
    );
  
    // Get access token.
    $result = _zalo_http_request('https://oauth.zaloapp.com/v3/access_token', $params, 'GET');
    if ($result) {
      zalo_login_process($result->access_token);
    }
    else{
      drupal_set_message(t('Error occured during the process.'), 'error');
      return '';
    }
  }
}

/**
 * Get a record by zalo id.
 */
function _zalo_load_record($id) {
  $result = db_query("SELECT * FROM {zalo_login} WHERE id=:id", array(':id' => $id));
  $record = $result->fetchAll();
  if (!empty($record)) {
    return $record[0];
  }
  else{
    return false;
  }
}

/**
 * Delete a record by zalo id.
 */
function _zalo_delete_record($uid) {
  $result = db_query("DELETE FROM {zalo_login} WHERE uid=:uid", array(':uid' => $uid));
  return $result;
}
