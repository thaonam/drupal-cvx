<?php
if ($node->uid != 0) {
$cuser = user_load($node->uid);
$avatar = (!empty($cuser->field_photo)) ? image_style_url('crop_65x65', $cuser->field_photo['und'][0]['uri']) : '/' . $directory . '/images/anonymous.jpg';
}
?>
<div id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?> clearfix <?php print $view_mode ?>" <?php print $attributes; ?>>
  <?php if ($title_prefix) {
  print render($title_prefix);
  } ?>
  <?php if ($title_suffix) {
  print render($title_suffix);
  } ?>
  <?php if ($teaser): ?>
  <div class="video wow fadeInUp">
    <div class="dh-video-top">
      <div class="dh-video-top-player-wrapper video-placeholder"></div>
      <a href="<?php print $node_url ?>" class="image dh-video-top-player">
        <img src="<?php print custom_video_thumbnail_get($node, 'img_video'); ?>" alt="Video thumbnail" />
        <img src="/sites/all/themes/giaidieu/images/play.png" class="play" alt="Play" />
        <img src="/sites/all/themes/giaidieu/images/play_hover.png" class="play-hover" alt="Play" />
      </a>
    </div>
    <div class="body-top-video">
      <h5 class="dh-title">
      <a href="<?php print $node_url ?>">
        <?php print $node->title;?>
      </a>
      </h5>
      <div class="product-manu">
        <?php if (!empty($avatar)): ?>
        <a href="/<?php echo drupal_get_path_alias('user/' . $node->uid); ?>">
          <img src="<?php print $avatar; ?>">
        </a>
        <?php endif; ?>
      </div>
    </div>
    </div> <!-- / .video -->
    <?php elseif ($view_mode == 'search_index'): ?>
    <div class="service-search">
      <div class="image video-placeholder">
        <img src="<?php print custom_video_thumbnail_get($node, 'img_video'); ?>" alt="Video thumbnail" />
      </div>
      <div class="service-body">
        <?php if ($title_prefix) print render($title_prefix); ?>
        <div class="title"><a href="<?php print $node_url ?>"><?php print $node->title; ?></a></div>
        <?php if ($title_suffix) print render($title_suffix); ?>
        <div class="body"><?php echo render($content['field_video_description']); ?></div>
      </div>
    </div>
    <!-- /end search index -->
    <?php elseif ($view_mode == 'video_listing'): ?>
    <div class="dh-video-item wow fadeInUp">
      <div class="video-left">
        <h5 class="video-title"><a href="<?php print $node_url; ?>"><?php print $node->title; ?></a></h5>
        <div class="video-des">
          <?php if (!empty($node->field_video_description[LANGUAGE_NONE])) {
          print truncate_utf8(strip_tags($node->field_video_description[LANGUAGE_NONE][0]['value']), 140, FALSE, TRUE);
          }
        ?></div>
        <a href="<?php print $node_url; ?>" class="btn btn-dh-player"></a>
      </div>
      <div class="video-right video-placeholder">
        <img src="<?php print custom_video_thumbnail_get($node, 'crop_285x190'); ?>" alt="Video thumbnail" />
      </div>
    </div>
    <?php elseif ($view_mode == 'video_listing_2'):
    $node_view = statistics_get($node->nid);
    ?>
    <div class="dh-video-line wow fadeInUp">
      <div class="video-left video-placeholder">
        <img src="<?php print custom_video_thumbnail_get($node, 'crop_300x190'); ?>" alt="Video thumbnail" />
        <div class="video-duration">
          <?php //print youtube_duration($node->field_video_youtube['und'][0]['video_id']); ?>
        </div>
      </div>
      <div class="video-right">
        <h5 class="video-title"><a
        href="<?php print $node_url; ?>"><?php print t(truncate_utf8($node->title, 55, FALSE, TRUE, 1));?> </a>
        </h5>
        <ul class="video-info">
          <li><i class="fa fa-user" aria-hidden="true"></i> <?php print $node->name; ?></li>
          <li><i class="fa fa-clock-o" aria-hidden="true"></i> <?php print humanTiming($node->created).' '.t("ago"); ?>
          </li>
          <li><i class="fa fa-eye" aria-hidden="true"></i> <?php print $node_view['totalcount']; ?></li>
        </ul>
        <div class="video-des">
          <?php
          if (!empty($node->field_video_description[LANGUAGE_NONE])) {
          print truncate_utf8(strip_tags($node->field_video_description[LANGUAGE_NONE][0]['value']), 120, FALSE, TRUE);
          }
          ?>
        </div>
        <a href="<?php print $node_url; ?>" class="btn btn-dh-player"></a>
      </div>
    </div>
    <?php elseif ($view_mode == 'shop_manage'): ?>
    <div class="video personal-video personal-product wow fadeInUp">
      <div class="product-image video-placeholder">
        <img src="<?php print custom_video_thumbnail_get($node, 'img_video'); ?>" alt="Video thumbnail" />
      </div>
      <h5 class="product-name"><a href="<?php print $node_url; ?>"><?php print $title; ?></a></h5>
      <div class="description">
        <?php if (!empty($node->field_video_description[LANGUAGE_NONE])) {
        print truncate_utf8(strip_tags($node->field_video_description['und'][0]['value']), 140, false, true);
        } ?>
      </div>
      <div class="product-ops">
        <ul>
          <li onclick="custom_node_set_refresh(<?php echo $node->nid; ?>, this);" title="Làm mới lại thời gian cập nhật"><i class="fa fa-refresh" aria-hidden="true"></i> <span>Làm mới</span></li>
          <li onclick="custom_node_set_sticky(<?php echo $node->nid; ?>, this);" status="<?php echo $node->sticky; ?>" title="Thay đổi chế độ Sticky"><i class="fa fa-<?php echo $node->sticky == 1 ? 'star-o' : 'star'; ?>" aria-hidden="true"></i> <span><?php echo $node->sticky == 1 ? 'Bỏ nổi bật' : 'Nổi bật'; ?></span></li>
          <?php if ($node->status): ?>
          <li onclick="custom_node_set_published(<?php echo $node->nid; ?>, this);" status="<?php echo $node->status; ?>" title="Thay đổi trạng thái nội dung"><i class="fa fa-<?php echo $node->status == 1 ? 'lock' : 'unlock'; ?>" aria-hidden="true"></i> <span><?php echo $node->status == 1 ? 'Khóa' : 'Mở khóa'; ?></span></li>
          <?php else: ?>
          <li class="disabled" status="<?php echo $node->status; ?>" title="Liên hệ với quản trị viên để mở khóa nội dung"><i class="fa fa-<?php echo $node->status == 1 ? 'lock' : 'unlock'; ?>" aria-hidden="true"></i> <span>Mở khóa</span></li>
          <?php endif; ?>
          <li onclick="custom_node_set_edited(<?php echo $node->nid; ?>, 'video');" title="Sửa nội dung này"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> <span>Sửa</span></li>
          <li onclick="custom_node_set_deleted(<?php echo $node->nid; ?>, this);" title="Xóa nội dung này"><i class="fa fa-trash" aria-hidden="true"></i> <span>Xóa</span></li>
        </ul>
      </div>
    </div>
    <?php else: ?>
    <?php
    global $base_url;
    $author_img = '';
    $author_name = '';
    $author_url = drupal_get_path_alias('user/' . $node->uid);
    //$author_birth = '';

    if ($node->uid != 0) {
    $author = user_load($node->uid);
    if (!empty($author->field_full_name)) {
    $author_name =  $author->field_full_name['und'][0]['value'];
    }
    if (!empty($author->field_photo)) {
    $author_img = '<img src="' . image_style_url('img_avatar', $author->field_photo['und'][0]['uri']) . '" alt="' . $author_name . '">';
    }
    /*
    if (!empty($author->field_birthdate[LANGUAGE_NONE])) {
    $author_birth = date('d-m-Y', $author->field_birthdate['und'][0]['value']);
    }
    */
    }
    ?>
    <div class="dh-block-physical-tag">
      <h2 class="block-title"><?php print t("Thầy thuốc gia đình"); ?></h2>
      <?php print views_embed_view('taxonomy_functions', 'block_4'); ?>
    </div>
    <div class="dh-block-video-details">
    <div class="dh-video-demo dh-radius">
      <?php if ($node->field_live_streaming[LANGUAGE_NONE][0]['value']): ?>
        <?php if ($node->livestreaming['video_is_free'] or $node->livestreaming['video_is_paid']): ?>
        <div id="livestream-viewers">Đang xem: <span>0</span></div>
        <video id="livestream" nid="<?php echo $node->nid; ?>" uid="<?php echo $node->uid; ?>" <?php echo $user->uid != $node->uid ? 'controls' : ''; ?> autoplay></video>

        <?php if ($user->uid == $node->uid): ?>
        <video id="livestream_replay" class="hide" controls autoplay muted></video>
        <?php endif; ?>

        <button class="vjs-big-play-button" type="button" aria-live="polite" title="Play Video" aria-disabled="false"><span aria-hidden="true" class="vjs-icon-placeholder"></span><span class="vjs-control-text">Play Video</span></button>

        <?php if ($user->uid == $node->uid): ?>
        <div id="video-buttons-wrapper" style="display: none;">
          <div id="isPauseStream" class="btn btn-primary">Pause</div> <div id="isResumeStream" class="btn btn-primary hide">Tiếp tục</div> <div id="isStopStream" class="btn btn-primary">Stop</div> <div id="isStartRecordStream" class="btn btn-primary">Thu hình</div> <div id="isStopRecordStream" class="btn btn-primary hide">Dừng thu</div> <div id="isPlayRecordStream" class="btn btn-primary hide">Xem video</div> <div id="isSave" class="btn btn-primary hide">Lưu video</div> <div id="isDownloadStream" class="btn btn-primary hide">Tải video</div> <div id="isStartStream" class="btn btn-primary hide">Livestream video mới</div>
        </div>
        <?php endif; ?>
        <?php else: ?>
        <p class="empty-text">Video Live Streaming có thu phí. Vui lòng xem hướng dẫn trên popup để tiếp tục.</p>
        <?php endif; ?>
      <?php else: ?>
      <div class="dh-video-player" id="videojs-player-wrapper" nid="<?php echo $node->nid; ?>"></div>
      <?php endif; ?>
    </div>

  <h5 class="video-title"><?php echo $node->title; ?></h5>
  <div class="video-info">
    <div class="total-view"><?php print render($content['links']['statistics']); ?></div>
    <div class="dh-post-share">
<!--      --><?php //print t("Chia Sẻ"); ?><!--:-->
<!--    <ul class="video-share-icon share-lazy-load" data-url="--><?php //print $base_url . $node_url; ?><!--"></ul>-->
      <div class="sharethis-inline-share-buttons"></div>
  </div>
</div>
<?php echo render($content['field_tags']); ?>
<?php echo render($content['field_video_category']); ?>
<div class="video-author">
  <div class="image">
    <a href="/<?php echo $author_url; ?>">
      <?php echo $author_img; ?>
    </a>
  </div>
  <div class="author-body">
    <a href="/<?php echo $author_url; ?>">
      <div class="title"><?php echo $author_name; ?></div>
      <div class="dob"><?php echo format_date($node->created, 'custom', 'd-m-Y'); ?></div>
    </a>
  </div>
</div>
<div class="video-content wow fadeInUp">
  <?php if (!empty($node->field_video_description[LANGUAGE_NONE])): ?>
  <?php print $node->field_video_description[LANGUAGE_NONE][0]['value']; ?>
  <?php endif; ?>
</div>
<div class="video-comments">
  <div class="fb-comments" data-href="<?php print $base_url . $node_url; ?>" data-numposts="5" data-width="100%"></div>
</div>
</div> <!-- / .dh-block-video-details -->
<?php endif; ?>
</div>