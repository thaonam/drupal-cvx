<?php /* Template for user-settings form created by giaidieu.com */
  $account = user_load($user->uid);
?>
<div class="profile">
  <h2 class="block-title">Thiết lập tùy chọn của <?php echo $account->field_account_type[LANGUAGE_NONE][0]['value'] == 0 ? t('customer') : t('doctor'); ?></h2>

 <div id="custom-user-settings-form-wrapper" class="custom-form-wrapper">
  <table class="personal-info-table">
    <tr>
      <td>Phân quyền</td>
      <td>
        <p><input onclick="custom_user_settings_admin_permission_check(this);" type="checkbox" name="admin_permission" value="1" <?php echo (!empty($account->field_admin_permission[LANGUAGE_NONE]) and $account->field_admin_permission[LANGUAGE_NONE][0]['target_id'] > 0) ? 'checked="checked"' : ''; ?> /> Cho phép TASSCARE quản lý nội dung (tạo mới, biên tập nội dung sản phẩm, dịch vụ..)</p>
        <p>
          <select name="admin_uid" <?php echo (!empty($account->field_admin_permission[LANGUAGE_NONE]) and $account->field_admin_permission[LANGUAGE_NONE][0]['target_id'] > 0) ? '' : 'disabled="disabled"'; ?>>
            <option value="0">- Chọn Trong Danh Sách -</option>
            <?php foreach ($admin_list as $row): ?>
            <?php if (!empty($account->field_admin_permission[LANGUAGE_NONE]) and $account->field_admin_permission[LANGUAGE_NONE][0]['target_id'] == $row['uid']): ?>
            <option selected="selected" value="<?php echo $row['uid']; ?>"><?php echo $row['username'] . ' (' . $row['mail'] . ')'; ?></option>
            <?php else: ?>
            <option value="<?php echo $row['uid']; ?>"><?php echo $row['username'] . ' (' . $row['mail'] . ')'; ?></option>
            <?php endif; ?>
            <?php endforeach; ?>
          </select>
        </p>
      </td>
    </tr>
    <tr>
      <td>URL riêng (sub-domain)</td>
      <td>
        <p>
          Bạn có thể lựa chọn 1 URL riêng dạng sub-domain để gửi tới khách hàng truy cập vào trang cá nhân của mình dễ dàng hơn.<br />
          <?php if ($subdomain): ?>
          <?php $url = 'http://' . $subdomain->subdomain . '.' . $_SERVER['SERVER_NAME']; ?>
          <strong>URL hiện tại:</strong> <a class="link-highlight" title="Nhấn để mở xem" href="<?php echo $url; ?>" target="_blank"><?php echo $url; ?></a>
          <?php endif; ?>
        </p>
        <p>
          <input name="user_subdomain" value="<?php echo (!empty($account->field_subdomain[LANGUAGE_NONE])) ? $account->field_subdomain[LANGUAGE_NONE][0]['value'] : ''; ?>" placeholder="Tên SUBDOMAIN" /> <span class="suffix">.<?php echo $_SERVER['SERVER_NAME']; ?></span>
        </p>
      </td>
    </tr>
    
    <tr>
      <td>&nbsp;</td>
      <td>
        <input type="hidden" name="uid" value="<?php echo $user->uid; ?>" />
        <input type="submit" name="submit" value="Lưu thiết lập" class="btn btn-success form-submit" onclick="custom_user_settings_form_submit(this);" />
      </td>
    </tr>
  </table>
 </div>
</div>