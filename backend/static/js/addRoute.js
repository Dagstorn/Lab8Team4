
// define variables to reference them in different functions
let map;
let markerFrom;
let markerTo;
let directionsService;
let directionsRenderer;

// main function
function initMap() {
    // create map and render put it on page
    // default start coordinates are set to Nazarbayev University
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 51.089888409978656, lng: 71.40146902770996 },
        zoom: 15, // camera zoom
    });
    
    // initialize direction services from Google Maps API and connect to map
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        map: map,
    });

    // set maps default coordinates to form fields to ensure that they are not empty
    document.getElementById("latitudeTo").value = map.getCenter().lat();
    document.getElementById("longitudeTo").value = map.getCenter().lng();
    document.getElementById("latitudeFrom").value = map.getCenter().lat();
    document.getElementById("longitudeFrom").value = map.getCenter().lng();

    // 2 markers for departure and arrival points
    markerFrom = new google.maps.Marker({
        position: map.getCenter(), 
        map: map,
        draggable: true,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: "red",
            fillOpacity: 0.7,
            strokeColor: "blue",
            strokeWeight: 1,
            scale: 10,
            labelOrigin: new google.maps.Point(0, 2)
        },
        label: {
            text: "Departure",
            color: "blue",
            fontWeight: "bold",
            labelOrigin: new google.maps.Point(0, 10)
        },
    });

    markerTo = new google.maps.Marker({
        position: map.getCenter(),
        map: map,
        draggable: true,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: "blue",
            fillOpacity: 0.7,
            strokeColor: "blue",
            strokeWeight: 1,
            scale: 10,
            labelOrigin: new google.maps.Point(0, 2)
        },
        label: {
            text: "Arrival",
            color: "blue",
            fontWeight: "bold",
        },
    });

    // when markers positions are changed we change coordinates in corresponding form fields
    google.maps.event.addListener(markerFrom, "dragend", function () {
        document.getElementById("latitudeFrom").value = markerFrom.getPosition().lat();
        document.getElementById("longitudeFrom").value = markerFrom.getPosition().lng();
    });

    google.maps.event.addListener(markerTo, "dragend", function () {
        document.getElementById("latitudeTo").value = markerTo.getPosition().lat();
        document.getElementById("longitudeTo").value = markerTo.getPosition().lng();
        calculateAndDisplayRoute()
    });

    // add Google API's autocomplete to help to search for locations in search input fields
    // 2 fields for departure and arrival inputs 
    const inputFrom = document.getElementById("searchInputFrom");
    const inputTo = document.getElementById("searchInputTo");
    const autocompleteFrom = new google.maps.places.Autocomplete(inputFrom);
    const autocompleteTo = new google.maps.places.Autocomplete(inputTo);
    
    // when place is selected by search bar using autocomplete, we update map and corresponding marker
    autocompleteFrom.addListener("place_changed", () => {
        const place = autocompleteFrom.getPlace(); // get selected place
        // process error
        if (!place.geometry) {
            console.error("Returned place contains no geometry");
            return;
        }
        // center map on selected place
        map.setCenter(place.geometry.location);
        // set marker to that place
        markerFrom.setPosition(place.geometry.location);
        // update form fields
        document.getElementById("latitudeFrom").value = place.geometry.location.lat();
        document.getElementById("longitudeFrom").value = place.geometry.location.lng();
    });
    // same procedure for arrival point
    autocompleteTo.addListener("place_changed", () => {
        const place = autocompleteTo.getPlace();
        if (!place.geometry) {
        console.error("Returned place contains no geometry");
        return;
        }

        map.setCenter(place.geometry.location);
        markerTo.setPosition(place.geometry.location);
        document.getElementById("latitudeTo").value = place.geometry.location.lat();
        document.getElementById("longitudeTo").value = place.geometry.location.lng();

        calculateAndDisplayRoute();
    });
}

// function to calculate and display Route
function calculateAndDisplayRoute() {
    // get two points using our markers
    const start = markerFrom.getPosition();
    const end = markerTo.getPosition();
    // generate route using Google service
    directionsService.route({
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
            // process result
            if (status === google.maps.DirectionsStatus.OK) {
                directionsRenderer.setDirections(response);
            } else {
                window.alert("Directions request failed due to " + status);
            }
        }
    );
}
