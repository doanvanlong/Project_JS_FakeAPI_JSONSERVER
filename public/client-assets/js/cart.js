import API from "./api.js";
import { $, $$ } from "./api.js";
// localStorage.removeItem('login')
// Xữ lý view cart modal
function handle_viewCartModal() {
  if (localStorage.getItem("cart")) {
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
      sum = sum.toLocaleString("vi", { style: "currency", currency: "VND" });
      $(".cart-total-price").innerText = sum;

      function countCartIndex() {
        $(".cart-count").innerText = cart.length;
        $(".cart-price").innerText = sum;
      }
      countCartIndex();
      callback();
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
    $(".cart-empty").innerText = "Không có sản phẩm nào trong giỏ hàng của bạn";
  }
}
handle_viewCartModal();
// đếm cart thanh menu
function countCartMenu() {
  if (localStorage.getItem("cart")) {
    let cart = JSON.parse(localStorage.getItem("cart"));
    $(".cart-count").innerText = cart.length;
    let sum2=cart.reduce(function(acc,val){
      let total=val.quantity*val.price
      return acc+=total
    },0)
    sum2= sum2.toLocaleString("vi", {style: "currency", currency: "VND"})
    $(".cart-price").innerText = sum2;
  }else{
    $(".cart-count").innerText = '';
    $(".cart-price").innerText = '';
  }
}
countCartMenu();

// Xữ lý view cart trang cart.html
function Handle_ViewCart() {
  if (localStorage.getItem("cart")) {
    function renderCart(callback) {
      // view cart ,render html
      let cart = JSON.parse(localStorage.getItem("cart"));
      let sum = 0;
      let htmls = cart.map(function (val) {
        let price = new Number(val.price);
        let totalPrice = price * val.quantity;
        sum += totalPrice;
        let totalPriceVnd = totalPrice.toLocaleString("vi", {
          style: "currency",
          currency: "VND",
        });
        price = price.toLocaleString("vi", {
          style: "currency",
          currency: "VND",
        });
        return `
          <tr>
            <td class="product-remove">
                <a href="javascript:void(0)" class="delete_cart" data-id_cart="${val.id}"><i class="fa fa-times-circle"
                        aria-hidden="true"></i></a>
            </td>
            <td class="product-thumbnail">
                <a>
                    <img src="${val.img}"
                        alt="" /></a>
            </td>
            <td class="product-name">
                <a>${val.name}</a>
            </td>
            <td class="product-price">
                <span class="product-price-amount amount"><span
                        class="currency-sign" data-price="${val.price}"></span>${price}</span>
            </td>
            <td>
                <div class="product-quantity">
                    <span data-value="+"
                        class="quantity-btn quantityPlus quantityPlusCart" data-id_cart="${val.id}"></span>
                    <input class="quantity input-lg inputQuantityCart" readonly="readonly" step="1" min="1" max="9"
                        name="quantity" value="${val.quantity}" title="Quantity"
                        type="number" />
                    <span data-value="-"
                        class="quantity-btn quantityMinus quantityMinusCart" data-id_cart="${val.id}"></span>
                </div>
            </td>
            <td>${val.color}</td>
            <td>${val.size}</td>
            
            <td class="product-subtotal totalPriceVnd product-price-sub_totle amount" data-totalPrice="${totalPrice}">
               ${totalPriceVnd}
            </td>
      </tr>
    `;
      });
      htmls = htmls.join("");
      $("#viewCart").innerHTML = htmls;
      //view tổng tiền
      sum = sum.toLocaleString("vi", {
        style: "currency",
        currency: "VND",
      });

      $(".currency-sign-amount").innerText = sum;
      // tính data-total ra  đã
      $(".totalPriceSum").innerText = sum;
      function countCartIndex() {
        $(".cart-count").innerText = cart.length;
        $(".cart-price").innerText = sum;
      }
      countCartIndex();

      //cập nhật số lượng sp trong cart
      function UpdateCart() {
        let cart = JSON.parse(localStorage.getItem("cart"));
        let quantityPlusCart = $$(".quantityPlusCart");
        quantityPlusCart = Array.from(quantityPlusCart);
        // click dấu cộng tăng số lượng cart
        quantityPlusCart.forEach(function (val) {
          val.onclick = function () {
            let id_cart = val.getAttribute("data-id_cart");
            let quantity = val.parentNode.children[1].value;
            quantity = new Number(quantity);
            quantity += 1;

            // sp update
            let spUpdate = cart.find(function (val) {
              return val.id == id_cart;
            });
            spUpdate.quantity = quantity;
            //lấy giá sp trong Local storge  ,cart
            let price = spUpdate.price;
            let totalPrice = price * quantity;
            // từ thẻ input qua td chứa total price
            let element_total_price =
              val.parentNode.parentNode.nextElementSibling.nextElementSibling
                .nextElementSibling;
            element_total_price.setAttribute("data-totalprice", totalPrice);
            totalPrice = totalPrice.toLocaleString("vi", {
              style: "currency",
              currency: "VND",
            });
            element_total_price.innerText = totalPrice;

            //sp ko phải update
            let spNoUpdate = cart.filter(function (val) {
              return val.id != id_cart;
            });
            spNoUpdate.push(spUpdate);
            let rs = spNoUpdate;
            // kết quả đã update , set lại local cart
            localStorage.setItem("cart", JSON.stringify(rs));
            // lăp lại cart rồi tính tổng
            let cart1 = JSON.parse(localStorage.getItem("cart"));
            let sum = cart1.reduce(function (acc, val) {
              return (acc += val.quantity * val.price);
            }, 0);
            let sum2 = sum.toLocaleString("vi", {
              style: "currency",
              currency: "VND",
            });
            $(".currency-sign-amount").innerText = sum2;
            $(".currency-sign-amount").setAttribute("data-totalSum", sum);
            // // tính data-total ra  đã
            $(".totalPriceSum").innerText = sum2;
            function countCartIndex() {
              $(".cart-count").innerText = cart.length;
              $(".cart-price").innerText = sum2;
            }
            countCartIndex();
          };
        });
        // click dấu trừ giảm số lượng cart

        let quantityMinusCart = $$(".quantityMinusCart");
        quantityMinusCart = Array.from(quantityMinusCart);
        let i = 0;
        quantityMinusCart.forEach(function (val) {
          val.onclick = function () {
            i++;
            let quantity = val.parentNode.children[1].value;
            quantity = new Number(quantity);
            if (i > 0) {
              let id_cart = val.getAttribute("data-id_cart");
              quantity -= 1;
              if (quantity == 0) {
                quantity += 1;
              }
              // sp update
              let spUpdate = cart.find(function (val) {
                return val.id == id_cart;
              });
              spUpdate.quantity = quantity;
              //lấy giá sp trong Local storge  ,cart
              let price = spUpdate.price;
              let totalPrice = price * quantity;
              // từ thẻ input qua td chứa total price
              let element_total_price =
                val.parentNode.parentNode.nextElementSibling.nextElementSibling
                  .nextElementSibling;
              element_total_price.setAttribute("data-totalprice", totalPrice);
              totalPrice = totalPrice.toLocaleString("vi", {
                style: "currency",
                currency: "VND",
              });
              element_total_price.innerText = totalPrice;

              //sp ko phải update
              let spNoUpdate = cart.filter(function (val) {
                return val.id != id_cart;
              });
              spNoUpdate.push(spUpdate);
              let rs = spNoUpdate;
              // kết quả đã update , set lại local cart
              localStorage.setItem("cart", JSON.stringify(rs));
              // lăp lại cart rồi tính tổng
              let cart1 = JSON.parse(localStorage.getItem("cart"));
              let sum = cart1.reduce(function (acc, val) {
                return (acc += val.quantity * val.price);
              }, 0);
              let sum2 = sum.toLocaleString("vi", {
                style: "currency",
                currency: "VND",
              });
              $(".currency-sign-amount").innerText = sum2;
              $(".currency-sign-amount").setAttribute("data-totalSum", sum);
              // // tính data-total ra  đã
              $(".totalPriceSum").innerText = sum2;
              function countCartIndex() {
                $(".cart-count").innerText = cart.length;
                $(".cart-price").innerText = sum2;
              }
              countCartIndex();
            }
          };
        });
      }
      UpdateCart();
      callback();
    }
    renderCart(function (data) {});
    //update  render cart modal
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
      sum = sum.toLocaleString("vi", { style: "currency", currency: "VND" });
      $(".cart-total-price").innerText = sum;

      function countCartIndex() {
        $(".cart-count").innerText = cart.length;
        $(".cart-price").innerText = sum;
      }
      countCartIndex();
      callback();
    }
    //Xoá phần tử trong danh sách Cart html
    function DeleteCart() {
      let list_delete_cart = $$(".delete_cart");
      list_delete_cart = Array.from(list_delete_cart);
      list_delete_cart.forEach(function (val) {
        val.onclick = function () {
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
          renderCart(DeleteCart);
          renderCartModal(DeleteCartF);
        };
      });
    }
    DeleteCart();
  } else {
  }
}
Handle_ViewCart();
