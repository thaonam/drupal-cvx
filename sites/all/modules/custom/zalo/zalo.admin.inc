<?php /* Zalo admin module created by giaidieu.com */

/**
 * Zalo settings form.
 */
function zalo_settings_form($form, $form_state) {
  $form['zalo_notify'] = array(
    '#markup' => '<p class="zalo-desc">' . t('Zalo is a leading chat service in Vietnam. Please register for a developer account in order to fill in to the settings form below.') . '<br /><a href="https://developers.zalo.me/" target="_blank">https://developers.zalo.me/</a></p>',
  );
  
  $form['zalo_app_id'] = array(
    '#type' => 'textfield',
    '#title' => t('Zalo app id'),
    '#default_value' => variable_get('zalo_app_id', ''),
    '#required' => true,
    '#description' => t('Create an App in your Developer Zalo account to get this info: https://developers.zalo.me/apps/'),
  );

  $form['zalo_app_secret'] = array(
    '#type' => 'textfield',
    '#title' => t('App secret'),
    '#default_value' => variable_get('zalo_app_secret', ''),
    '#required' => true,
    '#description' => t('Enter the App from your Developer Zalo account to get this info: https://developers.zalo.me/app/[app id]/settings/'),
  );

  // Setup default URL.
  $callback_url = 'https://' . $_SERVER['HTTP_HOST'] . '/zalo/access_token';
  if (variable_get('zalo_callback_url', '') == '') {
    variable_set('zalo_callback_url', $callback_url);
  }
  $form['zalo_callback_url'] = array(
    '#markup' => '<p id="zalo_callback_url"><b>' . t('Your callback URL (Please set this URL into your Zalo App):') . '</b><br />' . $callback_url . '</p>',
  );

  /*
  $access_token = variable_get('zalo_access_token', '');
  if (is_array($access_token)) {
    $form['zalo_access_token'] = array(
      '#markup' => '<p id="zalo_access_token">' . t('Current access token:') . ' <i>' . $access_token['access_token'] . '</i></p>',
    );
  }
  */

  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Save settings'),
  );
  
  return $form;
}

/**
 * Zalo settings submit.
 */
function zalo_settings_form_submit($form, &$form_state) {
  $zalo_app_id = $form_state['values']['zalo_app_id'];
  $zalo_app_secret = $form_state['values']['zalo_app_secret'];
  
  // Store values.
  variable_set('zalo_app_id', $zalo_app_id);
  variable_set('zalo_app_secret', $zalo_app_secret);
  
  drupal_set_message(t('Your Zalo settings have been saved!'));
}
