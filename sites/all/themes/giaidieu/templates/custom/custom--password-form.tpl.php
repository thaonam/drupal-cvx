<?php /* Password form template created by giaidieu.com */ 
?>
<div id="custom-password-form-wrapper" class="login-register-modal">
  <ul class="custom-social-list">
    <li rel="facebook" id="facebookSignin">f</li>
    <li rel="google" id="googleSignInHandler">G+</li>
    <li rel="zalo" id="zaloSignin">Zalo</li>
  </ul>
  
  <div class="custom-form step-1 active">
    <p class="row"><input type="text" name="username" placeholder="Tên truy nhập Hoặc Địa chỉ e-mail *" value="" /></p>
    <p class="row"><input type="submit" name="submit" value="Yêu cầu mật khẩu mới" class="btn btn-success form-submit" onclick="custom_password_form_submit();" /></p>
  </div>

  <div class="custom-form step-2">
    <p class="row desc"></p>
    <p class="row"><input type="text" name="code" placeholder="Mã xác nhận gồm 6 chữ số *" value="" /></p>
    <p class="row">
      <input type="submit" name="submit" value="Xác nhận" class="btn btn-success form-submit" onclick="custom_password_confirm_form_submit();" />
    </p>
  </div>

  <div class="custom-form step-3">
    <p class="row desc"></p>
    <p class="row"><input type="password" name="password" placeholder="Mật khẩu mới *" value="" /></p>
    <p class="row"><input type="password" name="password_confirm" placeholder="Xác nhận mật khẩu *" value="" /></p>
    <p class="row">
      <input type="submit" name="submit" value="Đổi mật khẩu" class="btn btn-success form-submit" onclick="custom_password_change_form_submit();" />
    </p>
  </div>

  <div class="custom-form step-4">
    <div class="alert alert-block alert-success messages status desc">Đổi mật khẩu thành công! Nhấn nút dưới đây để vào trang Đăng nhập.</div>
    <p class="row">
      <input type="submit" name="submit" value="Về trang Đăng nhập" class="btn btn-success form-submit" onclick="custom_password_to_login_form();" />
    </p>
  </div>

  <input type="hidden" name="uid" value="" />
  <input type="hidden" name="confirmed_code" value="" />
</div> 