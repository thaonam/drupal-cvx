<?php 
/**
 * @file
 * Admin page callback file for the subdomain module.
 */

/**
 * Form for settings keys.
 */
function subdomain_settings_form($form, &$form_state, $id = null, $op = null) {
  $id = empty($form_state['build_info']['args']) ? 0 : $form_state['build_info']['args'][0];
  $op = empty($form_state['build_info']['args']) ? '' : $form_state['build_info']['args'][1];
  
  // Delete an id.
  if ($op == 'delete') {
    $form['notice'] = array(
      '#markup' => '<p>' . t('Are you sure you want to DELETE it? This action CANNOT be UNDONE.') .'</p>',
    );
    
    $form['submit'] = array(
      '#type' => 'submit',
      '#value' => t('Delete'),
    );
    
    return $form;
  }
  else if ($op == 'edit') {
    // Load the record by id.
    $subdomain = _subdomain_load_record_by_id($id);
    if (is_object($subdomain)) {
      $subdomain->username = db_query("SELECT name FROM {users} WHERE uid=:uid", array(':uid' => $subdomain->uid))->fetchColumn();
    }
  }
  
  // Build a table for existing data.
  $header = array(t('User id / Username'), t('Sub-domain'), t('Operations'));
  $rows = array();
  
  $result = db_query("SELECT id, uid, subdomain FROM {subdomain}");
  foreach ($result as $row) {
    $ops = '';
    $ops .= l(t('View'), 'http://' . $row->subdomain . '.' . $_SERVER['SERVER_NAME'], array('attributes' => array('target' => '_blank'))) . ' | ';
    $ops .= l(t('Edit'), 'admin/config/services/subdomain/' . $row->id . '/edit') . ' | ' . l(t('Delete'), 'admin/config/services/subdomain/' . $row->id . '/delete');
    $username = db_query("SELECT name FROM {users} WHERE uid=:uid", array(':uid' => $row->uid))->fetchColumn();
    $rows[] = array($row->uid . ' / ' . $username, '<strong>' . $row->subdomain . '</strong>.' . $_SERVER['SERVER_NAME'], $ops);
  }
  
  if (empty($rows)) {
    $rows[] = array(t('You have no sub-domains currently.'), '', '');
  }
  
  // Form fields.
  $form['domain'] = array(
    '#type' => 'textfield',
    '#title' => t('Level-1 domain'),
    '#default_value' => variable_get('subdomain_domain', $_SERVER['SERVER_NAME']),
    '#description' => t('Your main domain, example: test.com'),
    '#required' => true,
  );

  $form['redirect_url_token'] = array(
    '#type' => 'textfield',
    '#title' => t('Redirect URL token'),
    '#default_value' => variable_get('subdomain_redirect_url_token', 'http://[subdomain].' . $_SERVER['SERVER_NAME'] . '/user/[uid]'),
    '#description' => t('Landing page for sub-domain.'),
    '#required' => true,
  );
  
  $form['subdomains'] = array(
    '#markup' => theme('table', array('header' => $header, 'rows' => $rows)),
  );

  $form['username'] = array(
    '#title' => t('Username'),
    '#type' => 'textfield',
    '#default_value' => isset($subdomain) ? $subdomain->username : '',
    '#description' => t('For example: "webmaster"'),
    '#disabled' => $op == 'edit' ? true : false,
  );

  $form['subdomain'] = array(
    '#title' => t('Sub-domain name'),
    '#type' => 'textfield',
    '#default_value' => isset($subdomain) ? $subdomain->subdomain : '',
    '#description' => t('For example: "test" will become "http://test.@domain/"', array('@domain' => $_SERVER['SERVER_NAME'])),
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
function subdomain_settings_form_validate($form, &$form_state) {
  $id = empty($form_state['build_info']['args']) ? 0 : $form_state['build_info']['args'][0];
  $op = empty($form_state['build_info']['args']) ? '' : $form_state['build_info']['args'][1];
  
  // No validation for op delete.
  if ($op == 'delete') {
    return;
  }

  // Make sure username does exist.
  if ($form_state['values']['username'] != '') {
    $username = strtolower($form_state['values']['username']);
    $uid = (int) db_query("SELECT uid FROM {users} WHERE name=:name", array(':name' => $username))->fetchColumn();
    if (!$uid) {
      form_set_error('username', t('The username does NOT exist.'));
      return;
    }
    else{
      $form_state['values']['uid'] = $uid;
    }
  }
  
  // Make sure new subdomain does not exist.
  if ($form_state['values']['subdomain'] != '') {
    $subdomain = _subdomain_load_record_by_subdomain($form_state['values']['subdomain']);

    if ($subdomain and $subdomain->uid != $uid) {
      form_set_error('subdomain', t('The sub-domain does exist. Please choose another.'));
    }
    else{
      $form_state['values']['subdomain'] = $subdomain;
    }
  }
}

/**
 * Settings form submit.
 */
function subdomain_settings_form_submit($form, &$form_state) {
  // Always save the token.
  variable_set('subdomain_redirect_url_token', $form_state['values']['redirect_url_token']);
  variable_set('subdomain_domain', $form_state['values']['domain']);
  
  if ($form_state['values']['username'] != '' and $form_state['values']['subdomain'] != '') {
    $id = empty($form_state['build_info']['args']) ? 0 : $form_state['build_info']['args'][0];
    $op = empty($form_state['build_info']['args']) ? '' : $form_state['build_info']['args'][1];
  
    if ($op == 'delete') {
      db_query("DELETE FROM {subdomain} WHERE id=:id", array(':id' => $id));
    
      drupal_set_message(t('Sub-domain has been DELETED successfully.'));
      drupal_goto('admin/config/services/subdomain');
    }
    else if ($op == 'edit') {
      // Save changes.
      _subdomain_subdomain_save($form_state['values']['uid'], $form_state['values']['subdomain']);
    
      drupal_set_message(t('Sub-domain has been UPDATED successfully.'));
      drupal_goto('admin/config/services/subdomain');
    }
    else{
      // Create new name.
      _subdomain_subdomain_save($form_state['values']['uid'], $form_state['values']['subdomain']);
    
      drupal_set_message(t('Sub-domain has been STORED successfully.'));
    }
  }
}
