/**
 * Created by Victor on 11/9/2016.
 */
var booklist = [];
var bookDOM = [];
var profileDOM = [];
var cart = [];
var searchTrigger = true;

$(document).ready(function(e) {
    $.getJSON( "data/json/books.json", function( data ) {
        //console.log( "JSON Data: " + data);
        $.each( data, function( key, val ) {
            booklist.push(val);
        });
        for (bookIndex in booklist){
            addResults(bookIndex);
            addProfile(bookIndex);
        }
    });
    addBlank();
});

var searchText = null;

setInterval(function() {
    if ($('#search').val() != searchText && searchTrigger) {
        refreshResults();
    }
}, 500);

/*TODO: Less code repetition, replace manual CSS editing with a process to refresh everything using an array of visible objects*/
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

function addResults(bookIndex){
    var book = booklist[bookIndex];
    bookDOM.push(
        '<section class="row search-results" id="result' + bookIndex + '">'
        +'<div>'
        +'<div class="col-md-1"></div>'
        +'<div class="col-md-2">'
        +'<a class="book-link" href="javascript:bookProfile(' + bookIndex + ');" onclick="bookProfile(bookIndex)"><img class = "book-cover" style="height:75px;width:50px;" src="data/img/book_cover/images/' + book.ISBN + '.jpg"></a>'
        +'</div>'
        +'<div class="col-md-2">'
        +'<h4 class="text-center">' + book.Title + '</h4>'
        +'</div>'
        +'<div class="col-md-2">'
        +'<h4 class="text-center">' + book.Author + '</h4>'
        +'</div>'
        +'<div class="col-md-2">'
        +'<h4 class="text-center">' + book.Summary.substr(0,49) + '...</h4>'
        +'</div>'
        +'<div class="col-md-2">'
        +'<a class="book-link" href="javascript:void(0);" onclick="bookProfile(' + bookIndex + ')"><h4 class="text-center">' + book.ISBN + '</h4></a>'
        +'</div>'
        +'<div class="col-md-1"></div>'
        +'</div>'
        +'</section>');
}

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
        +'<p class="profile-text">' + book.Summary + '</p>'
        +'<p class="profile-text">Semester: ' + book.Semester + '</p>'
        +'<p class="profile-text">Class: ' + book.Class + '</p>'
        +'<p class="profile-text">Credit Hours: ' + book.CreditHours + '</p>'
        +'<p class="profile-text">Professor: ' + book.Professor + '</p>'
        +'<p class="profile-text">CRN: ' + book.CRN + '</p>'
        +'</div>'
        +'<div class="col-md-2">'
        +'<h3>Price:</h3>'
        +'<p class="profile-text">New: ' + book.NewPrice + '</p>'
        +'<p class="profile-text">Used: ' + book.UsedPrice + '</p>'
        +'<p class="profile-text">Rental: ' + book.RentalPrice + '</p>'
        +'<p class="profile-text">E-Book: ' + book.EbookPrice + '</p>'
        +'</div>'
        +'<div class="col-md-1">'
        +'<button class="add-item" onclick="addItem($(\'#quantity\').val(), \'new\', index)">Add new</button>'
        +'<button class="add-item" onclick="addItem($(\'#quantity\').val(), \'used\', index)">Add used</button>'
        +'<button class="add-item" onclick="addItem($(\'#quantity\').val(), \'rental\', index)">Add rental</button>'
        +'<button class="add-item" onclick="addItem(1, \'e-book\', index)">Add E-book(1)</button>'
        +'</div>'
        +'<div class="col-md-1">'
        +'<a href="javascript:void(0);" onclick="closeProfile()"><img class="closeicon" src="data/img/closeicon.png" style="height:5vh;width:5vh;" alt="Close Profile"></a>'
        +'<input type="text" id="quantity" name="quantity" placeholder="Quantity(1-20)">'
        +'</div>'
        +'</section>'
    )
}

function closeProfile(){
    $(".book-profile").detach();
    searchTrigger = true;
    refreshResults();
}

function addItem(quantity, type, ID){
    if(quantity > 0 && quantity <21){
        cart.push({ID: ID, Quantity: quantity, Type: type});
        $("#cartlogo").attr('src', 'data/img/cartactive.png');
        alert("Cart updated");
    }
    else{
        alert("Please enter a valid quantity")
    }
}

function bookProfile(index) {
    searchTrigger = false;
    for (i in booklist) {
        $("#result" + i).detach();
    }
    $("#results-table").append(bookDOM[index]);
    addBlank();
    $("#results-table").append(profileDOM[index]);
}

function addBlank(){
    $("#results-table").append('<section class="row"></section>');
}