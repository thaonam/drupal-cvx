<?php /* Template for service form created by giaidieu.com */
// Make date end for promotion period.
$year_from = format_date(time(), 'custom', 'Y');
$year_to = format_date(strtotime("+3 year"), 'custom', 'Y');

$current_promotion_date = array();
if ($node and !empty($node->field_deal_time[LANGUAGE_NONE]) and $node->field_deal_time[LANGUAGE_NONE][0]['value'] != null) {
  $current_promotion_date['minute'] = (int) format_date(strtotime($node->field_deal_time[LANGUAGE_NONE][0]['value']), 'custom', 'i');
  $current_promotion_date['hour'] = format_date(strtotime($node->field_deal_time[LANGUAGE_NONE][0]['value']), 'custom', 'G');
  $current_promotion_date['day'] = format_date(strtotime($node->field_deal_time[LANGUAGE_NONE][0]['value']), 'custom', 'j');
  $current_promotion_date['month'] = format_date(strtotime($node->field_deal_time[LANGUAGE_NONE][0]['value']), 'custom', 'n');
  $current_promotion_date['year'] = format_date(strtotime($node->field_deal_time[LANGUAGE_NONE][0]['value']), 'custom', 'Y');
}

$form_elm = drupal_get_form('custom_create_empty_form');
//unset($form_elm['body']['format']);
unset($form_elm['body']['value']['#description']);
$form_body = $form_elm['body'];

// Get multiple category of products, services, and cities.
$service_categories = array();
$service_tags = array();
$service_cities = array();

if (!empty($node->field_type_of_service[LANGUAGE_NONE])) {
  foreach ($node->field_type_of_service[LANGUAGE_NONE] as $index => $value) {
    $service_categories[] = $value['tid'];
  }
}
if (!empty($node->field_tags[LANGUAGE_NONE])) {
  foreach ($node->field_tags[LANGUAGE_NONE] as $index => $value) {
    $service_tags[] = $value['tid'];
  }
}
if (!empty($node->field_cities[LANGUAGE_NONE])) {
  foreach ($node->field_cities[LANGUAGE_NONE] as $index => $value) {
    $service_cities[] = $value['tid'];
  }
}

// Get product / service addons.
$product_addons = array();
$service_addons = array();

if (!empty($node->field_products_addon[LANGUAGE_NONE])) {
  foreach ($node->field_products_addon[LANGUAGE_NONE] as $index => $value) {
    $item = entity_load('field_collection_item', array($value['value']));
    foreach ($item as $cid => $item_object) {
      $product_addons[$cid] = $item_object;
    }
  }
}

if (!empty($node->field_services_addon[LANGUAGE_NONE])) {
  foreach ($node->field_services_addon[LANGUAGE_NONE] as $index => $value) {
    $item = entity_load('field_collection_item', array($value['value']));
    foreach ($item as $cid => $item_object) {
      $service_addons[$cid] = $item_object;
    }
  }
}
?>
<div class="profile">
  <h2 class="block-title"><?php echo $node ? 'Sửa dịch vụ' : 'Tạo dịch vụ'; ?></h2>

 <div id="custom-service-form-wrapper" class="custom-form-wrapper">
  <table class="personal-info-table">
    <tr class="heading">
      <td>&nbsp;</td>
      <td>Thông tin căn bản dịch vụ</td>
    </tr>
    <tr>
      <td>Tên dịch vụ *</td>
      <td><input type="text" name="title" value="<?php echo $node ? $node->title : ''; ?>" /></td>
    </tr>
    <tr>
      <td>Danh mục dịch vụ *</td>
      <td>
        <select name="service_category" data-placeholder="Chọn danh mục" class="custom-dropdown-enabled is-tagging-enabled" multiple="multiple">
          <?php foreach ($categories as $tid => $name): ?>
          <option value="<?php echo $tid; ?>"<?php echo (!empty($service_categories) and in_array($tid, $service_categories)) ? 'selected="selected"' : ''; ?>><?php echo $name; ?></option>
          <?php endforeach; ?>
        </select>
      </td>
    </tr>
    <tr>
      <td>Thành phố / Tỉnh thành *</td>
      <td>
        <select name="service_cities" data-placeholder="Chọn Tỉnh / Thành phố" class="custom-dropdown-enabled" multiple="multiple">
          <?php foreach ($cities as $tid => $name): ?>
          <option value="<?php echo $tid; ?>"<?php echo (!empty($service_cities) and in_array($tid, $service_cities)) ? 'selected="selected"' : ''; ?>><?php echo $name; ?></option>
          <?php endforeach; ?>
        </select>
      </td>
    </tr>
    <tr>
      <td>Tags</td>
      <td>
        <select name="service_group" data-placeholder="Chọn danh mục liên quan" class="custom-dropdown-enabled is-tagging-enabled" multiple="multiple">
          <?php foreach ($tags as $tid => $name): ?>
          <option value="<?php echo $tid; ?>"<?php echo (!empty($service_tags) and in_array($tid, $service_tags)) ? 'selected="selected"' : ''; ?>><?php echo $name; ?></option>
          <?php endforeach; ?>
        </select>
      </td>
    </tr>

    <tr class="heading">
      <td>&nbsp;</td>
      <td>Giá và Thông tin khuyến mại</td>
    </tr>
    <tr>
      <td>Giá gốc</td>
      <td><input type="text" name="list_price" value="<?php echo $node ? (int) $node->list_price : ''; ?>" onkeyup="custom_thousand_format_auto(this); custom_promotion_price_update();" /> VNĐ</td>
    </tr>
    <tr class="promotion">
      <td>Khuyến mại</td>
      <td class="promotion_price value-only">
        <!--Nhập Giá gốc và Giá bán để tính % khuyến mại.-->
        <input type="text" name="product_percent" onkeyup="custom_price_update_by_percent(this);"/><span class="percent-suf">%</span>
      </td>
    </tr>
    <tr>
      <td>Giá bán *</td>
      <td><input type="text" name="sell_price" value="<?php echo $node ? (int) $node->sell_price : ''; ?>" onkeyup="custom_thousand_format_auto(this); custom_promotion_price_update();" /> VNĐ</td>
    </tr>
    <tr class="promotion">
      <td>Thời gian kết thúc khuyến mại</td>
      <td class="datetime">
        <label>Ngày:</label>
        <select name="day" class="custom-dropdown-enabled">
          <option value="0">- Chọn -</option>
          <?php for ($i = 1; $i <= 31; $i++): ?>
          <option value="<?php echo $i; ?>"<?php echo (isset($current_promotion_date['day']) and $current_promotion_date['day'] == $i) ? 'selected="selected"' : ''; ?>><?php echo $i; ?></option>
          <?php endfor; ?>
        </select>
        
        <label>Tháng:</label>
        <select name="month" class="custom-dropdown-enabled">
          <option value="0">- Chọn -</option>
          <?php for ($i = 1; $i <= 12; $i++): ?>
          <option value="<?php echo $i; ?>"<?php echo (isset($current_promotion_date['month']) and $current_promotion_date['month'] == $i) ? 'selected="selected"' : ''; ?>><?php echo $i; ?></option>
          <?php endfor; ?>
        </select>

        <label>Năm:</label>
        <select name="year" class="custom-dropdown-enabled">
          <option value="0">- Chọn -</option>
          <?php for ($i = $year_from; $i <= $year_to; $i++): ?>
          <option value="<?php echo $i; ?>"<?php echo (isset($current_promotion_date['year']) and $current_promotion_date['year'] == $i) ? 'selected="selected"' : ''; ?>><?php echo $i; ?></option>
          <?php endfor; ?>
        </select>

        <label>Giờ:</label>
        <select name="hour" class="custom-dropdown-enabled">
          <option value="-1">- Chọn -</option>
          <?php for ($i = 0; $i < 24; $i++): ?>
          <option value="<?php echo $i; ?>"<?php echo (isset($current_promotion_date['hour']) and $current_promotion_date['hour'] == $i) ? 'selected="selected"' : ''; ?>><?php echo $i; ?></option>
          <?php endfor; ?>
        </select>

        <label>Phút:</label>
        <select name="minute" class="custom-dropdown-enabled">
          <option value="-1">- Chọn -</option>
          <?php for ($i = 0; $i < 60; $i++): ?>
          <option value="<?php echo $i; ?>"<?php echo (isset($current_promotion_date['minute']) and $current_promotion_date['minute'] == $i) ? 'selected="selected"' : ''; ?>><?php echo $i; ?></option>
          <?php endfor; ?>
        </select>

      </td>
    </tr>

    <tr class="heading">
      <td>&nbsp;</td>
      <td>Hình ảnh dịch vụ</td>
    </tr>
    <tr>
      <td>Ảnh *</td>
      <td class="file_upload">
        <div class="images_list">
          <?php if ($node and $node->uc_product_image[LANGUAGE_NONE]): ?>
          <?php foreach ($node->uc_product_image[LANGUAGE_NONE] as $index => $value): ?>
          <div class="photo-thumb-wrapper<?php echo $index == 0 ? ' primary' : ''; ?>">
            <span class="custom-op"><?php echo $index != 0 ? '<i class="fa fa-check-circle-o icon-primary" aria-hidden="true" title="Đặt làm ảnh chính đại diện" onclick="custom_image_set_primary(this);"></i>' : ''; ?><i class="fa fa-trash" aria-hidden="true" title="Nhấn để xóa ảnh này." onclick="custom_image_remove(this);"></i></span>
            <img class="photo-thumb" alt="<?php echo $value['filename']; ?>" fid="<?php echo $value['fid']; ?>" src="<?php echo image_style_url('thumbnail', $value['uri']); ?>" />
          </div>
          <?php endforeach; ?>
          <?php endif; ?>
          <div id="image-add-wrapper">
            <span>Thêm ảnh</span>
            <div id="image-buttons">
              <div id="image-add">Tải mới</div>
              <div id="image-reuse">Thư viện ảnh</div>
            </div>
          </div>
        </div>
        <input type="file" name="service_image" id="fileimage" class="uc_file" multiple="multiple" />
      </td>
    </tr>

    <tr class="heading">
      <td>&nbsp;</td>
      <td>Thông tin chi tiết dịch vụ</td>
    </tr>
    <tr>
      <td>Giới thiệu ngắn dịch vụ *</td>
      <td class="textarea-wrapper">
        <?php
        $form_elm['short_intro_service'] = $form_body;
        $form_elm['short_intro_service']['#id'] = 'short_intro_service_wrapper';
        $form_elm['short_intro_service']['value']['#id'] = 'field_short_intro_service';
        $form_elm['short_intro_service']['value']['#name'] = 'short_intro_service';
        $form_elm['short_intro_service']['value']['#value'] = $form_elm['short_intro_service']['value']['#default_value'] = !empty($node->field_intro_service) ? $node->field_intro_service[LANGUAGE_NONE][0]['summary'] : '';
        print drupal_render($form_elm['short_intro_service']);
        ?>
      </td>
    </tr>
    <tr>
      <td>Giới thiệu chi tiết dịch vụ *</td>
      <td class="textarea-wrapper">
        <?php
        $form_elm['intro_service'] = $form_body;
        $form_elm['intro_service']['#id'] = 'intro_service_wrapper';
        $form_elm['intro_service']['value']['#id'] = 'field_intro_service';
        $form_elm['intro_service']['value']['#name'] = 'intro_service';
        $form_elm['intro_service']['value']['#value'] = $form_elm['intro_service']['value']['#default_value'] = !empty($node->field_intro_service) ? $node->field_intro_service[LANGUAGE_NONE][0]['value'] : '';
        print drupal_render($form_elm['intro_service']);
        ?>
      </td>
    </tr>
    <tr>
      <td>Chương trình khuyến mại</td>
      <td class="textarea-wrapper">
        <?php
        $form_elm['promotion'] = $form_body;
        $form_elm['promotion']['#id'] = 'promotion_wrapper';
        $form_elm['promotion']['value']['#id'] = 'field_promotion';
        $form_elm['promotion']['value']['#name'] = 'promotion';
        $form_elm['promotion']['value']['#value'] = $form_elm['promotion']['value']['#default_value'] = !empty($node->field_promotion) ? $node->field_promotion[LANGUAGE_NONE][0]['value'] : '';
        print drupal_render($form_elm['promotion']);
        ?>
      </td>
    </tr>

    <tr class="heading">
      <td>&nbsp;</td>
      <td>Sản phẩm / Dịch vụ bán kèm</td>
    </tr>
    <tr>
      <td>Sản phẩm bán kèm</td>
      <td>
        <?php $count = 1; ?>
        <?php foreach ($product_addons as $cid => $product_addon): ?>
        <ul class="product-addons field-group" rel='<?php echo $count; ?>' type="product">
          <li>
            <label>Sản Phẩm</label><br />
            <select class="field-node custom-dropdown-enabled" name="product_addon_<?php echo $count; ?>" data-placeholder="Chọn sản phẩm" onchange="custom_addon_select(this);">
              <option value="0">- Không -</option>
              <?php foreach ($products as $nid => $product): ?>
              <option<?php echo $product_addon->field_product_addon[LANGUAGE_NONE][0]['target_id'] == $nid ? ' selected="selected"' : ''; ?> list_price="<?php echo $product['list_price']; ?>" value="<?php echo $nid; ?>"><?php echo $product['title']; ?></option>
              <?php endforeach; ?>
            </select>
          </li>
          <li>
            <label>Khuyến Mại</label><br />
            <input class="field-promotion" type="text" value="<?php echo $product_addon->field_promotion_rate[LANGUAGE_NONE][0]['value']; ?>" name="product_addon_promotion_<?php echo $count; ?>" onkeyup="custom_addon_promotion_select(this);" /> <span class="suffix">%</span><br />
            <span class="desc">Nhập tỷ lệ % khuyến mại khi mua kèm sản phẩm này.</span>
          </li>
          <li>
            <label>Giá Bán Kèm</label><br />
            <input class="field-sell-price" type="text" value="<?php echo $product_addon->field_price[LANGUAGE_NONE][0]['value']; ?>" name="product_addon_sell_price_<?php echo $count; ?>" /> <span class="suffix">VNĐ</span><br />
            <span class="desc">Giá khuyến mại khi mua kèm sản phẩm này.</span>
          </li>
        </ul>
        <?php $count++; ?>
        <?php endforeach; ?>
        <ul class="product-addons field-group" rel='<?php echo $count; ?>' type="product">
          <li>
            <label>Sản Phẩm</label><br />
            <select class="field-node custom-dropdown-enabled" name="product_addon_<?php echo $count; ?>" data-placeholder="Chọn sản phẩm" onchange="custom_addon_select(this);">
              <option value="0">- Không -</option>
              <?php foreach ($products as $nid => $product): ?>
              <option list_price="<?php echo $product['list_price']; ?>" value="<?php echo $nid; ?>"><?php echo $product['title']; ?></option>
              <?php endforeach; ?>
            </select>
          </li>
          <li>
            <label>Khuyến Mại</label><br />
            <input class="field-promotion" type="text" value="0" name="product_addon_promotion_<?php echo $count; ?>" onkeyup="custom_addon_promotion_select(this);" /> <span class="suffix">%</span><br />
            <span class="desc">Nhập tỷ lệ % khuyến mại khi mua kèm sản phẩm này.</span>
          </li>
          <li>
            <label>Giá Bán Kèm</label><br />
            <input class="field-sell-price" type="text" value="0" name="product_addon_sell_price_<?php echo $count; ?>" /> <span class="suffix">VNĐ</span><br />
            <span class="desc">Giá khuyến mại khi mua kèm sản phẩm này.</span>
          </li>
        </ul>
        
        <span class="add-seller btn btn-default" onclick="custom_group_add_more(this);" title="Thêm mới"><i class="fa fa-plus-square" aria-hidden="true"></i> Thêm mới</span>
      </td>
    </tr>
    <tr>
      <td>Dịch vụ bán kèm</td>
      <td>
        <?php $count = 1; ?>
        <?php foreach ($service_addons as $cid => $service_addon): ?>
        <ul class="service-addons field-group" rel='<?php echo $count; ?>' type="service">
          <li>
            <label>Sản Phẩm</label><br />
            <select class="field-node custom-dropdown-enabled" name="service_addon_<?php echo $count; ?>" data-placeholder="Chọn dịch vụ" onchange="custom_addon_select(this);">
              <option value="0">- Không -</option>
              <?php foreach ($services as $nid => $service): ?>
              <option<?php echo $service_addon->field_service[LANGUAGE_NONE][0]['target_id'] == $nid ? ' selected="selected"' : ''; ?> list_price="<?php echo $service['list_price']; ?>" value="<?php echo $nid; ?>"><?php echo $service['title']; ?></option>
              <?php endforeach; ?>
            </select>
          </li>
          <li>
            <label>Khuyến Mại</label><br />
            <input class="field-promotion" type="text" value="<?php echo $service_addon->field_promotion_rate[LANGUAGE_NONE][0]['value']; ?>" name="product_addon_promotion_<?php echo $count; ?>" onkeyup="custom_addon_promotion_select(this);" /> <span class="suffix">%</span><br />
            <span class="desc">Nhập tỷ lệ % khuyến mại khi mua kèm sản phẩm này.</span>
          </li>
          <li>
            <label>Giá Bán Kèm</label><br />
            <input class="field-sell-price" type="text" value="<?php echo $service_addon->field_price[LANGUAGE_NONE][0]['value']; ?>" name="product_addon_sell_price_<?php echo $count; ?>" /> <span class="suffix">VNĐ</span><br />
            <span class="desc">Giá khuyến mại khi mua kèm sản phẩm này.</span>
          </li>
        </ul>
        <?php $count++; ?>
        <?php endforeach; ?>

        <ul class="service-addons field-group" rel='<?php echo $count; ?>' type="service">
          <li>
            <label>Dịch Vụ</label><br />
            <select class="field-node custom-dropdown-enabled" name="service_addon_<?php echo $count; ?>" data-placeholder="Chọn dịch vụ" onchange="custom_addon_select(this);">
              <option value="0">- Không -</option>
              <?php foreach ($services as $nid => $service): ?>
              <option list_price="<?php echo $service['list_price']; ?>" value="<?php echo $nid; ?>"><?php echo $service['title']; ?></option>
              <?php endforeach; ?>
            </select>
          </li>
          <li>
            <label>Khuyến Mại</label><br />
            <input class="field-promotion" type="text" value="0" name="service_addon_promotion_<?php echo $count; ?>" onkeyup="custom_addon_promotion_select(this);" /> <span class="suffix">%</span><br />
            <span class="desc">Nhập tỷ lệ % khuyến mại khi mua kèm dịch vụ này.</span>
          </li>
          <li>
            <label>Giá Bán Kèm</label><br />
            <input class="field-sell-price" type="text" value="0" name="service_addon_sell_price_<?php echo $count; ?>" /> <span class="suffix">VNĐ</span><br />
            <span class="desc">Giá khuyến mại khi mua kèm dịch vụ này.</span>
          </li>
        </ul>
        
        <span class="add-seller btn btn-default" onclick="custom_group_add_more(this);" title="Thêm mới"><i class="fa fa-plus-square" aria-hidden="true"></i> Thêm mới</span>
      </td>
    </tr>

    <!--<tr>
      <td></td>
      <td>
        <label for="edit-comment">
          <input type="checkbox" value="2" name="comment" <?php /*if ($node->comment == 2) echo 'checked'; */?> id="edit-comment">
          Cho phép bình luận
        </label>
      </td>
    </tr>-->

    <tr>
      <td>&nbsp;</td>
      <td>
        <input type="hidden" name="uid" value="<?php echo $user->uid; ?>" />
        <input type="hidden" name="nid" value="<?php echo $node ? $node->nid : 0; ?>" />
        <input type="submit" name="submit" value="<?php echo $node ? 'Lưu thay đổi' : 'Tạo dịch vụ'; ?>" class="btn btn-success form-submit" onclick="custom_service_form_submit(this);" />
      </td>
    </tr>
  </table>
 </div>
</div>