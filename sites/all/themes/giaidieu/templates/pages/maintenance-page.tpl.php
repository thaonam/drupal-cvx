<?php
$format = 'Y-m-d H:i';
$open_date = variable_get('open_time', date($format));
//dsm($open_date);
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<?php print $language->language ?>" lang="<?php print $language->language ?>" dir="<?php print $language->dir ?>">
  <head>
    <title><?php print $head_title; ?></title>
    <?php print $head; ?>
    <?php print $styles; ?>
    <?php print $scripts; ?>
  </head>
  <body class="<?php print $classes; ?>">

  <?php print $page_top; ?>

  <div id="page-wrapper">
    <div id="header" class="clearfix">
      <div class="header-top">
        <div class="container">
          <div class="row">
            <div class="region region-top-header">
              <section id="block-block-1" class="block block-block header-social-wrapper clearfix">
                <div class="block-content">
                  <ul class="header-social">
                    <li><a href="#" class="social-icon"><i class="fa fa-facebook" aria-hidden="true"></i></a></li>
                    <li><a href="#" class="social-icon"><i class="fa fa-twitter" aria-hidden="true"></i></a></li>
                    <li><a href="#" class="social-icon"><i class="fa fa-google-plus" aria-hidden="true"></i></a></li>
                    <li><a href="#" class="social-icon"><i class="fa fa-linkedin" aria-hidden="true"></i></a></li>
                  </ul>
                </div>
              </section>
              <section id="block-block-2" class="block block-block header-language-wrapper clearfix">
                <div class="block-content">
                  <div class="language">
                    <select name="lang" id="">
                      <option value="Tiếng Việt">Tiếng Việt</option>
                      <option value="Tiếng Anh">Tiếng Anh</option>
                    </select>
                  </div>
                </div>
              </section>
              <section id="block-system-user-menu" class="block block-system block-menu clearfix modal_login_register-processed">
                <div class="block-content">
                  <ul class="menu nav">
                    <li class="first leaf"><a href="/user/login" title="">Đăng nhập</a></li>
                    <li class="last leaf"><a href="/user/register" title="">Đăng ký</a></li>
                  </ul>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      <!-- / top header -->

      <div id="header-content">
        <div class="container">
          <div class="row header">
            <div id="logo"><a href="/" title="Back to Homepage">
                <img src="/sites/default/files/logo.png" alt="Tass Care logo">
              </a></div>
            <div class="content-wrapper">
              <div class="region region-header">
                <section id="block-search-form" class="block block-search clearfix">
                  <div class="block-content">
                    <form class="form-search content-search" action="#" method="post" id="search-block-form" accept-charset="UTF-8">
                      <div>
                        <div class="input-group">
                          <input title="Nhập điều kiện tìm kiếm." placeholder="Nhập từ khóa tìm kiếm..." class="form-control form-text" type="text" id="edit-search-block-form--2" name="search_block_form" value="" size="15" maxlength="128">
                          <span class="input-group-btn"><button type="submit" class="btn btn-primary">
                              <span class="icon glyphicon glyphicon-search" aria-hidden="true"></span></button></span>
                          <div class="search-icon"></div>
                        </div>
                        <div class="form-actions form-wrapper form-group" id="edit-actions">
                          <button class="element-invisible btn btn-primary form-submit" type="submit" id="edit-submit" name="op" value="Tìm kiếm">Tìm kiếm</button>
                        </div>
                      </div>
                    </form>
                  </div>

                </section>
              </div>
              <div class="block-cart th_cart-block">
                <a href="/cart">
                  <div class="th_cart-item">
                    <span class="th_count">0</span>
                    <span class="cart-label">Giỏ hàng</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="navigation" class="clearfix">
      <div class="content-wrapper">
        <div class="container">
          <div class="row">
            <div class="menu-bar-wrapper"><div class="menu-bar"><span></span></div></div>
            <div class="region region-navigation">
              <section id="block-system-main-menu" class="block block-system col-lg-9 block-menu clearfix">
                <div class="block-content">
                  <ul class="menu nav"><li class="first leaf active-trail active"><a href="/" title="">Trang chủ</a></li>
                    <li class="leaf"><a href="/ve-chung-toi">Về chúng tôi</a></li>
                    <li class="leaf"><a href="/thay-thuoc-gia-dinh">Thầy thuốc gia đình</a></li>
                    <li class="leaf"><a href="/dich-vu" class="active-trail active">Dịch vụ</a></li>
                    <li class="leaf"><a href="/san-pham">Sản phẩm</a></li>
                    <li class="leaf"><a href="/khach-hang">Khách hàng</a></li>
                    <li class="leaf"><a href="/tin-tuc">Tin tức</a></li>
                    <li class="last leaf"><a href="/lien-he-voi-chung-toi">Liên hệ</a></li>
                  </ul>
                </div>
              </section>
              <section id="block-block-3" class="block block-block col-lg-3 clearfix">
                <div class="block-content">
                  <div class="hotline-wrapper th_book-slot-wrapper">
                    <a class="th_book-slot" href="/dat-lich-hen">Đặt lịch hẹn</a>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="content" class="clearfix" style="margin-top: 60px;">
      <?php if ($messages): ?>
        <div id="console"><?php echo $messages; ?></div>
      <?php endif; ?>
      <div class="container">
        <div class="dh-maintain">
          <div class="maintain-body">
            <div class="maintain-icon"></div>
            <div class="maintain-title">Website đang bảo trì</div>
            <div class="maintain-note">Bạn vui lòng quay lại sau</div>
            <div class="maintain-time">
              <!--<div class="dh-time">
                <div class="number" id="months-value">--</div>
                <div class="unit">Tháng</div>
              </div>-->
              <div class="dh-time">
                <div class="number" id="days-value">--</div>
                <div class="unit">Ngày</div>
              </div>
              <div class="dh-time">
                <div class="number" id="hours-value">--</div>
                <div class="unit">Giờ</div>
              </div>
              <div class="dh-time">
                <div class="number" id="minutes-value">--</div>
                <div class="unit">Phút</div>
              </div>
              <div class="dh-time">
                <div class="number" id="seconds-value">--</div>
                <div class="unit">Giây</div>
              </div>
            </div>
          </div>
        </div><!--  / .dh-maintainance -->
      </div>
    </div>

    <div id="footer" class="clearfix">
      <div class="footer-partner">
      </div>
      <footer id="page-footer" class="th_page-footer">
        <div class="footer-top">
          <div class="container">
            <div class="row">
              <div class="region region-footer">
                <section id="block-block-8" class="block block-block col-xs-12 col-sm-7 col-md-4 clearfix">
                  <div class="block-content">
                    <div class="site-info">
                      <div class="logo"><img alt="" src="sites/all/themes/giaidieu/images/logo.png"> </div>
                      <div class="info">Pellentesque velit mauris, cursus id eros sed, congue egestas libero. Quisque id scelerisque libero. Donec hendrerit vitae nisl ut sollicitudin. Quisque ut urna posuere, gravida nisl eu.</div>
                      <div class="social-group">
                        <a href="#"><i class="fa fa-facebook" aria-hidden="true"></i></a>
                        <a href="#"><i class="fa fa-twitter" aria-hidden="true"></i></a>
                        <a href="#"><i class="fa fa-google-plus" aria-hidden="true"></i></a>
                        <a href="#"><i class="fa fa-linkedin" aria-hidden="true"></i></a>
                      </div>
                      <div class="footer-app">
                        <a href="#"><img alt="" src="/sites/default/files/down-iphone.png"></a>
                        <a href="#"><img alt="" src="/sites/default/files/down-andr.png"></a>
                      </div>
                    </div>

                  </div>
                </section>
                <section id="block-menu-menu-footer-menu-2" class="block block-menu footer-department-list col-xs-12 col-sm-5 col-md-2 clearfix">
                  <h2 class="block-title" data-title="Phòng ban">Phòng ban</h2>
                  <div class="block-content">
                    <ul class="menu nav"><li class="first leaf"><a href="/chinh-sach-bao-hanh-0">Chính sách bảo hành</a></li>
                      <li class="leaf"><a href="/chinh-sach-hop-tac-0">Chính sách hợp tác</a></li>
                      <li class="leaf"><a href="/quy-trinh-phuc-vu-0">Quy trình phục vụ</a></li>
                      <li class="last leaf"><a href="/dieu-khoan-su-dung-0">Điều khoản sử dụng</a></li>
                    </ul>
                  </div>
                </section>
                <section id="block-menu-menu-footer-menu" class="block block-menu footer-help-list col-xs-12 col-sm-5 col-md-2 clearfix">
                  <h2 class="block-title" data-title="Trợ giúp">Trợ giúp</h2>
                  <div class="block-content">
                    <ul class="menu nav"><li class="first leaf"><a href="/dieu-khoan-su-dung">Điều khoản sử dụng</a></li>
                      <li class="leaf"><a href="/chinh-sach-hop-tac">Chính sách hợp tác</a></li>
                      <li class="leaf"><a href="/chinh-sach-bao-hanh">Chính sách bảo hành</a></li>
                      <li class="last leaf"><a href="/quy-trinh-phuc-vu">Quy trình phục vụ</a></li>
                    </ul>
                  </div>
                </section>
                <section id="block-block-25" class="block block-block col-xs-12 col-sm-6 col-sm-push-1 col-md-4 col-md-push-0 clearfix">
                  <div class="block-content">
                    <div class="th_address">
                      <div class="add-head clearfix">
                        <div class=""><i class="fa fa-phone" aria-hidden="true"></i></div>
                        <div class="">
                          <div class="phone-label">Hotline Khẩn Cấp</div>
                          <div class="phone-number">0888.56.16.26</div>
                        </div>
                      </div>
                      <div class="add-body">
                        <p><i class="fa fa-map-marker" aria-hidden="true"></i> 227 Đường 9A, KDC Trung Sơn, Nam Sài Gòn, TP.HCM</p>
                        <p><i class="fa fa-envelope" aria-hidden="true"></i> info@tasscare.com</p>
                        <p><i class="fa fa-globe" aria-hidden="true"></i> Fanpage: https://www.facebook.com/Tasscare/</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <div class="container">
            2017 Copyright © TRUNG TÂM XÉT NGHIỆM Y KHOA TASSCARE
          </div>
        </div>
      </footer>
    </div>

  </div>

  <?php print $page_bottom; ?>

  <script type="text/javascript">
    // Set the date we're counting down to
    var countDownDate = new Date("<?php echo $open_date; ?>").getTime();

    // Update the count down every 1 second
    var x = setInterval(function() {

      // Get todays date and time
      var now = new Date().getTime();

      // Find the distance between now an the count down date
      var distance = countDownDate - now;

      // Time calculations for days, hours, minutes and seconds
//      var years = Math.floor(distance / (1000 * 60 * 60));
//      var months = Math.floor(distance / (1000 * 60 * 60 * 24 * 30));
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Display the result in the element with id="demo"
//      document.getElementById("years-value").innerHTML = years;
//      document.getElementById("months-value").innerHTML = months;
      document.getElementById("days-value").innerHTML = days;
      document.getElementById("hours-value").innerHTML = hours;
      document.getElementById("minutes-value").innerHTML = minutes;
      document.getElementById("seconds-value").innerHTML = seconds;

      // If the count down is finished, write some text
      if (distance <= 0) {
        clearInterval(x);
//        document.getElementById("demo").innerHTML = "EXPIRED";
      }
    }, 1000);
  </script>
  </body>
</html>
