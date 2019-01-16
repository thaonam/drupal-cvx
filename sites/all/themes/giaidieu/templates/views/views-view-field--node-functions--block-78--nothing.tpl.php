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
 $video = node_load($row->node_field_data_field_course_video_nid);
 // dsm($row);
?>
<?php if ($row->field_field_free_mode[0]['raw']['value'] or (!empty($row->field_field_video_free_in_second) and $row->field_field_video_free_in_second[0]['raw']['value'] > 0)): ?>
  <a href="<?php print url('node/' . $row->node_field_data_field_course_video_nid); ?>"><img class="video-thumbnail" src="<?php print custom_video_thumbnail_get($video, 'video_115x70'); ?>" alt="<?php print $row->node_field_data_field_course_video_title; ?>" /></a>
  <div class="video-title"><?php print l($row->node_field_data_field_course_video_title, 'node/' . $row->node_field_data_field_course_video_nid); ?></div>
  <div class="views-field views-field-view-node"><span class="field-content"><?php print l('Học thử', 'node/' . $row->node_field_data_field_course_video_nid); ?></span></div>
<?php else: ?>
  <img class="video-thumbnail" src="<?php print custom_video_thumbnail_get($video, 'video_115x70'); ?>" alt="<?php print $row->node_field_data_field_course_video_title; ?>" />
  <span class="video-title"><?php print $row->node_field_data_field_course_video_title; ?></span>
<?php endif; ?>