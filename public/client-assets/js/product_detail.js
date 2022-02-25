let url = location.href;
url = url.split("?");
let id = url[1];

import API from "./api.js";
import { $, $$ } from "./api.js";

//call api sản phẩm mới
const info_ProductApi = `http://localhost:3000/products/${id}`;
const productsApi = `http://localhost:3000/products`;

const api = new API();
api.API = info_ProductApi;
const info_product = await api.GetData(); //call api info sp
let view = info_product.view;
//update view
// khi click add cart mới Tính
function updateViewProduct() {
  let data = {
    view: view + 1,
  };
  fetch(info_ProductApi, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

api.API = productsApi;
// view html dữ liệu info sản Phẩm
async function ViewHtmlInfoProduct() {
  $(".breadcrumb-name_info_product").innerText = info_product.name;
  $(".product-title").innerText = info_product.name;
  $(".product-descriptionnn").innerHTML = info_product.description;

  let price = new Number(info_product.price);
  let price2 = new Number(info_product.price);

  price = price.toLocaleString("vi", { style: "currency", currency: "VND" });
  $(".product-price-new").innerText = price;
  $(".product-price-new").setAttribute("data-price_new", price2);

  $(".product-price-old").innerText = price;
  $(".product-price").children[0].remove();
  let info_color_db = info_product.more.color;
  let elements_color = $$(".entry_color");
  elements_color = Array.from(elements_color);
  elements_color.forEach(function (val) {
    if (val.getAttribute("data-color") == info_color_db) {
      val.classList.add("active");
    }
  });
  let b = `<img src="${info_product.img}">`;
  $(".product-gallery-item").innerHTML = b;

  let imgDetails = info_product.more.imgDetail;
  let i = 0;
  let rs = imgDetails.map(function (val) {
    i++;
    if (i < 7) {
      return `
            <div class="col-2 my-4 " style="cursor:pointer">
              <img  class="clickLinkImgDetail" src="${val}" />
            </div>
            `;
    }
  });
  rs = rs.join("");
  $("#imgDetail").innerHTML = rs;

  $("#tab_description").innerHTML = info_product.description;

  //click img detail thay đổi hình ảnh chính

  let list_img_click = $$(".clickLinkImgDetail");
  list_img_click = Array.from(list_img_click);
  list_img_click.forEach(function (val) {
    val.onclick = function () {
      let src = val.getAttribute("src");
      $(".product-gallery-item").children[0].setAttribute("src", src);
    };
  });

  //c
  const products = await api.GetData(); //call api all sản phẩm
  let sub_id_product = info_product.sub_categories_id;

  //lọc tất cả sản phẩm thuộc danh mục con
  let list_relate_product = products.filter(function (val) {
    if (val.id != info_product.id) {
      return val.sub_categories_id == sub_id_product;
    }
  });
  let html_relate_product = list_relate_product.map(function (val) {
    let price = new Number(val.price);
    price = price.toLocaleString("vi", {
      style: "currency",
      currency: "VND",
    });
    return `
     <div class="product-item col-3">
          <div class="product-item-inner">
              <div class="product-img-wrap">
                  <img src="${val.img}" alt="">
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
                  When an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic remaining essentially unchanged.
              </p>
              <h5 class="item-price" >${price}</h5>
          </div>
    </div>
    `;
  });
  $("#relate-products").innerHTML = html_relate_product;

  // Xử lý thay đổi giá khi click vào tăng số lượng sp

  async function HandlePrice() {
    let id = info_product.id;
    let quantity = $(".quantity").value;
    quantity = new Number(quantity);
    let priceNew = $(".product-price-new").getAttribute("data-price_new");
    let priceUpdate;
    // click tăng số lượng
    $(".quantityPlus").onclick = function () {
      quantity += 1;
      priceUpdate = priceNew * quantity;
      $(".product-price-new").setAttribute("data-price_new", priceUpdate);

      priceUpdate = priceUpdate.toLocaleString("vi", {
        style: "currency",
        currency: "VND",
      });
      $(".product-price-new").innerText = priceUpdate;
    };
    // click giảm số lượng
    $(".quantityMinus").onclick = function () {
      if (quantity > 1) {
        quantity -= 1;
        priceUpdate = priceNew * quantity;
        $(".product-price-new").setAttribute("data-price_new", priceUpdate);
        priceUpdate = priceUpdate.toLocaleString("vi", {
          style: "currency",
          currency: "VND",
        });
        $(".product-price-new").innerText = priceUpdate;
      }
    };
  }
  HandlePrice();
}
ViewHtmlInfoProduct();
//Thêm sp vào giỏ
async function AddCart() {
  $("#addCartProDetaill").onclick = function (e) {
    e.preventDefault();
    
    // lấy màu,size sản phẩm add cart
    let colorProduct = $(".entry_color.active").getAttribute("data-color");
    let sizeProduct = $(".entry_size.active").getAttribute("data-size");
    // let priceProduct=$('.product-price-new').getAttribute('data-price_new')
    let quantityProduct = $(".quantity").value;
    quantityProduct = new Number(quantityProduct);
    let data = {
      id: info_product.id,
      name: info_product.name,
      color: colorProduct,
      size: sizeProduct,
      price: info_product.price,
      img: info_product.img,
      quantity: quantityProduct,
    };
    if (localStorage.getItem("cart") == null) {
      localStorage.setItem("cart", "[]");
    }
    var old_data = JSON.parse(localStorage.getItem("cart"));

    //kiểm tra nếu trùng
    var matches = old_data.filter(function (obj) {
      // nếu trùng tăng só lượng
      if (obj.id == info_product.id) {
        obj.quantity += quantityProduct;
      }
      return obj.id == info_product.id;
    });
    if (matches.length) {
    } else {
      // ko trùng push biến data_old
      old_data.push(data);
    }
    // xong tất cả set lại localStorage
    localStorage.setItem("cart", JSON.stringify(old_data));

    //thêm thành công hiện giỏ hàng  modal lên
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Thêm sản phẩm  thành công",
      showConfirmButton: false,
      timer: 1500,
    });
    setTimeout(function () {
      $("#sidebar-right").classList.add("sidebar-open");
      if (localStorage.getItem("cart")) {
        //hàm render modal cart
        function renderCartModal(callback) {
          let cart = JSON.parse(localStorage.getItem("cart"));

          let sum = 0;
          let rs = cart.map(function (val) {
            let price = new Number(val.price);
            price = price.toLocaleString("vi", {
              style: "currency",
              currency: "VND",
            });
            let quantity = new Number(val.quantity);
            sum += quantity * val.price;
            return `
              <li>
                  <!--Item Image-->
                  <a href="#" class="product-image">
                      <img src="${val.img}" alt="" /></a>
          
                  <!--Item Content-->
                  <div class="product-content">
                      <!-- Item Linkcollateral -->
                      <a class="product-link" href="#">${val.name}
                      <!-- Item Cart Totle -->
                      <div class="cart-collateral">
                          <span class="qty-cart">${val.quantity}</span>&nbsp;<span>&#215;</span>&nbsp;<span
                              class="product-price-amount"><span class="currency-sign"></span data-price="${val.price}">${price}</span>
                      </div>
          
                      <!-- Item Remove Icon -->
                      <a class="product-remove"  data-id_cart="${val.id}" href="javascript:void(0)"><i class="fa fa-times-circle"
                              aria-hidden="true"></i></a>
                  </div>
              </li>
                   `;
          });
          $(".cart-product-item").innerHTML = rs;
          sum = sum.toLocaleString("vi", {
            style: "currency",
            currency: "VND",
          });
          $(".cart-total-price").innerText = sum;

          function countCartIndex() {
            $(".cart-count").innerText = cart.length;
            $(".cart-price").innerText = sum;
          }
          countCartIndex();
          callback();
          // updateViewProduct();
        }
        renderCartModal(function (data) {});
        // xoá cart Modal
        function DeleteCartModal() {
          let listDeleteModalCart = $$(".product-remove");
          listDeleteModalCart = Array.from(listDeleteModalCart);
          listDeleteModalCart.forEach(function (val) {
            val.addEventListener("click", function (e) {
              let id_cart = val.getAttribute("data-id_cart");
              //gọi cart xoá phần tử có id này
              let cart1 = JSON.parse(localStorage.getItem("cart"));
              //tìm id trong cart rồi xoá phần tử đó
              let findIdCart = cart1.filter(function (val) {
                return val.id != id_cart;
              });
              //nhận được obj mới ko phải đang click rồi setitem lại
              let cart_new = findIdCart;
              localStorage.setItem("cart", JSON.stringify(cart_new));

              // call back lại nó khi xo gọi hàm render
              renderCartModal(DeleteCartModal);
            });
          });
        }
        DeleteCartModal();
      } else {
        $(".cart-empty").innerText =
          "Không có sản phẩm nào trong giỏ hàng của bạn";
      }
    }, 1000);
  };
}
AddCart();
