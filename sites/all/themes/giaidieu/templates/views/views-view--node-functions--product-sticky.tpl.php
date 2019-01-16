<?php
//dsm($view->result);
$view_rows = $view->result;
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
      <div class="product-sticky-wrapper row">
        <div class="col-sm-6">
          <div class="product-sticky sticky-1">
            <div class="image">
              <?php
              $view_rows[0]->field_uc_product_image[0]['rendered']['#image_style'] = 'crop_570x630';
              print render($view_rows[0]->field_uc_product_image[0]['rendered']);
              ?>
            </div>
            <div class="info">
              <div class="title bold"><?php print $view_rows[0]->node_title; ?></div>
              <div class="body"><?php if (!empty($view_rows[0]->field_body[0]['rendered'])) print render($view_rows[0]->field_body[0]['rendered']); ?></div>
              <?php print l("Đặt ngay", 'node/' . $view_rows[0]->nid, array('attributes' => array('class' => array('btn', 'btn-blue')))); ?>
            </div>
          </div>
        </div>
        <div class="col-sm-6">
          <?php if (!empty($view_rows[1])): ?>
            <div class="product-sticky sticky-2">
              <div class="image">
                <?php
                $view_rows[1]->field_uc_product_image[0]['rendered']['#image_style'] = 'crop_570x300';
                print render($view_rows[1]->field_uc_product_image[0]['rendered']);
                ?>
              </div>
              <div class="info">
                <div class="title bold"><?php print $view_rows[1]->node_title; ?></div>
                <div class="body"><?php if (!empty($view_rows[1]->field_body[0]['rendered'])) print render($view_rows[1]->field_body[0]['rendered']); ?></div>
                <?php print l("Đặt ngay", 'node/' . $view_rows[1]->nid, array('attributes' => array('class' => array('btn', 'btn-blue')))); ?>
              </div>
            </div>
          <?php endif; ?>

          <?php if (!empty($view_rows[2])): ?>
            <div class="product-sticky sticky-2">
              <div class="image">
                <?php
                $view_rows[2]->field_uc_product_image[0]['rendered']['#image_style'] = 'crop_570x300';
                print render($view_rows[2]->field_uc_product_image[0]['rendered']);
                ?>
              </div>
              <div class="info">
                <div class="title bold"><?php print $view_rows[2]->node_title; ?></div>
                <div class="body"><?php if (!empty($view_rows[2]->field_body[0]['rendered'])) print render($view_rows[2]->field_body[0]['rendered']); ?></div>
                <?php print l("Đặt ngay", 'node/' . $view_rows[2]->nid, array('attributes' => array('class' => array('btn', 'btn-blue')))); ?>
              </div>
            </div>
          <?php endif; ?>
        </div>
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
