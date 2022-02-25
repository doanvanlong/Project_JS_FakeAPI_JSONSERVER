import API from "./api.js";
import { $, $$ } from "./api.js";
const ordersApi = "http://localhost:3000/orders";
const infoOrdersApi = "http://localhost:3000/orders";
const api = new API();
api.API = ordersApi;
const my_orders = await api.GetData();

// load danh sách đơn hàng
// kiểm tra có login hay ko login
async function loadMyOrders() {
  // $('#table_myorder')
  if (localStorage.getItem("login")) {
    // lấy db
    const info_user = JSON.parse(localStorage.getItem("login"));
    // lấy ra các đơn hàng của user
    let filter_my_orders = my_orders.filter(function (val) {
      const info_user = JSON.parse(localStorage.getItem("login"));
      return val.user_id == info_user.id;
    });
    //render html toal trước
    const renderOrdersTotal = new Promise(function (resolve, reject) {
      let htmls_tables_orders = filter_my_orders.map(function (val) {
        let money_total = new Number(val.money_total);
        money_total = money_total.toLocaleString("vi", {
          style: "currency",
          currency: "VND",
        });
        let order_status = val.order_status;
        if (order_status == "chuaxacnhan") {
          order_status = `<span class="text-warning">Đang xử lý</span> <button data-id_order="${val.id}" class="btn-huy-don btn btn-primary text-danger py-1 px-3">Huỷ</button>`;
        } else if (order_status == "daxacnhan") {
          order_status = `<span class="text-info">Đang giao hàng</span>`;
        } else if (order_status == "dagiaohang") {
          order_status = `<span class="text-success">Giao hàng thành công</span>`;
        } else {
          order_status = `<span class="text-muted">Đã huỷ</span>`;
        }
        let products = val.product;
        let rsl = products.map(function (item) {
          return `
             <div class="d-flex mb-3">
                  <div> <img style="width:100px" src="${item.img}"></div>
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
                 <td class="renderProductOrders">${rsl}</td>
                 <th>${money_total}</th>
             <td>${order_status}</td>
              </tr>
            
            `;
      });
      htmls_tables_orders = htmls_tables_orders.join("");
      resolve(htmls_tables_orders);
      //   $(".table_myorder").innerHTML = htmls_tables_orders;


      
    });
    let rs = await renderOrdersTotal;
    $(".table_myorder").innerHTML = rs;
    //click huỷ đơn
    let listBtnHuyDon=$$('.btn-huy-don')
    listBtnHuyDon=Array.from(listBtnHuyDon)

    listBtnHuyDon.forEach(function (val) {
      val.onclick = function () {
        let id_order=(val.getAttribute('data-id_order'));
        //call api update status 
        api.API=infoOrdersApi+`/${id_order}`
        let data={
          order_status:'huy'
        }
        api.UpdateDataPatch(data,function(){})
      }
    })
  } else {
    //   ko login ,lưu ở localStorage myOrders
    const myorders = JSON.parse(localStorage.getItem("myoder"));

    //render html toal trước
    const renderOrdersTotal = new Promise(function (resolve, reject) {
      let htmls_tables_orders = myorders.map(function (val) {
        let money_total = new Number(val.money_total);
        money_total = money_total.toLocaleString("vi", {
          style: "currency",
          currency: "VND",
        });
        let order_status = val.order_status;
        if (order_status == "chuaxacnhan") {
          order_status = `<span class="text-warning">Đang xử lý</span> `;
        } else if (order_status == "daxacnhan") {
          order_status = `<span class="text-info">Đang giao hàng</span>`;
        } else if (order_status == "dagiaohang") {
          order_status = `<span class="text-success">Giao hàng thành công</span>`;
        } else {
          order_status = `<span class="text-muted">Đã huỷ</span>`;
        }
        let products = val.product;
        let rsl = products.map(function (item) {
          return `
         <div class="d-flex mb-3">
              <div> <img style="width:100px" src="${item.img}"></div>
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
             <td >###</td>
             <td class="renderProductOrders">${rsl}</td>
             <th>${money_total}</th>
             <td>${order_status}</td>
          </tr>
        
        `;
      });
      htmls_tables_orders = htmls_tables_orders.join("");
      resolve(htmls_tables_orders);
      //   $(".table_myorder").innerHTML = htmls_tables_orders;
    });
    let rs = await renderOrdersTotal;
    $(".table_myorder").innerHTML = rs;
    
  }
}
loadMyOrders();
