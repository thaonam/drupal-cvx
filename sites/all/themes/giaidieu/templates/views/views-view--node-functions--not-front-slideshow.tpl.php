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

<?php if ($rows): ?>
  <div class="view-content banner-wrapper">
    <div id="front-slideshow" class="banner-slideshow banner" data-version="5.4.5" style="display:none">
      <ul>
        <?php foreach ($view->result as $key => $item): ?>
          <li class="textbox" data-thumb="<?php print image_style_url('crop_370x260', $item->field_field_images[0]['raw']['uri']) ?>"  data-transition="boxslide" data-slotamount="5">
            <?php if (!empty($item->field_field_images)): ?>
              <img src="<?php print file_create_url($item->field_field_images[0]['raw']['uri']); ?>">
            <?php endif; ?>
            <?php if (arg(0) != 'contact'): ?>
              <div class="textbox-body tp-caption tp-resizeme" data-x="left" data-y="middle" data-frames='[{"delay":2000,"speed":700,"frame":"0","from":"y:top;","to":"o:1;","ease":"easeOutBack"}]'>
                <div class="container">
                  <div class=" title" ><?php print $item->node_title; ?></div>
                  <?php if (!empty($item->field_body)): ?>
                    <div class="description"><?php print truncate_utf8($item->field_body[0]['rendered']['#markup'], 120) ?></div>
                  <?php endif; ?>
                  <?php if (!empty($item->field_field_link_slide)): ?>
                    <a href="<?php print $item->field_field_link_slide[0]['raw']['url']; ?>" class="btn btn-orange">Khám phá +</a>
                  <?php endif; ?>
                </div>
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