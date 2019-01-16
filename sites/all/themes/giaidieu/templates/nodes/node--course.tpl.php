<?php

/**
 * @file
 * Default theme implementation to display a node.
 *
 * Available variables:
 * - $title: the (sanitized) title of the node.
 * - $content: An array of node items. Use render($content) to print them all,
 *   or print a subset such as render($content['field_example']). Use
 *   hide($content['field_example']) to temporarily suppress the printing of a
 *   given element.
 * - $user_picture: The node author's picture from user-picture.tpl.php.
 * - $date: Formatted creation date. Preprocess functions can reformat it by
 *   calling format_date() with the desired parameters on the $created variable.
 * - $name: Themed username of node author output from theme_username().
 * - $node_url: Direct URL of the current node.
 * - $display_submitted: Whether submission information should be displayed.
 * - $submitted: Submission information created from $name and $date during
 *   template_preprocess_node().
 * - $classes: String of classes that can be used to style contextually through
 *   CSS. It can be manipulated through the variable $classes_array from
 *   preprocess functions. The default values can be one or more of the
 *   following:
 *   - node: The current template type; for example, "theming hook".
 *   - node-[type]: The current node type. For example, if the node is a
 *     "Blog entry" it would result in "node-blog". Note that the machine
 *     name will often be in a short form of the human readable label.
 *   - node-teaser: Nodes in teaser form.
 *   - node-preview: Nodes in preview mode.
 *   The following are controlled through the node publishing options.
 *   - node-promoted: Nodes promoted to the front page.
 *   - node-sticky: Nodes ordered above other non-sticky nodes in teaser
 *     listings.
 *   - node-unpublished: Unpublished nodes visible only to administrators.
 * - $title_prefix (array): An array containing additional output populated by
 *   modules, intended to be displayed in front of the main title tag that
 *   appears in the template.
 * - $title_suffix (array): An array containing additional output populated by
 *   modules, intended to be displayed after the main title tag that appears in
 *   the template.
 *
 * Other variables:
 * - $node: Full node object. Contains data that may not be safe.
 * - $type: Node type; for example, story, page, blog, etc.
 * - $comment_count: Number of comments attached to the node.
 * - $uid: User ID of the node author.
 * - $created: Time the node was published formatted in Unix timestamp.
 * - $classes_array: Array of html class attribute values. It is flattened
 *   into a string within the variable $classes.
 * - $zebra: Outputs either "even" or "odd". Useful for zebra striping in
 *   teaser listings.
 * - $id: Position of the node. Increments each time it's output.
 *
 * Node status variables:
 * - $view_mode: View mode; for example, "full", "teaser".
 * - $teaser: Flag for the teaser state (shortcut for $view_mode == 'teaser').
 * - $page: Flag for the full page state.
 * - $promote: Flag for front page promotion state.
 * - $sticky: Flags for sticky post setting.
 * - $status: Flag for published status.
 * - $comment: State of comment settings for the node.
 * - $readmore: Flags true if the teaser content of the node cannot hold the
 *   main body content.
 * - $is_front: Flags true when presented in the front page.
 * - $logged_in: Flags true when the current user is a logged-in member.
 * - $is_admin: Flags true when the current user is an administrator.
 *
 * Field variables: for each field instance attached to the node a corresponding
 * variable is defined; for example, $node->body becomes $body. When needing to
 * access a field's raw values, developers/themers are strongly encouraged to
 * use these variables. Otherwise they will have to explicitly specify the
 * desired field language; for example, $node->body['en'], thus overriding any
 * language negotiation rule that was previously applied.
 *
 * @see template_preprocess()
 * @see template_preprocess_node()
 * @see template_process()
 *
 * @ingroup themeable
 */
 //dsm($node);
?>
<div id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?> clearfix"<?php print $attributes; ?>>
<?php if ($view_mode == 'album'): ?>
  <div class="course-img-wrapper">
    <img src="<?php print image_style_url('style_560x330', $node->field_images[LANGUAGE_NONE][0]['uri']) ?>" />
  </div>

<?php elseif ($view_mode == 'teaser'): ?>
  <div class="course-img-wrapper">
    <img src="<?php print image_style_url('course_360x187', $node->field_images[LANGUAGE_NONE][0]['uri']) ?>" />
    <img src="/sites/all/themes/giaidieu/images/play.png" class="play" alt="Play">
    <img src="/sites/all/themes/giaidieu/images/play_hover.png" class="play-hover" alt="Play">
    <span class="custom-link-node"><?php print l('Học thử', 'node/' . $node->nid); ?></span>
    <span class="course-duration"><?php print preg_replace('/^00\:/', '', custom_get_course_duration($node->nid, 'H:i:s')); ?></span>
  </div>
  
  <div class="course-rating-wrapper">
    <span class="rating-stars"><?php print render($content['field_rating']); ?></span>
    <span class="rating-average"><?php print number_format($node->votes['average'] * 5 / 100, 1); ?></span> 
  </div>
  
  <div class="course-title"><?php print l($node->title, 'node/' . $node->nid); ?></div>
  
  <div class="course-price">
    <span class="course-sell_price"><?php print uc_currency_format($node->sell_price); ?></span>
    <?php if (isset($node->save_price) and $node->save_price > 0): ?>
    <span class="course-list_price"><?php print uc_currency_format($node->list_price); ?></span>
    <span class="course-save_price">Tiết kiệm: <?php print uc_currency_format($node->save_price); ?></span>
    <?php else:?>
      <span class="course-save_price"> </span>
    <?php endif; ?>
  </div>
  
  <?php if (!empty($node->field_course_teacher[LANGUAGE_NONE])): ?>
  <div class="course-teacher-wrapper">
    <a href="<?php print url('node/' . $node->field_course_teacher[LANGUAGE_NONE][0]['node']->nid); ?>"><img class="course-teacher-thumb" src="<?php print image_style_url('crop_65x65', $node->field_course_teacher[LANGUAGE_NONE][0]['node']->field_photo[LANGUAGE_NONE][0]['uri']); ?>" alt="" /></a>
    <span class="course-teacher-name"><?php print l($node->field_course_teacher[LANGUAGE_NONE][0]['node']->title, 'node/' . $node->field_course_teacher[LANGUAGE_NONE][0]['node']->nid); ?></span><br />
    <span class="course-teacher-title">(<?php print $node->field_course_teacher[LANGUAGE_NONE][0]['node']->field_teacher_title[LANGUAGE_NONE][0]['value']; ?>)</span>
  </div>
  <?php endif; ?>
  
<?php elseif ($view_mode == 'full'): ?>
  
  <!-- Header rating -->
  <div id="body-header-rating">
    <span class="rating-stars"><?php print render($content['field_rating']); ?></span>
    <span class="rating-average"><?php print round($node->votes['average'] * 5 / 100, 1); ?></span>
  </div>

  <!-- Body navi -->
  <div id="course-header" class="clearfix">
    <ul>
      <li><a href="#course_general_info" class="active">Thông tin chung</a></li>
      <li><a href="#course_subjects">Nội dung khóa học</a></li>
      <li><a href="#course_ratings">Đánh giá (<?php print $node->votes['count'] ? $node->votes['count'] : 0; ?>)</a></li>
      <li><a href="#course_comments">Bình luận (<?php print $node->comment_count; ?>)</a></li>
    </ul>
  </div>
      
  <!-- Body slides -->
  <a name="course_general_info"></a>
  <div id="course-slides">
    <?php print views_embed_view('node_functions', 'block_77'); ?>
  </div>

  <!-- Body objective -->
  <?php if (!empty($node->field_course_objective[LANGUAGE_NONE])): ?>
  <div id="course-objective" class="course-block">
    <h2>Bạn sẽ học được gì</h2>
    <div class="content">
      <?php print $node->field_course_objective[LANGUAGE_NONE][0]['value']; ?>
    </div>
  </div>
  <?php endif; ?>

  <!-- Body for -->
  <?php if (!empty($node->field_course_for[LANGUAGE_NONE])): ?>
  <div id="course-for" class="course-block">
    <h2>Đối tượng đào tạo</h2>
    <div class="content">
      <?php print $node->field_course_for[LANGUAGE_NONE][0]['value']; ?>
    </div>
  </div>
  <?php endif; ?>

  <!-- Body description -->
  <?php if (!empty($node->body[LANGUAGE_NONE])): ?>
  <div id="course-slides" class="course-block">
    <h2>Giới thiệu khóa học</h2>
    <div class="content">
      <?php print $node->body[LANGUAGE_NONE][0]['value']; ?>
    </div>
  </div>
  <?php endif; ?>

  <!-- Body result -->
  <?php if (!empty($node->field_course_result[LANGUAGE_NONE])): ?>
  <div id="course-result" class="course-block">
    <h2>Bạn sẽ biết cách</h2>
    <div class="content">
      <?php print $node->field_course_result[LANGUAGE_NONE][0]['value']; ?>
    </div>
  </div>
  <?php endif; ?>

  <!-- Body course content -->
  <?php if (!empty($node->field_course_subjects[LANGUAGE_NONE])): ?>
  <a name="course_subjects"></a>
  <div id="course-result" class="course-block">
    <h2>Nội dung khóa học</h2>
    <div class="content">
      <?php print views_embed_view('node_functions', 'block_78'); ?>
    </div>
  </div>
  <?php endif; ?>
      
  <!-- Body rating -->  
  <a name="course_ratings"></a>
  <div id="course-ratings" class="course-block">
    <h2>Đánh giá</h2>
    <div class="content">
      <?php if (!empty($node->votes) and $node->votes['count'] > 0): ?>
      <div class="col-1">
        <p class="rating-average"><?php print round($node->votes['average'] * 5 / 100, 1); ?></p>
        <p class="rating-stars"><?php print render($content['field_rating']); ?></p>
        <p class="rating-total-users">(<?php print $node->votes['count'] . ' người đã đánh giá'; ?>)</p>
      </div>
      <div class="col-2">
        <ul class="rating-stars-statistic">
          <?php for ($i = 5; $i > 0; $i--): ?>
            <?php $star_value = $i * 20; ?>
            <?php if (isset($node->votes['statistics'][$star_value])): ?>
            <li><span class="star-label"><?php print $i; ?> sao</span><span class="star-percent-wrapper"><span class="star-percent" style="width: <?php print $node->votes['statistics'][$star_value]['percent']; ?>px;"></span></span><span class="star-count"> <?php print $node->votes['statistics'][$star_value]['count']; ?></span></li>
            <?php else: ?>
            <li><span class="star-label"><?php print $i; ?> sao</span><span class="star-percent-wrapper"><span class="star-percent" style="width: <?php print $node->votes['statistics'][$star_value]['percent']; ?>px;"></span></span><span class="star-count"> 0</span></li>
            <?php endif; ?>
          <?php endfor; ?>
        </ul>
      </div>
      <?php else: ?>
      <p class="empty">Khóa học này chưa có đánh giá nào.</p>
      <?php endif; ?>
    </div>
  </div>
      
  <!-- Body teacher info -->
  <div id="course-teacher-info" class="course-block">
    <img class="course-teacher-thumb" src="<?php print image_style_url('crop_100x100', $node->field_course_teacher[LANGUAGE_NONE][0]['node']->field_photo[LANGUAGE_NONE][0]['uri']); ?>" alt="" />
    <div class="course-teacher-name"><?php print $node->field_course_teacher[LANGUAGE_NONE][0]['node']->title; ?></div>
    <div class="course-teacher-title"><?php print $node->field_course_teacher[LANGUAGE_NONE][0]['node']->field_teacher_title[LANGUAGE_NONE][0]['value']; ?></div>
    <div class="course-teacher-body">
      <div class="content"><?php print $node->field_course_teacher[LANGUAGE_NONE][0]['node']->body[LANGUAGE_NONE][0]['value']; ?></div>
      <div class="link-to-node"><?php print l('Xem thêm', 'node/' . $node->field_course_teacher[LANGUAGE_NONE][0]['node']->nid); ?></div>
    </div>
  </div>
      
  <!-- Body comments -->
  <a name="course_comments"></a>
  <div id="course-comments">
    <?php print render($content['comments']); ?>
  </div>

<?php endif; ?>
</div>
