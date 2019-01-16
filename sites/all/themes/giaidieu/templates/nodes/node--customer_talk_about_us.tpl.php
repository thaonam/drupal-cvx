<div id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?> clearfix <?php print $view_mode ?>" <?php print $attributes; ?>>
  <?php if ($title_prefix) print render($title_prefix); ?>
  <?php if ($title_suffix) print render($title_suffix); ?>

  <?php if ($teaser): ?>

      <div class="item">
        <div class="review">
          <div class="content">"
            <?php if (!empty($node->body)) {
              print truncate_utf8(strip_tags($node->body['und'][0]['value']), 200);
              } ?>"
          </div>
          <div class="author">
            <?php if (!empty($node->field_images)): ?>
            <img src="<?php print image_style_url('img_avatar', $node->field_images['und'][0]['uri']); ?>" alt="">
          <?php endif; ?>
            <div class="name"><?php print $title; ?></div>
            <div class="job">
              <?php if (!empty($node->field_position)) print $node->field_position['und'][0]['value']; ?>
            </div>
          </div>
        </div>
      </div>
  <?php else: ?>
    <?php print render($content); ?>
  <?php endif; ?>
</div>
