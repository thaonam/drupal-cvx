/* giaidieu.product.js file created by giaidieu */ 
(function($){
	Drupal.behaviors.giaidieu_product = {
		attach: function(context, settings) {
      // Detect the video js handler.
      if ($("body.uc-product-node:not('.product-processed')").length) {
        // Alter the Add to cart button to show a popup if having addon.
        if (Drupal.settings['tasscare']['product_has_addon']) {
          // Remove default action for Service.
          $("div.service-info div.btn-primary.js-action").attr('data-href', '');
          
          $("div.add-to-cart #edit-actions button.node-add-to-cart, div.service-info div.btn-primary.js-action").click(function() {
            // Ask for payment.
            var dialog = $('<div id="custom-product-addon-wrapper" title="Chọn thêm Sản phẩm / Dịch vụ kèm theo"></div>');
            dialog.append(Drupal.settings['tasscare']['product_add_on_popup']);
            // Lich hen
            if (dialog.find('#edit-lich-hen').length) {
              dialog.once('them_lich_hen').on('click', '.add-calendar', function() {
                if ($(this).hasClass('open')) {
                  dialog.find('#edit-lich-hen').fadeOut();
                  dialog.find('#edit-lich-hen').val('');
                  $(this).removeClass('open');
                } else {
                  $(this).addClass('open');
                  dialog.find('#edit-lich-hen').fadeIn().datepicker({
                    dateFormat: "dd-mm-yy",
                    minDate: "today"
                  });
                }
              })
            }
            // Update main product quantity.
            dialog.find('div.main-product input[name="product_main"]').attr('qty', $("div.add-to-cart #edit-qty").val());
            dialog.find('div.main-product span.qty').html($("div.add-to-cart #edit-qty").val());
            dialog.find('ul.items-list li input.item_addons').click(function() {
              if (this.checked) {
                $(this).parent().addClass('selected');
              }
              else{
                $(this).parent().removeClass('selected');
                
              }
            });
            
            // Show popup.
            dialog.dialog({
              modal: true,
              autoOpen: true,
              width: 500,
              height: 400,
              resizable: false,
              buttons: [
                {
                  text: 'Tiếp Tục Thanh Toán',
                  click: function() {
                    // Get main product and its quantity.
                    var item = {
                      nid: $("#custom-product-addon-wrapper").find('div.main-product input[name="product_main"]').attr('value'),
                      qty: $("#custom-product-addon-wrapper").find('div.main-product input[name="product_main"]').attr('qty')
                    }
                    
                    // Get all checked products / services.
                    var items_addon = [];
                    $("#custom-product-addon-wrapper").find("input[type='checkbox'].item_addons").each(function() {
                      if (this.checked) {
                        items_addon.push($(this).attr('value'));
                      }
                    });

                    var lich_hen = (dialog.find('#edit-lich-hen').length) ? dialog.find('#edit-lich-hen').val() : '';
                    
                    // Process to send to server-side now.
                    $.post('/custom/product-addons-add-to-cart', {item: item, items_addon: items_addon, lich_hen: lich_hen}, function(result) {
                      if (result) {
                        document.location.href = '/cart';
                      }
                    });
                  }
                }
              ]
            });
            
            return false;
          });
        }
        
        $("body.uc-product-node").addClass('product-processed');
      }
		}
  };
})(jQuery);
