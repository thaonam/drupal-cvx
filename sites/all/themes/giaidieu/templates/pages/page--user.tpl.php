<?php 
drupal_add_css($directory . '/css/common.css', 'file');
drupal_add_css($directory . '/css/personal-page.css', 'file');
drupal_add_css($directory . '/less/user.css.less', 'file');
drupal_add_css($directory . '/assets/vendors/perfect-scrollbar/css/perfect-scrollbar.min.css', 'file');
drupal_add_js($directory . '/assets/vendors/perfect-scrollbar/js/perfect-scrollbar.jquery.min.js', 'file');
drupal_add_js($directory . '/assets/vendors/perfect-scrollbar/js/perfect-scrollbar.min.js', 'file');

if (arg(1) == 'shop' && arg(2) == 'product') {
  drupal_add_css($directory . '/css/personal-product', 'file');
}

// Load required functions.
module_load_include('inc', 'custom', 'custom');

$account = user_load($user->uid);

$avatar = (!empty($account->field_photo[LANGUAGE_NONE])) ? image_style_url('crop_65x65', $account->field_photo[LANGUAGE_NONE][0]['uri']) : '/' . $directory . '/images/anonymous.jpg';
$cover = (!empty($account->profile->field_cover_picture[LANGUAGE_NONE])) ? image_style_url('crop_250x165', $account->profile->field_cover_picture[LANGUAGE_NONE][0]['uri']) : '/' . $directory . '/images/users/user-cover1.jpg';

$percent = custom_user_profile_percentage($account);

$account_type = 'N/A';
if (!empty($account->field_account_type[LANGUAGE_NONE])) {
  $account_type = $account->field_account_type[LANGUAGE_NONE][0]['value'] == 1 ? t('doctor') : t('customer');
}

$total_unread_notifications = custom_user_count_unread_messages();
?>
<div class="page-wrapper user-wrapper">
  <div class="page-menu">
    <div class="logo-conner">
      <a href="<?php print $front_page; ?>"><img src="/<?php print $directory ?>/images/logo_app.svg" /></a>
    </div>

    <div class="perfect-scrollbar">
      <div class="user-cover">
        <div class="image-cover">
          <img src="<?php print $cover ?>" alt="<?php if (!empty($account->field_full_name)) print $account->field_full_name[LANGUAGE_NONE][0]['value']; ?>">
        </div>
        <div class="user-cover-avatar">
          <img src="<?php print $avatar; ?>" alt="<?php if (!empty($account->field_full_name)) print $account->field_full_name[LANGUAGE_NONE][0]['value']; ?>">
        </div>
        <div class="user-cover-name"><?php if (!empty($account->field_full_name)) print $account->field_full_name[LANGUAGE_NONE][0]['value']; ?></div>
      </div>

      <div class="account-complete clearfix">
        <div class="progress">
          <div class="progress-bar" role="progressbar" aria-valuenow="<?php print $percent; ?>"
               aria-valuemin="0" aria-valuemax="100" style="width:<?php print $percent; ?>%">
            <span class="sr-only"><?php print $percent; ?>%</span>
          </div>
        </div>
        <div class="title">Hoàn thành</div>
        <div class="number"><?php print $percent; ?>%</div>
      </div>

      <?php if (!empty($page['user_nav'])): ?>
        <div class="user-manage">
          <?php print render($page['user_nav']); ?>
        </div>
      <?php endif; ?>
    </div>
  </div> <!-- / .page-menu --> 

  <div class="page-personal">
    <div class="header-personal">
      <div class="page-menu-bar"><span></span></div>
      <div class="header-intro"><?php print $site_name; ?></div></a>
      <div class="header-right">
        <div class="message-notice">
          <a href="/user/notification"><i class="fa fa-envelope" aria-hidden="true"></i></a>
          <span class="number"><?php echo $total_unread_notifications > 0 ? $total_unread_notifications : ''; ?></span>
        </div>
        <div class="logout">
         <a href="/user/logout">Đăng xuất</a>
        </div>
      </div>
    </div> <!-- / .header-personal -->
    <?php print render($title_prefix); ?>
    <?php if ($title): ?>
      <h1 class="page-personal-title">Bạn đang đăng nhập dưới tên: <b><?php print $account->name; ?></b> - Loại tài khoản: <b><?php echo $account_type; ?></b></h1>
    <?php endif; ?>
    <?php print render($title_suffix); ?>

    <div class="page-personal-content perfect-scrollbar">
      <?php if ($messages): ?>
        <div id="console" class="messages clearfix"><?php print $messages; ?></div>
      <?php endif; ?>

      <div class="personal-box">
        <?php if (arg(1) == 'notification'): ?>
        <div class="profile">
          <h2 class="block-title">Thông báo từ CAUVONGXANH</h2>
          <?php print render($page['content']) ?>
        </div>
        <?php elseif (arg(0) == 'wishlist'): ?>
        <div class="profile">
          <h2 class="block-title">Sản phẩm / Dịch vụ yêu thích</h2>
          <?php print render($page['content']) ?>
        </div>
        <?php elseif (arg(1) == 'orders' and arg(2) == 'history'): ?>
        <div class="profile">
          <h2 class="block-title">Lịch sử giao dịch</h2>
          <?php print render($page['content']) ?>
        </div>
        <?php elseif (arg(1) == 'orders' and arg(2) == 'view'): ?>
        <div class="profile">
          <h2 class="block-title">Danh sách đơn hàng</h2>
          <?php print render($page['content']) ?>
        </div>
        <?php elseif (arg(1) == 'activities' and !arg(2)): ?>
        <div class="profile">
          <h2 class="block-title">Nhật ký hoạt động</h2>
          <?php print render($page['content']) ?>
        </div>
        <?php else: ?>
        <?php print render($page['content']) ?>
        <?php endif; ?>
      </div>

      <div class="footer-copyright"><?php echo format_date(time(), 'custom', 'Y'); ?> Copyright © CAUVONGXANH.NET</div>
    </div><!--  / .page-personal -->
  </div>
</div>
