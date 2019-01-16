/* custom_wysiwyg plugin */
(function($) {
  CKEDITOR.plugins.add('custom_wysiwyg_media', {
    init: function(editor) {
      // Add dialog for open content later.
      //CKEDITOR.dialog.add('custom_wysiwyg_media_dialog', this.path + 'dialogs/dialog.js');
      //editor.addCommand('custom_wysiwyg_media_dialog_open', new CKEDITOR.dialogCommand('custom_wysiwyg_media_dialog'));
      editor.ui.addButton('custom_wysiwyg_media_button', {
        label: 'Giai Điệu Media',
        command: 'custom_wysiwyg_media_dialog_open',
        icon: this.path + 'images/giaidieu.png'
      });
      
      editor.addCommand('custom_wysiwyg_media_dialog_open', {
        exec: function(edt) {
          // Open a dialog for selecting images.
          var rel = edt.id;
          if (!$('#custom-user-files-wrapper_' + rel).length) {
            var div = $("<div id='custom-user-files-wrapper_" + rel + "' class='custom-user-files-wrapper'></div>");
            div.append('<iframe name="user_files" src="/user/files" width="100%" height="100%"></iframe>');
            
            var w = (window.innerWidth/100) * 90;
            var h = (window.innerHeight/100) * 90;
            
            $('body').addClass('dialog-open custom_wysiwyg_media');
            div.dialog({
              modal: true,
              width: w,
              height: h,
              autoOpen: true,
              closeOnEscape: true,
              title: Drupal.t('Thư viện media'),
              buttons: [
              {
                text: 'Chọn',
                class: 'button-ok',
                click: function() {
                  // Collect all those selected image.
                  var selected_files = [];
                  div.find('iframe[name="user_files"]').contents().find('#media-tab-content-browser-wrapper .file-wrapper.selected').each(function() {
                    var file_name = $(this).find('.media-filename').text().trim();
                    if (file_name == '') file_name = $(this).attr('url');
                    selected_files.push({fid: $(this).attr('fid'), type: $(this).attr('media_type'), url: $(this).attr('url'), name: file_name});
                    $(this).removeClass('selected');
                  });

                  // Paste back to Editor body.
                  for (var i = 0; i < selected_files.length; i++) {
                    var item = selected_files[i];
                    console.log(item);
                    
                    if (item.type == 'image') {
                      edt.insertHtml('<img src="' + item.url + '" alt="'+ item.name +'"/>');
                    }

                    if (item.type == 'video') {
                      edt.insertHtml('<iframe src="/embed-video.php?src=' + item.url + '" width="600" height="400" style="max-width: 100%; border: none;"></iframe>');
                    }

                    if (item.type == 'document') {
                      edt.insertHtml('<a href="'+ item.url +'" target="_blank">'+ item.name +'</a>');
                    }
                  }
                      
                  $(this).dialog("close");
                  $('body').removeClass('dialog-open custom_wysiwyg_media');
                }
              },
              {
                text: 'Bỏ qua',
                class: 'button-cancel',
                click: function() {
                  $(this).dialog("close");
                  $('body').removeClass('dialog-open custom_wysiwyg_media');
                }
              }
              ],
            });
          }
          else{
            $('#custom-user-files-wrapper_' + rel).dialog('open');
          }
        }
      });
    }
  });
})(jQuery);
