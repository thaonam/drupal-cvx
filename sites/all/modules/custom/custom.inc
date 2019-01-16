<?php /* Custom functionality file created by giaidieu. */

/**
 * Add product to cart via Ajax.
 */
function custom_add_to_cart_callback() {
  $nid = isset($_POST['nid']) ? (int) $_POST['nid'] : 0;
  if (!$nid) {die('Data invalid.');}
  
  uc_cart_add_item($nid);
  drupal_json_output(true);
  exit;
}

function app_notification_details($nid = NULL, $action = 'is_readed') {
  if ($nid == NULL) {
    return drupal_json_output(0);
  }

  if ($noty = node_load($nid)) {
    if ($action == 'is_readed') {
      global $user;
      if ($user->uid == $noty->uid && $noty->type == 'notification_message') {
        if (empty($noty->field_is_read) || $noty->field_is_read['und'][0]['value'] == 0) {
          $noty->field_is_read = ['und' => [['value' => 1]]];
          node_save($noty);
        }
      }
    }
  }
}

function app_order_details($order_id) {
  //dsm($order_id);
  $out = array('render' => '');
  if ($order = uc_order_load($order_id)) {
    //dsm($order);
    $out['render'] = theme('custom__order_view', array('order' => $order));
    //dsm($out);
    //$order = (array) $order;
    return drupal_json_output($out);
  }

  return drupal_json_output($out);
  //return "Ttest";
}

/**
 * Mobile app payment complete.
 */
function custom_products_to_payment_complete() {
  // Return a blank page.
  exit;
}

/**
 * Add products to cart and go to payment for app.
 */
function custom_products_to_payment() {
  $uid = isset($_GET['uid']) ? $_GET['uid'] : '';
  $fullname = isset($_GET['fullname']) ? $_GET['fullname'] : '';
  $mobile = isset($_GET['mobile']) ? $_GET['mobile'] : '';
  $email = isset($_GET['email']) ? $_GET['email'] : '';
  $city = isset($_GET['city']) ? $_GET['city'] : '';
  $address = isset($_GET['address']) ? $_GET['address'] : '';
  $message = isset($_GET['message']) ? $_GET['message'] : '';
  $payment_method = isset($_GET['payment_method']) ? $_GET['payment_method'] : '';
  $products = isset($_GET['products']) ? preg_split('/\,/', $_GET['products']) : array();
  $qtys = isset($_GET['qtys']) ? preg_split('/\,/', $_GET['qtys']) : array();
  $order_total = isset($_GET['order_total']) ? $_GET['order_total'] : '';
  $coupon = isset($_GET['coupon']) ? $_GET['coupon'] : '';
  
  // Add products to shopping cart.
  if (session_status() == PHP_SESSION_NONE) {
    session_start();
  }
  uc_cart_empty();
  
  for ($i = 0; $i < count($products); $i++) {
    uc_cart_add_item($products[$i], $qtys[$i]);
  }
  
  // Apply coupon if any.
  if ($coupon != '') {
    uc_coupon_session_add($coupon, 'submit');
  }
  
  // Add customer info for later use.
  $_SESSION['app_customer_details'] = array(
    'fullname' => $fullname,
    'mobile' => $mobile,
    'email' => $email,
    'city' => $city,
    'address' => $address,
    'message' => $message,
    'payment_method' => $payment_method,
    'products' => $products,
    'qtys' => $qtys,
    'order_total' => $order_total,
    'coupon' => $coupon,
  );
  
  // Clear all Ubercart messages.
  drupal_get_messages();
  
  // Go to payment page.
  drupal_goto('cart/checkout');
  exit;
  //return 'Test';
}

/**
 * Play video in app.
 */
function custom_drupalapp_video($tags = 'all', $vcate = 'all', $nid = null) {
  $nodes = array();
  $args = array($tags, $vcate);
  if (!empty($nid)) $args[] = $nid;
  $view = views_get_view('drupalapp_node_functions');
  $view->set_display('page_4');
  $view->set_arguments($args);
  // change the amount of items to show
  //$view->set_items_per_page(4);
  $view->pre_execute();
  $view->execute();
  if (!empty($view->result)) {
    //dsm($videos);
    foreach ($view->result as $key => $video) {
      $tmp = new stdClass();
      $tmp->title = $video->node_title;
      $tmp->nid = $video->nid;
      $tmp->field_full_name = !empty($video->field_field_full_name) ? $video->field_field_full_name[0]['raw']['value'] : '';
      $thumb = '';
      if (!empty($video->field_field_video_youtube_1))
        $thumb = '<img src="http://img.youtube.com/vi/' . $video->field_field_video_youtube_1[0]['raw']['video_id'] . '/mqdefault.jpg"/>';

      if (!empty($video->field_field_video)) {
        $thumb = render($video->field_field_video[0]['rendered']);
      }
      $tmp->video_thumb = $thumb;
      $nodes[] = array(
        'node' => $tmp
      );
    }
  }
  $view_pager = array(
    'path' => current_path(),
    'count' => $view->query->pager->total_items,
    'limit' => $view->query->pager->options['items_per_page'],
    'page' => $view->query->pager->current_page,
    'pages' => ceil($view->query->pager->total_items/$view->query->pager->options['items_per_page']),
  );
  if (isset($_GET['desktop'])) {
    dsm($view->result);
    dsm($view->query->pager->current_page);

    return "test";
  }
  return drupal_json_output(array('nodes' => $nodes, 'view' => $view_pager));
  //dsm($nodes);
  //return "test";
}

/**
 * List product combo
 */
function app_product_combo($nid = null) {
  $nodes = array();
  $args = !empty($nid) ? array($nid) : array();
  $view = views_get_view('node_functions');
  $view->set_display('block_65');
  $view->set_arguments($args);
  // change the amount of items to show
  //$view->set_items_per_page(4);
  $view->pre_execute();
  $view->execute();
  if (!empty($view->result)) {
    foreach ($view->result as $key => $combo) {
      if ($tmp = node_load($combo->nid)) {
          $tmp_view = node_view($tmp, 'teaser');
          $products = '<ul class="combo-list">';
          $prices = 0;
//          dsm($tmp);
          if (!empty($tmp_view['field_product'])) {
              foreach ($tmp_view['field_product']['#items'] as $key => $item) {
                  $path = $item['entity'] == 'product' ? 'product-detail/' . $item['entity']->nid : 'service-detail/' . $item['entity']->nid;
                  $products .= '<li onclick="drupalgap_goto(\''. $path .'\');"><i class="fa fa-check" aria-hidden="true"></i> '. $item['entity']->title .'</li>';
                  $prices += $item['entity']->sell_price;
              }
          }
          $products .= '</ul>';
          $nodes[] = array(
              'node' => array(
                  'title' => $tmp->title,
                  'nid' => $tmp->nid,
                  'products' => $products,
                  'products_price' => uc_currency_format($prices),
                  'combo_price' => uc_currency_format($tmp->sell_price),
              )
          );
      }
    }
  }
  $view_pager = array(
    'path' => current_path(),
    'count' => $view->query->pager->total_items,
    'limit' => $view->query->pager->options['items_per_page'],
    'page' => $view->query->pager->current_page,
    'pages' => ceil($view->query->pager->total_items/$view->query->pager->options['items_per_page']),
  );
  if (isset($_GET['desktop'])) {
    //dsm($nodes);
    //dsm($view_pager);

    return "test";
  }
  return drupal_json_output(array('nodes' => $nodes, 'view' => $view_pager));
  //dsm($nodes);
  //return "test";
}

/**
 * Test page.
 */
function custom_test() {
  $result = views_get_view_result('drupalapp_node_functions', 'page_25', '');
  dsm($result);
  
  $video_node = node_load($result[0]->nid);
  dsm($video_node);
  /*
  $result = db_query("SELECT nid FROM {node} WHERE type='video'");
  foreach ($result as $row) {
    $node = node_load($row->nid);
    $node->field_live_streaming[LANGUAGE_NONE][0]['value'] = 0;
    node_save($node);
  }
  */
  
  return 'Test!';
}

/**
 * Return a course by video nid.
 */
function custom_course_by_video_nid($nid) {
  $result = views_get_view_result('node_functions', 'block_83', $nid);
  if (!empty($result)) {
    return array(
      'nid' => $result[0]->nid,
      'title' => $result[0]->node_title,
    );
  }
  else{
    return array();
  }
  
}

/**
 * Function to return a video course code by course nid.
 */
function custom_video_course_code_by_course_nid($nid) {
  $result = views_get_view_result('uc_orders_user', 'block_3', $nid);
  if (!empty($result)) {
    return array(
      'order_id' => $result[0]->order_id,
      'product_id' => $result[0]->uc_order_products_uc_orders_order_product_id,
      'video_code' => $result[0]->field_field_video_course_code_1[0]['raw']['value'],
    );
  }
  else{
    return array();
  }
}

/**
 * Count unread notification messages.
 */
function custom_user_count_unread_messages() {
  $result = views_get_view_result('node_functions', 'block_68');
  return count($result);
}

/**
 * Send notifications to users via cron.
 */
function custom_notification_send() {
  // Collect all notification nodes and detect those are at sending schedule now.
  $result = views_get_view_result('node_functions', 'block_67');
  $nodes = array();
  
  foreach ($result as $row) {
    $nodes[] = node_load($row->nid);
  }
  
  // Process for each node now.
  module_load_include('inc', 'custom', 'custom.core');
  $count = 0;

  foreach ($nodes as $node) {
    // Check whether this notification is on this sending time.
    $is_on_schedule = _custom_notification_is_on_schedule($node);
    if (!$is_on_schedule) {continue;}
    
    // Base on the notification settings, collect targeted people.
    $uids = _custom_notification_get_targeted_people($node);
    //dsm($uids);
    if (empty($uids)) {continue;}
    
    // Send notification to this uid group by creating notification message nodes.
    foreach ($uids as $row) {
      $notification_message_nid = custom_node_create($row['uid'], $row['name'], 'notification_message', $node->title, 1, '');
      $notification_message = $notification_message_nid > 0 ? node_load($notification_message_nid) : null;
      
      if ($notification_message) {
        $notification_message->body = $node->body;
        node_save($notification_message);
        
        // Send a push to user App.
        $payload = array(
		      'title' => 'CauVongXanh.vn',
		      'alert' => $node->title,
          'type' => 'notification_message',
			    'nid' => $node->nid,
        );
        custom_push_notification_send($row['uid'], $payload);
        
        $count++;
      }
    }
    
    // Update last time sending for this notification node.
    $node->field_last_time_sending[LANGUAGE_NONE][0]['value'] = time();
    node_save($node);
  }

  watchdog('custom', 'Has been sent total of ' . $count . ' notifications to users.');
  exit;
}

/**
 * Helper function to get targeted people base on node notification settings.
 */
function _custom_notification_get_targeted_people($node) {
  // Get product category.
  $product_categories = array();
  if (!empty($node->field_product_category[LANGUAGE_NONE])) {
    foreach ($node->field_product_category[LANGUAGE_NONE] as $index => $value) {
      $product_categories[] = $value['tid'];
    }
  }

  // Get service category.
  $service_categories = array();
  if (!empty($node->field_type_of_service[LANGUAGE_NONE])) {
    foreach ($node->field_type_of_service[LANGUAGE_NONE] as $index => $value) {
      $service_categories[] = $value['tid'];
    }
  }
  
  // Get cities.
  $cities = array();
  if (!empty($node->field_cities[LANGUAGE_NONE])) {
    foreach ($node->field_cities[LANGUAGE_NONE] as $index => $value) {
      $cities[] = $value['tid'];
    }
  }
  //dsm('City:');
  //dsm($cities);
  
  // Get account type.
  $account_types = array();
  if (!empty($node->field_account_type[LANGUAGE_NONE])) {
    foreach ($node->field_account_type[LANGUAGE_NONE] as $index => $value) {
      $account_types[] = $value['value'];
    }
  }
  //dsm('Account type:');
  //dsm($account_types);
  
  // Get age ranges.
  $age_range_from_age = !empty($node->field_age_from[LANGUAGE_NONE]) ? $node->field_age_from[LANGUAGE_NONE][0]['value'] : 0;
  $age_range_to_age = !empty($node->field_age_to[LANGUAGE_NONE]) ? $node->field_age_to[LANGUAGE_NONE][0]['value'] : 0;
  
  if ($age_range_from_age > $age_range_to_age) {
    // Can't from is greater than to. Is a validation error possible, so fix it.
    $age_range_from_age = $age_range_to_age;
  }
  
  // Convert age to datetime: Y/m/d.
  $now = time();
  $current_year = format_date($now, 'custom', 'Y');
  
  // Process params for the Views filter.
  $query = $_GET['q'];
  
  $_GET = array();
  $_GET['q'] = $query;
  $_GET['field_birthdate_value'] = array();
  
  $_GET['field_birthdate_value']['min'] = array(
    'month' => format_date($now, 'custom', 'n'),
    'day' => format_date($now, 'custom', 'j'),
    'year' => $current_year - $age_range_to_age,
  );

  $_GET['field_birthdate_value']['max'] = array(
    'month' => format_date($now, 'custom', 'n'),
    'day' => format_date($now, 'custom', 'j'),
    'year' => $current_year - $age_range_from_age,
  );
  
  if (!empty($account_types)) {
    $_GET['field_account_type_value'] = $account_types;
  }
  
  if (!empty($cities)) {
    $_GET['field_cities_tid'] = $cities;
  }
  
  //dsm('View filter:');
  //dsm($_GET);
  
  $uids = array();
  $result = views_get_view_result('user_functions', 'page_1');
  foreach ($result as $row) {
    $uids[] = array(
      'uid' => $row->uid,
      'name' => $row->users_name,
    );
  }
  
  return $uids;
}

/**
 * Helper function to detect a notification node whether it is on schedule for sending.
 */
function _custom_notification_is_on_schedule($node) {
  // Check field validity. Most case this will happen.
  if (empty($node->field_how_receiving[LANGUAGE_NONE])) {return false;}
  
  // Check datetime sending. If it is a future date, mean not in schedule.
  // It is already filtered from Views, but here just in case.
  if (!empty($node->field_datetime_sending[LANGUAGE_NONE]) and $node->field_datetime_sending[LANGUAGE_NONE][0]['value'] > time()) {
    return false;
  }
  
  // Get the last sending timestamp.
  $last_time_sending_timestamp = !empty($node->field_last_time_sending[LANGUAGE_NONE]) ? $node->field_last_time_sending[LANGUAGE_NONE][0]['value'] : 0;
  $check_time = 0;
  $now = time();
  
  // Detect by on daily, weekly, weekdays, monthly.
  switch ($node->field_how_receiving[LANGUAGE_NONE][0]['value']) {
    case 'daily':
      $day = $node->field_daily_number_sending[LANGUAGE_NONE][0]['value'];
      $check_time = $day > 1 ? strtotime('+' . $day . ' days', $last_time_sending_timestamp) : strtotime('+1 day', $last_time_sending_timestamp);

      break;
    
    case 'weekly':
      $week = $node->field_weekly_number_sending[LANGUAGE_NONE][0]['value'];
      $check_time = $week > 1 ? strtotime('+' . $week . ' weeks', $last_time_sending_timestamp) : strtotime('+1 week', $last_time_sending_timestamp);
            
      break;

    case 'weekdays':
      $weekdays = array();
      foreach ($node->field_weekdays_day_sending[LANGUAGE_NONE] as $index => $value) {
        $weekdays[] = $value['value'];
      }
      
      $today_is_day = format_date(time(), 'custom', 'w');
      if (in_array($today_is_day, $weekdays)) {
        // If last sending was happend more than a day, send.
        $check_time = strtotime('+1 day', $last_time_sending_timestamp);
      }
      
      break;
    
    case 'monthly':
      $month = $node->field_monthly_number_sending[LANGUAGE_NONE][0]['value'];
      $check_time = $month > 1 ? strtotime('+' . $month . ' months', $last_time_sending_timestamp) : strtotime('+1 month', $last_time_sending_timestamp);

      break;
  }
  
  return $check_time <= $now;
}

function app_add_product_add_on($cid) {
    $item = field_collection_item_load($cid);
    if (!$item) {
        return drupal_json_output(false);
    }

    if (isset($item->field_product_addon) and !empty($item->field_product_addon[LANGUAGE_NONE])) {
        $node = node_load($item->field_product_addon[LANGUAGE_NONE][0]['target_id']);
    }
    else if (isset($item->field_service) and !empty($item->field_service[LANGUAGE_NONE])) {
        $node = node_load($item->field_service[LANGUAGE_NONE][0]['target_id']);
    }

    // Get the deducted price.
    $price = $node->price - ($node->price * $item->field_promotion_rate[LANGUAGE_NONE][0]['value'] / 100);

    // Clone the node here.
    $node->field_parent_nid[LANGUAGE_NONE][0]['value'] = $node->nid;
    $node->nid = null;
    $node->vid = null;
    $node->title = $node->title . ' (mua kèm)';
    $node->price = $price;
    $node->sell_price = $price;
    node_save($node);
    return drupal_json_output($node);
}

function app_product_addon($nid = null) {
    if (!empty($nid)) {
        $cnode = node_load($nid);
        $addon = custom_product_addon_embed($cnode, true);
        return drupal_json_output($addon);
    }
}

/**
 * Build product add on popup form.
 */
function custom_product_addon_embed($node, $is_app = false) {
  // Load add-on products / services.
  //dsm($node);
  $products = array();
  $services = array();
        
  if (!empty($node->field_products_addon[LANGUAGE_NONE])) {
    foreach ($node->field_products_addon[LANGUAGE_NONE] as $index => $value) {
      $item = field_collection_item_load($value['value']);
      if ($item) {
        $product = node_load($item->field_product_addon[LANGUAGE_NONE][0]['target_id']);
        $products[] = array(
          'cid' => $value['value'],
          'nid' => $product->nid,
          'title' => $product->title,
          'original_price' => uc_currency_format($product->price),
          'promotion_rate' => $item->field_promotion_rate[LANGUAGE_NONE][0]['value'],
          'image' => !empty($product->uc_product_image) ? image_style_url('thumbnail', $product->uc_product_image['und'][0]['uri']) : '',
          'sell_price' => uc_currency_format($product->price - ($product->price * $item->field_promotion_rate[LANGUAGE_NONE][0]['value'] / 100)),
        );
      }
    }
  }

  if (!empty($node->field_services_addon[LANGUAGE_NONE])) {
    foreach ($node->field_services_addon[LANGUAGE_NONE] as $index => $value) {
      $item = field_collection_item_load($value['value']);
      if ($item) {
        $service = node_load($item->field_service[LANGUAGE_NONE][0]['target_id']);
        $services[] = array(
          'cid' => $value['value'],
          'nid' => $service->nid,
          'title' => $service->title,
          'original_price' => uc_currency_format($service->price),
          'promotion_rate' => $item->field_promotion_rate[LANGUAGE_NONE][0]['value'],
          'image' => !empty($service->uc_product_image) ? image_style_url('thumbnail', $service->uc_product_image['und'][0]['uri']) : '',
          'sell_price' => uc_currency_format($service->price - ($service->price * $item->field_promotion_rate[LANGUAGE_NONE][0]['value'] / 100)),
        );
      }
    }
  }
        
  // Add to frontend for showing.
  if (!empty($products) or !empty($services)) {
    $tasscare_settings = array(
      'product_has_addon' => true,
      'product_add_on_popup' => theme('custom__product_add_on_popup', array('product' => $node, 'product_addons' => $products, 'service_addons' => $services)),
    );
  }
  elseif ($node->type == 'service') {
    $tasscare_settings = array(
      'product_has_addon' => true,
      'product_add_on_popup' => theme('custom__product_add_on_popup', array('product' => $node, 'product_addons' => $products, 'service_addons' => $services)),
    );
  }
  else {
    $tasscare_settings = array(
      'product_has_addon' => false
    );
  }

  drupal_add_js(array('tasscare' => $tasscare_settings), 'setting');
  drupal_add_js(drupal_get_path('module', 'custom') . '/js/giaidieu.product.js', array('type' => 'file', 'scope' => 'footer'));

    if ($is_app) {
        return $tasscare_settings;
    }
}

/**
 * Add product to cart together with its add-on.
 */
function custom_product_addons_add_to_cart_callback() {
  $product = isset($_POST['item']) ? $_POST['item'] : array();
  $product_addons = isset($_POST['items_addon']) ? $_POST['items_addon'] : array();
  
  if (empty($product) or !$product['nid'] or !$product['qty']) {
    die('Data invalid.');
  }
  
  // Add main product to shopping cart.
  session_start();
  uc_cart_add_item($product['nid'], $product['qty']);
  
  // Add addons.
  foreach ($product_addons as $cid) {
    // Load more info.
    $item = field_collection_item_load($cid);
    if (!$item) {continue;}
    
    if (isset($item->field_product_addon) and !empty($item->field_product_addon[LANGUAGE_NONE])) {
      $node = node_load($item->field_product_addon[LANGUAGE_NONE][0]['target_id']);
    }
    else if (isset($item->field_service) and !empty($item->field_service[LANGUAGE_NONE])) {
      $node = node_load($item->field_service[LANGUAGE_NONE][0]['target_id']);
    }
    
    // Get the deducted price.
    $price = $node->price - ($node->price * $item->field_promotion_rate[LANGUAGE_NONE][0]['value'] / 100);
    
    // Clone the node here.
    $node->field_parent_nid[LANGUAGE_NONE][0]['value'] = $node->nid;
    $node->nid = null;
    $node->vid = null;
    $node->title = $node->title . ' (mua kèm)';
    $node->price = $price;
    $node->sell_price = $price;
    node_save($node);

    if ($node->nid) {
      uc_cart_add_item($node->nid);
    }
  }
  
  //dsm($product);
  //dsm($product_addons);

  // Add lich_hen.
  if (!empty($_POST['lich_hen'])) {
    global $user;
    $id = 'lich_hen_' . $user->uid;
    $_SESSION[$id] = $_POST['lich_hen'];
  }
  
  drupal_json_output(true);
  exit;
}

/**
 * Add a video subscription program to cart form.
 */
function custom_video_subscription_add_to_cart_callback($package, $nid) {
  switch (strtoupper($package)) {
    case 'VIDEO_WEEKLY':
      $nid = 1436;
      break;

    case 'VIDEO_MONTHLY':
      $nid = 1437;
      break;

    case 'VIDEO_YEARLY':
      $nid = 1438;
      break;
  }

  if ($nid > 0) {
    uc_cart_add_item($nid);
    drupal_goto('cart');
  }
  else{
    drupal_goto('<front>');
  }
}

/**
 * Add subscription for user.
 * $extension: '+1 month'.
 */
function custom_video_subscription_add($uid, $extension) {
  // Load user account.
  $account = user_load($uid);
  
  // Get the current subscription to extend.
  $now = time();
  $current_subscription = !empty($account->field_video_subscription_end[LANGUAGE_NONE]) ? (int) $account->field_video_subscription_end[LANGUAGE_NONE][0]['value'] : $now;
  if ($current_subscription < $now) {$current_subscription = $now;}
  
  // Extend the subscription.
  $account->field_video_subscription_end[LANGUAGE_NONE][0]['value'] = strtotime($extension, $current_subscription);
  user_save($account);
  
  drupal_set_message('Thời hạn sử dụng dịch vụ xem Video của bạn có giá trị tới ngày: ' . format_date($account->field_video_subscription_end[LANGUAGE_NONE][0]['value'], 'custom', 'd-m-Y H:i'));
}

/**
 * User files - use in user website backend.
 */
function custom_user_files_callback($file_type) {
  $result = array();
  
  if ($file_type == 'image') {
    $result = views_embed_view('admin_views_file', 'page_1');
  }
  else if ($file_type == 'video') {
    $result = views_embed_view('node_functions', 'page_3');
  }
  
  drupal_json_output($result);
  exit;
}

/**
 * Project page.
 */
function custom_project_landing() {
  return theme('custom__project_landing');
}

/**
 * User settings page.
 */
function custom_user_settings() {
  global $user;
  
  // Admin list.
  $result = views_get_view_result('drupalapp_user_functions', 'page_3');
  $admin_list = array();
  
  foreach ($result as $row) {
    $admin_list[] = array(
      'uid' => $row->uid,
      'username' => ucfirst($row->users_name),
      'mail' => $row->users_mail,
    );
  }
  
  // Sub-domain.
  $subdomain = _subdomain_load_record_by_uid($user->uid);
  
  return theme('custom__user_settings', array('admin_list' => $admin_list, 'subdomain' => $subdomain));
}

/**
 * Log an activity for user.
 */
function custom_user_log_activity($message, $log_type = 'content') {
  global $user;
  global $language;

  $node = new stdClass();
  $node->type = 'log';
  $node->language = $language->language;
  $node->uid = $user->uid;
  $node->name = $user->name;
  $node->title = 'Activity for ' . $user->name;
  $node->status = 0;
  $node->body[LANGUAGE_NONE][0]['value'] = $message;
  $node->field_log_type[LANGUAGE_NONE][0]['value'] = $log_type;

  node_save($node);
  //$nid = custom_node_create($user->uid, $user->name, 'log', 'Activity for ' . $user->name, 0, $message);
  if (!$node->nid) {
    // Something wrong, log error.
    watchdog('custom', 'Cannot log activity for user ' . $user->name . ' with message: ' . $message);
  }

  return $node;
}

/**
 * View an order.
 */
function custom_user_order_view($order_id) {
  // Get the order.
  $order = uc_order_load($order_id);
  
  // Get all products in the order.
  $products = array();
  foreach ($order->products as $pid => $product) {
    $products[$pid] = array(
      'product' => $product,
      'product_node' => node_load($product->nid),
    );
  }
  
  //dsm($order);
  //dsm($products);
  
  return theme('custom__order_view', array('order' => $order, 'products' => $products));
}

/**
 * Return a product combo creation / edit form.
 */
function custom_user_product_combo_form_load($node = null) {
  // Check input.
  if (is_object($node) and $node->type != 'combo') {die('Data invalid.');}

  // Load products / services to be added to this combo.
  $result = views_get_view_result('entity_reference', 'entityreference_3');
  $products_services = array('product' => array(), 'service' => array());

  foreach ($result as $row) {
    $products_services[$row->node_type][$row->nid] = array(
      'title' => $row->node_title,
      'price' => (int) $row->uc_products_sell_price,
    );
  }

  drupal_add_js(drupal_get_path('module', 'custom') . '/js/giaidieu.file.js');

  return theme('custom__product_combo_form', array('products_services' => $products_services, 'node' => $node));
}

/**
 * Return a product creation / edit form.
 */
function custom_user_product_form_load($node = null) {
  // Check input.
  if (is_object($node) and $node->type != 'product') {die('Data invalid.');}
  
  // Load category.
  $result = views_get_view_result('drupalapp_taxonomy_functions', 'page_1', 'product_category');
  $categories = array();

  foreach ($result as $row) {
    $categories[$row->tid] = $row->taxonomy_term_data_name;
  }

  // Load cities.
  $result = views_get_view_result('drupalapp_taxonomy_functions', 'page_1', 'cities');
  $cities = array();

  foreach ($result as $row) {
    $cities[$row->tid] = $row->taxonomy_term_data_name;
  }

  // Load tags.
  $result = views_get_view_result('drupalapp_taxonomy_functions', 'page_1', 'tags');
  $tags = array();

  foreach ($result as $row) {
    $tags[$row->tid] = $row->taxonomy_term_data_name;
  }
  
  // Load sellers / providers for this doctor.
  $result = views_get_view_result('drupalapp_node_functions', 'block_1');
  $sellers = array();
  
  foreach ($result as $row) {
    $sellers[$row->nid] = $row->node_title;
  }

  // Load products of this user.
  $result = views_get_view_result('entity_reference', 'entityreference_4');
  $products = array();

  foreach ($result as $row) {
    $products[$row->nid] = array(
      'title' => $row->node_title . ' - Giá bán: ' . uc_currency_format($row->uc_products_sell_price),
      'list_price' => (int) $row->uc_products_sell_price,
    );
  }

  // Load services of this user.
  $result = views_get_view_result('entity_reference', 'entityreference_5');
  $services = array();
  
  foreach ($result as $row) {
    $services[$row->nid] = array(
      'title' => $row->node_title . ' - Giá: ' . uc_currency_format($row->uc_products_sell_price),
      'list_price' => (int) $row->uc_products_sell_price,
    );
  }

  // Load handlers.
  drupal_add_js(drupal_get_path('module', 'custom') . '/js/giaidieu.file.js');
  
  return theme('custom__product_form', array('categories' => $categories, 'cities' => $cities, 'tags' => $tags, 'sellers' => $sellers, 'products' => $products, 'services' => $services, 'node' => $node));
}

/**
 * Return a service creation / edit form.
 */
function custom_user_service_form_load($node = null) {
  // Check input.
  if (is_object($node) and $node->type != 'service') {die('Data invalid.');}

  // Load category.
  $result = views_get_view_result('drupalapp_taxonomy_functions', 'page_1', 'services_category');
  $categories = array();

  foreach ($result as $row) {
    $categories[$row->tid] = $row->taxonomy_term_data_name;
  }

  // Load cities.
  $result = views_get_view_result('drupalapp_taxonomy_functions', 'page_1', 'cities');
  $cities = array();

  foreach ($result as $row) {
    $cities[$row->tid] = $row->taxonomy_term_data_name;
  }

  // Load tags.
  $result = views_get_view_result('drupalapp_taxonomy_functions', 'page_1', 'tags');
  $tags = array();

  foreach ($result as $row) {
    $tags[$row->tid] = $row->taxonomy_term_data_name;
  }

  // Load sellers / providers for this doctor.
  $result = views_get_view_result('drupalapp_node_functions', 'block_1');
  $sellers = array();
  
  foreach ($result as $row) {
    $sellers[$row->nid] = $row->node_title;
  }

  // Load products of this user.
  $result = views_get_view_result('entity_reference', 'entityreference_4');
  $products = array();
  
  foreach ($result as $row) {
    $products[$row->nid] = array(
      'title' => $row->node_title . ' - Giá bán: ' . uc_currency_format($row->uc_products_sell_price),
      'list_price' => (int) $row->uc_products_sell_price,
    );
  }

  // Load services of this user.
  $result = views_get_view_result('entity_reference', 'entityreference_5');
  $services = array();
  
  foreach ($result as $row) {
    $services[$row->nid] = array(
      'title' => $row->node_title . ' - Giá: ' . uc_currency_format($row->uc_products_sell_price),
      'list_price' => (int) $row->uc_products_sell_price,
    );
  }

  // Load handler.
  drupal_add_js(drupal_get_path('module', 'custom') . '/js/giaidieu.file.js');
  drupal_add_js(array('imce_upload' => '/imce'), 'setting');
  drupal_add_js(drupal_get_path('module', 'imce') . '/js/imce_set_inline.js');
  
  return theme('custom__service_form', array('categories' => $categories, 'cities' => $cities, 'tags' => $tags, 'sellers' => $sellers, 'products' => $products, 'services' => $services, 'node' => $node));
}

/**
 * Return a coupon creation form.
 */
function custom_user_coupon_form_load($cid = null) {
  $coupon = null;
  if ($cid > 0) {
    $coupon = uc_coupon_load($cid);
  }
  
  return theme('custom__coupon_form', array('coupon' => $coupon));
}

/**
 * Return a video creation form.
 */
function custom_user_video_form_load($node = null) {
  // Load video category.
  $result = views_get_view_result('drupalapp_taxonomy_functions', 'page_1', 'video_category');
  $categories = array();

  foreach ($result as $row) {
    $categories[$row->tid] = $row->taxonomy_term_data_name;
  }

  // Load tags.
  $result = views_get_view_result('drupalapp_taxonomy_functions', 'page_1', 'tags');
  $tags = array();

  foreach ($result as $row) {
    $tags[$row->tid] = $row->taxonomy_term_data_name;
  }

  // Load hander.
  drupal_add_js(array('imce_upload' => '/imce'), 'setting');
  drupal_add_js(drupal_get_path('module', 'imce') . '/js/imce_set_inline.js');

  // To be used for Video file upload.
  drupal_add_js(drupal_get_path('module', 'custom') . '/js/giaidieu.file.js');
  //drupal_add_library('system','jquery.form');

  return theme('custom__video_form', array('categories' => $categories, 'tags' => $tags, 'node' => $node));
}

/**
 * Return user profile form.
 */
function custom_profile_form_load() {
  global $user;
  $account = user_load($user->uid);

  // Load file handler.
  drupal_add_js(drupal_get_path('module', 'custom') . '/js/giaidieu.file.js');
  //drupal_add_js(array('imce_upload' => '/imce'), 'setting');
  //drupal_add_js(drupal_get_path('module', 'imce') . '/js/imce_set_inline.js');
  //drupal_add_js('sites/all/libraries/ckeditor/ckeditor.js');
  //drupal_add_js('sites/all/libraries/tinymce/jscripts/tiny_mce/tiny_mce.js');

  // Load editor.
  $editor_profile = wysiwyg_get_profile('editor');
  if ($editor_profile) {
    wysiwyg_load_editor($editor_profile);
  }

  return theme('custom__profile_form', array('account' => $account));
}

/**
 * Return a password update form.
 */
function custom_password_change_form_load() {
  return theme('custom__password_change_form');
}

/**
 * Return a password form via the ajax call. 
 */
function custom_password_form_load() {
  drupal_json_output(theme('custom__password_form'));
  exit;
}

/**
 * Return a login form via the ajax call.
 */
function custom_login_form_load() {
  drupal_json_output(theme('custom__login_form'));
  exit;
}

/**
 * Return a register form via the ajax call.
 */
function custom_register_form_load() {
  // Load cities list.
  $result = views_get_view_result('drupalapp_taxonomy_functions', 'page', 'cities');
  $cities = array();
  
  foreach ($result as $row) {
    $cities[$row->tid] = $row->taxonomy_term_data_name;
  }
  
  drupal_json_output(theme('custom__register_form', array('cities' => $cities)));
  exit;
}

function custom_build_pro_service_cate_tab() {
  $out = '<div class="dh-block-news-sidebar">';
  $out .= '<ul class="nav nav-tabs">
              <li class="active"><a data-toggle="tab" href="#product-sidebar">Sản phẩm</a></li>
              <li><a data-toggle="tab" href="#service-sidebar">Dịch vụ</a></li>
            </ul>';
  $out .= '<div class="tab-content">';
  $out .= '<div id="product-sidebar" class="tab-pane fade in active">';
  $out .= views_embed_view('taxonomy_functions', 'block_3');
  $out .= '</div>';

  $out .= '<div id="service-sidebar" class="tab-pane fade">';
  $out .= views_embed_view('taxonomy_functions', 'block_2');
  $out .= '</div>';

  $out .= '</div>';
  $out .= '</div>';

  return $out;
}

function custom_build_why_choose_us($key) {
  $data = unserialize(variable_get($key, serialize(array())));
  $img = '';
  if ($data['image'] != 0) {
    if ($file = file_load($data['image'])) {
      $img = file_create_url($file->uri);
    }
  }

  $out = '<div class="dh-reason">
  <div class="dh-reason-hotline">
      <div class="image">
        <img src="' . $img . '">
      </div>';

  if (!empty($data['hotline'])) {
    $out .= '<div class="dh-reason-body">
        <div class="mobilephone-outer">
          <a href="tel:'. $data['hotline'] .'">
            <div class="border-small-mobilephone"></div>
            <div class="wrap-mobilephone">
              <i class="fa fa-phone" aria-hidden="true"></i>
            </div>
          </a>
        </div>
        <div class="dh-content">
          <div class="title">'. t("Hotline Free Consultation") .'</div>
          <div class="dh-hotline">' . $data['hotline'] . '</div>
        </div>
      </div>';
  }

  $out .= '  </div>
  <div class="dh-reason-wrapper">';
  if (!empty($data['line1'])) {
    $out .= '<div class="subtitle">' . $data['line1'] . '</div>';
  }
  if (!empty($data['line2'])) {
    $out .= '<h2>' . $data['line2'] . '</h2>';
  }

  if (!empty($data['list'])) {
    $out .= '<ul>';
    $delay = 0.1;
    foreach ($data['list'] as $key => $item) {
      $out .= '<li>
            <a href="#front-reason'.$key.'"  class="dh-reason-item dh-mfp-link wow fadeInRight" data-wow-delay="' .$delay. 's" data-wow-duration="1s"> 
              <div class="dh-number">' . ($key + 1) . '.</div>
              <div class="dh-body">';
      $delay += 0.1;
      if (!empty($item['title'])) {
        $out .= '<div class="title">' . $item['title'] . '</div>';
      }
      if (!empty($item['body'])) {
        $out .= '<div class="dh-content">' . $item['body'] . '</div>';
      }
      if (!empty($item['post'])) {
        $out .= '<div id="front-reason' .$key. '" class="mfp-hide dh-front-feature-wrapper">';
        $out .= '<div class="dh-item">';
        $out .= '<div class="dh-title">' .$item['title']. '</div>';
        $out .= '<div class="dh-body">' . $item['post']. '</div>';
              
        $out .= '</div></div>';
      }
      
      $out .= '</div>
            </a>
           </li>';
    }
    $out .= '</ul>';
  }
  $out .= '</div>
 </div>';

  return $out;
}

function custom_build_intro_front($key) {
  $data = unserialize(variable_get($key, serialize(array())));

  $out = '<div class="feature-wrapper"> <div class="row">';
  $out2 = '';
  $delay = 0.1;
  
  if (!empty($data['list'])) {

    foreach ($data['list'] as $key => $item) {
      $img = '';
      if ($item['image'] != 0) {
        if ($file = file_load($item['image'])) {
          $img = image_style_url('rectangle_370x260', $file->uri);
        }
      }

      $out .= '<div class="col-sm-6 col-md-4 wow fadeInUp">
                <a class="dh-mfp-link" href="#front-feature'.$key.'" >
                  <div class="feature">';

      if (!empty($item['image'])) {
        $out .= '<img src="' . $img . '">';
      }
      if (!empty($item['title'])) {
        
        $out .= '<div class="feature-body th_feature-body">
                  <div class="title">/ ' . $item['title'] . ' /</div>
                </div>';
      }
      $out .= '</div>
              </a>';

      $out .= '<div id="front-feature' .$key. '" class="mfp-hide dh-front-feature-wrapper">';
      $out .= '<div class="dh-item">';
      $out .= '<div class="dh-title">' .$item['title']. '</div>';
      $out .= '<div class="dh-body">' . $item['body']. '</div>';
            
      $out .= '</div>
          </div> 
        </div>';

      $out2 .= '<a href="#dh-feature-col'.$key.'" class="dh-feature-col dh-mfp-link wow fadeInRight" data-wow-delay="' .$delay. 's" data-wow-duration="1s">';
      $out2 .= '<div class="feature-title"> ' . $item['title'] . '</div>';
      $out2 .= '<div class="feature-description">' . $item['summary']. '</div></a>';

      if (!empty($item['body'])) {
        $out2 .= '<div id="dh-feature-col' .$key. '" class="mfp-hide dh-front-feature-wrapper">';
        $out2 .= '<div class="dh-item">';
        $out2 .= '<div class="dh-title">' .$item['title']. '</div>';
        $out2 .= '<div class="dh-body">' . $item['body']. '</div>';  
        $out2 .= '</div></div>';
      }
      $delay += 0.1;
    }

  }

  $out .= '</div>
 </div>';

  if(current_path() == 'node/467') :
    return $out2;
  else : 
    return $out;
  endif;
}

function custom_build_front_statistics($key) {
  $data = unserialize(variable_get($key));
  $bg = '';
  $out = '';
  if (!empty($data['background'])) {
    if ($file = file_load($data['background'])) {
      $bg = file_create_url($file->uri);
      $bg = 'style="background-image: url('. $bg .');"';
    }
  }
  if (!empty($data['lang_title'])) {
    $out .= '<h2 class="block-title lang-title">' . $data['lang_title'] . '</h2>';
  }
  $out .= '<div class="bg-overlay" '. $bg .'></div>
          <div class="block-subtitle">' .$data['subtitle']. '</div>
          <ul class="block-statistic-list">';
  if (!empty($data['line'])) {
    foreach ($data['line'] as $key => $line) {
      $out .= '<li>
              <div class="statistic-item">
                <div class="statistic-number"><span>'. ($line['number']) .'</span> +</div>';
      if ($icon = file_load($line['icon'])) {
        $bg = file_create_url($icon->uri);
        $bg = 'style="background-image: url('. $bg .');"';
      }
      $out .= '<div class="statistic-icon icon-person" '. $bg .'></div>';
      $out .= '<div class="statistic-title">'. ($line['title']) .'</div>
              </div>
            </li>';
    }
  }
  $out .= '</ul>';
  return $out;
}

/**
 * Calculate user profile percentage.
 */
function custom_user_profile_percentage($account) {
  // Get acount type, default 0 if field is empty
  $type = (!empty($account->field_account_type)) ? $account->field_account_type[LANGUAGE_NONE][0]['value'] : 0;
  // Get fields list.
  switch ($type) {
    case 0:
      // Customer.
      $profile_fields = variable_get('profile_percent_customer', ['field_full_name' => 5, 'field_photo' => 5, 'field_mobile_number' => 5, 'field_birthdate' => 5, 'field_cities' => 5, 'field_address' => 3, 'field_cover_picture' => 3]);
      break;
    
    case 1:
      // Doctor.
      $profile_fields = variable_get('profile_percent_doctor', ['field_full_name' => 5, 'field_photo' => 5, 'field_mobile_number' => 5, 'field_birthdate' => 5, 'field_cities' => 5, 'field_user_description' => 5, 'field_address' => 3, 'field_current_address' => 3, 'field_social_address' => 3, 'field_cover_picture' => 3]);
      break;
  }
  
  // Calculate percentage.
  $user_point = 0;
  foreach ($profile_fields as $field_name => $field_point) {
    if (isset($account->{$field_name}) and is_array($account->{$field_name}) and !empty($account->{$field_name}[LANGUAGE_NONE])) {
      $user_point += $field_point;
    }

    if (isset($account->profile->{$field_name}) and is_array($account->profile->{$field_name}) and !empty($account->profile->{$field_name}[LANGUAGE_NONE])) {
      $user_point += $field_point;
    }
  }
  
  return $user_point;
}

/**
 * Function backup trước khi tạo form quản trị điểm
 * @param $account
 *
 * @return float|int
 */
function custom_user_profile_percentage_backup($account) {
  // Get acount type, default 0 if field is empty
  $type = (!empty($account->field_account_type)) ? $account->field_account_type[LANGUAGE_NONE][0]['value'] : 0;
  // Get fields list.
  switch ($type) {
    case 0:
      // Customer.
      $basic_fields = array('field_full_name' => 5, 'field_photo' => 5, 'field_mobile_number' => 5, 'field_birthdate' => 5, 'field_cities' => 5);
      $advanced_fields = array('field_address' => 3, 'field_cover_picture' => 3);
      break;

    case 1:
      // Doctor.
      $basic_fields = array('field_full_name' => 5, 'field_photo' => 5, 'field_mobile_number' => 5, 'field_birthdate' => 5, 'field_cities' => 5, 'field_user_description' => 5);
      $advanced_fields = array('field_address' => 3, 'field_current_address' => 3, 'field_social_address' => 3, 'field_cover_picture' => 3);
      break;
  }

  // Calculate percentage.
  $user_point = 0;
  $max_point = 0;
  foreach ($basic_fields as $field_name => $field_point) {
    if (isset($account->{$field_name}) and is_array($account->{$field_name}) and !empty($account->{$field_name}[LANGUAGE_NONE])) {
      $user_point += $field_point;
    }

    $max_point += $field_point;
  }

  foreach ($advanced_fields as $field_name => $field_point) {
    if (isset($account->profile->{$field_name}) and is_array($account->profile->{$field_name}) and !empty($account->profile->{$field_name}[LANGUAGE_NONE])) {
      $user_point += $field_point;
    }

    $max_point += $field_point;
  }

  return round($user_point / $max_point, 2) * 100;
}

/**
 * Create a ubercart order.
 */
function custom_ubercart_order_create($order_status, $payment_method, $product_nids, $customer, $billing, $delivery, $other) {
  // Ubercart module must be enabled.
  if (!module_exists('uc_order')) {return false;}
  
  global $user;
  $items = array();

  foreach ($product_nids as $nid => $value) {
    $item = node_load($nid);
    $item->qty = $value['product_qty'];

    $items[] = $item;
  }
  
  // Use admin account if user not logged in.
  //$account = !$user->uid ? user_load(1) : $user;

  $order = uc_order_new($user->uid);
  $order->order_status = $order_status;
  $order->products = $items;
  $order->payment_method = $payment_method;

  if (!isset($order->primary_email)) {
    $order->primary_email = $other['email'] != '' ? $other['email'] : $user->mail;
  }
  
  $order->field_invoice[LANGUAGE_NONE][0]['value'] = $other['vat'];

  if (!empty($customer)) {
    foreach ($customer as $field_name => $field_value) {
      $order->{$field_name} = $field_value;
    }
  }

  if (!empty($billing)) {
    foreach ($billing as $field_name => $field_value) {
      $order->{$field_name} = $field_value;
    }
  }

  if (!empty($delivery)) {
    foreach ($delivery as $field_name => $field_value) {
      $order->{$field_name} = $field_value;
    }
  }

  //if (!$user->uid) {
    //$order->data['new_user']['pass'] = $form_state['values']['password'];
  //}

  // Create ubercart order.
  uc_order_save($order);
  
  // Save the customer note.
  if ($order->order_id and $other['note'] != '') {
    uc_order_comment_save($order->order_id, $user->uid, $other['note'], 'order');
  }

  return $order;
}

/**
 * Create a new comment.
 */
function custom_comment_create($nid, $parent_id, $subject, $comment_body, $comment_author, $comment_status) {
  // Module comment must be enabled.
  if (!module_exists('comment')) {return 0;}
  
  global $user;

  $comment = new stdClass();
	$comment->nid = $nid;
	$comment->cid = 0; // leave it as is
	$comment->pid = $parent_cid; // parent comment id, 0 if none
	$comment->uid = $user->uid;

	if ($user->mail) {
	  $comment->mail = $user->mail;
	}

	$comment->name = $comment_author;
	$comment->is_anonymous = $user->uid > 0 ? 0 : 1;
	$comment->homepage = '';

	$comment->status = $comment_status;
	$comment->language = LANGUAGE_NONE;
	$comment->subject = $subject;
	$comment->comment_body[LANGUAGE_NONE][0]['value'] = $comment_body;
	$comment->comment_body[LANGUAGE_NONE][0]['format'] = 'plain_text';

  comment_submit($comment);
  comment_save($comment);

  return $comment->cid;
}

/**
 * Convert coupon code to user_point.
 */
function custom_account_coupon_to_userpoints($uid, $code) {
  $account = user_load($uid);
  if (!$account) {
    return array('error' => true, 'message' => 'Tài khoản thành viên không tồn tại.');
  }
  
  // Module uc_coupon must be enabled.
  if (!module_exists('uc_coupon') or !module_exists('userpoints')) {
    return array('error' => true, 'message' => 'Không tìm thấy mô-đun coupon và userpoints tương ứng.');
  }
  
  // Check valid coupon.
  $coupon = uc_coupon_validate($code, false, $account);
  if (!$coupon or !$coupon->status) {
    return array('error' => true, 'message' => 'Mã tích lũy không hợp lệ hoặc đã được sử dụng rồi.');
  }
  
  // Check in bulk custom list.
  $coupon_bulk_used = variable_get('coupon_bulk_used', array());

  if (in_array($coupon->code, $coupon_bulk_used)) {
    return array('error' => true, 'message' => 'Mã tích lũy đã được sử dụng rồi.');
  }

  // Change coupon status.
  $coupon_bulk_used[] = $coupon->code;
  variable_set('coupon_bulk_used', $coupon_bulk_used);
  
  $point = (int) $coupon->value;
  if ($point) {
    return custom_userpoints_add_points($uid, $point);
  }

  return array('error' => true, 'message' => 'Có lỗi trong quá trình xử lý.');
}

/**
 * Change the user pass after user has done the verification.
 */
function custom_pass_code_change($uid, $confirmed_code, $new_pass) {
  $account = user_load($uid);
  if (!$account) {
    return array('is_error' => true, 'message' => 'Tài khoản người dùng không tồn tại.');
  }

  // Verify.
  $stored_code = $account->field_otp_code[LANGUAGE_NONE][0]['value'];
  $stored_timestamp = $account->field_otp_stored_timestamp[LANGUAGE_NONE][0]['value'];
  
  $expired_time = 30 * 60; // 30 minutes -> to seconds.
  $time_gap = time() - $stored_timestamp;
  if ($time_gap > $expired_time) {
    return array('is_error' => true, 'message' => 'Thời gian chờ xác nhận và đổi mật khẩu đã quá hạn. Xin vui lòng thực hiện lại từ đầu.');
  }
  
  if ($stored_code != $confirmed_code) {
    return array('is_error' => true, 'message' => 'Lỗi không thể tiếp tục. Xin vui lòng thực hiện lại từ đầu.');
  }
  
  // Seems everything look good. Change the pass.
  $edit = array();
  $edit['pass'] = $new_pass;
  $edit['field_otp_code'][LANGUAGE_NONE][0]['value'] = '';
  $edit['field_otp_stored_timestamp'][LANGUAGE_NONE][0]['value'] = 0;
  
  user_save($account, $edit);
  
  return array('is_error' => false, 'message' => 'Đổi mật khẩu thành công!');
}

/**
 * Verify the pass code.
 */
function custom_pass_code_verify($uid, $code, $is_activation = 0) {
  // Load the user account.
  $account = user_load($uid);
  
  if (!$account) {
    return array('is_error' => true, 'message' => 'Thông tin người dùng không tồn tại.');
  }
  
  if (empty($account->field_otp_code[LANGUAGE_NONE]) or empty($account->field_otp_stored_timestamp[LANGUAGE_NONE])) {
    return array('is_error' => true, 'message' => 'Mã xác nhận không tồn tại.');
  }
  
  // Verify.
  $stored_code = $account->field_otp_code[LANGUAGE_NONE][0]['value'];
  $stored_timestamp = $account->field_otp_stored_timestamp[LANGUAGE_NONE][0]['value'];
  
  $expired_time = 30 * 60; // 30 minutes -> to seconds.
  $time_gap = time() - $stored_timestamp;
  if ($time_gap > $expired_time) {
    return array('is_error' => true, 'message' => 'Mã xác nhận đã quá hạn và không còn giá trị. Vui lòng thử lại để nhận mã khác.');
  }
  
  if ($stored_code != $code) {
    return array('is_error' => true, 'message' => 'Mã xác nhận không đúng. Vui lòng kiểm tra và thử lại.');
  }
  
  // Verify successfully. Give new code signal and timestamp.
  $account->field_otp_code[LANGUAGE_NONE][0]['value'] = custom_user_password(10);
  $account->field_otp_stored_timestamp[LANGUAGE_NONE][0]['value'] = time();
  
  // Activate this account if it is.
  if ($is_activation) {
    $account->status = 1;
    user_save($account);
    return array('is_error' => false, 'message' => 'Kích hoạt thành công.', 'uid' => $account->uid);
  }
  else{
    user_save($account);
    return array('is_error' => false, 'message' => 'Xác nhận thành công.', 'uid' => $account->uid, 'confirmed_code' => $account->field_otp_code[LANGUAGE_NONE][0]['value']);
  }
}

/**
 * Generate a pass code by username / mobile no. then send to user via the SMS.
 */
function custom_pass_code_generate($name) {
  // We need to mobile number to send SMS.
  // $name can be either e-mail or mobile phone number so detect it.
  $name = strtolower($name);
  $name_type = '';
  
  if (filter_var($name, FILTER_VALIDATE_EMAIL)) {
    $name_type = 'email';

    // Get the mobile no.
    $uid = db_query("SELECT uid FROM {users} WHERE mail=:mail", array(':mail' => $name))->fetchColumn();
    if ($uid) {
      $account = user_load($uid);
    }
  }
  else {
    // Seems this name is a mobile number, check.
    if (module_exists('mobilevn') and mobilevn_is_valid_mobile_number($name)) {
      $name_type = 'mobile';
      
      // Get the user account by this mobile number.
      $result = views_get_view_result('drupalapp_user_functions', 'block_1', $name);
      if (!empty($result)) {
        $account = user_load($result[0]->uid);
      }
    }
    else{
      watchdog('custom', 'You may need to enable mobilevn module for SMS feature.');
    }
  }
  
  // Check error.
  if (!$account) {
    $name_type_text = $name_type == 'email' ? 'Địa chỉ e-mail' : 'Số điện thoại';
    return array('is_error' => true, 'message' => $name_type_text . ' không tồn tại.');
  }
  
  // Generate code then store.
  if ($account) {
    $pass_code = custom_user_password(6, '0123456789');
    $account->field_otp_code[LANGUAGE_NONE][0]['value'] = $pass_code;
    $account->field_otp_stored_timestamp[LANGUAGE_NONE][0]['value'] = time();
    user_save($account);
  }
  
  // Process to send E-mail.
  if ($name_type == 'email') {
    drupal_mail('custom', 'custom_user_password_request_confirm', $account->mail, language_default(), array('account' => $account), variable_get('site_mail', 'giaidieu1999@gmail.com'));
    return array('is_error' => false, 'message' => 'Đã gửi mã xác nhận vào hộp thư của bạn.', 'uid' => $account->uid, 'type' => 'email');
  }
  else{
    // Process to send SMS.
    if (module_exists('esms')) {
      $site_name = variable_get('site_name', 'TASSCARE');
      $message = variable_get('esms_user_password', '%CODE%');
    
      $tokens = array('/\%SITE_NAME\%/', '/\%CODE\%/');
      $replacements = array($site_name, $pass_code);
      $message = preg_replace($tokens, $replacements, $message);
    
      $result = esms_send_message($message, $name, 2); // 4=verify; 6=notify.
      if ($result['CodeResult'] == 100) {
        return array('is_error' => false, 'message' => 'Đã gửi tin nhắn thành công tới số điện thoại di động của bạn.', 'uid' => $account->uid, 'type' => 'mobile');
      }
      else{
        return array('is_error' => true, 'message' => 'Có lỗi phía SMS Gateway trong quá trình gửi tin nhắn. Vui lòng liên hệ tới người quản lý.');
      }
    }
    else{
      watchdog('custom', 'You may need to enable esms module for SMS feature.');
      return array('is_error' => true, 'message' => 'Chưa thiết lập dịch vụ gửi tin nhắn SMS. Vui lòng liên hệ tới người quản lý.');
    }
  }
}

/**
 * Geocode update.
 */
function custom_geocode_update($uid, $nid, $lat, $lon) {
  $node = node_load($nid);
  if (!$node) {return false;}

  $node->field_geocode[LANGUAGE_NONE][0] = array(
		'geom' => "POINT ($lon $lat)",
		'geo_type' => 'point',
		'lat' => $lat . "000000",
		'lon' => $lon . "000000",
		'left' => $lon . "000000",
		'top' => $lat . "000000",
		'right' => $lon . "000000",
		'bottom' => $lat . "000000"
  );

  node_save($node);
  return true;
}

function custom_build_product_filter_form() {
  dsm("Test");
  return "test";
  return theme('custom__product_filter_form');
}

function custom_best_seller($type = '') {
  $out = '<div class="view slide-pager row"><div class="view-content">';
  if ($result = views_get_view_result('order', 'block', $type)) {
    foreach ($result as $row) {
      $rnode = node_load($row->uc_order_products_uc_orders__node_nid);
      $rnode_view = node_view($rnode, 'teaser');
      $out .= '<div class="view-rows col-sm-4 col-xs-12">' . render($rnode_view) . '</div>';
    }
  }
  $out .= '</div></div>';
  // dsm($result);

  return $out;
}

function custom_dismiss_save() {
  if (!empty($_POST['suggestions_1510'])) {
    $_SESSION['suggestions_1510'] = true;
    return drupal_json_output($_SESSION['suggestions_1510']);
  }
}