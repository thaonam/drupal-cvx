<?php /* eSMS web services inc created by giaidieu */

/**
 * Define services function.
 */
function esms_services_resources() {
  $resources = array(
    'drupalapp' => array(
      'actions' => array(
        // Send sms.
        'esms_send' => array(
          'help' => t('Send SMS to a mobile number.'),
          'file' => array(
            'type' => 'inc',
            'module' => 'esms',
            'name' => 'esms.resource',
          ),
          'callback' => 'esms_services_send_message',
          'args' => array(
            array(
              'name'         => 'message',
              'type'         => 'string',
              'description'  => t('SMS message.'),
              'source'       => array('data' => 'message'),
              'optional'     => FALSE,
            ),
            array(
              'name'         => 'number',
              'type'         => 'string',
              'description'  => t('Mobile number.'),
              'source'       => array('data' => 'number'),
              'optional'     => FALSE,
            ),
            array(
              'name'         => 'type',
              'type'         => 'int',
              'description'  => t('SMS type.'),
              'source'       => array('data' => 'type'),
              'optional'     => FALSE,
            ),
          ),
          'access callback' => '_drupalgap_resource_access',
          'access callback file' => array(
            'type' => 'inc',
            'module' => 'drupalgap',
            'name' => 'drupalgap.resource',
          ),
          'access arguments' => array('access content'),
          'access arguments append' => TRUE,
        ),
      ),
    ),
  );

  return $resources;
}