<?php /* View order template */
global $user;
// Make address.
$delivery_address = [];
if ($order->billing_street1 != '') {
  $delivery_address[] = $order->billing_street1;
}
if ($order->billing_city != '') {
  $delivery_address[] = $order->billing_city;
}
/*if ($order->delivery_street1 != '') {
  $delivery_address[] = $order->delivery_street1;
}
if ($order->delivery_city != '') {
  $delivery_address[] = $order->delivery_city;
}*/
// Make payment method.
$payment_method = [
  'bank_transfer' => 'Chuyển khoản ngân hàng',
  'cod' => 'Thanh toán tiền mặt khi nhận hàng',
  'nganluong_debitcard' => 'Thanh toán bằng thẻ Visa/Mastercard',
  'nganluong_ibanking' => 'Thanh toán qua iBanking',
  'nganluong_bankcard' => 'Thanh toán bằng thẻ ngân hàng nội địa',
];
// dsm($order);
$coupon = uc_coupon_get_order_coupons($order);
// dsm($coupon);
// Get order comment.
// uc_order_comments_load

?>
<div class="profile profile-web">
  <h2 class="block-title">Xem đơn hàng <?php echo '#' . $order->order_id; ?></h2>
  <div id="custom-order-form-wrapper" class="custom-form-wrapper">
    <table class="personal-info-table">
      <tr class="heading">
        <td>&nbsp;</td>
        <td class="capitalize">Thông tin đơn hàng</td>
      </tr>
      <tr>
        <td class="capitalize">Mã số đơn hàng</td>
        <td><?php echo '#' . $order->order_id; ?></td>
      </tr>
      <tr>
        <td class="capitalize">Ngày tạo</td>
        <td><?php echo format_date($order->created, 'custom', 'd-m-Y'); ?></td>
      </tr>
      <tr>
        <td class="capitalize">Trạng thái</td>
        <td>
          <?php if (!empty($user->roles[5]) && $user->uid != $order->uid): ?>
            <?php if ($order->order_status == 'canceled_by_customer'): ?>
              <select class="order-status-value" readonly="" disabled>
                <option value="canceled_by_customer" selected="selected">Đơn Hàng Đã Bị Huỷ Bởi Khách Hàng</option>
              </select>
              <!-- Gửi thông báo cho người mua hàng. Nếu trên app => push notification -->
              <input type="button" value="Cập nhật" name="order_status_update" readonly disabled
                     class="btn btn-success form-submit"/>
            <?php else: ?>
              <select class="order-status-value" name="order_status" current_status="<?php echo $order->order_status; ?>">
                <option value="canceled"<?php echo $order->order_status == 'canceled' ? 'selected="selected"' : ''; ?>>Đơn Hàng Đã Bị Hủy Bởi Người Bán</option>
                <option value="pending"<?php echo $order->order_status == 'pending' ? 'selected="selected"' : ''; ?>>Đơn Hàng Đang Chờ Xử Lý</option>
                <option value="processing"<?php echo $order->order_status == 'processing' ? 'selected="selected"' : ''; ?>>Đơn Hàng Đang Được Xử Lý</option>
                <option value="completed"<?php echo $order->order_status == 'completed' ? 'selected="selected"' : ''; ?>>Đơn Hàng Đã Hoàn Thành</option>
              </select>
              <!-- Gửi thông báo cho người mua hàng. Nếu trên app => push notification -->
              <input type="button" value="Cập nhật" name="order_status_update"
                     onclick="custom_uc_order_update_status(<?php echo $order->order_id; ?>, this);"
                     class="btn btn-success form-submit"/>
              <div class="order-status-comment"></div>
            <?php endif; ?>
          <?php else:
            $stt = [
              'canceled' => "Đơn Hàng Đã Bị Hủy Bởi Người Bán",
              'pending' => "Đơn Hàng Đang Chờ Xử Lý",
              'processing' => "Đơn Hàng Đang Được Xử Lý",
              'completed' => "Đơn Hàng Đã Hoàn Thành",
              'canceled_by_customer' => "Đơn Hàng Đã Bị Huỷ",
            ];
            ?>
            <div class="order-status-comment">
              <span class="customer-order-status"><?php echo $stt[$order->order_status]; ?></span>
              <?php if ($order->order_status == 'pending'): ?>
                <input type="button" value="Huỷ Đơn" name="order_status_update"
                       onclick="custom_uc_order_customer_canceled_by_customer(<?php echo $order->order_id; ?>, this);"
                       class="btn btn-danger form-submit" style="margin-left: 15px;"/>
              <?php endif; ?>
            </div>
          <?php endif; ?>
        </td>
      </tr>
      <tr>
        <td class="capitalize">Sản phẩm trong đơn hàng</td>
        <td>
          <table class="user-order-view-products-list">
            <thead>
            <tr class="capitalize">
              <th class="stt">STT</th>
              <th class="image">Ảnh</th>
              <th class="title">Tên SP / Mã hàng</th>
              <th class="price">Đơn giá</th>
              <th class="qty">SL</th>
              <th class="total">Tổng giá</th>
            </tr>
            </thead>
            <tbody>
            <?php $index = 1; ?>
            <?php foreach ($order->products as $row): ?>
              <?php $product_node = node_load($row->nid); ?>
              <tr>
                <td class="stt"><?php echo $index; ?></td>
                <td class="image"><?php
                  if (!empty($product_node->uc_product_image)) {
                    echo l('<img src="' . image_style_url('thumbnail', $product_node->uc_product_image[LANGUAGE_NONE][0]['uri']) . '" />', 'node/' . $product_node->nid, ['html' => TRUE]);
                  } ?></td>
                <td class="title"><?php echo l($row->title, 'node/' . $row->nid); ?>
                  <br/>SKU: <?php echo $row->model; ?></td>
                <td class="price"><?php echo uc_currency_format($row->price); ?></td>
                <td class="qty">x <?php echo $row->qty; ?></td>
                <td class="total"><?php echo uc_currency_format($row->price * $row->qty); ?></td>
              </tr>
              <?php $index++; ?>
            <?php endforeach; ?>
            <!-- Order -->
            <tr>
              <td class="order-total-text capitalize" colspan="5">Tổng giá trị đơn hàng:</td>
              <td class="total order-total"><?php echo uc_currency_format($order->line_items[0]['amount']); ?></td>
            </tr>
            <?php if (!empty($coupon)): ?>
              <tr>
                <td class="order-total-text capitalize" colspan="5">Khuyến Mại: <?php echo $coupon[0]->title;
                  if ($coupon[0]->type == 'percentage') {
                    echo ' (' . round($coupon[0]->value) . '%)';
                  } ?>:
                </td>
                <td class="total order-total"><?php echo uc_currency_format($coupon[0]->amount); ?></td>
              </tr>
            <?php endif; ?>
            <tr>
              <td class="order-total-text capitalize" colspan="5">Tổng giá trị đơn hàng sau Khuyến Mại:</td>
              <td class="total order-total"><?php echo uc_currency_format($order->order_total); ?></td>
            </tr>
            </tbody>
          </table>
          <?php if (!empty($order->field_lich_hen)): ?>
            <table class="lich-hen">
              <tr class="capitalize">
                <td><strong>Ngày Sử Dụng Dịch Vụ</strong></td>
                <td><?php echo format_date(strtotime($order->field_lich_hen['und'][0]['value']), 'd_m_y', 'd-m-Y', $order->field_lich_hen['und'][0]['timezone']); ?></td>
              </tr>
            </table>
          <?php endif; ?>
        </td>
      </tr>
      <tr class="heading">
        <td>&nbsp;</td>
        <td>Thông tin thanh toán</td>
      </tr>
      <?php if (!empty($payment_method[$order->payment_method])): ?>
        <tr>
          <td class="capitalize">Phương thức thanh toán</td>
          <td><?php echo $payment_method[$order->payment_method]; ?></td>
        </tr>
      <?php endif; ?>
      <tr class="heading">
        <td>&nbsp;</td>
        <td>Thông tin khách hàng / giao hàng</td>
      </tr>
      <tr>
        <td class="capitalize">Tên khách hàng</td>
        <td><?php echo $order->billing_first_name; ?></td>
      </tr>
      <tr>
        <td class="capitalize">E-mail</td>
        <td><?php echo $order->primary_email ? $order->primary_email : 'N/A'; ?></td>
      </tr>
      <tr>
        <td class="capitalize">Số điện thoại</td>
        <td><?php echo $order->billing_phone ? $order->billing_phone : 'N/A'; ?></td>
      </tr>
      <tr>
        <td class="capitalize">Địa chỉ giao hàng</td>
        <td><?php echo join(', ', $delivery_address); ?></td>
      </tr>
    </table>
  </div>
</div>
<div class="profile profile-app">
  <div class="order-title">
    Thông tin đơn hàng
  </div>
  <table class="personal-info-table">
    <tbody>
    <tr>
      <td class="capitalize">Mã số đơn hàng</td>
      <td><?php echo '#' . $order->order_id; ?></td>
    </tr>
    <tr>
      <td class="capitalize">Ngày tạo</td>
      <td><?php echo format_date($order->created, 'custom', 'd-m-Y'); ?></td>
    </tr>

    <tr>
      <td class="capitalize">Trạng thái</td>
      <td>
        <?php if (!empty($user->roles[5]) && $user->uid != $order->uid): ?>
          <?php if ($order->order_status == 'canceled_by_customer'): ?>
            <select class="order-status-value" readonly="" disabled>
              <option value="canceled_by_customer" selected="selected">Đơn Hàng Đã Bị Huỷ Bởi Khách Hàng</option>
            </select>
            <!-- Gửi thông báo cho người mua hàng. Nếu trên app => push notification -->
            <input type="button" value="Cập nhật" name="order_status_update" readonly disabled
                   class="btn btn-success form-submit"/>
          <?php else: ?>
            <select class="order-status-value" name="order_status" current_status="<?php echo $order->order_status; ?>">
              <option value="canceled"<?php echo $order->order_status == 'canceled' ? 'selected="selected"' : ''; ?>>Đơn Hàng Đã Bị Hủy Bởi Người Bán</option>
              <option value="pending"<?php echo $order->order_status == 'pending' ? 'selected="selected"' : ''; ?>>Đơn Hàng Đang Chờ Xử Lý</option>
              <option value="processing"<?php echo $order->order_status == 'processing' ? 'selected="selected"' : ''; ?>>Đơn Hàng Đang Được Xử Lý</option>
              <option value="completed"<?php echo $order->order_status == 'completed' ? 'selected="selected"' : ''; ?>>Đơn Hàng Đã Hoàn Thành</option>
            </select>
            <!-- Gửi thông báo cho người mua hàng. Nếu trên app => push notification -->
            <input type="button" value="Cập nhật" name="order_status_update"
                   onclick="custom_uc_order_update_status(<?php echo $order->order_id; ?>, this);"
                   class="btn btn-success form-submit"/>
            <div class="order-status-comment"></div>
          <?php endif; ?>
        <?php else:
          $stt = [
            'canceled' => "Đơn Hàng Đã Bị Hủy Bởi Người Bán",
            'pending' => "Đơn Hàng Đang Chờ Xử Lý",
            'processing' => "Đơn Hàng Đang Được Xử Lý",
            'completed' => "Đơn Hàng Đã Hoàn Thành",
            'canceled_by_customer' => "Đơn Hàng Đã Bị Huỷ",
          ];
          ?>
          <div class="order-status-comment">
            <span class="customer-order-status"><?php echo $stt[$order->order_status]; ?></span>
            <?php if ($order->order_status == 'pending'): ?>
              <input type="button" value="Huỷ Đơn" name="order_status_update"
                     onclick="custom_uc_order_customer_canceled_by_customer(<?php echo $order->order_id; ?>, this);"
                     class="btn btn-danger form-submit" style="margin-left: 15px;"/>
            <?php endif; ?>
          </div>
        <?php endif; ?>
      </td>
    </tr>
    </tbody>
  </table>
  <div class="order-title">
    Thông tin thanh toán
  </div>
  <?php if (!empty($payment_method[$order->payment_method])): ?>
    <table class="personal-info-table">
      <tbody>
      <tr>
        <td class="capitalize">Phương thức thanh toán</td>
        <td><?php echo $payment_method[$order->payment_method]; ?></td>
      </tr>
      </tbody>
    </table>
  <?php endif; ?>
  <div class="order-title">
    Sản phẩm trong đơn hàng
  </div>
  <div class="block-product-order">
    <?php $index = 1; ?>
    <?php foreach ($order->products as $row): ?>
      <?php $product_node = node_load($row->nid); ?>
      <div class="product-node">
        <div class="stt"><?php echo $index; ?></div>
        <div class="image"><?php
          if (!empty($product_node->uc_product_image)) {
            echo l('<img src="' . image_style_url('thumbnail', $product_node->uc_product_image[LANGUAGE_NONE][0]['uri']) . '" />', 'node/' . $product_node->nid, ['html' => TRUE]);
          } ?></div>
        <div class="node-info">
          <div class="title"><?php echo l($row->title, 'node/' . $row->nid); ?>
            <p>SKU: <?php echo $row->model; ?></p></div>
          <div class="price"><?php echo uc_currency_format($row->price); ?>
            <span class="qty">x <?php echo $row->qty; ?></span>
            <span class="total"> = <?php echo uc_currency_format($row->price * $row->qty); ?></span>
          </div>


        </div>
      </div>
      <?php $index++; ?>
    <?php endforeach; ?>
    <!-- Order -->
  </div>
  <table class="personal-info-table block-total-price">
    <tbody>
    <tr>
      <td class="order-total-text capitalize" colspan="5">Tổng giá trị đơn hàng:</td>
      <td class="total order-total"><?php echo uc_currency_format($order->line_items[0]['amount']); ?></td>
    </tr>
    <?php if (!empty($coupon)): ?>
      <tr>
        <td class="order-total-text capitalize" colspan="5">Khuyến Mại: <?php echo $coupon[0]->title;
          if ($coupon[0]->type == 'percentage') {
            echo ' (' . round($coupon[0]->value) . '%)';
          } ?>:
        </td>
        <td class="total order-total"><?php echo uc_currency_format($coupon[0]->amount); ?></td>
      </tr>
    <?php endif; ?>
    <tr>
      <td class="order-total-text capitalize" colspan="5">Tổng giá trị đơn hàng sau Khuyến Mại:</td>
      <td class="total order-total"><?php echo uc_currency_format($order->order_total); ?></td>
    </tr>
    </tbody>
  </table>
  <div class="order-title">
    Thông tin Khách hàng/Giao hàng
  </div>
  <table class="personal-info-table">
    <tbody>
    <tr>
      <td class="capitalize">Tên khách hàng</td>
      <td><?php echo $order->billing_first_name; ?></td>
    </tr>
    <tr>
      <td class="capitalize">E-mail</td>
      <td><?php echo $order->primary_email ? $order->primary_email : 'N/A'; ?></td>
    </tr>
    <tr>
      <td class="capitalize">Số điện thoại</td>
      <td><?php echo $order->billing_phone ? $order->billing_phone : 'N/A'; ?></td>
    </tr>
    <tr>
      <td class="capitalize">Địa chỉ giao hàng</td>
      <td><?php echo join(', ', $delivery_address); ?></td>
    </tr>
    </tbody>
  </table>
</div>