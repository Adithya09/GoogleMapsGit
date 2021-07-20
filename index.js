//Defining map as a global variable
let map;

//Defining a global array to store all the markers being clicked
let markersArray = [];

//Defining a global variable for enabling polylines
let polyline = null;

//Defining a global drawingManager objects
let drawingManager;

function initMap(){
  //Creating a new map with the center in greater London
   map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center: {lat: 51.507, lng: 0.127 }
  });

  /*Adding an event listener to call the addMarker function everytime you click
    on the map
  */
  map.addListener("click", function(e) {
    console.log(e);
    addMarker(e.latLng);
    drawPolyline();
    drawPolygon();
  });
}

//Function to add draggable markers to the map
function addMarker(latLng){
  let marker = new google.maps.Marker({
    map: map,
    position: latLng,
    draggable: true
  });

  //Adding a listener to redraw the line when the position of the marker changes
  marker.addListener('position_changed', function() {
    drawPolyline();
  });

  //Storing the marker objects created on the map in the markersArray
  markersArray.push(marker);
}

//Function to enable the drawing of polylines from one marker to another
function drawPolyline(){
  let markersPositionArray = [];

  /*Looping through markersArray to get the positions of the markers added
    and storing these in markersPositionArray
  */
  markersArray.forEach(function(e){
    markersPositionArray.push(e.getPosition());
  });

  //Checking if a polyline is already drawn, and if so, removing it
  if(polyline !== null){
    polyline.setMap(null);
  }

  //Drawing a new polyline at the marker's position
  polyline = new google.maps.Polyline({
    map: map,
    path: markersPositionArray,
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 2
  });
}

//Funciton to draw polygons on the maps
function drawPolygon(){
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
  });
  drawingManager.setMap(map);
}
