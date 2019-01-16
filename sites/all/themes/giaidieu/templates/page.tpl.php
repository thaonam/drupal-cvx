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
$show_title = TRUE;
global $base_url;
global $base_path;

if (isset($node)) {
  if ($node->type == 'landing_page') {
    $show_title = FALSE;
    if (!empty($node->field_show_title))
      if ($node->field_show_title['und'][0]['value'] == 1)
        $show_title = TRUE;
  }
}
/*$show_suggestions = (!empty($_SESSION['suggestions_1510'])) ? true : false;
if (!drupal_is_front_page() || !isset($user->roles[4])) {
  $show_suggestions = true;
}*/
?>
<div id="page-wrapper" class="<?php if ($page['left']): echo ' sidebar-left'; endif; ?><?php if ($page['right']): echo ' sidebar-right'; endif; ?> <?php echo $vocabulary_class;?>">
<!-- Header -->
<div id="header" class="clearfix">

<!--  --><?php //if ($page['top_header']): ?>
<!--    <div class="header-top">-->
<!--      <div class="container">-->
<!--        <div class="row">-->
<!--          --><?php //print render($page['top_header']); ?>
<!--        </div>-->
<!--      </div>-->
<!--    </div>    -->
<!--  --><?php //endif; ?>
  <!-- / top header -->

  <?php if ($page['header']): ?>
  <div id="header-content">
    <div class="container">
      <div class="row header">
<!--         <div id="logo"><a href="/" title="<?php echo t('Back to Homepage'); ?>"><img src="<?php echo $logo; ?>" alt="Cầu Vồng Xanh logo" /></a></div> -->

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

<?php print render($title_prefix); ?>
<?php if ($title && $show_title): ?>
  <div id="page-title-wrapper" class="banner-top banner-lg text-center"><div class="container clearfix">
    <h1 class="page-title title"><?php print $title; ?></h1>
  </div></div>
<?php endif; ?>
<?php print render($title_suffix); ?>

<?php if (!empty($page['slideshow'])): ?>
  <div id="slideshow" class="clearfix">
    <?php print render($page['slideshow']); ?>
  </div>
<?php endif; ?>
<!-- Slideshow -->

<!-- Page -->
<div id="page" class="clearfix container page-content">
  <?php if($breadcrumb) print render($breadcrumb); ?>
  <?php if ($page['content_above']) print render($page['content_above']); ?>
  <div class="<?php print ($page['left'] || $page['right']) ? 'row' : 'clearfix'; ?>">
    <?php
    $content_classes = '';
    if ($page['left']) $content_classes = 'col-sm-9 col-sm-push-3';
    if ($page['right']) $content_classes = 'col-sm-8 col-md-9';
    ?>
    <div id="content" class="content-wrapper clearfix <?php print $content_classes; ?>">
      <?php if ($is_front): ?>
        <?php hide($page['content']['system_main']); ?>

      <?php else: ?>

      <?php endif; ?>

      <?php if ($action_links): ?><ul class="action-links"><?php print render($action_links); ?></ul><?php endif; ?>

      <?php if ($messages): ?>
      <div id="console" class="clearfix"><?php print $messages; ?></div>
      <?php endif; ?>
      <?php if($tabs) print render($tabs); ?>
      

      <?php print render($page['content']); ?>
    </div>

    <?php if ($page['left']): ?>
      <div id="left" class="sidebar left left-sidebar col-sm-3 col-sm-pull-9">
        <?php print render($page['left']); ?>
      </div>
    <?php endif; ?>

    <?php if ($page['right']): ?>
    <div id="right" class="sidebar right left-sidebar col-sm-4 col-md-3">
    <?php print render($page['right']); ?>
    </div>
    <?php endif; ?>
  </div>
  <?php if ($page['content_below']) print render($page['content_below']); ?>
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
        <?php echo format_date(time(), 'custom', 'Y'); ?> Copyright &copy; AN BAO THANH SERVICE TRADING CORP - Reg No. 0314856137</div>
    </div>
    <!-- Do not remove this -->
    <div id="googleSignIn" style="display: none;">Google Signin</div>
    <a href="/custom/password-form" style="display: none;" id="forgot-password">Forgot password</a>
    <!-- <button id = "open-first-login">Popup chọn lần đầu</button> -->
  </footer>
</div>

<?php if ($node->type == 'video'): ?>
<div class='dh-phone'>
  <a href="tel:0888561626" class="phone" rel="nofollow" title="Liên lạc điện thoại"><i class="fa fa-phone" aria-hidden="true"></i></a>
  <a href="http://zalo.me/1234567890" class="zalo" target="_blank" rel="nofollow" title="Gọi Zalo"><i class="fa fa-zalo" aria-hidden="true"></i></a>
  <a href="https://m.me/1234567890" class="fb" target="_blank" rel="nofollow" title="Nhắn tin Messenger"><i class="fa fa-messenger" aria-hidden="true"></i></a>
  <a href="/cart" rel="nofollow" title="Giỏ hàng"><i class="fa fa-shopping-cart" aria-hidden="true"></i></a>
  <a href="#" rel="nofollow" title="Thông tin khuyến mại"><i class="fa fa-calendar-check-o" aria-hidden="true"></i></a>
</div>
<?php else: ?>
<div class='dh-phone'>
  <?php if (isset($node) and $node->nid == 4515): ?>
  <a href="tel:0888561626" class="phone" rel="nofollow" title="Liên lạc điện thoại"><i class="fa fa-phone" aria-hidden="true"></i></a>
  <a href="http://zalo.me/1234567890" class="zalo" target="_blank" rel="nofollow" title="Gọi Zalo"><i class="fa fa-zalo" aria-hidden="true"></i></a>
  <a href="https://m.me/1234567890" class="fb" target="_blank" rel="nofollow" title="Nhắn tin Messenger"><i class="fa fa-messenger" aria-hidden="true"></i></a>

  <?php else: ?>

  <a href="tel:0888.56.16.26">
    <div class="quick-alo-ph-circle"></div>
    <div class="quick-alo-ph-circle-fill"></div>
    <div class="quick-alo-ph-img-circle"></div>
  </a>
  <?php endif; ?>
</div> <!-- / .dh-phone -->
<?php endif; ?>

<?php if ($show_suggestions && drupal_is_front_page()): ?>
<div id = "first-login" title = "<?php echo t("Cài đặt thông báo"); ?>" style="display: none;">
  <?php
    $blockLoad = block_load('webform','client-block-1510');
    if ($blockLoad) {
      $block_content = _block_render_blocks(array($blockLoad));
      $blockBuild = _block_get_renderable_array($block_content);
      print drupal_render($blockBuild);
    } ?>
 </div>
<?php endif; ?>
  
</div>

<?php //if (!empty($node)) if (in_array($node->type, array('product', 'service', 'video', 'article'))): ?>
  <!--G+-->
  <script src="https://apis.google.com/js/platform.js" async defer>
    {lang: 'vi', parsetags: 'explicit'}
  </script>
  <!--Zalo share-->
  <script src="https://sp.zalo.me/plugins/sdk.js"></script>
  <!--FB-->
  <div id="fb-root"></div>
  <script>(function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = 'https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v2.11&appId=864607300274479';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));</script>
<?php //endif; ?>
