<?php //if ($node->nid == 1912) dsm($content);
 ?>
<div id="node-<?php echo $node->nid; ?>" class="<?php echo $classes . ' ' . $view_mode; ?>" <?php echo $attributes ?>>

  <?php if ($view_mode == 'shop_manage'): ?>
  <div class="personal-product wow fadeInUp">
    <div class="product-image">
      <?php if (!empty($node->uc_product_image[LANGUAGE_NONE])): ?>
        <a href="<?php print $node_url; ?>"><img src="<?php print image_style_url('img_product', $node->uc_product_image[LANGUAGE_NONE][0]['uri']);?>" alt=""></a>
      <?php endif ;?>
    </div>
    <?php if ($node->list_price > $node->sell_price): ?>
    <div class="sale-percent">-<?php print round(($node->list_price - $node->sell_price) / $node->list_price * 100); ?>%</div>
    <?php endif; ?>
    <h5 class="product-name"><a href="<?php print $node_url; ?>"><?php print t(truncate_utf8($title, 50, FALSE, TRUE, 1));?> </a></h5>
    <!--<div class="description">&nbsp;</div> -->
    <?php if ($node->list_price > $node->sell_price): ?>
      <div class="initial-price"><?php print uc_currency_format($node->list_price, ' đ', ','); ?></div>
    <?php endif; ?>
    <div class="sale-price"><?php print ($node->sell_price > 0) ? uc_currency_format($node->sell_price, ' đ', ',') : t("Contact"); ?></div>
    <div class="product-ops"> 
      <ul> 
        <li onclick="custom_node_set_refresh(<?php echo $node->nid; ?>, this);" title="Làm mới lại thời gian cập nhật"><i class="fa fa-refresh" aria-hidden="true"></i> <span>Làm mới</span></li>
        <li onclick="custom_node_set_sticky(<?php echo $node->nid; ?>, this);" status="<?php echo $node->sticky; ?>" title="Thay đổi chế độ Sticky"><i class="fa fa-<?php echo $node->sticky == 1 ? 'star-o' : 'star'; ?>" aria-hidden="true"></i> <span><?php echo $node->sticky == 1 ? 'Bỏ nổi bật' : 'Nổi bật'; ?></span></li>
        <?php if ($node->status): ?>
          <li onclick="custom_node_set_published(<?php echo $node->nid; ?>, this);" status="<?php echo $node->status; ?>" title="Thay đổi trạng thái nội dung"><i class="fa fa-<?php echo $node->status == 1 ? 'lock' : 'unlock'; ?>" aria-hidden="true"></i> <span><?php echo $node->status == 1 ? 'Khóa' : 'Mở khóa'; ?></span></li>
        <?php else: ?>
          <li class="disabled" status="<?php echo $node->status; ?>" title="Liên hệ với quản trị viên để mở khóa nội dung"><i class="fa fa-<?php echo $node->status == 1 ? 'lock' : 'unlock'; ?>" aria-hidden="true"></i> <span>Mở khóa</span></li>
        <?php endif; ?>
        <li onclick="custom_node_set_edited(<?php echo $node->nid; ?>, 'product-combo');" title="Sửa nội dung này"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> <span>Sửa</span></li>
        <li onclick="custom_node_set_deleted(<?php echo $node->nid; ?>, this);" title="Xóa nội dung này"><i class="fa fa-trash" aria-hidden="true"></i> <span>Xóa</span></li>
      </ul>
    </div>
  </div>

  <?php elseif (!$page):
    $products = array();
    $prices = 0;
    if (!empty($content['field_product'])) {
      foreach ($content['field_product']['#items'] as $key => $item) {
        $path = drupal_get_path_alias('node/' . $item['entity']->nid);
        $products[] = '<li><a href="' . $path . '" target="_blank" class="combo-child-item"><i class="fa fa-check" aria-hidden="true"></i> '. $item['entity']->title .'</a></li>';
        $prices += $item['entity']->sell_price;
      }
    }
  ?>
  <div class="dh-product-combo">
      <div class="combo-top">
        <?php if ($title_prefix) echo render($title_prefix); ?>
        <div class="combo-name"><?php echo $node->title; ?></div>
        <?php if ($title_suffix) echo render($title_suffix); ?>
        <div class="combo-price">
          <?php echo render($content['sell_price']); ?>
          <span class="prices">Giá mua lẻ: <del><?php echo uc_currency_format($prices); ?></del></span>
        </div>
      </div>
      <div class="combo-body">
        <ul class="combo-list">
          <?php echo implode('', $products); ?>
        </ul>
        <?php
        hide($content['add_to_cart']['#form']['qty']);
        hide($content['add_to_cart']['#form']['actions']['wishlist']);
        $content['add_to_cart']['#form']['actions']['submit']['#value'] = t("Buy now");
        echo render($content['add_to_cart']); ?>
      </div>
    </div>

  <?php else:
    global $base_url;
    $products = array();
    $prices = 0;
    if (!empty($content['field_product'])) {
      foreach ($content['field_product']['#items'] as $key => $item) {
        $path = drupal_get_path_alias('node/' . $item['entity']->nid);
        $products[] = '<li><a href="' . $path . '" target="_blank" class="combo-child-item"><i class="fa fa-check" aria-hidden="true"></i> '. $item['entity']->title .'</a></li>';
        $prices += $item['entity']->sell_price;
      }
    }
    ?>
    <div class="right-sidebar">
      <div class="service-details-wrapper image-popup">
        <div class="row">
          <div class="col-md-6">
            <?php print render($content['uc_product_image'][0]);?>
          </div>
          <div class="col-md-6">
            <div class="service-info">
              <div class="info-top">
                <ul class="video-share-icon share-lazy-load" data-url="<?php print $base_url . $node_url; ?>"></ul>
              </div>
              <div class="title"><?php print $node->title;?></div>

              <div class="combo-price">
                <?php echo render($content['sell_price']); ?>
                <span class="prices">Giá Mua Lẻ: <del><?php echo uc_currency_format($prices); ?></del></span>
              </div>

              <div class="combo-body">
                <ul class="combo-list">
                  <?php echo implode('', $products); ?>
                </ul>
                <?php
                hide($content['add_to_cart']['#form']['qty']);
                hide($content['add_to_cart']['#form']['actions']['wishlist']);
                $content['add_to_cart']['#form']['actions']['submit']['#value'] = t("Buy now");
                ?>
              </div>

              <div class="addcart"><?php print render($content['add_to_cart']) ?></div>
            </div>
          </div>
        </div>
      </div>
    </div> <!-- / .right-sidebar -->
  <?php endif; ?>

</div>