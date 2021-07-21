//Defining map as a global variable
let map;

//Defining a global drawingManager objects
let drawingManager;

function initMap(){
  //Creating a new map with the center in greater London
   map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center: {lat: 51.507, lng: 0.127 }
  });

  //Calling the method containing the polygon drawing tool
  drawPolygon();
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
    markerOptions: {
      draggable: true,
    }
  });
  drawingManager.setMap(map);
}
