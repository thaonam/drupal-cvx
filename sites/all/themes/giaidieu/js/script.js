/* script.js file created by giaidieu.com */
(function ($) {
  Drupal.behaviors.giaidieu = {
    attach: function (context, settings) {
      // back button
      if($('.dh-block-cart-checkout .cart-action').length) {
          $('.dh-block-cart-checkout .cart-action > a').after('<div class="btn btn-back">Quay Lại</div>');
             $('.btn-back').click(function () {
                window.history.back();
            })
      }
      // Sync hotline to icon call
      if ($('#block-block-44 .block-content').length && $('.dh-phone > a').length) {
        $('.dh-phone > a').attr('href', 'tel:' + $('#block-block-44 .block-content').text().trim());
      }

      $('.quicktabs-tabpage ').each(function () {
        if($(this).hasClass('quicktabs-hide')){
          $(this).find('.wow').removeClass('wow');
        }
      });
      //Load animation
      new WOW().init();
  
      $('body').on('click', '.js-action', function (e) {
        if (!$(this).hasClass('disabled')) {
          if ($(this).attr('data-href')) {
            $(this).addClass('disabled');
            if ($('body').find($(this).attr('data-href')).length)
              $('body').find($(this).attr('data-href')).trigger('click');
          }
        }
      });
      
      // Service image
      if ($('.node-service .images #uc_product_image').length) {
        setTimeout(function () {
          var h = $('.node-service .images #uc_product_image').children('.bx-wrapper:first-child').height();
          $('.node-service .images > div > div:first-child + div .bxslider-ths').css('maxHeight', h);
        }, 500);
        
        $(window).resize(function () {
          setTimeout(function () {
            var h = $('.node-service .images #uc_product_image').children('.bx-wrapper:first-child').height();
            $('.node-service .images > div > div:first-child + div .bxslider-ths').css('maxHeight', h);
          }, 300);
        });
      }
      
      if ($('.order-status-comment').length && $('.order-status-value').length) {
        var msg = {
          canceled: "Xin lỗi! Vì lý do khách quan Đơn hàng đã bị hủy bởi Người Bán vui lòng chọn sản SP/DV khác.",
          pending: "Đơn hàng đang được xử lý. Chúng tôi sẽ liên hệ với Bạn sớm.",
          completed: "Đơn hàng đã hoàn thành. Cảm ơn Bạn đã ủng hộ Chúng tôi.",
        }
        var active = $('.order-status-value').val();
        $('.order-status-comment').html(msg[active]);
        $('.order-status-value').change(function () {
          $('.order-status-comment').html(msg[this.value]);
        });
      }
      
      function share_sendFB() {
        var url_link = $('.fb-send')[0].attributes[1].value;
        $('.fb-send').on('click', function () {
          FB.ui({
            method: 'send',
            link: url_link,
          });
        })
      }
      
      setTimeout(function () {
        if ($('.share-icons').length) {
          $('.share-icons').on('show.bs.dropdown', function () {
            
            if (!$(this).children('.dropdown-menu').find('.video-share-icon').length) {
              var url = $(this).children('.dropdown-menu').attr('data-url');
              $(this).children('.dropdown-menu').html('<ul class="video-share-icon">' +
                  '<li class=""><div class="zalo-share-button" data-href="' + url + '" data-oaid="579745863508352884" data-layout="2" data-color="blue"></div></li>' +
                  '<li class=""><div class="fb-send"  data-href="' + url + '"><img src="/sites/all/themes/giaidieu/images/icons/face.png" alt=""></div></li>' +
                  '<li class=""><div class="g-plus" data-action="share" data-href="' + url + '"></div></li>' +
                  '<li class=""><div class="fb-like" data-href="' + url + '" data-layout="button" data-action="like" data-size="small" data-show-faces="true" data-share="true"></div></li>' +
                  '</ul>');
              gapi.plus.go();
              FB.XFBML.parse(this);
              ZaloSocialSDK.reload();
            }
            share_sendFB();
          });
        }
      }, 500);
      
      if ($('.share-lazy-load').length) {
        setTimeout(function () {
          $('.share-lazy-load').each(function (index, el) {
            
            if (!$(this).hasClass('.video-share-icon').length) {
              var url = $(this).attr('data-url');
              $(this).html(
                  '<li class=""><div class="zalo-share-button" data-href="' + url + '" data-oaid="579745863508352884" data-layout="2" data-color="blue"></div></li>' +
                  '<li class=""><div class="fb-send" data-href="' + url + '"><img src="/sites/all/themes/giaidieu/images/icons/face.png" alt=""></div></li>' +
                  '<li class=""><div class="g-plus" data-action="share" data-href="' + url + '"></div></li>' +
                  '<li class=""><div class="fb-like" data-href="' + url + '" data-layout="button" data-action="like" data-size="small" data-show-faces="true" data-share="true"></div></li>'
              );
              gapi.plus.go();
              FB.XFBML.parse(this);
              ZaloSocialSDK.reload();
              $(this).addClass('video-share-icon');
              
            }
            share_sendFB();
          });
        }, 2000);
      }
      
      // Advertising banner hover
      $('#block-block-35 .product-img').mouseover(function () {
        $(this).find('.dh-wrap').addClass('animated bounceIn');
      })
      
      // Admin page - Hander menu bar
      $('.page-menu-bar').click(function () {
        if ($('.page-menu').hasClass('move-right')) {
          $(this).removeClass('active');
          $('.page-menu').removeClass('move-right');
          $('.page-personal').removeClass('move-right');
        } else {
          $(this).addClass('active');
          $('.page-menu').addClass('move-right');
          $('.page-personal').addClass('move-right');
        }
      })
      
      $('#block-search-form .form-text').attr("placeholder", Drupal.t("Nhập Từ Khóa Tìm Kiếm..."));
      $('#block-search-form .input-group').append('<div class="search-icon"></div>');
      $('#block-search-form .search-icon').click(function () {
        if ($(this).siblings('.form-text').hasClass('active')) {
          $(this).siblings('.form-text').removeClass('active');
        } else {
          $(this).siblings('.form-text').addClass('active');
        }
      })
      
      // Font Hander menu bar
      $('.menu-bar').click(function () {
        if ($(this).hasClass('active')) {
          $(this).removeClass('active');
          $('#block-system-main-menu').removeClass('active');
        } else {
          $(this).addClass('active');
          $('#block-system-main-menu').addClass('active');
        }
      })
      
      // count number increase
      function count($this) {
        var current = parseInt($this.html(), 10);
        current = current + 5;
        
        if (current > $this.data('count')) {
          $this.html($this.data('count'));
        } else {
          $this.html(current);
          setTimeout(function () {
            count($this)
          }, 5);
        }
      }
      
      // run auto numbering when page scroll
      var count_run = 0;
      $(window).scroll(function () {
        if ($(".dh-block-statistic")[0]) {
          var current = $(document).scrollTop() + $(window).height();
          var target = $('.dh-block-statistic').offset().top;
          
          if (count_run == 0 && current >= target) {
            $('.statistic-number span').each(function () {
              $(this).data('count', parseInt($(this).html(), 10));
              $(this).html('0');
              count($(this));
            })
            
            count_run = 1;
          }
        }
      })
      
      //  front slideshow
      if ($('.banner-slideshow').length) {
        var thumb = {enable: false};
        
        $('.banner-slideshow').show().revolution({
          delay: 6000,
          sliderLayout: 'auto',
          /* [DESKTOP, LAPTOP, TABLET, SMARTPHONE]*/
          responsiveLevels: [9000, 576],
          gridwidth: 1170,
          gridheight: 630,
          
          navigation: {
            arrows: {
              enable: true,
              style: 'gyges',
              hide_onleave: false,
              
              left: {
                container: 'slider',
                h_align: 'left',
                v_align: 'center',
                h_offset: 0,
                v_offset: 0
              },
              
              right: {
                container: 'slider',
                h_align: 'right',
                v_align: 'center',
                h_offset: 0,
                v_offset: 0
              }
            },
            
            bullets: {
              enable: false
            },
            
            thumbnails: thumb,
            
            touch: {
              touchenabled: 'on',
              swipe_threshold: 100,
              swipe_min_touches: 1,
              swipe_direction: 'horizontal',
              drag_block_vertical: true
            }
          },
        })
      }
      
      //  sub-text Front: Sản Phẩm Chúng Tôi
      if ($('#block-block-37').length && $('#block-quicktabs-our-product').length) {
        $('#block-block-37').find('.block-content').addClass('has-sub');
        $('#block-quicktabs-our-product').once('move-subtext-block').children('.block-content').css('marginTop', '-15px').before($('#block-block-37'));
        $('#block-block-37').removeClass('hide');
      }
      //  sub-text Front: Dịch Vụ Chúng Tôi
      if ($('#block-block-41').length && $('#block-quicktabs-our-service').length) {
        $('#block-block-41').find('.block-content').addClass('has-sub');
        $('#block-quicktabs-our-service').once('move-subtext-block').children('.block-content').css('marginTop', '-15px').before($('#block-block-41'));
        $('#block-block-41').removeClass('hide');
      }

      // Deal block
      if ($('.hot-deal-block  .views-row > .node').length) {
        $('.hot-deal-block  .views-row > .node').each(function(){
          var tmp = $(this).parent();
          $(this).parent().before(this);
          tmp.remove();
        });
        $('.hot-deal-block  .view-content').addClass('owl-carousel').owlCarousel({
          items: 3,
          autoWidth: true,
          merge: true,
          autoplay: true,
          autoplayTimeout: 1001,
          autoplaySpeed: 1000,
          autoplayHoverPause: true,
          pagination: false,
          nav: true
          // responsive : {
          //     // breakpoint from 0 up
          //     0 : {
          //         items: 1
          //     },
          //     // breakpoint from 480 up
          //     480 : {
          //         items: 2
          //     }
          //     // breakpoint from 768 up
          //     // 768 : {
          //     //     option1 : value,
          //     //     option2 : value,
          //     //     ...
          //     // }
          // }
        });
      }
      
      //  Node about us
      if ($('.owl-5-items').length) {
        $('.owl-5-items').find('.field-items').addClass('owl-carousel').owlCarousel({
          items: 5,
          loop: true,
          autoplay: true,
          autoplayTimeout: 1001,
          autoplaySpeed: 1000,
          autoplayHoverPause: true,
          pagination: false,
          nav: false
        });
      }
      
      //  .perfectScrollbar();
      if ($('.perfect-scrollbar').length) {
        $('.perfect-scrollbar').perfectScrollbar();
      }
      
      //  User manage dropdown
      if ($('.user-manage .dropdown').length) {
        $('.user-manage .dropdown').each(function (i, elm) {
          var $this = $(this);
          $this.addClass('mobile-open');
          $this.once('add_dropdown_icon').append('<span class="dropdown-icon"></span>');
          $this.once('click_dropdown_icon').on('click', '.dropdown-icon', function (e) {
            $this.toggleClass('active');
          })
        })
      }
      
      // views-exposed-form form handler
      if ($('.views-exposed-form').length) {
        $('body').addClass('has-filter');
        $('.views-exposed-form').find('.form-text').each(function (i, elm) {
          var text = $(this).parents('.views-exposed-widget').children('label').text().trim();
          $(this).attr('placeholder', text);
        })
      }
      
      if ($('body').hasClass('page-node-325')) {
        if ($('#block-views-node-functions-block-12').length && $('#block-quicktabs-doctor-family').length) {
          $('#block-quicktabs-doctor-family').after($('#block-views-node-functions-block-12'));
        }
      }
      
      // Cart
      if ($('.dh-block-cart-checkout').length) {
        $('.dh-block-cart-checkout').find('thead th:nth-child(4)').hide();
        $('.dh-block-cart-checkout').find('td.remove').hide();
        $('.dh-block-cart-checkout').find('td.qty').each(function () {
          var parent = $(this).parent('tr');
          $(this).append(parent.find('td.remove > button'));
        });
        
        if ($('#uc-cart-pane-coupon').length) {
          $('#uc-cart-pane-coupon').hide();
          $('#coupon-code').val($($('#coupon-code').attr('data-href')).val());
          $('#coupon-code').on('keyup change', function () {
            $(this.dataset['href']).find('input[name="code"]').val(this.value);
          })
        }
      }
      
      //  hot deal
      if ($('.dh-block-shocking-sale').length) {
        $('.dh-block-shocking-sale').find('.view-content .view-row').css('width', '100%');
        $('.dh-block-shocking-sale').find('.view-content').addClass('owl-carousel').owlCarousel({
          items: 3,
          nav: false,
          dots: true,
        });
      }
      
      if ($('.login-register-modal').length) {
        $('.login-register-modal').find('.form-text').each(function () {
          var new_label = $(this).parents('.form-item').children('.control-label').text();
          $(this).attr('placeholder', new_label);
        })
        $('.login-register-modal').find('.form-select').each(function () {
          var new_label = $(this).parents('.form-item').children('.control-label').text();
          if ($(this).children('option[value="_none"]').length) $(this).children('option[value="_none"]').text(new_label);
          else if ($(this).children('option[value=""]').length) $(this).children('option[value=""]').text(new_label);
          $(this).parents('.form-item').children('.control-label').hide();
        })
      }
      
      // Load more
      if ($('.history-wrapper').length) {
        if ($('.history-wrapper ul').children().length > 4) {
          $('.history-wrapper ul li').css('display', 'none');
        }
      }
      
      if ($('.partner-wrapper').length) {
        if ($('.parner-wrapper ul').children().length > 3) {
          $('.parner-wrapper ul li').css('display', 'none');
        }
      }
      
      $(".history-wrapper ul").loadMore({
        selector: 'li',
        limit: 4,
        load: 3,
        loadBtn: '#load-history',
        animate: true,
        animateIn: 'fadeInUp'
      });
      
      $(".partner-wrapper ul").loadMore({
        selector: 'li',
        limit: 3,
        load: 3,
        loadBtn: '#load-partner',
        animate: true,
        animateIn: 'fadeInUp'
      });
      
      // Add tabs view all
      $('#quicktabs-our_service .quicktabs-tabs').append('<li><a href="/dich-vu">Xem Tất Cả</a></li>');
      $('#quicktabs-our_product .quicktabs-tabs').append('<li><a href="/san-pham">Xem Tất Cả</a></li>');
      $('#quicktabs-doctor_family .quicktabs-tabs').append('<li><a href="/thay-thuoc-gia-dinh">Xem Tất Cả</a></li>');
      
      // Handle Popup
      $('.image-popup .bxslider li').each(function () {
        var src = $(this).find('img').prop('src');
        $(this).find('img').wrap("<a class='img-link' href='" + src + "'></a>");
      });
      
      $('.image-popup .img-link').magnificPopup({
        type: 'image',
        closeOnContentClick: true,
        closeBtnInside: false,
        fixedContentPos: true,
        mainClass: 'mfp-no-margins mfp-with-zoom', // class to remove default margin from left and right side
        image: {
          verticalFit: true
        },
      });
      
      $('.image-popup .dh-zoom').magnificPopup({
        type: 'image',
        closeOnContentClick: true,
        mainClass: 'mfp-img-mobile',
        image: {
          verticalFit: true
        }
      });
      function read_more() {
        $('.dh-review-item .review-content').readmore({
          speed: 1000,
          collapsedHeight: 110,
          moreLink: '<a href="#">' + Drupal.t('Read more') + '</a>',
          lessLink: '<a href="#">' + Drupal.t('Read less') + '</a>'
        });
      }
      read_more()
      if ($('#first-login').length) {
        setTimeout(function () {
          $("#first-login").dialog({
            modal: true,
            open: function (event, ui) {
              $('body').addClass('dialog-showing');
              $(this).find(".webform-component--khu-vuc select").select2({
                language: {
                  noResults: function () {
                    return 'Không tìm thấy.';
                  }
                }
              });
            }
          });
        }, 2500);
        $('#first-login').on('click', '#edit-dismiss', function (e) {
          e.preventDefault();
          $.ajax({
            url: '/dismiss/form-1510',
            method: 'POST',
            data: {suggestions_1510: true},
            success: function (res) {
              if (res == true) {
                $('#first-login').dialog('close');
                $('body').removeClass('dialog-showing');
              }
            }
          })
        })
      }
      
    }
  };
})(jQuery);