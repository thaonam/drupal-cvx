<?php /* Login form template created by giaidieu.com */ 
?>
<div id="custom-login-form-wrapper" class="login-register-modal">
	
  <ul class="custom-social-list">
    <li rel="facebook" id="facebookSignin">f</li>
    <li rel="google" id="googleSignInHandler">G+</li>
    <li rel="zalo" id="zaloSignin">Zalo</li>
  </ul>

  <div class="dh-form-title">Đăng nhập</div>
  
  <p class="row"><input type="text" name="username" placeholder="Tên truy nhập *" value="" /></p>
  <p class="row"><input type="password" name="password" placeholder="Mật khẩu *" value="" /></p>
  <p class="row"><input type="submit" name="submit" value="Đăng nhập" class="btn btn-success form-submit" onclick="custom_login_form_submit();" /></p>
  <p class="row dh-login-action"><a href="#" onclick="custom_to_register_form(); return false;">Đăng ký tài khoản</a> <a href="#" onclick="custom_to_password_form(); return false;">Quên mật khẩu?</a></p>
</div>