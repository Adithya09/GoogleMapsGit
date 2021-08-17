//Defining map as a global variable
let map;

//Defining a global drawingManager object
let drawingManager;

//Defining a global marker object
let marker;

//Defining a global newShape
let newShape;

//Defining a shape that has been selected
let selectedShape;

//Defining an array of polygons
let polygonArray = [];

//Function to convert an object to a string
function objToString (obj) {
    var str = '';
    for (var p in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, p)) {
            str += p + '::' + obj[p] + '\n';
          }
        }
    return str;
}

//Function to generate a random code for each polygon
function makeID(){
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < 5; i++ ) {
    result += characters.charAt(Math.floor(Math.random() *
    charactersLength));
  }
  return result;
}

function initMap(){
  //Creating a new map with the center in London
   map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center: {lat: 51.507, lng: 0.127 }
  });

  //Creating a drawing manager object containing the drawing tools
  drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.MARKER,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [
        google.maps.drawing.OverlayType.MARKER,
        google.maps.drawing.OverlayType.POLYLINE,
        google.maps.drawing.OverlayType.POLYGON
      ],
    },
    markerOptions: {
      draggable: true,
      clickable: true,
    },
    polygonOptions: {
      draggable: true,
      editable: true,
      clickable: true,
    }
  });
  drawingManager.setMap(map);

  /*Adding functionality to check if a clicked point lies inside a polygon or
    outside
  */
  google.maps.event.addListener(map, "click", function(E){
 alert(E.latLng + " does not lie inside a polygon");
 });
 google.maps.event.addListener(drawingManager, "overlaycomplete", function(e){
   var coordinatesArray = e.overlay.getPath().getArray();
   coordinatesArray = makeID();
   google.maps.event.addListener(e.overlay, "click", function(event){
     console.log(event.latlng);
     if(google.maps.geometry.poly.containsLocation(event.latLng, e.overlay)){
     alert(event.latLng + " lies inside the polygon: " + coordinatesArray);
   }
 });
 });

 /*
  Calculating the distance between two points on the Map
 */
 //Adding a marker on the first set of coordinates
 const marker1 = document.getElementById("marker1").value;
 const latlngStr1 = marker1.split(",", 2);
 var lat1 = parseFloat(latlngStr1[0]);
 var lng1 = parseFloat(latlngStr1[1])
 var marker1position = new google.maps.LatLng(lat1, lng1);
 var mk1 = new google.maps.Marker({position: marker1position, map: map});

 //Adding a marker on the second set of coordinates
 const marker2 = document.getElementById("marker2").value;
 const latlngStr2 = marker2.split(",", 2);
 var lat2 = parseFloat(latlngStr2[0]);
 var lng2 = parseFloat(latlngStr2[1]);
 var marker2position = new google.maps.LatLng(lat2, lng2);
 var mk2 = new google.maps.Marker({position: marker2position, map: map});

 document.getElementById("submit").addEventListener("click", () => {
  let directionsService = new google.maps.DirectionsService();
  let directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map); // Existing map object displays directions
  // Create route from existing points used for markers
  const route = {
      origin: marker1position,
      destination: marker2position,
      travelMode: 'DRIVING'
  }

  directionsService.route(route,
    function(response, status) { // anonymous function to capture directions
      if (status !== 'OK') {
        window.alert('Directions request failed due to ' + status);
        return;
      } else {
        // Add route to the map
        directionsRenderer.setDirections(response);
        // Get data about the mapped routes
        var directionsData = response.routes[0].legs[0];
        if (!directionsData) {
          window.alert('Directions request failed');
          return;
        }
        else {
          alert(" Driving distance is " + directionsData.distance.text + " (" + directionsData.duration.text + ").")

          document.getElementById('msg').innerHTML += " Driving distance is "
          + directionsData.distance.text + " (" + directionsData.duration.text + ").";
        }
      }
    });
 });
}
