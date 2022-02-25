// export const ID = document.getElementById.bind(document);
// export const $ = document.querySelector.bind(document);
// export const $$ = document.querySelectorAll.bind(document);
if ($(".title-breadcrumb")) {
  let title = $(".title-breadcrumb")[0].innerText;
  $(".breadcrumb-item-active")[0].innerText = title;
}
export default class API {
  API = ""; //khai báo thuộc tính đường dẫn resource http://productApi
  constructor() {}
  async GetData() {
    let rep = await fetch(this.API);
    let data = await rep.json();
    return data;
  }
  async AddData(data,callback) {
    callback()
    await fetch(this.API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }
  async UpdateData(data) {
    await fetch(this.API, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }
  async UpdateDataPatch(data,callback) {
    await fetch(this.API, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    callback()
  }
  async DeleteData(id) {
    await fetch(this.API + "/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async renderHTML(data) {
    data();
  }
  async handle(data) {
    data();
  }
}
