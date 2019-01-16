<?php /* Password edit form template created by giaidieu.com */ 
?>
<div class="profile">
  <h2 class="block-title">Đổi mật khẩu</h2>

 <div id="custom-password-edit-form-wrapper">
  <table class="personal-info-table">
    <tr>
      <td>Mật khẩu cũ *</td>
      <td><input type="password" name="old_pass" value="" /></td>
    </tr>
    <tr>
      <td>Mật khẩu mới *</td>
      <td><input type="password" name="password" value="" /></td>
    </tr>
    <tr>
      <td>Xác nhận mật khẩu *</td>
      <td><input type="password" name="password_confirm" value="" /></td>
    </tr>
    <tr>
      <td>&nbsp;</td>
      <td>
        <input type="hidden" name="uid" value="<?php echo $user->uid; ?>" />
        <input type="submit" name="submit" value="Cập nhật" class="btn btn-success form-submit" onclick="custom_password_edit_form_submit();" />
      </td>
    </tr>
  </table>
 </div>
</div>