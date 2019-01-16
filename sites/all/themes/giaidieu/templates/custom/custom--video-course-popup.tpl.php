<?php /* Video subscription popup template - Show after 10 seconds. */
?>
<div id="custom-video-subscription-wrapper">
  <div class="alert alert-block alert-success messages status">Bạn đã xem hết <?php echo $tasscare_settings['video_free_in_second']; ?> giây miễn phí. Vui lòng nhập mã để xem toàn bộ video này.</div>
  <div class="field-row">
    <p style="margin-bottom: 20px;"><input type="text" name="video_code" value="" placeholder="Nhập mã khóa học" class="text-field" /></p>
    <a class="button" href="#" onclick="custom_video_course_code_verify(this, <?php echo $tasscare_settings['video_course']['nid']; ?>); return false;">Gửi mã</a>
  </div>

  <div class="description">Hoặc</div>
  <a class="button" href="<?php echo url('node/' . $tasscare_settings['video_course']['nid'], array('absolute' => true)); ?>">Mua khóa học</a>
</div>