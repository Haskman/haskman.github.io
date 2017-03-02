/**
 * Created by Victor on 11/9/2016.
 */
var booklist = [];
var bookDOM = [];
var profileDOM = [];
var cart = [];
var searchTrigger = true;

//Generate markup for search and profile results for preloading
$(document).ready(function(e) {
    $.getJSON( "data/json/books.json", function( data ) {
        $.each( data, function( key, val ) {
            booklist.push(val);
        });
        for (bookIndex in booklist){
            addResults(bookIndex);
            addProfile(bookIndex);
        }
    });
    //Check cookie to see if user already has a cart
    if (JSON.parse(getCookie("cart") != null)){
        cart = JSON.parse(getCookie("cart"));
        if (!(cart[0] === undefined)) {
            $("#cartlogo").attr('src', 'data/img/cartactive.png');
        }
    }
    addBlank();
});

//Set up interval to search string in search box automatically
var searchText = null;

setInterval(function() {
    if ($('#search').val() != searchText && searchTrigger) {
        refreshResults();
    }
}, 500);

/*TODO: Less code repetition*/
//Add book search results if search text matches a column of an entry depending on the category
function filterSearch(text, category){
   for (index in bookDOM){
        switch (category){
            case "title":
                if (booklist[index].Title.toUpperCase().includes(text.toUpperCase())){
                    $("#results-table").append(bookDOM[index]);

                }
                break;
            case "author":
                if (booklist[index].Author.toUpperCase().includes(text.toUpperCase())){
                    $("#results-table").append(bookDOM[index]);
                }
                break;
            case "ISBN":
                if (booklist[index].ISBN.includes(text)){
                    $("#results-table").append(bookDOM[index]);
                }
                break;
            case "professor":
                if (booklist[index].Professor.toUpperCase().includes(text.toUpperCase())){
                    $("#results-table").append(bookDOM[index]);
                }
                break;
            case "class":
                if (booklist[index].Class.toUpperCase().includes(text.toUpperCase())){
                    $("#results-table").append(bookDOM[index]);
                }
                break;
            case "CRN":
                if (String(booklist[index].CRN).includes(text)){
                    $("#results-table").append(bookDOM[index]);
                }
                break;
        }
   }
}

//Pre-load search results upon launch
function addResults(bookIndex){
    var book = booklist[bookIndex];
    bookDOM.push(
        '<section class="search-results" id="result' + bookIndex + '">'
        +'<div class = "row">'
        +'<div class="col-md-2">'
        +'<a class="book-link book-cover" href="javascript:bookProfile(' + bookIndex + ');" onclick="bookProfile(' + bookIndex
        + ')"><img class = "book-cover" style="height:180px;width:120px;" src="data/img/book_cover/images/' + book.ISBN + '.jpg"></a>'
        +'</div>'
        +'<div class="col-md-2">'
        +'<a class="book-link" href="javascript:void(0);" onclick="bookProfile(' + bookIndex + ')"><h4 class="text-center">' + book.Title + '</h4></a>'
        +'</div>'
        +'<div class="col-md-2">'
        +'<h4 class="text-center">' + book.Author + '</h4>'
        +'</div>'
        +'<div class="col-md-4">'
        +'<h4 class="text-center">' + book.Summary.substr(0,299) + '...</h4>'
        +'</div>'
        +'<div class="col-md-2">'
        +'<h4 class="text-center">' + book.ISBN + '</h4>'
        +'<h4 class="text-center"> New Price: $' + book.NewPrice + '</h4>'
        +'<h4 class="text-center"> Used Price: $' + book.UsedPrice + '</h4>'
        +'<h4 class="text-center"> Rental Price: $' + book.RentalPrice + '</h4>'
        +'<h4 class="text-center"> E-Book Price $' + book.EbookPrice + '</h4>'
        +'</div>'
        +'</div>'
        +'</section>');
}

//Refresh search results by removing everything and running filterSearch()
function refreshResults(){
    searchText = $('#search').val();
    var searchCategory = $('#search-dropdown').val();
    if (searchText != "") {
        $("#results-table").css("visibility", "visible");
        for (index in bookDOM){
            $("#result"+index).detach();
        }
        filterSearch(searchText, searchCategory);
    }
    else {
        $("#results-table").css("visibility", "hidden");
    }
}

//Pre-load all book profiles
function addProfile(index){
    var book = booklist[index];
    profileDOM.push(
        '<section class="row book-profile"' + /*'id="profile' + bookIndex +*/ '">'
        +'<div>'
        +'<div class="col-md-1">'
        +'</div>'
        +'<div class="col-md-3">'
        +'<img class = "book-cover row" style="height:300px;width:200px;" src="data/img/book_cover/images/' + book.ISBN + '.jpg"></img>'
        +'</div>'
        +'<div class="col-md-3">'
        +'<h3>Summary:</h3>'
        +'<p class="profile-text">Semester: ' + book.Semester + '</p>'
        +'<p class="profile-text">Class: ' + book.Class + ', ' + book.Required + '</p>'
        +'<p class="profile-text">Credit Hours: ' + book.CreditHours + '</p>'
        +'<p class="profile-text">Professor: ' + book.Professor + '</p>'
        +'<p class="profile-text">CRN: ' + book.CRN + '</p>'
        +'<p class="profile-text">' + book.Summary + '</p>'
        +'</div>'
        +'<div class="col-md-2">'
        +'<h3>Price:</h3>'
        +'<p class="profile-text">New: $' + book.NewPrice + ' (In Stock:' + book.NewQuantity + ')</p>'
        +'<button class="add-item new-button" onclick="addItem(1, \'new\',' + index + ')">Add to cart</button>'
        +'<p class="profile-text">Used: $' + book.UsedPrice + ' (In Stock:' + book.UsedQuantity + ')</p>'
        +'<button class="add-item used-button" onclick="addItem(1, \'used\',' + index + ')">Add to cart</button>'
        +'<p class="profile-text">Rental: $' + book.RentalPrice + ' (In Stock:' + book.RentalQuantity + ')</p>'
        +'<button class="add-item rental-button" onclick="addItem(1, \'rental\',' + index + ')">Add to cart</button>'
        +'<p class="profile-text">E-Book: $' + book.EbookPrice + '</p>'
        +'<button class="add-item e-book-button" onclick="addItem(1, \'e-book\',' + index + ')">Add to cart</button>'
        +'</div>'
        +'<div class="col-md-1">'
        +'</div>'
        +'<div class="col-md-1">'
        +'<a href="javascript:void(0);" onclick="closeProfile()"><img class="closeicon" src="data/img/closeicon.png" style="height:5vh;width:5vh;" alt="Close Profile"></a>'
        //+'<input type="text" id="quantity" name="quantity" placeholder="Quantity(1-20)">'
        +'</div>'
        +'</section>'
    );
}

//Function to close a book profile by removing everything and refreshing search results
function closeProfile(){
    $(".book-profile").detach();
    searchTrigger = true;
    refreshResults();
    $("#search-hanger").append(searchBox());
}

//Add item to cart ith quantity, type and ID
function addItem(quantity, type, ID){
    if(quantity > 0 && quantity <21 && quantity%1 === 0){
        cart.push({ID: ID, Quantity: quantity, Type: type});
        $("#cartlogo").attr('src', 'data/img/cartactive.png');
        createCookie("cart",JSON.stringify(cart),1);
        alert("Cart updated");
    }
    else{
        alert("Please enter a valid quantity")
    }
}

//Add a book profile on the page, by removing everything first, loading preloaded markup, and removing purchase buttons depending on quality
function bookProfile(index) {
    var book = booklist[index];
    $(".book-profile").detach();
    searchTrigger = false;
    for (i in booklist) {
        $("#result" + i).detach();
    }
    //$("#results-table").append(bookDOM[index]);
    addBlank();
    $("#results-table").append(profileDOM[index]);

    $("#search-box").detach();

    //TODO: Fix repetitive code
    if (book.NewQuantity < 1){
        $(".new-button").detach();
    }
    if (book.UsedQuantity < 1){
        $(".used-button").detach();
    }
    if (book.RentalQuantity < 1){
        $(".rental-button").detach();
    }
    if (book.EbookQuantity < 1){
        $(".e-book-button").detach();
    }
}

//Add blank result for dan alignment bug
function addBlank(){
    $("#results-table").append('<section class="row"></section>');
}

function checkout(){
    searchTrigger = false;

    var prices;
    var subtotal = 0;
    var shipping = 0;

    $("#results-table").css("visibility","hidden");
    $("#cart-table").detach();
    $("#checkout-fields").detach();
    $(".cart-item").detach();
    $("#search-box").detach();
    $("#search-bar").append('<section class="row"></section>');
    $("#search-bar").append(''
        +'<section class = "row" id="cart-table">'
        +'<div class="col-md-1"></div>'
        +'<div class="col-md-2">'
        +'<h3 class="cart-text text-center">Cover</h3>'
        +'</div>'
        +'<div class="col-md-2" id="input-col1">'
        +'<h3 class = "cart-text">Title, Type</h3>'
        +'</div>'
        +'<div class="col-md-2" id="input-col2">'
        +'<h3 class = "cart-text">Price x Quantity</h3>'
        +'</div>'
        +'<div class="col-md-4" id="checkout-fields"></div>'
        +'<div class="col-md-1">'
        +'<a href="javascript:void(0);" onclick="closeCart()"><img class="closeicon" src="data/img/closeicon.png" style="height:5vh;width:5vh;" alt="Close Cart"></a>'
        +'</div>'
        +'</section>');

    $("#results-table").visibility = "hidden";
    $(".book-profile").detach();
    $(".search-results").detach();

    for (i in cart){
        var prices = generateSubcart(cart[i].Quantity, cart[i].Type, cart[i].ID, i);
        subtotal += prices.Subtotal;
        shipping += prices.Shipping;
    }

    if (shipping > 0){shipping = 15;}

    $("#checkout-fields").append('' +
        '<section class = "row"> </section>'
        +'<div class="row cart-total">'
        +'<h4>Subtotal: $' + subtotal.toFixed(2) + '</h4>'
        +'<h4>Tax: ' + (subtotal * 0.075).toFixed(2) + '</h4>'
        +'<h4>Shipping: $' + shipping + '</h4>'
        +'<h4>Total: $' + (subtotal*1.075 + shipping).toFixed(2) + '</h4>'
        +'<button class="proceed-cart cart-button" onclick="proceedOrder()">Proceed to pay</button>'
        + '</div>');
}

function proceedOrder(){
     $(".cart-item").detach();
     $(".proceed-cart").detach();
     $(".cart-text").detach();

     $("#input-col1").append('' +
     '<div class="input-container">'
     +'<div class="row info-input">'
     +'<input type="text" id="address1" name="address1" placeholder="Address Line 1">'
     +'</div>'
     +'<div class="row info-input">'
     +'<input type="text" id="address2" name="address2" placeholder="Address Line 2">'
     +'</div>'
     +'<div class="row info-input">'
     +'<input type="text" id="city" name="city" placeholder="City">'
     +'</div>'
     +'<div class="row info-input">'
     +'<input type="text" id="state" name="state" placeholder="State">'
     +'<input type="text" id="zip" name="zip" placeholder="ZIP">'
     +'</div>'
     +'</div>');

     $("#input-col2").append('' +
     '<div class="input-container">'
     +'<div class="row info-input">'
     +'<input type="text" id="ccno" name="ccno" placeholder="Credit Card No">'
     +'</div>'
     +'<div class="row info-input">'
     +'<input type="text" id="ccdate" name="ccdate" placeholder="MM/YYYY">'
     +'</div>'
     +'<div class="row info-input">'
     +'<input type="text" id="ccsecurity" name="ccsecurity" placeholder="Security No (XXX)">'
     +'</div>'
     +'<div class="row info-input">'
     +'<input type="text" id="holder" name="holder" placeholder="Name on card">'
     +'<input type="text" id="cczip" name="cczip" placeholder="Credit Card ZIP">'
     +'<input type="text" id="email" name="email" placeholder="E-Mail">'
     + '</div>');
     +'</div>'

     $("#checkout-fields").append('' +
     '<div class="input-container">'
     +'<div class="row info-input">'
     +'<button class="edit-cart cart-button" onclick="submitOrder(cart, {\'Line1\': $(\'#address1\').val(), \'Line2\': $(\'#address2\').val()'
     +', \'City\': $(\'#city\').val(), \'State\': $(\'#state\').val(), \'ZIP\': $(\'#zip\').val()},'
     +'{\'CCNO\': $(\'#ccno\').val(),\'CCSecurity\': $(\'#ccsecurity\').val(),\'Holder\': $(\'#holder\').val(),\'CCZip\': $(\'#cczip\').val(),\'EMail\': $(\'#email\').val(), \'Expiration\': $(\'#ccdate\').val()},'
     +'\'cc\')">Pay with Credit Card</button>'
     +'<button class="edit-cart cart-button" onclick="submitOrder(cart, {\'Line1\': $(\'#address1\').val(), \'Line2\': $(\'#address2\').val()'
     +', \'City\': $(\'#city\').val(), \'State\': $(\'#state\').val(), \'ZIP\': $(\'#zip\').val()},'
     +'{\'EMail\': $(\'#email\').val()},'
     +'\'pp\')">Pay with PayPal</button>'
     +'</div>'
     +'</div>');
}

function generateSubcart(quantity, type, index, itemno){
    var book = booklist[index];
    var bookprice;
    var shipping = 0;

    switch (type){
        case "new":
            bookprice = book.NewPrice;
            shipping = 15;
            break;
        case "used":
            bookprice = book.UsedPrice;
            shipping = 15;
            break;
        case "rental":
            bookprice = book.RentalPrice;
            shipping = 15;
            break;
        case "e-book":
            bookprice = book.EbookPrice;
            break;
    }

    $("#search-bar").append(''
    +'<section class = "row cart-item" id="cart-item' + itemno + '">'
    +'<div class="col-md-1"></div>'
    +'<div class="col-md-2">'
    +'<img class = "book-cover" style="height:300px;width:200px;" src="data/img/book_cover/images/' + book.ISBN + '.jpg"></img>'
    +'</div>'
    +'<div class="col-md-2">'
    +'<p class = "cart-text">' + book.Title + ', '+ type + '</p>'
    +'</div>'
    +'<div class="col-md-2">'
    +'<p class = "cart-text">' + '$' + bookprice + ' x ' + quantity + '</p>'
    +'<input type="text" id="item-quantity' + itemno +'" name="item-quantity' + itemno + '"placeholder="Quantity(1-20)">'
    +'<button class="edit-cart cart-button" onclick="editCart($(\'#item-quantity' + itemno + '\').val(),' + itemno + ')">Update Item</button>'
    +'</div>'
    +'</section>');

    return {Subtotal: bookprice*quantity, Shipping: shipping};
}

//TODO: Implement checking stock
/*function checkStockProfile(index, quantity, type){
    var book = booklist[index];
    var availability = true;
    switch (type){
        case "new":
            availability = (quantity <= book.NewQuantity);
            break;
        case "used":
            availability = (quantity <= book.UsedQuantity);
            break;
        case "rental":
            availability = (quantity <= book.RentalQuantity);
            break;
        case "e-book":
            availability = (quantity <= book.EbookQuantity);
            break;
    }
    if (!availability){
        $("#"+type+"-button").prop('disabled', true);
    }
}*/

function editCart(quantity,index){
    if (quantity >= 0 && quantity <= 20 && quantity % 1 == 0) {
        cart[index].Quantity = quantity;
        if (quantity == 0) {
            cart.splice(index, 1);
            if (cart[0] === undefined){
                $("#cartlogo").attr('src', 'data/img/cartlogo.png');
            }
        }
        createCookie("cart",JSON.stringify(cart),1);
        checkout();
    }
    else{
        alert("Please enter a valid quantity. You can enter 0 as the quantity to remove an item.");
    }
}

function closeCart(){
    $("#cart-table").detach();
    $("#checkout-fields").detach();
    $(".cart-item").detach();
    $("#results-table").visibility = "visible";
    $("#search-hanger").append(searchBox());
    searchTrigger = true;
    refreshResults();
}

function searchBox(){
    return '<section class="row" id="search-bar">'
        +'<div id="search-box" class = "center-block text-center">'
        +'<div class="col-md-2">'
        +'</div>'
        +'<div class = col-md-1 id="search-logo">'
        +'<img src="data/img/searchicon.png" alt="Search Icon" style="height:5vh;width:5vh;">'
        +'</div>'
        +'<form class = col-md-6>'
        +'<input type="text" id="search" placeholder="Search">'
        +'</form>'
        +'<div class="col-md-2">'
        +'<label for="search-dropdown">Search by:</label>'
        +'<select id="search-dropdown">'
        +'<option value="title">Title</option>'
        +'<option value="author">Author</option>'
        +'<option value="ISBN">ISBN</option>'
        +'<option value="professor">Professor</option>'
        +'<option value="class">Class</option>'
        +'<option value="CRN">CRN</option>'
        +'</select>'
        +'</div>'
        +'<div class="col-md-1"></div>'
        +'</div>'
        +'</section>'
}

function checkAddress(address){
    return !(address.Line1==''|| address.Line2=='' || address.City=='' || address.State=='' || address.ZIP=='')
}

function submitOrder(cart, address, payInfo, type){
    var status;
    var ebook = false;
    status = 1;

    if (type == "cc"){
        if (checkCC(payInfo.CCNO) && payInfo.CCSecurity == 777){
            if (checkAddress(address)){
                if (payInfo.Holder != '' && payInfo.ZIP != '' &&payInfo.Expiration) {
                    status = 0;
                }
            }
            else{
                status = 4;
            }
        }
        else{
            status = 3;
        }
    }

    if (type == "pp"){
        if (payInfo.EMail != ''){
            status = 0;
        }
        else{
            status = 5;
        }
    }

    switch(status){
        case 0:
            alert("Order successfully placed!");
            for (i in cart){
                if (cart[i].Type == 'e-book'){
                    ebook = true;
                    //booklist[cart[i].id].EbookQuantity -= cart[i].Quantity;
                }
                else if (cart[i].Type == 'new'){
                    //booklist[cart[i].id].NewQuantity -= cart[i].Quantity;
                }
                else if (cart[i].Type == 'used'){
                    //booklist[cart[i].id].UsedQuantity -= cart[i].Quantity;
                }
                else if (cart[i].Type == 'rental'){
                    //booklist[cart[i].id].RentalQuantity -= cart[i].Quantity;
                }
            }
            cart = [];
            closeCart();

            if (ebook){
                sendLink(payInfo.Email);
                alert("Your e-book download link: http://thepiratebay.se")
            }

            break;
        case 1:
            alert("Order placement failed due to an error. Please verify all entered info or try again later.");
            break;
        case 2:
            alert("Pricing conflict error. Please remove all items from cart and try again.");
            break;
        case 3:
            alert("Could not process payment. Please make sure credit card info is entered correctly");
            break;
        case 4:
            alert("Please enter a valid address");
            break;
        case 5:
            alert("PayPal authentication failed. Please verify the entered info is valid.")
    }
}

