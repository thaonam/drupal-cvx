<?php /* Video subscription popup template - Show after 10 seconds. */
?>
<div id="custom-video-subscription-wrapper">
  <?php if (isset($tasscare_settings['is_livestream']) and $tasscare_settings['is_livestream']): ?>
  <div class="alert alert-block alert-success messages status">Đây là một Live Streaming có tính phí. Vui lòng thanh toán để xem.</div>
  <?php else: ?>
  <div class="alert alert-block alert-success messages status">Bạn đã xem hết <?php echo $tasscare_settings['video_free_in_second']; ?> giây miễn phí. Vui lòng thanh toán để xem toàn bộ video này.</div>
  <?php endif; ?>
  <div class="description">Chọn một trong gói dịch vụ dưới đây:</div>
  <ul class="items-list">
    <li>
        <a href="/custom/video-subscription-add-to-cart/video_weekly/0">
            Bạc
            <span class="text-small">(truy cập không giới hạn video trong 1 tháng)</span>
        </a>
    </li>
    <li>
        <a href="/custom/video-subscription-add-to-cart/video_monthly/0">
            Vàng
            <span class="text-small">(truy cập không giới hạn video trong 3 tháng)</span>
        </a>
    </li>
    <li>
        <a href="/custom/video-subscription-add-to-cart/video_yearly/0">
            Kim Cương
            <span class="text-small">(truy cập không giới hạn video trong 6 tháng)</span>
        </a>
    </li>
  </ul>
  <?php if ($tasscare_settings['video_price'] > 0): ?>
  <div class="description">Hoặc</div>
  <a class="button" href="/custom/video-subscription-add-to-cart/video_buy/<?php echo $tasscare_settings['nid']; ?>">Mua Video trả phí một lần giá <?php echo uc_currency_format($tasscare_settings['video_price']); ?></a>
  <?php endif; ?>
</div>