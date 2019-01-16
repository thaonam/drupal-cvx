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
?>
<div class="file-wrapper" fid="<?php echo $row->fid; ?>">
  <?php if ($row->file_managed_type == 'image'): ?>
  <div class="image-wrapper">
    <img src="<?php echo image_style_url('thumbnail', $row->file_managed_uri); ?>" alt="<?php echo $row->file_managed_filename; ?>" title="Tên file: <?php echo $row->file_managed_filename; ?> - Kích thước: <?php echo $row->file_managed_filesize; ?>Kb" />
  </div>
  <?php else: ?>
  <span class="filename"><?php echo $row->file_managed_filename; ?></span>
  <span class="filesize"><?php echo $row->file_managed_filesize; ?>Kb</span>
  <?php endif; ?>
</div>