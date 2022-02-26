const productsApi = "http://localhost:3000/products";
const subcategoriesApi = "http://localhost:3000/sub_categories";
const categoriesApi = "http://localhost:3000/categories";
const ordersApi = "http://localhost:3000/orders";

import API from "./index.js";
const api = new API();
// đơn hàng mới
async function handleViewOrdersNew() {
  api.API = ordersApi;
  let orders = await api.GetData();
  let count_order_new=orders.filter(function (val){
    return val.order_status=='chuaxacnhan'
  })
  let count_order_news=(count_order_new.length);
  $('.count_order_new_index')[0].innerText=count_order_news
  api.API='http://localhost:3000/comments'
  let comments = await api.GetData();
  //đếm comments
  $('.count_comments_index')[0].innerText=comments.length
  orders.sort(function (a, b) {
    return b.id - a.id;
  });
  //render html orders mới . top 7
  let i = 0;
  const renderOrdersStatus = new Promise(function (resolve, reject) {
    let htmls_tables_ordersnew = orders.map(function (val) {
      i++;
      if (i < 5) {
        let money_total = new Number(val.money_total);
        money_total = money_total.toLocaleString("vi", {
          style: "currency",
          currency: "VND",
        });
        let order_status = val.order_status;
        if (order_status == "chuaxacnhan") {
          order_status = `<span class="badge badge-warning">Đang xử lý</span> `;
        } else if (order_status == "daxacnhan") {
          order_status = `<span class="badge badge-info">Đang xử lý</span> `;
        } else if (order_status == "dagiaohang") {
          order_status = `<span class="badge badge-success">Đang xử lý</span> `;
        } else {
          order_status = `<span class="text-muted">Đã huỷ</span>`;
        }
        let products = val.product;
        let rsl = products.map(function (item) {
          return `
                        <div class="ml-3">
                            <p>${item.product_name}</p>
                            <p>Màu: ${item.color}</p>
                        </div>
                    `;
        });
        rsl = rsl.join("");
        return `
                      <tr>
                      <td><a href="#">${val.id}</a></td>
                      <td style="width:60%">${rsl}</td>
                      <td>${order_status}</td>
  
                  </tr>
                    
                    `;
      }
    });
    htmls_tables_ordersnew = htmls_tables_ordersnew.join("");
    resolve(htmls_tables_ordersnew);
    //   $(".table_myorder").innerHTML = htmls_tables_ordersnew;
  });
  let rs = await renderOrdersStatus;
  let ele = $(".view_orderNew_index")[0];
  ele.innerHTML = rs;
}
handleViewOrdersNew();

//sản phẩm mới index
async function handleViewProductNew() {
  api.API = productsApi;
  let products = await api.GetData();
  let i = 0;
  let listProductsNew = products.map(function (product) {
    i++;
    if (i < 6) {
      let price = product.price;
      price=new Number(price);
      price=price.toLocaleString("vi", {style: "currency", currency: "VND"})
      return `
            <li class="item">
            <div class="product-img">
              <img src="${product.img}" alt="Product Image"
                class="img-size-50">
            </div>
            <div class="product-info">
              <a href="javascript:void(0)" class="product-title">${product.name}
                <span class="badge badge-warning float-right">${price}</span></a>
            </div>
          </li>
            `;
    }
  });
  listProductsNew = listProductsNew.join("");
  $(".view_product_new_index")[0].innerHTML = listProductsNew;
}
handleViewProductNew();
