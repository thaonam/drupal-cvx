<?php
$form_elm = drupal_get_form('custom_create_empty_form');
//unset($form_elm['body']['format']);
unset($form_elm['body']['value']['#description']);
$form_body = $form_elm['body'];

// Load cities.
$result = views_get_view_result('drupalapp_taxonomy_functions', 'page', 'cities');
$cities = array();
  
foreach ($result as $row) {
  $cities[$row->tid] = $row->taxonomy_term_data_name;
}

// Make birthdate.
$year_from = format_date(time(), 'custom', 'Y') - 70;
$year_to = format_date(time(), 'custom', 'Y') - 16;

$day = 0;
$month = 0;
$year = 0;

if (!empty($account->field_birthdate[LANGUAGE_NONE])) {
  $timestamp = strtotime($account->field_birthdate[LANGUAGE_NONE][0]['value']);
  
  $day = format_date($timestamp, 'custom', 'j');
  $month = format_date($timestamp, 'custom', 'n');
  $year = format_date($timestamp, 'custom', 'Y');
}

// Load avatar / cover.
if (!empty($account->field_photo[LANGUAGE_NONE])) {
  $avatar = $account->field_photo[LANGUAGE_NONE][0]['url'];
}
else{
  $avatar = '/sites/all/themes/giaidieu/images/anonymous.jpg';
}

if (!empty($account->profile->field_cover_picture[LANGUAGE_NONE])) {
  $cover = image_style_url('cover_500x330', $account->profile->field_cover_picture[LANGUAGE_NONE][0]['uri']);
}
else{
  $cover = '/sites/all/themes/giaidieu/images/users/user-cover1.jpg';
}

?>
<div class="profile">
  <h2 class="block-title">Cập nhật hồ sơ</h2>

  <div class="personal-info clearfix">
    <div class="info-left" id="custom-user-edit-form-wrapper">
      <table class="personal-info-table">
        <tr class="heading">
          <td>&nbsp;</td>
          <td>Thông tin căn bản</td>
        </tr>
        <tr>
          <td>Họ và tên *</td>
          <td><input type="text" value="<?php if (!empty($account->profile->title)) print $account->profile->title; ?>" name="fullname" /></td>
        </tr>
        <tr>
          <td>Sinh nhật</td>
          <td class="birthdate">
            <label>Ngày:</label>
            <select name="day">
              <option value="0">- Chọn -</option>
              <?php for ($i = 1; $i <= 31; $i++): ?>
              <option value="<?php echo $i; ?>"<?php if ($day == $i): echo ' selected="selected"'; endif; ?>><?php echo $i; ?></option>
              <?php endfor; ?>
            </select>
            
            <label>Tháng:</label>
            <select name="month">
              <option value="0">- Chọn -</option>
              <?php for ($i = 1; $i <= 12; $i++): ?>
              <option value="<?php echo $i; ?>"<?php if ($month == $i): echo ' selected="selected"'; endif; ?>><?php echo $i; ?></option>
              <?php endfor; ?>
            </select>

            <label>Năm:</label>
            <select name="year">
              <option value="0">- Chọn -</option>
              <?php for ($i = $year_from; $i <= $year_to; $i++): ?>
              <option value="<?php echo $i; ?>"<?php if ($year == $i): echo ' selected="selected"'; endif; ?>><?php echo $i; ?></option>
              <?php endfor; ?>
            </select>
          </td>
        </tr>

        <tr class="heading">
          <td>&nbsp;</td>
          <td>Hình ảnh</td>
        </tr>
        <tr>
          <td>Ảnh avatar</td>
          <td class="file_upload">
            <div class="images_list">
              <div class="photo-thumb-wrapper avatar"><img src="<?php echo $avatar; ?>" class="photo-thumb-avatar" fid="0" /></div>
              <div id="avatar-image-add">Đổi ảnh</div>
            </div>
            <input type="file" name="avatar_image" id="avatar-image" class="uc_file" />
          </td>
        </tr>
        <tr>
          <td>Ảnh cover</td>
          <td class="file_upload">
            <div class="images_list">
              <div class="photo-thumb-wrapper cover"><img src="<?php echo $cover; ?>" class="photo-thumb-cover" fid="0" /></div>
              <div id="cover-image-add">Đổi ảnh</div>
            </div>
            <input type="file" name="cover_image" id="cover-image" class="uc_file" />
          </td>
        </tr>

        <tr class="heading">
          <td>&nbsp;</td>
          <td>Thông tin liên lạc</td>
        </tr>
        <tr>
          <td>Số di động *</td>
          <td><input <?php if (!empty($account->field_mobile_number[LANGUAGE_NONE])): echo 'disabled="disabled"'; endif; ?> type="text" value="<?php if (!empty($account->field_mobile_number[LANGUAGE_NONE])) print $account->field_mobile_number[LANGUAGE_NONE][0]['value']; ?>" name="mobile" /></td>
        </tr>
        <tr>
          <td>E-mail *</td>
          <td><input <?php if (!empty($account->mail)): echo 'disabled="disabled"'; endif; ?> type="text" value="<?php print $account->mail; ?>" name="email" /></td>
        </tr>
        <tr>
          <td>Thành phố / Tỉnh thành *</td>
          <td>
            <select name="city">
              <option value="0">- Chọn -</option>
              <?php foreach ($cities as $tid => $name): ?>
              <?php if (!empty($account->field_cities[LANGUAGE_NONE]) and $account->field_cities[LANGUAGE_NONE][0]['tid'] == $tid): ?>
              <option value="<?php echo $tid; ?>" selected="selected"><?php echo $name; ?></option>
              <?php else: ?>
              <option value="<?php echo $tid; ?>"><?php echo $name; ?></option>
              <?php endif; ?>
              <?php endforeach; ?>
            </select>
          </td>
        </tr>

        <?php if (!empty($account->field_account_type) && $account->field_account_type[LANGUAGE_NONE][0]['value'] == 1): ?>
        <tr>
          <td>Nguyên quán</td>
          <td><input type="text" value="<?php if (!empty($account->profile->field_address[LANGUAGE_NONE])) print $account->profile->field_address[LANGUAGE_NONE][0]['value']; ?>" name="address" /></td>
        </tr>
        <tr>
          <td>Địa chỉ giao dịch hiện tại</td>
          <td><input type="text" value="<?php if (!empty($account->profile->field_current_address[LANGUAGE_NONE])) print $account->profile->field_current_address[LANGUAGE_NONE][0]['value']; ?>" name="current_address" /></td>
        </tr>
        <tr>
          <td>Địa chỉ Facebook</td>
          <td><input type="text" value="<?php if (!empty($account->profile->field_social_address[LANGUAGE_NONE])) print $account->profile->field_social_address[LANGUAGE_NONE][0]['url']; ?>" name="facebook_page" /><br /><div class="desc">Nhập link dẫn tới trang Facebook cá nhân hoặc cty của bạn.</div></td>
        </tr>
        <tr>
          <td>Chat Skype</td>
          <td><input type="text" value="<?php if (!empty($account->profile->field_skype_id[LANGUAGE_NONE])) print $account->profile->field_skype_id[LANGUAGE_NONE][0]['value']; ?>" name="skype_id" /><div class="desc">Nhập Skype id của bạn.</div></td>
        </tr>

        <tr class="heading">
          <td>&nbsp;</td>
          <td>Giới thiệu / Mô tả</td>
        </tr>
        <tr>
          <td>Giới thiệu chi tiết</td>
          <!--<td class="textarea-wrapper"><textarea class="rich_text_enabled" name="description" id="field_user_description" rows="5">--><?php //echo ($account and !empty($account->field_user_description[LANGUAGE_NONE])) ? $account->field_user_description[LANGUAGE_NONE][0]['value'] : ''; ?><!--</textarea></td>-->
          <td class="textarea-wrapper">
            <?php
            $form_elm['description'] = $form_body;
            $form_elm['description']['#id'] = 'description_wrapper';
            $form_elm['description']['value']['#id'] = 'field_user_description';
            $form_elm['description']['value']['#name'] = 'description';
            $form_elm['description']['value']['#value'] = '';
            
            //dsm($form_elm['description']);
            if (!empty($account->field_user_description[LANGUAGE_NONE]) and isset($account->field_user_description[LANGUAGE_NONE][0]['value'])) {
              $form_elm['description']['value']['#value'] = $account->field_user_description[LANGUAGE_NONE][0]['value'];
            }
            print drupal_render($form_elm['description']);
            ?>
          </td>
        </tr>
        <?php else: ?>
        <tr>
          <td>Địa chỉ</td>
          <td><input type="text" value="<?php if (!empty($account->profile->field_address[LANGUAGE_NONE])) print $account->profile->field_address[LANGUAGE_NONE][0]['value']; ?>" name="address" /></td>
        </tr>
        <?php endif; ?>
        
        <tr>
          <td>&nbsp;</td>
          <td>
            <input type="hidden" name="uid" value="<?php print $account->uid; ?>" />
            <input type="submit" name="submit" value="Cập nhật" class="btn btn-success form-submit" onclick="custom_user_form_submit();" />
          </td>
        </tr>
        
      </table> <!-- / .personal-info-table -->
    </div>
  </div> <!-- / .personal-info -->
</div>