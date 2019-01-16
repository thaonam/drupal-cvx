<?php /* Profile alert popup tempalte */
$profile_complete_percent = (int) custom_user_profile_percentage($account);
$name = !empty($account->field_full_name[LANGUAGE_NONE]) ? $account->field_full_name[LANGUAGE_NONE][0]['value'] : $account->name;
?>
<div id="custom-profile-alert-popup-wrapper" class="dialog-popup">
  <h3 class="title">Xin chào <?php echo $name; ?>!</h3>
  <!-- Thông báo cho NCC -->
  <?php if (!empty($account->field_account_type) && $account->field_account_type['und'][0]['value'] == 1): ?>
  	<div class="content">Bạn đã hoàn thành <strong><?php echo $profile_complete_percent; ?>%</strong> Trang Cá Nhân. Vui lòng hoàn thành 100% Trang Cá Nhân để tăng cơ hội tiếp thị và bán hàng trên App!</div>
  	<!-- Thông báo cho KH -->
  <?php else: ?>
	  <div class="content">Hồ sơ đăng ký của bạn tại Tass Care hiện đạt <strong><?php echo $profile_complete_percent; ?>%</strong>. Xin vui lòng vào trang Cập Nhật Hồ Sơ để điền toàn bộ thông tin còn thiếu. Việc điền đầy đủ thông tin sẽ giúp giao dịch của bạn với Tass Care và những thành viên khác trở nên dễ dàng và tin cậy hơn.</div>
	<?php endif; ?>
  <div class="buttons">
    <input type="button" name="ok" value="Vào cập nhật hồ sơ" class="btn btn-success form-submit" onclick="document.location.href='/user/profile';" />
    <input type="button" name="cancel" value="Bỏ qua, cập nhật sau" class="btn btn-cancel form-submit" onclick="custom_dialog_close(this);" />
  </div>
</div>