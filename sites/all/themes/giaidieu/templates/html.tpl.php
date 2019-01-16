<?php
// Get sub-domain and execute if any.
$subdomain_url = '';
if (drupal_is_front_page()) {
  $subdomain_url = subdomain_make_url_from_redirect_token();
}
?>
<?php if ($subdomain_url != ''): ?>
<html>
  <head>
    <?php print $head; ?>
    <meta name="viewport" content="initial-scale=1, maximum-scale=1">
    <title><?php print $head_title; ?></title>

    
  </head>
  <body style="padding: 0; margin: 0;">
    <iframe src="<?php echo $subdomain_url; ?>" width="100%" height="100%" style="border: 0; margin: 0;"></iframe>
  </body>
</html>
<?php else: ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML+RDFa 1.0//EN"
  "http://www.w3.org/MarkUp/DTD/xhtml-rdfa-1.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<?php print $language->language; ?>" version="XHTML+RDFa 1.0" dir="<?php print $language->dir; ?>"<?php print $rdf_namespaces; ?>>

<head profile="<?php print $grddl_profile; ?>">
  <?php print $head; ?>
  <meta name="viewport" content="initial-scale=1, maximum-scale=1">
  <title><?php print $head_title; ?></title>
  <?php print $styles; ?>
  <?php print $scripts; ?>
  <script type="text/javascript" src="//platform-api.sharethis.com/js/sharethis.js#property=5b763168f6dea10011a3a42d&product=inline-share-buttons"></script>
</head>
<body class="<?php print $classes; ?>" <?php print $attributes;?> uid="<?php echo $user->uid; ?>">
  <div id="skip-link">
    <a href="#main-content" class="element-invisible element-focusable"><?php print t('Skip to main content'); ?></a>
  </div>
  <?php print $page_top; ?>
  <?php print $page; ?>
  <?php print $page_bottom; ?>
</body>
</html>
<?php endif; ?>