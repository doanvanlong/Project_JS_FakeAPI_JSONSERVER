const productsApi = "http://localhost:3000/products";
const subcategoriesApi = "http://localhost:3000/sub_categories";
const categoriesApi = "http://localhost:3000/categories";
const imgDetailApi = "http://localhost:3000/imgDetail";

import API from "./index.js";
// import { ID, $, $$ } from "./index.js";

async function ListProduct() {
  const api = new API(); //khởi tạo đối tượng
  api.API = productsApi;
  const products = await api.GetData(); //call api lấy đc data
  api.API = categoriesApi;
  const cates = await api.GetData(); //call api lấy đc data
  api.API = subcategoriesApi;
  const subcates = await api.GetData(); //call api lấy đc data
  let all_products = products.length;
  let row = all_products;
  $(".count_products_table")[0].innerText = `
      Hiển thị 1 đến ${row} của ${all_products} danh mục
    `;
  // renderHTML danh sách  danh mục chính
  await api.renderHTML(function () {
    //render html
    let htmls_list_product = products.map(function (product) {
      return ` <tr class="odd">
                  <td class="dtr-control" tabindex="0">${product.id}</td>
                  <td class="sorting_1 name_product">${product.name}</td>
                  <td class="sorting_1 img_product"><img  style="width:100px;height:140px " src="${product.img}"></td>
                  <td class="sorting_1 name_product">${product.description}</td>

                  <td class="sorting_1 price_product">${product.price}</td>
                  <td class="sorting_1 quantity_product">${product.quantity}</td>
                  <td class="sorting_1 subcate_product">${product.sub_categories_id}</td>
                  <td class="icon_action">
                  <a href="#" title="Sửa" data-id_product="${product.id}" data-toggle="modal" data-target="#modal-edit-products" class="btn-edit-product" ><i class="fas fa-edit"></i></a>
                  <a href="#" class="cofirmDeleteproduct" data-id_product="${product.id}" title="Xoá"><i class="fa-solid fa-trash-can"></i></a>
              </td>
          </tr> `;
    });

    htmls_list_product = htmls_list_product.join("");
    $("#html_tr_list_product")[0].innerHTML = htmls_list_product;

    //Xoá sp

    async function DeleteProduct() {
      let listDeleteProduct = document.querySelectorAll(".cofirmDeleteproduct");
      listDeleteProduct.forEach(function (val) {
        val.onclick = function () {
          let id_product = val.getAttribute("data-id_product");
          //xoá dm con by id_subcate
          Swal.fire({
            title: "Bạn có muốn xoá sản phẩm này?",
            showDenyButton: true,
            confirmButtonText: "Xoá",
            denyButtonText: `Không`,
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              Swal.fire("Đã xoá!", "", "success");
              api.API = productsApi;
              api.DeleteData(id_product);
            } else if (result.isDenied) {
            }
          });
        };
      });
    }

    DeleteProduct();
    //xử lý lấy dữ liệu modal
    function handle_modal_product() {
      //lấy mảng cái icon khi click vào btn edit
      let list_product = document.querySelectorAll(".btn-edit-product");
      list_product = Array.from(list_product);

      list_product.forEach(function (product) {
        product.onclick = function () {
          let id_product_modal = product.getAttribute("data-id_product");
          //lấy info 1 sản phẩm
          let info_product = products.find(function (val) {
            return val.id == id_product_modal;
          });

          $(".id_product_modal")[0].value = id_product_modal;
          $(".name_product_modal")[0].value = info_product.name;
          $("#price_product_modal")[0].value = info_product.price;
          $("#quantity_product_modal")[0].value = info_product.quantity;
          $("#sale_product_modal")[0].value = info_product.sale;

          // $("#selectSubcate_product_modal")[0].value = info_product.sub_categories_id;
          // hiển thị tất cả danh mục bao gồm cả id danh mục ,và dm của sp đang có
          let htmls_view_cate_modal = cates.map(function (val) {
            if (val.id == info_product.categories_id) {
              return `<option selected value="${val.id}">${val.name}</option>`;
            } else {
              return `
                <option  value="${val.id}">${val.name}</option>
                `;
            }
          });
          htmls_view_cate_modal = htmls_view_cate_modal.join("");
          $("#selectCate_product_modal")[0].innerHTML = htmls_view_cate_modal;

          // hiển thị tất cả danh mục con bao gồm cả id danh mục con ,và dm con của sp đang có

          let htmls_view_subcate_modal = subcates.map(function (val) {
            if (val.id == info_product.sub_categories_id) {
              return `<option selected value="${val.id}">${val.name}</option>`;
            } else {
              return `
                <option  value="${val.id}">${val.name}</option>
                `;
            }
          });
          htmls_view_subcate_modal = htmls_view_subcate_modal.join("");
          $("#selectSubcate_product_modal")[0].innerHTML =
            htmls_view_subcate_modal;

          $("#color_product_modal")[0].value = info_product.more.color;
          $("#stuff_product_modal")[0].value = info_product.more.stuff;
          $("#awaitPreviewimg_product_modal")[0].style.display = "block";
          let imgPreviewProduct = $("#awaitPreviewimg_product_modal")[0]
            .children[0];
          imgPreviewProduct.setAttribute("src", info_product.img);

          let listImgDetailProduct = info_product.more.imgDetail;
          let htmlImgDetailProduct = listImgDetailProduct.map(function (val) {
            return `
              <img src="${val}" style="width:70px;height:80px">
            `;
          });
          htmlImgDetailProduct = htmlImgDetailProduct.join("");
          $("#awaitPreviewimg_detail_product_modal")[0].innerHTML =
            htmlImgDetailProduct;

          //thay đổi hình ảnh
          //Khi thêm hình ảnh
          $("#img_product_modal").change(function () {
            let reader = new FileReader(); //đọc file
            reader.onload = function (e) {
              $("#awaitPreviewimg_product_modal").css("display", "block"); //hiển thị thẻ im để điền src
              $("#previewImgModal").attr("src", e.target.result); //thêm src vào img
            };
            reader.readAsDataURL($(this)[0].files[0]);
          });

          //thêm ảnh chi tiết
          //Khi thêm nhiều hình ảnh
          let linkimgdetail = [];
          $("#imgDetailModalProduct").change(function () {
            let reader = new FileReader(); //đọc file
            reader.onload = function (e) {
              let src = e.target.result;
              let rs = `
                  <span style="margin:20px 3px">
                  <img class="imgSrc" style="width:70px;height:80px;" src="${src}">
                  <span class="deletImgDetail" title="Xoá ảnh" style="font-size:40px"> &times;</span>
                  </span>
                  `;
              $("#awaitPreviewimg_detail_product_modal").append(rs);
              //click xoá ảnh chi tiết
              linkimgdetail.push(src);
              $(".deletImgDetail").click(function () {
                $(this).parent().remove();
              });
            };
            reader.readAsDataURL($(this)[0].files[0]);
          });

          //Update sản phẩm
          async function UpdateProduct() {
            $("#cofirmEditProduct").click(function () {
              api.API = productsApi + `/${id_product_modal}`; //thay đổi url products/1 để update
              let name = $(".name_product_modal")[0].value;
              let price = $("#price_product_modal")[0].value;
              price=new Number(price);
              let quantity = $("#quantity_product_modal")[0].value;
              quantity = new Number(quantity);
              let sale = $("#sale_product_modal")[0].value;
              sale = new Number(sale);
              let cate = $("#selectCate_product_modal")[0].value;
              let subcate = $("#selectSubcate_product_modal")[0].value;
              let color = $("#color_product_modal")[0].value;
              let stuff = $("#stuff_product_modal")[0].value;
              let linkimg = $("#previewImgModal").attr("src");
                linkimgdetail.push(info_product.more.imgDetail);
              let description = $("[name=editordata2]").val();

              let options = {
                name: name,
                img: linkimg,
                price: price,
                quantity: quantity,
                sale: sale,
                categories_id: cate,
                view:0,
                sub_categories_id: subcate,
                description: description,
                more: {
                  color: color,
                  stuff: stuff,
                  imgDetail: linkimgdetail,
                },
              };

              api.UpdateData(options);
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Cập nhật sản phẩm thành công",
                showConfirmButton: false,
                timer: 1500,
              });
            });
          }
          UpdateProduct();
        };
      });
    }
    handle_modal_product();
  });
}
ListProduct();

var listImgDetail = [];
async function AddProduct() {
  //View ListSubCategory
  //call api lấy danh mục con
  const api = new API(); //khởi tạo đối tượng
  api.API = subcategoriesApi;

  const subcates = await api.GetData(); //call api lấy đc data
  api.API = categoriesApi;
  const cates = await api.GetData(); //call api lấy đc data
  api.API = productsApi;

  //hiển thị ra select option
  //Khai báo cái biến cục bộ trước
  var id_cate;
  await api.renderHTML(function () {
    let renderSelectSubcate = subcates.map(function (val) {
      return `
                <option value="${val.id}"  class="changeSubcate">${val.name}</option>
            `;
    });
    renderSelectSubcate = renderSelectSubcate.join("");
    $("#selectSubcateProduct").append(renderSelectSubcate);

    //Lấy danh sách class option khi onchange danh mục con thì hiển thị dm chính
    let listchangeSubcate = $(".changeSubcate");
    listchangeSubcate = Array.from(listchangeSubcate);

    $("#selectSubcateProduct").change(function () {
      let id_subcate = $(this).val();
      let list_id_cate = subcates.find(function (val) {
        return val.id == id_subcate;
      });
      id_cate = list_id_cate.categorie_id;
      //khi danh mục con thay đổi thì danh mục mẹ thay đổi
      let viewcate = cates.find(function (val) {
        return val.id == id_cate;
      });
      let htmls = `
        <option value="${viewcate.id}">${viewcate.name}</option>
      `;
      $("#selectCateProduct").html(htmls);
    });
  });
  //Khi thêm hình ảnh
  $("#imgProduct").change(function () {
    let reader = new FileReader(); //đọc file
    reader.onload = function (e) {
      $("#awaitPreviewImg").css("display", "block"); //hiển thị thẻ im để điền src
      $("#previewImg").attr("src", e.target.result); //thêm src vào img
    };
    reader.readAsDataURL($(this)[0].files[0]);
  });

  //thêm ảnh chi tiết
  //Khi thêm nhiều hình ảnh
  $("#imgDetailProduct").change(function () {
    let reader = new FileReader(); //đọc file
    reader.onload = function (e) {
      let src = e.target.result;
      let rs = `
      <span style="margin:20px 3px">
      <img class="imgSrc" style="width:70px;height:80px;" src="${src}">
      <span class="deletImgDetail" title="Xoá ảnh" style="font-size:40px"> &times;</span>
      </span>
      `;
      $("#awaitPreviewImgDetail").append(rs);
      //click xoá ảnh chi tiết
      listImgDetail.push(src);
      $(".deletImgDetail").click(function () {
        $(this).parent().remove();
      });
    };
    reader.readAsDataURL($(this)[0].files[0]);
  });

  //khi submit form add DB JSon
  $("#submit_form-add_product").submit(function (e) {
    e.preventDefault();
    let nameProduct = $("#nameProduct").val();
    let priceProduct = $("#priceProduct").val();
    priceProduct=new Number(priceProduct)
    let quantityProduct = $("#quantityProduct").val();
    quantityProduct=new Number(quantityProduct)
    let saleProduct = $("#saleProduct").val();
    saleProduct=new Number(saleProduct)
    let selectSubcateProduct = $("#selectSubcateProduct").val();
    let selectCateProduct = $("#selectCateProduct").val();
    let ColorProduct = $("#ColorProduct").val();
    let StuffProduct = $("#StuffProduct").val();
    let linkimg = $("#previewImg").attr("src");
    let description = $("[name=editordata]").val();
    if (
      nameProduct &&
      priceProduct &&
      quantityProduct &&
      selectSubcateProduct &&
      selectCateProduct != ""
    ) {
      let options = {
        name: nameProduct,
        img: linkimg,
        price: priceProduct,
        quantity: quantityProduct,
        sale: saleProduct,
        view:0,
        categories_id: selectCateProduct,
        sub_categories_id: selectSubcateProduct,
        description: description,
        more: {
          color: ColorProduct,
          stuff: StuffProduct,
          imgDetail: listImgDetail,
        },
      };

      api.AddData(options, function () {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Thêm sản phẩm thành công",
          showConfirmButton: false,
          timer: 1500,
        });
      });
    }
    //thêm link ảnh vào DB Json
  });
}
AddProduct();
