<?php /* giaidieu standard theme created by giaidieu.com */
/**
 * @file
 *
 * The doctype, html, head and body tags are not in this template. Instead they
 * can be found in the html.tpl.php template normally located in the
 * modules/system directory.
 *
 * Available variables:
 *
 * General utility variables:
 * - $base_path: The base URL path of the Drupal installation. At the very
 *   least, this will always default to /.
 * - $directory: The directory the template is located in, e.g. modules/system
 *   or themes/bartik.
 * - $is_front: TRUE if the current page is the front page.
 * - $logged_in: TRUE if the user is registered and signed in.
 * - $is_admin: TRUE if the user has permission to access administration pages.
 *
 * Site identity:
 * - $front_page: The URL of the front page. Use this instead of $base_path,
 *   when linking to the front page. This includes the language domain or
 *   prefix.
 * - $logo: The path to the logo image, as defined in theme configuration.
 * - $site_name: The name of the site, empty when display has been disabled
 *   in theme settings.
 * - $site_slogan: The slogan of the site, empty when display has been disabled
 *   in theme settings.
 * - $hide_site_name: TRUE if the site name has been toggled off on the theme
 *   settings page. If hidden, the "element-invisible" class is added to make
 *   the site name visually hidden, but still accessible.
 * - $hide_site_slogan: TRUE if the site slogan has been toggled off on the
 *   theme settings page. If hidden, the "element-invisible" class is added to
 *   make the site slogan visually hidden, but still accessible.
 *
 * Navigation:
 * - $main_menu (array): An array containing the Main menu links for the
 *   site, if they have been configured.
 * - $secondary_menu (array): An array containing the Secondary menu links for
 *   the site, if they have been configured.
 * - $breadcrumb: The breadcrumb trail for the current page.
 *
 * Page content (in order of occurrence in the default page.tpl.php):
 * - $title_prefix (array): An array containing additional output populated by
 *   modules, intended to be displayed in front of the main title tag that
 *   appears in the template.
 * - $title: The page title, for use in the actual HTML content.
 * - $title_suffix (array): An array containing additional output populated by
 *   modules, intended to be displayed after the main title tag that appears in
 *   the template.
 * - $messages: HTML for status and error messages. Should be displayed
 *   prominently.
 * - $tabs (array): Tabs linking to any sub-pages beneath the current page
 *   (e.g., the view and edit tabs when displaying a node).
 * - $action_links (array): Actions local to the page, such as 'Add menu' on the
 *   menu administration interface.
 * - $feed_icons: A string of all feed icons for the current page.
 * - $node: The node object, if there is an automatically-loaded node
 *   associated with the page, and the node ID is the second argument
 *   in the page's path (e.g. node/12345 and node/12345/revisions, but not
 *   comment/reply/12345).
 *
 * Regions:
 * - $page['header']: Items for the header region.
 * - $page['content']: The main content of the current page.
 * - $page['left']: Items for the first sidebar.
 * - $page['right']: Items for the first sidebar.
 * - $page['footer']: Items for the footer region.
 *
 * @see template_preprocess()
 * @see template_preprocess_page()
 * @see template_process()
 * @see html.tpl.php
 *
 * Main menu: $primary_nav
 */
 //dsm($node);
?>
 
<div id="page-wrapper" class="<?php if ($page['left']): echo ' sidebar-left'; endif; ?><?php if ($page['right']): echo ' sidebar-right'; endif; ?>">
<!-- Header -->
<div id="header" class="clearfix">

  <?php if ($page['top_header']): ?>
    <div class="header-top">
      <div class="container">
        <div class="row">
          <?php print render($page['top_header']); ?>
        </div>
      </div>
    </div>    
    <!-- / top header -->
  <?php endif; ?>

  <?php if ($page['header']): ?>
  <div id="header-content">
    <div class="container">
      <div class="row header">
        <div id="logo">
          <?php 
            $blockLoad = block_load("block", '39'); 
            if($blockLoad) {
              $block_content = _block_render_blocks(array($blockLoad));
              $blockBuild = _block_get_renderable_array($block_content);
              print drupal_render($blockBuild);
            }?>
        </div>

        <div class="content-wrapper">
          <?php print render($page['header']); ?>
          <?php
          $total_qty = uc_cart_get_total_qty();
          ?>
          <div class="block-cart th_cart-block">
            <a href="/cart"><div class="th_cart-item">
                <span class="th_count"><?php print $total_qty; ?></span>
                <span class="cart-label">Giỏ hàng</span>
              </div></a>
          </div>
        </div>  
      </div>
    </div>
  </div>
  <?php endif; ?>
</div>

<!-- Navigation -->
<div id="navigation" class="clearfix">
  <div class="content-wrapper">
  <div class="container">
    <div class="row">  
      <div class="menu-bar-wrapper"><div class="menu-bar"><span></span></div></div>
      <?php print render($page['navigation']); ?>
    </div>
  </div>
  </div>
</div>

<div id="page-title-wrapper" class="banner-top banner-lg text-center">
  <div class="container clearfix">
    <ol class="breadcrumb">
      <li><a href="/">Nhà</a></li>
      <li><a href="/khoa-hoc">Khóa học</a></li>
    </ol>
    
    <h1 class="page-title title"><?php print $title; ?></h1>

    <?php if (!empty($node->field_course_teacher[LANGUAGE_NONE])): ?>
    <div class="course-teacher-wrapper">
      <img class="course-teacher-thumb" src="<?php print image_style_url('crop_65x65', $node->field_course_teacher[LANGUAGE_NONE][0]['node']->field_photo[LANGUAGE_NONE][0]['uri']); ?>" alt="" />
      <span class="course-teacher-title">(<?php print $node->field_course_teacher[LANGUAGE_NONE][0]['node']->field_teacher_title[LANGUAGE_NONE][0]['value']; ?>)</span> <span class="course-teacher-name"><?php print $node->field_course_teacher[LANGUAGE_NONE][0]['node']->title; ?></span>
    </div>
    <?php endif; ?>
  </div>
</div>

<!-- Page -->
<div id="page" class="clearfix container page-content">
  <div class="row">
    <!-- Main content -->
    <div id="content" class="content-wrapper clearfix col-sm-8 col-md-9">
      <?php if ($action_links): ?><ul class="action-links"><?php print render($action_links); ?></ul><?php endif; ?>
      <?php if ($messages): ?>
      <div id="console" class="clearfix"><?php print $messages; ?></div>
      <?php endif; ?>
      <?php if($tabs) print render($tabs); ?>

      <!-- Content -->
      <?php print render($page['content']); ?>
    </div>

    <!-- Sidebar right -->
    <div id="right" class="sidebar right left-sidebar col-sm-4 col-md-3">
      <div class="sidebar-box">
        <div class="course-price">
          <span class="course-sell_price"><?php print uc_currency_format($node->sell_price); ?></span>
          <?php if (isset($node->save_price) and $node->save_price > 0): ?>
          <span class="course-list_price"><?php print uc_currency_format($node->list_price); ?></span>
          <!--<span class="course-save_price">Tiết kiệm: <?php //print uc_currency_format($node->save_price); ?></span>-->
          <?php endif; ?>
        </div>
        <div class="course-add-to-cart">
          <div id="course-buy-now" class="btn" nid="<?php print $node->nid; ?>">Mua ngay</div>
          <div id="course-add-to-cart" class="btn" nid="<?php print $node->nid; ?>">Thêm vào giỏ hàng</div>
          <ul>
            <li><?php print $node->course_subjects < 10 ? '0' . $node->course_subjects : $node->course_subjects; ?> bài giảng</li>
            <li><?php print preg_replace('/(00 giờ )|( 00 giây)/', '', custom_get_course_duration($node->nid, 'H \g\i\ờ i \p\h\ú\t s \g\i\â\y')); ?></li>
            <li>Mua một lần học trọn đời</li>
            <li>Học được trên mọi thiết bị</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <!-- Other courses -->
  <div class="course-relative-block">
    <h2>Khóa học liên quan</h2>
    <div class="content"><?php print views_embed_view('node_functions', 'block_80'); ?></div>
  </div>

  <div class="course-relative-block">
    <h2>Cùng diễn giả</h2>
    <div class="content"><?php print views_embed_view('node_functions', 'block_81', $node->field_course_teacher[LANGUAGE_NONE][0]['node']->nid, $node->nid); ?></div>
  </div>

  <div class="course-relative-block">
    <h2>Khóa học bán chạy nhất</h2>
    <div class="content"><?php print views_embed_view('node_functions', 'block_73'); ?></div>
  </div>
</div>
<!-- Newsletter -->
<div class="block-newsletter-wrapper">
  <div class="container clearfix">
    <?php $block = module_invoke('simplenews', 'block_view', 178); ?>
    <?php print render($block['content']); ?>
  </div>
</div>

<!-- Footer -->
<div id="footer" class="clearfix">
  <div class="footer-partner">
    <?php print render($page['footer_top']); ?>
  </div>
  <footer id="page-footer" class="th_page-footer">
    <div class="footer-top">
      <div class="container">
        <div class="row">
           <?php print render($page['footer']); ?>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container">
        <?php echo format_date(time(), 'custom', 'Y'); ?> Copyright &copy; CAUVONGXANH.NET
      </div>
    </div>
    <!-- Do not remove this -->
    <div id="googleSignIn" style="display: none;">Google Signin</div>
    <a href="/custom/password-form" style="display: none;" id="forgot-password">Forgot password</a>
  </footer>
</div>

<div class='dh-phone'>
  <a href="tel:0888561626" class="phone" rel="nofollow" title="Liên lạc điện thoại"><i class="fa fa-phone" aria-hidden="true"></i></a>
  <a href="http://zalo.me/1234567890" class="zalo" target="_blank" rel="nofollow" title="Gọi Zalo"><i class="fa fa-zalo" aria-hidden="true"></i></a>
  <a href="https://m.me/1234567890" class="fb" target="_blank" rel="nofollow" title="Nhắn tin Messenger"><i class="fa fa-messenger" aria-hidden="true"></i></a>
  <a href="/cart" rel="nofollow" title="Giỏ hàng"><i class="fa fa-shopping-cart" aria-hidden="true"></i></a>
  <a href="#" rel="nofollow" title="Thông tin khuyến mại"><i class="fa fa-calendar-check-o" aria-hidden="true"></i></a>
</div>
</div>