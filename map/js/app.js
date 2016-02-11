//Place data

var places = [{
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

//Global variables
map;
placeMarkers = ko.observableArray([]);
placeWikis = ko.observableArray([]);


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

        function wikiInit(callback){
            this.wikiMarkup = "";

            var wikiTitle = places[i].title.replace(" ", "_");
            var wikiURL = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles="+this.title;

            $.ajax({
                type:"GET",
                dataType:"jsonp",
                async: false,
                url: wikiURL,

                success: function(result){
                    callback(result.query.pages[Object.keys(result.query.pages)[0]].extract);
                },
                error: function(){

                }
            });
        };

        wikiInit(function(wikiString){
            var wikiMarkup = "<h4>Wikipedia:</h4>" + "<p>" + wikiString + "</p>";

            marker.infoWindow.content += wikiMarkup;
        });

        function infoWindowContent(place){
            var contentString = "<h4>"+this.type+"</h4>"+
                "<p class = 'view-text'>"+this.desc+"</p>"+
                "<img class = 'view-img' src='https://maps.googleapis.com/maps/api/streetview?size=400x400&location="
                +this.cords.lat+","+this.cords.lng+"'>"+
                this.wikiContent;
            return contentString;
        }

        infoWindow = new google.maps.InfoWindow({
            content: infoWindowTitle(place) + infoWindowContent(place),
            maxWidth: 200
        });

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
            for (i in placeMarkers()){
                if(placeMarkers()[i]().mapMarker.infoWindow) {
                    placeMarkers()[i]().mapMarker.infoWindow.close();
                    placeMarkers()[i]().mapMarker.setAnimation(null);
                }

            }
            //panTo marker
            map.panTo(this.position);

            //Animate marker
            marker.setAnimation(google.maps.Animation.BOUNCE);

            //Stop animating after 0.75 seconds
            setTimeout(function(){marker.setAnimation(null);},750);

            //Open current infoWindow
            this.infoWindow.open(map, marker);
        });
        return marker;
    }
    //Push observable placeMarker object into the global array that is accessible by listView
    for (i in places){
        var placeMarker = ko.observable({});
        placeMarker().mapMarker = MarkerInit(places[i]);
        placeMarker().visible = ko.observable(true);
        placeMarker().contentVisible = ko.observable(true);
        placeMarker().titleContent = placeMarker().mapMarker.titleContent;
        placeMarker().content = placeMarker().mapMarker.content;

        placeMarkers.push(placeMarker);
    };
}

//ViewModel
var viewModel = function(){

    self.listContentReveal = function(markerObj) {
        //for (i in placeMarkers()){
        //    if(placeMarkers()[i]().mapMarker.infoWindow) {
        //       placeMarkers()[i]().mapMarker.infoWindow.close();
        //    }
        //}

        markerObj.contentVisible(!markerObj.contentVisible());

        if (markerObj.contentVisible()) {
            map.panTo(markerObj.mapMarker.position);
            markerObj.mapMarker.infoWindow.open(map, markerObj.mapMarker);
        }
        else{
            markerObj.mapMarker.infoWindow.close();
        }
    }

    this.phraseToFilter = ko.observable("");

    this.allCategories = ko.observableArray([]); //All filterable items
    for (i in places){
        if (this.allCategories.indexOf(places[i].type) < 0) {
            this.allCategories.push(places[i].type);
        }

    }

    this.categoriesToFilter = ko.observableArray(["Food"]);// Initial selection since everyone loves food

    this.filterByPhrase = function () {
        var markerVisibility;
        for (i in placeMarkers()){
            markerVisibility = true;
            if (placeMarkers()[i]().mapMarker.title.toLowerCase().match(this.phraseToFilter().toLowerCase()) == null){
                markerVisibility = false;
            };
            placeMarkers()[i]().visible(markerVisibility);
            placeMarkers()[i]().mapMarker.setVisible(markerVisibility);
        }
    };

    this.filterByCategories = function () {
        var markerVisibility;
        for (i in placeMarkers()){
            markerVisibility = false;
            for (j in this.categoriesToFilter()){
                if (this.categoriesToFilter()[j] == placeMarkers()[i]().mapMarker.type){
                    markerVisibility = true;
                }
                else{
                    continue;
                }
            }
            placeMarkers()[i]().visible(markerVisibility);
            placeMarkers()[i]().mapMarker.setVisible(markerVisibility);
        }
    }
};

ko.applyBindings(new viewModel(), view);
