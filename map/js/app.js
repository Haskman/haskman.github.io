//Global variables
var map;
placeMarkers = ko.observableArray([]);

//Place data
places = [{
    "title": "Cookout",
    "description": "Cheapest fast food place in the area. The best choice when the fact of being broke becomes more urgent than eating well",
    "coordinates": {lat: 34.034523, lng: -84.571618},
    "type": "Food"
},

    {
        "title": "Cobb Center Mall",
        "description": "The nearest mall. Has standard mall stuff.",
        "coordinates": {lat: 34.018442, lng:  -84.564487},
        "type": "Shopping"
    },

    {
        "title": "Kennesaw Mountain",
        "description": "The local 'mountain'. Place of a battle during the Civil War. Now a good hiking and picnic location for locals and college people going out on Sunday afternoons",
        "coordinates": {lat:  33.978166, lng: -84.578104},
        "type": "Landmark"
    },

    {
        "title": "Lake Allatoona",
        "description": "The local lake. Good for swimming in the summer for people who are stuck in the vicinity for any reason",
        "coordinates": {lat:  34.153361, lng: -84.692461},
        "type": "Landmark"
    },

    {
        "title": "Kennesaw State University",
        "description": "The local university. I go here.",
        "coordinates": {lat: 34.037648, lng: -84.581396},
        "type": "School"
    },
];


//Initialize the map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat:  33.989474, lng: -84.537597},
        zoom: 13
    });

    //Initialize markers
    function MarkerInit(place) {
        this.title = place.title;
        this.cords = place.coordinates;
        this.desc = place.description;
        this.type = place.type;
        this.infoWindow = new google.maps.InfoWindow();

        function infoWindowTitle(place){
            return "<h3 class = 'view-text'>" + this.title + "</h4>";
        }

        function infoWindowContent(place){
            var contentString = "<h4>"+this.type+"</h4>"+
                "<p class = 'view-text'>"+this.desc+"</p>"+
                "<img class = 'view-img' src='https://maps.googleapis.com/maps/api/streetview?size=400x400&location=" +
                this.cords.lat+","+this.cords.lng+"'>";
            return contentString;
        }

        infoWindow = new google.maps.InfoWindow({
            content: infoWindowTitle(place) + infoWindowContent(place),
            maxWidth: 200
        });

        //Marker constructor
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(this.cords),
            title: this.title,
            titleContent: infoWindowTitle(place),
            type: this.type,
            map: map,
            content: infoWindowContent(place),
            infoWindow: this.infoWindow
        });

        marker.addListener('click', function() {
            //Close all infoWindows and stop all animations
            for (var i in placeMarkers()){
                if(placeMarkers()[i]().mapMarker.infoWindow) {
                    placeMarkers()[i]().mapMarker.infoWindow.close();
                    placeMarkers()[i]().mapMarker.setAnimation(null);
                }

            }
            //panTo marker
            map.panTo(this.position);

            //Animate marker
            marker.setAnimation(google.maps.Animation.BOUNCE);

            //Stop animating after 0.7 seconds
            setTimeout(function(){marker.setAnimation(null);},700);

            //Open current infoWindow
            this.infoWindow.open(map, marker);
        });
        return marker;
    }
    //Push observable placeMarker object into the global array that is accessible by listView
    for (var i = 0; i < places.length; i++){
        var placeMarker = ko.observable({});
        placeMarker().mapMarker = MarkerInit(places[i]);
        placeMarker().visible = ko.observable(true);
        placeMarker().contentVisible = ko.observable(true);
        placeMarker().titleContent = placeMarker().mapMarker.titleContent;
        placeMarker().content = placeMarker().mapMarker.content;
        placeMarker().wikiContent = ko.observable("");

        placeMarkers.push(placeMarker);
    }

    //Apply bindings after populating placeMarkers()[]
    ko.applyBindings(new viewModel(), view);
}

//Handle error in case Google map fails to load
function errorMap(){
    alert("Google Maps failed to load. Please check your Internet connection");
}

//ViewModel
var viewModel = function(){

    //Variables for search and list view visiblities
    self.searchVisible = ko.observable(true);
    self.listVisible = ko.observable(true);

    //Flip list visibility
    self.listReveal = function(){
        self.listVisible(!self.listVisible());
    };

    //Flip search visibility
    self.searchReveal = function(){
        self.searchVisible(!self.searchVisible());
    };

    function wikiInit(callback, index){
        this.wikiMarkup = "";

        var wikiTitle = places[i].title.replace(" ", "_");

        //URL to search Wikipedia for articles from the title, and extract the introductory sections
        var wikiURL = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles="+places[i].title;

        //AJAX call to Wiki API
        $.ajax({
            type:"GET",
            dataType:"jsonp",
            url: wikiURL,

            success: function(result){
                callback(result.query.pages[Object.keys(result.query.pages)[0]].extract, index);
            },
            //Error handling in case Wiki articles don't load
            error: function(){
                callback("Failed to retrieve info");
            }
        });
    }

    //Loop to make the AJAX call for each place
    for (var i = 0; i < places.length; i++) {
        //TODO: Carry function definition outside loop without breaking anything
        wikiInit(function (wikiString, index) {

            var wikiMarkup;

            //Check if returned string is empty and instantiate the markup string to push
            if (wikiString === "")
            {
                wikiMarkup = "<h4>Wikipedia:</h4>" + "<p>Could not find article</p>";
            }
            else {
                wikiMarkup = "<h4>Wikipedia:</h4>" + "<p class='view-text'>" + wikiString + "</p>";
            }

            //Push wiki content too placeMarkers()[]
            placeMarkers()[index]().wikiContent(wikiMarkup);
        }, i);
    }


    self.listContentReveal = function(markerObj) {

        //Flip the contentVisible property of each subsection on list
        markerObj.contentVisible(!markerObj.contentVisible());

        //Trigger the click even on the marker for the opened list item
        if (markerObj.contentVisible()) {
            //map.panTo(markerObj.mapMarker.position);
            //markerObj.mapMarker.infoWindow.open(map, markerObj.mapMarker);
            google.maps.event.trigger(markerObj.mapMarker, 'click');
        }
        else{
            //Close the infoWindow for closed list item
            markerObj.mapMarker.infoWindow.close();
        }
    };

    //Initialize variables used by the filter
    this.phraseToFilter = ko.observable("");

    this.allCategories = ko.observableArray([]); //All filterable items
    for (i in places){
        if (this.allCategories.indexOf(places[i].type) < 0) {
            this.allCategories.push(places[i].type);
        }

    }

    this.categoriesToFilter = ko.observableArray(["Food"]);// Initial selection since everyone loves food

    //Set visibility of all markers to true
    this.unfilter = function(){
        for (var i = 0; i<placeMarkers().length; i++) {
            placeMarkers()[i]().visible(true);
            placeMarkers()[i]().mapMarker.setVisible(true);
        }
    };

    this.filterByPhrase = function () {
        var markerVisibility;
        for (var i = 0; i<placeMarkers().length; i++) {
            markerVisibility = true;
            //Match titles converted t lower case with search term converted to lower case. If match is null, set markerVisiblity to false
            if (placeMarkers()[i]().mapMarker.title.toLowerCase().match(this.phraseToFilter().toLowerCase()) === null) {
                markerVisibility = false;
            }
            //Set marker visibilities using markerVisibility
            placeMarkers()[i]().visible(markerVisibility);
            placeMarkers()[i]().mapMarker.setVisible(markerVisibility);
        }
    };

    this.filterByCategories = function () {
        var markerVisibility;

        //Nested loop that goes over all selected categories and all places
        for (var i = 0; i<placeMarkers().length; i++){
            markerVisibility = false;
            for (var j in this.categoriesToFilter()){ //Turning this into a regular for loop causes an error: placeMarkers()[i] is not a function
                if (this.categoriesToFilter()[j] == placeMarkers()[i]().mapMarker.type){
                    markerVisibility = true;
                }
                else{
                    continue;
                }
            }
            //Set marker visibilities
            placeMarkers()[i]().visible(markerVisibility);
            placeMarkers()[i]().mapMarker.setVisible(markerVisibility);
        }
    };
};

