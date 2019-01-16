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
//dsm($view->result);
?>
<div class="<?php print $classes; ?>">
<?php print render($title_prefix); ?>
<?php if ($title): ?>
  <?php print $title; ?>
<?php endif; ?>
<?php print render($title_suffix); ?>

  <div class="bg-overlay"></div>

  <div class="review-wrapper clearfix">
    <div class="th_customer-review-title">
      <span class="th_quote"></span>
    </div>
    <?php if (!empty($view->result)): shuffle($view->result); ?>
      <div class="flexslider dh-flex-review">
        <ul class="slides">
          <?php foreach ($view->result as $key => $item): ?>
            <li>
              <div class="th_customer-content">“<?php print truncate_utf8(strip_tags($item->field_body[0]['raw']['value']), 180) ?>”</div>
            </li>
          <?php endforeach; ?>
        </ul>
      </div>

      <div class="th_owl-list flexslider dh-carousel-review">
        <ul class="slides">
          <?php
          $body_alter = array();
          foreach ($view->result as $key => $item): ?>
            <li>
              <div class="author-img">
                <?php print render($item->field_field_images[0]['rendered']); ?>
              </div>
              <div class="dh-body">
                <span class="dh-name"><?php print $item->node_title; ?></span> -
                <span class="dh-job"><?php $position = (!empty($item->field_field_position)) ? $item->field_field_position[0]['raw']['value'] : ''; ?></span>
              </div> 
            </li>
           <?php
          $body_alter[] = '<li><div class="dh-body-alter">
                            <span class="dh-name-alter">'. $item->node_title .'</span> -
                            <span class="dh-job-alter">'. $position .'</span>
                          </div></li>';
          endforeach; ?>
        </ul>
      </div>

      <div class="dh-body-alter-wrapper flexslider">
        <ul class="slides">
          <?php echo implode('', $body_alter) ?>
        </ul>
      </div>

    <?php endif; ?>
  </div> <!-- / .review-wrapper -->

  </div><?php /* class view */ ?>