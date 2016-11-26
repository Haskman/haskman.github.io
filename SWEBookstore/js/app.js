/**
 * Created by Victor on 11/9/2016.
 */
var booklist = [];

$(document).ready(function(e) {
    $.getJSON( "data/json/books.json", function( data ) {
        //console.log( "JSON Data: " + data);
        $.each( data, function( key, val ) {
            booklist.push(val);
        });
        console.log(booklist);
        console.log(booklist[40]);
        for (bookIndex in booklist){
            addResults(bookIndex);
        }
    });
    addBlank();
});

setInterval(function() {
    searchText = $('#search').val();
    searchCategory = $('#search-dropdown').val();
    if (searchText != ""){
        filterSearch(searchText, searchCategory);
        $("#results-table").css("visibility","visible");
    }
    else {
        $(".search-results").css("visibility","hidden");
        $("#results-table").css("visibility","hidden");
    }
    }, 500);

/*TODO: Less code repetition*/
function filterSearch(text, category){
    for (i in booklist){
        if (category==="ISBN") {
            if (booklist[i].ISBN.includes(text)) {
                $("#result"+i).css("visibility","visible");
            }
            else{
                $("#result"+i).css("visibility","hidden");
            }
        }
        if (category==="author") {
            if (booklist[i].Author.includes(text)) {
                $("#result"+i).css("visibility","visible");
            }
            else{
                $("#result"+i).css("visibility","hidden");
            }
        }
        if (category==="title") {
            if (booklist[i].Title.includes(text)) {
                $("#result"+i).css("visibility","visible");
            }
            else{
                $("#result"+i).css("visibility","hidden");
            }
        }
    }
}

function addResults(bookIndex){
    book = booklist[bookIndex];
    $("#results-table").append('<section class="row search-results" id="result' + bookIndex + '">'
        +'<div>'
        +'<div class="col-md-1"></div>'
        +'<div class="col-md-2">'
        +'<a class="book-link"><img class = "book-cover" style="height:75px;width:50px;" src="data/img/book_cover/images/' + book.ISBN + '.jpg"></a>'
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
        +'<h4 class="text-center">' + book.ISBN + '</h4>'
        +'</div>'
        +'<div class="col-md-1"></div>'
        +'</div>'
        +'</section>');
}

function addBlank(){
    $("#results-table").append('<section class="row"></section>');
}