<?php /* Google admin module created by giaidieu.com */

/**
 * Google settings form.
 */
function google_settings_form($form, $form_state) {
  $form['google_notify'] = array(
    '#markup' => '<p class="google-desc">' . t('Please register for a Google API account in order to fill in to the settings form below.') . '<br /><a href="https://console.developers.google.com/project/_/apiui/apis/library/" target="_blank">https://console.developers.google.com/project/_/apiui/apis/library/</a></p>',
  );
  
  $form['google_app_id'] = array(
    '#type' => 'textfield',
    '#title' => t('Google client id'),
    '#default_value' => variable_get('google_app_id', ''),
    '#required' => true,
  );

  $form['google_app_secret'] = array(
    '#type' => 'textfield',
    '#title' => t('Google secret key'),
    '#default_value' => variable_get('google_app_secret', ''),
    '#required' => true,
  );

  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Save settings'),
  );
  
  return $form;
}

/**
 * Google settings submit.
 */
function google_settings_form_submit($form, &$form_state) {
  $google_app_id = $form_state['values']['google_app_id'];
  $google_app_secret = $form_state['values']['google_app_secret'];
  
  // Store values.
  variable_set('google_app_id', $google_app_id);
  variable_set('google_app_secret', $google_app_secret);
  
  drupal_set_message(t('Your Google API settings have been saved!'));
}
