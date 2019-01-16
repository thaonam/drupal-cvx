/* course.js file created by giaidieu.com */
(function ($) {
  // Handle for Course pages.
  Drupal.behaviors.course = {
    attach: function (context, settings) {
      if ($("div#page:not('.processed')").length) {
        // Add course to cart request.
        $("#course-add-to-cart").click(function () {
          var button = $(this);
          if (button.hasClass('disabled')) {
            return false;
          }
          
          var nid = parseInt(button.attr('nid'));
          if (nid) {
            button.addClass('disabled');
            
            $.post('/custom/add-to-cart', {nid: nid}, function (result) {
              button.removeClass('disabled');
              
              if (result) {
                // Reload the page.
                document.location.reload();
              }
            });
          }
          
          return false;
        });
        
        // Buy now course request.
        $("#course-buy-now").click(function () {
          var button = $(this);
          if (button.hasClass('disabled')) {
            return false;
          }
          
          var nid = parseInt(button.attr('nid'));
          if (nid) {
            button.addClass('disabled');
            
            $.post('/custom/add-to-cart', {nid: nid}, function (result) {
              button.removeClass('disabled');
              
              if (result) {
                // Redirect to cart page for checkout.
                document.location.href = '/cart';
              }
            });
          }
          
          return false;
        });
        
        
        $("div#page").addClass('processed');
      }

      /*Slide Video (Page-khoa-hoc-demo)*/
      if ($('.course-phase').length) {
        $('.course-phase').once('click_coll_abc').click(function (e) {
          $(this).next().slideToggle(500);
          $(this).toggleClass('cong');
        });
      }

      // Event click menu course
      $('#course-header ul li a').click(function(event) {
        $(this).parent().siblings().find('a').removeClass('active');
        $(this).addClass('active');  
      });

    }

  };
  
  /* fixed box right with sroll bars (Page-khoa-hoc-demo) */
  $(window).load(function() {
    var height_sroll = $("#header").outerHeight(true) - $('#navigation').outerHeight(true) + $('.banner-top').outerHeight(true);
    var height_up = $('#content').outerHeight(true);
   

   //Test click menu
    $('#course-header li:nth-child(1) a').click(function (event) {
      event.preventDefault();
      $('html,body').animate({scrollTop: $('#course-objective').offset().top}, 1000);
    });

    $('#course-header li:nth-child(2) a').click(function (event) {
      event.preventDefault();
      $('html,body').animate({scrollTop: $('#course-result').offset().top}, 1000);
    });

    $('#course-header li:nth-child(3) a').click(function (event) {
      event.preventDefault();
      $('html,body').animate({scrollTop: $('#course-ratings').offset().top}, 1000);
    });

    $('#course-header li:nth-child(4) a').click(function (event) {
      event.preventDefault();
      $('html,body').animate({scrollTop: $('h2.title.comment-form').offset().top}, 1000);
    });

    $(window).scroll(function (event) {
      var location = $('html,body').scrollTop();

      if (location > height_sroll) {
        $('.node-type-course #right').addClass('sticky-right');
      }

      if (location >height_sroll) {
        $('#course-header').addClass('sticky-menu-course');
      }

      if (location >= height_up) {
        $('.node-type-course #right').removeClass('sticky-right');
        $('#course-header').removeClass('sticky-menu-course');

      }

  
      else if(location < height_sroll) {
        $('.node-type-course #right').removeClass('sticky-right');
        $('#course-header').removeClass('sticky-menu-course');
      }

    });
  });
  


})(jQuery, Drupal);