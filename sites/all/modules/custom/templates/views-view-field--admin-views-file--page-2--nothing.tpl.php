<?php

/**
 * @file
 * This template is used to print a single field in a view.
 *
 * It is not actually used in default Views, as this is registered as a theme
 * function which has better performance. For single overrides, the template is
 * perfectly okay.
 *
 * Variables available:
 * - $view: The view object
 * - $field: The field handler object that can process the input
 * - $row: The raw SQL result that can be used
 * - $output: The processed output that will normally be used.
 *
 * When fetching output from the $row, this construct should be used:
 * $data = $row->{$field->field_alias}
 *
 * The above will guarantee that you'll always get the correct data,
 * regardless of any changes in the aliasing that might happen if
 * the view is modified.
 */
 //dsm($row);
 if ($row->file_managed_type == 'image') {
   $url = file_create_url($row->file_managed_uri);
   $thumbnail = image_style_url('media_thumbnail', $row->file_managed_uri);
 }
 else if ($row->file_managed_type == 'video') {
   $url = file_create_url($row->file_managed_uri);
   $thumbnail = image_style_url('media_thumbnail', 'public://default_images/video-x-generic.png');
 }
 else if ($row->file_managed_type == 'audio') {
   $url = file_create_url($row->file_managed_uri);
   $thumbnail = image_style_url('media_thumbnail', 'public://default_images/audio_generic.png');
 }
 else if ($row->file_managed_type == 'document') {
   $url = file_create_url($row->file_managed_uri);
   $thumbnail = image_style_url('media_thumbnail', 'public://default_images/document_generic.png');
 }
?>
<div class="file-wrapper" fid="<?php echo $row->fid; ?>" media_type="<?php echo $row->file_managed_type; ?>" url="<?php echo $url; ?>">
  <div class="media-wrapper">
    <img src="<?php echo $thumbnail; ?>" alt="<?php echo $row->file_managed_filename; ?>" title="Kích thước: <?php echo $row->file_managed_filesize; ?>Kb" />
    <span class="media-filename"><?php echo $row->file_managed_filename; ?></span>
  </div>
</div>