/* custom.js file created by giaidieu.com */
(function ($, Drupal) {
  Drupal.behaviors.custom_theme = {
    attach: function (context, settings) {

      // Add class merge for rows
      if ($('body').hasClass('page-tim-kiem')) {
        $('.page-tim-kiem').find('.node-product.node-teaser').each(function (index, elm) {
          var merge_class = elm.dataset ? 'merge-' + elm.dataset.merge : '';
          $(elm).closest('.views-row').addClass(merge_class);
        });
      }

      // Wishlist handle
      $.get('/whishlist-content', function (data) {
        if (!$.isEmptyObject(data.nodes)) {
          for (var i in data.nodes) {
            var wnid = '.dh-wishlist #uc-product-add-to-cart-form-' + data.nodes[i].node.nid;
            if ($(wnid).length) {
              $(wnid).find('.node-add-to-wishlist').addClass('active');
            }
          }
        }
      });

      //Chuyển 2 block thầy thuốc gia đình ở trang tin tức ra ngoài content
      if ($('body').hasClass('page-node-328')) {
        if ($('#block-block-19').length) {
          $('#page').once('move_titTTGD_bottom').append($('#block-block-19'));
        }
        if ($('#block-quicktabs-doctor-family').length) {
          $('#page').once('move_TTGD_bottom').append($('#block-quicktabs-doctor-family'));
        }
      }

      var owl_3_settings = {
        items: 3,
        lazyLoad: true,
        nav: true,
        navText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>', '<i class="fa fa-angle-right" aria-hidden="true"></i>'],
        slideSpeed: 700,
        dots: false,
        autoplay: true,
        autoplayTimeout: 2000,
        autoplayHoverPause: true,
        rewind: true,
        merge: true,
        // Responsive 
        responsive: {
          0: {  // breakpoint from 0 up
            items: 1
          },
          480: {  // breakpoint from 480 up
            items: 2,
          },
          992: {  // breakpoint from 768 up
            items: 3,
          }
        }
      };
      var owl_4_settings = {
        //items: 4,
        autoplay: true,
        autoplayTimeout: 2000,
        autoplayHoverPause: true,
        lazyLoad: true,
        nav: true,
        navText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>', '<i class="fa fa-angle-right" aria-hidden="true"></i>'],
        slideSpeed: 500,
        dots: false,
        rewind: true,
        merge: true,
        // Responsive 
        responsive: {
          0: {  // breakpoint from 0 up
            items: 1
          },
          480: {  // breakpoint from 480 up
            items: 2,
          },
          768: {
            items: 3,
          },
          992: {  // breakpoint from 768 up
            items: 4,
          },
        }
      };
      var owl_2_settings = {
        lazyLoad: true,
        nav: true,
        navText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>', '<i class="fa fa-angle-right" aria-hidden="true"></i>'],
        slideSpeed: 500,
        dots: false,
        merge: true,
        // Responsive 
        responsive: {
          0: {  // breakpoint from 0 up
            items: 1,
          },
          768: {
            items: 2,
          },
        }
      };
      var owl_5_settings = {
        //items: 4,
        autoplay: true,
        autoplayTimeout: 2000,
        autoplayHoverPause: true,
        lazyLoad: true,
        nav: true,
        navText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>', '<i class="fa fa-angle-right" aria-hidden="true"></i>'],
        slideSpeed: 500,
        dots: false,
        rewind: true,
        merge: true,
        // Responsive 
        responsive: {
          0: {  // breakpoint from 0 up
            items: 1
          },
          480: {  // breakpoint from 480 up
            items: 2,
          },
          768: {
            items: 3,
          },
          992: {  // breakpoint from 768 up
            items: 4,
          },
          1200: {
            items: 5
          }
        }
      };
      var owl_1_settings = {
        rewind: true,
        lazyLoad: true,
        nav: true,
        navText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>', '<i class="fa fa-angle-right" aria-hidden="true"></i>'],
        slideSpeed: 500,
        dots: false,
        items: 1,
        autoplay: true,
        autoplayTimeout: 2000,
        autoplayHoverPause: true,
        merge: true,
      };
      var owl_3_settings_dots = {
        //items: 3,
        rewind: true,
        lazyLoad: true,
        nav: false,
        slideSpeed: 700,
        dots: true,
        autoplay: true,
        autoplayTimeout: 2000,
        autoplayHoverPause: true,

        // Responsive 
        responsive: {
          // breakpoint from 0 up
          0: {
            items: 1
          },
          // breakpoint from 480 up
          480: {
            items: 2,
          },
          // breakpoint from 768 up
          992: {
            items: 3,
          }
        }
      }

      $('.news-custom-slide.owl-carousel').owlCarousel({
        rewind: true,
        lazyLoad: true,
        nav: true,
        navText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>', '<i class="fa fa-angle-right" aria-hidden="true"></i>'],
        slideSpeed: 500,
        dots: false,
        items: 1
      });

      if ($('.dh-review-slide .view-content').length) {
        var fbSlide = $('.dh-review-slide .view-content');
        fbSlide.addClass('owl-carousel').owlCarousel({
          rewind: true,
          lazyLoad: true,
          nav: true,
          navText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>', '<i class="fa fa-angle-right" aria-hidden="true"></i>'],
          slideSpeed: 500,
          dots: false,
          items: 1,
          autoplay: true,
          // autoplayTimeout: 2000,
          // autoplayHoverPause: true,
          loop: true,
          video: true,
          heightAuto: true,
        });
        fbSlide.on('click', '.has-video .play-hover', function () {
          $(this).parents('.video').html('<a class="owl-video" href="' + this.dataset.video + '"></a>');
          fbSlide.trigger('refresh.owl.carousel');
          fbSlide.trigger('play.owl.video');
        });
      }

      $('.page-node-329 .form-item-submitted-other > label').click(function () {
        $(this).next().slideToggle();
      });

      $('.page-node-329 #edit-submitted-other label').each(function () {
        $(this).click(function () {
          if ($(this).find('input[type="checkbox"]:checked').length) {
            $(this).addClass('check');
          }
          else {
            $(this).removeClass('check');
          }
        })
      })

      // Slideshow
      if ($('.not-front .custom-slideshow').length) {
        $('.not-front .custom-slideshow').each(function () {
          $(this).find('.view').addClass('row');
          $(this).find('.views-row').removeClass('col-sm-6 col-md-4 col-md-3');
          $(this).find('.view-content').addClass('owl-carousel');
          if (!$(this).hasClass('owl-4-items')) {
            $(this).addClass('owl-3-items').find('.owl-carousel').owlCarousel(owl_3_settings);
          }

          else {
            $(this).find('.owl-carousel').owlCarousel(owl_4_settings);
          }

        });
      }

      if ($('.review-wrapper').length) {
        $('.dh-carousel-review').flexslider({
          animation: "slide",
          controlNav: true,
          directionNav: false,
          animationLoop: true,
          pauseOnAction: false,
          slideshow: false,
          minItems: 3,
          maxItems: 3,
          dots: true,
          itemWidth: 60,
          itemMargin: 0,
          asNavFor: '.dh-flex-review'
        });

        $('.dh-flex-review').flexslider({
          animation: "slide",
          controlNav: false,
          animationLoop: true,
          directionNav: false,
          pauseOnAction: false,
          sync: ".dh-carousel-review",
          'before': function (slider) {
            $('.dh-body-alter-wrapper').flexslider(slider.animatingTo);
          }
        });

        $('.dh-body-alter-wrapper').flexslider({
          animation: "slide",
          controlNav: false,
          animationLoop: true,
          directionNav: false,
          pauseOnAction: false,
        });
      }

      // Partner
      if ($('.partner').length) {
        $('.partner').find('.view-content').addClass('owl-carousel').children('.views-row').removeClass('col-20');
        $('.partner').find('.owl-carousel').owlCarousel({
          dots: false,
          rewind: true,
          nav: true,
          navText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>', '<i class="fa fa-angle-right" aria-hidden="true"></i>'],
          autoplay: true,
          autoplayTimeout: 2000,
          autoplayHoverPause: false,
          // Responsive
          responsive: {
            0: {
              items: 2
            },
            576: {
              items: 3,
            },
            768: {
              items: 4,
            },
            992: {
              items: 5,
            }
          }
        });
      }

      /* slide pager loadmore custom-slide slide-pager
       * view has class: col-1-items for 1 item per colum else 2 item per colum
       * view has class: owl-4-items for slide with 4 item per slide , owl-1-item for 1 item else 3.
       */
      if ($('.slide-pager').length) {
        $.each(Drupal.views.instances, function (index, view) {

          if (view.$view.hasClass('slide-pager')) {
            view.$view.addClass('row').find('.pager').hide();
            var owlSettings = owl_3_settings;
            if (view.$view.hasClass('owl-5-items')) {
              owlSettings = owl_5_settings;
            }
            if (view.$view.hasClass('owl-4-items')) {
              owlSettings = owl_4_settings;
            }
            if (view.$view.hasClass('owl-2-items')) {
              owlSettings = owl_2_settings;
            }
            if (view.$view.hasClass('owl-1-item')) {
              owlSettings = owl_1_settings;
            }
            if (view.$view.hasClass('owl-3-item-dots')) {
              owlSettings = owl_3_settings_dots;
            }
            var itemPerCol = (view.$view.hasClass('col-1-items')) ? 1 : 2;
            var $slidePager = this.$view.find('.view-content');
            var newHtml = marge_slide_item($slidePager.children('.views-row'), itemPerCol);
            owlSettings.merge = true;
            $slidePager.html(newHtml);
            $slidePager.addClass('owl-carousel').owlCarousel(owlSettings);
            $slidePager.on('changed.owl.carousel', function (event) {
              if (event.page.index == event.page.count - 1) {
                slide_loadmore($slidePager, view);
              }
            });
          }
        })
      }


      /* marge slide item for new slide
       * $rows rows jquery element object
       * itemPerCol: item per colum
       * type: string or array
       * */
      function marge_slide_item($rows, itemPerCol, type) {
        if (itemPerCol == undefined) {
          itemPerCol = 2;
        }
        if (type == undefined) {
          type = 'string';
        }
        var out = [];
        for (var i = 0; i < $rows.length; i = i + itemPerCol) {
          if (itemPerCol > 1) {
            var second = '';
            if ((i + 1) < $rows.length) {
              second = $rows[i + 1].innerHTML;
            }
            var tmp = $rows[i].innerHTML + second;
          }
          else {
            var tmp = $rows[i].innerHTML;
          }
          out.push(tmp);
        }

        if (type == 'string') {
          return out.join('\n');
        }

        return out;
      }

      function slide_loadmore($slidePager, view) {
        if (view.$view.find('.pager-next a').length) {
          var next = view.$view.find('.pager-next a').attr('href').split('?page=')[1];
          if (next) {
            view.pagerAjax.submit.page = next;
            $.post(view.pagerAjax.url, view.pagerAjax.submit, function (data) {
              for (var i = 0; i < data.length; i++) {
                if (data[i].data) {
                  var elements = $(data[i].data);
                  var rows = $('.views-row', elements);
                  var pager = $('.pager', elements);
                  if (pager.length) {
                    view.$view.find('.pager').html(pager[0].innerHTML);
                  }
                  var itemPerCol = (view.$view.hasClass('col-1-items')) ? 1 : 2;
                  var rowsItems = marge_slide_item(rows, itemPerCol, 'array');
                  try {
                    rowsItems.map(function (elm, i) {
                      $slidePager.trigger('add.owl.carousel', elm);
                    });
                    $slidePager.trigger('refresh.owl.carousel');
                  }
                  catch (err) {
                    // console.log(err);
                  }
                }
              }
            })
          }
        }
      }

      // thêm nút tăng giảm trong chọn số lượng
      if ($('.add-to-cart').length) {
        $('.add-to-cart .form-item-qty input').after('<div class="change"><div class="increase">+</i></div><div class="decrease">-</div></div>');
        $('.change .increase').once('oneclick').click(function () {
          var value = parseInt($('.add-to-cart .form-item-qty input').val());

          value++;
          $('.add-to-cart .form-item-qty input').val(value);
        });
        $('.change .decrease').once('oneclick').click(function () {
          var value = parseInt($('.add-to-cart .form-item-qty input').val());
          if (value > 1) {
            value--;
            $('.add-to-cart .form-item-qty input').val(value);
          }

        });
      }

      //  Family docter video: slideshow video
      if ($('#block-views-node-functions-slide-new-videos').length) {

        var $slideVideos = $('#block-views-node-functions-slide-new-videos .slideshow-videos');
        $slideVideos.children('.view-header').addClass('col-sm-9');
        $slideVideos.children('.view-content').addClass('col-sm-3');

        /*
        var vid = $slideVideos.find('.views-row:first-child .video-url').attr('data-vid');
        $slideVideos.find('.views-row:first-child .video-url').once('first_video').addClass('active');
        $poster = $slideVideos.find('.video-url.active img').prop('src');
        var $videoPlayer = $slideVideos.find('.video-player');
        $slideVideos.find('.dh-image').css('background-image','url(' +$poster+ ')');

        $videoPlayer.once('play_video').html('<iframe width="1170" height="658" src="https://www.youtube.com/embed/'+ vid +'?rel=0?ecver=1" frameborder="0" allowfullscreen></iframe>');
        $slideVideos.once('change_video').on('click', '.video-url', function () {
          if (!$(this).hasClass('active')) {
            $slideVideos.find('.video-url.active').removeClass('active');
            $(this).addClass('active');
            vid = this.dataset.vid;
            $videoPlayer.html('<iframe width="1170" height="658" src="https://www.youtube.com/embed/'+ vid +'?rel=0?ecver=1" frameborder="0" allowfullscreen></iframe>');

            $slideVideos.find('.dh-video-demo').removeClass('playing');
            $poster = $(this).find('img').prop('src');
            $slideVideos.find('.dh-image').css('background-image','url(' +$poster+ ')');
          }
        })

        $slideVideos.once('play_video').on('click', '.dh-video-demo', function () {
          $slideVideos.find('.dh-video-demo').addClass('playing');
          $videoPlayer.html('<iframe width="1170" height="658" src="https://www.youtube.com/embed/'+ vid +'?autoplay=1&cc_load_policy=1" frameborder="0" allowfullscreen></iframe>');
        });
        */
      }

      if ($('body').hasClass('node-type-family-doctor-video')) {
        if ($('#block-views-node-functions-block-42').length) {
          $('.region-content-below > .block:last-child').once('move_related_pro_top_bottom').after($('#block-views-node-functions-block-42'));
        }
        if ($('#block-views-node-functions-block-38').length) {
          $('.region-content-below > .block:last-child').once('move_related_pro_top_bottom').after($('#block-views-node-functions-block-38'));
        }
      }


      if ($('#block-custom-front-statistics').length && $('#block-custom-front-statistics h2.block-title').length) {
        $('#block-custom-front-statistics').once('move_title').find('.bg-overlay').after($('#block-custom-front-statistics').children('h2.block-title'));
      }


    }
  };
})(jQuery, Drupal);
