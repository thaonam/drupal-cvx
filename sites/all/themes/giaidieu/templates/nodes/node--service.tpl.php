<?php /* Template file for Service node. */
if ($page) {
  $intro_ncc = (!empty($node->user_description)) ? $node->user_description : '';
  /*$supplier_uid = !empty($node->field_user) ? $node->field_user['und'][0]['target_id'] : $node->uid;
  if ($intro_producrt_seller_uid = user_load($supplier_uid)) {
    $intro_ncc = !empty($intro_producrt_seller_uid->field_user_description) ? $intro_producrt_seller_uid->field_user_description['und'][0]['value'] : '';
  }*/
}
global $base_url;

/*if ($node->uid != 0) {
  $cuser = user_load($node->uid);
  $avatar = (!empty($cuser->field_photo)) ? image_style_url('crop_65x65', $cuser->field_photo['und'][0]['uri']) : '/' . $directory . '/images/anonymous.jpg';
}*/

?>
<div id="node-<?php print $node->nid; ?>"
     class="<?php print $classes; ?> clearfix <?php print $view_mode ?>" <?php print $attributes; ?> url="<?php echo $node_url; ?>">
  <?php if ($title_prefix) {
    print render($title_prefix);
  } ?>
  <?php if ($title_suffix) {
    print render($title_suffix);
  } ?>
  
  <?php if ($teaser): ?>
    <div class="ch_service wow fadeInUp">
      <div class="image">
        <?php if (!empty($node->uc_product_image)): ?>
          <a href="<?php print $node_url; ?>"><img
              src="<?php print image_style_url('crop_370x260', $node->uc_product_image['und'][0]['uri']); ?>"
              alt=""></a>
        <?php endif; ?>
        <?php
        hide($content['add_to_cart']['#form']['qty']);
        $content['add_to_cart']['#form']['actions']['wishlist']['#attributes']['class'][] = 'hide';
        $content['add_to_cart']['#form']['actions']['submit']['#suffix'] = '<a href="' . $node_url . '" class="node-add-to-cart btn btn-default read-more">' . t("Read more") . '</a>';
        print render($content['add_to_cart']); ?>
        <!--<a href="--><?php //print $node_url; ?><!--" class="btn btn-register">--><?php //print t("Read more"); ?><!--</a>-->
      </div>
      <div class="service-detail">
        <h5 class="title-service">
          <a href="<?php print $node_url; ?>"><?php print $node->title; ?></a>
        </h5>
        <!-- <div class="product-manu">
          <?php /*if (!empty($avatar)): ?>
            <a href="/<?php echo drupal_get_path_alias('user/' . $node->uid); ?>">
              <img src="<?php print $avatar; ?>">
            </a>
          <?php endif;*/ ?>
        </div> -->

        <div class="action">
          <div class="dh-wishlist">
            <?php
            $content['add_to_cart']['#form']['actions']['wishlist']['#attributes']['class'] = ['node-add-to-wishlist'];
            print render($content['add_to_cart']); ?>
            <!--            <a data-href="#--><?php //print $content['add_to_cart']['#form']['#id']; ?><!-- .node-add-to-wishlist" class="like js-action"><i class="fa fa-heart-o" aria-hidden="true"></i></a>-->

          </div>
          
          <?php //print render($content['sharethis']); ?>
          <div class="navbar-right share-icons dropdown">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
              <i class="fa fa-share-alt" aria-hidden="true"></i>
            </a>
            <div class="dropdown-menu" data-url="<?php echo $base_url . $node_url; ?>"></div>
          </div>
        </div>

      </div>
    </div>
  
  <?php elseif ($view_mode == 'search_index'): ?>
    <div class="service-search">
      <div class="image">
        <?php echo render($content['uc_product_image'][0]); ?>
      </div>
      <div class="service-body">
        <?php if ($title_prefix) {
          print render($title_prefix);
        } ?>
        <div class="title">
          <a href="<?php print $node_url ?>"><?php print $node->title; ?></a>
        </div>
        <?php if ($title_suffix) {
          print render($title_suffix);
        } ?>
        <div class="body"><?php echo render($content['body']); ?></div>
      </div>
    </div>
    <!-- /End search index -->
  <?php elseif ($view_mode == 'shop_manage'): ?>
    <div class="service personal-service personal-product wow fadeInUp">
      <div class="product-image">
        <?php if (!empty($node->uc_product_image)): ?>
          <a href="<?php print $node_url; ?>"><img
              src="<?php print image_style_url('img_service', $node->uc_product_image['und'][0]['uri']); ?>"
              alt=""></a>
        <?php endif; ?>
      </div>
      <h5 class="product-name">
        <a href="<?php print $node_url; ?>"><?php print $title; ?></a></h5>
      <div class="description">
        <?php if (!empty($node->field_intro_service[LANGUAGE_NONE])) {
          print truncate_utf8(strip_tags($node->field_intro_service['und'][0]['value']), 140) . ' [...]';
        } ?>
      </div>
      <div class="product-ops">
        <ul>
          <li onclick="custom_node_set_refresh(<?php echo $node->nid; ?>, this);" title="Làm mới lại thời gian cập nhật">
            <i class="fa fa-refresh" aria-hidden="true"></i>
            <span>Làm mới</span></li>
          <li onclick="custom_node_set_sticky(<?php echo $node->nid; ?>, this);" status="<?php echo $node->sticky; ?>" title="Thay đổi chế độ Sticky">
            <i class="fa fa-<?php echo $node->sticky == 1 ? 'star-o' : 'star'; ?>" aria-hidden="true"></i>
            <span><?php echo $node->sticky == 1 ? 'Bỏ nổi bật' : 'Nổi bật'; ?></span>
          </li>
          <?php if ($node->status): ?>
            <li onclick="custom_node_set_published(<?php echo $node->nid; ?>, this);" status="<?php echo $node->status; ?>" title="Thay đổi trạng thái nội dung">
              <i class="fa fa-<?php echo $node->status == 1 ? 'lock' : 'unlock'; ?>" aria-hidden="true"></i>
              <span><?php echo $node->status == 1 ? 'Khóa' : 'Mở khóa'; ?></span>
            </li>
          <?php else: ?>
            <li class="disabled" status="<?php echo $node->status; ?>" title="Liên hệ với quản trị viên để mở khóa nội dung">
              <i class="fa fa-<?php echo $node->status == 1 ? 'lock' : 'unlock'; ?>" aria-hidden="true"></i>
              <span>Mở khóa</span></li>
          <?php endif; ?>
          <li onclick="custom_node_set_edited(<?php echo $node->nid; ?>, 'service');" title="Sửa nội dung này">
            <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
            <span>Sửa</span></li>
          <li onclick="custom_node_set_deleted(<?php echo $node->nid; ?>, this);" title="Xóa nội dung này">
            <i class="fa fa-trash" aria-hidden="true"></i> <span>Xóa</span></li>
        </ul>
      </div>
    </div>
  
  <?php elseif ($view_mode == 'deal_product') : ?>
    <div class="dh-sale-product wow fadeInUp">
      <div class="product-top">
        <div class="product-image">
          <?php if (!empty($node->uc_product_image)):
            $img_src = image_style_url('rectangle_270x235', $node->uc_product_image[LANGUAGE_NONE][0]['uri']);
            ?>
            <a href="<?php print $node_url; ?>"><img src="<?php echo $img_src; ?>" alt=""></a>
          <?php endif; ?>
        </div>
        <div class="product-sale-percent">-<?php $percent = round(($node->list_price - $node->sell_price) / $node->list_price, 2) * 100;
          print $percent; ?>%
        </div>
        <div class="dh-quick-order">
          <?php print render($content['add_to_cart']); ?>
        </div>
      </div>

      <div class="product-body">
        <h5 class="product-name">
          <a href="<?php print $node_url; ?>"><?php print $title; ?></a></h5>
        <div class="product-line">
          <div class="product-price">
            <div class="initial-price"><?php print uc_currency_format($node->list_price, '', ','); ?> Đ</div>
            <div class="sale-price"><?php print uc_currency_format($node->sell_price, '', ','); ?> Đ</div>
          </div>
          <div class="product-action">
            <div class="dh-wishlist">
              <?php print render($content['add_to_cart']); ?>
            </div>

            <!--            --><?php //print render($content['sharethis']); ?>
            <div class="navbar-right share-icons dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                <i class="fa fa-share-alt" aria-hidden="true"></i>
              </a>
              <div class="dropdown-menu" data-url="<?php echo $base_url . $node_url; ?>"></div>
            </div>
          </div>
        </div>
        <?php $date = strtotime($node->field_deal_time['und'][0]['value']); ?>
        <ul class="product-time clearfix" data-countdown="<?php print date('Y/m/d h:i:s', $date); ?>">
          <li>
            <div class="time"><label class="number-day"></label>
              <span><?php print t("Ngày"); ?></span></div>
          </li>
          <li>
            <div class="time"><label class="number-h"></label>
              <span><?php print t("Giờ"); ?></span></div>
          </li>
          <li>
            <div class="time"><label class="number-m"></label>
              <span><?php print t("Phút"); ?></span></div>
          </li>
          <li>
            <div class="time"><label class="number-s"></label>
              <span><?php print t("Giây"); ?></span></div>
          </li>
        </ul>
      </div>
    </div>
  
  <?php elseif ($view_mode == 'full'):
    $theme_path = drupal_get_path('theme', 'giaidieu');
    $supplier_uid = !empty($node->field_user) ? $node->field_user['und'][0]['target_id'] : $node->uid;
    if ($intro_producrt_seller_uid = user_load($supplier_uid)) {
      $intro_ncc = !empty($intro_producrt_seller_uid->field_user_description) ? $intro_producrt_seller_uid->field_user_description['und'][0]['value'] : '';
    }
    
    ?>


    <div class="right-sidebar">
      <div class="service-details-wrapper image-popup">
        <div class="row">
          <div class="col-md-6">
            <?php print render($content['uc_product_image']); ?>
          </div>
          <div class="col-md-6">
            <div class="service-info">
              <div class="info-top">
                <!--                <ul class="video-share-icon share-lazy-load" data-url="--><?php //print $base_url . $node_url;
                                                                                              ?><!--"></ul>-->
                <div class="sharethis-inline-share-buttons"></div>
              </div>
              <div class="title"><?php print $node->title; ?></div>
              <?php $des = isset($node->field_intro_service[LANGUAGE_NONE][0]['summary']) ? $node->field_intro_service[LANGUAGE_NONE][0]['summary'] : ''; ?>
              <div class="description"><?php print $des; ?></div>
              <?php if (intval($node->sell_price) < intval($node->list_price)) {
                ?>
                <div class="initial-price"><?php print t("Giá gốc"); ?>: <?php //print uc_currency_format($node->list_price); ?> <?php print number_format($node->list_price, 0, ",", "."); ?> đ</div>

                <div class="sale-price"><?php print t("Giá bán"); ?>:
                  <?php if ($node->sell_price == 0) {
                    print t("Liên hệ");
                  }
                  else {
                    //print uc_currency_format($node->sell_price);
                    print number_format($node->sell_price, 0, ",", "."); ?> đ
                  <?php } ?>
                </div>
                <?php if ($node->sell_price < $node->list_price): ?>
                  <div class="profit">
                    Tiết kiệm: <?php echo round(($node->list_price - $node->sell_price) / $node->list_price, 2) * 100; ?>%
                  </div>
                <?php endif; ?>
              
              <?php } else { ?>
                <div class="sale-price"><?php print t("Giá bán"); ?>: <?php print ($node->sell_price > 0) ? number_format($node->list_price, 0, ",", ".") + 'đ' : t("Contact"); ?></div>
              <?php } ?>
              
              <?php
              if (!empty($node->field_deal_time)):
                $date = strtotime($node->field_deal_time['und'][0]['value']);
                if ($date > time()):
                  ?>
                  <div class="dh-sale-product">
                    <ul class="product-time clearfix" data-countdown="<?php print date('Y/m/d h:i:s', $date); ?>">
                      <li>
                        <div class="time"><label class="number-day"></label>
                          <span><?php print t("Ngày"); ?></span></div>
                      </li>
                      <li>
                        <div class="time"><label class="number-h"></label>
                          <span><?php print t("Giờ"); ?></span></div>
                      </li>
                      <li>
                        <div class="time"><label class="number-m"></label>
                          <span><?php print t("Phút"); ?></span></div>
                      </li>
                      <li>
                        <div class="time"><label class="number-s"></label>
                          <span><?php print t("Giây"); ?></span></div>
                      </li>
                    </ul>
                  </div>
                
                <?php
                endif;
              endif; ?>

              <div class="addcart"><?php
                hide($content['add_to_cart']['#form']['actions']['wishlist']);
                //                dsm($content['add_to_cart']['#form']['actions']);
                print render($content['add_to_cart']) ?></div>
              <?php echo render($content['field_tags']); ?>
              <?php echo render($content['field_type_of_service']); ?>
              <?php echo render($content['field_cities']); ?>
            </div>
          </div>
        </div>


        <div class="service-details">
          <ul class="nav nav-tabs">
            <li class="active">
              <a data-toggle="tab" href="#service-intro"><?php print t("Giới thiệu sản phẩm"); ?></a>
            </li>
            <li>
              <a data-toggle="tab" href="#provider-intro"><?php print t("Giới thiệu nhà cung cấp"); ?></a>
            </li>
            <?php if (!empty($node->field_promotion['und'][0]['value'])) { ?>
              <li>
                <a data-toggle="tab" href="#sale-program"><?php print t("Các chính sách ưu đãi"); ?></a>
              </li>
            <?php } ?>
          </ul>

          <div class="tab-content">
            <div id="service-intro" class="tab-pane fade in active">
              <?php if (!empty($node->field_intro_service['und'][0]['value'])) {
                print $node->field_intro_service['und'][0]['value'];
              } ?>
            </div>
            <div id="provider-intro" class="tab-pane fade">
              <?php if (!empty($intro_ncc)) {
                echo $intro_ncc;
              } ?>
            </div>
            <?php if (!empty($node->field_promotion['und'][0]['value'])): ?>
              <div id="sale-program" class="tab-pane fade">
                <?php print $node->field_promotion['und'][0]['value']; ?>
              </div>
            <?php endif; ?>
          </div>
          <div class="article-comments">
            <div class="fb-comments" data-href="<?php print $base_url . $node_url; ?>" data-numposts="5" data-width="100%"></div>
          </div>
        </div> <!-- / .service-details -->
      </div>
    </div> <!-- / .right-sidebar -->

    <div class="product-service-add-on">
      <?php
      //Product add on
      if (!empty($node->field_products_addon)) {
        $blockLoad = block_load('views', 'node_functions-block_37');
        if ($blockLoad) {
          $block_content = _block_render_blocks([$blockLoad]);
          $blockBuild = _block_get_renderable_array($block_content);
          print drupal_render($blockBuild);
        }
      }
      //Service add on
      if (!empty($node->field_services_addon)) {
        $blockLoad = block_load('views', 'node_functions-block_71');
        if ($blockLoad) {
          $block_content = _block_render_blocks([$blockLoad]);
          $blockBuild = _block_get_renderable_array($block_content);
          print drupal_render($blockBuild);
        }
      }
      ?>
    </div>
  
  <?php else: ?>
    <?php print render($content); ?>
  <?php endif; ?>
</div>

