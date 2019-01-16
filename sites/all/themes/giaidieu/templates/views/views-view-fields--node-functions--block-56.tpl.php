<?php
//dsm($row);
/**
 * @file
 * Default simple view template to all the fields as a row.
 *
 * - $view: The view in use.
 * - $fields: an array of $field objects. Each one contains:
 *   - $field->content: The output of the field.
 *   - $field->raw: The raw data for the field, if it exists. This is NOT output safe.
 *   - $field->class: The safe class id to use.
 *   - $field->handler: The Views field handler object controlling this field. Do not use
 *     var_export to dump this object, as it can't handle the recursion.
 *   - $field->inline: Whether or not the field should be inline.
 *   - $field->inline_html: either div or span based on the above flag.
 *   - $field->wrapper_prefix: A complete wrapper containing the inline_html to use.
 *   - $field->wrapper_suffix: The closing tag for the wrapper.
 *   - $field->separator: an optional separator that may appear before a field.
 *   - $field->label: The wrap label text to use.
 *   - $field->label_html: The full HTML of the label to use including
 *     configured element type.
 * - $row: The raw result object from the query, with all data it fetched.
 *
 * @ingroup views_templates
 */
//echo l('Edit', 'node/' . $row->nid . '/edit', array('query' => array('destination' => 'node/327')));
if (empty($row->field_field_video_youtube)):
  ?>
  <?php foreach ($fields as $id => $field): ?>
  <?php if (!empty($field->separator)): ?>
    <?php print $field->separator; ?>
  <?php endif; ?>

  <?php print $field->wrapper_prefix; ?>
  <?php print $field->label_html; ?>
  <?php print $field->content; ?>
  <?php print $field->wrapper_suffix; ?>
<?php endforeach; ?>
<?php else: ?>
  <div class="has-video">
    <?php echo theme('imagecache_external', array(
      'path' => 'http://img.youtube.com/vi/' . $row->field_field_video_youtube[0]['raw']['video_id'] . '/mqdefault.jpg',
      'style_name'=> 'reactangle_870x360',
    )); ?>
    <a class="owl-video" href="<?php echo $row->field_field_video_youtube[0]['raw']['input']; ?>"></a>
  </div>
<?php endif; ?>