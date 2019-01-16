<?php /* Product service addon popup template. */
// dsm($product);
// dsm($product_addons);
?>
<div id="custom-uc-product-add-on-wrapper">
  <div class="main-product">
    <h2>Sản Phẩm / Dịch Vụ Chính</h2>
    <div class="form-item">
      <input type="checkbox" value="<?php echo $product->nid; ?>" name="product_main" qty="1" checked="checked" disabled="disabled" />
      <span><?php echo $product->title; ?> - Giá: <?php echo uc_currency_format($product->price); ?> - SL: <span class="qty"></span></span>
    </div>
  </div>

  <?php if ($product->type == 'service'): ?>
    <div class="lich-hen">
      <div class="form-item">
        <span class="add-calendar" title="Thêm lịch hen"><i class="fa fa-calendar" aria-hidden="true"></i> Vui lòng chọn ngày Bạn muốn sử dụng dịch vụ (Không bắt buộc):</span>
        <input id="edit-lich-hen" type="text" name="lich_hen" min="<?php echo date('d-m-Y'); ?>" class="date form-control form-text form-date" placeholder="Ngày-Tháng-Năm" style="display: none;">
      </div>
    </div>
  <?php endif; ?>

  <?php if (!empty($product_addons)): ?>
  <div class="addon-products">
    <h2>Sản Phẩm Mua Kèm</h2>
    <div class="form-item">
      <ul class="items-list">
        <?php foreach ($product_addons as $row): ?>
        <li>
          <input type="checkbox" class="item_addons" value="<?php echo $row['cid']; ?>" name="item_addons[]" />
          <a href="/<?php echo drupal_get_path_alias('node/' . $row['nid']); ?>" target="_blank">
            <?php if (!empty($row['image'])): ?>
              <span class="image"><img src="<?php echo $row['image']; ?>"></span>
            <?php endif; ?>
            <div class="inline">
              <span class="title"><?php echo $row['title']; ?></span>
              <div class="prices">
                <span class="original-price"> - Giá Gốc: <strong><del><?php echo $row['original_price']; ?></del></strong></span>
                <span class="percent"> - Khuyến Mại: <strong><?php echo $row['promotion_rate']; ?>%</strong></span>
                <span class="promotion-price"> - Giá Khuyến Mại Khi Mua Kèm: <strong><?php echo $row['sell_price']; ?></strong></span>
              </div>
            </div>
          </a>
        </li>
        <?php endforeach; ?>
      </ul>
    </div>
  </div>
  <?php endif; ?>

  <?php if (!empty($service_addons)): ?>
  <div class="addon-services">
    <h2>Dịch Vụ Mua Kèm</h2>
    <div class="form-item">
      <ul class="items-list">
        <?php foreach ($service_addons as $row): ?>
        <li>
          <input type="checkbox" class="item_addons" value="<?php echo $row['cid']; ?>" name="item_addons[]" />
          <a href="/<?php echo drupal_get_path_alias('node/' . $row['nid']); ?>" target="_blank">
            <?php if (!empty($row['image'])): ?>
              <span class="image"><img src="<?php echo $row['image']; ?>"></span>
            <?php endif; ?>
            <div class="inline">
              <span class="title"><?php echo $row['title']; ?></span>
              <div class="prices">
                <span class="original-price">Giá Gốc: <strong><del><?php echo $row['original_price']; ?></del></strong></span>
                <span class="percent"> - Khuyến Mại: <strong><?php echo $row['promotion_rate']; ?>%</strong></span>
                <span class="promotion-price"> - Giá Khuyến Mại Khi Mua Kèm: <strong><?php echo $row['sell_price']; ?></strong></span>
                <!--<span class="qty">SL: <input name="item_addon_qty[]" value="1" type="number" size="4" /></span>-->
              </div>
            </div>
          </a>
        </li>
        <?php endforeach; ?>
      </ul>
    </div>
  </div>
  <?php endif; ?>
</div>