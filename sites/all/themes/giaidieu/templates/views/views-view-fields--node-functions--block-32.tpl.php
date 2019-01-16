<div class="doctor wow fadeInUp">
  <div class="dh-doctor">
    <div class="doctor-image">
      <?php echo render($row->field_field_photo[0]['rendered']); ?>
    </div>
    <div class="doctor-top">
    
      <div class="doctor-name"><?php echo l($row->node_title, drupal_get_path_alias('user/' . $row->users_node_uid)); ?></div>
    </div>
    <div class="doctor-body">
    </div>
  </div> <!-- / dh-doctor -->
</div>