======================================
SUB-DOMAIN module made by giaidieu.com
Released date: 02 Nov 2017
======================================

Install steps:

STEP 1: Set the $cookie_domain variable in your settings.php file
 to your site's domain (e.g. $cookie_domain = ".example.com")

STEP 2: Enable wildcard DNS on your DNS hosting provider
 (e.g. *.example.com)

STEP 3: Configure your webserver for wildcard virtual hosts.
 (HINT for apache: ServerAlias *.example.com)

STEP 4: Add this to your .htaccess file under <IfModule mod_headers.c>
 Header always append X-Frame-Options SAMEORIGIN

STEP 5: Enable this module and configure:
 admin/config/services/subdomain - Try to add a subdomain for user "admin" there.

STEP 6: Add this code to top of html.tpl.php
<?php
// Get sub-domain and execute if any.
$subdomain_url = '';
if (drupal_is_front_page()) {
  $subdomain_url = subdomain_make_url_from_redirect_token();
}
?>
<?php if ($subdomain_url != ''): ?>
<html>
  <head><title><?php print $head_title; ?></title></head>
  <body style="padding: 0; margin: 0;">
    <iframe src="<?php echo $subdomain_url; ?>" width="100%" height="100%" style="border: 0; margin: 0;"></iframe>
  </body>
</html>
<?php else: ?>

 // Normal Drupal HTML template code remained here.

<?php endif; ?>