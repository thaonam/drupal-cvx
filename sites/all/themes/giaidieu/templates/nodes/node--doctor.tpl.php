<div id="node-<?php print $node->nid; ?>" class="<?php print $classes . ' ' .$view_mode; ?> clearfix" <?php print $attributes; ?>>
  <?php if ($title_prefix) print render($title_prefix); ?>
  <?php if ($title_suffix) print render($title_suffix); ?>
  <?php if ($teaser):
    if ($node->uid == 343) {
      dsm($node);
      dsm($content);
    }
    $avatar = (!empty($node->field_cover_picture)) ? image_style_url('crop_270x250', $node->field_cover_picture['und'][0]['uri']) : '';
    ?>
    <div class="doctor wow fadeInUp">
      <div class="dh-doctor"> 
        <div class="doctor-image">
          <img src="<?php print $avatar; ?>">
        </div>
        <div class="doctor-top">
          <div class="doctor-name"><?php echo l($node->title, 'user/' . $node->uid); ?></div>
        </div>
        <div class="doctor-body"> 
        </div>
      </div> <!-- / dh-doctor -->
    </div>

  <?php elseif ($view_mode == 'search_index'):
    $avatar = (!empty($node->field_cover_picture)) ? image_style_url('crop_270x250', $node->field_cover_picture['und'][0]['uri']) : '';
    ?>
    <div class="service-search">
      <div class="image">
        <a href="<?php echo $node_url; ?>">
          <img src="<?php print $avatar; ?>">
        </a>
      </div>
      <div class="service-body">
        <?php if ($title_prefix) print render($title_prefix); ?>
        <div class="title"><a href="<?php print $node_url ?>"><?php print $node->title; ?></a></div>
        <?php if ($title_suffix) print render($title_suffix); ?>
        <div class="body"><?php echo render($content['body']); ?></div>
      </div>
    </div>

  <?php else: ?>
     <?php print $user_picture; ?>

      <?php print render($title_prefix); ?>
      <?php if (!$page): ?>
        <h2<?php print $title_attributes; ?>><a href="<?php print $node_url; ?>"><?php print $title; ?></a></h2>
      <?php endif; ?>
      <?php print render($title_suffix); ?>

      <?php if ($display_submitted): ?>
        <div class="submitted">
          <?php print $submitted; ?>
        </div>
      <?php endif; ?>

      <div class="content"<?php print $content_attributes; ?>>
        <?php
          // We hide the comments and links now so that we can render them later.
          hide($content['comments']);
          hide($content['links']);
          print render($content);
        ?>
      </div>

      <?php print render($content['links']); ?>

      <?php //print render($content['comments']); ?>
  <?php endif; ?>
</div>