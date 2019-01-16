<div class="dh-block-search-blue">
  <h2 class="block-title">Tìm Kiếm</h2>
  <div class="block-content" id="custom-search">
    <div class="form-left">
      <div class="form-item">
        <select data-name="catalog" id="search-catalog">
          <option value="_none">Nhóm Sản Shẩm</option>
        </select>
      </div>
      <div class="form-item">
        <select data-name="product_category" id="search-product-cate">
          <option value="">Loại Sản Phẩm</option>
        </select>
      </div>
      <div class="form-item autocomplete-handle">
        <span class="form-control form-text autocomplete-value">Người Bán</span>
        <div class="autocomplete-wrapper">
          <div class="overlay"></div>
          <input type="text" autocomplete="off" class="form-control form-text" placeholder="Tên Người Bán" data-name="seller" id="search-seller">
          <ul class="autocomplete" id="autocomplete-seller"></ul>
        </div>
      </div>
      <div class="form-item autocomplete-handle">
        <span class="form-control form-text autocomplete-value">Đại Lý</span>
        <div class="autocomplete-wrapper">
          <div class="overlay"></div>
          <input type="text" autocomplete="off" class="form-control form-text" placeholder="Tên Đại Lý" data-name="intro_seller" id="search-intro-seller">
          <ul class="autocomplete" id="autocomplete-intro-seller"></ul>
        </div>
      </div>
      <div class="form-item">
        <select data-name="sort_bef_combine" id="search-sort-bef-combine">
          <option>Sắp Xếp</option>
        </select>
      </div>
      <div class="form-item">
        <div class="search-price-wrapper" id="search-price-ui">
          <div class="mount">
            <div class="label">Khoảng giá</div>
            <div class="value-range">[<span class="value1">0</span> - <span class="value2">500.000</span>]</div>
          </div>
          <div id="slider-range"></div>
        </div>
      </div>
    </div>
    <div class="form-right">
      <div class="form-actions">
        <span data-name="submit" class="form-submit">Thực Hiện</span>
      </div>
    </div>
  </div>
</div>

<?php
// $blockLoad = block_load('views','-exp-search_content-page');
// if ($blockLoad) {
//   $block_content = _block_render_blocks(array($blockLoad));
//   $blockBuild = _block_get_renderable_array($block_content);
//   print drupal_render($blockBuild);
// } ?>