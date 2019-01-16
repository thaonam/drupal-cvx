<?php /* Template for coupon form created by giaidieu.com */
//dsm($coupon);
$year_from = format_date(time(), 'custom', 'Y');
$year_to = format_date(strtotime('+3 years'), 'custom', 'Y');

if (is_object($coupon) and $coupon->valid_until > 0) {
  $valid_until = array();
  $valid_until['day'] = format_date($coupon->valid_until, 'custom', 'j');
  $valid_until['month'] = format_date($coupon->valid_until, 'custom', 'n');
  $valid_until['year'] = format_date($coupon->valid_until, 'custom', 'Y');
}
?>
<div class="profile">
  <h2 class="block-title"><?php echo !is_null($coupon) ? 'Sửa mã khuyến mại' : 'Tạo mã khuyến mại'; ?></h2>

 <div id="custom-coupon-form-wrapper" class="custom-form-wrapper">
  <table class="personal-info-table">
    <tr class="heading">
      <td>&nbsp;</td>
      <td>Thông tin Mã khuyến mại</td>
    </tr>
    <tr>
      <td>Tên *</td>
      <td><input type="text" name="name" value="<?php echo !is_null($coupon) ? $coupon->name : ''; ?>" /></td>
    </tr>
    <tr>
      <td>Đầu số mã khuyến mại *</td>
      <td>
        <input type="text" name="code" value="<?php echo !is_null($coupon) ? $coupon->code : ''; ?>" /><br />
        <span class="desc">Ví dụ nhập đầu số là "BULK", tất cả mã tạo ra sẽ có dạng "<strong>BULK</strong>005645C2"</span>
      </td>
    </tr>
    <tr>
      <td>Loại hình giảm giá *</td>
      <td>
        <select name="type">
          <?php foreach (array('price' => 'Giảm cố định', 'percentage' => 'Giảm theo tỷ lệ phần trăm') as $key => $value): ?>
          <option value="<?php echo $key; ?>"<?php echo (!is_null($coupon) and $coupon->type == $key) ? ' selected="selected"' : ''; ?>><?php echo $value; ?></option>
          <?php endforeach; ?>
        </select>
      </td>
    </tr>
    <tr>
      <td>Giá trị mã *</td>
      <td><input type="text" name="value" onkeyup="custom_thousand_format_auto(this);" value="<?php echo !is_null($coupon) ? (int) $coupon->value : ''; ?>" /></td>
    </tr>
    <tr>
      <td>Trạng thái kích hoạt</td>
      <td><input type="checkbox" name="status" value="1" <?php echo (!is_null($coupon) and $coupon->status) ? 'checked="checked"' : '';  ?> /></td>
    </tr>
    <tr>
      <td>Số lượng mã sẽ tạo *</td>
      <td><input type="text" name="bulk_number" value="<?php echo (!is_null($coupon) and $coupon->data['bulk_number']) ? $coupon->data['bulk_number'] : '10'; ?>" /></td>
    </tr>
    <tr>
      <td>Ngày hết hạn</td>
      <td>
        <label>Ngày:</label>
        <select name="day" class="custom-dropdown-enabled">
          <option value="0">- Chọn -</option>
          <?php for ($i = 1; $i <= 31; $i++): ?>
          <option value="<?php echo $i; ?>"<?php echo (isset($valid_until['day']) and $valid_until['day'] == $i) ? ' selected="selected"' : ''; ?>><?php echo $i; ?></option>
          <?php endfor; ?>
        </select>
        
        <label>Tháng:</label>
        <select name="month" class="custom-dropdown-enabled">
          <option value="0">- Chọn -</option>
          <?php for ($i = 1; $i <= 12; $i++): ?>
          <option value="<?php echo $i; ?>"<?php echo (isset($valid_until['month']) and $valid_until['month'] == $i) ? ' selected="selected"' : ''; ?>><?php echo $i; ?></option>
          <?php endfor; ?>
        </select>

        <label>Năm:</label>
        <select name="year" class="custom-dropdown-enabled">
          <option value="0">- Chọn -</option>
          <?php for ($i = $year_from; $i <= $year_to; $i++): ?>
          <option value="<?php echo $i; ?>"<?php echo (isset($valid_until['year']) and $valid_until['year'] == $i) ? ' selected="selected"' : ''; ?>><?php echo $i; ?></option>
          <?php endfor; ?>
        </select>
        <br /><span class="desc">Bỏ trống nếu mã có thời hạn sử dụng vĩnh viễn.</span>
      </td>
    </tr>
    
    <tr>
      <td>&nbsp;</td>
      <td>
        <input type="hidden" name="uid" value="<?php echo $user->uid; ?>" />
        <input type="hidden" name="cid" value="<?php echo !is_null($coupon) ? $coupon->cid : 0; ?>" />
        <input type="submit" name="submit" value="<?php echo !is_null($coupon) ? 'Lưu thay đổi' : 'Tạo mã'; ?>" class="btn btn-success form-submit" onclick="custom_coupon_form_submit(this);" />
      </td>
    </tr>
  </table>
 </div>
</div>