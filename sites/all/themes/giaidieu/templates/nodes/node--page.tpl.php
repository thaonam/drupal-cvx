<?php
//dsm($content);
drupal_add_css(drupal_get_path('theme', 'giaidieu') . '/css/ve-chung-toi.css', 'file');
drupal_add_css(drupal_get_path('theme', 'giaidieu') . '/less/ve-chung-toi.css.less');
?>
<div id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?> clearfix" <?php print $attributes; ?>>
  <?php if ($title_prefix) print render($title_prefix); ?>
  <?php if ($title_suffix) print render($title_suffix); ?>
  <div class="container-pull">
    <div class="hospital-features"> 
      <div class="container">
        <div class="row">
          <?php if(!empty($content['uc_product_image'])): ?>
            
            <div class="col-sm-6">
              <div class="dh-vision-wrapper">
                <div class="flexslider vision-flexslider">
                  <ul class="slides">
                  <?php foreach ($node->uc_product_image['und'] as $img) : 
                    $img_url = image_style_url('rectangle_1600x800', $img['uri']);
                    $img_url_popup = image_style_url('image_popup_1600x800', $img['uri']);
                    $img_alt = $img['filename'];?>
                    <li class="image-popup">
                      <a href="<?php print $img_url_popup; ?>" class="dh-zoom">
                        <img src="<?php print $img_url; ?>" alt="<?php print $img_alt; ?>">
                      </a>
                    </li>
                  <?php endforeach; ?>
                  </ul>
                </div>
 
                <div class="flexslider vision-carousel">
                  <ul class="slides">
                  <?php foreach ($node->uc_product_image['und'] as $img) : 
                    $img_url = image_style_url('rectangle_1600x800', $img['uri']);
                    $img_alt = $img['filename'];?>
                    <li>
                      <img src="<?php print $img_url; ?>" alt="<?php print $img_alt; ?>">
                    </li>
                  <?php endforeach; ?>
                  </ul>
                </div>
              </div> <!-- / .dh-vision-wrappe -->
            </div>
          <?php endif;?>
          
          <div class="col-sm-6">
            <?php
              $blockLoad = block_load('custom','intro_front');
              if ($blockLoad) {
                $block_content = _block_render_blocks(array($blockLoad));
                $blockBuild = _block_get_renderable_array($block_content);
                print drupal_render($blockBuild);
            } ?>
          </div>
        </div>
      </div>
    </div>
  </div>

  <?php
    $blockLoad = block_load('custom','why_choose_us');
    if ($blockLoad) {
      $block_content = _block_render_blocks(array($blockLoad));
      $blockBuild = _block_get_renderable_array($block_content);
      print drupal_render($blockBuild);
  } ?>
  <?php
    $blockLoad = block_load('views','node_functions-block_59');
    if ($blockLoad) {
      $block_content = _block_render_blocks(array($blockLoad));
      $blockBuild = _block_get_renderable_array($block_content);
      print drupal_render($blockBuild);
  } ?>

    <?php
    $blockLoad = block_load('views','node_functions-block_32');
    if ($blockLoad) {
      $block_content = _block_render_blocks(array($blockLoad));
      $blockBuild = _block_get_renderable_array($block_content);
      print drupal_render($blockBuild);
    } ?>
  <!-- </div> -->

  <?php if (!empty($content['field_history'])): ?>
  <div class="history-wrapper">
    <h2 class="block-title"><?php print t("Lịch sử phát triển");?></h2>
    <ul>
      <?php foreach ($content['field_history']['#items'] as $key => $item):
        $his = $content['field_history'][$key]['entity']['field_collection_item'][$item['value']];
      ?>
        <li>
          <div class="history">
            <div class="history-year"><?php if (!empty($his['field_title']['#items'][0]['value'])) print $his['field_title']['#items'][0]['value'] ?></div>
            <div class="history-content"><?php if (!empty($his['field_content']['#items'][0]['value'])) print $his['field_content']['#items'][0]['value'] ?></div>
          </div>
        </li>
      <?php endforeach; ?>
    </ul>
    
    <?php if(sizeof($content['field_history']['#items']) > 4) :?>
    <button id="load-history" class="btn btn-orange btn-large">Xem thêm</button> <?php endif;?>
  </div>
  <?php endif; ?>

  <?php if (!empty($content['field_partner'])): ?>
  <div class="partner-wrapper">
    <h2 class="block-title"><?php print t("Đối tác chiến lược");?></h2>
    <ul class="partner-list">
      <?php foreach ($content['field_partner']['#items'] as $key => $item):
        $partner = $content['field_partner'][$key]['entity']['field_collection_item'][$item['value']];
      ?>
        <li>
          <div class="partner">
            <div class="partner-img">
              <img src="<?php print image_style_url('crop_293x293', $partner['field_images']['#items'][0]['uri']); ?>" alt="">
            </div>
            <div class="partner-body">
              <div class="name"><?php if (!empty($partner['field_title']['#items'][0]['value'])) print $partner['field_title']['#items'][0]['value'] ?></div>
              <div class="description"><?php if (!empty($partner['field_content']['#items'][0]['value'])) print $partner['field_content']['#items'][0]['value'] ?></div>
            </div>
          </div>
        </li>
      <?php endforeach; ?>
    </ul>

    <?php if(sizeof($content['field_partner']['#items']) > 3) :?>
    <button id="load-partner" class="btn btn-orange btn-large">Xem thêm</button> <?php endif;?>
  </div>
  <?php endif; ?>
</div>
