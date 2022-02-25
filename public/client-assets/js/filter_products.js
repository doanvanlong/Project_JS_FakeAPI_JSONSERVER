import API from "./api.js";
import { $, $$ } from "./api.js";
let url = window.location.href;
url = url.split("/");
url = url[url.length - 1];
if (url == "ao_nam.html") {
  // hiển thị trang sản phẩm  áo nam
  async function viewPageAoNam() {
    const productsApi = "http://localhost:3000/products";
    const catesApi = "http://localhost:3000/categories";
    const api = new API();

    api.API = productsApi;
    let products = await api.GetData();
    api.API = catesApi;
    let cates = await api.GetData();
    let findIdCate = cates.find(function (val) {
      return val.name == "Áo";
    });
    let productCateAo = products.filter(function (product) {
      return product.categories_id == findIdCate.id;
    });
    $(".countProductSale").innerText = productCateAo.length + " Sản phẩm";
    //khi select lọc sản phẩm all
    function sortProductAll() {
      productCateAo.sort(function (a, b) {
        return a.id - b.id;
      });
    }
    //khi select lọc sản phẩm mới =? id lớn hơn hiện trước
    function sortProductNew() {
      productCateAo.sort(function (a, b) {
        return b.id - a.id;
      });
    }
    //khi select lọc sản phẩm giá cao =>price lớn hiện trc
    function sortProductPriceMax() {
      productCateAo.sort(function (a, b) {
        return b.price - a.price;
      });
    }
    //khi select lọc sản phẩm giá thấp =>price nhỏ hiện trc
    function sortProductPriceMin() {
      productCateAo.sort(function (a, b) {
        return a.price - b.price;
      });
    }
    //khi select lọc thì mới gọi hàm trong này và thay đổi lại biến sản phẩm
    function sortNav() {
      let valueSort;
      $("#short-by-product-sale").onchange = function () {
        valueSort = $("#short-by-product-sale").value;
        if (valueSort == 0) {
          sortProductAll();
        } else if (valueSort == 1) {
          sortProductNew();
        } else if (valueSort == 2) {
          sortProductPriceMax();
        } else {
          sortProductPriceMin();
        }
        renderProductSale();
      };
    }
    sortNav();

    function renderProductSale() {
      let renderProductSale = productCateAo.map(function (val) {
        let price = new Number(val.price);
        price = price.toLocaleString("vi", {
          style: "currency",
          currency: "VND",
        });
        return `
                  <div class="product-item-element col-sm-6 col-md-4 col-lg-3">
                  <!--Product Item-->
                  <div class="product-item">
                      <div class="product-item-inner">
                          <div class="product-img-wrap">
                              <img  src="${val.img}" alt="">
                          </div>
                          <div class="product-button">
                              <a href="#" class="js_tooltip" data-mode="top" data-tip="Add To Cart"><i class="fa fa-shopping-bag"></i></a>
                              <a href="#" class="js_tooltip" data-mode="top" data-tip="Add To Whishlist"><i class="fa fa-heart"></i></a>
                              <a href="#" class="js_tooltip" data-mode="top" data-tip="Quick&nbsp;View"><i class="fa fa-eye"></i></a>
                          </div>
                      </div>
                      <div class="product-detail">
                          <a class="tag" href="#">Men Fashion</a>
                          <p class="product-title"><a href="product_detail.html?${val.id}">${val.name}</a></p>
                          <div class="product-rating">
                              <div class="star-rating" itemprop="reviewRating" itemscope="" itemtype="http://schema.org/Rating" title="Rated 4 out of 5">
                                  <span style="width: 60%"></span>
                              </div>
                              <a href="#" class="product-rating-count"><span class="count">3</span> Reviews</a>
                          </div>
                          <p class="product-description">
                          </p>
                          <h5 class="item-price">${price}</h5>
                      </div>
                  </div>
                  <!-- End Product Item-->
              </div>
              
                  `;
      });
      renderProductSale = renderProductSale.join("");
      $("#list_product_sale").innerHTML = renderProductSale;
    }
    renderProductSale();
  }
  viewPageAoNam();
} else if (url == "product-sale.html") {
  // hiển thị trang sản phẩm khuyến mãi
  async function viewPageProductSale() {
    const salProductsApi =
      "http://localhost:3000/products?sale_gte=1&sale_lte=100";
    const api = new API();

    api.API = salProductsApi;
    let productSale = await api.GetData();
    $(".countProductSale").innerText = productSale.length + " Sản phẩm";
    //khi select lọc sản phẩm all
    function sortProductAll() {
      productSale.sort(function (a, b) {
        return a.id - b.id;
      });
    }
    //khi select lọc sản phẩm mới =? id lớn hơn hiện trước
    function sortProductNew() {
      productSale.sort(function (a, b) {
        return b.id - a.id;
      });
    }
    //khi select lọc sản phẩm giá cao =>price lớn hiện trc
    function sortProductPriceMax() {
      productSale.sort(function (a, b) {
        return b.price - a.price;
      });
    }
    //khi select lọc sản phẩm giá thấp =>price nhỏ hiện trc
    function sortProductPriceMin() {
      productSale.sort(function (a, b) {
        return a.price - b.price;
      });
    }
    //khi select lọc thì mới gọi hàm trong này và thay đổi lại biến sản phẩm
    function sortNav() {
      let valueSort;
      $("#short-by-product-sale").onchange = function () {
        valueSort = $("#short-by-product-sale").value;
        if (valueSort == 0) {
          sortProductAll();
        } else if (valueSort == 1) {
          sortProductNew();
        } else if (valueSort == 2) {
          sortProductPriceMax();
        } else {
          sortProductPriceMin();
        }
        renderProductSale();
      };
    }
    sortNav();

    function renderProductSale() {
      let renderProductSale = productSale.map(function (val) {
        let price = new Number(val.price);
        let price_new= price
        price_new=price_new*((100-val.sale)/100)
        price_new=price_new.toLocaleString("vi", {style: "currency", currency: "VND"})
        price = price.toLocaleString("vi", {
          style: "currency",
          currency: "VND",
        });
        return `
                  <div class="product-item-element col-sm-6 col-md-4 col-lg-3">
                  <!--Product Item-->
                  <div class="product-item">
                      <div class="product-item-inner">
                      <div class="sale-label">${val.sale}%</div>
                          <div class="product-img-wrap">
                              <img  src="${val.img}" alt="">
                          </div>
                          <div class="product-button">
                              <a href="#" class="js_tooltip" data-mode="top" data-tip="Add To Cart"><i class="fa fa-shopping-bag"></i></a>
                              <a href="#" class="js_tooltip" data-mode="top" data-tip="Add To Whishlist"><i class="fa fa-heart"></i></a>
                              <a href="#" class="js_tooltip" data-mode="top" data-tip="Quick&nbsp;View"><i class="fa fa-eye"></i></a>
                          </div>
                      </div>
                      <div class="product-detail">
                          <a class="tag" href="#">Men Fashion</a>
                          <p class="product-title"><a href="product_detail.html?${val.id}">${val.name}</a></p>
                          <div class="product-rating">
                              <div class="star-rating" itemprop="reviewRating" itemscope="" itemtype="http://schema.org/Rating" title="Rated 4 out of 5">
                                  <span style="width: 60%"></span>
                              </div>
                              <a href="#" class="product-rating-count"><span class="count">3</span> Reviews</a>
                          </div>
                          <p class="product-description">
                          </p>
                          <div class="d-flex justify-content-center">
                          <strike>
                          <span class="item-price-old">${price}</span>
                          </strike>
                          <h5 class="item-price-new ml-3">${price_new}</h5>
                          </div>
                      </div>
                  </div>
                  <!-- End Product Item-->
              </div>
              
                  `;
      });
      renderProductSale = renderProductSale.join("");
      $("#list_product_sale").innerHTML = renderProductSale;
    }
    renderProductSale();
  }
  viewPageProductSale();
} else if (url == "quan_nam.html") {
  // hiển thị trang sản phẩm  áo nam
  async function viewPageQuanNam() {
    const productsApi = "http://localhost:3000/products";
    const catesApi = "http://localhost:3000/categories";
    const api = new API();

    api.API = productsApi;
    let products = await api.GetData();
    api.API = catesApi;
    let cates = await api.GetData();
    let findIdCate = cates.find(function (val) {
      return val.name == "Quần";
    });
    let productCateAo = products.filter(function (product) {
      return product.categories_id == findIdCate.id;
    });
    $(".countProductSale").innerText = productCateAo.length + " Sản phẩm";
    //khi select lọc sản phẩm all
    function sortProductAll() {
      productCateAo.sort(function (a, b) {
        return a.id - b.id;
      });
    }
    //khi select lọc sản phẩm mới =? id lớn hơn hiện trước
    function sortProductNew() {
      productCateAo.sort(function (a, b) {
        return b.id - a.id;
      });
    }
    //khi select lọc sản phẩm giá cao =>price lớn hiện trc
    function sortProductPriceMax() {
      productCateAo.sort(function (a, b) {
        return b.price - a.price;
      });
    }
    //khi select lọc sản phẩm giá thấp =>price nhỏ hiện trc
    function sortProductPriceMin() {
      productCateAo.sort(function (a, b) {
        return a.price - b.price;
      });
    }
    //khi select lọc thì mới gọi hàm trong này và thay đổi lại biến sản phẩm
    function sortNav() {
      let valueSort;
      $("#short-by-product-sale").onchange = function () {
        valueSort = $("#short-by-product-sale").value;
        if (valueSort == 0) {
          sortProductAll();
        } else if (valueSort == 1) {
          sortProductNew();
        } else if (valueSort == 2) {
          sortProductPriceMax();
        } else {
          sortProductPriceMin();
        }
        renderProductSale();
      };
    }
    sortNav();

    function renderProductSale() {
      let renderProductSale = productCateAo.map(function (val) {
        let price = new Number(val.price);
        price = price.toLocaleString("vi", {
          style: "currency",
          currency: "VND",
        });
        return `
                  <div class="product-item-element col-sm-6 col-md-4 col-lg-3">
                  <!--Product Item-->
                  <div class="product-item">
                      <div class="product-item-inner">
                          <div class="product-img-wrap">
                              <img  src="${val.img}" alt="">
                          </div>
                          <div class="product-button">
                              <a href="#" class="js_tooltip" data-mode="top" data-tip="Add To Cart"><i class="fa fa-shopping-bag"></i></a>
                              <a href="#" class="js_tooltip" data-mode="top" data-tip="Add To Whishlist"><i class="fa fa-heart"></i></a>
                              <a href="#" class="js_tooltip" data-mode="top" data-tip="Quick&nbsp;View"><i class="fa fa-eye"></i></a>
                          </div>
                      </div>
                      <div class="product-detail">
                          <a class="tag" href="#">Men Fashion</a>
                          <p class="product-title"><a href="product_detail.html?${val.id}">${val.name}</a></p>
                          <div class="product-rating">
                              <div class="star-rating" itemprop="reviewRating" itemscope="" itemtype="http://schema.org/Rating" title="Rated 4 out of 5">
                                  <span style="width: 60%"></span>
                              </div>
                              <a href="#" class="product-rating-count"><span class="count">3</span> Reviews</a>
                          </div>
                          <p class="product-description">
                          </p>
                          <h5 class="item-price">${price}</h5>
                      </div>
                  </div>
                  <!-- End Product Item-->
              </div>
              
                  `;
      });
      renderProductSale = renderProductSale.join("");
      $("#list_product_sale").innerHTML = renderProductSale;
    }
    renderProductSale();
  }
  viewPageQuanNam();
}
