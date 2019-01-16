<?php /* Admin settings module support */

/**
 * Admin permission view list.
 */
function custom_admin_permission_view_list_page() {
  return views_embed_view('drupalapp_user_functions', 'block_2');
}

/**
 * Provide settings form for video.
 */
function custom_project_video_settings_form($form, &$form_state) {
  $form['markup'] = array(
    '#markup' => '<h2>Cài đặt thời gian cho phép người xem video miễn phí</h2>'
  );
  
  $form['tasscare_video_free_in_second'] = array(
    '#title' => 'Số giây xem miễn phí',
    '#type' => 'textfield',
    '#required' => true,
    '#default_value' => variable_get('tasscare_video_free_in_second', 10),
  );
  
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Save changes'),
  );
  
  return $form;
}

/**
 * Form video settings validate.
 */
function custom_project_video_settings_form_validate($form, &$form_state) {
  if (!is_numeric($form_state['values']['tasscare_video_free_in_second'])) {
    form_set_error('tasscare_video_free_in_second', 'Số giây phải là chữ số.');
  }
}

/**
 * Form video settings submit.
 */
function custom_project_video_settings_form_submit($form, &$form_state) {
  variable_set('tasscare_video_free_in_second', $form_state['values']['tasscare_video_free_in_second']);
  drupal_set_message('Thiết lập của bạn đã được lưu lại.');
}