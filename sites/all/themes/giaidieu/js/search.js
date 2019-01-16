/**
 * @file custom search
 */
(function ($, Drupal) {
  Drupal.behaviors.custom_search = {
    attach: function (settings, context) {
      
      //Handler search core funtion
      if ($('#block-views-exp-search-content-page-2').length && $('#block-search-form').length) {
        var $expSearch2 = $('#block-views-exp-search-content-page-2 form');
        var $searchCore = $('#block-search-form form');
        var default_keyword = $expSearch2.find('input[name="keyword"]').val();
        $expSearch2.find('.form-item-edit-type-all').remove();
        $searchCore.find('input[name="search_block_form"]').val(default_keyword);
        //Handle submit form
        $searchCore.once('submit_search').on('submit', function (e) {
          e.preventDefault();
          var keyword = $(this).find('input[name="search_block_form"]').val();
          if ($expSearch2.attr('action').indexOf('type') < 0) {
            window.location.href = Drupal.absoluteUrl('tim-kiem?type=article&keyword=' + keyword.trim());
            return false;
          }
          $expSearch2.find('input[name="keyword"]').val(keyword.trim());
          $expSearch2.submit();
        });
        //Handle sync keyword
        $searchCore.find('input[name="search_block_form"]').on('keyup', function () {
          $expSearch2.find('input[name="keyword"]').val(this.value.trim());
        });
        //Show exp form in active page
        if ($('body').hasClass('page-tim-kiem')) {
          $('#block-views-exp-search-content-page-2').removeClass('default-hide');
        }
        $expSearch2.find('#edit-keyword-wrapper').wrap('<div class="search-actions"></div>');
        $expSearch2.find('#edit-keyword-wrapper').after($expSearch2.find('.views-submit-button'));
        //Add default class type to view-content
        if ($('.search-result').length) {
          var default_type = $expSearch2.find('select[name="type"]').val();
          $('.search-result').addClass('search-result-' + default_type);
        }
      }
      //Handler search 404 page
      if ($('#search-form-404').length && $('#block-views-exp-search-content-page-2').length) {
        var $from404 = $('#search-form-404');
        var $expSearch2 = $('#block-views-exp-search-content-page-2 form');
        $expSearch2.find('.form-item-edit-type-all').remove();
        //Handle submit form
        $from404.once('submit_search_404').on('submit', function (e) {
          e.preventDefault();
          var keyword = $(this).find('input[type="text"]').val();
          if ($expSearch2.attr('action').indexOf('type') < 0) {
            window.location.href = Drupal.absoluteUrl('tim-kiem?type=article&keyword=' + keyword.trim());
            return false;
          }
          $expSearch2.find('input[name="keyword"]').val(keyword.trim());
          $expSearch2.submit();
        });
        //Handle sync 404 keyword
        $from404.find('input[type="text"]').on('keyup', function () {
          $expSearch2.find('input[name="keyword"]').val(this.value.trim());
        });
      }

      if ($('form#views-exposed-form-search-content-page').length) {
        var sForm = $('form#views-exposed-form-search-content-page');
        sForm.find('.views-exposed-widget').each(function(index, el) {
          console.log($(this).find('select option[value="All"]'));
          if ($(this).find('select option[value="All"]').length && $(this).find('label').length) {
            var label = $(this).find('label').text().trim();
            $(this).find('select option[value="All"]').text(label);
          }

        });
        sForm.find('.views-exposed-widgets > div').once('move_item_to_left').wrapAll('<div class="form-left"></div>');
        sForm.find('.views-exposed-widgets .form-left').once('move_item_to_right').after('<div class="form-right"></div>');
        sForm.find('.views-exposed-widgets .form-right').append(sForm.find('.views-submit-button'));
        if (sForm.find('.views-widget-filter-sell_price').length && sForm.find('.views-widget-sort-sort_bef_combine').length) {
          sForm.find('.views-widget-sort-sort_bef_combine').after(sForm.find('.views-widget-filter-sell_price'));
        }
        // Price ranger
        if (sForm.find('.views-widget-filter-sell_price').length) {
          var sPrice = sForm.find('.views-widget-filter-sell_price');
          var rangerHtml = '<div class="search-price-wrapper" id="search-price-ui">' +
                              '<div class="mount">' +
                                '<div class="label">Khoảng giá</div>' +
                                '<div class="value-range">[<span class="value1">0</span> - <span class="value2">1.000.000</span>]</div>' +
                              '</div>' +
                              '<div id="slider-range" class="slider-range"></div>' +
                            '</div>';
          sPrice.once('price_slider_ranger').append(rangerHtml);
          //Slider price
          var price = sPrice.find('.value-range');
          var priceMin = sPrice.find('[name="sell_price[min]"]');
          var priceMax = sPrice.find('[name="sell_price[max]"]');
          sPrice.find( ".slider-range" ).slider({
            range: true,
            min: 0,
            max: 1000,
            step: 10,
            values: [ 0, 1000 ],
            slide: function( event, ui ) {
              var min = ui.values[0] * 1000;
              if (min > 0) {
                console.log(price.children('.value1'), min);
                priceMin.val(min);
                price.children('.value1').html(custom_thousand_format(min));
              } else {
                priceMin.val('');
                price.children('.value1').html(0);
              }
              //Max
              var max = ui.values[1] * 1000;
              priceMax.val(max);
              price.children('.value2').html(custom_thousand_format(max));
            }
          });
        }

        sForm.on('click', '.overlay', function () {
          $(this).hide();
          $(this).parent().removeClass('open');
          sForm.find('.autocomplete').slideUp();
        });

        // Auto complate
        if (sForm.find('.views-widget-filter-field_full_name_value').length) {
          var seller = sForm.find('.views-widget-filter-field_full_name_value');
          seller.find('[name="seller"]').once('autocomplete_html').attr('autocomplate', 'off').after('<div class="overlay"></div><ul class="autocomplete" id="autocomplete-seller"></ul>');

          seller.once('autocomplete_keup').on('keyup', 'input', function () {
            var $renderElement = $(this).parent().find('.autocomplete');
            var url = '/autocomplate/author';
            autocomplete(this.value, $renderElement, url, this.dataset.name);
          });

          seller.once('autocomplete_select').on('click', '.autocomplete > li.value', function () {
            seller.find('[name="seller"]').val(this.dataset.value);
            $(this).parent().removeClass('open');
            $(this).parent().slideUp();
          });
        }
      }

      if ($('#custom-search').length && $('.view-custom-search form').length) {
        var $searchForm = $('#custom-search');
        var $realForm = $('.view-custom-search form');
        //Default type for search
        var type = 'All';
        if ($('body').hasClass('page-node-326'))
          type = 'product';
        if ($('body').hasClass('page-node-325'))
          type = 'service';

        $realForm.find('[name="type"]').val(type);

        $searchForm.on('click', '.form-submit:not(.disabled)', function (e) {
          $(this).addClass('disabled');
          // console.log($realForm.find('.form-submit'));
          $realForm.find('.form-submit').trigger('click');
        });
        $realForm.find('select').each(function (i, select) {
          var text = $(this).parents('.views-exposed-widget').children('label').text().trim();
          $(this).children('option[value="All"]').text(text);
        })
        //Search form hander
        $searchForm.find('select').each(function (i, select) {
          if ($realForm.find('select[name="' + select.dataset.name + '"]').length) {
            $(this).html($realForm.find('select[name="' + select.dataset.name + '"]').html()).val($realForm.find('select[name="' + select.dataset.name + '"]').val());
            $(this).on('change', function (e) {
              $realForm.find('select[name="' + select.dataset.name + '"]').val(this.value);
            });
          }
        });
        //Slider price
        var price = $searchForm.find('.value-range');
        var priceMin = $realForm.find('[name="sell_price[min]"]');
        var priceMax = $realForm.find('[name="sell_price[max]"]');
        $( "#slider-range" ).slider({
          range: true,
          min: 0,
          max: 500,
          step: 10,
          values: [ 0, 500 ],
          slide: function( event, ui ) {
            var min = ui.values[0] * 1000;
            if (min > 0) {
              priceMin.val(min);
              price.children('.value1').html(custom_thousand_format(min));
            } else {
              priceMin.val('');
              price.children('.value1').html(0);
            }
            //Max
            var max = ui.values[1] * 1000;
            priceMax.val(max);
            price.children('.value2').html(custom_thousand_format(max));
          }
        });
        //Auto complate
        if ($searchForm.find('.autocomplete-handle').length) {
          /*$searchForm.find('.autocomplete-handle').find('input').each(function (i, input) {
            var defaultValue = $realForm.find('[name="'+ input.dataset.name +'"]').val().trim();
            if (defaultValue != '') {
              this.value = defaultValue;
              $(this).parents('.autocomplete-handle').children('.autocomplete-value').text(defaultValue);
            }
          });*/

          $searchForm.on('click', '.overlay', function () {
            $(this).parent().removeClass('open').hide();
          });

          $searchForm.find('.autocomplete-handle').once('autocomplete_handle').on('click', '.autocomplete-value', function () {
            $(this).parent().children('.autocomplete-wrapper').toggleClass('open').toggle();
          });

          $searchForm.find('.autocomplete-handle').once('autocomplete_search').on('keyup', 'input', function (e) {
            var $renderElement = $(this).next('.autocomplete');
            var url = (this.dataset.name == 'intro_seller') ? '/autocomplate/intro-seller' : '/autocomplate/author';
            autocomplete(this.value, $renderElement, url, this.dataset.name);
            /*if (this.value == '') {
              var defaultText = $realForm.find('[name="'+ this.dataset.name +'"]').parents('.views-exposed-widget').children('label').text().trim();
              $(this).parents('.autocomplete-handle').children('.autocomplete-value').text(defaultText);
              $realForm.find('[name="'+ this.dataset.name +'"]').val('');
            }*/
          });

          $searchForm.find('.autocomplete-handle').once('autocomplete_select').on('click', '.autocomplete > li.value', function () {
            $(this).parents('.autocomplete-handle').children('.autocomplete-value').text(this.dataset.value);
            $realForm.find('[name="'+ this.dataset.name +'"]').val(this.dataset.value);
            $(this).parents('.autocomplete-wrapper').hide().removeClass('open');
          });
        }
      }

    }
  }


  function autocomplete(keyword = '', $renderElement, url, name) {
    // Close the autocomplete.
    if (keyword == '') {
      if (keyword.trim() == '') {return false;}
    }
    // Store this keyword.
    keyword = keyword.trim().replace(/\s+/g, '+');
    $.ajax({
      url: url + '?keyword=' + keyword,
      success: function (data) {
        $renderElement.slideDown();
        $renderElement.parent().addClass('open');
        if (data.nodes.length > 0) {
          $renderElement.empty()
          for (var i = 0; i < data.nodes.length; i++) {
            var row = data.nodes[i]['node'];
            $renderElement.append('<li class="value" data-name="' + name + '" data-value="' + row.title + '">'+ row.title +'</li>');
          }
        } else {
          $renderElement.html('<li class="empty">Nhập đủ từ khóa để tìm đúng</li>');
        }
      }
    });
  }

})(jQuery, Drupal)