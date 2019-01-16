/* custom.js file created by giaidieu.com */
(function ($, Drupal) {
  Drupal.behaviors.hu_js = {
    attach: function (context, settings) {
      $('.vision-carousel').flexslider({
        animation: "slide",
        controlNav: false,
        animationLoop: false,
        slideshow: false,
        itemWidth: 150,
        itemMargin: 5,
        asNavFor: '.vision-flexslider'
      });
      
      $('.vision-flexslider').flexslider({
        animation: "slide",
        controlNav: false,
        animationLoop: false,
        slideshowSpeed: 2000,
        sync: ".vision-carousel"
      });
      
      $('[data-countdown]').each(function () {
        var $this = $(this), finalDate = $(this).data('countdown');
        $this.countdown(finalDate, function (event) {
          $this.find('.number-day').html(event.strftime('%D'));
          $this.find('.number-h').html(event.strftime('%H'));
          $this.find('.number-m').html(event.strftime('%M'));
          $this.find('.number-s').html(event.strftime('%S'));
        });
      });
      
      $('.important-detail .marquee').marquee({
        //speed in milliseconds of the marquee
        duration: 13000,
        //gap in pixels between the tickers
        gap: 200,
        //time in milliseconds before the marquee will start animating
        delayBeforeStart: 0,
        //'left' or 'right'
        direction: 'left',
        //true or false - should the marquee be duplicated to show an effect of continues flow
        duplicated: true
      });
      
      $('.form-item-panes-payment-payment-method .control-label').click(function () {
        $(this).parent().siblings().find('.control-label').removeClass('active');
        $(this).addClass('active');
      })
      
      // $('.dh-video-demo').click(function(){
      // 	$(this).addClass('playing');
      // 	var vid = $(this).find('.dh-video-id').text();
      // 	var target = $(this).siblings('.field-type-youtube');
      // 	$(this).find('.dh-video-player .youtube-container--responsive').html(' <iframe width="100%" height="100%" src="https://www.youtube.com/embed/'
      // 		+ vid +'?autoplay=1&cc_load_policy=1" frameborder="0" allowfullscreen></iframe>');
      // })
      
      
      var owl_4_setttings = {
        rewind: true,
        merge: true,
        nav: false,
        autoplay: true,
        autoplayTimeout: 2000,
        autoplayHoverPause: true,
        responsive: {
          0: {
            items: 1,
            mergeFit: true,
            autoHeight: true,
          },
          
          576: {
            items: 2,
            autoHeight: false,
          },
          
          768: {
            items: 3,
            mergeFit: false,
          },
          
          992: {
            items: 4,
          }
        }
      }
      
      if ($('.slideshow-2-rows').length) {
        $.each(Drupal.views.instances, function (index, view) {
          if (view.$view.hasClass('slideshow-2-rows')) {
            view.$view.addClass('row').find('.pager').hide();
            
            var $slidePager = this.$view.find('.view-content');
            var newHtml = make_two_row($slidePager.children('.views-row'));
            $slidePager.html(newHtml);
            
            var owl = $('.owl-carousel.owl-autowidth1');
            owl.owlCarousel(owl_4_setttings);
            var owl2 = $('.owl-carousel.owl-autowidth2');
            owl2.owlCarousel(owl_4_setttings);
            // Go to the next item
            $('.slideshow-2-rows .owl-next').click(function () {
              owl1.trigger('next.owl.carousel');
              owl2.trigger('next.owl.carousel');
            })
            // Go to the previous item
            $('.slideshow-2-rows .owl-prev').click(function () {
              // With optional speed parameter
              // Parameters has to be in square bracket '[]'
              owl1.trigger('prev.owl.carousel');
              owl2.trigger('prev.owl.carousel');
            })
          }
        })
      }
      
      /* slide content into 2 row
       * $content: array of items
       */
      function make_two_row($content) {
        var break_point = $content.length / 2;
        var row1 = [];
        var row2 = [];
        for (var i = 0; i < $content.length; i++) {
          if (i < break_point) {
            row1.push($content[i].innerHTML);
          } else {
            row2.push($content[i].innerHTML);
          }
        }
        
        var out = '<div class="owl-carousel owl-autowidth1">' + row1.join('\n') + '</div>';
        var out = out + '<div class="owl-carousel owl-autowidth2">' + row2.join('\n') + '</div>';
        return out;
      }
      
      $('.search-result').addClass('dh-block-doctors');
      
      // $('.dh-mfp-link').click(function(){
      //  	$('#navigation').addClass('hidden');
      //  });
      
      //  $('body').on('click', '.mfp-close', function(e){
      //  	e.preventDefault();
      //  	console.log('into');
      //  	$('#navigation').removeClass('hidden');
      //  })
      
      
      // Initialize popup by magnificPopup
      $('.dh-mfp-link').each(function () {
        var href = $(this).prop('href');
        
        $(this).magnificPopup({
          type: 'inline',
          preloader: false,
          focus: href,
          closeBtnInside: false,
          
          // When elemened is focused, some mobile browsers in some cases zoom in
          // It looks not nice, so we disable it:
          callbacks: {
            beforeOpen: function () {
              if ($(window).width() < 700) {
                this.st.focus = false;
              } else {
                this.st.focus = href;
              }
            }
          }
        });
      });
      
      
    }
  };
})(jQuery, Drupal);