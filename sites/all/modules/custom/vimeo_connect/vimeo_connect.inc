<?php /* Vimeo connect. */

/**
 * Vimeo test.
 */
function vimeo_connect_test() {
  $test = vimeo_connect_video_get(229878001);
  dsm($test);
  
  return 'Test';
}

/**
 * Check if a video is ready for watching.
 */
function vimeo_connect_video_is_ready() {
  // Get the video id.
  $video_id = isset($_POST['video_id']) ? (int) $_POST['video_id'] : 0;
  if (!$video_id) {die('Data is invalid.');}
  
  $video = vimeo_connect_video_get($video_id);
  if ($video and $video['duration'] > 0 and $video['status'] == 'available') {
    drupal_json_output(true);
    exit;
  }
  
  drupal_json_output(false);
  exit;
}


/**
 * Vimeo get a tickket before video uploading.
 */
function vimeo_connect_user_upload_ticket_get($redirect_url = '') {
  $response = vimeo_connect_request('/me/videos', array('type' => 'POST', 'redirect_url' => $redirect_url), 'POST');
  if (!empty($response)) {
    return $response;
  }
  else{
    return false;
  }
}

/**
 * Vimeo get user upload quota.
 */
function vimeo_connect_user_upload_quota() {
  $response = vimeo_connect_request('/me', array(), 'GET');
  if (!empty($response)) {
    return $response['upload_quota'];
  }
  else{
    return false;
  }
}

/**
 * Vimeo get a video.
 */
function vimeo_connect_video_get($video_id) {
  return vimeo_connect_request('/videos/' . $video_id, array(), 'GET');
}

/**
 * Vimeo delete a video.
 */
function vimeo_connect_video_delete($video_id) {
  return vimeo_connect_request('/videos/' . $video_id, array(), 'DELETE');
}

/**
 * Build Vimeo settings form.
 */
function vimeo_connect_settings_form($form, $form_state) {
  $form['vimeo_connect_client_id'] = array(
    '#type' => 'textfield',
    '#title' => t('Client identifier'),
    '#default_value' => variable_get('vimeo_connect_client_id', ''),
    '#required' => true,
  );

  $form['vimeo_connect_client_secret'] = array(
    '#type' => 'textfield',
    '#title' => t('Client secrets'),
    '#default_value' => variable_get('vimeo_connect_client_secret', ''),
    '#required' => true,
  );
  
  // Get stored scopes.
  $scopes_stored = variable_get('vimeo_connect_scopes', array('public' => 'public', 'private' => 'private', 'create' => 0, 'edit' => 0, 'delete' => 0, 'update' => 0));
  $scopes = array();
  foreach ($scopes_stored as $key => $value) {
    if ($value) {
      $scopes[] = $key;
    }
  }
  
  $form['vimeo_connect_scopes'] = array(
    '#type' => 'checkboxes',
    '#title' => t('Scopes'),
    '#options' => array('public' => t('Public'), 'private' => t('Private'), 'create' => t('Create'), 'edit' => t('Edit'), 'delete' => t('Delete'), 'upload' => t('Upload')),
    '#default_value' => $scopes,
    '#attached' => array(
      'css' => array(
        drupal_get_path('module', 'vimeo_connect') . '/vimeo_connect.css',
      ),
      'js' => array(
        'vimeo-connect' => drupal_get_path('module', 'vimeo_connect') . '/vimeo_connect.js',
      ),
    ),
    '#description' => t('IMPORTANT: You will need to get approval by Vimeo for scopes other than Public and Private. For more info:') . ' https://developer.vimeo.com/api/upload/videos',
  );

  // Setup default URL.
  $callback_url = 'http://' . $_SERVER['HTTP_HOST'] . '/vimeo_connect/access_token';
  if (variable_get('vimeo_connect_callback_url', '') == '') {
    variable_set('vimeo_connect_callback_url', $callback_url);
  }
  
  $form['vimeo_connect_callback_url'] = array(
    '#markup' => '<p id="vimeo_connect_callback_url"><b>' . t('Your callback URL (Please set this URL into your Vimeo App):') . '</b><br />' . $callback_url . '</p>',
  );
 
  $access_token = variable_get('vimeo_connect_access_token', '');
  if ($access_token != '') {
    $form['vimeo_connect_access_token'] = array(
      '#markup' => '<p id="vimeo_connect_token">Current access token: <i>' . $access_token . '</i></p>',
    );
  }
  
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Save and generate new access token'),
  );

  return $form;
}

/**
 * Vimeo settings submit.
 */
function vimeo_connect_settings_form_submit($form, &$form_state) {
  $vimeo_connect_scopes = $form_state['values']['vimeo_connect_scopes'];
  $vimeo_connect_client_id = $form_state['values']['vimeo_connect_client_id'];
  $vimeo_connect_client_secret = $form_state['values']['vimeo_connect_client_secret'];
  
  // Store values.
  variable_set('vimeo_connect_client_id', $vimeo_connect_client_id);
  variable_set('vimeo_connect_client_secret', $vimeo_connect_client_secret);
  
  // Scopes always at least are public and private.
  $vimeo_connect_scopes['public'] = 'public';
  $vimeo_connect_scopes['private'] = 'private';
  variable_set('vimeo_connect_scopes', $vimeo_connect_scopes);

  $scopes = array();
  foreach ($vimeo_connect_scopes as $key => $value) {
    if ($value) {
      $scopes[] = $key;
    }
  }
  
  drupal_set_message(t('Your settings have been saved!'));
  
  // Go to create access token now.
  require("./sites/all/libraries/vimeo/autoload.php");
  $vimeo_connect_callback_url = variable_get('vimeo_connect_callback_url', '');
  $state = 'vimeo_connect_' . time();
  $_SESSION['vimeo_connect']['state'] = $state;
  
  $lib = new \Vimeo\Vimeo($vimeo_connect_client_id, $vimeo_connect_client_secret);
  $url = $lib->buildAuthorizationEndpoint($vimeo_connect_callback_url, $scopes, $state);

  drupal_goto($url, array('external' => true));
}

/**
 * Get access token.
 */
function vimeo_connect_access_token() {
  if (!isset($_SESSION['vimeo_connect']) or !isset($_SESSION['vimeo_connect']['state']) or !isset($_GET['state']) or !isset($_GET['code'])) {
    die('Params in valid.');
  }

  // Validate $state.
  if ($_GET['state'] != $_SESSION['vimeo_connect']['state']) {
    drupal_set_message(t('State string is not valid.'), 'error');
    return '';
  }
  else{
    unset($_SESSION['vimeo_connect']['state']);
  }
  
  // Prepare to get access token.
  $code = $_GET['code'];
  $vimeo_connect_client_id = variable_get('vimeo_connect_client_id', '');
  $vimeo_connect_client_secret = variable_get('vimeo_connect_client_secret', '');
  $vimeo_connect_callback_url = variable_get('vimeo_connect_callback_url', '');
  
  // Init the lib.
  require("./sites/all/libraries/vimeo/autoload.php");
  $lib = new \Vimeo\Vimeo($vimeo_connect_client_id, $vimeo_connect_client_secret);

  // Generate access token now.  
  $token = $lib->accessToken($code, $vimeo_connect_callback_url);
  if ($token) {
    variable_set('vimeo_connect_access_token', $token['body']['access_token']);
    drupal_set_message(t('Token has been created and saved successfully.'));
  }
  
  // Go back to settings page.
  drupal_goto('admin/config/vimeo_connect');
}

/**
 * Make Vimeo API request.
 */
function vimeo_connect_request($request, $params, $method) {
  // Get params.
  $vimeo_connect_client_id = variable_get('vimeo_connect_client_id', '');
  $vimeo_connect_client_secret = variable_get('vimeo_connect_client_secret', '');
  $vimeo_connect_access_token = variable_get('vimeo_connect_access_token', '');
  
  // Validate.
  if (!$vimeo_connect_client_id or !$vimeo_connect_client_secret or !$vimeo_connect_access_token) {
    drupal_set_message(t('You have not completed your Vimeo settings. Please go to @link to do it now.', array('@link' => 'admin/config/vimeo_connect')), 'error');
    return;
  }

  // Init the lib and set the token.
  require("./sites/all/libraries/vimeo/autoload.php");
  $lib = new \Vimeo\Vimeo($vimeo_connect_client_id, $vimeo_connect_client_secret);
  $lib->setToken($vimeo_connect_access_token);
  
  $response = $lib->request($request, $params, $method);
  //dsm($response);
  
  if ($response['status'] != 200 and $response['status'] != 201 and ($method == 'DELETE' and $response['status'] != 204)) {
    drupal_set_message(t('There was error during processing Vimeo API request.'), 'error');
    return null;
  }
  
  return $response['body'];
}