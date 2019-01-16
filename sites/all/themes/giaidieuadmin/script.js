/* script.js file created by giaidieu.com */
(function ($, Drupal) {
  Drupal.behaviors.script = {
    attach: function (context, settings) {

      if ($('.page-node-467.page-node-edit').length) {
        var v_tabs = $('.page-node-467.page-node-edit').find('.vertical-tabs');
        if (v_tabs.find('#edit-metatags').length) {
          var need = v_tabs.find('#edit-metatags').index() + 1;
          v_tabs.find('.vertical-tabs-list li:nth-child('+ need +') a').trigger('click');
          v_tabs.find('.vertical-tabs-list li:not(.selected)').remove();
        }
        v_tabs.find('.vertical-tabs-panes > fieldset:not(#edit-metatags)').remove();
      }

      if ($('.node-combo-form .field-name-field-product').length) {
        var needleRegex = /\(\d+\)/g;
        var keyup;
        var orgPrice = $('.node-combo-form .form-type-uc-price input[name="list_price"]');
        if (orgPrice.val() == '') {
          calcOrgPrice($('.node-combo-form .field-name-field-product').find('input[type="text"]'), orgPrice);
        }
        $('.node-combo-form .field-name-field-product.field-type-entityreference .field-multiple-table').find('input[type="text"]').each(function (i, elm) {
          var $this = $(this);
          if (!$this.closest('.form-item').find('.form-del').length)
            $this.closest('.form-item').append('<div class="entityconnect-add autocomplete multiple-values single-selection add-icon add-text"><input title="Thêm" class="cancel form-submit form-del" type="button" value="Xóa"></div>');
        });
        $('.node-combo-form .field-name-field-product').once('remove_item').on('click', '.form-del', function (e) {
          e.preventDefault();
          var rows = $('.node-combo-form .field-name-field-product.field-type-entityreference .field-multiple-table tbody').children('tr:not(.removed)');
          var currnet = $(this).parents('tr').index();
          if (!$('.node-combo-form .field-name-field-product .field-add-more-submit2').length) {
            $('.node-combo-form .field-name-field-product input.field-add-more-submit').before('<input class="field-add-more-submit2 form-submit" type="submit" value="Thêm mục">');
            $('.node-combo-form .field-name-field-product').find('input.field-add-more-submit').hide();
          } else {
            $('.node-combo-form .field-name-field-product .field-add-more-submit2').show();
            $('.node-combo-form .field-name-field-product').find('input.field-add-more-submit').hide();
          }

          rows.each(function (i, elm) {
            if (i >= currnet) {
              if (i < rows.length - 1) {
                $(this).find('input[type="text"]').val($(rows[i + 1]).find('input[type="text"]').val());
              } else {
                $(this).find('input[type="text"]').val('').change();
                $(this).addClass('removed').fadeOut();
              }
            }
          });
        });
        $('.node-combo-form .field-name-field-product').once('add_new_item').on('click', 'input.field-add-more-submit2', function (e) {
          e.preventDefault();
          if ($('.node-combo-form .field-name-field-product.field-type-entityreference .field-multiple-table tbody').children('tr.removed').length) {
            var rows = $('.node-combo-form .field-name-field-product.field-type-entityreference .field-multiple-table tbody').children('tr.removed');
            $(rows[0]).removeClass('removed').fadeIn();
          } else {
            $('.node-combo-form .field-name-field-product').find('input.field-add-more-submit').once('trigger_add_more').trigger('mousedown');
            $('.node-combo-form .field-name-field-product').find('input.field-add-more-submit').show();
            $(this).hide();
          }
        });
        $('.node-combo-form .field-name-field-product').once('calc_price').on('change', 'input[type="text"]', function (e) {
          calcOrgPrice($('.node-combo-form .field-name-field-product').find('input[type="text"]'), orgPrice);
        });

        $('.node-combo-form .field-name-field-product').once('calc_price_keyup').on('keyup', 'input[type="text"]', function (e) {
          if (typeof keyup != undefined)
            clearTimeout(keyup);

          keyup = setTimeout(function () {
            calcOrgPrice($('.node-combo-form .field-name-field-product').find('input[type="text"]'), orgPrice);
          }, 500);
        });
      }

      function calcOrgPrice($items, $ogPrice) {
        var nid = [];
        $items.each(function (i, elm) {
          if (this.value != '') {
            var test = this.value.match(needleRegex);
            if (test != null) {
              nid.push(test[0].replace(/\(|\)/g, ''));
            }
          }
        });
        if (nid.length > 0) {
          $.get('/node-price/' + nid.join(','), function (data) {
            var prices = [];
            if (!$.isEmptyObject(data.nodes)) {
              $.each(data.nodes, function (i, item) {
                prices[item.node.nid] = item.node.sell_price;
              });
              var price = 0;
              $.each(nid, function (i, n) {
                price = price + parseFloat(prices[n]);
              });
              $ogPrice.val(price);
              if ($ogPrice.closest('.uc-inline-form').find('#edit-percent').length)
                $ogPrice.closest('.uc-inline-form').find('#edit-percent').change();
            }
          })
        } else {
          $ogPrice.val('');
        }
      }

      if ($('.view-id-admin_views_user.view-display-id-system_1').length) {
        if ($('.total-content > .content-type').length) {
          $('.total-content > .content-type').text(Drupal.t("Tổng Số Người Dùng"));
          /*var rid = $('.view-id-admin_views_user.view-display-id-system_1').find('[name="rid"]');
          var role = rid.children('option[value="'+ rid.val() +'"]').text().trim();
          if (rid.val() == 'All') role = 'user';
          var role_txt = Drupal.t(role);
          $('.total-content > .content-type').text(Drupal.t("Total @type", {"@type": role_txt}));*/
        }
      }

      if ($('.views-widget-filter-type .form-type-bef-link a').length && $('#content .action-links').length) {
        var action = $('#content .action-links');
        var active = $('.views-widget-filter-type .form-type-bef-link a.active');
        var active_type = active.attr('href').split('?type=');
        if ($('.total-content > .content-type').length) {
          $('.total-content > .content-type').text(Drupal.t("Total @type", {"@type": active.text().trim()}));
        }
        action.find('a').attr('href', '/node/add/' + active_type[1].replace(/_/g, '-')).text(Drupal.t("Add @type", {"@type": active.text().trim()}));
        if (active_type[1].indexOf('slideshow') > -1) {
          $('body').addClass('type-slideshow');
          $('#views-exposed-form-admin-views-node-system-1 .form-submit').removeClass('remove-position-filter');
        } else {
          $('body').removeClass('type-slideshow');
          if ($('#views-exposed-form-admin-views-node-system-1 .views-widget-filter-field_slide_position_value').find('select').val() != 'All') {
            $('#views-exposed-form-admin-views-node-system-1 .views-widget-filter-field_slide_position_value').find('select').val('All');
            $('#views-exposed-form-admin-views-node-system-1 .form-submit').once('remove-position-filter').trigger('click');
          }
        }
      }

      if ($('.product-field #edit-prices').length) {
        var $list_price = $('.product-field #edit-prices .form-item-list-price');
        var $sell_price = $('.product-field #edit-prices .form-item-sell-price');
        var list_price = parseFloat($list_price.children('input').val());
        var sell_price = parseFloat($sell_price.children('input').val());
        var percent = 0;
        if (list_price > sell_price) {
          var percent = ((list_price - sell_price) / list_price).toFixed(2) * 100;
        }
        if (!$('.product-field #edit-prices .form-item-percent').length) {
          $list_price.after('<div class="form-item form-type-uc-price form-item-percent">' +
            '<label for="edit-list-price">Khuyến mại </label>' +
            '<span class="field-prefix"></span> <input id="edit-percent" value="'+ percent +'" min="0" max="100" size="15" maxlength="15" class="form-text" type="number"> <span class="field-suffix"> %</span>' +
            '<div class="description">% khuyến mại.</div>' +
            '</div>')
        }
        var $percent = $('.product-field #edit-prices .form-item-percent');
        //Update sell price by percent
        $percent.once('change_percent').on('keyup, change', 'input', function (e) {
          if (parseInt(this.value) >= 0 && parseInt(this.value) <= 100) {
            var list_price = parseInt($list_price.children('input').val());
            var percent = (list_price / 100) * parseInt(this.value);
            $sell_price.children('input').val(list_price - percent);
          } else {
            $sell_price.children('input').val('');
          }
        });
        //Update percent by sell price
        $sell_price.once('change_sell_price').on('keyup', 'input', function (e) {
          if (parseInt(this.value) >= 0) {
            var list_price = parseFloat($list_price.children('input').val());
            var sell_price = parseFloat(this.value);
            if (list_price > sell_price) {
              var percent = ((list_price - sell_price) / list_price).toFixed(2) * 100;
              $percent.children('input').val(percent);
            } else {
              $percent.children('input').val('');
            }
          }
        });
      }

    }
  };
})(jQuery, Drupal);