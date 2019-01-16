(function ($) {
  Drupal.behaviors.facebook = {
    attach: function (context) {
      // Init Facebook SDK and Init function.
      window.fbAsyncInit = function() {
        FB.init({
          appId            : Drupal.settings['facebook_app_id'],
          autoLogAppEvents : true,
          xfbml            : false,
          version          : 'v2.10'
        });
        FB.AppEvents.logPageView();
      };

      (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/vi_VN/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
      
      // Handle Facebook login event.
      $("body").on('click', "#facebookSignin", function() {
        FB.getLoginStatus(function(response) {
          if (response.status === 'connected') {
            FB.api('/me?fields=first_name,last_name,email,gender,cover', function(response) {
              //console.log(response);
              response['caller'] = 'facebook';
              custom_services_request('social_login', {data: response}, function(result) {
                if (result && result['uid'] > 0) {
                  document.location.href = document.location.href;
                }
              });
            });
          }
          else {
            FB.login(function(response) {
              if (response.authResponse) {
                FB.api('/me?fields=first_name,last_name,email,gender,cover', function(response) {
                  //console.log(response);
                  response['caller'] = 'facebook';
                  custom_services_request('social_login', {data: response}, function(result) {
                    if (result && result['uid'] > 0) {
                      document.location.href = document.location.href;
                    }
                  });
                  
                  // Logout FB here?
                  // To-do.
                });
              }
              else{
                //console.log('User cancelled login or did not fully authorize.');
              }
            }, {scope: 'email,public_profile'});
          }
        });
      });
    }
  };
})(jQuery);

