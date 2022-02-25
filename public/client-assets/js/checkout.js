import API from "./api.js";
import { $, $$ } from "./api.js";
const apiProvince = "https://provinces.open-api.vn/api/p/";
const apiDistrict = "https://provinces.open-api.vn/api/d/";
const apiAwards = "https://provinces.open-api.vn/api/w/";
const ordersApi = "http://localhost:3000/orders";
const infoProductApi = "http://localhost:3000/products/";

const api = new API();
async function HandleviewProvice() {
  //gọi api Tỉnh thành
  api.API = apiProvince;
  const provinces = await api.GetData();
  //gọi api quận huyện
  api.API = apiDistrict;
  const district = await api.GetData();
  //gọi api xã phường
  api.API = apiAwards;
  const awards = await api.GetData();

  //render option html select Province
  let renderProvinces = provinces.map(function (provice) {
    return `
            <option value="${provice.code}">${provice.name}</option>
        `;
  });
  renderProvinces = renderProvinces.join("");
  $("#select_province").innerHTML = renderProvinces;

  // Thay đổi quận huyện khi change Tỉnh thành
  async function viewDistrict() {
    $("#select_province").onchange = function () {
      let code_province = $("#select_province").value;
      // có danh sách quận rồidistrict
      let findProvinces = district.filter(function (val) {
        return val.province_code == code_province;
      });
      //render quận html
      let renderDistrict = findProvinces.map(function (val) {
        return `
            <option value="${val.code}">${val.name}</option>
          `;
      });
      renderDistrict = renderDistrict.join("");
      $("#select_district").innerHTML = renderDistrict;
    };
  }
  viewDistrict();
  // Thay đổi xã phường khi change quận huyện
  async function viewAwards() {
    $("#select_district").onchange = function () {
      let code_district = $("#select_district").value;
      // có danh sách xã awards
      let findDistrict = awards.filter(function (val) {
        return val.district_code == code_district;
      });
      //render xã html
      let renderAwards = findDistrict.map(function (val) {
        return `
              <option value="${val.code}">${val.name}</option>
            `;
      });
      renderAwards = renderAwards.join("");
      $("#select_wards").innerHTML = renderAwards;
    };
  }
  viewAwards();
}
HandleviewProvice();

async function handleViewCartCheck(callback) {
  let cart = JSON.parse(localStorage.getItem("cart"));
  let sum = 0;
  let htmls = cart.map(function (val) {
    let price = val.price;
    let quantity = val.quantity;
    price = new Number(price);
    let totalPrice = quantity * price;
    sum += totalPrice;
    let totalPriceVnd = totalPrice.toLocaleString("vi", {
      style: "currency",
      currency: "VND",
    });
    return `
    <tr class="cart_item">
    <td class="product-name name_product_checkout">${val.name}<strong class="quantity_product_checkout"> x
            ${val.quantity}</strong></td>
    <td class="product-total price_product_checkout" data-total_price="${totalPrice}">
    ${totalPriceVnd}
    </td>
</tr>
    
    `;
  });
  $(".product_cart_chekcout").innerHTML = htmls;
  //tính total sum
  let sum2 = sum.toLocaleString("vi", { style: "currency", currency: "VND" });
  $(".totalsum_product_checkout").innerText = sum2;
  callback();
}
handleViewCartCheck(function () {});
//xoá modal cart thì render lại cart check out
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
      handleViewCartCheck(DeleteCartModal);
    });
  });
}
DeleteCartModal();
// moment(new Date()).format("YYYY/MM/DD");
// click tiến hành đặt hàng
// console.log(new Date('2022-02-21T00:08:45.145Z').getFullYear());

//lấy thông tin user nếu đang login
async function renderGetInfoUser() {
  if (localStorage.getItem("login")) {
    let user = JSON.parse(localStorage.getItem("login"));
    $('[name="billing_first_name"]').value = user.name;
    $('[name="billing_phone"]').value = user.phone;
    $('[name="billing_email"]').value = user.email;
    $('[name="billing_address"]').value = user.address;
  }
}
renderGetInfoUser();
async function handleCheckout() {
  $("#dat_hang").onclick = function (e) {
    e.preventDefault();
    // sản phẩm nằm trong cart
    // thông tin address lấy từ form nhập
    let name = $('[name="billing_first_name"]').value;
    let phone = $('[name="billing_phone"]').value;
    let email = $('[name="billing_email"]').value;
    let address = $('[name="billing_address"]').value;
    let province = $("#select_province").value;
    let district = $("#select_district").value;
    let ward = $("#select_wards").value;
    let note = $("[name='note']").value;
    let cart = JSON.parse(localStorage.getItem("cart"));
    let totalPrice = cart.reduce(function (acc, val) {
      let total = val.price * val.quantity;
      return (acc += total);
    }, 0);
    let product_arr = cart.map(function (val) {
      let price = val.price;
      price = new Number(price);
      return {
        product_id: val.id,
        product_name: val.name,
        quantity_purchased: val.quantity,
        img: val.img,
        price: price,
        color: val.color,
        size: val.size,
      };
    });
    if (
      name == "" ||
      phone == "" ||
      email == "" ||
      address == "" ||
      province == "" ||
      district == "" ||
      district == "" ||
      ward == ""
    ) {
    } else {
      // chạy oke
      // add db
      let user_id;
      if (localStorage.getItem("login")) {
        // alert('ok')
        // lấy info
        let login = JSON.parse(localStorage.getItem("login"));
        user_id = login.id;
      } else {
        // alert('error')
        user_id = "";
      }
      let date = new Date();
      let datas = {
        user_id: user_id,
        name_user:name,
        phone_user:phone,
        address_user:address,
        email_user:email,
        order_status: "chuaxacnhan",
        money_total: totalPrice,
        order_date: date,
        delivery_date: "",
        sale: 0,
        product: product_arr,
        note: note,
      };
      //thêm vào db
      api.API = ordersApi;
      api.AddData(datas, function () {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Đặt hàng thành công",
          showConfirmButton: false,
          timer: 1500,
        });
        localStorage.removeItem("cart");

        if (localStorage.getItem("login")) {
        } else {
          //ko login thì tạo Localstorage myoders để lưu
          if (localStorage.getItem("myoder") == null) {
            localStorage.setItem("myoder", "[]");
          }
          let old_oder = JSON.parse(localStorage.getItem("myoder"));
          old_oder.push(datas);
          localStorage.setItem("myoder", JSON.stringify(old_oder));
        }

        //xoá localstogre cart
        //dẫn về trang my order
        location.href = "myorders.html";
      });
    }
  };
}
handleCheckout();
