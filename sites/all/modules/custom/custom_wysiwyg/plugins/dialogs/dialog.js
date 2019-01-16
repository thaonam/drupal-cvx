/* custom_wysiwyg plugin - dialog */
CKEDITOR.dialog.add('custom_wysiwyg_media_dialog', function(editor) {
    return {
        title: 'Media Library',
        minWidth: 600,
        minHeight: 300,
        contents: [
        {
          id: 'custom_wysiwyg_media_dialog-browser',
          label: 'Media files browser',
          elements: [
            {
              type: 'html',
              id: 'custom_wysiwyg_media_dialog-browser-list',
              html: '<div class="content">Table listing</div>'              
            }
          ]
        },
        {
          id: 'custom_wysiwyg_media_dialog-upload',
          label: 'Uploader',
          elements: [
            {
              type: 'html',
              id: 'custom_wysiwyg_media_dialog-upload-form',
              html: '<div class="content">File uploader</div>'              
            }
          ]
        }
        ],
        onShow: function() {
          jQuery.get('/custom/user/files/image', {}, function(result) {
            jQuery('div[name="custom_wysiwyg_media_dialog-browser"] div.content').html(result);
                
            // Make file is selectable.
            jQuery('div[name="custom_wysiwyg_media_dialog-browser"] div.content').on('click', 'div.file-wrapper', function() {
              if (jQuery(this).hasClass('selected')) {
                jQuery(this).removeClass('selected');
              }
              else{
                jQuery(this).addClass('selected');
              }
            });
          });
        },
        onOk: function() {
          // To-do.
        }
    };
});