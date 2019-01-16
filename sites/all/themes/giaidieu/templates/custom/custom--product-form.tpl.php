<?php /* Template for product form created by giaidieu.com */
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
//dsm($form_elm);
//hide($form_elm['body']['format']);
unset($form_elm['body']['value']['#description']);
$form_body = $form_elm['body'];

// Get multiple category of products, services, and cities.
$product_categories = array();
$product_tags = array();
$product_cities = array();

if (!empty($node->field_product_category[LANGUAGE_NONE])) {
  foreach ($node->field_product_category[LANGUAGE_NONE] as $index => $value) {
    $product_categories[] = $value['tid'];
  }
}
if (!empty($node->field_tags[LANGUAGE_NONE])) {
  foreach ($node->field_tags[LANGUAGE_NONE] as $index => $value) {
    $product_tags[] = $value['tid'];
  }
}
if (!empty($node->field_cities[LANGUAGE_NONE])) {
  foreach ($node->field_cities[LANGUAGE_NONE] as $index => $value) {
    $product_cities[] = $value['tid'];
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
 <h2 class="block-title"><?php echo $node ? 'Sửa sản phẩm' : 'Tạo sản phẩm'; ?></h2>

 <div id="custom-product-form-wrapper" class="custom-form-wrapper">
  <table class="personal-info-table">
    <tr class="heading">
      <td>&nbsp;</td>
      <td>Thông tin căn bản sản phẩm</td>
    </tr>
    <tr>
      <td>Tên sản phẩm *</td>
      <td><input type="text" name="title" value="<?php echo $node ? $node->title : ''; ?>" /></td>
    </tr>
    <tr>
      <td>Mã hàng (SKU) *</td>
      <td><input type="text" name="sku" value="<?php echo $node ? $node->model : ''; ?>" sku="<?php echo $node ? $node->model : ''; ?>" onblur="custom_sku_is_existed(this);" /><span class="sku-status"></span></td>
    </tr>
    <tr>
      <td>Danh mục sản phẩm *</td>
      <td>
        <select name="product_category" data-placeholder="Chọn danh mục" class="custom-dropdown-enabled is-tagging-enabled" multiple="multiple">
          <?php foreach ($categories as $tid => $name): ?>
          <option value="<?php echo $tid; ?>"<?php echo (!empty($product_categories) and in_array($tid, $product_categories)) ? 'selected="selected"' : ''; ?>><?php echo $name; ?></option>
          <?php endforeach; ?>
        </select>
      </td>
    </tr>
    <tr>
      <td>Thành phố / Tỉnh thành *</td>
      <td>
        <select name="product_cities" data-placeholder="Chọn Tỉnh / Thành phố" class="custom-dropdown-enabled" multiple="multiple">
          <?php foreach ($cities as $tid => $name): ?>
          <option value="<?php echo $tid; ?>"<?php echo (!empty($product_cities) and in_array($tid, $product_cities)) ? 'selected="selected"' : ''; ?>><?php echo $name; ?></option>
          <?php endforeach; ?>
        </select>
      </td>
    </tr>
    <tr>
      <td>Tags</td>
      <td>
        <select name="product_group" data-placeholder="Chọn danh mục liên quan" class="custom-dropdown-enabled is-tagging-enabled" multiple="multiple" >
          <?php foreach ($tags as $tid => $name): ?>
          <option value="<?php echo $tid; ?>"<?php echo (!empty($product_tags) and in_array($tid, $product_tags)) ? 'selected="selected"' : ''; ?>><?php echo $name; ?></option>
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
      <td>Hình ảnh sản phẩm</td>
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
        <input type="file" name="product_image" id="fileimage" class="uc_file" multiple="multiple" />
      </td>
    </tr>
    <tr>
      <td>Kiểu ảnh đại diện *</td>
      <td class="image_cover_type">
        <span class="img-vertical"><input<?php echo (!empty($node->field_img_type[LANGUAGE_NONE]) and $node->field_img_type[LANGUAGE_NONE][0]['value'] == 'img_vertical') ? ' checked="checked"' : ''; ?> type="radio" name="product_image_type" value="img_vertical" /> Ảnh ngang</span>
        <span class="img-horizontal"><input<?php echo (!empty($node->field_img_type[LANGUAGE_NONE]) and $node->field_img_type[LANGUAGE_NONE][0]['value'] == 'img_horizontal') ? ' checked="checked"' : ''; ?> type="radio" name="product_image_type" value="img_horizontal" /> Ảnh dọc</span>
      </td>
    </tr>

    <tr class="heading">
      <td>&nbsp;</td>
      <td>Thông tin chi tiết sản phẩm</td>
    </tr>
    <tr>
      <td>Giới thiệu ngắn sản phẩm *</td>
      <td class="textarea-wrapper">
        <?php
        $form_elm['short_intro_product'] = $form_body;
        $form_elm['short_intro_product']['#id'] = 'short_intro_product_wrapper';
        $form_elm['short_intro_product']['value']['#id'] = 'field_short_intro_product';
        $form_elm['short_intro_product']['value']['#name'] = 'short_intro_product';
        $form_elm['short_intro_product']['value']['#value'] = $form_elm['short_intro_product']['value']['#default_value'] = (!empty($node->field_intro_product)) ? $node->field_intro_product[LANGUAGE_NONE][0]['summary'] : '';
        print drupal_render($form_elm['short_intro_product']);
        ?>
      </td>
    </tr>
    <tr>
      <td>Giới thiệu chi tiết sản phẩm *</td>
      <td class="textarea-wrapper">
        <?php
        $form_elm['intro_product'] = $form_body;
        $form_elm['intro_product']['#id'] = 'intro_product_wrapper';
        $form_elm['intro_product']['value']['#id'] = 'field_intro_product';
        $form_elm['intro_product']['value']['#name'] = 'intro_product';
        $form_elm['intro_product']['value']['#value'] = $form_elm['intro_product']['value']['#default_value'] = !empty($node->field_intro_product) ? $node->field_intro_product[LANGUAGE_NONE][0]['value'] : '';
        print drupal_render($form_elm['intro_product']);
        ?>
      </td>
    </tr>
    <tr>
      <td>Các chính sách ưu đãi *</td>
      <td class="textarea-wrapper">
        <?php
        $form_elm['preferential_policy'] = $form_body;
        $form_elm['preferential_policy']['#id'] = 'preferential_policy_wrapper';
        $form_elm['preferential_policy']['value']['#id'] = 'field_preferential_policy';
        $form_elm['preferential_policy']['value']['#name'] = 'preferential_policy';
        $form_elm['preferential_policy']['value']['#value'] = $form_elm['preferential_policy']['value']['#default_value'] = !empty($node->field_preferential_policy) ? $node->field_preferential_policy[LANGUAGE_NONE][0]['value'] : '';
        print drupal_render($form_elm['preferential_policy']);
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
            <label>Khuyến mại</label><br />
            <input class="field-promotion" type="text" value="0" name="product_addon_promotion_<?php echo $count; ?>" onkeyup="custom_addon_promotion_select(this);" /> <span class="suffix">%</span><br />
            <span class="desc">Nhập tỷ lệ % khuyến mại khi mua kèm sản phẩm này.</span>
          </li>
          <li>
            <label>Giá bán</label><br />
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
            <label>Sản phẩm</label><br />
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
            <span class="desc">Nhập tỷ lệ % khuyến mại khi mua kèm dịch vụ này.</span>
          </li>
          <li>
            <label>Giá Bán Kèm</label><br />
            <input class="field-sell-price" type="text" value="<?php echo $service_addon->field_price[LANGUAGE_NONE][0]['value']; ?>" name="product_addon_sell_price_<?php echo $count; ?>" /> <span class="suffix">VNĐ</span><br />
            <span class="desc">Giá khuyến mại khi mua kèm dịch vụ này.</span>
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
      <td></td>
      <td>
        <input type="hidden" name="uid" value="<?php echo $user->uid; ?>" />
        <input type="hidden" name="nid" value="<?php echo $node ? $node->nid : 0; ?>" />
        <input type="submit" name="submit" value="<?php echo $node ? 'Lưu thay đổi' : 'Tạo sản phẩm'; ?>" class="btn btn-success form-submit" onclick="custom_product_form_submit(this);" />
      </td>
    </tr>
  </table>
 </div>
</div>