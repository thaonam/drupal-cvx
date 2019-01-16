<?php

?>
<div id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?> clearfix <?php print $view_mode; ?>">
  <?php if ($title_prefix) print render($title_prefix); ?>
  <?php if ($teaser): ?>
    <div class="dh-recommend-item dh-news-recommend wow fadeInUp">
      <?php if(!empty($node->field_images)) : 
        $img_url = image_style_url('cut_270x205', $node->field_images[LANGUAGE_NONE ][0]['uri']);
      ?>
        <div class="image"><a href="<?php print $node_url ?>"><img src="<?php print $img_url; ?>" alt="<?php print $node->title; ?>"></a></div>
      <?php endif; ?>
      <div class="blog-body">
        <h5 class="news-title"><a href="<?php print $node_url ?>"><?php print $node->title; ?></a></h5>
        <?php if ($title_suffix) print render($title_suffix); ?>
        <div class="news-info">
          <?php print date('d/m/Y', $node->created); ?>
        </div>
      </div>
    </div>

  <?php elseif ($view_mode == 'search_index'): ?>
    <div class="service-search search-item">
      <div class="image">
        <?php echo render($content['uc_product_image'][0]); ?>
      </div>
      <div class="service-body">
        <?php if ($title_prefix) print render($title_prefix); ?>
          <div class="title"><a href="<?php print $node_url ?>"><?php print $node->title; ?></a></div>
        <?php if ($title_suffix) print render($title_suffix); ?>
        <div class="body"><?php echo render($content['body']); ?></div>
      </div>
    </div>
  <?php else:
    global $base_url;
  ?>
    <div class="dh-block-news-details clearfix">
      <h5 class="news-title"><?php print $node->title; ?></h5>
      <div class="news-info"><?php print date('d/m/Y', $node->created); ?></div>
      <div class="news-content">
        <?php if(!empty($node->body)){ print render($content['body']); }?>
      </div>

      <div class="dh-post-share">
<!--        --><?php //print t("Chia Sẻ"); ?><!--:-->
        <div class="sharethis-inline-share-buttons"></div>
<!--        <ul class="video-share-icon share-lazy-load" data-url="--><?php //print $base_url . $node_url; ?><!--"></ul>-->
      </div>

      <?php echo render($content['field_tags']); ?>

      <?php echo render($content['field_news_category']); ?>

        <div class="article-comments">
          <div class="fb-comments" data-href="<?php print $base_url . $node_url; ?>" data-numposts="5" data-width="100%"></div>
        </div>
    </div>    
  <?php endif; ?>
</div>

