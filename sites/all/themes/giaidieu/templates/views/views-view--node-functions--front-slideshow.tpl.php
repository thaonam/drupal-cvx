<?php
$theme_path = drupal_get_path('theme', 'giaidieu');
drupal_add_css($theme_path . '/assets/vendors/rs-plugin/css/settings.css', 'file');
drupal_add_css($theme_path . '/assets/vendors/rs-plugin/css/layers.css', 'file');
drupal_add_css($theme_path . '/assets/vendors/rs-plugin/css/navigation.css', 'file');
drupal_add_js($theme_path . '/assets/vendors/rs-plugin/js/jquery.themepunch.tools.min.js', 'file');
drupal_add_js($theme_path . '/assets/vendors/rs-plugin/js/jquery.themepunch.revolution.min.js', 'file');
?>
<div class="<?php print $classes; ?>">
  <?php print render($title_prefix); ?>
  <?php if ($title): ?>
    <?php print $title; ?>
  <?php endif; ?>
  <?php print render($title_suffix); ?>
  <?php if ($header): ?>
    <div class="view-header">
      <?php print $header; ?>
    </div>
  <?php endif; ?>
  
  <?php if ($exposed): ?>
    <div class="view-filters">
      <?php print $exposed; ?>
    </div>
  <?php endif; ?>
  
  <?php if ($attachment_before): ?>
    <div class="attachment attachment-before">
      <?php print $attachment_before; ?>
    </div>
  <?php endif; ?>
<!--  --><?php //$block = module_invoke('custom', 'block_view', 'why_choose_us');
//  dsm($block);
//  ?>
<!--  <li>-->
<!--    <div class="container">-->
<!--      --><?php //print render($block['content']); ?>
<!--    </div>-->
<!--  </li>-->
  <?php if ($rows): ?>
    <div class="view-content banner-wrapper">
      <div id="front-slideshow" class="banner-slideshow banner"
           data-version="5.4.5" style="display:none">
        <ul>
        
          <?php foreach ($view->result as $key => $item): ?>
            <li>
              <?php if (!empty($item->field_field_images)): ?>
                <img
                  src="<?php print file_create_url($item->field_field_images[0]['raw']['uri']); ?>">
              <?php endif; ?>
              <div class="tp-caption tp-resizeme light-blue"
                   data-x="['115', '130']" data-y="['175', '100']"
                   data-frames='[{"delay":2300,"speed":700,"frame":"0","from":"y:top;","to":"o:1;","ease":"easeOutBack"}]'
                   data-fontsize="['25', '50']"
                   data-lineheight="['50', '80']"><?php print $item->node_title; ?></div>
              <?php if (!empty($item->field_field_intro_slide)): ?>
                <?php foreach ($item->field_field_intro_slide as $key => $text): ?>
                  <?php if ($key == 0): ?>
                    <div class="tp-caption tp-resizeme medium-black"
                         data-x="['115', '130']" data-y="['220', '180']"
                         data-frames='[{"delay":2100,"speed":700,"frame":"0","from":"y:top;","to":"o:1;","ease":"easeOutBack"}]'
                         data-fontsize="['30', '55']"
                         data-lineheight="['55', '80']"><?php print $text['raw']['value']; ?></div>
                  <?php else: ?>
                    <div class="tp-caption tp-resizeme regular-gray"
                         data-x="['115', '130']" data-y="282"
                         data-frames='[{"delay":1900,"speed":700,"frame":"0","from":"y:top;","to":"o:1;","ease":"easeOutBack"}]'
                         data-fontsize="['16', '32']"
                         data-lineheight="['40', '70']"><?php print $text['raw']['value']; ?></div>
                  <?php endif; ?>
                <?php endforeach; ?>
              <?php endif; ?>
              <?php if (!empty($item->field_field_link_slide)): ?>
                <div class="tp-caption tp-resizeme"
                     data-x="['115', '130']" data-y="['380','460']"
                     data-frames='[{"delay":2300,"speed":700,"frame":"0","from":"x:left;","to":"o:1;","ease":"easeOutBack"}]'
                     data-fontsize="['16', '32']"
                     data-lineheight="['36', '66']"><a
                    href="<?php print $item->field_field_link_slide[0]['raw']['url']; ?>"
                    class="btn btn-orange">Xem dịch vụ +</a>
                </div>
              <?php endif; ?>
            </li>
          <?php endforeach; ?>
        </ul>
      </div>
    </div>
  <?php elseif ($empty): ?>
    <div class="view-empty">
      <?php print $empty; ?>
    </div>
  <?php endif; ?>
  
  <?php if ($pager): ?>
    <?php print $pager; ?>
  <?php endif; ?>
  
  <?php if ($attachment_after): ?>
    <div class="attachment attachment-after">
      <?php print $attachment_after; ?>
    </div>
  <?php endif; ?>
  
  <?php if ($more): ?>
    <?php print $more; ?>
  <?php endif; ?>
  
  <?php if ($footer): ?>
    <div class="view-footer">
      <?php print $footer; ?>
    </div>
  <?php endif; ?>
  
  <?php if ($feed_icon): ?>
    <div class="feed-icon">
      <?php print $feed_icon; ?>
    </div>
  <?php endif; ?>

</div><?php /* class view */ ?>
