import API from "./api.js";
import { $, $$ } from "./api.js";

const productApi = "http://localhost:3000/products";
const ordersApi = "http://localhost:3000/orders";

//call api sản phẩm mới
const api = new API();
api.API = productApi;
let products = await api.GetData(); //call api
async function getProductNew() {
  //hiển thị view
  await api.renderHTML(function () {
    let i = 0;
    function sortProductNew() {
      products.sort(function (a, b) {
        return b.id - a.id;
      });
    }
    sortProductNew();
    let htmls = products.map(function (val) {
      i++;
      let price = new Number(val.price);
      let price_new;
      if (val.sale != "") {
        price_new = price;
        price_new = (price_new * (100 - val.sale)) / 100;
        price_new = price_new.toLocaleString("vi", {
          style: "currency",
          currency: "VND",
        });
      } else if (val.sale == "") {
        price_new = price;
      } else {
        price_new = price;
      }
      price_new = price_new.toLocaleString("vi", {
        style: "currency",
        currency: "VND",
      });
      price = price.toLocaleString("vi", {
        style: "currency",
        currency: "VND",
      });
      if (i < 5) {
        return `
        <div class="product-item col-3">
              <div class="product-item-inner">
                  <div class="product-img-wrap">
                      <img class="" src="${val.img}"
                          alt="">
                  </div>
                  <div class="product-button">
                      <a href="#" class="js_tooltip" data-mode="top" data-tip="Add To Cart"><i
                             data-id_sp_add_cart="${val.id}" class="fa fa-shopping-bag click_add_cart" ></i></a>
                      <a href="#" class="js_tooltip" data-mode="top"
                          data-tip="Add To Whishlist"><i class="fa fa-heart"></i></a>
                      <a href="product_detail.html?${val.id}" class="js_tooltip" data-mode="top" data-tip="Quick&nbsp;View"><i
                              class="fa fa-eye"></i></a>
                  </div>
              </div>
              <div class="product-detail">
                  <a class="tag" href="#">Men Fashion</a>
                  <p class="product-title"><a href="product_detail.html?${val.id}">${val.name}</a></p>
                  <div class="product-rating">
                      <div class="star-rating" itemprop="reviewRating" itemscope=""
                          itemtype="http://schema.org/Rating" title="Rated 4 out of 5">
                          <span style="width: 60%"></span>
                      </div>
                      <a href="#" class="product-rating-count"><span class="count">3</span>
                          Reviews</a>
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
        `;
      }
    });
    htmls = htmls.join("");
    $("#new-product").innerHTML = htmls;
    //add cart icon index 
   
  });
}
getProductNew();

async function getProductFeature() {
  //hiển thị view
  await api.renderHTML(function () {
    let i = 0;
    function sortProductFeature() {
      products.sort(function (a, b) {
        return b.id - a.id;
      });
    }
    sortProductFeature();
    let filterProductsFeature = products.filter(function (product) {
      return product.view > 0;
    });
    let htmls = filterProductsFeature.map(function (val) {
      i++;
      let price = new Number(val.price);
      let price_new;
      if (val.sale != "") {
        price_new = price;
        price_new = (price_new * (100 - val.sale)) / 100;
        price_new = price_new.toLocaleString("vi", {
          style: "currency",
          currency: "VND",
        });
      } else if (val.sale == "") {
        price_new = price;
      } else {
        price_new = price;
      }
      price_new = price_new.toLocaleString("vi", {
        style: "currency",
        currency: "VND",
      });
      price = price.toLocaleString("vi", {
        style: "currency",
        currency: "VND",
      });
      if (i < 5) {
        return `
        <div class="product-item col-3">
              <div class="product-item-inner">
                  <div class="product-img-wrap">
                      <img class="" src="${val.img}"
                          alt="">
                  </div>
                  <div class="product-button">
                      <a href="#" class="js_tooltip" data-mode="top" data-tip="Add To Cart"><i
                            data-id_sp_add_cart="${val.id}"  class="fa fa-shopping-ba click_add_cartg "></i></a>
                      <a href="#" class="js_tooltip" data-mode="top"
                          data-tip="Add To Whishlist"><i class="fa fa-heart"></i></a>
                      <a href="product_detail.html?${val.id}" class="js_tooltip" data-mode="top" data-tip="Quick&nbsp;View"><i
                              class="fa fa-eye"></i></a>
                  </div>
              </div>
              <div class="product-detail">
                  <a class="tag" href="#">Men Fashion</a>
                  <p class="product-title"><a href="product_detail.html?${val.id}">${val.name}</a></p>
                  <div class="product-rating">
                      <div class="star-rating" itemprop="reviewRating" itemscope=""
                          itemtype="http://schema.org/Rating" title="Rated 4 out of 5">
                          <span style="width: 60%"></span>
                      </div>
                      <a href="#" class="product-rating-count"><span class="count">3</span>
                          Reviews</a>
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
        `;
      }
    });
    htmls = htmls.join("");
    $(".features_product").innerHTML = htmls;
  });
}
getProductFeature();

//sản phẩm xu hướng
api.API = ordersApi;
let orders = await api.GetData();
let rs = orders.map(function (val) {
  let rss = val.product.map(function (val2) {
    return val2;
  });
  return rss;
});
let id_product = rs.flat();

async function getProductTranding() {
  let i = 0;
  let htmls = products.map(function (val) {
    i++;
    let price = new Number(val.price);
    let price_new;
    if (val.sale != "") {
      price_new = price;
      price_new = (price_new * (100 - val.sale)) / 100;
      price_new = price_new.toLocaleString("vi", {
        style: "currency",
        currency: "VND",
      });
    } else if (val.sale == "") {
      price_new = price;
    } else {
      price_new = price;
    }
    price_new = price_new.toLocaleString("vi", {
      style: "currency",
      currency: "VND",
    });
    price = price.toLocaleString("vi", {
      style: "currency",
      currency: "VND",
    });
    if (i < 5) {
      return `

        <div class="product-item col-3">
        <div class="product-item-inner">
            <div class="product-img-wrap">
                <img src="${val.img}" alt="">
            </div>
            <div class="product-button">
                <a href="#" class="js_tooltip" data-mode="top" data-tip="Add To Cart"><i
                data-id_sp_add_cart="${val.id}" class="fa fa-shopping-bag" click_add_cart></i></a>
                <a href="#" class="js_tooltip" data-mode="top" data-tip="Add To Whishlist"><i
                        class="fa fa-heart"></i></a>
                <a href="product_detail.html?${val.id}" class="js_tooltip" data-mode="top" data-tip="Quick&nbsp;View"><i
                        class="fa fa-eye"></i></a>
            </div>
        </div>
        <div class="product-detail">
            <a class="tag" href="#">Men Fashion</a>
            <p class="product-title"><a href="product_detail.html?${val.id}">${val.name}</a>
            </p>
            <div class="product-rating">
                <div class="star-rating" itemprop="reviewRating" itemscope=""
                    itemtype="http://schema.org/Rating" title="Rated 4 out of 5">
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
      `;
    }
  });
  htmls = htmls.join("");
  $("#new-tranding").innerHTML = htmls;
}
getProductTranding();
