<?php

/**
 * @file
 * Stub template file.
 */

//krumo($items);
if (!empty($items)) {
  $new_items = array();
  for ($i = 0; $i < count($items); $i = $i + 2) {
    if (!empty($items[$i+1])) {
      $new_items[] = array('row' => $items[$i]['row'] . $items[$i + 1]['row']);
    } else {
      $new_items[] = array('row' => $items[$i]['row']);
    }
  }
  $items = $new_items;
}
print theme('owlcarousel', array('items' => $items, 'settings' => $settings));