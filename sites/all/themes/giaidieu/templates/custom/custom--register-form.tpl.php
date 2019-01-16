<?php /* Register form template created by giaidieu.com */ 
?>
<div id="custom-register-form-wrapper" class="login-register-modal">
  <ul class="custom-social-list">
    <li rel="facebook" id="facebookSignin">f</li>
    <li rel="google" id="googleSignInHandler">G+</li>
    <li rel="zalo" id="zaloSignin">Zalo</li>
  </ul>

  <div class="custom-form step-1 active">
    <div class="account-type-select">
      <div class="title">Bạn là: </div>  
      <input type="radio" id="type_customer" value="0" name="account_type" onclick="custom_account_type_changes(this, 0);" />
      <label for="type_customer">Khách hàng</label>
      <input type="radio" id="type_doctor" value="1" name="account_type" onclick="custom_account_type_changes(this, 1);" />
      <label for="type_doctor">Bác sỹ</label>
    </div>

    <p class="row"><input type="text" name="fullname" value="" placeholder="Họ và tên *" /></p>
    <p class="row"><input type="text" name="mobile" value="" placeholder="Số di động *" /></p>
    <p class="row">
      <select name="city">
        <option value="0" selected="selected">Thành phố / Tỉnh thành *</option>
        <?php foreach ($cities as $tid => $name): ?>
        <option value="<?php echo $tid; ?>"><?php echo $name; ?></option>
        <?php endforeach; ?>
      </select>
    </p>
    <p class="row"><input type="text" name="username" value="" placeholder="Tên truy nhập *" /></p>
    <p class="row"><input type="text" name="email" value="" placeholder="Địa chỉ E-mail *" /></p>
    <p class="row"><input type="password" name="password" value="" placeholder="Mật khẩu *" /></p>
    <p class="row"><input type="password" name="password_confirm" value="" placeholder="Xác nhận mật khẩu *" /></p>
    <p class="row"><input type="submit" name="submit" value="Tạo tài khoản mới" class="btn btn-success form-submit" onclick="custom_register_form_submit();" /></p>
  </div>

  <div class="custom-form step-2">
    <p class="row desc">Tài khoản đã được tạo nhưng cần xác nhận. Vui lòng kiểm tra e-mail của bạn để lấy mã xác nhận nhập vào hộp dưới đây.</p>
    <p class="row"><input type="text" name="code" placeholder="Mã xác nhận gồm 6 chữ số *" value="" /></p>
    <p class="row">
      <input type="submit" name="submit" value="Xác nhận" class="btn btn-success form-submit" onclick="custom_register_confirm_form_submit();" />
    </p>
  </div>

  <div class="custom-form step-3">
    <div class="alert alert-block alert-success messages status desc">Kích hoạt tài khoản mới thành công! Nhấn nút dưới đây để vào trang Đăng nhập.</div>
    <p class="row">
      <input type="submit" name="submit" value="Về trang Đăng nhập" class="btn btn-success form-submit" onclick="custom_register_to_login_form();" />
    </p>
  </div>
  
  <input type="hidden" name="uid" value="" />
</div>