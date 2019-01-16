<?php /* Mail function handler made by giaidieu.com. */

/**
 * Generate mail message and return.
 */
function custom_mail_get_message($key, &$message, $params) {
	switch($key) {
	  case 'custom_user_video_course_code':
      $site_name = variable_get('site_name', 'CAUVONGXANH');
      
      $body_message = "";
  		$body_message .= "Xin chào bạn,<br /><br />";
      $body_message .= "Cám ơn bạn rất nhiều đã đăng ký tham gia khóa học '" . $params['product']->title . "' tại CAUVONGXANH.<br /><br />";
      $body_message .= 'Vui lòng sử dụng mã dưới đây để xem toàn bộ những video trong khóa học khi được hỏi yêu cầu nhập:' . "<br /><br />";
      $body_message .= "Mã xem video: " . $params['code'] . "<br /><br />";
      $body_message .= "--<br />" . $site_name . "<br />http://cauvongxanh.net<br />";

  		$message['subject'] = '[CAUVONGXANH] - Thông tin khóa học: ' . $params['product']->title;
      $message['body'][] = $body_message;

      break;
   
	  case 'custom_user_create_social_confirm':
      $site_name = variable_get('site_name', 'CAUVONGXANH');
      
      $body_message = "";
  		$body_message .= "Xin chào " . $params['account']->field_full_name[LANGUAGE_NONE][0]['value'] . ",<br /><br />";
      $body_message .= "Chúng tôi xác nhận tài khoản của bạn đã được tạo thành công qua mạng xã hội và có thể sử dụng để đăng nhập vào CAUVONGXANH ngay bây giờ.<br /><br />";
      $body_message .= 'Bạn có thể sử dụng chức năng Đăng nhập qua mạng xã hội hoặc tài khoản dưới đây:' . "<br /><br />";
      $body_message .= "Tên truy nhập: " . $params['account']->name . "<br />";
      $body_message .= "Mật khẩu: " . $params['account']->plain_pass . "<br /><br />";
      $body_message .= "--<br />" . $site_name . "<br />http://cauvongxanh.net<br />";

  		$message['subject'] = '[CAUVONGXANH] - Thông tin tài khoản mới';
      $message['body'][] = $body_message;

      break;

	  case 'custom_user_password_change_confirm':
      $site_name = variable_get('site_name', 'CAUVONGXANH');
      
      $body_message = "";
  		$body_message .= "Xin chào " . $params['account']->field_full_name[LANGUAGE_NONE][0]['value'] . ",<br /><br />";
      $body_message .= "Chúng tôi xác nhận mật khẩu của bạn đã được đổi thành công và có thể sử dụng để đăng nhập vào CAUVONGXANH ngay bây giờ.<br /><br />";
      $body_message .= 'Cám ơn bạn rất nhiều đã sử dụng dịch vụ của chúng tôi.' . "<br /><br />";
      $body_message .= "--<br />" . $site_name . "<br />http://cauvongxanh.net<br />";

  		$message['subject'] = '[CAUVONGXANH] - Đổi mật khẩu tài khoản thành công';
      $message['body'][] = $body_message;

      break;

	  case 'custom_user_create_activation_confirm':
      $site_name = variable_get('site_name', 'CAUVONGXANH');
      
      $body_message = "";
  		$body_message .= "Xin chào " . $params['account']->field_full_name[LANGUAGE_NONE][0]['value'] . ",<br /><br />";
      $body_message .= "Chúng tôi xác nhận tài khoản của bạn đã được kích hoạt thành công và có thể sử dụng để đăng nhập vào CAUVONGXANH ngay bây giờ.<br /><br />";
      $body_message .= 'Cám ơn bạn rất nhiều đã sử dụng dịch vụ của chúng tôi.' . "<br /><br />";
      $body_message .= "--<br />" . $site_name . "<br />http://cauvongxanh.net<br />";

  		$message['subject'] = '[CAUVONGXANH] - Kích hoạt tài khoản mới thành công';
      $message['body'][] = $body_message;

      break;
   
	  case 'custom_user_create_activation_required':
      $site_name = variable_get('site_name', 'CAUVONGXANH');
      
      $body_message = "";
  		$body_message .= "Xin chào " . $params['account']->field_full_name[LANGUAGE_NONE][0]['value'] . ",<br /><br />";
      $body_message .= "Cám ơn bạn rất nhiều đã đăng ký trên CAUVONGXANH.<br /><br />Vui lòng sử dụng mã dưới đây để kích hoạt tài khoản (Bỏ qua nếu đây không phải là đăng ký từ bạn, mã sẽ tự động hết hạn sau 30 phút).<br /><br />";
      $body_message .= 'Mã sử dụng một lần: ' . $params['account']->field_otp_code[LANGUAGE_NONE][0]['value'] . "<br /><br />";
      $body_message .= "--<br />" . $site_name . "<br />http://cauvongxanh.net<br />";

  		$message['subject'] = '[CAUVONGXANH] - Yêu cầu xác nhận đăng ký tài khoản mới';
      $message['body'][] = $body_message;
      
	    break;

	  case 'custom_user_password_request_confirm':
      $site_name = variable_get('site_name', 'CAUVONGXANH');
      
      $body_message = "";
  		$body_message .= "Xin chào " . $params['account']->field_full_name[LANGUAGE_NONE][0]['value'] . ",<br /><br />";
      $body_message .= "Chúng tôi nhận được yêu cầu đổi mật khẩu mới từ bạn.<br /><br />Vui lòng sử dụng mã dưới đây để xác nhận (Bỏ qua nếu đây không phải là yêu cầu từ bạn, mã sẽ tự động hết hạn sau 30 phút).<br /><br />";
      $body_message .= 'Mã sử dụng một lần: ' . $params['account']->field_otp_code[LANGUAGE_NONE][0]['value'] . "<br /><br />";
      $body_message .= "--<br />" . $site_name . "<br />http://cauvongxanh.net<br />";

  		$message['subject'] = '[CAUVONGXANH] - Yêu cầu xác nhận đổi mật khẩu';
      $message['body'][] = $body_message;
      
	    break;
	}
}