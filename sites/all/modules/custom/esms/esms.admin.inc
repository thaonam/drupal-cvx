<?php 
/**
 * @file
 * Admin page callback file for the eSMS module.
 */

/**
 * Test function.
 */
function esms_test() {
  drupal_set_title(t('eSMS.vn Gateway testing'));
  
  return drupal_get_form('esms_test_form');
}

/**
 * Test form.
 */
function esms_test_form() {
  // Make sure API and Secret key is set.
  $esms_api_key = variable_get('esms_api_key', '');
  $esms_secret_key = variable_get('esms_secret_key', '');
  $esms_account = array();
  
  if ($esms_api_key == '' or $esms_secret_key == '') {
    drupal_set_message(t('You have not done setting up your eSMS.vn Gateway keys. Please complete it ') . '<a href="/admin/config/services/esms">' . t('here') . '</a>', 'error', false);
  }
  else{
    $esms_account = esms_get_balance();
  }
  
  $form = array();
  
  if (!empty($esms_account) and $esms_account['CodeResponse'] == 100) {
    $form['esms_account'] = array(
      '#markup' => '<p>User ID: ' . $esms_account['UserID'] . '</p><p>Balance: ' . $esms_account['Balance'] . '</p>',
    );
  }
  
  $form['mobile_number'] = array(
    '#type' => 'textfield',
    '#title' => t('Mobile number'),
    '#description' => t('Enter a mobile number to receive SMS.'),
    '#required' => true,
  );

  $form['message'] = array(
    '#type' => 'textarea',
    '#title' => t('Message'),
    '#description' => t('Message to be sent to the mobile device via SMS.'),
    '#required' => true,
  );
  
  $form['sms_type'] = array(
    '#type' => 'select',
    '#title' => t('SMS type'),
    '#options' => _esms_sms_type(),
    '#default_value' => '2',
    '#required' => true,
  );
  
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Submit'),
  );
  
  return $form;
}

/**
 * Test form validate.
 */
function esms_test_form_validate($form, &$form_state) {
  // Remove all space.
  $form_state['values']['mobile_number'] = preg_replace('/\s+/', '', $form_state['values']['mobile_number']);
  
  // Must be all number.
  if (!ctype_digit($form_state['values']['mobile_number'])) {
    form_set_error('mobile_number', t('Mobile number must be all numeric character.'));
  }
}

/**
 * Test form submit.
 */
function esms_test_form_submit($form, &$form_state) {
  $result = esms_send_message($form_state['values']['message'], $form_state['values']['mobile_number'], $form_state['values']['sms_type']);
  if ($result['CodeResult'] == 100) {
    drupal_set_message('eSMS message sent successfully to Mobile No. ' . $form_state['values']['mobile_number'] . ' - SMSID: ' . $result['SMSID']);
  }
  else{
    drupal_set_message($result['ErrorMessage'], 'error');    
  }
}

/**
 * Form for settings keys.
 */
function esms_settings_form($form, &$form_state) {
  $form = array();

  $form['esms_api_key'] = array(
    '#title' => t('API key'),
    '#type' => 'textfield',
    '#default_value' => variable_get('esms_api_key', ''),
    '#description' => t('Enter API key provided by eSMS.vn.'),
    '#required' => true,
  );

  $form['esms_secret_key'] = array(
    '#title' => t('Secret key'),
    '#type' => 'textfield',
    '#default_value' => variable_get('esms_secret_key', ''),
    '#description' => t('Enter Secret key provided by eSMS.vn.'),
    '#required' => true,
  );

  $form['esms_brandname'] = array(
    '#title' => t('Brand name'),
    '#type' => 'textfield',
    '#default_value' => variable_get('esms_brandname', ''),
    '#description' => t('Enter a Brandname if available.'),
    '#required' => false,
  );

  $form['test'] = array(
    '#markup' => '<p>' . t('Once done, <a href="/admin/esms_test">click here</a> to start testing the SMS.') . '</p>',
  );

  return system_settings_form($form);
}

/**
 * Messages token form.
 */
function esms_messages_token_form($form, &$form_state) {
  $form = array();

  $form['esms_user_register'] = array(
    '#title' => t('User register message'),
    '#type' => 'textarea',
    '#default_value' => variable_get('esms_user_register', 'Ma kich hoat cua ban tai %SITE_NAME% la: %CODE%'),
    '#description' => t('Enter your message template to be sent to user when verifying phone number in Registration form.'),
    '#required' => true,
  );

  $form['esms_user_password'] = array(
    '#title' => t('User password message'),
    '#type' => 'textarea',
    '#default_value' => variable_get('esms_user_password', 'Ma xac nhan thay doi mat khau cua ban tai %SITE_NAME% la: %CODE%'),
    '#description' => t('Enter your message template to be sent to user when verifying phone number in Forgot password form.'),
    '#required' => true,
  );
  
  return system_settings_form($form);
}
