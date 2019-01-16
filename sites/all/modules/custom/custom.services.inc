<?php /* Custom web services inc created by giaidieu */

/**
 * Define services function.
 */
function custom_services_resources() {
  $resources = array(
    'drupalapp' => array(
      'actions' => array(
        // Load a teacher profile.
        'teacher_load' => array(
          'help' => t('Load teacher profile.'),
          'file' => array(
            'type' => 'inc',
            'module' => 'custom',
            'name' => 'custom.resource',
          ),
          'callback' => 'custom_teacher_node_load_callback',
          'args' => array(
            array(
              'name'         => 'nid',
              'type'         => 'int',
              'description'  => t('Teacher node id.'),
              'source'       => array('data' => 'nid'),
              'optional'     => TRUE,
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

        // Load a video and return full info.
        'video_load' => array(
          'help' => t('Load a video and return full info.'),
          'file' => array(
            'type' => 'inc',
            'module' => 'custom',
            'name' => 'custom.resource',
          ),
          'callback' => 'custom_video_node_load_callback',
          'args' => array(
            array(
              'name'         => 'nid',
              'type'         => 'int',
              'description'  => t('Video node id.'),
              'source'       => array('data' => 'nid'),
              'optional'     => TRUE,
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

        // Get videos.
        'user_videos' => array(
          'help' => t('Get videos by filters.'),
          'file' => array(
            'type' => 'inc',
            'module' => 'custom',
            'name' => 'custom.resource',
          ),
          'callback' => 'custom_user_videos_callback',
          'args' => array(
            array(
              'name'         => 'tag',
              'type'         => 'int',
              'description'  => t('Tagging.'),
              'source'       => array('data' => 'tag'),
              'optional'     => TRUE,
            ),
            array(
              'name'         => 'cid',
              'type'         => 'int',
              'description'  => t('Video category.'),
              'source'       => array('data' => 'cid'),
              'optional'     => TRUE,
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

        // Get all user's videos most views.
        'user_video_manager_by_views' => array(
          'help' => t('Get all user videos by most views.'),
          'file' => array(
            'type' => 'inc',
            'module' => 'custom',
            'name' => 'custom.resource',
          ),
          'callback' => 'custom_user_video_manager_by_views_callback',
          'args' => array(
            array(
              'name'         => 'uid',
              'type'         => 'int',
              'description'  => t('User id.'),
              'source'       => array('data' => 'uid'),
              'optional'     => TRUE,
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

        // Get all user's videos.
        'user_video_manager_by_date' => array(
          'help' => t('Get all user videos by date.'),
          'file' => array(
            'type' => 'inc',
            'module' => 'custom',
            'name' => 'custom.resource',
          ),
          'callback' => 'custom_user_video_manager_by_date_callback',
          'args' => array(
            array(
              'name'         => 'uid',
              'type'         => 'int',
              'description'  => t('User id.'),
              'source'       => array('data' => 'uid'),
              'optional'     => TRUE,
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

        // Verify a course video code.
        'video_course_code_verify' => array(
          'help' => t('Verify a course video code.'),
          'file' => array(
            'type' => 'inc',
            'module' => 'custom',
            'name' => 'custom.resource',
          ),
          'callback' => 'custom_video_course_code_verify_callback',
          'args' => array(
            array(
              'name'         => 'nid',
              'type'         => 'int',
              'description'  => t('Video nid.'),
              'source'       => array('data' => 'nid'),
              'optional'     => FALSE,
            ),
            array(
              'name'         => 'code',
              'type'         => 'string',
              'description'  => t('Course code.'),
              'source'       => array('data' => 'code'),
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

        // Create a livestream node.
        'node_video_create' => array(
          'help' => t('Node refreshen.'),
          'file' => array(
            'type' => 'inc',
            'module' => 'custom',
            'name' => 'custom.resource',
          ),
          'callback' => 'custom_node_video_create_callback',
          'args' => array(
            array(
              'name'         => 'title',
              'type'         => 'string',
              'description'  => t('Node title.'),
              'source'       => array('data' => 'title'),
              'optional'     => FALSE,
            ),
            array(
              'name'         => 'video_category_tid',
              'type'         => 'int',
              'description'  => t('Category tid.'),
              'source'       => array('data' => 'video_category_tid'),
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

        // update to publish the video livestream.
        'node_video_update_video' => array(
          'help' => t('Node refreshen.'),
          'file' => array(
            'type' => 'inc',
            'module' => 'custom',
            'name' => 'custom.resource',
          ),
          'callback' => 'custom_node_video_update_video_callback',
          'args' => array(
            array(
              'name'         => 'nid',
              'type'         => 'int',
              'description'  => t('Node id.'),
              'source'       => array('data' => 'nid'),
              'optional'     => FALSE,
            ),
            array(
              'name'         => 'status',
              'type'         => 'int',
              'description'  => t('Node status.'),
              'source'       => array('data' => 'status'),
              'optional'     => FALSE,
            ),
            array(
              'name'         => 'fid',
              'type'         => 'int',
              'description'  => t('Video fid.'),
              'source'       => array('data' => 'fid'),
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

        // Validate a coupon and calculate the discount.
        'ubercart_order_discount_validate' => array(
          'help' => t('Validate a coupon code and return its value.'),
          'file' => array(
            'type' => 'inc',
            'module' => 'custom',
            'name' => 'custom.resource',
          ),
          'callback' => 'custom_ubercart_order_discount_validate',
          'args' => array(
            array(
              'name'         => 'code',
              'type'         => 'string',
              'description'  => t('Coupon code.'),
              'source'       => array('data' => 'code'),
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

        // Get node media files.
        'node_media_get' => array(
          'help' => t('Get node media files.'),
          'file' => array(
            'type' => 'inc',
            'module' => 'custom',
            'name' => 'custom.resource',
          ),
          'callback' => 'custom_node_media_get_callback',
          'args' => array(
            array(
              'name'         => 'nid',
              'type'         => 'int',
              'description'  => t('Node id.'),
              'source'       => array('data' => 'nid'),
              'optional'     => FALSE,
            ),
            array(
              'name'         => 'type',
              'type'         => 'string',
              'description'  => t('Media type.'),
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

        // Check SKU.
        'sku_is_existed' => array(
          'help' => t('Check whether a SKU does exist.'),
          'file' => array(
            'type' => 'inc',
            'module' => 'custom',
            'name' => 'custom.resource',
          ),
          'callback' => 'custom_sku_is_existed_callback',
          'args' => array(
            array(
              'name'         => 'sku',
              'type'         => 'string',
              'description'  => t('Product SKU.'),
              'source'       => array('data' => 'sku'),
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

        // Delete a coupon.
        'coupon_delete' => array(
          'help' => t('Delete a coupon object.'),
          'file' => array(
            'type' => 'inc',
            'module' => 'custom',
            'name' => 'custom.resource',
          ),
          'callback' => 'custom_coupon_delete_callback',
          'args' => array(
            array(
              'name'         => 'cid',
              'type'         => 'int',
              'description'  => t('Coupon cid.'),
              'source'       => array('data' => 'cid'),
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

        // Store a coupon.
        'coupon_store' => array(
          'help' => t('Store a coupon object.'),
          'file' => array(
            'type' => 'inc',
            'module' => 'custom',
            'name' => 'custom.resource',
          ),
          'callback' => 'custom_store_coupon_callback',
          'args' => array(
            array(
              'name'         => 'uid',
              'type'         => 'int',
              'description'  => t('Coupon creator.'),
              'source'       => array('data' => 'uid'),
              'optional'     => FALSE,
            ),
            array(
              'name'         => 'coupon_fields',
              'type'         => 'array',
              'description'  => t('Coupon fields.'),
              'source'       => array('data' => 'coupon_fields'),
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

        // Get video URL.
        'node_video_url_get' => array(
          'help' => t('Load video url.'),
          'file' => array(
            'type' => 'inc',
            'module' => 'custom',
            'name' => 'custom.resource',
          ),
          'callback' => 'custom_node_video_url_get_callback',
          'args' => array(
            array(
              'name'         => 'nid',
              'type'         => 'int',
              'description'  => t('Node id.'),
              'source'       => array('data' => 'nid'),
              'optional'     => FALSE,
            ),
            array(
              'name'         => 'cover_size',
              'type'         => 'string',
              'description'  => t('Video thumbnail size.'),
              'source'       => array('data' => 'cover_size'),
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
      
        // Load user profile completeness.
        'user_profile_completeness' => array(
          'help' => t('Load user profile completeness.'),
          'file' => array(
            'type' => 'inc',
            'module' => 'custom',
            'name' => 'custom.resource',
          ),
          'callback' => 'custom_user_profile_completeness_callback',
          'args' => array(
            /*
            array(
              'name'         => 'uid',
              'type'         => 'int',
              'description'  => t('User id.'),
              'source'       => array('data' => 'uid'),
              'optional'     => FALSE,
            ),
            */
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

        // Op a node: deleted.
        'node_set_deleted' => array(
          'help' => t('Node deleted.'),
          'file' => array(
            'type' => 'inc',
            'module' => 'custom',
            'name' => 'custom.resource',
          ),
          'callback' => 'custom_node_set_deleted_callback',
          'args' => array(
            array(
              'name'         => 'nid',
              'type'         => 'int',
              'description'  => t('Node id.'),
              'source'       => array('data' => 'nid'),
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

        // Op a node: publish.
        'node_set_published' => array(
          'help' => t('Node published.'),
          'file' => array(
            'type' => 'inc',
            'module' => 'custom',
            'name' => 'custom.resource',
          ),
          'callback' => 'custom_node_set_published_callback',
          'args' => array(
            array(
              'name'         => 'nid',
              'type'         => 'int',
              'description'  => t('Node id.'),
              'source'       => array('data' => 'nid'),
              'optional'     => FALSE,
            ),
            array(
              'name'         => 'status',
              'type'         => 'int',
              'description'  => t('Status id.'),
              'source'       => array('data' => 'status'),
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

        // Op a node: sticky.
        'node_set_sticky' => array(
          'help' => t('Node set sticky.'),
          'file' => array(
            'type' => 'inc',
            'module' => 'custom',
            'name' => 'custom.resource',
          ),
          'callback' => 'custom_node_set_sticky_callback',
          'args' => array(
            array(
              'name'         => 'nid',
              'type'         => 'int',
              'description'  => t('Node id.'),
              'source'       => array('data' => 'nid'),
              'optional'     => FALSE,
            ),
            array(
              'name'         => 'status',
              'type'         => 'int',
              'description'  => t('Status id.'),
              'source'       => array('data' => 'status'),
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

        // Op a node: refresh.
        'node_set_refresh' => array(
          'help' => t('Node refreshen.'),
          'file' => array(
            'type' => 'inc',
            'module' => 'custom',
            'name' => 'custom.resource',
          ),
          'callback' => 'custom_node_set_refresh_callback',
          'args' => array(
            array(
              'name'         => 'nid',
              'type'         => 'int',
              'description'  => t('Node id.'),
              'source'       => array('data' => 'nid'),
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

        // Authenticate then login a user.
        'account_login' => array(
          'help' => t('Login a user.'),
          'file' => array(
            'type' => 'inc',
            'module' => 'custom',
            'name' => 'custom.resource',
          ),
          'callback' => 'custom_account_login_callback',
          'args' => array(
            array(
              'name'         => 'username',
              'type'         => 'string',
              'description'  => t('Username.'),
              'source'       => array('data' => 'username'),
              'optional'     => FALSE,
            ),
            array(
              'name'         => 'password',
              'type'         => 'string',
              'description'  => t('Password.'),
              'source'       => array('data' => 'password'),
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

        // Smart login.
        'account_smart_login' => array(
          'help' => t('Login a user via username, mail, or mobile.'),
          'file' => array(
            'type' => 'inc',
            'module' => 'custom',
            'name' => 'custom.resource',
          ),
          'callback' => 'custom_account_smart_login_callback',
          'args' => array(
            array(
              'name'         => 'name',
              'type'         => 'string',
              'description'  => t('Name which can be username, email, or mobile phone.'),
              'source'       => array('data' => 'name'),
              'optional'     => FALSE,
            ),
            array(
              'name'         => 'password',
              'type'         => 'string',
              'description'  => t('Password.'),
              'source'       => array('data' => 'password'),
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

        // Convert coupon code to userpoints.
        'account_coupon_to_userpoints' => array(
          'help' => t('Convert coupon code to user points.'),
          'file' => array(
            'type' => 'inc',
            'module' => 'custom',
            'name' => 'custom.resource',
          ),
          'callback' => 'custom_account_coupon_to_userpoints_callback',
          'args' => array(
            array(
              'name'         => 'uid',
              'type'         => 'int',
              'description'  => t('User id.'),
              'source'       => array('data' => 'uid'),
              'optional'     => FALSE,
            ),
            array(
              'name'         => 'code',
              'type'         => 'string',
              'description'  => t('Coupon code.'),
              'source'       => array('data' => 'code'),
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

        // Change the password after passcode verification done.
        'pass_code_change' => array(
          'help' => t('Change user password via the pass code SMS system.'),
          'file' => array(
            'type' => 'inc',
            'module' => 'custom',
            'name' => 'custom.resource',
          ),
          'callback' => 'custom_pass_code_change_callback',
          'args' => array(
            array(
              'name'         => 'uid',
              'type'         => 'int',
              'description'  => t('User id.'),
              'source'       => array('data' => 'uid'),
              'optional'     => FALSE,
            ),
            array(
              'name'         => 'confirmed_code',
              'type'         => 'string',
              'description'  => t('Confirmed code after user has done the pass code verify.'),
              'source'       => array('data' => 'confirmed_code'),
              'optional'     => FALSE,
            ),
            array(
              'name'         => 'new_pass',
              'type'         => 'string',
              'description'  => t('New password.'),
              'source'       => array('data' => 'new_pass'),
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

        // Verify a pass code with mobile number.
        'pass_code_verify' => array(
          'help' => t('Verify a code that user taken from SMS.'),
          'file' => array(
            'type' => 'inc',
            'module' => 'custom',
            'name' => 'custom.resource',
          ),
          'callback' => 'custom_pass_code_verify_callback',
          'args' => array(
            array(
              'name'         => 'uid',
              'type'         => 'int',
              'description'  => t('User uid.'),
              'source'       => array('data' => 'uid'),
              'optional'     => FALSE,
            ),
            array(
              'name'         => 'code',
              'type'         => 'string',
              'description'  => t('Pass code.'),
              'source'       => array('data' => 'code'),
              'optional'     => FALSE,
            ),
            array(
              'name'         => 'is_activation',
              'type'         => 'int',
              'description'  => t('Whether this verify is for activation or pass change.'),
              'source'       => array('data' => 'is_activation'),
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

        // Generate code then send to user via the SMS.
        'pass_code_generate' => array(
          'help' => t('Generate code to be sent to user via SMS.'),
          'file' => array(
            'type' => 'inc',
            'module' => 'custom',
            'name' => 'custom.resource',
          ),
          'callback' => 'custom_pass_code_generate_callback',
          'args' => array(
            array(
              'name'         => 'name',
              'type'         => 'string',
              'description'  => t('Username or Mobile number.'),
              'source'       => array('data' => 'name'),
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

        // Do a FB / Google+ login.
        'social_login' => array(
          'help' => t('Login with Facebook / Google.'),
          'file' => array(
            'type' => 'inc',
            'module' => 'custom',
            'name' => 'custom.resource',
          ),
          'callback' => 'custom_social_login_callback',
          'args' => array(
            array(
              'name'         => 'data',
              'type'         => 'array',
              'description'  => t('User profile.'),
              'source'       => array('data' => 'data'),
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

        // Do a user login without needing password.
        // to-do: May need to protect by someway later.
        'user_login_without_password' => array(
          'help' => t('Login without password.'),
          'file' => array(
            'type' => 'inc',
            'module' => 'custom',
            'name' => 'custom.resource',
          ),
          'callback' => 'custom_user_login_without_password_callback',
          'args' => array(
            array(
              'name'         => 'uid',
              'type'         => 'int',
              'description'  => t('User id.'),
              'source'       => array('data' => 'uid'),
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

				// User account create / update.
        'user_store' => array(
          'help' => t('Create / Update an user with provided fields.'),
          'file' => array(
            'type' => 'inc',
            'module' => 'custom',
            'name' => 'custom.resource',
          ),
          'callback' => 'custom_user_store_callback',
          'args' => array(
            array(
              'name'         => 'uid',
              'type'         => 'int',
              'description'  => t('User id. Set to 0 to create a new user.'),
              'source'       => array('data' => 'uid'),
              'optional'     => FALSE,
            ),
            array(
              'name'         => 'account_fields',
              'type'         => 'array',
              'description'  => t('Account fields to be stored.'),
              'source'       => array('data' => 'account_fields'),
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

				// User password reset.
        'user_password_reset' => array(
          'help' => t('Reset an existing user password.'),
          'file' => array(
            'type' => 'inc',
            'module' => 'custom',
            'name' => 'custom.resource',
          ),
          'callback' => 'custom_user_password_reset_callback',
          'args' => array(
            array(
              'name'         => 'username',
              'type'         => 'string',
              'description'  => t('Username or E-mail.'),
              'source'       => array('data' => 'username'),
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

				// User password reset confirm.
        'user_password_reset_confirm' => array(
          'help' => t('Sending a code to confirm reset an existing user password.'),
          'file' => array(
            'type' => 'inc',
            'module' => 'custom',
            'name' => 'custom.resource',
          ),
          'callback' => 'custom_user_password_reset_confirm_callback',
          'args' => array(
            array(
              'name'         => 'uid',
              'type'         => 'int',
              'description'  => t('User id.'),
              'source'       => array('data' => 'uid'),
              'optional'     => FALSE,
            ),
            array(
              'name'         => 'code',
              'type'         => 'string',
              'description'  => t('Verified code.'),
              'source'       => array('data' => 'code'),
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

				// User password reset confirm.
        'user_password_reset_change_confirm' => array(
          'help' => t('Sending a code to confirm reset an existing user password.'),
          'file' => array(
            'type' => 'inc',
            'module' => 'custom',
            'name' => 'custom.resource',
          ),
          'callback' => 'custom_user_password_reset_change_confirm_callback',
          'args' => array(
            array(
              'name'         => 'uid',
              'type'         => 'int',
              'description'  => t('User id.'),
              'source'       => array('data' => 'uid'),
              'optional'     => FALSE,
            ),
            array(
              'name'         => 'confirmed_code',
              'type'         => 'string',
              'description'  => t('Security code for changing pass via web service.'),
              'source'       => array('data' => 'confirmed_code'),
              'optional'     => FALSE,
            ),
            array(
              'name'         => 'new_pass',
              'type'         => 'string',
              'description'  => t('New password.'),
              'source'       => array('data' => 'new_pass'),
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

				// User password update.
        'user_password_update' => array(
          'help' => t('Update an existing user password.'),
          'file' => array(
            'type' => 'inc',
            'module' => 'custom',
            'name' => 'custom.resource',
          ),
          'callback' => 'custom_user_password_update_callback',
          'args' => array(
            array(
              'name'         => 'uid',
              'type'         => 'int',
              'description'  => t('User uid.'),
              'source'       => array('data' => 'uid'),
              'optional'     => FALSE,
            ),
            array(
              'name'         => 'pass',
              'type'         => 'string',
              'description'  => t('Password.'),
              'source'       => array('data' => 'pass'),
              'optional'     => FALSE,
            ),
            array(
              'name'         => 'old_pass',
              'type'         => 'string',
              'description'  => t('Password.'),
              'source'       => array('data' => 'old_pass'),
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

				// User account activation.
        'user_register_confirm' => array(
          'help' => t('Update an existing user password.'),
          'file' => array(
            'type' => 'inc',
            'module' => 'custom',
            'name' => 'custom.resource',
          ),
          'callback' => 'custom_user_register_confirm_callback',
          'args' => array(
            array(
              'name'         => 'uid',
              'type'         => 'int',
              'description'  => t('User uid.'),
              'source'       => array('data' => 'uid'),
              'optional'     => FALSE,
            ),
            array(
              'name'         => 'code',
              'type'         => 'string',
              'description'  => t('Verified code.'),
              'source'       => array('data' => 'code'),
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

        // Load user by username.
        'user_get_by_name' => array(
          'help' => t('Load user by its username.'),
          'file' => array(
            'type' => 'inc',
            'module' => 'custom',
            'name' => 'custom.resource',
          ),
          'callback' => 'custom_user_get_by_name_callback',
          'args' => array(
            array(
              'name'         => 'username',
              'type'         => 'string',
              'description'  => t('Username.'),
              'source'       => array('data' => 'username'),
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

				// Node create / update.
        'node_store' => array(
          'help' => t('Create / Update a node with provided fields.'),
          'file' => array(
            'type' => 'inc',
            'module' => 'custom',
            'name' => 'custom.resource',
          ),
          'callback' => 'custom_node_store_callback',
          'args' => array(
            array(
              'name'         => 'nid',
              'type'         => 'int',
              'description'  => t('Node id. Set 0 to create a new node.'),
              'source'       => array('data' => 'nid'),
              'optional'     => FALSE,
            ),
            array(
              'name'         => 'node_fields',
              'type'         => 'array',
              'description'  => t('Node fields to be updated.'),
              'source'       => array('data' => 'node_fields'),
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

        // Create a new comment.
        'comment_create' => array(
          'help' => t('create a new comment.'),
          'file' => array(
            'type' => 'inc',
            'module' => 'custom',
            'name' => 'custom.resource',
          ),
          'callback' => 'custom_comment_create_callback',
          'args' => array(
            array(
              'name'         => 'nid',
              'type'         => 'int',
              'description'  => t('Attach to node id.'),
              'source'       => array('data' => 'nid'),
              'optional'     => FALSE,
            ),
            array(
              'name'         => 'parent_id',
              'type'         => 'int',
              'description'  => t('The comment id that this comment replies to. 0 if no reply'),
              'source'       => array('data' => 'parent_id'),
              'optional'     => FALSE,
            ),
            array(
              'name'         => 'subject',
              'type'         => 'string',
              'description'  => t('Comment subject.'),
              'source'       => array('data' => 'subject'),
              'optional'     => FALSE,
            ),
            array(
              'name'         => 'comment_body',
              'type'         => 'string',
              'description'  => t('Comment body.'),
              'source'       => array('data' => 'comment_body'),
              'optional'     => FALSE,
            ),
            array(
              'name'         => 'comment_author',
              'type'         => 'string',
              'description'  => t('Author name of this comment.'),
              'source'       => array('data' => 'comment_author'),
              'optional'     => FALSE,
            ),
            array(
              'name'         => 'comment_status',
              'type'         => 'int',
              'description'  => t('Whether is published or unpublished.'),
              'source'       => array('data' => 'comment_status'),
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
        
        // Update order status.
        'ubercart_order_update_status' => array(
          'help' => t('Update an ubercart order status.'),
          'file' => array(
            'type' => 'inc',
            'module' => 'custom',
            'name' => 'custom.resource',
          ),
          'callback' => 'ubercart_order_update_status_callback',
          'args' => array(
            array(
              'name'         => 'order_id',
              'type'         => 'int',
              'description'  => t('Order id.'),
              'source'       => array('data' => 'order_id'),
              'optional'     => TRUE,
            ),
            array(
              'name'         => 'order_status',
              'type'         => 'string',
              'description'  => t('New order status.'),
              'source'       => array('data' => 'order_status'),
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

        // To create an ubercart order.
        'ubercart_order_create' => array(
          'help' => t('Create a ubercart order.'),
          'file' => array(
            'type' => 'inc',
            'module' => 'custom',
            'name' => 'custom.resource',
          ),
          'callback' => 'custom_ubercart_order_create_callback',
          'args' => array(
            array(
              'name'         => 'order_status',
              'type'         => 'string',
              'description'  => t('Order status.'),
              'source'       => array('data' => 'order_status'),
              'optional'     => FALSE,
            ),
            array(
              'name'         => 'payment_method',
              'type'         => 'string',
              'description'  => t('Payment method.'),
              'source'       => array('data' => 'payment_method'),
              'optional'     => TRUE,
            ),
            array(
              'name'         => 'product_nids',
              'type'         => 'array',
              'description'  => t('Product node ids.'),
              'source'       => array('data' => 'product_nids'),
              'optional'     => TRUE,
            ),
            array(
              'name'         => 'customer',
              'type'         => 'array',
              'description'  => t('Customer details.'),
              'source'       => array('data' => 'customer'),
              'optional'     => TRUE,
            ),
            array(
              'name'         => 'billing',
              'type'         => 'array',
              'description'  => t('Billing details.'),
              'source'       => array('data' => 'billing'),
              'optional'     => TRUE,
            ),
            array(
              'name'         => 'delivery',
              'type'         => 'array',
              'description'  => t('Delivery details.'),
              'source'       => array('data' => 'delivery'),
              'optional'     => TRUE,
            ),
            array(
              'name'         => 'other',
              'type'         => 'array',
              'description'  => t('Other details.'),
              'source'       => array('data' => 'other'),
              'optional'     => TRUE,
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

        // Upload video blob data then return its filename to keep track.
        'video_data_upload' => array(
          'help' => t('Upload an image by its data.'),
          'file' => array(
            'type' => 'inc',
            'module' => 'custom',
            'name' => 'custom.resource',
          ),
          'callback' => 'custom_video_data_upload_callback',
          'args' => array(
            array(
              'name'         => 'filename',
              'type'         => 'string',
              'description'  => t('Video filename with extension.'),
              'source'       => array('data' => 'filename'),
              'optional'     => FALSE,
            ),
            array(
              'name'         => 'videodata',
              'type'         => 'string',
              'description'  => t('Video data string.'),
              'source'       => array('data' => 'videodata'),
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

        // Upload an image data then return its fid.
        'photo_data_upload' => array(
          'help' => t('Upload an image by its data.'),
          'file' => array(
            'type' => 'inc',
            'module' => 'custom',
            'name' => 'custom.resource',
          ),
          'callback' => 'custom_photo_data_upload_callback',
          'args' => array(
            array(
              'name'         => 'filename',
              'type'         => 'string',
              'description'  => t('Image filename with extension.'),
              'source'       => array('data' => 'filename'),
              'optional'     => FALSE,
            ),
            array(
              'name'         => 'imagedata',
              'type'         => 'string',
              'description'  => t('Image data string.'),
              'source'       => array('data' => 'imagedata'),
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

				// Update for geofield.
        'geocode_update' => array(
          'help' => t('Update user geocode position.'),
          'file' => array(
            'type' => 'inc',
            'module' => 'custom',
            'name' => 'custom.resource',
          ),
          'callback' => 'custom_geocode_update_callback',
          'args' => array(
            array(
              'name'         => 'uid',
              'type'         => 'int',
              'description'  => t('User uid.'),
              'source'       => array('data' => 'uid'),
              'optional'     => FALSE,
            ),
            array(
              'name'         => 'nid',
              'type'         => 'int',
              'description'  => t('User profile nid.'),
              'source'       => array('data' => 'nid'),
              'optional'     => FALSE,
            ),
            array(
              'name'         => 'lat',
              'type'         => 'string',
              'description'  => t('Latitude.'),
              'source'       => array('data' => 'lat'),
              'optional'     => FALSE,
            ),
            array(
              'name'         => 'lon',
              'type'         => 'string',
              'description'  => t('Longitude.'),
              'source'       => array('data' => 'lon'),
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