<?php
// $Id: uc_onepay.pages.inc by Thiết kế web Giai Điệu $

/**
 * Handles a complete Website Payments Standard sale.
 */
function uc_nganluong_complete($order) {
  if (!isset($_SESSION['cart_order']) || intval($_SESSION['cart_order']) != $order->order_id) {
    drupal_set_message(t('Thank you for your order! NganLuong will notify us once your payment has been processed.'));
    drupal_goto('cart');
  }

  // This lets us know it's a legitimate access of the complete page.
  $_SESSION['uc_checkout'][$_SESSION['cart_order']]['do_complete'] = TRUE;
  drupal_goto('cart/checkout/complete');
}
