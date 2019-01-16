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
?>
<div class="video-item" onclick="custom_video_play(this, <?php echo $row->nid; ?>, '#videojs-player-wrapper', 'crop_285x150', false);">
	<div class="video-url" title="<?php echo $row->node_title; ?>">
		<div class="title"><?php echo $row->node_title; ?></div>
		<i class="fa fa-play-circle-o" aria-hidden="true"></i>
    <img src="<?php echo custom_video_thumbnail_get($node, 'crop_285x150'); ?>" alt="Video thumbnail" />
	</div>
</div>