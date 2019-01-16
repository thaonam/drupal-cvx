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
 $node = node_load($row->nid);
 //dsm($node);
?>
<div class="file-wrapper" video_fid="<?php echo $node->field_video[LANGUAGE_NONE][0]['fid']; ?>" thumbnail_fid="<?php echo $node->field_video[LANGUAGE_NONE][0]['thumbnail']; ?>">
  <div class="image-wrapper">
    <img src="<?php echo custom_video_thumbnail_get($node, 'thumbnail'); ?>" alt="<?php echo $node->title; ?>" title="Tên file: <?php echo $node->title; ?>" />
  </div>
</div>