/* Google login helper function */
(function ($) {
  Drupal.behaviors.google = {
    attach: function (context) {
      $("body").on('click', '#googleSignInHandler', function() {
        var googlePopup = document.getElementById('googleSignIn');
        googlePopup.click();
        
        return false;
      });
    }
  };
})(jQuery);

function google_onLoadGoogleCallback() {
  gapi.load('auth2', function() {
    auth2 = gapi.auth2.init({
      client_id: Drupal.settings['google_app_id'],
      cookiepolicy: 'single_host_origin',
      scope: 'profile'
    });

    auth2.attachClickHandler(element, {},
      function(googleUser) {
        var profile = googleUser.getBasicProfile();
        var id = profile.getId();
        var email = profile.getEmail() != null ? profile.getEmail() : id + '@googlemail.com';
        var name = profile.getName();
        var imageURL = profile.getImageUrl();

        var userData = {
			    email: email,
		      first_name: name,
			    last_name: '',
			    cover: {source: imageURL}
			  };
        //console.log(userData);
        
        // Send darta to server for login.
        custom_services_request('social_login', {data: userData}, function(result) {
          //console.log(result);
          if (result && parseInt(result['uid']) > 0) {
            document.location.href = document.location.href;
          }
        });

        // Finish getting user info. Sign him out.
        // To-do.
        
      }, function(error) {
        console.log('Sign-in error', error);
      }
    );
  });

  element = document.getElementById('googleSignIn');
}
