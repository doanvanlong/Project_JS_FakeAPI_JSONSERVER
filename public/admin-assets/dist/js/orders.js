const ordersApi = "http://localhost:3000/orders";
const usersApi = "http://localhost:3000/users";
const infoOrdersApi='http://localhost:3000/orders'
import API from "./index.js";
const api = new API();
api.API = ordersApi;
const orders = await api.GetData();
orders.sort(function(a,b){return b.id-a.id})
api.API = usersApi;
const users = await api.GetData();
async function handleViewOrdersAll() {
  //render html toal trước
  const renderOrdersTotal = new Promise(function (resolve, reject) {
    let htmls_tables_orders = orders.map(function (val) {
      let money_total = new Number(val.money_total);
      money_total = money_total.toLocaleString("vi", {
        style: "currency",
        currency: "VND",
      });
      let user=`
        <div>${val.name_user}</div>
        <div>${val.phone_user}</div>
        <div>${val.address_user}</div>
      `
      let order_status = val.order_status;
      if (order_status == "chuaxacnhan") {
        order_status = `<span class="badge badge-warning">Đang xử lý</span> <div>
        <button data-id_order="${val.id}" class="btn-huy-don btn btn-outline-danger py-1 px-3">Huỷ</button>
        <button data-id_order="${val.id}" class="btn-xac-nhan-don btn btn-outline-info  py-1 px-3">Xác nhận</button>

        </div>`;
      } else if (order_status == "daxacnhan") {
        order_status = `<span class="badge badge-info">Đang giao hàng</span>
        <div>
        <button data-id_order="${val.id}" class="btn-da-giao-hang btn btn-success py-1 px-3">Đã giao </button>
        </div>`;
      } else if (order_status == "dagiaohang") {
        order_status = `<span class="text-success">Giao hàng thành công</span>`;
      } else {
        order_status = `<span class="badge badge-muted">Đã huỷ</span>`;
      }
      let products = val.product;
      let rsl = products.map(function (item) {
        return `
         <div class="d-flex mb-3">
              <div> <img style="width:70px" src="${item.img}"></div>
            <div class="ml-3">
                <b>${item.product_name}</b>
                <i>${item.quantity_purchased}X</i>
                <b>${item.price}</b>
                <p>Màu: ${item.color}</p>
                <p>Size: ${item.size}</p>
            </div>
        
         </div>
        `;
      });
      rsl = rsl.join("");
      return `
        <tr>
             <td >${val.id}</td>
             <td>${user}</td>
             <td class="renderProductOrders">${rsl}</td>
             <th>${money_total}</th>
         <td style="width:20%">${order_status}</td>
          </tr>
        
        `;
    });
    htmls_tables_orders = htmls_tables_orders.join("");
    resolve(htmls_tables_orders);
    //   $(".table_myorder").innerHTML = htmls_tables_orders;
  });
  let rs = await renderOrdersTotal;
  $(".table_orders")[0].innerHTML = rs;
let listBtnHuyDon = $(".btn-huy-don");
  listBtnHuyDon = Array.from(listBtnHuyDon);

  listBtnHuyDon.forEach(function (val) {
    val.onclick = function () {
      let id_order = val.getAttribute("data-id_order");
      // call api update status
      api.API = infoOrdersApi + `/${id_order}`;
      let data = {
        order_status: "huy",
      };
      api.UpdateDataPatch(data, function () {});
    };
  });
  //click huỷ đơn
  // click xác nhận đơn
  let listBtnXacNhanDon = $(".btn-xac-nhan-don");
  listBtnXacNhanDon = Array.from(listBtnXacNhanDon);

  listBtnXacNhanDon.forEach(function (val) {
    val.onclick = function () {
      let id_order = val.getAttribute("data-id_order");
      //call api update status
      api.API = infoOrdersApi + `/${id_order}`;
      let data = {
        order_status: "daxacnhan",
      };
      api.UpdateDataPatch(data, function () {});
    };
  });
  // click xác nhận đã giao hàng
  let listBtnDaGiao = $(".btn-da-giao-hang");
  listBtnDaGiao = Array.from(listBtnDaGiao);

  listBtnDaGiao.forEach(function (val) {
    val.onclick = function () {
      let id_order = val.getAttribute("data-id_order");
      //call api update status
      api.API = infoOrdersApi + `/${id_order}`;
      let data = {
        order_status: "dagiaohang",
      };
      api.UpdateDataPatch(data, function () {});
    };
  });
}
async function handleViewOrdersNew() {
  //render html toal trước
 let ordersNew=orders.filter(function (val) { 
    return val.order_status=='chuaxacnhan'
  })
  const renderOrdersTotal = new Promise(function (resolve, reject) {
    let htmls_tables_orders = ordersNew.map(function (val) {
      let money_total = new Number(val.money_total);
      money_total = money_total.toLocaleString("vi", {
        style: "currency",
        currency: "VND",
      });
      let user=`
      <div>${val.name_user}</div>
      <div>${val.phone_user}</div>
      <div>${val.address_user}</div>
    `
      let order_status = val.order_status;
      if (order_status == "chuaxacnhan") {
        order_status = `<span class="badge badge-warning">Đang xử lý</span><div>
         <button data-id_order="${val.id}" class="btn-huy-don btn btn-outline-danger  py-1 px-3">Huỷ</button>
         <button data-id_order="${val.id}" class="btn-xac-nhan-don btn btn-outline-info  py-1 px-3">Xác nhận</button>

         </div>`;
      } else if (order_status == "daxacnhan") {
        order_status = `<span class="badge badge-info">Đang giao hàng</span>`;
      } else if (order_status == "dagiaohang") {
        order_status = `<span class="badge badge-success">Giao hàng thành công</span>`;
      } else {
        order_status = `<span class="badge badge-muted">Đã huỷ</span>`;
      }
      let products = val.product;
      let rsl = products.map(function (item) {
        return `
         <div class="d-flex mb-3">
              <div> <img style="width:70px" src="${item.img}"></div>
            <div class="ml-3">
                <b>${item.product_name}</b>
                <i>${item.quantity_purchased}X</i>
                <b>${item.price}</b>
                <p>Màu: ${item.color}</p>
                <p>Size: ${item.size}</p>
            </div>
        
         </div>
        `;
      });
      rsl = rsl.join("");
      return `
        <tr>
             <td >${val.id}</td>
             <td>${user}</td>
             <td class="renderProductOrders">${rsl}</td>
             <th>${money_total}</th>
         <td style="width:20%">${order_status}</td>
          </tr>
        
        `;
    });
    htmls_tables_orders = htmls_tables_orders.join("");
    resolve(htmls_tables_orders);
    //   $(".table_myorder").innerHTML = htmls_tables_orders;
  });
  let rs = await renderOrdersTotal;
  $(".table_orders")[0].innerHTML = rs;
let listBtnHuyDon = $(".btn-huy-don");
  listBtnHuyDon = Array.from(listBtnHuyDon);

  listBtnHuyDon.forEach(function (val) {
    val.onclick = function () {
      let id_order = val.getAttribute("data-id_order");
      //call api update status
      api.API = infoOrdersApi + `/${id_order}`;
      let data = {
        order_status: "huy",
      };
      api.UpdateDataPatch(data, function () {});
    };
  });
  //click huỷ đơn
  // click xác nhận đơn
  let listBtnXacNhanDon = $(".btn-xac-nhan-don");
  listBtnXacNhanDon = Array.from(listBtnXacNhanDon);

  listBtnXacNhanDon.forEach(function (val) {
    val.onclick = function () {
      let id_order = val.getAttribute("data-id_order");
      //call api update status
      api.API = infoOrdersApi + `/${id_order}`;
      let data = {
        order_status: "daxacnhan",
      };
      api.UpdateDataPatch(data, function () {});
    };
  });
}
//get url
let url=window.location.href;
url= url.split("/")
url=url[url.length-1]
if(url=='orders_new.html'){
  handleViewOrdersNew()
}else if(url=='all_orders.html'){
handleViewOrdersAll()
}