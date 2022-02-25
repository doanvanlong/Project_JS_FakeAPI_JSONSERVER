const categoriesApi = "http://localhost:3000/categories";
const subcategoriesApi = "http://localhost:3000/sub_categories";
const productsApi = "http://localhost:3000/products";

import API from "./index.js";

if ($(".title-breadcrumb")) {
  let title = $(".title-breadcrumb").innerText;
  $(".breadcrumb-item-active").innerText = title;
}

async function ListCate() {
  const api = new API(); //khởi tạo đối tượng
  api.API = categoriesApi;
  const cates = await api.GetData(); //call api lấy đc data
  api.API = productsApi;
  const products = await api.GetData(); //call api lấy đc data
  let all_cates = cates.length;
  let row = all_cates;

  $(".count_cates_table")[0].innerText = `
    Hiển thị 1 đến ${row} của ${all_cates} danh mục
  `;
  // renderHTML danh sách  danh mục chính
  await api.renderHTML(function () {
    //render html
    let htmls_list_cate = cates.map(function (cate) {
      // Modal edit danh mục
      // Modal edit danh mục con
      return ` <tr class="odd">
              <td class="dtr-control" tabindex="0">${cate.id}</td>
              <td class="sorting_1 name_cate">${cate.name}</td>
              <td class="icon_action">
              <a href="#" title="Sửa" data-id_cate="${cate.id}" data-toggle="modal" data-target="#modal-edit-cates" class="btn-edit-cate" ><i class="fas fa-edit"></i></a>
              <a href="#" class="cofirmDeleteCate" data-id_cate="${cate.id}" title="Xoá"><i class="fa-solid fa-trash-can"></i></a>
          </td>
      </tr> `;
    });

    htmls_list_cate = htmls_list_cate.join("");
    $("#html_tr_list_cate_main")[0].innerHTML = htmls_list_cate;
    //Xoá Danh mục chính
    async function DeleteCate() {
      let list_id_cate = document.querySelectorAll(".cofirmDeleteCate");
      list_id_cate.forEach(function (val) {
        val.onclick = function () {
          let id = val.getAttribute("data-id_cate");
          // Xoá theo id Danh mục Chính
          Swal.fire({
            title: "Bạn có muốn xoá danh mục này?",
            showDenyButton: true,
            confirmButtonText: "Xoá",
            denyButtonText: `Không`,
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              Swal.fire("Đã xoá!", "", "success");
              api.API = categoriesApi;
              api.DeleteData(id);
            } else if (result.isDenied) {
            }
          });

          // Xoá DM chính thì xoá lun danh mục con

          api.API = subcategoriesApi;
          let arrayWillDelete = subcates.filter(function (val) {
            return val.categorie_id == id;
          });
          arrayWillDelete.forEach(function (val) {
            api.DeleteData(val.id);
          });
          //Xoá sản phẩm
        };
      });
    }
    DeleteCate();
  });
  //Lấy id cate khi click  =>Edit: hiện modal
  function handle_modal_cate() {
    let list_cate = document.querySelectorAll(".btn-edit-cate");
    list_cate.forEach(function (element) {
      element.onclick = function (e) {
        // lặp qua từng cái và lấy id cụ thể
        //view edit cate modal
        let id_cate_modal = element.getAttribute("data-id_cate");
        let tr_element = element.parentNode.parentNode;
        let name_cate_modal = tr_element.children[1].innerText;
        $(".id_cate_modal")[0].value = id_cate_modal;
        $(".name_cate_modal")[0].value = name_cate_modal;
        // click vào xác nhận chỉnh sửa danh mục Chính

        async function UpdateCate() {
          $("#cofirmEditCate")[0].onclick = function () {
            api.API = categoriesApi + `/${id_cate_modal}`; //thay đổi url categories/1 để update
            let name_cate = $(".name_cate_modal")[0].value;
            let data = {
              id: id_cate_modal,
              name: name_cate,
            };
            api.UpdateData(data); //gọi method Update Danh mục
          };
        }
        UpdateCate();
      };
    });
  }
  handle_modal_cate();

  // renderHTML danh sách  danh mục con
  api.API = subcategoriesApi;
  const subcates = await api.GetData(); //call api lấy đc data
  let all_subcates = subcates.length;
  let row2 = all_subcates;
  $(".count_subcates_table")[0].innerText = `
    Hiển thị 1 đến ${row2} của ${all_subcates} danh mục
  `;
  await api.renderHTML(function () {
    let nameSubCates = subcates.map(function (value) {
      return `
       <tr class="odd">
          <td class="dtr-control" tabindex="0">${value.id}</td>
          <td class="sorting_1">${value.name}</td>
          <td class="sorting_1 id_cate_main" >${value.categorie_id}</td>
          <td class="icon_action">
              <a href="#" title="Sửa" data-id_subcate="${value.id}" data-toggle="modal" data-target="#modal-edit-subcates" class="btn-edit-subcate"><i class="fas fa-edit"></i></a>
              <a href="#" class="cofirmDeleteSubCate" data-id_subcate="${value.id}" title="Xoá"><i class="fa-solid fa-trash-can"></i></a>
          </td>
       </tr> `;
    });

    nameSubCates = nameSubCates.join("");
    $("#html_tr_list_cate_children")[0].innerHTML = nameSubCates;
    async function DeleteSubCate() {
      let list_subcates = document.querySelectorAll(".cofirmDeleteSubCate");
      list_subcates.forEach(function (value) {
        value.onclick = function () {
          let id_subcates = value.getAttribute("data-id_subcate");
          //xoá dm con by id_subcate
          Swal.fire({
            title: "Bạn có muốn xoá danh mục này?",
            showDenyButton: true,
            confirmButtonText: "Xoá",
            denyButtonText: `Không`,
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              Swal.fire("Đã xoá!", "", "success");
              api.API = subcategoriesApi;
              api.DeleteData(id_subcates);
            } else if (result.isDenied) {
            }
          });

          //Xoá lun sản phẩm thuộc danh mục con
          let listproducts = products.filter(function (val) {
            return val.sub_categories_id == id_subcates;
          });
          // xoá tất cả sp thuộc dm
          api.API = productsApi;
          console.log(id_subcates);
          console.log(listproducts);
          listproducts.forEach(function (val) {
            api.DeleteData(val.id);
          });
        };
      });
      // api.API = subcategoriesApi + `/${id_subcate_modal}`; //thay đổi url categories/1 để update
      // api.DeleteData(id); //gọi method Update Danh mục
    }
    DeleteSubCate();
    function handle_info_cate() {
      let nodelist_namecate = document.querySelectorAll(".id_cate_main"); //lấy đc element node list các thẻ chứa name cate
      let convert_arr = Array.from(nodelist_namecate); //chuyển sang Array
      convert_arr.forEach(function (value) {
        //lặp All mảng array
        let cate = cates.find(function (value2) {
          //tìm 1 lần duy nhất
          // trả về phần tử có id của cate = id inner text ở trên
          return value2.id == value.innerText;
        });
        value.innerText = cate.name; //thay đổi lại DOM bằng cách lấy thay  vào inner text
      });

      //Lấy id subcate khi click  =>Edit: hiện modal
      // View Edit Modal Categories
      function handle_modal_subcate() {
        let list_subcate = document.querySelectorAll(".btn-edit-subcate");
        list_subcate.forEach(function (element) {
          element.onclick = function () {
            let id_subcate_modal = element.getAttribute("data-id_subcate");
            let tr_element_subcate = element.parentNode.parentNode;
            let name_subcate_modal = tr_element_subcate.children[1].innerText;
            let name_cate_modal2 = tr_element_subcate.children[2].innerText;
            $(".id_subcate_modal")[0].value = id_subcate_modal;
            $(".name_subcate_modal")[0].value = name_subcate_modal;
            // lặp tất cả danh mục chính ,nếu tên dm trùng thì selected
            let ViewSelectCate = $(".name_cate_modal_from_cate")[0];
            let listCates = cates.map(function (val) {
              if (val.name == name_cate_modal2) {
                return `
                <option selected >${val.name}</option>
            `;
              } else {
                return `
                <option>${val.name}</option>
            `;
              }
            });
            listCates = listCates.join("");
            ViewSelectCate.innerHTML = listCates;
            //Xử lý Update danh mục con
            async function UpdateSubCate() {
              document.getElementById("cofirmEditSubCate").onclick =
                function () {
                  api.API = subcategoriesApi + `/${id_subcate_modal}`; //thay đổi url categories/1 để update
                  let name_cate = $(".name_cate_modal_from_cate")[0].value;
                  let name_subcate = $(".name_subcate_modal")[0].value;
                  // Từ tên dm chính => find tên => id danh mục chính
                  let categorie_id = cates.find(function (val) {
                    return val.name == name_cate;
                  });
                  let id_cate = categorie_id.id;
                  let data = {
                    id: id_subcate_modal,
                    categorie_id: id_cate,
                    name: name_subcate,
                  };
                  api.UpdateData(data); //gọi method Update Danh mục
                };
            }
            UpdateSubCate();
          };
        });
      }
      handle_modal_subcate();
    }
    handle_info_cate();
  });
}
ListCate();

async function AddCate() {
  const api = new API(); //khởi tạo đối tượng
  api.API = categoriesApi;
  // Thêm danh mục Chính
  document.getElementById("sbm-add-categorie-main").onclick = function (e) {
    e.preventDefault();
    let name_cate = $("#add-categorie-main")[0].value;
    let data = {
      name: name_cate,
    };
    if (name_cate != "") {
      api
        .AddData(data, function () {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Thêm danh mục thành công",
            showConfirmButton: false,
            timer: 1500,
          });
        })
        .then(function (data) {}); //gọi method Update Danh mục
    }
  };
}
AddCate();
async function AddSubCate() {
  const api = new API(); //khởi tạo đối tượng
  api.API = subcategoriesApi;

  // Thêm danh mục Chính
  const subcates = await api.GetData(); //call api lấy đc data
  api.API = categoriesApi;
  const cates = await api.GetData(); //call api lấy đc data
  let htmlCates = cates.map(function (val) {
    return `
      <option selected>${val.name}</option>
    `;
  });
  htmlCates = htmlCates.join("");

  document.getElementById("selectNameAddCateMain").innerHTML = htmlCates;
  document.getElementById("sbm-add-categorie-children").onclick = function (e) {
    e.preventDefault();
    let name_subcates = document.getElementById(
      "name-add-categorie-children"
    ).value;
    let name_cate = document.getElementById("selectNameAddCateMain").value;
    // Từ tên dm chính => find tên => id danh mục chính
    let categorie_id = cates.find(function (val) {
      return val.name == name_cate;
    });
    let id = categorie_id.id;
    let data = {
      categorie_id: id,
      name: name_subcates,
    };
    api.API = subcategoriesApi;
    if (name_subcates != "") {
      api
        .AddData(data, function () {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Thêm danh mục thành công",
            showConfirmButton: false,
            timer: 1500,
          });
        })
        .then(function (data) {}); //gọi method Update Danh mục
    }
  };
}
AddSubCate();
