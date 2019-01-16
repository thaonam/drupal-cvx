<?php 
/**
 * @file
 * Admin page callback file for the eSMS module.
 */

/**
 * Test function.
 */
function mobilevn_test() {
  drupal_set_title(t('Mobilevn testing'));
  
  return '';
}

/**
 * Data export.
 */
function mobilevn_export() {
  // Export data to json file.
  $mobilevn = variable_get('mobilevn', array());
  $fp = fopen('mobilevn.json', 'w');
  fwrite($fp, json_encode($mobilevn));
  fclose($fp);
}

/**
 * Data import.
 */
function mobilevn_import() {
  // Remove old data.
  variable_del('mobilevn');

  $data = json_decode('[{"name":"mobifone","prefix":"090","length":"10"},{"name":"mobifone","prefix":"093","length":"10"},{"name":"mobifone","prefix":"089","length":"10"},{"name":"mobifone","prefix":"0120","length":"11"},{"name":"mobifone","prefix":"0121","length":"11"},{"name":"mobifone","prefix":"0122","length":"11"},{"name":"mobifone","prefix":"0126","length":"11"},{"name":"mobifone","prefix":"0128","length":"11"},{"name":"vinaphone","prefix":"091","length":"10"},{"name":"vinaphone","prefix":"094","length":"10"},{"name":"vinaphone","prefix":"088","length":"10"},{"name":"vinaphone","prefix":"0123","length":"11"},{"name":"vinaphone","prefix":"0124","length":"11"},{"name":"vinaphone","prefix":"0125","length":"11"},{"name":"vinaphone","prefix":"0127","length":"11"},{"name":"vinaphone","prefix":"0129","length":"11"},{"name":"viettel","prefix":"096","length":"10"},{"name":"viettel","prefix":"097","length":"10"},{"name":"viettel","prefix":"098","length":"10"},{"name":"viettel","prefix":"086","length":"10"},{"name":"viettel","prefix":"0162","length":"11"},{"name":"viettel","prefix":"0163","length":"11"},{"name":"viettel","prefix":"0164","length":"11"},{"name":"viettel","prefix":"0165","length":"11"},{"name":"viettel","prefix":"0166","length":"11"},{"name":"viettel","prefix":"0167","length":"11"},{"name":"viettel","prefix":"0168","length":"11"},{"name":"viettel","prefix":"0169","length":"11"},{"name":"vietnamobile","prefix":"092","length":"10"},{"name":"vietnamobile","prefix":"0188","length":"11"},{"name":"vietnamobile","prefix":"0186","length":"11"},{"name":"gmobile","prefix":"099","length":"10"},{"name":"gmobile","prefix":"0199","length":"11"},{"name":"vsat","prefix":"0996","length":"10"}]');
  
  $mobilevn = array();
  foreach ($data as $row) {
    $mobilevn[] = array(
      'name' => $row->name,
      'prefix' => $row->prefix,
      'length' => $row->length,
    );
  }
  
  variable_set('mobilevn', $mobilevn);
}

/**
 * Form for settings keys.
 */
function mobilevn_settings_form($form, &$form_state) {
  $mobilevn = variable_get('mobilevn', array());
  
  $form = array();

  $options = _mobilevn_operators_list();
  $options = array('0' => t('Please select')) + $options;
  
  $count = 0;
  
  // Add a fieldset to cut short.
  $form['group'] = array(
    '#title' => t('Stored definations'),
    '#type' => 'fieldset',
    '#collapsible' => true,
    '#collapsed' => true
  );
  
  foreach ($mobilevn as $value) {
    $form['group']['mobilevn_operator_name_' . $count] = array(
      '#title' => t('Operator name'),
      '#type' => 'select',
      '#default_value' => $value['name'],
      '#options' => $options,
    );

    $form['group']['mobilevn_operator_prefix_' . $count] = array(
      '#title' => t('Operator number prefix'),
      '#type' => 'textfield',
      '#default_value' => $value['prefix'],
      '#description' => t('For example: 098, 099, 012.'),
    );

    $form['group']['mobilevn_operator_length_' . $count] = array(
      '#title' => t('Operator number length'),
      '#type' => 'textfield',
      '#default_value' => $value['length'],
      '#description' => t('For example: 10, 11.'),
    );
    
    $count++;
  }
  
  $form['mobilevn_new'] = array(
    '#markup' => '<h2>' . t('New defination') . '</h2>',
  );

  $form['mobilevn_operator_name_' . $count] = array(
    '#title' => t('Operator name'),
    '#type' => 'select',
    '#default_value' => '0',
    '#options' => $options,
  );

  $form['mobilevn_operator_prefix_' . $count] = array(
    '#title' => t('Operator number prefix'),
    '#type' => 'textfield',
    '#description' => t('For example: 098, 099, 012.'),
  );

  $form['mobilevn_operator_length_' . $count] = array(
    '#title' => t('Operator number length'),
    '#type' => 'textfield',
    '#description' => t('For example: 10, 11.'),
  );

  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Save changes'),
  );
  
  return $form;
}

/**
 * Settings form validate.
 */
function mobilevn_settings_form_validate($form, &$form_state) {
  for ($i = 0; $i <= 100; $i++) {
    if (!isset($form_state['values']['mobilevn_operator_name_' . $i]) or $form_state['values']['mobilevn_operator_name_' . $i] == '0') {
      break;
    }
    
    // Validate.
    if ($form_state['values']['mobilevn_operator_prefix_' . $i] == '') {
      form_set_error($form_state['values']['mobilevn_operator_prefix_' . $i], t('Please enter operator number prefix.'));
    }

    if ($form_state['values']['mobilevn_operator_length_' . $i] == '') {
      form_set_error($form_state['values']['mobilevn_operator_length_' . $i], t('Please enter operator number length.'));      
    }
  }
}

/**
 * Settings form submit.
 */
function mobilevn_settings_form_submit($form, &$form_state) {
  // Collect and store.
  $mobilevn = array();
  
  for ($i = 0; $i <= 100; $i++) {
    if (!isset($form_state['values']['mobilevn_operator_name_' . $i]) or $form_state['values']['mobilevn_operator_name_' . $i] == '0') {
      break;
    }
    
    $mobilevn[] = array(
      'name' => $form_state['values']['mobilevn_operator_name_' . $i],
      'prefix' => $form_state['values']['mobilevn_operator_prefix_' . $i],
      'length' => $form_state['values']['mobilevn_operator_length_' . $i]
    );
  }
  
  variable_set('mobilevn', $mobilevn);
  drupal_set_message(t('Mobilevn changes have been stored successfully.'));
}
