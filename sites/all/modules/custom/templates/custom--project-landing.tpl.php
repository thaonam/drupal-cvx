<?php /* Template file for projects listing */
?>
<div style="padding: 10px; background-color: lightyellow;">
  <?php echo t('This project page lists all features those specifically built only for Cầu vồng Xanh project.'); ?>
</div>
<ul class="items-list">
  <li>
    <h3 style="margin-bottom: 5px;"><?php echo l('Sub-domain', 'admin/config/services/subdomain'); ?></h3>
    <div class="desciption"><?php echo t('Enable to create sub-domain to access to user landing page.'); ?></div>
  </li>
  <li>
    <h3 style="margin-bottom: 5px;"><?php echo l('Vimeo connect', 'admin/config/vimeo_connect'); ?></h3>
    <div class="desciption"><?php echo t('Enable to connect to Vimeo video service for uploading and managing private files.'); ?></div>
  </li>
  <li>
    <h3 style="margin-bottom: 5px;"><?php echo l('Video settings', 'admin/project/video_settings'); ?></h3>
    <div class="desciption"><?php echo t('Admin settings for video feature.'); ?></div>
  </li>
  <li>
    <h3 style="margin-bottom: 5px;"><?php echo l(t("Percentage complete profile"), 'admin/config/administration/site-settings'); ?></h3>
    <div class="desciption">
      <?php echo t("Percentage Ratio Corresponds to Each Section in the Individual Page.
      <br/> And the number of days will show the message asking the customer to enter the remaining personal information."); ?>
    </div>
  </li>
  <li>
    <h3 style="margin-bottom: 5px;"><?php echo l(t('Order completion notification settings'), 'admin/config/administration/site-notification'); ?></h3>
    <div class="desciption">
      <?php echo t("The SMS notification settings will be sent to the customer upon completion of the payment."); ?>
    </div>
  </li>
  <li>
    <h3 style="margin-bottom: 5px;"><?php echo l(t('Send notification to customer'), 'node/add/notification'); ?></h3>
    <div class="desciption">
      <?php echo t("Send notification to different customer objects."); ?>
    </div>
  </li>
</ul>