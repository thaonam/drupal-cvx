(function ($) {
  Drupal.behaviors.zalo = {
    attach: function (context) {
      // Open a popup for Zalo login page.
      $("body").on('click', '#zaloSignin', function() {
        window.open('/zalo/login', '_blank', 'height=400,width=400,toolbar=no,status=no,menubar=no');
        return false;        
      });
    }
  };
})(jQuery);

