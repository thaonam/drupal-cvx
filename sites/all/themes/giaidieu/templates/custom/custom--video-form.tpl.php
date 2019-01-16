<?php /* Template for video form created by giaidieu.com */
$form_elm = drupal_get_form('custom_create_empty_form');
//unset($form_elm['body']['format']);
unset($form_elm['body']['value']['#description']);
$form_body = $form_elm['body'];

// Get multiple category of products, services, and cities.
$video_categories = array();
$video_tags = array();

if (!empty($node->field_video_category[LANGUAGE_NONE])) {
  foreach ($node->field_video_category[LANGUAGE_NONE] as $index => $value) {
    $video_categories[] = $value['tid'];
  }
}
if (!empty($node->field_tags[LANGUAGE_NONE])) {
  foreach ($node->field_tags[LANGUAGE_NONE] as $index => $value) {
    $video_tags[] = $value['tid'];
  }
}

?>
<div class="profile">
  <h2 class="block-title"><?php echo $node ? 'Sửa video - Thày thuốc gia đình' : 'Tạo video - Thày thuốc gia đình'; ?></h2>

 <div id="custom-video-form-wrapper" class="custom-form-wrapper">
  <table class="personal-info-table">
    <tr class="heading">
      <td>&nbsp;</td>
      <td>Thông tin căn bản</td>
    </tr>
    <tr>
      <td>Tiêu đề video *</td>
      <td><input type="text" name="title" value="<?php echo $node ? $node->title : ''; ?>" /></td>
    </tr>
    <tr>
      <td>Danh mục Thày thuốc gia đình *</td>
      <td>
        <select name="video_category" data-placeholder="Chọn danh mục" class="custom-dropdown-enabled is-tagging-enabled" multiple="multiple">
          <?php foreach ($categories as $tid => $name): ?>
          <option value="<?php echo $tid; ?>"<?php echo (!empty($video_categories) and in_array($tid, $video_categories)) ? 'selected="selected"' : ''; ?>><?php echo $name; ?></option>
          <?php endforeach; ?>
        </select>
      </td>
    </tr>
    <tr>
      <td>Tags</td>
      <td>
        <select name="video_group" data-placeholder="Chọn danh mục liên quan" class="custom-dropdown-enabled is-tagging-enabled" multiple="multiple">
          <?php foreach ($tags as $tid => $name): ?>
          <option value="<?php echo $tid; ?>"<?php echo (!empty($video_tags) and in_array($tid, $video_tags)) ? 'selected="selected"' : ''; ?>><?php echo $name; ?></option>
          <?php endforeach; ?>
        </select>
      </td>
    </tr>

    <tr class="heading">
      <td>&nbsp;</td>
      <td>Video *</td>
    </tr>
    <tr>
      <td>YouTube link</td>
      <td class="file_link">
        <input type="text" name="youtube_link" value="<?php echo ($node and !empty($node->field_video_youtube[LANGUAGE_NONE])) ? $node->field_video_youtube[LANGUAGE_NONE][0]['input'] : ''; ?>" /><br />
        <div class="desc">Theo format: https://www.youtube.com/watch?v=1SqBdS0XkV4 hoặc https://youtu.be/1SqBdS0XkV4</div>
      </td>
    </tr>
    <tr>
      <td>Video upload</td>
      <td class="file_upload">
        <form action="/custom/video-upload" id="video_upload_form" method="post" class="form-video-upload" enctype="multipart/form-data">
          <!-- Show a thumbnail here if any -->
          <div class="file-wrapper">
            <?php if ($node and !empty($node->field_video[LANGUAGE_NONE])): ?>
            <div class="video-wrapper">
              <img src="<?php echo image_style_url('thumbnail', $node->field_video[LANGUAGE_NONE][0]['thumbnailfile']->uri); ?>" class="photo-thumb" id="video-photo-thumbnail" video_fid="<?php echo $node->field_video[LANGUAGE_NONE][0]['fid']; ?>" thumbnail_fid="<?php echo $node->field_video[LANGUAGE_NONE][0]['thumbnailfile']->fid; ?>" />
              <span class="custom-op"><i class="fa fa-trash" aria-hidden="true" title="Nhấn để xóa ảnh này." onclick="custom_image_remove(this);"></i></span>
            </div>
            <?php else: ?>
            <div class="video-wrapper no-video">
              <img src="<?php echo image_style_url('thumbnail', 'public://default_images/default-video-thumbnail.jpg'); ?>" class="no-photo" id="video-photo-thumbnail" />
              <span class="custom-op"><i class="fa fa-trash" aria-hidden="true" title="Nhấn để xóa ảnh này." onclick="custom_image_remove(this);"></i></span>
            </div>
          <?php endif; ?>
            <input type="file" name="video_upload" id="video_upload" accept="video/mp4,video/avi,video/mov,video/wmv,video/flv" />

            <div class="video-add-wrapper">
              <span>Thêm video</span>
              <div class="video-buttons">
                <div class="video-add" onclick="giaidieu_video_file_trigger('video_upload');">Tải mới</div>
                <div class="video-reuse" onclick="custom_upload_video_library(this);">Thư viện video</div>
              </div>
            </div>
          </div>

          <div class="desc">Kích thước của file phải nhỏ hơn <strong>1 GB.</strong></div>
          <div class="desc">Chấp nhận các định dạng video phổ biến: <strong>mp4 avi mov wmv flv.</strong></div>
        </form>
      </td>
    </tr>
    <tr>
      <td>Video quảng cáo</td>
      <td class="file_upload">
        <form action="/custom/video-upload" id="video_adv_upload_form" method="post" class="form-video-upload" enctype="multipart/form-data">
          <!-- Show a thumbnail here if any -->
          <div class="file-wrapper">
            <?php if ($node and !empty($node->field_video_adv[LANGUAGE_NONE])): ?>
            <div class="video-wrapper">
              <img onclick="giaidieu_video_file_trigger('video_adv_upload');" src="<?php echo is_object($node->field_video_adv[LANGUAGE_NONE][0]['thumbnailfile']) ?  image_style_url('thumbnail', $node->field_video_adv[LANGUAGE_NONE][0]['thumbnailfile']->uri) : image_style_url('thumbnail', 'public://default_images/default-video-thumbnail.jpg'); ?>" class="photo-thumb" id="video-adv-photo-thumbnail" video_fid="<?php echo $node->field_video_adv[LANGUAGE_NONE][0]['fid']; ?>" thumbnail_fid="<?php echo is_object($node->field_video_adv[LANGUAGE_NONE][0]['thumbnailfile']) ? $node->field_video_adv[LANGUAGE_NONE][0]['thumbnailfile']->fid : ''; ?>" />
              <span class="custom-op"><i class="fa fa-trash" aria-hidden="true" title="Nhấn để xóa ảnh này." onclick="custom_image_remove(this);"></i></span>
            </div>
            <?php else: ?>
            <div class="video-wrapper no-video">
              <img onclick="giaidieu_video_file_trigger('video_adv_upload');" src="<?php echo image_style_url('thumbnail', 'public://default_images/default-video-thumbnail.jpg'); ?>" class="no-photo" id="video-adv-photo-thumbnail" />
              <span class="custom-op"><i class="fa fa-trash" aria-hidden="true" title="Nhấn để xóa ảnh này." onclick="custom_image_remove(this);"></i></span>
            </div>
          <?php endif; ?>
            <input type="file" name="video_adv_upload" id="video_adv_upload" accept="video/mp4,video/avi,video/mov,video/wmv,video/flv" />

            <div class="video-add-wrapper">
              <span>Thêm video</span>
              <div class="video-buttons">
                <div class="video-add" onclick="giaidieu_video_file_trigger('video_adv_upload');">Tải mới</div>
                <div class="video-reuse" onclick="custom_upload_video_library(this);">Thư viện video</div>
              </div>
            </div>

          </div>

          <div class="desc">Kích thước của file phải nhỏ hơn <strong>250 MB.</strong></div>
          <div class="desc">Chấp nhận các định dạng video phổ biến: <strong>mp4 avi mov wmv flv.</strong></div>
        </form>
      </td>
    </tr>
    <tr>
      <td>Chèn quảng cáo vào Video tại số giây</td>
      <td class="video_adv_insert_at">
        <input type="text" name="video_adv_insert_at" value="<?php echo $node ? (int) $node->field_video_adv_insert_at[LANGUAGE_NONE][0]['value'] : ''; ?>" />
      </td>
    </tr>

    <tr class="heading">
      <td>&nbsp;</td>
      <td>Giá và Thông tin khuyến mại</td>
    </tr>
    <tr>
      <td>Video cho xem miễn phí?</td>
      <td class="video_free">
        <input type="checkbox" value="1" name="video_is_free" <?php echo ($node and !empty($node->field_free_mode[LANGUAGE_NONE]) and $node->field_free_mode[LANGUAGE_NONE][0]['value'] == 1) ? 'checked="checked"' : ''; ?> /> <span>Miễn phí toàn bộ</span>
      </td>
    </tr>
    <tr>
      <td>Số giây cho xem miễn phí</td>
      <td class="video_free_in_second">
        <input type="text" value="<?php echo ($node and !empty($node->field_video_free_in_second[LANGUAGE_NONE])) ? $node->field_video_free_in_second[LANGUAGE_NONE][0]['value'] : ''; ?>" name="video_free_in_second" />
      </td>
    </tr>
    <tr>
      <td>Giá gốc (trả một lần)</td>
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
      <td>Giá bán (trả một lần)</td>
      <td><input type="text" name="sell_price" value="<?php echo $node ? (int) $node->sell_price : ''; ?>" onkeyup="custom_thousand_format_auto(this); custom_promotion_price_update();" /> VNĐ</td>
    </tr>

    <tr class="heading">
      <td>&nbsp;</td>
      <td>Mô tả video</td>
    </tr>
    <tr>
      <td>Mô tả *</td>
      <td class="textarea-wrapper">
        <?php
        $form_elm['full_desc'] = $form_body;
        $form_elm['full_desc']['#id'] = 'full_desc_wrapper';
        $form_elm['full_desc']['value']['#id'] = 'field_full_desc';
        $form_elm['full_desc']['value']['#name'] = 'full_desc';
        $form_elm['full_desc']['value']['#value'] = $form_elm['full_desc']['value']['#default_value'] = !empty($node->field_video_description) ? $node->field_video_description[LANGUAGE_NONE][0]['value'] : '';
        print drupal_render($form_elm['full_desc']);
        ?>
      </td>
    </tr>

    <tr>
      <td></td>
      <td>
        <label for="edit-comment">
          <input type="checkbox" value="2" name="comment" <?php if ($node->comment == 2) echo 'checked'; ?> id="edit-comment">
          Cho phép bình luận
        </label>
      </td>
    </tr>
    
    <tr>
      <td>&nbsp;</td>
      <td>
        <input type="hidden" name="uid" value="<?php echo $user->uid; ?>" />
        <input type="hidden" name="nid" value="<?php echo $node ? $node->nid : 0; ?>" />
        <input type="submit" name="submit" value="<?php echo $node ? 'Lưu thay đổi' : 'Tạo video'; ?>" class="btn btn-success form-submit" onclick="custom_video_form_submit(this);" />
      </td>
    </tr>
  </table>
 </div>
</div>