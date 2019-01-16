<?php

/**
 * Override or insert variables into the page template.
 */
function giaidieu_preprocess_page(&$vars) {
  $vars['vocabulary_class'] = '';
  if (arg(0) == 'taxonomy' && arg(1) == 'term' && is_numeric(arg(2))) {
    $cTerm = taxonomy_term_load(arg(2));
    $vars['vocabulary_class'] = 'vocabulary-name-' . $cTerm->vocabulary_machine_name;
  }
  if (!isset($vars['user']->roles[3]) && !isset($vars['user']->roles[6]) && $vars['user']->uid != 1) {
    $vars['tabs'] = '';
  }
  $theme_path = drupal_get_path('theme', 'giaidieu');
  $css_path = $theme_path . '/css';
  //Add hu_style.css
  drupal_add_css($css_path . '/hu_style.css');
  //Add oa_style.css
  drupal_add_css($css_path . '/oa_style.css');
  //Add ch_style.css
  drupal_add_css($css_path . '/ch_style.css');
  //Add th_style.css
  drupal_add_css($css_path . '/th_style.css');
  //Add dt_style.css
  drupal_add_css($css_path . '/dt_style.css');

  if (!empty($vars['node'])) {
    $node = $vars['node'];
    if ($vars['node']->type == 'video') {
      drupal_add_html_head(array(
        '#tag' => 'meta',
        '#attributes' => array(
          'property' => 'og:url',
          'content' => url('node/' . $vars['node']->nid, array('absolute' => true)),
        ),
      ), 'fb_og_url');

      drupal_add_html_head(array(
        '#tag' => 'meta',
        '#attributes' => array(
          'property' => 'og:image',
          'content' => custom_video_thumbnail_get($vars['node'], 'img_video'),
        ),
      ), 'fb_og_image');
    }

    if ($vars['node']->type == 'service') {
      drupal_add_library('system', 'ui.datepicker');
    }
  }
  // Dismiss form 1510
  // if (!empty($_SESSION['suggestions_1510'])) unset($_SESSION['suggestions_1510']);
  $vars['show_suggestions'] = false;
  if ($vars['front_page'] && isset($vars['user']->roles[4])) {
    $vars['show_suggestions'] = empty($_SESSION['suggestions_1510']);
  }
  /*if ($vars['user']->uid == 1) {
    $vars['show_suggestions'] = true;
  }*/
}

function giaidieu_css_alter(&$css) {
  unset($css[drupal_get_path('module','uc_product').'/uc_product.css']);
}

function giaidieu_preprocess_maintenance_page(&$variables) {
  $theme_path = drupal_get_path('theme', 'giaidieu');
  $css_path = $theme_path . '/css';
  //Add hu_style.css
  drupal_add_css($css_path . '/hu_style.css');
  //Add oa_style.css
  drupal_add_css($css_path . '/oa_style.css');
  //Add ch_style.css
  drupal_add_css($css_path . '/ch_style.css');
  //Add th_style.css
  drupal_add_css($css_path . '/th_style.css');
  //Add dt_style.css
  drupal_add_css($css_path . '/dt_style.css');
}

//time before
function humanTiming ($time){
  global $language;

  $time = time() - $time; // to get the time since that moment
  $time = ($time<1)? 1 : $time;
  $tokens = array (
      31536000 => 'year',
      2592000 => 'month',
      604800 => 'week',
      86400 => 'day',
      3600 => 'hour',
      60 => 'minute',
      1 => 'second'
  );

  foreach ($tokens as $unit => $text) {
      if ($time < $unit) continue;
      $numberOfUnits = floor($time / $unit);
      return $numberOfUnits.' '.t($text.(($numberOfUnits>1)?'s':''));
  }
}


/* get youtube thumbnail
 * $vid : youtube video id
 * return video thumb url
 */
function youtube_thumb($vid){
  $public_path = file_create_url('public://youtube/' .$vid. '.jpg');
  return $public_path;
}

/* get video duration
 * $vid : youtube video id 
 * $api : youtube api key
 * return duration
 */
function youtube_duration($vid){
  $api = 'AIzaSyAHrVfWT94kcOIM_xgGW_SV5FCO1LuApSU';
  $data = file_get_contents("https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=$vid&key=$api");
  $data_json=json_decode($data, true);
  if(!empty($data_json['items'])) {
    $time = $data_json['items'][0]['contentDetails']['duration'];

    // convert youtube duration to h:m:s
    $date = new DateTime('2000-01-01');
    $date->add(new DateInterval($time));
    return $date->format('i:s');
  } else return '00:00';
}

