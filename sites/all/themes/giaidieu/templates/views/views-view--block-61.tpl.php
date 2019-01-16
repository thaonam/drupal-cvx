<?php

/**
 * @file
 * Main view template.
 *
 * Variables available:
 * - $classes_array: An array of classes determined in
 *   template_preprocess_views_view(). Default classes are:
 *     .view
 *     .view-[css_name]
 *     .view-id-[view_name]
 *     .view-display-id-[display_name]
 *     .view-dom-id-[dom_id]
 * - $classes: A string version of $classes_array for use in the class attribute
 * - $css_name: A css-safe version of the view name.
 * - $css_class: The user-specified classes names, if any
 * - $header: The view header
 * - $footer: The view footer
 * - $rows: The results of the view query, if any
 * - $empty: The empty text to display if the view is empty
 * - $pager: The pager next/prev links to display, if any
 * - $exposed: Exposed widget form/info to display
 * - $feed_icon: Feed icon to display, if any
 * - $more: A link to view more, if any
 *
 * @ingroup views_templates
 */
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
    <div class="view-content">
      <?php foreach($view->result as $row) : 
        $pos = $row->field_field_banner_pos[0]['raw']['value'];
        if($pos == "banner_left") : 
          $img_url = image_style_url('rectangle_570x630', $row->field_field_images[0]['raw']['uri']);
        ?>
          <div class="col-sm-6">
            <div class="product-sticky sticky-1">
              <?php
              if (node_access('update', $row->_field_data['nid']['entity'])) {
                echo l(t("Edit"), 'node/' . $row->nid . '/edit', array('attributes' => array('class' => array('node-edit-link'))));
              }
              ?>
              <div class="image">
                <img class="img-responsive" src="<?php print $img_url; ?>" alt="<?php print $row->node_title; ?>"> 
              </div>
              <div class="info wow fadeInDownShort">
                <div class="title bold wow bounceInDown"><?php print $row->node_title; ?></div>
                <div class="body wow bounceInLeft">
                  <?php if(!empty($row->field_body[0]['raw']['value'])) print $row->field_body[0]['raw']['value']; ?>
                </div>
                <?php if(!empty($row->field_field_link[0]['raw']['value'])) : ?>
                  <a href="<?php print $row->field_field_link[0]['raw']['value']; ?>" class="btn dh-btn-recovery wow tada" data-wow-iteration="infinite"  data-wow-duration="2s">Khám phá</a>
                <?php endif; ?>        
              </div>
            </div>
          </div>
        <?php endif; ?>
      <?php endforeach; ?>
        
      
                          
      <div class="col-sm-6">
        <?php foreach($view->result as $row) : 
          $pos = $row->field_field_banner_pos[0]['raw']['value'];
          if($pos == "banner_right1" || $pos == "banner_right2") : 
           $img_url = image_style_url('rectangle_570x300', $row->field_field_images[0]['raw']['uri']);
          ?>
            <div class="product-sticky sticky-1">
              <?php
              if (node_access('update', $row->_field_data['nid']['entity'])) {
                echo l(t("Edit"), 'node/' . $row->nid . '/edit', array('attributes' => array('class' => array('node-edit-link'))));
              }
              ?>
              <div class="image">
                <img class="img-responsive" src="<?php print $img_url; ?>" alt="<?php print $row->node_title; ?>">          
              </div>
              <div class="info wow fadeInDownShort">
                <div class="title bold wow bounceInDown"><?php print $row->node_title; ?></div>
                <div class="body wow bounceInLeft">
                  <?php if(!empty($row->field_body[0]['raw']['value'])) print $row->field_body[0]['raw']['value']; ?>
                </div>
                <?php if(!empty($row->field_field_link[0]['raw']['value'])) : ?>
                  <a href="<?php print $row->field_field_link[0]['raw']['value']; ?>" class="btn dh-btn-recovery wow tada" data-wow-iteration="infinite"  data-wow-duration="2s">Khám phá</a>
                <?php endif; ?>                     
              </div>
            </div>
          <?php endif; ?>
        <?php endforeach; ?>
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