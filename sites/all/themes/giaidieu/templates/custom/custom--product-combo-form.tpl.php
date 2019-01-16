<?php /* Template for product combo form created by giaidieu.com */
//dsm($node);
$products_list = array('product' => array(), 'service' => array());
?>
<div class="profile">
 <h2 class="block-title"><?php echo $node ? 'Sửa sản phẩm combo' : 'Tạo sản phẩm combo'; ?></h2>

 <div id="custom-product-combo-form-wrapper" class="custom-form-wrapper">
  <table class="personal-info-table">
    <tr class="heading">
      <td>&nbsp;</td>
      <td>Thông tin sản phẩm combo</td>
    </tr>
    <tr>
      <td>Tên sản phẩm *</td>
      <td><input type="text" name="title" value="<?php echo $node ? $node->title : ''; ?>" /></td>
    </tr>
    <tr>
      <td>Mã hàng (SKU) *</td>
      <td><input type="text" name="sku" value="<?php echo $node ? $node->model : ''; ?>" sku="<?php echo $node ? $node->model : ''; ?>" onblur="custom_sku_is_existed(this);" /><span class="sku-status"></span></td>
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
      <td>Sản phẩm / Dịch vụ trong gói</td>
      <td>
        <div id="custom-combo-list-wrapper">
          <ul>
            <?php if (!empty($node->field_product[LANGUAGE_NONE])): ?>
            <?php foreach ($node->field_product[LANGUAGE_NONE] as $index => $value): ?>
            <?php 
              $product = node_load($value['target_id']);
              $products_list[$product->type][] = $value['target_id'];
            ?>
            <li nid="<?php echo $product->nid; ?>" price="<?php echo (int) $product->sell_price; ?>"><?php echo $product->title . ' - Giá: ' . uc_currency_format($product->sell_price); ?><span onclick="custom_product_service_remove_from_combo_list(<?php echo $product->nid; ?>);"><i class="fa fa-minus-circle" aria-hidden="true"></i></span></li>
            <?php endforeach; ?>
            <?php endif; ?>
          </ul>
        </div>
        <select name="product_service_group" onchange="custom_product_service_add_to_combo_list(this);" class="custom-dropdown-enabled">
          <option value="0">- Chọn -</option>
          <optgroup class="product" label="Sản Phẩm (<?php echo count($products_services['product']) - count($products_list['product']); ?>)">
            <?php foreach ($products_services['product'] as $nid => $row): ?>
            <option class="<?php if (in_array($nid, $products_list['product'])): echo 'hide'; endif; ?>" price="<?php echo $row['price']; ?>" value="<?php echo $nid; ?>"<?php echo (!empty($node->nid) and $node->nid == $nid) ? 'selected="selected"' : ''; ?>><?php echo $row['title'] . ' - Giá: ' . uc_currency_format($row['price']); ?></option>
            <?php endforeach; ?>
          </optgroup>

          <optgroup class="service" label="Dịch Vụ (<?php echo count($products_services['service']) - count($products_list['service']); ?>)">
            <?php foreach ($products_services['service'] as $nid => $row): ?>
            <option class="<?php if (in_array($nid, $products_list['service'])): echo 'hide'; endif; ?>" price="<?php echo $row['price']; ?>" value="<?php echo $nid; ?>"<?php echo (!empty($node->nid) and $node->nid == $nid) ? 'selected="selected"' : ''; ?>><?php echo $row['title'] . ' - Giá: ' . uc_currency_format($row['price']); ?></option>
            <?php endforeach; ?>
          </optgroup>
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

    <tr>
      <td>&nbsp;</td>
      <td>
        <input type="hidden" name="uid" value="<?php echo $user->uid; ?>" />
        <input type="hidden" name="nid" value="<?php echo $node ? $node->nid : 0; ?>" />
        <input type="submit" name="submit" value="<?php echo $node ? 'Lưu thay đổi' : 'Tạo sản phẩm combo'; ?>" class="btn btn-success form-submit" onclick="custom_product_combo_form_submit(this);" />
      </td>
    </tr>
  </table>
 </div>
</div>