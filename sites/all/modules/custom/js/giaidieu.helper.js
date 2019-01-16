/* Helper function to be used globally */

/**
 * Helper function to strip off all those are not number.
 */
function custom_string_to_number(string) {
  var number_validated = '';
  for (var i = 0; i < string.length; i++) {
    if (parseInt(string.charAt(i)) >= 0) {
      number_validated += string.charAt(i);
    }
  }

  return parseInt(number_validated) ? parseInt(number_validated) : '';
}

/**
 * Helper function to formar number to VND currency.
 */
function custom_thousand_format(number, decimal_point = '.') {
  number += '';
  x = number.split('.');
  x1 = x[0];
  x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;

  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + decimal_point + '$2');
  }
  return x1 + x2;
}

/**
 * Validate whether a text is valid email address.
 */
function custom_validate_is_email(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

/**
 * Validate a mobile number.
 */
function custom_validate_is_mobile_number(number) {
  // Process number.
  var number_length = number.length;
  var number_prefix = number_length == 11 ? number.substr(0, 4) : number.substr(0, 3);
  
  for (var i = 0; i < mobile_data.length; i++) {
    var row = mobile_data[i];
    if (number_prefix == row.prefix && number_length == parseInt(row.length)) {
      return row.name;
    }
  }

  return false;
}

/**
 * Validate a URL.
 */
function custom_validate_is_url(url) {
  return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
}

/**
 * Helper function to send a service to server.
 */
function custom_services_request(service_name, params, callback) {
  try {
	  // Obtain session token.
		var token_url = "?q=services/session/token"
		jQuery.ajax({
		  url: token_url,
		  type: 'get',
		  dataType: 'text',
		  error:function (jqXHR, textStatus, errorThrown) {
				if (!errorThrown) {
				  errorThrown = Drupal.t('Token retrieval failed!');
				}
		  },
		  success: function(token) {
				// Call the web service.
				jQuery.ajax({
				  url: '/?q=drupalgap/drupalapp/' + service_name + '.json',
				  type: 'post',
				  data: params,
				  dataType: 'json',
				  beforeSend: function(request) {
						request.setRequestHeader("X-CSRF-Token", token);
				  },
				  error: function (jqXHR, textStatus, errorThrown) {
						console.log(arguments);
				  },
				  success: function(data) {
				    callback(data);
				  }
				});
		  }
		});
  }
  catch (error) { console.log('drupalgap service error - ' + error); }
}
