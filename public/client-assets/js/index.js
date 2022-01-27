const $ = document.getElementById.bind(document);
const productApi = "http://localhost:3000/products";

function getProductsNew(callback) {
  fetch(productApi) //resole(response)
    .then(function (response) {
      return response.json(); //return về request
      //   json trả về promise
      // nếu thành công thì then
    })
    .then(callback); //mún viết cái hàm th cái chi đó

  //khi gọi hàm get thì sẻ thực thi hàm callback function
}
getProductsNew(function (data) {
    renderProductsNew(data)
});

function renderProductsNew(data) {
  var rs = data.map((value) => {
    return `
        <div class="product-item">
        <div class="product-item-inner">
            <div class="product-img-wrap ">
                <img src="public/client-assets/img/product-img/ao_thun/aothun.jpg" alt="">
            </div>
            <div class="product-button">
                <a href="#" class="js_tooltip" data-mode="top" data-tip="Add To Cart"><i
                        class="fa fa-shopping-bag"></i></a>
                <a href="#" class="js_tooltip" data-mode="top"
                    data-tip="Add To Whishlist"><i class="fa fa-heart"></i></a>
                <a href="#" class="js_tooltip" data-mode="top" data-tip="Quick&nbsp;View"><i
                        class="fa fa-eye"></i></a>
            </div>
        </div>
        <div class="product-detail">
            <a class="tag" href="#">Men Fashion</a>
            <p class="product-title "><a href="product_detail.html">${value.name}</a></p>
            <p class=""></p>
            <div class="product-rating">
                <div class="star-rating" itemprop="reviewRating" itemscope=""
                    itemtype="http://schema.org/Rating" title="Rated 4 out of 5">
                    <span style="width: 60%"></span>
                </div>
                <a href="#" class="product-rating-count"><span class="count">3</span>
                    Reviews</a>
            </div>
            <p class="product-description">
                When an unknown printer took a galley of type and scrambled it to make a
                type specimen book. It has survived not only five centuries, but also the
                leap into electronic remaining essentially unchanged.
            </p>
            <h5 class="item-price  ">${value.price}</h5>
        </div>
    </div>
    `
  });
  $('new-product').innerHTML=rs
}
