<?php /* Menu function handler made by giaidieu.com. */

/**
 * Define menu items.
 */
function custom_menu_items_get() {
  $items = array();
  
  $items['admin/test'] = array(
    'page callback' => 'custom_test',
    'access callback' => TRUE,
    'type' => MENU_CALLBACK,
    'file' => 'custom.inc',
  );

  //Custom site settings
  $items['admin/config/administration/site-settings'] = array(
    'page callback' => 'drupal_get_form',
    'page arguments' => array('custom_site_settings_form'),
    'access callback' => _check_access('admin'),
    'type' => MENU_NORMAL_ITEM,
    'file' => 'custom.inc',
    'title' => 'Tỷ lệ % tương ứng với mỗi phần trong Trang Cá Nhân'
  );

  $items['admin/config/administration/site-notification'] = array(
    'page callback' => 'drupal_get_form',
    'page arguments' => array('custom_site_notification_form'),
    'access callback' => _check_access('admin'),
    'type' => MENU_NORMAL_ITEM,
    'file' => 'custom.inc',
    'title' => 'Cài đặt thông báo hoàn thành đơn đặt hàng'
  );

  $items['custom/add-to-cart'] = array(
    'page callback' => 'custom_add_to_cart_callback',
    'access callback' => TRUE,
    'type' => MENU_CALLBACK,
    'file' => 'custom.inc',
  );

  $items['admin/project'] = array(
    'page callback' => 'custom_project_landing',
    'access callback' => TRUE,
    'type' => MENU_CALLBACK,
    'file' => 'custom.inc',
  );

  $items['admin/project/video_settings'] = array(
    'page callback' => 'drupal_get_form',
    'page arguments' => array('custom_project_video_settings_form'),
    'access callback' => TRUE,
    'type' => MENU_CALLBACK,
    'file' => 'custom.admin.inc',
  );

  $items['custom/notification-send'] = array(
    'page callback' => 'custom_notification_send',
    'access callback' => TRUE,
    'type' => MENU_CALLBACK,
    'file' => 'custom.inc',
  );

  $items['custom/photo-upload2'] = array(
    'page callback' => 'custom_photo_upload2',
    'access callback' => TRUE,
    'type' => MENU_CALLBACK,
    'file' => 'custom.core.inc',
  );

  $items['custom/photo-upload'] = array(
    'page callback' => 'custom_photo_upload',
    'access callback' => TRUE,
    'type' => MENU_CALLBACK,
    'file' => 'custom.core.inc',
  );

  $items['custom/video-upload'] = array(
    'page callback' => 'custom_video_upload',
    'access callback' => TRUE,
    'type' => MENU_CALLBACK,
    'file' => 'custom.core.inc',
  );

  $items['custom/video-livestream-upload'] = array(
    'page callback' => 'custom_video_livestream_upload',
    'access callback' => TRUE,
    'type' => MENU_CALLBACK,
    'file' => 'custom.core.inc',
  );

  $items['custom/user/files/%'] = array(
    'page callback' => 'custom_user_files_callback',
    'page arguments' => array(3),
    'access callback' => TRUE,
    'type' => MENU_CALLBACK,
    'file' => 'custom.inc',
  );

  // Add a tab to user manage page for webmasters to view who is giving permissions to them.
  $items['admin/people/admin_permission'] = array(
    'title' => 'Admin Permission',
    'description' => t('View list of users who gave admin permission to you.'),
    'page callback' => 'custom_admin_permission_view_list_page',
    'access callback' => TRUE,
    'file' => 'custom.admin.inc',
    'type' => MENU_LOCAL_TASK,
  );

  $items['custom/video-subscription-add-to-cart/%/%'] = array(
    'page callback' => 'custom_video_subscription_add_to_cart_callback',
    'page arguments' => array(2, 3),
    'access callback' => TRUE,
    'type' => MENU_CALLBACK,
    'file' => 'custom.inc',
  );

  $items['custom/product-addons-add-to-cart'] = array(
    'page callback' => 'custom_product_addons_add_to_cart_callback',
    'access callback' => TRUE,
    'type' => MENU_CALLBACK,
    'file' => 'custom.inc',
  );

  $items['custom/login-form'] = array(
    'page callback' => 'custom_login_form_load',
    'access callback' => TRUE,
    'type' => MENU_CALLBACK,
    'file' => 'custom.inc',
  );

  $items['custom/register-form'] = array(
    'page callback' => 'custom_register_form_load',
    'access callback' => TRUE,
    'type' => MENU_CALLBACK,
    'file' => 'custom.inc',
  );

  $items['custom/password-form'] = array(
    'page callback' => 'custom_password_form_load',
    'access callback' => TRUE,
    'type' => MENU_CALLBACK,
    'file' => 'custom.inc',
  );

  $items['user/profile'] = array(
    'page callback' => 'custom_profile_form_load',
    'access callback' => TRUE,
    'type' => MENU_CALLBACK,
    'file' => 'custom.inc',
  );

  $items['user/password-change-form'] = array(
    'page callback' => 'custom_password_change_form_load',
    'access callback' => TRUE,
    'type' => MENU_CALLBACK,
    'file' => 'custom.inc',
  );

  $items['user/product-combo/create'] = array(
    'page callback' => 'custom_user_product_combo_form_load',
    'access callback' => TRUE,
    'type' => MENU_CALLBACK,
    'file' => 'custom.inc',
  );

  $items['user/product-combo/edit/%node'] = array(
    'page callback' => 'custom_user_product_combo_form_load',
    'page arguments' => array(3),
    'access callback' => TRUE,
    'type' => MENU_CALLBACK,
    'file' => 'custom.inc',
  );

  $items['user/product/create'] = array(
    'page callback' => 'custom_user_product_form_load',
    'access callback' => TRUE,
    'type' => MENU_CALLBACK,
    'file' => 'custom.inc',
  );

  $items['user/product/edit/%node'] = array(
    'page callback' => 'custom_user_product_form_load',
    'page arguments' => array(3),
    'access callback' => TRUE,
    'type' => MENU_CALLBACK,
    'file' => 'custom.inc',
  );

  $items['user/service/create'] = array(
    'page callback' => 'custom_user_service_form_load',
    'access callback' => TRUE,
    'type' => MENU_CALLBACK,
    'file' => 'custom.inc',
  );

  $items['user/service/edit/%node'] = array(
    'page callback' => 'custom_user_service_form_load',
    'page arguments' => array(3),
    'access callback' => TRUE,
    'type' => MENU_CALLBACK,
    'file' => 'custom.inc',
  );

  $items['user/video/create'] = array(
    'page callback' => 'custom_user_video_form_load',
    'access callback' => TRUE,
    'type' => MENU_CALLBACK,
    'file' => 'custom.inc',
  );

  $items['user/video/edit/%node'] = array(
    'page callback' => 'custom_user_video_form_load',
    'page arguments' => array(3),
    'access callback' => TRUE,
    'type' => MENU_CALLBACK,
    'file' => 'custom.inc',
  );

  $items['user/order/view/%'] = array(
    'title' => 'Xem đơn hàng',
    'page callback' => 'custom_user_order_view',
    'page arguments' => array(3),
    'access callback' => TRUE,
    'type' => MENU_CALLBACK,
    'file' => 'custom.inc',
  );

  $items['user/coupon/create'] = array(
    'title' => 'Tạo mã khuyến mại',
    'page callback' => 'custom_user_coupon_form_load',
    'access callback' => TRUE,
    'type' => MENU_CALLBACK,
    'file' => 'custom.inc',
  );

  $items['user/coupon/edit/%'] = array(
    'title' => 'Sửa mã khuyến mại',
    'page callback' => 'custom_user_coupon_form_load',
    'page arguments' => array(3),
    'access callback' => TRUE,
    'type' => MENU_CALLBACK,
    'file' => 'custom.inc',
  );

  $items['user/settings'] = array(
    'title' => 'Thiết lập tùy chọn',
    'page callback' => 'custom_user_settings',
    'access callback' => TRUE,
    'type' => MENU_CALLBACK,
    'file' => 'custom.inc',
  );

  $items['dismiss/form-1510'] = array(
    'title' => 'Thiết lập tùy chọn',
    'page callback' => 'custom_dismiss_save',
    'access callback' => TRUE,
    'type' => MENU_CALLBACK,
    'file' => 'custom.inc',
  );

  $items['drupalapp-video'] = array(
    'title' => 'Videos',
    'page callback' => 'custom_drupalapp_video',
    'access callback' => TRUE,
    'type' => MENU_CALLBACK,
    'file' => 'custom.inc',
  );

  $items['products-to-payment'] = array(
    'title' => 'Products to payment',
    'page callback' => 'custom_products_to_payment',
    'access callback' => TRUE,
    'type' => MENU_CALLBACK,
    'file' => 'custom.inc',
  );

  $items['products-to-payment-complete'] = array(
    'title' => 'Products to payment complete',
    'page callback' => 'custom_products_to_payment_complete',
    'access callback' => TRUE,
    'type' => MENU_CALLBACK,
    'file' => 'custom.inc',
  );

  $items['app/order'] = array(
    'title' => 'App order details',
    'page callback' => 'app_order_details',
    'access callback' => TRUE,
    'type' => MENU_NORMAL_ITEM,
    'file' => 'custom.inc',
  );

  $items['app/notification'] = array(
    'title' => 'App notification details',
    'page callback' => 'app_notification_details',
    'access callback' => TRUE,
    'type' => MENU_NORMAL_ITEM,
    'file' => 'custom.inc',
  );

  $items['app/combo'] = array(
    'title' => 'App Product combo',
    'page callback' => 'app_product_combo',
    'access callback' => TRUE,
    'type' => MENU_NORMAL_ITEM,
    'file' => 'custom.inc',
  );

  $items['app/get/add_on'] = array(
    'title' => 'App Product combo',
    'page callback' => 'app_product_addon',
    'access callback' => TRUE,
    'type' => MENU_NORMAL_ITEM,
    'file' => 'custom.inc',
  );

  $items['app/cart/add_on'] = array(
    'title' => 'App Product combo',
    'page callback' => 'app_add_product_add_on',
    'access callback' => TRUE,
    'type' => MENU_NORMAL_ITEM,
    'file' => 'custom.inc',
  );
  
  return $items;
}