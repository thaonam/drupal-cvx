<?php /* Facebook admin module created by giaidieu.com */

/**
 * Facebook settings form.
 */
function facebook_settings_form($form, $form_state) {
  $form['facebook_notify'] = array(
    '#markup' => '<p class="facebook-desc">' . t('Please register for a Facebook developer account in order to fill in to the settings form below.') . '<br /><a href="https://developers.facebook.com/" target="_blank">https://developers.facebook.com/</a></p>',
  );
  
  $form['facebook_app_id'] = array(
    '#type' => 'textfield',
    '#title' => t('Facebook app id'),
    '#default_value' => variable_get('facebook_app_id', ''),
    '#required' => true,
  );

  $form['facebook_app_secret'] = array(
    '#type' => 'textfield',
    '#title' => t('Facebook app secret key'),
    '#default_value' => variable_get('facebook_app_secret', ''),
    '#required' => true,
  );

  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Save settings'),
  );
  
  return $form;
}

/**
 * Facebook settings submit.
 */
function facebook_settings_form_submit($form, &$form_state) {
  $facebook_app_id = $form_state['values']['facebook_app_id'];
  $facebook_app_secret = $form_state['values']['facebook_app_secret'];
  
  // Store values.
  variable_set('facebook_app_id', $facebook_app_id);
  variable_set('facebook_app_secret', $facebook_app_secret);
  
  drupal_set_message(t('Your Facebook App settings have been saved!'));
}
