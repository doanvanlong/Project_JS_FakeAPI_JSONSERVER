import API from "./api.js";
import { $, $$ } from "./api.js";
// localStorage.removeItem('login')
if (localStorage.getItem("login")) {
  let login = JSON.parse(localStorage.getItem("login"));
  let admin;
  if (login.role == 1) {
    admin = `
    <li><a href="admin" target="_blank"><i class="fa fa-user left"
    aria-hidden="true"></i>Admin</a></li>
    `;
  }else{
    admin=''
  }
  let html = `
    <a href="#"><span><img style="width:25px;margin-right:5px;border-radius:5px;" src="${login.img}"></span><span
            class="hidden-sm-down font-weight-bold">${login.name}</span><i class="fa fa-angle-down right"
            aria-hidden="true"></i></a>
    <!--Dropdown-->
    <div class="dropdown-menu">
        <ul>
            <li><a href="myorders.html">Đơn hàng của tôi</a></li>
            <li><a href="#">Sản phẩm yêu thích</a></li>
        </ul>
        <span class="divider"></span>
        <ul>
            ${admin}
            <li><a href="register.html"><i class="fa fa-user left"
                        aria-hidden="true"></i>Đăng ký</a></li>
             <li><a href="#" id="logout"><i class="fa fa-user left"
                        aria-hidden="true"></i>Đăng xuất</a></li>
        </ul>
    </div>
    `;
  let a = document.createElement("li");
  a.classList.add("dropdown-nav");
  a.innerHTML = html;
  $(".list-none").append(a);
  //Đăng xuất
  $("#logout").onclick = function () {
    localStorage.removeItem("login");
    // về trang chủ
    location.href = "./";
  };
} else {
  // chưa login
  let html = `
             <a href="login-register.html"><i class="fa fa-lock left" aria-hidden="true"></i><span
              class="hidden-sm-down">Đăng nhập</span></a>
             `;
  let a = document.createElement("li");
  a.innerHTML = html;
  $(".list-none").append(a);

  const usersApi = `http://localhost:3000/users`;
  const api = new API();
  api.API = usersApi;
  // call api users
  let users = await api.GetData();
  //   lấy dữ liệu từ form login

  //login user
  async function loginUser() {
    let email = $("#author-email-login");
    let pass = $("#author-pass-login");
    $("#submit_login").onclick = function (e) {
      e.preventDefault();

      let rsFind = users.find(function (user) {
        return user.email == email.value;
      });
      if (rsFind != undefined) {
        // có tài khoản
        //xong thì check tiếp mật khẩu
        // let rsFindPass = users.find(function (user) {
        //   return user.password == pass.value;
        // });

        if (rsFind.password == pass.value) {
          //login thành công.lưu vào Localstorage
          let data = {
            id: rsFind.id,
            name: rsFind.name,
            email: rsFind.email,
            img: rsFind.img,
            phone: rsFind.phone,
            address: rsFind.address,
            role: rsFind.role,
          };
        
          localStorage.setItem("login", JSON.stringify(data));
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Đăng nhập thành công",
            showConfirmButton: false,
            timer: 1500,
          });
          setTimeout(function () {
            location.href = "./";
          }, 1700);
          //về trang chủ

        } else {
          //ko đúng mật khẩu
          $("#errPassLogin").innerText = "Mật khẩu không đúng!";
        }
        $("#errEmailLogin").innerText = "";
      } else {
        // ko đúng email
        if (email.value == "") {
          $("#errEmailLogin").innerText = "Email không được để trống!";
        } else {
          $("#errEmailLogin").innerText = "Email không tồn tại!";
        }
      }
    };
  }
  loginUser();
  //register user
  let img;
  $(".imgAvtRegister").onchange = function () {
    let reader = new FileReader(); //đọc file
    reader.onload = function (e) {
      $("#awaitPreviewAvt").style.display = "block"; //hiển thị thẻ im để điền src
      $("#previewAvt").setAttribute("src", e.target.result); //thêm src vào img
      img = e.target.result;
    };
    reader.readAsDataURL(this.files[0]);
  };
  async function registerUser() {
    let email = $("#author-email-register");
    let pass = $("#author-pass-register");
    let namee = $("#author-name-register");
    $("#submit_register").onclick = function (e) {
      e.preventDefault();
      //Khi thêm hình ảnh
      let rsFind = users.filter(function (user) {
        return user.email == email.value;
      });
      if (rsFind.length > 0) {
        // console.log('có');
        $("#errEmailregister").innerText = "Email đã tồn tại";
      } else {
        // console.log('chua');
        $("#errEmailregister").innerText = "";
        if (pass.value == "") {
          $("#errPassregister").innerText = "Mật khẩu không được trống!";
        } else {
          let data = {
            email: email.value,
            password: pass.value,
            name:namee.value,
            img: img,
            phone: 0,
            address: "",
            role: 0,
          };
          api.AddData(data, function () {
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Đăng ký thành công",
              showConfirmButton: false,
              timer: 1500,
            });
            setTimeout(function () {
              location.href = "login-register.html";
            }, 1700);
          });
        }
      }
    };
  }
  registerUser();
}
//end kiểm tra login
