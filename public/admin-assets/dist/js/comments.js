const commentsApi = "http://localhost:3000/comments";
const productsApi = "http://localhost:3000/products";
import API from "./index.js";
const api = new API();
api.API = commentsApi;
const comments = await api.GetData();
comments.sort(function (a, b) {
  return b.id - a.id;
});

async function handleViewCommentsNew() {
  let htmls_tables_comments = comments.map(function (val) {
    let pro = val.id_sp;
    fetch(productsApi + "/" + pro)
      .then(function (rep) {
        return rep.json();
      })
      .then(function (data) {
        let rs =`
            <tr>
            <td>${val.id}</td>
            <td>${val.name_user}</td>
            <td>
              <div class="d-flex">
                <img style="width:50px" src="${data.img}">
                <div>${data.name}</div>
              </div>
            </td>
            <td>${val.comment}</td>
            <td>
              <button class="btn btn-outline-danger xoa_comments" data-id_comments="${val.id}">Xoá</button>
              <a target="_blank" href="../../../product_detail.html?${pro}">Xem</a>
            </td>
            </tr>
        `
        $('.table_comments').append(rs)
        
    let listBtnXoaComments = $(".xoa_comments");
      listBtnXoaComments = Array.from(listBtnXoaComments);
      listBtnXoaComments.forEach(function (val) {
        val.onclick = function () {
          let id_comment = val.getAttribute("data-id_comments");
          //call api update status
          api.API = 'http://localhost:3000/comments';
          api.DeleteData(id_comment)
        };
      });
      });

  });



  //click huỷ đơn
}
handleViewCommentsNew();
