<?php
/**
 * @file
 * Default theme implementation to present all user profile data.
 *
 * This template is used when viewing a registered member's profile page,
 * e.g., example.com/user/123. 123 being the users ID.
 *
 * Use render($user_profile) to print all profile items, or print a subset
 * such as render($user_profile['user_picture']). Always call
 * render($user_profile) at the end in order to print all remaining items. If
 * the item is a category, it will contain all its profile items. By default,
 * $user_profile['summary'] is provided, which contains data on the user's
 * history. Other data can be included by modules. $user_profile['user_picture']
 * is available for showing the account picture.
 *
 * Available variables:
 *   - $user_profile: An array of profile items. Use render() to print them.
 *   - Field variables: for each field instance attached to the user a
 *     corresponding variable is defined; e.g., $account->field_example has a
 *     variable $field_example defined. When needing to access a field's raw
 *     values, developers/themers are strongly encouraged to use these
 *     variables. Otherwise they will have to explicitly specify the desired
 *     field language, e.g. $account->field_example['en'], thus overriding any
 *     language negotiation rule that was previously applied.
 *
 * @see user-profile-category.tpl.php
 *   Where the html is handled for the group.
 * @see user-profile-item.tpl.php
 *   Where the html is handled for each item in the group.
 * @see template_preprocess_user_profile()
 *
 * @ingroup themeable
 */
 // Come to their own account.
 if ($user->uid == arg(1)) {
   // Go to user account management.
   drupal_goto('user/profile');
   exit;
 }
 //dsm($user_profile);
 $account = user_load(arg(1));
 // dsm($account);
?>
<div id="custom-user-profile-wrapper" class="row">
  <div class="profile-image col-sm-4">
    <div class="image-wrapper">
      <?php print render($user_profile['field_photo']); ?>
      <div class="contacts">
        <?php if (!empty($account->profile->field_social_address[LANGUAGE_NONE])): ?>
        <a href="<?php echo '//' . str_replace(array('http://', 'https://', '//'), '', $account->profile->field_social_address[LANGUAGE_NONE][0]['url']); ?>" class="fb" target="_blank">
          <i class="fa fa-facebook" aria-hidden="true"></i>
        </a>
        <?php endif; ?>
        <?php if (!empty($account->field_mobile_number[LANGUAGE_NONE])): ?>
        <a href="tel:<?php echo $account->field_mobile_number['und'][0]['value']; ?>" class="phone">
          <i class="fa fa-phone" aria-hidden="true"></i>
        </a>
        <?php endif; ?>
        <a href="mailto:<?php echo $account->mail; ?>" class="mail">
          <i class="fa fa-envelope-o" aria-hidden="true"></i>
        </a>
        <?php if (!empty($account->profile->field_skype_id[LANGUAGE_NONE])): ?>
        <a href="skype:<?php echo $account->profile->field_skype_id[LANGUAGE_NONE][0]['value']; ?>" class="skype">
          <i class="fa fa-skype" aria-hidden="true"></i>
        </a>
        <?php endif; ?>
      </div>
    </div>
  </div>
  <div class="profile-details col-sm-8">
    <?php if (!empty($account->field_user_description[LANGUAGE_NONE])): ?>
    <div class="profile-description">
      <h2>Giới thiệu</h2>
      <?php print $account->field_user_description[LANGUAGE_NONE][0]['value']; ?>
    </div>
    <?php endif; ?>
    
    <div class="profile-contact">
      <h2>Thông tin liên hệ</h2>
      <div class="content">
        <?php print render($user_profile['field_mobile_number']); ?>
        <div class="field field-name-field-current-address field-type-text field-label-above"><div class="field-label">Địa chỉ:&nbsp;</div><div class="field-items"><div class="field-item even"><?php print !empty($account->profile->field_current_address[LANGUAGE_NONE]) ? $account->profile->field_current_address[LANGUAGE_NONE][0]['value'] : ''; ?></div></div></div>
        <?php print render($user_profile['field_cities']); ?>
      </div>
    </div>
  </div>
</div>

<div class="user-products-wrapper">
  <div class="vlock block-title-blue block-views">
    <h2 class="block-title"><?php echo t("Product"); ?></h2>
    <div class="block-content">
      <?php echo views_embed_view('node_functions', 'block_9', arg(1)); ?>
    </div>
  </div>
  <!-- /Product -->
  <div class="vlock block-title-blue block-views">
    <h2 class="block-title"><?php echo t("Service"); ?></h2>
    <div class="block-content">
      <?php echo views_embed_view('node_functions', 'block_41', 'all', arg(1)); ?>
    </div>
  </div>
  <!-- /Service -->
  <div class="vlock block-title-blue block-views">
    <h2 class="block-title"><?php echo t("Video"); ?></h2>
    <div class="block-content">
      <?php echo views_embed_view('node_functions', 'block_7', arg(1)); ?>
    </div>
  </div>
  <!-- /Video -->
</div>