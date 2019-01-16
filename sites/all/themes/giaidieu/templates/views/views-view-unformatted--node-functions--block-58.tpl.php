<?php

/**
 * @file
 * Default simple view template to display a list of rows.
 *
 * @ingroup views_templates
 */
//dsm($rows);
?>
<?php if (!empty($title)): ?>
  <h3><?php print $title; ?></h3>
<?php endif; ?>
<?php if(count($rows) >= 1){ ?>
<div class="wrap-views-row">
	<div class="row">
		<div class="col-sm-6 ">
			<div class="big-item"><?php print $rows[0]; ?></div>
		</div>
		<div class="col-sm-6">
		<div class="small-item news-custom-slide owl-carousel">
<?php for($i = 1; $i< count($rows); $i = $i+3){ ?>
			<div class="views-row">
			<?php
			if(!empty($rows[$i])){ print $rows[$i]; }
			if(!empty($rows[$i+1])){ print $rows[$i+1]; }
			if(!empty($rows[$i+2])){ print $rows[$i+2]; }
			?>
			</div>
		
<?php } ?>
		</div>
		</div>
	</div>
</div>
<?php } ?>
