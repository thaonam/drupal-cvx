<?php /* Esms web service created by giaidieu */

/**
 * Service to send a SMS mrssage.
 */
function esms_services_send_message($message, $number, $type) {
  return esms_send_message($message, $number, $type);
}