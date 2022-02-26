const usersApi='http://localhost:3000/users'

import API from "./index.js";
const api = new API();
api.API = usersApi;
let users=await api.GetData();
users.sort(function(a,b){return b.id-a.id})
let rs=users.map(function(val){
    return `
        <tr>
            <td>${val.id}</td>
            <td>${val.name}</td>
            <td>${val.phone}</td>
            <td>${val.address}</td>
            <td>${val.email}</td>
            <td><button data-id_user="${val.id}" class="btn btn-outline-danger xoa_user">Xoá</button></td>

        </tr>
    `
})
rs=rs.join('')
$('.table_users')[0].innerHTML =rs
let list_user=$('.xoa_user')
list_user=Array.from(list_user)
list_user.forEach(function(val){
    val.onclick = function () {
        let id_user=val.getAttribute('data-id_user')
        api.DeleteData((id_user))
    }
})