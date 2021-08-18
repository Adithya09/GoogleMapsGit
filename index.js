//Defining map as a global variable
let map;

//Defining a global drawingManager object
let drawingManager;

//Function to generate a random 5 character ID for each polygon
function makeID(){
  var result = '';
  var characters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < 5; i++ ) {
    result += characters.charAt(Math.floor(Math.random() *
    charactersLength));
  }
  return result;
}

/*
Function to calculate driving distance and duration between points manually
entered by user on the map
*/
function calcEnteredRoutes(){
  //Getting the coordinates of point A and placing a marker at these coords
  const marker1 = document.getElementById("marker1").value;
  const latlngStr1 = marker1.split(",", 2);
  var lat1 = parseFloat(latlngStr1[0]);
  var lng1 = parseFloat(latlngStr1[1])
  var marker1position = new google.maps.LatLng(lat1, lng1);
  var mk1 = new google.maps.Marker({position: marker1position, map: map});

  //Getting the coordinates of point B and placing a marker at these coords
  const marker2 = document.getElementById("marker2").value;
  const latlngStr2 = marker2.split(",", 2);
  var lat2 = parseFloat(latlngStr2[0]);
  var lng2 = parseFloat(latlngStr2[1]);
  var marker2position = new google.maps.LatLng(lat2, lng2);
  var mk2 = new google.maps.Marker({position: marker2position, map: map});

  /*
  Utilising the google maps directions API to calculate the distance from
  marker A to marker B
  */
  let directionsService = new google.maps.DirectionsService();
  let directionsRenderer = new google.maps.DirectionsRenderer();

  //Existing map object displays directions
  directionsRenderer.setMap(map);

  // Create route from existing points used for markers
  const route = {
     origin: marker1position,
     destination: marker2position,
     travelMode: 'DRIVING',
     unitSystem: google.maps.UnitSystem.IMPERIAL
   }

  //Anonymous function to capture directions
  directionsService.route(route,
   function(response, status) {
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
         document.getElementById('msg').innerHTML =
         "Driving distance: " +
         directionsData.distance.text + ", Duration: " +
         directionsData.duration.text;
       }
     }
   });
}

//Function to refresh the map
function refresh(){
  document.getElementById("marker1").value = "";
  document.getElementById("marker2").value = "";
  document.getElementById("msg").innerHTML = "";
  initMap();
}

/*
Initialising the map, centered at London with the drawing manager and route
calculation tools
*/
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

  /*
  Functionality to check if a point clicked on the map by the user lies inside
  a polygon or not
  */
  google.maps.event.addListener(map, "click", function(E){
    alert(E.latLng + " does not lie inside a polygon");
  });
  google.maps.event.addListener(drawingManager, "overlaycomplete", function(e){
    if(e.type == google.maps.drawing.OverlayType.POLYGON){
      var id = e.overlay.getPath().getArray();
      id = makeID();
      google.maps.event.addListener(e.overlay, "click", function(event){
        if(google.maps.geometry.poly.containsLocation(event.latLng, e.overlay)){
          alert(event.latLng + " lies inside the polygon: " + id);
        }
      });
    }
  });

  //Calculate routes based on user input points
  document.getElementById("submit").addEventListener("click", () => {
    calcEnteredRoutes();
  });

  //Refresh the map if the "Refresh" button is clicked
  document.getElementById("refresh").addEventListener("click", () => {
    refresh();
  });
}
